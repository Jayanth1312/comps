"use client";

import React, { useState, useEffect } from "react";
import { Sun2, MoonStars } from "@solar-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = savedTheme ? savedTheme === "dark" : prefersDark;

    setIsDark(initialTheme);
    document.documentElement.setAttribute(
      "data-theme",
      initialTheme ? "dark" : "light",
    );
    if (initialTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      newTheme ? "dark" : "light",
    );
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-md bg-muted/20 backdrop-blur-sm border border-border/50 hover:bg-muted/30 transition-all duration-300 flex items-center justify-center cursor-pointer group"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex items-center justify-center text-foreground"
        >
          {isDark ? (
            <Sun2
              weight="BoldDuotone"
              size={22}
              className="group-hover:text-amber-400 transition-colors"
            />
          ) : (
            <MoonStars
              weight="BoldDuotone"
              size={22}
              className="group-hover:text-blue-600 transition-colors"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
