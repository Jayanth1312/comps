"use client";

import React, { useState, useEffect } from "react";
import {
  MinimalisticMagnifer,
  SortVertical,
  SortByAlphabet,
  GraphNewUp,
  Command,
  Stars,
  Heart,
} from "@solar-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { COMPONENTS } from "@/types/component-data";
import Fuse from "fuse.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  visible?: boolean;
}

export default function Header({ visible = true }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
                        {filteredResults.map((result) => (
                          <button
                            key={result.slug}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 rounded-lg transition-colors text-left group"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              router.push(`/compare/${result.slug}`);
                              setSearchQuery("");
                              setSearchFocused(false);
                            }}
                          >
                            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                              <Stars
                                size={18}
                                className="text-muted-foreground group-hover:text-primary transition-colors"
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
                  className={`flex items-center w-full px-3 md:px-4 py-2 md:py-2.5 rounded-md bg-muted/20 backdrop-blur-sm border border-border/50 transition-all duration-300 ${
                    searchFocused ? "ring-2 ring-primary/20" : ""
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
              <div className="bg-muted/20 backdrop-blur-sm border border-border/50 rounded-md">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-full px-4 border-none bg-transparent hover:bg-transparent header-button rounded-md gap-2 font-medium text-[15px]"
                    >
                      <SortVertical weight="BoldDuotone" size={20} />
                      <span className="hidden sm:inline">Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="top"
                    sideOffset={8}
                    className="dropdown-content w-48"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="gap-2 cursor-pointer py-2.5">
                        <SortByAlphabet size={20} weight="BoldDuotone" />
                        <span className="font-medium">Alphabetical</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer py-2.5">
                        <GraphNewUp size={20} weight="BoldDuotone" />
                        <span className="font-medium">By Popularity</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer py-2.5">
                        <Heart size={20} weight="BoldDuotone" />
                        <span className="font-medium">Favourites</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
