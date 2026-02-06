import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export class ShadcnMcpClient {
  private client: Client;
  private transport: StdioClientTransport;

  constructor() {
    this.transport = new StdioClientTransport({
      command: "bun",
      args: ["x", "@heilgar/shadcn-ui-mcp-server"],
    });

    this.client = new Client(
      {
        name: "shadcn-client",
        version: "1.0.0",
      },
      {
        capabilities: {
          // tools: {}, // Client doesn't provide tools, it consumes them.
        },
      },
    );
  }

  async connect() {
    await this.client.connect(this.transport);
    console.log("Connected to Shadcn MCP server");
  }

  async disconnect() {
    await this.client.close();
  }

  async getLangChainTools(): Promise<StructuredTool[]> {
    const toolsList = await this.client.listTools();

    const ALLOWED_TOOLS = ["list-components", "get-component-docs"];
    const tools = toolsList.tools.filter((t) => ALLOWED_TOOLS.includes(t.name));

    return tools.map((tool) => {
      return new DynamicMcpTool({
        name: tool.name,
        description: tool.description || "",
        schema: z.object({ input: z.string().optional() }),
        func: async (input: any) => {
          console.log(`[MCP] Calling tool: ${tool.name}`);
          console.log(`[MCP] Tool input:`, JSON.stringify(input, null, 2));
          try {
            const result = await this.client.callTool({
              name: tool.name,
              arguments: input,
            });

            // Type assertion for result content
            const content = result.content as { type: string; text: string }[];

            const textContent = content
              .filter((c) => c.type === "text")
              .map((c) => c.text)
              .join("\n");

            console.log(
              `[MCP] Tool ${tool.name} success. Output length: ${textContent.length}`,
            );
            return textContent;
          } catch (error: any) {
            console.error(`[MCP] Tool ${tool.name} failed:`, error);
            return `Error calling tool ${tool.name}: ${error.message}`;
          }
        },
      });
    });
  }
}

// Helper class for dynamic tool creation

class DynamicMcpTool extends StructuredTool {
  name: string;
  description: string;
  schema: z.ZodType<any>;
  func: (input: any) => Promise<string>;

  constructor(fields: {
    name: string;
    description: string;
    schema: z.ZodType<any>;
    func: (input: any) => Promise<string>;
  }) {
    super();
    this.name = fields.name;
    this.description = fields.description;
    this.schema = fields.schema;
    this.func = fields.func;
  }

  async _call(arg: any): Promise<string> {
    return this.func(arg);
  }
}

export const shadcnClient = new ShadcnMcpClient();
