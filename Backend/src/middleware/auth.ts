import type { Context, Next } from "hono";
import Session from "../models/Session";
import User from "../models/User";

export const verifySession = async (c: Context, next: Next) => {
  try {
    const sessionId = c.req.header("Authorization")?.replace("Bearer ", "");

    if (!sessionId) {
      return c.json({ error: "Session ID is required" }, 401);
    }

    const session = await Session.findOne({ sessionId });

    if (!session) {
      return c.json({ error: "Invalid session" }, 401);
    }

    if (new Date() > session.expiresAt) {
      await Session.deleteOne({ sessionId });
      return c.json({ error: "Session expired" }, 401);
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return c.json({ error: "User not found" }, 401);
    }

    // Set user in context for downstream handlers
    c.set("user", user);

    await next();
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    return c.json({ error: "Authentication failed" }, 500);
  }
};
export const optionalVerifySession = async (c: Context, next: Next) => {
  try {
    const sessionId = c.req.header("Authorization")?.replace("Bearer ", "");

    if (sessionId) {
      const session = await Session.findOne({ sessionId });
      if (session && new Date() <= session.expiresAt) {
        const user = await User.findById(session.userId);
        if (user) {
          c.set("user", user);
        }
      }
    }
    await next();
  } catch (error: any) {
    // Just proceed without user for optional
    await next();
  }
};
