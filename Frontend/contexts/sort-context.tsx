"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { ComponentSlug, COMPONENTS } from "@/types/component-data";
import { useAuth } from "./AuthContext";

export type SortOption = "a-z" | "z-a" | "popularity" | "favorites";

interface ComponentStats {
  likes: number;
  dislikes: number;
  isFavorite: boolean;
  hasLiked: boolean;
  hasDisliked: boolean;
  libraryStats: Record<string, { type: "up" | "down" | null }>;
}

interface SortContextType {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  componentStats: Record<ComponentSlug, ComponentStats>;
  toggleFavorite: (slug: ComponentSlug) => Promise<void>;
  toggleLike: (slug: ComponentSlug, library: string) => Promise<void>;
  toggleDislike: (slug: ComponentSlug, library: string) => Promise<void>;
  refreshStats: () => Promise<void>;
}

const SortContext = createContext<SortContextType | undefined>(undefined);

const API_BASE = "http://localhost:3001/api";

export function SortProvider({ children }: { children: ReactNode }) {
  const [sortBy, setSortBy] = useState<SortOption>("a-z");
  const [componentStats, setComponentStats] = useState<
    Record<ComponentSlug, ComponentStats>
  >({} as Record<ComponentSlug, ComponentStats>);
  const { sessionId } = useAuth();

  // Load from local storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("component_stats");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setComponentStats(parsed);
        } catch (e) {
          console.error("Failed to parse local stats", e);
        }
      }
    }
  }, []);

  // Save to local storage whenever stats change
  useEffect(() => {
    if (Object.keys(componentStats).length > 0) {
      localStorage.setItem("component_stats", JSON.stringify(componentStats));
    }
  }, [componentStats]);

  // Helper to transform API stats to frontend format
  const transformStats = useCallback((apiStats: any) => {
    const newStats: Record<string, ComponentStats> = {};
    Object.entries(apiStats).forEach(([slug, s]: [string, any]) => {
      newStats[slug as ComponentSlug] = {
        likes: s.likes || 0,
        dislikes: s.dislikes || 0,
        isFavorite: s.isFavorite || false,
        hasLiked: s.hasLiked || false,
        hasDisliked: s.hasDisliked || false,
        libraryStats: Object.entries(s.libraryStats || {}).reduce(
          (acc, [lib, stat]: [string, any]) => {
            acc[lib] = {
              type:
                stat.type === "like"
                  ? "up"
                  : stat.type === "dislike"
                    ? "down"
                    : null,
            };
            return acc;
          },
          {} as Record<string, any>,
        ),
      };
    });
    return newStats;
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const slugs = COMPONENTS.map((c) => c.slug).join(",");
      const url = new URL(`${API_BASE}/interactions/stats`);
      url.searchParams.append("slugs", slugs);

      const headers: Record<string, string> = {};
      if (sessionId) {
        headers["Authorization"] = `Bearer ${sessionId}`;
      }

      const res = await fetch(url.toString(), { headers });
      const data = await res.json();

      if (data.stats) {
        setComponentStats((prev) => ({
          ...prev,
          ...transformStats(data.stats),
        }));
      }
    } catch (error) {
      console.error("Failed to fetch component stats:", error);
    }
  }, [sessionId, transformStats]);

  // Initial fetch on mount (after local load)
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const toggleLike = async (slug: ComponentSlug, library: string) => {
    if (!sessionId) return;

    const prevStats = JSON.parse(JSON.stringify(componentStats));
    const currentLibStat =
      componentStats[slug]?.libraryStats?.[library]?.type || null;
    const newType = currentLibStat === "up" ? null : "up";

    setComponentStats((prev) => {
      const next = { ...prev };
      const comp = {
        ...(next[slug] || {
          likes: 0,
          dislikes: 0,
          isFavorite: false,
          hasLiked: false,
          hasDisliked: false,
          libraryStats: {},
        }),
      };

      const lib = { ...(comp.libraryStats[library] || { type: null }) };

      if (lib.type === "up") comp.likes--;
      if (lib.type === "down") comp.dislikes--;

      lib.type = newType;
      if (newType === "up") comp.likes++;

      comp.libraryStats = { ...comp.libraryStats, [library]: lib };
      comp.hasLiked = Object.values(comp.libraryStats).some(
        (l: any) => l.type === "up",
      );
      comp.hasDisliked = Object.values(comp.libraryStats).some(
        (l: any) => l.type === "down",
      );

      next[slug] = comp;
      return next;
    });

    try {
      const res = await fetch(`${API_BASE}/interactions/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          componentSlug: slug,
          libraryName: library,
          type: "like",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setComponentStats((prev) => ({
            ...prev,
            ...transformStats(data.stats),
          }));
        }
      } else {
        setComponentStats(prevStats);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setComponentStats(prevStats);
    }
  };

  const toggleDislike = async (slug: ComponentSlug, library: string) => {
    if (!sessionId) return;

    const prevStats = JSON.parse(JSON.stringify(componentStats));
    const currentLibStat =
      componentStats[slug]?.libraryStats?.[library]?.type || null;
    const newType = currentLibStat === "down" ? null : "down";

    setComponentStats((prev) => {
      const next = { ...prev };
      const comp = {
        ...(next[slug] || {
          likes: 0,
          dislikes: 0,
          isFavorite: false,
          hasLiked: false,
          hasDisliked: false,
          libraryStats: {},
        }),
      };

      const lib = { ...(comp.libraryStats[library] || { type: null }) };

      if (lib.type === "up") comp.likes--;
      if (lib.type === "down") comp.dislikes--;

      lib.type = newType;
      if (newType === "down") comp.dislikes++;

      comp.libraryStats = { ...comp.libraryStats, [library]: lib };
      comp.hasLiked = Object.values(comp.libraryStats).some(
        (l: any) => l.type === "up",
      );
      comp.hasDisliked = Object.values(comp.libraryStats).some(
        (l: any) => l.type === "down",
      );

      next[slug] = comp;
      return next;
    });

    try {
      const res = await fetch(`${API_BASE}/interactions/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          componentSlug: slug,
          libraryName: library,
          type: "dislike",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setComponentStats((prev) => ({
            ...prev,
            ...transformStats(data.stats),
          }));
        }
      } else {
        setComponentStats(prevStats);
      }
    } catch (error) {
      console.error("Failed to toggle dislike:", error);
      setComponentStats(prevStats);
    }
  };

  const toggleFavorite = async (slug: ComponentSlug) => {
    if (!sessionId) return;

    const prevStats = JSON.parse(JSON.stringify(componentStats));
    setComponentStats((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next[slug]) {
        next[slug].isFavorite = !next[slug].isFavorite;
      }
      return next;
    });

    try {
      const res = await fetch(`${API_BASE}/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({ targetId: slug }),
      });
      if (!res.ok) {
        setComponentStats(prevStats);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      setComponentStats(prevStats);
    }
  };

  return (
    <SortContext.Provider
      value={{
        sortBy,
        setSortBy,
        componentStats,
        toggleFavorite,
        toggleLike,
        toggleDislike,
        refreshStats,
      }}
    >
      {children}
    </SortContext.Provider>
  );
}

export function useSortContext() {
  const context = useContext(SortContext);
  if (context === undefined) {
    throw new Error("useSortContext must be used within a SortProvider");
  }
  return context;
}
