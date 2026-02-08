"use client";

import React from "react";
import { ComponentInfo } from "@/types/component-data";
import { Heart, Like, Dislike } from "@solar-icons/react";
import { ComponentSkeleton } from "./component-skeletons";
import { useSortContext } from "@/contexts/sort-context";
import BaseCard from "./base-card";
import { cn } from "@/lib/utils";

interface ComponentCardProps {
  component: ComponentInfo;
  className?: string;
}

export default function ComponentCard({
  component,
  className = "",
}: ComponentCardProps) {
  const { componentStats, toggleFavorite } = useSortContext();

  const isFavorite = componentStats[component.slug]?.isFavorite || false;
  const likes = componentStats[component.slug]?.likes || 0;

  const isSmall = component.cols <= 4 && component.rows <= 2;

  // Top-right slot: Favorite button
  const favoriteButton = (
    <button
      className={`action-button favorite-button backdrop-blur-sm bg-background/80 transition-all duration-300 shadow-lg ${
        isFavorite
          ? "active opacity-100"
          : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
      }`}
      aria-label="Add to favorites"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(component.slug);
      }}
    >
      <Heart size={16} weight={isFavorite ? "Bold" : "Outline"} />
    </button>
  );

  // Center slot: Component skeleton
  const skeleton = (
    <ComponentSkeleton
      slug={component.slug}
      className="w-full h-full max-h-full py-14"
    />
  );

  // Bottom-left slot: Component title (no Link wrapper - card itself is clickable)
  const title = (
    <h3 className={`card-title truncate ${isSmall ? "text-sm" : "text-base"}`}>
      {component.name}
    </h3>
  );

  const hasLiked = componentStats[component.slug]?.hasLiked || false;
  const hasDisliked = componentStats[component.slug]?.hasDisliked || false;

  // Bottom-right slot: Like/Dislike (Read-only on Explore)
  const voteButtons = (
    <div className="vote-group overflow-hidden rounded-lg shrink-0 flex items-center border border-border bg-background/50">
      <div
        className={`action-button vote-button border-none rounded-none cursor-default px-2.5 py-1.5 ${
          hasLiked
            ? "text-primary bg-primary/10"
            : "text-muted-foreground opacity-70"
        }`}
        title="Total likes"
      >
        <div className="flex items-center gap-1">
          <Like size={16} weight={hasLiked ? "BoldDuotone" : "LineDuotone"} />
          <span className="text-xs font-medium tabular-nums">{likes}</span>
        </div>
      </div>

      <div className="w-px h-6 bg-border shrink-0" />

      <div
        className={`action-button vote-button border-none rounded-none cursor-default px-2.5 py-1.5 ${
          hasDisliked
            ? "text-foreground bg-foreground/10"
            : "text-muted-foreground opacity-70"
        }`}
        title="Total dislikes"
      >
        <div className="flex items-center gap-1">
          <Dislike
            size={16}
            weight={hasDisliked ? "BoldDuotone" : "LineDuotone"}
          />
        </div>
      </div>
    </div>
  );

  return (
    <BaseCard
      topRightSlot={favoriteButton}
      centerSlot={skeleton}
      bottomLeftSlot={title}
      bottomRightSlot={voteButtons}
      className={cn("h-[280px] md:h-full", className)}
      href={`/compare/${component.slug}`}
    />
  );
}
