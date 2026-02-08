import { Hono } from "hono";
import {
  toggleFavorite,
  getUserFavorites,
} from "../controllers/favoriteController";
import { verifySession } from "../middleware/auth";

const favoriteRoute = new Hono();

// All favorite routes require session
favoriteRoute.use("*", verifySession);

favoriteRoute.get("/", getUserFavorites);
favoriteRoute.post("/toggle", toggleFavorite);

export default favoriteRoute;
