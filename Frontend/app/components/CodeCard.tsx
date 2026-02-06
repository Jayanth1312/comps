import React, { useState } from "react";
import { Code, Eye, Copy, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneEarth } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

interface CodeCardProps {
  content: string;
  language?: string;
  previewComponent?: React.ReactNode;
  onExpandChange?: (isExpanded: boolean) => void;
}

export default function CodeCard({
  content,
  language = "tsx",
  previewComponent,
  onExpandChange,
}: CodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onExpandChange?.(newState);
  };

  return (
    <>
      {/* Card Component - Clickable */}
      <button
        onClick={handleToggleExpand}
        className="w-full rounded-2xl overflow-hidden shadow-sm bg-muted/30 border border-border/50 hover:border-primary/30 transition-all cursor-pointer text-left group"
      >
        {/* Card Header */}
        <div className="bg-muted/50 px-4 py-3 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <Code size={14} />
            {language}
          </div>
          <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
            Click to expand
          </div>
        </div>

        {/* Code Preview (truncated) */}
        <div className="p-4 max-h-[120px] overflow-hidden relative">
          <SyntaxHighlighter
            language={language}
            style={duotoneEarth}
            customStyle={{
              background: "transparent",
              margin: 0,
              padding: 0,
              fontSize: "13px",
            }}
            wrapLongLines={true}
          >
            {content.split("\n").slice(0, 4).join("\n")}
          </SyntaxHighlighter>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/30 to-transparent" />
        </div>
      </button>

      {/* Expanded Panel Header - Shows tabs when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/50 rounded-xl mt-2">
              <div className="flex items-center gap-2">
                {/* Tabs */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("code");
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-medium text-sm",
                    activeTab === "code"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <Code size={14} />
                  Code
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("preview");
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-medium text-sm",
                    activeTab === "preview"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <Eye size={14} />
                  Preview
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background hover:bg-muted transition-all text-sm font-medium shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
