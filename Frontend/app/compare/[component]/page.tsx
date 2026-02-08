"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart } from "@solar-icons/react";
import Header from "@/app/components/header";
import LibraryComparisonCard from "@/app/components/library-comparison-card";
import LibraryFilter from "@/app/components/library-filter";
import ScrollToTop from "@/app/components/scroll-to-top";
import { useSortContext } from "@/contexts/sort-context";
import { COMPONENTS, LIBRARIES } from "@/types/component-data";

export default function ComparePage() {
  const params = useParams();
  const componentSlug = params.component as string;
  const { componentStats, toggleFavorite } = useSortContext();

  const [selectedLibraries, setSelectedLibraries] = useState<string[]>(
    LIBRARIES.map((l) => l.name),
  );

  // Find the component
  const component = COMPONENTS.find((c) => c.slug === componentSlug);

  if (!component) {
    notFound();
  }

  const toggleLibrary = (name: string) => {
    setSelectedLibraries((prev) =>
      prev.includes(name) ? prev.filter((l) => l !== name) : [...prev, name],
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header showSort={false} showBuilder={true} />

      <main className="container mx-auto px-4 md:px-8 lg:px-20 pb-16 md:pb-32 pt-20 md:pt-16">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 md:mb-6"
          >
            <ArrowLeft size={20} weight="BoldDuotone" />
            <span>Back to components</span>
          </Link>

          {/* Component Header with Filter */}
          <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2 md:mb-4">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
                  {component.name}
                </h1>
                <button
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-all duration-300 ${
                    componentStats[component.slug]?.isFavorite
                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                      : "bg-background hover:bg-muted text-muted-foreground"
                  }`}
                  aria-label="Toggle Favorite"
                  onClick={() => toggleFavorite(component.slug)}
                >
                  <Heart
                    size={20}
                    weight={
                      componentStats[component.slug]?.isFavorite
                        ? "Bold"
                        : "Outline"
                    }
                  />
                </button>
              </div>
              <p className="text-muted-foreground text-base md:text-xl max-w-3xl">
                {component.description}
              </p>
            </div>
          </div>
          <div className="w-full mb-6">
            <LibraryFilter
              allLibraries={LIBRARIES}
              selectedLibraries={selectedLibraries}
              onToggleLibrary={toggleLibrary}
            />
          </div>

          {/* Comparison Grid */}
          <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-6">
            {LIBRARIES.filter((l) => selectedLibraries.includes(l.name)).map(
              (library) => (
                <LibraryComparisonCard
                  key={library.name}
                  library={library}
                  componentSlug={componentSlug}
                />
              ),
            )}
            {selectedLibraries.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground w-full">
                <p>
                  No libraries selected. Use the filter to select libraries.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <ScrollToTop />
    </div>
  );
}
