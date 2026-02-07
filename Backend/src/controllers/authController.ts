import type { Context } from "hono";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import Session from "../models/Session";

export const signup = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    // Salt is automatically generated and included in the hash by bcryptjs
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      passwordHash,
    });

    await newUser.save();

    return c.json({ message: "User created successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const sessionId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days

    const newSession = new Session({
      sessionId,
      userId: user._id,
      expiresAt,
    });

    await newSession.save();

    // In a real app, you'd set an httpOnly cookie here.
    // For this implementation, we'll return it and the frontend can manage it.
    return c.json({
      message: "Login successful",
      sessionId,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
