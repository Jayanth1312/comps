"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ComponentSlug } from "@/types/component-data";

export type SortOption = "a-z" | "z-a" | "popularity" | "favorites";

interface ComponentStats {
  likes: number;
  isFavorite: boolean;
}

interface SortContextType {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  componentStats: Record<ComponentSlug, ComponentStats>;
  toggleFavorite: (slug: ComponentSlug) => void;
  incrementLikes: (slug: ComponentSlug) => void;
  decrementLikes: (slug: ComponentSlug) => void;
}

const SortContext = createContext<SortContextType | undefined>(undefined);

export function SortProvider({ children }: { children: ReactNode }) {
  const [sortBy, setSortBy] = useState<SortOption>("a-z");
  const [componentStats, setComponentStats] = useState<
    Record<ComponentSlug, ComponentStats>
  >({} as Record<ComponentSlug, ComponentStats>);

  const toggleFavorite = (slug: ComponentSlug) => {
    setComponentStats((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        likes: prev[slug]?.likes || 0,
        isFavorite: !prev[slug]?.isFavorite,
      },
    }));
  };

  const incrementLikes = (slug: ComponentSlug) => {
    setComponentStats((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        likes: (prev[slug]?.likes || 0) + 1,
        isFavorite: prev[slug]?.isFavorite || false,
      },
    }));
  };

  const decrementLikes = (slug: ComponentSlug) => {
    setComponentStats((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        likes: Math.max(0, (prev[slug]?.likes || 0) - 1),
        isFavorite: prev[slug]?.isFavorite || false,
      },
    }));
  };

  return (
    <SortContext.Provider
      value={{
        sortBy,
        setSortBy,
        componentStats,
        toggleFavorite,
        incrementLikes,
        decrementLikes,
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
