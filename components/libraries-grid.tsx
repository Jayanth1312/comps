"use client";

import React from "react";
import { motion } from "framer-motion";
import { LIBRARIES, LIBRARY_COMMANDS } from "@/types/component-data";
import { Check, Copy } from "lucide-react";
import { LinkMinimalistic2, Layers } from "@solar-icons/react";
import {
  ShadcnUiDark,
  ChakraUI,
  MaterialUI,
  AntDesign,
  DaisyUI,
  Mantine,
  Nodejs,
  PnpmDark,
  Yarn,
  Bun,
} from "@ridemountainpig/svgl-react";

export default function LibrariesGrid() {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (pm: "npm" | "pnpm" | "yarn" | "bun", libName: string) => {
    const command = LIBRARY_COMMANDS[libName]?.[pm];
    if (!command) return;

    navigator.clipboard.writeText(command);
    setCopiedId(`${libName}-${pm}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "shadcn":
        return (
          <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center p-2">
            <ShadcnUiDark className="w-10 h-10" />
          </div>
        );
      case "chakra":
        return <ChakraUI className="w-10 h-10" />;
      case "mui":
        return <MaterialUI className="w-10 h-10" />;
      case "antd":
        return <AntDesign className="w-10 h-10" />;
      case "daisyui":
        return <DaisyUI className="w-10 h-10" />;
      case "mantine":
        return <Mantine className="w-10 h-10" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-muted/20 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Layers weight="BoldDuotone" />
            <span className="text-sm font-medium text-foreground/80">
              Top-tier frameworks
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Component Libraries Used
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We've integrated the most popular and battle-tested UI libraries to
            give you a comprehensive comparison.
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* The Grid with Dividers */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-collapse">
            {LIBRARIES.map((lib, index) => (
              <div
                key={lib.name}
                className={`
                  group relative p-12 flex flex-col items-center justify-center text-center transition-colors duration-300 hover:bg-muted/30
                  ${index % 3 !== 2 ? "md:border-r border-border/60" : ""}
                  ${Math.floor(index / 3) < Math.floor((LIBRARIES.length - 1) / 3) ? "md:border-b border-border/60" : ""}
                  ${index < LIBRARIES.length - 1 ? "border-b md:border-b-0 border-border/60" : ""}
                `}
              >
                {/* Background Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-3xl pointer-events-none"
                  style={{ backgroundColor: lib.color }}
                />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
                    <div className="w-10 h-10 flex items-center justify-center">
                      {getIcon(lib.name)}
                    </div>
                  </div>
                  <h3 className="text-xl mb-2 group-hover:text-primary transition-colors duration-200">
                    {lib.displayName}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {[
                      { id: "npm", icon: Nodejs, label: "npm" },
                      { id: "pnpm", icon: PnpmDark, label: "pnpm" },
                      { id: "yarn", icon: Yarn, label: "Yarn" },
                      { id: "bun", icon: Bun, label: "Bun" },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        title={`Copy ${pm.label} command`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(pm.id as any, lib.name);
                        }}
                        className={`p-2 rounded-sm cursor-pointer hover:bg-muted/50 border transition-all duration-200 ${
                          copiedId === `${lib.name}-${pm.id}`
                            ? "border-green-500/50 text-green-500 bg-green-500/5"
                            : "border-border/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {copiedId === `${lib.name}-${pm.id}` ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <pm.icon className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <a
                  href={lib.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-sm absolute top-4 right-4 text-muted-foreground dark:hover:bg-white/5 hover:bg-black/5 hover:text-foreground transition-colors"
                  title={`Visit ${lib.displayName} website`}
                >
                  <LinkMinimalistic2 className="w-4 h-4" weight="BoldDuotone" />
                </a>
              </div>
            ))}
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white/40" />
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white/40" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white/40" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white/40" />
        </div>
      </div>
    </section>
  );
}
