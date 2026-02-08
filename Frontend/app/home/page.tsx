"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import LibrariesGrid from "../../components/libraries-grid";
import LightRays from "@/components/LightRays";
import ThemeToggle from "../components/theme-toggle";
import { COMPONENTS } from "@/types/component-data";
import {
  Stars,
  ArrowRight as ArrowRightSolar,
  Command,
  MinimalisticMagnifer,
  Sledgehammer,
  SimCard,
  Login,
  Logout,
  Library,
} from "@solar-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";

export default function HomePage() {
  const [isDark, setIsDark] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
      {/* Brand Logo */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-muted/20 backdrop-blur-sm border border-border/50 hover:bg-muted/30 transition-all duration-300 px-3 py-3 rounded-full"
      >
        <div className="">
          <Library
            weight="BoldDuotone"
            className="w-5 h-5 text-black dark:text-white"
          />
        </div>
        <span className="font-semibold text-lg tracking-tight sm:block text-black dark:text-white md:inline hidden">
          Comps Inc.
        </span>
      </Link>

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
              className="search-input focus:outline-none bg-transparent ml-3 w-[100px] sm:w-full text-[15px] placeholder:text-[15px] font-medium transition-all duration-300 focus:w-[150px] sm:focus:w-full"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="bg-muted/20 backdrop-blur-xs border border-border/50 rounded-[5px] px-2 font-normal ml-2 md:ml-3 hidden sm:flex items-center gap-1 shrink-0">
              <Command weight="BoldDuotone" size={12} />K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-2.5 bg-foreground text-background rounded-md text-[14px] font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Logout weight="BoldDuotone" size={18} />
              <span className="md:inline hidden">Logout</span>
            </button>
          ) : (
            <>
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-2.5 bg-foreground text-background rounded-2xl text-[14px] font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Login weight="BoldDuotone" size={18} />
                <span>Login</span>
              </Link>
            </>
          )}
        </div>

        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-8 pt-20">
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
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <Link
              href="/builder"
              className="group inline-flex items-center justify-center gap-2 px-6 py-4 bg-foreground text-background rounded-lg font-medium transition-all hover:scale-105 w-full sm:w-auto"
            >
              <Sledgehammer weight="BoldDuotone" size={20} />
              <span>Builder</span>
            </Link>
            <Link
              href="/explore"
              className="group inline-flex items-center justify-center gap-2 px-6 py-4 bg-transparent text-foreground border border-foreground rounded-lg font-medium transition-all hover:scale-105 w-full sm:w-auto"
            >
              Components
              <ArrowRightSolar weight="BoldDuotone" />
            </Link>
          </div>
        </div>

        {/* Gradient Overlay for smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-b from-transparent to-background z-10 pointer-events-none" />
      </section>

      {/* Libraries Section */}
      <LibrariesGrid />

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden bg-background">
        {/* Subtle grid background with blending */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "4rem 4rem",
            maskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        />

        <div className="container relative z-10 px-4 mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-muted/20 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Stars weight="BoldDuotone" />
            <span className="text-sm font-medium text-foreground/80">
              How it Works
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 mt-2">
            Seamless Comparison, Faster Development
          </h2>
          <p className="text-lg text-muted-foreground mb-20 max-w-2xl mx-auto">
            Choose the best UI library for your project by comparing real
            components side-by-side.
          </p>

          <div className="grid md:grid-cols-3 gap-10 md:gap-16 text-center">
            {[
              {
                step: "01",
                title: "Browse Components",
                description:
                  "Search for any component—from buttons to complex data tables across our registry.",
              },
              {
                step: "02",
                title: "Compare Libraries",
                description:
                  "Visualize identical components across 6 top-tier libraries like Shadcn, MUI, and Chakra simultaneously.",
              },
              {
                step: "03",
                title: "Build with AI",
                description:
                  "Use our AI-powered builder to generate custom code for your selected library in seconds.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-20 h-20 rounded-full bg-muted/30 border border-border/50 flex items-center justify-center mb-8 text-2xl font-bold transition-all group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:scale-110">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed px-4">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-24 bg-background/50 border-t border-border/20"
        id="faq"
      >
        <div className="container px-4 mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-muted/20 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Stars weight="BoldDuotone" />
              <span className="text-sm font-medium text-foreground/80">
                FAQ
              </span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about Comps INC.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-border/40">
              <AccordionTrigger className="text-left py-6 text-lg hover:no-underline font-medium">
                What is Comps INC?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-[16px] pb-6 leading-relaxed">
                Comps INC is a high-performance component registry and
                comparison platform. We help developers visualize and compare UI
                components from 6 major libraries side-by-side, and provide a
                visual builder to create custom themes and components instantly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-border/40">
              <AccordionTrigger className="text-left py-6 text-lg hover:no-underline font-medium">
                Is Comps INC free to use?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-[16px] pb-6 leading-relaxed">
                Yes, our core registry and comparison tools are completely free.
                We believe in empowering the developer community with tools that
                simplify the process of choosing and implementing UI libraries.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-border/40">
              <AccordionTrigger className="text-left py-6 text-lg hover:no-underline font-medium">
                Which UI libraries are supported by Comps INC?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-[16px] pb-6 leading-relaxed">
                We currently provide deep integration for Shadcn UI, Material UI
                (MUI), Chakra UI, Ant Design, Mantine, and DaisyUI. You can see
                how the same component (like a Button or Card) looks and behaves
                across all these libraries simultaneously.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-border/40">
              <AccordionTrigger className="text-left py-6 text-lg hover:no-underline font-medium">
                How does the AI Component Builder work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-[16px] pb-6 leading-relaxed">
                Our builder uses advanced AI models to generate production-ready
                React code. You can describe what you need, and the AI will
                generate the component using your preferred library's patterns
                and styling.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-border/40">
              <AccordionTrigger className="text-left py-6 text-lg hover:no-underline font-medium">
                Can I use Comps INC components in my existing project?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-[16px] pb-6 leading-relaxed">
                Absolutely. Every component in our registry comes with accurate
                source code that you can copy and paste directly into your
                project. For Shadcn UI, we also provide the CLI commands for
                even faster integration.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-black dark:bg-white border-t border-border/20 transition-colors duration-500">
        {/* Grid background for CTA */}
        <div
          className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-[0.1] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
            backgroundSize: "3rem 3rem",
          }}
        />

        <div className="container relative z-10 px-4 mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1] text-white dark:text-black">
            Ready to Find Your Perfect UI Foundation?
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the power of side-by-side comparison and AI-driven
            component generation. Choose the best library for your next project.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/builder"
              className="group flex items-center justify-between gap-2 pl-8 pr-4 py-3 bg-white dark:bg-black text-black dark:text-white rounded-lg font-normal text-lg hover:scale-105 transition-all"
            >
              Try It Now
              <div className="w-10 h-10 rounded-full bg-white/10 dark:bg-slate-900/10 flex items-center justify-center">
                <ArrowRightSolar
                  weight="BoldDuotone"
                  className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </Link>

            <Link
              href="https://github.com/Jayanth1312/comps"
              target="_blank"
              className="flex items-center gap-3 px-8 py-4 text-white dark:text-neutral-700 rounded-full font-bold text-lg border border-white dark:border-neutral-700 transition-all"
            >
              View on GitHub
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm font-medium text-neutral-700 dark:text-muted-foreground/60 uppercase tracking-widest">
            <span className="text-neutral-300 dark:text-neutral-700">
              Free to use
            </span>
            <span className="w-1 h-1 bg-neutral-700 dark:bg-neutral-700 rounded-full" />
            <span className="text-neutral-300 dark:text-neutral-700">
              Open source
            </span>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black text-neutral-400 py-10 px-6 md:px-20 border-t border-white/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Library
                    weight="BoldDuotone"
                    className="w-6 h-6 text-white"
                  />
                </div>
                <span className="text-xl text-black dark:text-white font-bold tracking-tight">
                  Comps Inc.
                </span>
              </div>
              <p className="text-neutral-500 max-w-sm mb-8 leading-relaxed">
                A high-performance component registry and comparison platform.
                Visualizing UI libraries with power and precision.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">
                Product
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link
                    href="/explore"
                    className="hover:text-white transition-colors"
                  >
                    Components
                  </Link>
                </li>
                <li>
                  <Link
                    href="/builder"
                    className="hover:text-white transition-colors"
                  >
                    AI Builder
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">
                Resources
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link
                    href="https://github.com/Jayanth1312/comps"
                    className="hover:text-white transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium uppercase tracking-widest text-neutral-400">
            <p>© 2026 COMPS INC. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <Link
                href="#"
                className="hover:text-neutral-400 transition-colors px-4"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
