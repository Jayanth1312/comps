"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LibrariesGrid from "../../components/libraries-grid";
import LightRays from "@/components/LightRays";
import ThemeToggle from "../components/theme-toggle";
import { Stars, ArrowRight } from "@solar-icons/react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [isDark, setIsDark] = useState(true);

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
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
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
            Component Library Comparison
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Compare UI components across 6 popular libraries side-by-side with
            our interactive playground.
          </p>

          {/* CTA Link */}
          <Link
            href="/explore"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-foreground text-background rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
          >
            Compare Components
            <ArrowRight weight="BoldDuotone" />
          </Link>
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
