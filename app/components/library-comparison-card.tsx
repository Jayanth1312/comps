"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { LibraryInfo } from "@/types/component-data";
import { getComponentExample } from "@/lib/component-registry";
import { Code2, Copy, Check } from "lucide-react";

interface LibraryComparisonCardProps {
  library: LibraryInfo;
  componentSlug: string;
}

export default function LibraryComparisonCard({
  library,
  componentSlug,
}: LibraryComparisonCardProps) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const example = getComponentExample(library.name, componentSlug);

  const handleCopy = async () => {
    if (example?.code) {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!example) {
    return (
      <div className="library-comparison-card">
        <div className="library-comparison-header">
          <div className="library-name-wrapper">
            <span
              className="library-color-badge"
              style={{ backgroundColor: library.color }}
            />
            <span className="library-name-text">{library.displayName}</span>
          </div>
        </div>
        <div className="component-demo-area">
          <p className="text-sm text-muted-foreground">
            Component not available
          </p>
        </div>
      </div>
    );
  }

  // Hydration fix: Only render the component on the client
  const [isMounted, setIsMounted] = useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="library-comparison-card">
      {/* Component Demo Area */}
      <div className="component-demo-area">
        <div className="component-demo-content">
          {isMounted ? (
            example.component
          ) : (
            <div className="h-10 w-full animate-pulse bg-muted rounded"></div>
          )}
        </div>
      </div>

      {/* Code Section */}
      <div className="code-section-wrapper">
        <button
          className="code-toggle-button"
          onClick={() => setShowCode(!showCode)}
        >
          <div className="code-toggle-content">
            <Code2 size={16} strokeWidth={2} />
            <span>View Code</span>
          </div>
          <button
            className="copy-code-button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            {copied ? (
              <Check size={14} strokeWidth={2} />
            ) : (
              <Copy size={14} strokeWidth={2} />
            )}
          </button>
        </button>

        {showCode && (
          <div className="code-display-area">
            <SyntaxHighlighter
              language="tsx"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1.25rem",
                fontSize: "0.8125rem",
                lineHeight: "1.6",
                borderRadius: 0,
                background: "transparent",
              }}
              showLineNumbers
            >
              {example.code}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
}
