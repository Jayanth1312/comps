import type { Context } from "hono";
import Interaction from "../models/Interaction";
import Favorite from "../models/Favorite";
import type { IUser } from "../models/User";

// Helper to get stats for a single component
const fetchComponentStats = async (slug: string, user?: IUser) => {
  // Aggregate likes for this component slug across ALL libraries
  // Using countDocuments is faster/more consistent for simple counts than aggregate
  const likes = await Interaction.countDocuments({
    componentSlug: slug,
    type: "like",
  });
  const dislikes = await Interaction.countDocuments({
    componentSlug: slug,
    type: "dislike",
  });

  const counts = {
    likes,
    dislikes,
  };

  // Get user's specific interactions and favorites
  let userStatus = { isFavorite: false };
  if (user) {
    const userFav = await Favorite.findOne({
      userEmail: user.email,
      targetId: slug,
    });
    userStatus = {
      isFavorite: !!userFav,
    };
  }

  // Get library specific states and flags
  const libraryStats: Record<string, any> = {};
  let hasLiked = false;
  let hasDisliked = false;

  if (user) {
    const libInteractions = await Interaction.find({
      userEmail: user.email,
      componentSlug: slug,
    });

    libInteractions.forEach((inter) => {
      if (inter.libraryName) {
        libraryStats[inter.libraryName] = { type: inter.type };
      }
      if (inter.type === "like") hasLiked = true;
      if (inter.type === "dislike") hasDisliked = true;
    });
  }

  return {
    ...counts,
    ...userStatus,
    hasLiked,
    hasDisliked,
    libraryStats,
  };
};

export const toggleInteraction = async (c: Context) => {
  try {
    const user = c.get("user") as IUser;
    const { componentSlug, libraryName, type } = await c.req.json();

    if (!componentSlug || !libraryName || !["like", "dislike"].includes(type)) {
      return c.json(
        { error: "Invalid componentSlug, libraryName or type" },
        400,
      );
    }

    const query = {
      userEmail: user.email,
      componentSlug,
      libraryName,
    };

    const existing = await Interaction.findOne(query);

    if (existing) {
      if (existing.type === type) {
        await Interaction.deleteOne({ _id: existing._id });
      } else {
        existing.type = type;
        await existing.save();
      }
    } else {
      await Interaction.create({
        ...query,
        type,
      });
    }

    await new Promise((r) => setTimeout(r, 100));
    const stats = await fetchComponentStats(componentSlug, user);
    return c.json({
      message: "Success",
      stats: { [componentSlug]: stats },
    });
  } catch (error: any) {
    console.error("Toggle interaction error:", error);
    return c.json({ error: "Failed to toggle interaction" }, 500);
  }
};

export const getComponentStats = async (c: Context) => {
  try {
    const user = c.get("user") as IUser | undefined;
    const slugsStr = c.req.query("slugs");
    const slugs = slugsStr ? slugsStr.split(",") : [];

    if (slugs.length === 0) {
      return c.json({ stats: {} });
    }

    const results: Record<string, any> = {};

    for (const slug of slugs) {
      results[slug] = await fetchComponentStats(slug, user);
    }

    return c.json({ stats: results });
  } catch (error: any) {
    console.error("Get component stats error:", error);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
};
