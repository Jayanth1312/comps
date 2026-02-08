import { Context } from "hono";
import Favorite from "../models/Favorite";
import { IUser } from "../models/User";

export const toggleFavorite = async (c: Context) => {
  try {
    const user = c.get("user") as IUser;
    const { targetId } = await c.req.json();

    if (!targetId) {
      return c.json({ error: "Invalid targetId" }, 400);
    }

    const existing = await Favorite.findOne({
      userEmail: user.email,
      targetId,
    });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return c.json({ message: "Removed from favorites", isFavorite: false });
    } else {
      await Favorite.create({ userEmail: user.email, targetId });
      return c.json({ message: "Added to favorites", isFavorite: true });
    }
  } catch (error: any) {
    console.error("Toggle favorite error:", error);
    return c.json({ error: "Failed to toggle favorite" }, 500);
  }
};

export const getUserFavorites = async (c: Context) => {
  try {
    const user = c.get("user") as IUser;
    const favorites = await Favorite.find({ userEmail: user.email });
    return c.json({ favorites: favorites.map((f) => f.targetId) });
  } catch (error: any) {
    console.error("Get user favorites error:", error);
    return c.json({ error: "Failed to fetch favorites" }, 500);
  }
};
