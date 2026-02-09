"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneEarth } from "react-syntax-highlighter/dist/esm/styles/prism";
import { LibraryInfo, ComponentSlug } from "@/types/component-data";
import { getComponentExample } from "@/lib/component-registry";
import { Code, Like, Dislike, Copy, CheckCircle } from "@solar-icons/react";
import { useSortContext } from "@/contexts/sort-context";
import { useTheme } from "next-themes";
import { ChakraButtonWrapper } from "./wrapper";

interface LibraryComparisonCardProps {
  library: LibraryInfo;
  componentSlug: string;
}

export default function LibraryComparisonCard({
  library,
  componentSlug,
}: LibraryComparisonCardProps) {
  const { componentStats, toggleLike, toggleDislike } = useSortContext();
  const [showCode, setShowCode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const example = getComponentExample(library.name, componentSlug);

  const handleVoteUp = () => {
    toggleLike(componentSlug as any, library.name);
  };

  const handleVoteDown = () => {
    toggleDislike(componentSlug as any, library.name);
  };

  const compSlug = componentSlug as ComponentSlug;
  const libStat = componentStats[compSlug]?.libraryStats?.[library.name] || {
    type: null,
  };
  const vote = libStat.type;

  const handleCopyCode = async () => {
    const codeToCopy = example?.code;
    if (codeToCopy) {
      try {
        await navigator.clipboard.writeText(codeToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }
  };

  const componentPreview = isMounted ? (
    example?.component ? (
      library.name === "chakra" && componentSlug === "button" ? (
        <div className="library-components-wrapper w-full h-full flex items-center justify-center p-6">
          <ChakraButtonWrapper />
        </div>
      ) : (
        <div
          className={`library-components-wrapper w-full h-full flex items-center justify-center p-6 ${
            library.name === "shadcn" ? "shadcn-theme-root" : ""
          }`}
        >
          {example.component}
        </div>
      )
    ) : (
      <p className="text-sm text-muted-foreground">Component not available</p>
    )
  ) : (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-10 w-2/3 animate-pulse bg-muted rounded"></div>
    </div>
  );

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border border-border bg-card
        transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        /* Layout */
        w-full flex flex-col
        ${showCode ? "h-auto" : "h-[320px]"}
        md:flex-row md:h-[350px]
        ${showCode ? "md:w-full" : "md:w-[calc(50%-0.75rem)]"}
      `}
    >
      {/* Preview Section */}
      <div
        className={`
          relative flex flex-col justify-between shrink-0
          transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          w-full h-[320px] md:h-full
          ${showCode ? "md:w-1/2" : "md:w-full"}
        `}
      >
        {/* Code toggle button - Top Right */}
        {example && (
          <div className="absolute right-3 top-3 z-20 flex gap-2">
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
                    : "border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground backdrop-blur-sm"
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

        {/* Spacer for top button visibility */}
        <div className="h-12 w-full" />

        {/* Component Preview - Center */}
        <div className="flex-1 flex items-center justify-center px-6 overflow-hidden">
          {componentPreview}
        </div>

        {/* Bottom Section - Library Information and Interactions */}
        <div className="flex items-center justify-between px-4 pb-4 mt-2">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              Library
            </span>
            <span className="text-lg font-bold tracking-tight">
              {library.displayName}
            </span>
          </div>

          {/* Vote Buttons */}
          <div className="vote-group overflow-hidden rounded-xl flex items-center border border-border bg-background/40 backdrop-blur-sm shadow-sm">
            <button
              className={`flex items-center justify-center w-10 h-10 transition-colors hover:bg-muted/80 ${
                vote === "up"
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleVoteUp();
              }}
              title="Like library implementation"
            >
              <Like
                size={20}
                weight={vote === "up" ? "BoldDuotone" : "LineDuotone"}
              />
            </button>
            <div className="w-px h-6 bg-border" />
            <button
              className={`flex items-center justify-center w-10 h-10 transition-colors hover:bg-muted/80 ${
                vote === "down"
                  ? "text-foreground bg-foreground/10"
                  : "text-muted-foreground"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleVoteDown();
              }}
              title="Dislike library implementation"
            >
              <Dislike
                size={20}
                weight={vote === "down" ? "BoldDuotone" : "LineDuotone"}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Code Panel */}
      {example && (
        <div
          className={`
            relative shrink-0 overflow-hidden bg-muted/30
            transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
            w-full border-t border-border
            ${showCode ? "h-[400px]" : "h-0"}
            md:w-auto md:h-full md:border-t-0 md:border-l
            ${showCode ? "md:flex-1" : "md:w-0"}
          `}
        >
          {/* Floating Copy Button */}
          <button
            onClick={handleCopyCode}
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 backdrop-blur-sm shadow-sm"
            aria-label="Copy code"
          >
            {copied ? (
              <CheckCircle
                size={20}
                weight="BoldDuotone"
                className="text-green-500"
              />
            ) : (
              <Copy size={18} weight="LineDuotone" />
            )}
          </button>

          <div className="h-full w-full overflow-auto">
            <SyntaxHighlighter
              language="tsx"
              style={duotoneEarth}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
                fontSize: "0.85rem",
                fontFamily: "var(--font-mono)",
                lineHeight: "1.6",
                background: "transparent",
                height: "100%",
              }}
              showLineNumbers
              wrapLines
            >
              {example.code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
}
