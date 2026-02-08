"use client";

import React, { useState } from "react";
import { Stars, Plain, CloseCircle } from "@solar-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface AIEditPanelProps {
  onSubmit: (instruction: string) => void;
  isLoading: boolean;
  onClose: () => void;
}

export default function AIEditPanel({
  onSubmit,
  isLoading,
  onClose,
}: AIEditPanelProps) {
  const [instruction, setInstruction] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instruction.trim()) {
      onSubmit(instruction);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-4 left-4 right-4 z-30"
      >
        <div className="relative overflow-hidden rounded-xl border border-white/20 bg-background/80 p-1 shadow-lg backdrop-blur-md">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-1 relative"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Stars size={20} weight="BoldDuotone" />
            </div>
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Ask AI to change styles (e.g., 'Make it red')..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
              autoFocus
              disabled={isLoading}
            />
            <div className="flex items-center gap-1 shrink-0">
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <button
                  type="submit"
                  disabled={!instruction.trim()}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plain size={20} weight="BoldDuotone" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Close AI Edit"
              >
                <CloseCircle size={20} weight="BoldDuotone" />
              </button>
            </div>
          </form>
          {/* Animated gradient border/glow effect */}
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary/10 via-purple-500/10 to-primary/10 opacity-50 blur-xl pointer-events-none" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
