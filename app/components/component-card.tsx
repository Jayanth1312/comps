"use client";

import React, { useState, useMemo } from "react";
import { ComponentInfo } from "@/types/component-data";
import { Heart, Like, Dislike } from "@solar-icons/react";
import Link from "next/link";
import { ComponentSkeleton } from "./component-skeletons";

interface ComponentCardProps {
  component: ComponentInfo;
  className?: string; // Allow custom classes
}

export default function ComponentCard({
  component,
  className = "",
}: ComponentCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  const isSmall = component.cols <= 4 && component.rows <= 2;

  const likes = useMemo(() => (vote === "up" ? 1 : 0), [vote]);
  const dislikes = useMemo(() => (vote === "down" ? 1 : 0), [vote]);

  return (
    <div className={`component-card relative group ${className}`}>
      {/* Favorite icon - top right */}
      <button
        className={`absolute top-3 right-3 z-10 action-button favorite-button transition-all duration-300 ${
          isFavorite
            ? "active opacity-100"
            : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
        }`}
        aria-label="Add to favorites"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsFavorite(!isFavorite);
        }}
      >
        <Heart size={18} weight={isFavorite ? "Bold" : "Outline"} />
      </button>

      {/* Main preview area - fills remaining space */}
      <Link
        href={`/compare/${component.slug}`}
        className="flex-1 flex items-center justify-center w-full min-h-[140px]"
      >
        <div className="p-4 w-full flex items-center justify-center cursor-pointer transition-transform duration-500 group-hover:scale-105">
          <ComponentSkeleton slug={component.slug} className="w-full h-full" />
        </div>
      </Link>

      {/* Bottom section with title and icons */}
      <div className="card-footer">
        <Link href={`/compare/${component.slug}`} className="cursor-pointer">
          <h3 className={`card-title ${isSmall ? "text-sm" : "text-lg"}`}>
            {component.name}
          </h3>
        </Link>

        <div className="card-actions">
          {/* Like/Dislike group */}
          <div className="vote-group overflow-hidden rounded-lg">
            <button
              className={`action-button vote-button border-none rounded-none ${vote === "up" ? "text-primary bg-primary/5" : ""}`}
              aria-label="Like"
              onClick={() => setVote(vote === "up" ? null : "up")}
            >
              <div className="flex items-center gap-1">
                <Like
                  size={18}
                  weight={vote === "up" ? "BoldDuotone" : "LineDuotone"}
                />
                <span className="text-xs font-medium tabular-nums">
                  {likes}
                </span>
              </div>
            </button>

            <div className="w-px h-5 bg-border shrink-0 rounded-full" />

            <button
              className={`action-button vote-button border-none rounded-none ${vote === "down" ? "text-foreground bg-foreground/5" : ""}`}
              aria-label="Dislike"
              onClick={() => setVote(vote === "down" ? null : "down")}
            >
              <div className="flex items-center gap-1">
                <Dislike
                  size={18}
                  weight={vote === "down" ? "BoldDuotone" : "LineDuotone"}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
