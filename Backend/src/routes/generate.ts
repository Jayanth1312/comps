import { Hono } from "hono";
import { orchestrator } from "../ai/orchestrator";

const generateRoute = new Hono();

generateRoute.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { prompt, sessionId, images } = body;

    if (!prompt) {
      return c.json({ error: "Prompt is required" }, 400);
    }

    // Default session ID if not provided
    const sid = sessionId || "default-session";

    const result = await orchestrator.generateComponent(prompt, sid, images);

    return c.json(result);
  } catch (error) {
    console.error("Generation error:", error);
    return c.json({ error: "Failed to generate components" }, 500);
  }
});

export { generateRoute };
