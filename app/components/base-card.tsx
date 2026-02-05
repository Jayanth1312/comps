"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface BaseCardProps {
  // Slot content
  topRightSlot?: ReactNode;
  centerSlot: ReactNode;
  bottomLeftSlot: ReactNode;
  bottomRightSlot?: ReactNode;

  // Optional props
  className?: string;
  href?: string;
  onClick?: () => void;
}

export default function BaseCard({
  topRightSlot,
  centerSlot,
  bottomLeftSlot,
  bottomRightSlot,
  className = "",
  href,
  onClick,
}: BaseCardProps) {
  const cardContent = (
    <div
      className={cn(
        "component-card relative group flex flex-col h-full",
        className,
      )}
    >
      {/* Top-right slot - Absolute positioned */}
      {topRightSlot && (
        <div className="absolute top-3 right-3 z-20">{topRightSlot}</div>
      )}

      {/* Center slot - Main content area with constrained height */}
      <div className="flex-1 flex items-center justify-center w-full px-4 pt-4 pb-2 overflow-hidden min-h-0">
        <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
          {centerSlot}
        </div>
      </div>

      {/* Bottom section - Title and actions */}
      <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-2 shrink-0 mt-auto">
        {/* Bottom-left slot - Title/Label */}
        <div className="flex-1 min-w-0">{bottomLeftSlot}</div>

        {/* Bottom-right slot - Secondary actions */}
        {bottomRightSlot && <div className="shrink-0">{bottomRightSlot}</div>}
      </div>
    </div>
  );

  // If href is provided, wrap in Link
  if (href) {
    return (
      <Link href={href} onClick={onClick}>
        {cardContent}
      </Link>
    );
  }

  // If onClick is provided, wrap in button
  if (onClick) {
    return (
      <button onClick={onClick} className="w-full h-full text-left">
        {cardContent}
      </button>
    );
  }

  // Otherwise, return plain div
  return cardContent;
}
