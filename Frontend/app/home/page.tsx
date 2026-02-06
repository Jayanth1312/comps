"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import LibrariesGrid from "../../components/libraries-grid";
import LightRays from "@/components/LightRays";
import ThemeToggle from "../components/theme-toggle";
import { COMPONENTS } from "@/types/component-data";
import {
  Stars,
  ArrowRight,
  Command,
  MinimalisticMagnifer,
  Sledgehammer,
  SimCard,
} from "@solar-icons/react";

import { cn } from "@/lib/utils";

export default function HomePage() {
  const [isDark, setIsDark] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuse = new Fuse(COMPONENTS, {
    keys: ["name", "slug", "description"],
    threshold: 0.3,
    distance: 100,
  });

  const filteredResults =
    searchQuery.trim().length > 0
      ? fuse.search(searchQuery).map((result) => result.item)
      : [];

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (filteredResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? filteredResults.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedItem = filteredResults[activeIndex];
      if (selectedItem) {
        router.push(`/compare/${selectedItem.slug}`);
        setSearchQuery("");
        setSearchFocused(false);
      }
    } else if (e.key === "Escape") {
      setSearchFocused(false);
      searchInputRef.current?.blur();
    }
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Initial check
    setIsDark(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20">
      {/* Searchbar and Theme Toggle */}
      <div className="fixed top-6 right-4 z-50 flex gap-2">
        <div className="relative flex-1">
          <AnimatePresence>
            {searchFocused && filteredResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full left-0 right-0 mt-3 dark:bg-black/20 bg-white/20 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-2xl z-50 max-h-[400px] flex flex-col"
              >
                <div className="text-[10px] font-bold text-muted-foreground/50 px-3 py-1.5 uppercase tracking-wider shrink-0">
                  Components ({filteredResults.length})
                </div>
                <div className="overflow-y-auto p-1.5 pt-0">
                  {filteredResults.map((result, index) => (
                    <button
                      key={result.slug}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left group cursor-pointer border border-transparent",
                        index === activeIndex
                          ? "bg-muted/80 border-primary/20 shadow-sm"
                          : "hover:bg-muted/50",
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        router.push(`/compare/${result.slug}`);
                        setSearchQuery("");
                        setSearchFocused(false);
                      }}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 transition-colors",
                          index === activeIndex
                            ? "bg-background text-primary"
                            : "group-hover:bg-primary/10",
                        )}
                      >
                        <SimCard
                          size={18}
                          className={cn(
                            "transition-colors",
                            index === activeIndex
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-primary",
                          )}
                          weight="BoldDuotone"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          {result.name}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {result.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={`flex items-center w-full px-3 md:px-4 py-3 md:py-2.5 rounded-md bg-muted/20 backdrop-blur-sm border border-border/50 transition-all duration-300 ${
              searchFocused ? "ring-2 ring-foreground/20" : ""
            }`}
          >
            <MinimalisticMagnifer
              weight="BoldDuotone"
              size={20}
              className="text-muted-foreground shrink-0"
              strokeWidth={2}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="search-input focus:outline-none bg-transparent ml-3 w-full text-[15px] placeholder:text-[15px] font-medium"
              placeholder="Search Components"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="bg-muted/20 backdrop-blur-xs border border-border/50 rounded-[5px] px-2 font-normal ml-2 md:ml-3 hidden sm:flex items-center gap-1 shrink-0">
              <Command weight="BoldDuotone" size={12} />K
            </kbd>
          </div>
        </div>

        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-8">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <LightRays
            raysOrigin="top-center"
            raysSpeed={1}
            raysColor={isDark ? "#ffffff" : "#000000"}
            lightSpread={1}
            fadeDistance={2}
            saturation={1}
            rayLength={2}
            mouseInfluence={0.3}
            distortion={0.4}
            noiseAmount={0.3}
            className="opacity-40 transition-opacity duration-1000 dark:opacity-60"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container px-4 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-muted/20 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Stars weight="BoldDuotone" />
            <span className="text-sm font-medium text-foreground/80">
              Component Registry
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Compare & Build React UIs Faster
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            See real components from 6 top libraries side-by-side. Then switch
            to our builder to create, customize, and export your desired
            component.
          </p>

          {/* CTA Link */}
          <div className="flex items-center gap-5">
            <Link
              href="/builder"
              className="group inline-flex items-center gap-2 px-6 py-4 bg-foreground text-background rounded-lg font-medium transition-all hover:scale-105"
            >
              <Sledgehammer weight="BoldDuotone" size={20} />
              <span>Builder</span>
            </Link>
            <Link
              href="/explore"
              className="group inline-flex items-center gap-2 px-6 py-4 bg-transparent text-foreground border border-foreground rounded-lg font-medium transition-all hover:scale-105"
            >
              Components
              <ArrowRight weight="BoldDuotone" />
            </Link>
          </div>
        </div>

        {/* Gradient Overlay for smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-b from-transparent to-background z-10 pointer-events-none" />
      </section>

      {/* Libraries Section */}
      <LibrariesGrid />

      {/* Landing Footer / CTA again */}
      <div className="py-24 text-center pb-32">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">
          Ready to build?
        </h2>
        <Link
          href="/explore"
          className="group inline-flex items-center gap-2 px-8 py-3.5 bg-foreground text-background rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
        >
          View All Components
          <ArrowRight weight="BoldDuotone" />
        </Link>
      </div>
    </div>
  );
}
