import { Hono } from "hono";
import {
  toggleInteraction,
  getComponentStats,
} from "../controllers/interactionController";
import { verifySession, optionalVerifySession } from "../middleware/auth";

const interactionRoute = new Hono();

// Optional auth for stats (to show user's own state), but counts are public
interactionRoute.get("/stats", optionalVerifySession, getComponentStats);

// Required auth for toggling
interactionRoute.post("/toggle", verifySession, toggleInteraction);

export default interactionRoute;
