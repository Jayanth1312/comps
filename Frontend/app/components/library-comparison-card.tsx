"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneEarth } from "react-syntax-highlighter/dist/esm/styles/prism";
import { LibraryInfo } from "@/types/component-data";
import { getComponentExample } from "@/lib/component-registry";
import { Code, Like, Dislike, Copy, CheckCircle } from "@solar-icons/react";
import { useTheme } from "next-themes";

interface LibraryComparisonCardProps {
  library: LibraryInfo;
  componentSlug: string;
}

export default function LibraryComparisonCard({
  library,
  componentSlug,
}: LibraryComparisonCardProps) {
  const [showCode, setShowCode] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [likes, setLikes] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const example = getComponentExample(library.name, componentSlug);

  const handleVoteUp = () => {
    if (vote === "up") {
      setLikes(likes - 1);
      setVote(null);
    } else {
      if (vote === "down") {
        setLikes(likes + 1);
      }
      setLikes(likes + 1);
      setVote("up");
    }
  };

  const handleVoteDown = () => {
    if (vote === "down") {
      setLikes(likes + 1);
      setVote(null);
    } else {
      if (vote === "up") {
        setLikes(likes - 1);
      }
      setLikes(likes - 1);
      setVote("down");
    }
  };

  const handleCopyCode = async () => {
    if (example?.code) {
      try {
        await navigator.clipboard.writeText(example.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }
  };

  const componentPreview = isMounted ? (
    example?.component ? (
      <div
        className={`library-components-wrapper w-full h-full flex items-center justify-center p-6 ${
          library.name === "shadcn" ? "shadcn-theme-root" : ""
        }`}
      >
        {example.component}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">Component not available</p>
    )
  ) : (
    <div className="h-10 w-full animate-pulse bg-muted rounded"></div>
  );

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border border-border bg-card
        transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]

        /* Mobile: full width, vertical flex, height adjusts based on code visibility */
        w-full flex flex-col
        ${showCode ? "h-auto" : "h-[280px]"}

        /* Desktop: horizontal flex, fixed height, width changes */
        md:flex-row md:h-[320px]
        ${showCode ? "md:w-full" : "md:w-[calc(50%-0.75rem)]"}
      `}
    >
      {/* Preview Section */}
      <div
        className={`
          relative flex flex-col justify-between shrink-0
          transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]

          /* Mobile: full width, fixed height */
          w-full h-[280px]

          /* Desktop: width adjusts based on code visibility */
          md:h-full
          ${showCode ? "md:w-1/2" : "md:w-full"}
        `}
      >
        {/* Code toggle button - Top Right - Theme aware */}
        {example && (
          <div className="absolute right-3 top-3 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowCode(!showCode);
              }}
              className={`
                group flex h-9 w-9 items-center justify-center rounded-lg border
                transition-all duration-300 focus:outline-none cursor-pointer
                ${
                  showCode
                    ? "bg-muted text-foreground border-border"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground md:bg-background/80"
                }
              `}
              aria-label="View code"
            >
              <Code
                size={18}
                weight="BoldDuotone"
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </button>
          </div>
        )}

        {/* Spacer for button */}
        <div className="h-12" />

        {/* Component Preview - Center */}
        <div className="flex-1 flex items-center justify-center px-6">
          {componentPreview}
        </div>

        {/* Bottom Section - Library name and vote buttons */}
        <div className="flex items-end justify-between px-4 pb-4">
          {/* Library Name */}
          <div className="pb-0.5">
            <span className="text-base font-semibold tracking-tight">
              {library.displayName}
            </span>
          </div>

          {/* Vote Buttons */}
          <div className="vote-group overflow-hidden rounded-lg shrink-0 flex items-center border border-border bg-background/50">
            <button
              className={`action-button vote-button border-none rounded-none px-2.5 py-1.5 transition-colors hover:bg-muted hover:text-foreground ${
                vote === "up"
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground"
              }`}
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
                <span className="text-xs font-medium tabular-nums">
                  {likes}
                </span>
              </div>
            </button>

            <div className="w-px h-9 bg-border shrink-0" />

            <button
              className={`action-button vote-button border-none rounded-none px-2.5 py-1.5 transition-colors hover:bg-muted hover:text-foreground ${
                vote === "down"
                  ? "text-foreground bg-foreground/5"
                  : "text-muted-foreground"
              }`}
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
        </div>
      </div>

      {/* Code Panel */}
      {example && (
        <div
          className={`
            relative shrink-0 overflow-hidden bg-muted/50
            transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]

            /* Mobile: expand height downwards, full width, border on top */
            w-full border-t border-border
            ${showCode ? "h-[280px]" : "h-0"}

            /* Desktop: expand width to right, full height, border on left */
            md:w-auto md:h-full md:border-t-0 md:border-l
            ${showCode ? "md:flex-1" : "md:w-0"}
          `}
        >
          {/* Floating Copy Button - Top Right - Theme aware */}
          <button
            onClick={handleCopyCode}
            className={`
              absolute right-3 top-3 z-20
              flex h-9 w-9 items-center justify-center rounded-lg border
              transition-all duration-300 focus:outline-none cursor-pointer
              border-border bg-background text-muted-foreground
              hover:bg-muted hover:text-foreground
              md:bg-background/20
            `}
            aria-label="Copy code"
          >
            {copied ? (
              <CheckCircle
                size={20}
                weight="BoldDuotone"
                className="text-green-500"
              />
            ) : (
              <Copy size={16} weight="LineDuotone" />
            )}
          </button>

          {/* Scrollable code content - Full height */}
          <div className="h-full w-full overflow-auto">
            <SyntaxHighlighter
              language="tsx"
              style={duotoneEarth}
              customStyle={{
                margin: 0,
                padding: "1rem",
                paddingTop: "1rem",
                fontFamily: "var(--font-mono)",
                lineHeight: "1.5",
                borderRadius: 0,
                background: "transparent",
                height: "100%",
                width: "100%",
              }}
              showLineNumbers
              wrapLines={true}
              wrapLongLines={true}
            >
              {example.code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
}
