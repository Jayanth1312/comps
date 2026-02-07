import { Hono } from "hono";
import { signup, login } from "../controllers/authController";

const authRoute = new Hono();

authRoute.post("/signup", signup);
authRoute.post("/login", login);

export { authRoute };
