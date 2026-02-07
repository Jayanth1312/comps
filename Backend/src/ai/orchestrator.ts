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

const ResponseObjectSchema = z.object({
  message: z.string().optional(),
  variants: z.array(ComponentCodeSchema),
});

// Union type to handle both new object format and legacy array format
const ResponseSchema = z.union([
  ResponseObjectSchema,
  z.array(ComponentCodeSchema),
]);

export class GeminiOrchestrator {
  private messageHistories: Record<string, InMemoryChatMessageHistory>;
  private model: any;

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

  async generateComponent(
    prompt: string,
    sessionId: string,
    images?: string[], // Base64 strings or URLs
  ): Promise<{
    message: string;
    variants: z.infer<typeof ComponentCodeSchema>[];
  }> {
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
      // Create multimodal input if images are provided
      let input: any = prompt;
      if (images && images.length > 0) {
        input = [
          { type: "text", text: prompt },
          ...images.map((img) => ({
            type: "image_url",
            image_url: img,
          })),
        ];
      }

      const result = await withHistory.invoke(
        { input },
        { configurable: { sessionId } },
      );

      console.log(
        `[Orchestrator] Raw model response for session ${sessionId}:`,
        result,
      );

      // Clean the result if it includes markdown code blocks
      let cleanResult = result;
      if (typeof result === "string") {
        // Try to find the JSON array or object within the string
        const jsonMatch = result.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanResult = jsonMatch[0];
        } else {
          // Fallback cleanup if no clear JSON structure is found
          cleanResult = result
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim();
        }
      }

      console.log(
        `[Orchestrator] Cleaned JSON candidate:`,
        cleanResult.substring(0, 200) + "...",
      );

      try {
        // Try to repair truncated JSON if standard parse fails
        let parsed;
        try {
          // Standard parse
          parsed = JSON.parse(cleanResult);
        } catch (initialErr) {
          console.log(
            "[Orchestrator] Parse failed, attempting truncation repair...",
          );
          try {
            // Very basic truncation repair: find where it was cut off and close the JSON
            let repaired = cleanResult;

            // If it ends in the middle of a string, close the string
            const quoteCount = (repaired.match(/"/g) || []).length;
            if (quoteCount % 2 !== 0) {
              repaired += '"}';
            }

            // Count open vs closed braces and brackets
            const openBraces = (repaired.match(/{/g) || []).length;
            const closeBraces = (repaired.match(/}/g) || []).length;
            const openBrackets = (repaired.match(/\[/g) || []).length;
            const closeBrackets = (repaired.match(/\]/g) || []).length;

            for (let i = 0; i < openBraces - closeBraces; i++) repaired += "}";
            for (let i = 0; i < openBrackets - closeBrackets; i++)
              repaired += "]";

            parsed = JSON.parse(repaired);
            console.log("[Orchestrator] Successfully repaired truncated JSON");
          } catch (repairErr) {
            // If repair fails, try sanitization
            console.log(
              "[Orchestrator] Repair failed, attempting sanitization...",
            );
            let sanitized = cleanResult.replace(/\\'/g, "'");
            parsed = JSON.parse(sanitized);
          }
        }

        // Normalize the parsed result
        let finalResult = {
          message: "",
          variants: [] as any[],
        };

        if (Array.isArray(parsed)) {
          // Legacy array format
          finalResult.variants = parsed;
          finalResult.message = `Here are ${parsed.length} implementation${parsed.length !== 1 ? "s" : ""} for your request.`;
        } else if (parsed && typeof parsed === "object") {
          if ("variants" in parsed && Array.isArray(parsed.variants)) {
            // New object format
            finalResult.message =
              parsed.message ||
              `Here are ${parsed.variants.length} implementation${parsed.variants.length !== 1 ? "s" : ""} for your request.`;
            finalResult.variants = parsed.variants;
          } else if ("code" in parsed && "library" in parsed) {
            // Single code object (legacy fallback)
            finalResult.variants = [parsed as any];
            finalResult.message = "Here is the component you requested.";
          }
        }

        // Validate variants
        const validatedVariants = z
          .array(ComponentCodeSchema)
          .parse(finalResult.variants);

        return {
          message: finalResult.message,
          variants: validatedVariants,
        };
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
