"use client";

import React from "react";
import { ComponentInfo } from "@/types/component-data";
import { Heart, Like, Dislike } from "@solar-icons/react";
import { ComponentSkeleton } from "./component-skeletons";
import { useSortContext } from "@/contexts/sort-context";
import BaseCard from "./base-card";

interface ComponentCardProps {
  component: ComponentInfo;
  className?: string;
}

import { cn } from "@/lib/utils";

export default function ComponentCard({
  component,
  className = "",
}: ComponentCardProps) {
  const { componentStats, toggleFavorite, incrementLikes, decrementLikes } =
    useSortContext();

  const isFavorite = componentStats[component.slug]?.isFavorite || false;
  const likes = componentStats[component.slug]?.likes || 0;
  const [vote, setVote] = React.useState<"up" | "down" | null>(null);

  const isSmall = component.cols <= 4 && component.rows <= 2;

  const handleVoteUp = () => {
    if (vote === "up") {
      decrementLikes(component.slug);
      setVote(null);
    } else {
      if (vote === "down") {
        incrementLikes(component.slug);
      }
      incrementLikes(component.slug);
      setVote("up");
    }
  };

  const handleVoteDown = () => {
    if (vote === "down") {
      incrementLikes(component.slug);
      setVote(null);
    } else {
      if (vote === "up") {
        decrementLikes(component.slug);
      }
      decrementLikes(component.slug);
      setVote("down");
    }
  };

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

  // Bottom-right slot: Like/Dislike buttons
  const voteButtons = (
    <div className="vote-group overflow-hidden rounded-lg shrink-0">
      <button
        className={`action-button vote-button border-none rounded-none ${vote === "up" ? "text-primary bg-primary/5" : ""}`}
        aria-label="Like"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleVoteUp();
        }}
      >
        <div className="flex items-center gap-1">
          <Like
            size={16}
            weight={vote === "up" ? "BoldDuotone" : "LineDuotone"}
          />
          <span className="text-xs font-medium tabular-nums">{likes}</span>
        </div>
      </button>

      <div className="w-px h-9 bg-border shrink-0" />

      <button
        className={`action-button vote-button border-none rounded-none ${vote === "down" ? "text-foreground bg-foreground/5" : ""}`}
        aria-label="Dislike"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleVoteDown();
        }}
      >
        <div className="flex items-center gap-1">
          <Dislike
            size={16}
            weight={vote === "down" ? "BoldDuotone" : "LineDuotone"}
          />
        </div>
      </button>
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
