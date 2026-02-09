"use client";

import React, { useState, useEffect } from "react";
import {
  MinimalisticMagnifer,
  SortVertical,
  SortFromTopToBottom,
  SortFromBottomToTop,
  GraphNewUp,
  Command,
  Heart,
  Sledgehammer,
  SimCard,
  Login
} from "@solar-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./theme-toggle";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { COMPONENTS } from "@/types/component-data";
import Fuse from "fuse.js";
import { useSortContext } from "@/contexts/sort-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  visible?: boolean;
  showSort?: boolean;
  showBuilder?: boolean;
}

export default function Header({
  visible = true,
  showSort = true,
  showBuilder = false,
}: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { setSortBy } = useSortContext();

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

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none h-0 overflow-visible"
        >
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none select-none z-0"
            style={{
              maskImage:
                "linear-gradient(to top, black 0%, black 10%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.1) 80%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, black 0%, black 10%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.1) 80%, transparent 100%)",
              background:
                "linear-gradient(to top, var(--background) 0%, var(--background) 20%, transparent 100%)",
            }}
          />

          <div className="header-wrapper w-full pb-4 md:pb-8 px-4 md:px-6 absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
            <div className="max-w-xl mx-auto flex gap-2 md:gap-3 pointer-events-auto">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <AnimatePresence>
                  {searchFocused && filteredResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute bottom-full left-0 right-0 mb-3 dark:bg-black/20 bg-white/20 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-lg z-50 max-h-[400px] flex flex-col"
                    >
                      <div className="text-[10px] font-bold text-muted-foreground/50 px-3 pt-3 pb-1.5 uppercase tracking-wider shrink-0">
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
                                  : "group-hover:text-foreground",
                              )}
                            >
                              <SimCard
                                size={18}
                                className={cn(
                                  "transition-colors",
                                  index === activeIndex
                                    ? "text-primary"
                                    : "text-muted-foreground group-hover:text-foreground",
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
                  className={`flex items-center w-full px-3 md:px-4 py-3 md:py-3 rounded-md bg-muted/20 backdrop-blur-sm border border-border/50 transition-all duration-300 ${
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

              {/* Sort Dropdown */}
              {showSort && (
                <div className="bg-muted/20 backdrop-blur-sm border border-border/50 rounded-md">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-full px-4 border-none bg-transparent cursor-pointer rounded-md gap-2 font-medium text-[15px] flex items-center hover:bg-muted/30 transition-colors text-foreground">
                        <SortVertical weight="BoldDuotone" size={20} />
                        <span className="hidden sm:inline">Sort</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      side="top"
                      sideOffset={8}
                      className="dropdown-content w-48"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer py-2.5"
                          onClick={() => setSortBy("a-z")}
                        >
                          <SortFromTopToBottom size={20} weight="BoldDuotone" />
                          <span className="font-medium">A-Z</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer py-2.5"
                          onClick={() => setSortBy("z-a")}
                        >
                          <SortFromBottomToTop size={20} weight="BoldDuotone" />
                          <span className="font-medium">Z-A</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer py-2.5"
                          onClick={() => setSortBy("popularity")}
                        >
                          <GraphNewUp
                            size={20}
                            weight="BoldDuotone"
                            className="text-blue-400"
                          />
                          <span className="font-medium">By Popularity</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer py-2.5"
                          onClick={() => setSortBy("favorites")}
                        >
                          <Heart
                            size={20}
                            weight="Bold"
                            className="text-red-500"
                          />
                          <span className="font-medium">Favourites</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Builder Button */}
              {showBuilder && (
                <Link
                  href="/builder"
                  className="bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 border border-border/50 hover:opacity-90 transition-all duration-300 font-normal px-3 md:px-4 py-3 md:py-3 rounded-md flex items-center justify-center cursor-pointer active:scale-[0.98] gap-2 pointer-events-auto"
                >
                  <Sledgehammer weight="BoldDuotone" size={20} />
                  <span className="text-[15px] hidden md:inline">Builder</span>
                </Link>
              )}

              {/* Login Button (if not logged in) */}
              {!showBuilder && (
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname)}`}
                  className="bg-foreground text-background border border-border/50 hover:opacity-90 transition-all duration-300 font-normal px-4 py-3 rounded-md flex items-center justify-center cursor-pointer active:scale-[0.98] gap-2 pointer-events-auto"
                >
                  <Login weight="BoldDuotone" size={20} />
                  <span className="text-[15px] hidden md:inline">Login</span>
                </Link>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
