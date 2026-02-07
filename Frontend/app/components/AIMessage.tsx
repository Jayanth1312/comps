import React from "react";
import { motion } from "framer-motion";
import { Stars } from "@solar-icons/react";

interface AIMessageProps {
  content: string;
  children?: React.ReactNode;
}

export default function AIMessage({ content, children }: AIMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 md:gap-4 justify-start"
    >
      {/* AI Avatar */}
      <div className="shrink-0 pt-2">
        <div className="w-8 h-8 rounded-md bg-muted/50 border border-border flex items-center justify-center relative group">
          <Stars weight="BoldDuotone" size={18} className="text-nutral-500" />
        </div>
      </div>

      {/* Message Container */}
      <div className="flex flex-col gap-3 max-w-full md:max-w-full">
        {/* Text Content */}
        {content && (
          <div className="py-3">
            <p className="whitespace-pre-wrap leading-relaxed text-md">
              {content}
            </p>
          </div>
        )}

        {/* Embedded Components (like code cards) */}
        {children}
      </div>
    </motion.div>
  );
}
