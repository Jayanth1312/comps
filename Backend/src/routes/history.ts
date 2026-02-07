import { Hono } from "hono";
import { ChatSession } from "../models/ChatSession";
import { verifySession } from "../middleware/auth";

type Variables = {
  user: any;
};

const history = new Hono<{ Variables: Variables }>();

// Get all chat sessions for the logged-in user
history.get("/", verifySession, async (c) => {
  try {
    const user = c.get("user") as any;
    const sessions = await ChatSession.find({ userId: user._id })
      .select("chatSessionId title updatedAt")
      .sort({ updatedAt: -1 });

    return c.json(sessions);
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    return c.json({ error: "Failed to fetch chat history" }, 500);
  }
});

// Get a specific chat session by its ID
history.get("/:sessionId", verifySession, async (c) => {
  try {
    const user = c.get("user") as any;
    const sessionId = c.req.param("sessionId");

    const session = await ChatSession.findOne({
      chatSessionId: sessionId,
      userId: user._id,
    });

    if (!session) {
      return c.json({ error: "Chat session not found" }, 404);
    }

    return c.json(session);
  } catch (error) {
    console.error("Failed to fetch chat session:", error);
    return c.json({ error: "Failed to fetch chat session" }, 500);
  }
});

// Delete a chat session
history.delete("/:sessionId", verifySession, async (c) => {
  try {
    const user = c.get("user") as any;
    const sessionId = c.req.param("sessionId");

    const result = await ChatSession.deleteOne({
      chatSessionId: sessionId,
      userId: user._id,
    });

    if (result.deletedCount === 0) {
      return c.json({ error: "Chat session not found or unauthorized" }, 404);
    }

    return c.json({ message: "Chat session deleted successfully" });
  } catch (error) {
    console.error("Failed to delete chat session:", error);
    return c.json({ error: "Failed to delete chat session" }, 500);
  }
});

export default history;
