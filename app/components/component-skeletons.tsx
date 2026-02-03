"use client";

import React from "react";
import { ComponentSlug } from "@/types/component-data";
import { cn } from "@/lib/utils";
import { Unread, User } from "@solar-icons/react";

interface SkeletonProps {
  slug: ComponentSlug;
  className?: string;
}

export function ComponentSkeleton({ slug, className }: SkeletonProps) {
  const renderSkeleton = () => {
    switch (slug) {
      case "button":
        return (
          <div className="w-24 h-9 rounded-md bg-foreground/10 flex items-center justify-center">
            <div className="w-12 h-2 rounded-full bg-foreground/10" />
          </div>
        );
      case "input":
        return (
          <div className="w-48 h-10 rounded-md border border-foreground/10 bg-transparent px-3 flex items-center">
            <div className="w-20 h-2 rounded-full bg-foreground/10" />
          </div>
        );
      case "card":
        return (
          <div className="w-40 h-28 rounded-xl border border-foreground/10 p-3 space-y-2">
            <div className="w-full h-12 rounded-lg bg-foreground/5" />
            <div className="w-20 h-2 rounded-full bg-foreground/10" />
            <div className="w-full h-2 rounded-full bg-foreground/5" />
          </div>
        );
      case "badge":
        return (
          <div className="w-16 h-6 rounded-full bg-foreground/10 flex items-center justify-center">
            <div className="w-8 h-1.5 rounded-full bg-foreground/10" />
          </div>
        );
      case "checkbox":
        return (
          <div className="w-5 h-5 rounded border border-foreground/20 flex items-center justify-center">
            <Unread weight="Outline" className="w-4 h-4" />
          </div>
        );
      case "avatar":
        return (
          <div className="w-12 h-12 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
            <User weight="BoldDuotone" className="w-6 h-6" />
          </div>
        );
      case "switch":
        return (
          <div className="w-10 h-5 rounded-full bg-foreground/10 relative p-1">
            <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
          </div>
        );
      case "slider":
        return (
          <div className="w-40 h-1 rounded-full bg-foreground/10 relative flex items-center">
            <div className="w-1/2 h-full rounded-full bg-foreground/20" />
            <div className="w-4 h-4 rounded-full bg-white border border-foreground/20 absolute left-1/2 -translate-x-1/2 shadow-sm" />
          </div>
        );
      case "accordion":
        return (
          <div className="w-48 space-y-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 border border-foreground/10 rounded-md px-3 flex items-center justify-between"
              >
                <div className="w-24 h-2 rounded-full bg-foreground/10" />
                <div className="w-2 h-2 border-r border-b border-foreground/20 rotate-45 transform -translate-y-0.5" />
              </div>
            ))}
          </div>
        );
      case "alert":
        return (
          <div className="w-48 p-3 border border-foreground/10 rounded-lg space-y-2">
            <div className="flex justify-between">
              <div className="w-20 h-2.5 rounded-full bg-foreground/20" />
              <div className="w-2 h-2 rounded-full bg-foreground/10" />
            </div>
            <div className="w-full h-1.5 rounded-full bg-foreground/10" />
            <div className="w-2/3 h-1.5 rounded-full bg-foreground/10" />
          </div>
        );
      case "calendar":
        return (
          <div className="w-40 border border-foreground/10 rounded-lg p-2">
            <div className="flex justify-between mb-2 px-1">
              <div className="w-8 h-2 rounded-full bg-foreground/20" />
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-foreground/10" />
                <div className="w-2 h-2 rounded-full bg-foreground/10" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 21 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm bg-foreground/5"
                />
              ))}
            </div>
          </div>
        );
      case "dialog":
        return (
          <div className="w-48 border border-foreground/10 rounded-xl p-4 shadow-sm bg-white/5 backdrop-blur-sm space-y-4">
            <div className="space-y-2">
              <div className="w-24 h-3 rounded-full bg-foreground/20" />
              <div className="w-full h-2 rounded-full bg-foreground/10" />
            </div>
            <div className="flex justify-end gap-2">
              <div className="w-12 h-6 rounded bg-foreground/5" />
              <div className="w-12 h-6 rounded bg-foreground/10" />
            </div>
          </div>
        );
      case "pagination":
        return (
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-7 h-7 rounded border border-foreground/10 flex items-center justify-center",
                  i === 3 && "bg-foreground/10",
                )}
              >
                <div className="w-2 h-2 rounded-full bg-foreground/20" />
              </div>
            ))}
          </div>
        );
      case "popover":
        return (
          <div className="relative">
            <div className="w-20 h-8 rounded border border-foreground/10 flex items-center justify-center">
              <div className="w-10 h-2 rounded-full bg-foreground/10" />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 border border-foreground/10 rounded-lg p-3 bg-white/5 shadow-xl">
              <div className="space-y-2">
                <div className="w-16 h-2 rounded-full bg-foreground/10" />
                <div className="w-full h-1.5 rounded-full bg-foreground/5" />
              </div>
            </div>
          </div>
        );
      case "progress":
        return (
          <div className="w-40 h-2 rounded-full bg-foreground/10 overflow-hidden">
            <div className="w-2/3 h-full bg-foreground/20" />
          </div>
        );
      case "tabs":
        return (
          <div>
            <div className="flex items-center gap-2 py-2">
              <div className="w-1/3 h-7 rounded-sm dark:bg-white/10 bg-black/10" />
              <div className="w-1/3 h-7 rounded-sm dark:bg-white/2 bg-black/10" />
            </div>
            <div className="w-48 border border-foreground/10 rounded-lg p-1 flex flex-col gap-3 bg-foreground/5 px-2 py-4">
              <div className="w-1/3 h-3 rounded-full dark:bg-white/10 bg-black/10" />
              <div className="w-1.8 h-3 rounded-full dark:bg-white/5 bg-black/5" />
            </div>
          </div>
        );
      case "tooltip":
        return (
          <div className="flex flex-col items-center">
            {/* Tooltip Bubble */}
            <div className="relative mb-1.5 flex flex-col items-center group-hover:-translate-y-1 transition-transform duration-500">
              <div className="w-24 h-9 bg-neutral-600 dark:bg-neutral-800 rounded-sm flex items-center justify-center px-4">
                <div className="w-full h-2 bg-neutral-300 dark:bg-white/10 rounded-full" />
              </div>
              {/* Arrow */}
              <div className="w-3 h-3 bg-neutral-600 dark:bg-neutral-800 rotate-45 -mt-1.5" />
            </div>
            {/* Target Element */}
            <div className="w-16 h-10 bg-transparent border border-neutral-200 dark:border-white/10 rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center px-3">
              <div className="w-full h-2 dark:bg-neutral-700 bg-neutral-300 rounded-full" />
            </div>
          </div>
        );
      case "table":
        return (
          <div className="w-48 border border-foreground/10 rounded-lg overflow-hidden">
            <div className="h-7 bg-foreground/5 border-b border-foreground/10 flex px-3 items-center gap-4">
              <div className="w-12 h-1.5 rounded-full bg-foreground/20" />
              <div className="w-16 h-1.5 rounded-full bg-foreground/20" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-7 border-b border-foreground/10 last:border-0 flex px-3 items-center gap-4"
              >
                <div className="w-12 h-1.5 rounded-full bg-foreground/10" />
                <div className="w-16 h-1.5 rounded-full bg-foreground/10" />
              </div>
            ))}
          </div>
        );
      case "skeleton":
        return (
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-foreground/10 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="w-32 h-3 rounded-full bg-foreground/10 animate-pulse" />
              <div className="w-24 h-3 rounded-full bg-foreground/10 animate-pulse" />
            </div>
          </div>
        );
      case "command":
        return (
          <div className="w-48 border border-foreground/10 rounded-lg overflow-hidden shadow-lg">
            <div className="h-9 border-b border-foreground/10 flex items-center px-3 gap-2">
              <div className="w-3 h-3 rounded-full border border-foreground/20" />
              <div className="w-24 h-2 rounded-full bg-foreground/10" />
            </div>
            <div className="p-1.5 space-y-1">
              <div className="h-7 rounded bg-foreground/10" />
              <div className="h-7 rounded" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {renderSkeleton()}
    </div>
  );
}
