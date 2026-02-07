import React, { useState } from "react";
import { Code, Download, AltArrowDown } from "@solar-icons/react";
import { Dot } from "lucide-react";

interface CodeVariant {
  library: string;
  code: string;
  language: string;
}

interface CodeCardProps {
  name?: string;
  // Legacy props (optional now)
  language?: string;
  code?: string;
  // New prop for multiple variants
  variants?: CodeVariant[];
  onExpand: (selectedVariant: CodeVariant) => void;
}

const LIBRARY_ORDER = [
  "shadcn",
  "mui",
  "chakraui",
  "antd",
  "daisyui",
  "mantine",
];

export default function CodeCard({
  name = "ComponentName",
  language = "tsx",
  code = "",
  variants = [],
  onExpand,
}: CodeCardProps) {
  // Determine if we have variants or just a single code block
  const hasVariants = variants.length > 0;

  // Memoize sorted variants to ensure consistent order
  const sortedVariants = React.useMemo(() => {
    if (!hasVariants) return [];
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
  }, [variants, hasVariants]);

  // Default to first sorted variant or the single code prop
  const [selectedLibrary, setSelectedLibrary] = useState<string>(
    hasVariants ? sortedVariants[0].library : "default",
  );

  // Sync state when variants change (e.g. AI re-generates or new message loaded)
  // BUT only reset if the currently selected library is no longer valid
  React.useEffect(() => {
    if (hasVariants && sortedVariants.length > 0) {
      const isCurrentValid = sortedVariants.some(
        (v) => v.library === selectedLibrary,
      );
      if (!isCurrentValid) {
        setSelectedLibrary(sortedVariants[0].library);
      }
    }
  }, [sortedVariants, hasVariants, selectedLibrary]);

  const currentVariant = hasVariants
    ? sortedVariants.find((v) => v.library === selectedLibrary) ||
      sortedVariants[0]
    : { library: "default", code, language };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([currentVariant.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Determine extension
    const ext =
      currentVariant.language.toLowerCase() === "tsx" ||
      currentVariant.language.toLowerCase() === "typescript"
        ? "tsx"
        : currentVariant.language.toLowerCase() === "jsx" ||
            currentVariant.language.toLowerCase() === "javascript"
          ? "jsx"
          : currentVariant.language.toLowerCase();

    a.download = `${name}-${currentVariant.library}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={() => onExpand(currentVariant)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 hover:border-border/80 transition-all duration-300 cursor-pointer w-full max-w-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border/40 bg-muted/10">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Code weight="BoldDuotone" size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate max-w-full">
              {name}
            </h3>
            <div className="text-xs text-muted-foreground flex items-center">
              <span>Code</span>
              <Dot />
              <span>{currentVariant.language.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="shrink-0 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors z-20 cursor-pointer"
          title="Download Code"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
}
