import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/app/components/header";
import LibraryComparisonCard from "@/app/components/library-comparison-card";
import { COMPONENTS, LIBRARIES } from "@/types/component-data";

interface PageProps {
  params: Promise<{ component: string }>;
}

export default async function ComparePage({ params }: PageProps) {
  const { component: componentSlug } = await params;

  // Find the component
  const component = COMPONENTS.find((c) => c.slug === componentSlug);

  if (!component) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-6 py-12 pb-32">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 mt-8"
        >
          <ArrowLeft size={20} />
          <span>Back to components</span>
        </Link>

        {/* Component Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">{component.name}</h1>
          <p className="text-lg text-muted-foreground">
            {component.description}
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="comparison-grid fade-in">
          {LIBRARIES.map((library) => (
            <div key={library.name}>
              {/* Library Name Header */}
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: library.color }}
                  />
                  <h3 className="text-lg font-semibold">
                    {library.displayName}
                  </h3>
                </div>
              </div>

              {/* Library Card */}
              <LibraryComparisonCard
                library={library}
                componentSlug={componentSlug}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// Generate static params for all components
export async function generateStaticParams() {
  return COMPONENTS.map((component) => ({
    component: component.slug,
  }));
}
