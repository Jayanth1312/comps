import React from "react";
import { motion } from "framer-motion";

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
