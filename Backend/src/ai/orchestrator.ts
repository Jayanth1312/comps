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
import { ChatSession } from "../models/ChatSession";

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
      model: "gemini-3-flash-preview",
      maxOutputTokens: 16384,
      apiKey: process.env.GEMINI_API_KEY,
      maxRetries: 0,
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
    userId?: string, // Optional userId for persistent storage
  ): Promise<{
    message: string;
    variants: z.infer<typeof ComponentCodeSchema>[];
  }> {
    // 1. Generate/Retrieve Title if it's a new session
    let session = await ChatSession.findOne({ chatSessionId: sessionId });
    let isNewSession = !session;

    if (isNewSession && userId) {
      let title = "New Component";
      try {
        const titlePrompt = `Generate a very short (2-4 words) descriptive title for this UI component request: "${prompt}". Respond ONLY with the title.`;
        const titleResult = await this.model.invoke(titlePrompt);
        title =
          typeof titleResult === "string"
            ? titleResult
            : (titleResult as any).content || "New Component";
      } catch (e) {
        console.error("Failed to generate title, using default:", e);
      }

      session = new ChatSession({
        userId,
        chatSessionId: sessionId,
        title: title.replace(/["']/g, "").trim(),
        messages: [],
      });
      await session.save();
    }

    // 2. Prepare user message for DB
    const userMsg = {
      role: "user" as const,
      content: prompt,
      type: "text" as const,
      images,
      timestamp: new Date(),
    };

    if (session) {
      session.messages.push(userMsg);
      await session.save();
    }

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
        // Method 1: Robust index finding (handles prefix/suffix text)
        const firstBrace = result.indexOf("{");
        const firstBracket = result.indexOf("[");
        const start =
          firstBrace !== -1 && firstBracket !== -1
            ? Math.min(firstBrace, firstBracket)
            : firstBrace !== -1
              ? firstBrace
              : firstBracket;

        const lastBrace = result.lastIndexOf("}");
        const lastBracket = result.lastIndexOf("]");
        const end = Math.max(lastBrace, lastBracket);

        if (start !== -1 && end !== -1 && end > start) {
          cleanResult = result.substring(start, end + 1);
        } else {
          // Method 2: Regex fallback
          const jsonMatch = result.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
          if (jsonMatch) {
            cleanResult = jsonMatch[0];
          } else {
            // Method 3: Simple cleanup
            cleanResult = result
              .replace(/^```json\s*/, "")
              .replace(/```$/, "")
              .trim();
          }
        }
      }

      // Pre-parsing Fix: Escape single trailing backslashes or unescaped backslashes
      // This specifically addresses "Unrecognized token \" errors
      if (typeof cleanResult === "string") {
        cleanResult = cleanResult.replace(/\\(?!"|\\|n|r|t|b|f|u)/g, "\\\\");
      }

      // If after cleaning it doesn't look like JSON, throw a more helpful error
      if (
        !cleanResult.trim().startsWith("{") &&
        !cleanResult.trim().startsWith("[")
      ) {
        throw new Error(
          `AI response does not contain a valid JSON block. Received: "${cleanResult.substring(0, 50)}..."`,
        );
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
            let repaired = cleanResult;

            // 1. Check if we are inside a string
            let insideString = false;
            let escaped = false;
            for (let i = 0; i < repaired.length; i++) {
              const char = repaired[i];
              if (char === "\\" && !escaped) {
                escaped = true;
              } else if (char === '"' && !escaped) {
                insideString = !insideString;
                escaped = false;
              } else {
                escaped = false;
              }
            }

            // If we're inside a string, we need to close it.
            // But first, if it ends with a dangling backslash, remove it
            if (insideString) {
              if (repaired.endsWith("\\") && !repaired.endsWith("\\\\")) {
                repaired = repaired.slice(0, -1);
              }
              repaired += '"';
            }

            // 2. Count open vs closed braces and brackets
            // Note: We should ideally only count those that are NOT inside strings
            // for absolute accuracy, but this is a repair attempt.
            const getCounts = (str: string) => {
              let br = 0,
                bk = 0,
                qs = false,
                es = false;
              for (let i = 0; i < str.length; i++) {
                const c = str[i];
                if (es) {
                  es = false;
                  continue;
                }
                if (c === "\\") {
                  es = true;
                  continue;
                }
                if (c === '"') {
                  qs = !qs;
                  continue;
                }
                if (!qs) {
                  if (c === "{") br++;
                  if (c === "}") br--;
                  if (c === "[") bk++;
                  if (c === "]") bk--;
                }
              }
              return { br, bk };
            };

            const counts = getCounts(repaired);

            // Close any open structures
            for (let i = 0; i < counts.br; i++) repaired += "}";
            for (let i = 0; i < counts.bk; i++) repaired += "]";

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

        // 3. Save AI message to DB
        if (session) {
          session.messages.push({
            role: "ai",
            content: finalResult.message,
            type: "code",
            codeVariants: validatedVariants,
            timestamp: new Date(),
          });
          await session.save();
        }

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
