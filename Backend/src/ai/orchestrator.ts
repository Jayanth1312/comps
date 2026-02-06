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
import { shadcnClient } from "../mcp/client";

const ComponentCodeSchema = z.object({
  library: z.string(),
  code: z.string(),
});

const ResponseSchema = z.array(ComponentCodeSchema);

export class GeminiOrchestrator {
  private model: any;
  private messageHistories: Record<string, InMemoryChatMessageHistory>;

  constructor() {
    this.model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      maxOutputTokens: 8192,
      apiKey: process.env.GEMINI_API_KEY,
      // @ts-ignore
      modelKwargs: {
        responseMimeType: "application/json",
      },
    });
    this.messageHistories = {};

    // Initialize MCP connection
    this.initMcp();
  }

  private async initMcp() {
    try {
      await shadcnClient.connect();
      const tools = await shadcnClient.getLangChainTools();
      if (tools.length > 0) {
        console.log(`Binding ${tools.length} MCP tools to Gemini model`);
        this.model = this.model.bindTools(tools);
      }
    } catch (error) {
      console.error("Failed to initialize MCP client:", error);
    }
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

      console.log(
        `[Orchestrator] Raw model response for session ${sessionId}:`,
        result,
      );

      // Clean the result if it includes markdown code blocks
      let cleanResult = result;
      if (typeof result === "string") {
        cleanResult = result
          .replace(/^```json\s*/, "")
          .replace(/```$/, "")
          .trim();
      }

      console.log(
        `[Orchestrator] Cleaned JSON candidate:`,
        cleanResult.substring(0, 200) + "...",
      );

      // Validate and parse JSON
      try {
        let parsed = JSON.parse(cleanResult);

        if (
          !Array.isArray(parsed) &&
          typeof parsed === "object" &&
          parsed !== null
        ) {
          console.log(
            "[Orchestrator] AI returned a single object. Wrapping in array.",
          );
          parsed = [parsed];
        }

        const validated = ResponseSchema.parse(parsed);
        return validated;
      } catch (e: any) {
        console.error("Failed to parse or validate JSON.");
        if (e && e.issues) {
          console.error(
            "Zod Validation Errors:",
            JSON.stringify(e.issues, null, 2),
          );
        } else {
          console.error("Error details:", e);
        }
        console.error("Result that failed parsing:", cleanResult);
        throw new Error(
          `Failed to generate valid JSON response from AI: ${e.message || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error in GeminiOrchestrator:", error);
      throw error;
    }
  }
}

export const orchestrator = new GeminiOrchestrator();
