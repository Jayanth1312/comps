import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { generateRoute } from "./routes/generate";
import { authRoute } from "./routes/auth";
import historyRoute from "./routes/history";
import { connectDB } from "./db/mongodb";
import interactionRoute from "./routes/interactions";
import favoriteRoute from "./routes/favorites";

const app = new Hono();

// Connect to MongoDB
connectDB();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
  return c.text("AI Component Generator Backend is Running!");
});

app.route("/api/generate", generateRoute);
app.route("/api/auth", authRoute);
app.route("/api/history", historyRoute);
app.route("/api/interactions", interactionRoute);
app.route("/api/favorites", favoriteRoute);

import aiEditRoute from "./routes/aiEdit";
app.route("/api/ai", aiEditRoute);

const port = parseInt(process.env.PORT || "3001");
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
