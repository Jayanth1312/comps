"use client";

import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import {
  Code,
  Eye,
  Box,
  Copy,
  Download,
  Unread,
  History,
} from "@solar-icons/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneEarth } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/dropdown-menu";
import SandboxEnvironment from "./SandboxEnvironment";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Minimize } from "@solar-icons/react";

interface CodeVariant {
  library: string;
  code: string;
  language: string;
}

interface CodeExpansionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  codeBlock?: {
    language: string;
    content: string;
  };
  variants?: CodeVariant[];
  selectedVariant?: CodeVariant;
  PreviewComponent?: React.ComponentType;
  width?: string;
  isResizing?: boolean;
  activeTab: "code" | "preview" | "sandbox";
  onActiveTabChange: (tab: "code" | "preview" | "sandbox") => void;
  messageId?: string;
}

const LIBRARY_ORDER = [
  "shadcn",
  "mui",
  "chakraui",
  "antd",
  "daisyui",
  "mantine",
];

export default function CodeExpansionPanel({
  isOpen,
  onClose,
  codeBlock,
  variants = [],
  selectedVariant,
  PreviewComponent,
  width = "50%",
  isResizing = false,
  activeTab,
  onActiveTabChange,
  messageId,
}: CodeExpansionPanelProps) {
  const [copied, setCopied] = useState(false);
  const isFullScreen = activeTab === "sandbox";

  // Memoize sorted variants to ensure consistent order
  const sortedVariants = React.useMemo(() => {
    if (variants.length === 0) return [];
    return [...variants].sort((a, b) => {
      const indexA = LIBRARY_ORDER.indexOf(a.library.toLowerCase());
      const indexB = LIBRARY_ORDER.indexOf(b.library.toLowerCase());

      // If both are in the known list, sort by index
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      // If only A is known, it comes first
      if (indexA !== -1) return -1;
      // If only B is known, it comes first
      if (indexB !== -1) return 1;
      // Otherwise sort alphabetically
      return a.library.localeCompare(b.library);
    });
  }, [variants]);

  // State for selected library
  const [selectedLibrary, setSelectedLibrary] = useState<string>(
    selectedVariant?.library ||
      (sortedVariants.length > 0 ? sortedVariants[0].library : "default"),
  );

  // Track reference values for stable sync
  const lastPropVariantRef = React.useRef<CodeVariant | undefined>(
    selectedVariant,
  );
  const lastMessageIdRef = React.useRef<string | undefined>(messageId);

  // Derived current variant (memoized to prevent infinite loops)
  const currentVariant = React.useMemo(() => {
    if (sortedVariants.length === 0) {
      return {
        library: "default",
        code: codeBlock?.content || "",
        language: codeBlock?.language || "tsx",
      };
    }
    return (
      sortedVariants.find(
        (v) => v.library.toLowerCase() === selectedLibrary.toLowerCase(),
      ) || sortedVariants[0]
    );
  }, [sortedVariants, selectedLibrary, codeBlock]);

  // Current code state
  const [currentCode, setCurrentCode] = useState(currentVariant.code);

  // Sync effect: Only triggers when the MESSAGE or the PARENT-SELECTED-VARIANT changes
  React.useEffect(() => {
    // 1. Message ID changed (AI follow-up)
    if (messageId !== lastMessageIdRef.current) {
      lastMessageIdRef.current = messageId;
      const match = sortedVariants.find(
        (v) => v.library.toLowerCase() === selectedLibrary.toLowerCase(),
      );
      if (match) {
        setCurrentCode(match.code);
      } else if (sortedVariants.length > 0) {
        setSelectedLibrary(sortedVariants[0].library);
        setCurrentCode(sortedVariants[0].code);
      }
      return;
    }

    // 2. Parent selection changed (User clicked a different card)
    if (selectedVariant !== lastPropVariantRef.current) {
      lastPropVariantRef.current = selectedVariant;
      if (selectedVariant) {
        setSelectedLibrary(selectedVariant.library);
        setCurrentCode(selectedVariant.code);
      }
    }
  }, [selectedVariant, sortedVariants, messageId, selectedLibrary]);

  // Unified handler for local choice
  const handleLibraryChange = (lib: string) => {
    setSelectedLibrary(lib);
    const v = sortedVariants.find(
      (v) => v.library.toLowerCase() === lib.toLowerCase(),
    );
    if (v) setCurrentCode(v.code);
  };

  const handleCopy = () => {
    if (currentCode) {
      navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (codeBlock && currentCode) {
      const { language } = codeBlock;
      const blob = new Blob([currentCode], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext =
        language.toLowerCase() === "tsx" ||
        language.toLowerCase() === "typescript"
          ? "tsx"
          : language.toLowerCase() === "jsx" ||
              language.toLowerCase() === "javascript"
            ? "jsx"
            : language.toLowerCase();

      a.download = `ComponentName.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const { resolvedTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && codeBlock && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={
            isResizing
              ? { duration: 0 }
              : { type: "spring", damping: 30, stiffness: 300 }
          }
          className={cn(
            "fixed right-0 top-0 bottom-0 bg-background border-l border-border flex flex-col z-50",
            isFullScreen ? "w-full min-w-0" : "min-w-[520px]",
          )}
          style={{ width: isFullScreen ? "100%" : width }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-background gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {/* Tab Switcher (Pill Style) */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex bg-muted/30 rounded-md border border-border/50 p-1 relative">
                  {/* Code Tab */}
                  <button
                    onClick={() => onActiveTabChange("code")}
                    className={cn(
                      "relative w-9 h-9 flex items-center justify-center transition-colors cursor-pointer rounded-sm",
                      activeTab === "code"
                        ? "text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {activeTab === "code" && (
                      <motion.div
                        layoutId="switcherIndicator"
                        className="absolute inset-0 bg-foreground rounded-sm"
                        transition={
                          isResizing
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                bounce: 0,
                                duration: 0.3,
                              }
                        }
                      />
                    )}
                    <Code
                      weight="BoldDuotone"
                      size={18}
                      className="relative z-10"
                    />
                  </button>

                  {/* Preview Tab */}
                  <button
                    onClick={() => onActiveTabChange("preview")}
                    className={cn(
                      "relative w-9 h-9 flex items-center justify-center transition-colors cursor-pointer rounded-sm",
                      activeTab === "preview"
                        ? "text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {activeTab === "preview" && (
                      <motion.div
                        layoutId="switcherIndicator"
                        className="absolute inset-0 bg-foreground rounded-sm"
                        transition={
                          isResizing
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                bounce: 0,
                                duration: 0.3,
                              }
                        }
                      />
                    )}
                    <Eye
                      weight="LineDuotone"
                      size={18}
                      className="relative z-10"
                    />
                  </button>

                  {/* Sandbox Tab */}
                  <button
                    onClick={() => onActiveTabChange("sandbox")}
                    className={cn(
                      "relative w-9 h-9 flex items-center justify-center transition-colors cursor-pointer rounded-sm",
                      activeTab === "sandbox"
                        ? "text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {activeTab === "sandbox" && (
                      <motion.div
                        layoutId="switcherIndicator"
                        className="absolute inset-0 bg-foreground rounded-sm"
                        transition={
                          isResizing
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                bounce: 0,
                                duration: 0.3,
                              }
                        }
                      />
                    )}
                    <Box
                      weight="BoldDuotone"
                      size={18}
                      className="relative z-10"
                    />
                  </button>
                </div>

                {/* Component Info Label  */}
                <div className="hidden sm:flex items-center gap-1.5 text-[15px] font-medium truncate">
                  <span className="text-foreground">Page</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-muted-foreground uppercase">
                    {codeBlock.language}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isFullScreen && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onActiveTabChange("code")}
                        className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-muted transition-all cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        <Minimize weight="BoldDuotone" size={20} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Exit Full Screen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <div className="flex items-center bg-muted/30 rounded-md border border-border/50 overflow-hidden h-10">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 h-full hover:bg-muted/50 transition-all text-sm font-medium cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Unread
                        weight="BoldDuotone"
                        className="text-green-500"
                        size={16}
                      />
                      <span className="text-green-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy weight="LineDuotone" size={16} />
                      Copy
                    </>
                  )}
                </button>
                <div className="w-px h-6 bg-border/50" />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-2.5 h-full hover:bg-muted/50 transition-all cursor-pointer flex items-center justify-center">
                      <ChevronDown
                        size={16}
                        className="text-muted-foreground"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={handleDownload}
                      className="cursor-pointer"
                    >
                      <Download
                        weight="LineDuotone"
                        size={16}
                        className="mr-2"
                      />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <History
                        weight="LineDuotone"
                        size={16}
                        className="mr-2"
                      />
                      Publish
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {variants.length > 0 && (
                <div className="flex items-center bg-muted/30 rounded-md border border-border/50 overflow-hidden h-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 px-3 h-full hover:bg-muted/50 transition-all text-sm font-medium cursor-pointer">
                        <span className="capitalize">{selectedLibrary}</span>
                        <ChevronDown
                          size={14}
                          className="text-muted-foreground ml-1"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-1">
                      {sortedVariants.map((v) => (
                        <DropdownMenuItem
                          key={v.library}
                          onClick={() => handleLibraryChange(v.library)}
                          className={cn(
                            "cursor-pointer capitalize text-sm",
                            selectedLibrary.toLowerCase() ===
                              v.library.toLowerCase() &&
                              "bg-muted font-bold text-primary",
                          )}
                        >
                          {v.library}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-muted transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            className={cn(
              "flex-1 bg-background",
              isFullScreen ? "overflow-hidden flex flex-col" : "overflow-auto",
            )}
          >
            {/* Code Tab */}
            <div
              className={cn(
                "h-full w-full",
                activeTab === "code" ? "block" : "hidden",
              )}
            >
              <SyntaxHighlighter
                language={currentVariant.language}
                style={duotoneEarth}
                customStyle={{
                  background: "transparent",
                  margin: 0,
                  padding: "1.5rem",
                  fontSize: "14px",
                  width: "100%",
                  minHeight: "100%",
                  overflow: "visible",
                }}
                showLineNumbers={true}
                wrapLongLines={true}
              >
                {currentCode}
              </SyntaxHighlighter>
            </div>

            {/* Preview & Sandbox Tab */}
            <div
              className={cn(
                "h-full w-full",
                activeTab === "preview" || activeTab === "sandbox"
                  ? "block"
                  : "hidden",
              )}
            >
              <SandboxEnvironment
                key={`${messageId}-${selectedLibrary}-${resolvedTheme}`} // Force re-mount on message, library OR theme change
                code={currentCode}
                language={currentVariant.language}
                onCodeChange={setCurrentCode}
                mode={activeTab === "sandbox" ? "full" : "preview"}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
