import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { SYSTEM_PROMPT } from "./prompts";
import { z } from "zod";

// Define the response schema for validation
const ComponentCodeSchema = z.object({
  library: z.string(),
  code: z.string(),
});

const ResponseSchema = z.array(ComponentCodeSchema);

export class GeminiOrchestrator {
  private model: ChatGoogleGenerativeAI;
  private messageHistories: Record<string, InMemoryChatMessageHistory>;

  constructor() {
    this.model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      maxOutputTokens: 8192,
      apiKey: process.env.GEMINI_API_KEY,
    });
    this.messageHistories = {};
  }

  private getMessageHistoryForSession(
    sessionId: string,
  ): InMemoryChatMessageHistory {
    if (!this.messageHistories[sessionId]) {
      this.messageHistories[sessionId] = new InMemoryChatMessageHistory();
    }
    return this.messageHistories[sessionId];
  }

  async generateComponent(prompt: string, sessionId: string) {
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_PROMPT],
      new MessagesPlaceholder("history"),
      ["human", "{input}"],
    ]);

    const chain = promptTemplate
      .pipe(this.model)
      .pipe(new StringOutputParser());

    const withHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: (sessionId) =>
        this.getMessageHistoryForSession(sessionId),
      inputMessagesKey: "input",
      historyMessagesKey: "history",
    });

    try {
      const result = await withHistory.invoke(
        { input: prompt },
        { configurable: { sessionId } },
      );

      // Clean the result if it includes markdown code blocks (despite instructions)
      let cleanResult = result;
      if (typeof result === "string") {
        cleanResult = result
          .replace(/^```json\s*/, "")
          .replace(/```$/, "")
          .trim();
      }

      // Validate and parse JSON
      try {
        const parsed = JSON.parse(cleanResult);
        const validated = ResponseSchema.parse(parsed);
        return validated;
      } catch (e) {
        console.error("Failed to parse or validate JSON:", e);
        console.error("Raw result:", result);
        throw new Error("Failed to generate valid JSON response from AI");
      }
    } catch (error) {
      console.error("Error in GeminiOrchestrator:", error);
      throw error;
    }
  }
}

export const orchestrator = new GeminiOrchestrator();
