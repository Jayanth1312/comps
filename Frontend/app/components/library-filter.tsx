"use client";

import React, { useState } from "react";
import { Filter } from "@solar-icons/react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LibraryInfo } from "@/types/component-data";
import {
  ShadcnUiDark,
  ChakraUI,
  MaterialUI,
  AntDesign,
  DaisyUI,
  Mantine,
} from "@ridemountainpig/svgl-react";

interface LibraryFilterProps {
  allLibraries: LibraryInfo[];
  selectedLibraries: string[];
  onToggleLibrary: (name: string) => void;
}

const LIBRARY_ICONS: Record<string, React.ReactNode> = {
  shadcn: <ShadcnUiDark className="w-4 h-4" />,
  chakra: <ChakraUI className="w-4 h-4" />,
  mui: <MaterialUI className="w-4 h-4" />,
  antd: <AntDesign className="w-4 h-4" />,
  daisyui: <DaisyUI className="w-4 h-4" />,
  mantine: <Mantine className="w-4 h-4" />,
};

const LibraryIcon = ({ name }: { name: string }) => {
  return LIBRARY_ICONS[name] || null;
};

export default function LibraryFilter({
  allLibraries,
  selectedLibraries,
  onToggleLibrary,
}: LibraryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
      {/* Mobile: Filter Button (Top) */}
      <div className="flex md:hidden w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 w-full justify-center",
            isOpen
              ? "border border-border bg-transparent text-foreground hover:bg-muted"
              : "bg-foreground text-background border border-transparent hover:bg-foreground/90",
          )}
        >
          <Filter
            size={18}
            weight="BoldDuotone"
            className={cn(
              "transition-transform",
              isOpen ? "scale-90" : "scale-100",
            )}
          />
          <span>Filter Libraries</span>
        </button>
      </div>

      {/* Desktop: Filter Button (Left) */}
      <div className="hidden md:flex shrink-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
            isOpen
              ? "border border-border bg-transparent text-foreground hover:bg-muted"
              : "bg-foreground text-background border border-transparent hover:bg-foreground/90",
          )}
        >
          <Filter
            size={18}
            weight="BoldDuotone"
            className={cn(
              "transition-transform",
              isOpen ? "scale-90" : "scale-100",
            )}
          />
          <span>Filter</span>
        </button>
      </div>

      {/* Filter Options */}
      {isOpen && (
        <div className="flex flex-row justify-between md:justify-start md:flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 md:slide-in-from-left-2 duration-300 w-full md:w-auto">
          {allLibraries.map((lib) => {
            const isSelected = selectedLibraries.includes(lib.name);
            return (
              <button
                key={lib.name}
                onClick={() => onToggleLibrary(lib.name)}
                className={cn(
                  "group relative flex items-center justify-center p-2 rounded-lg transition-all duration-200 select-none",
                  // Width/Height logic
                  "w-10 h-10 md:w-10 md:h-10",
                  isSelected
                    ? "bg-transparent border border-foreground/10 opacity-100"
                    : "bg-transparent border border-transparent opacity-40 hover:opacity-70",
                )}
                title={lib.displayName}
              >
                {/* Library Icon */}
                <div className="w-full h-full p-1 flex items-center justify-center">
                  {LIBRARY_ICONS[lib.name]}
                </div>

                {/* Status Indicator (Absolute) */}
                <div className="absolute -top-1 -right-1">
                  {isSelected ? (
                    <div className="bg-foreground text-background rounded-full p-0.5">
                      <X size={10} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="bg-muted text-muted-foreground rounded-full p-0.5 shadow-sm border border-border">
                      <Plus size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
