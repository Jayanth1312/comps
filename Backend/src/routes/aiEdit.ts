import { Hono } from "hono";
import { editComponent } from "../controllers/aiController";

const aiEditRoute = new Hono();

aiEditRoute.post("/edit", editComponent);

export default aiEditRoute;
