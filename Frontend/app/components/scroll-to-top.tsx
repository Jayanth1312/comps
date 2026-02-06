"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "@solar-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50">
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="p-3 rounded-md bg-muted/20 backdrop-blur-sm border border-border/50 hover:bg-muted/30 transition-all duration-300 flex items-center justify-center cursor-pointer group shadow-lg"
            aria-label="Scroll to top"
          >
            <ArrowUp
              weight="BoldDuotone"
              size={22}
              className="text-foreground transition-colors"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
