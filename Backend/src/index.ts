import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { generateRoute } from "./routes/generate";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
  return c.text("AI Component Generator Backend is Running!");
});

app.route("/api/generate", generateRoute);

const port = parseInt(process.env.PORT || "3001");
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
