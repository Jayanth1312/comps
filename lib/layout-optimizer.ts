import { ComponentInfo } from "@/types/component-data";

// Define layout patterns for different sorting scenarios
export interface LayoutPattern {
  cols: number;
  rows: number;
}

// Optimized layout patterns for alphabetical sorting
// This creates a more uniform grid that flows better visually
const ALPHABETICAL_LAYOUTS: LayoutPattern[] = [
  { cols: 3, rows: 2 }, // Button
  { cols: 6, rows: 2 }, // Input
  { cols: 6, rows: 4 }, // Card
  { cols: 6, rows: 2 }, // Slider
  { cols: 3, rows: 2 }, // Badge
  { cols: 3, rows: 2 }, // Checkbox
  { cols: 3, rows: 2 }, // Switch
  { cols: 3, rows: 2 }, // Avatar
  { cols: 3, rows: 2 }, // Alert
  { cols: 6, rows: 4 }, // Accordion
  { cols: 6, rows: 4 }, // Calendar
  { cols: 6, rows: 2 }, // Pagination
  { cols: 6, rows: 4 }, // Tabs
  { cols: 6, rows: 2 }, // Progress
  { cols: 6, rows: 4 }, // Table
  { cols: 3, rows: 2 }, // Popover
  { cols: 3, rows: 2 }, // Tooltip
  { cols: 6, rows: 4 }, // Skeleton
  { cols: 3, rows: 4 }, // Command
  { cols: 3, rows: 4 }, // Dialog
];

// Balanced layout for popularity/favorites sorting
const BALANCED_LAYOUTS: LayoutPattern[] = [
  { cols: 6, rows: 2 },
  { cols: 3, rows: 2 },
  { cols: 3, rows: 2 },
  { cols: 6, rows: 4 },
  { cols: 3, rows: 2 },
  { cols: 6, rows: 2 },
  { cols: 3, rows: 4 },
  { cols: 3, rows: 2 },
  { cols: 6, rows: 4 },
  { cols: 3, rows: 2 },
  { cols: 6, rows: 2 },
  { cols: 3, rows: 4 },
  { cols: 6, rows: 4 },
  { cols: 3, rows: 2 },
  { cols: 6, rows: 2 },
  { cols: 3, rows: 2 },
  { cols: 6, rows: 4 },
  { cols: 3, rows: 2 },
  { cols: 3, rows: 2 },
  { cols: 6, rows: 2 },
];

export function getOptimizedLayout(
  index: number,
  sortBy: "a-z" | "z-a" | "popularity" | "favorites",
  totalComponents: number,
): LayoutPattern {
  // For alphabetical sorting, use optimized alphabetical layouts
  if (sortBy === "a-z" || sortBy === "z-a") {
    return ALPHABETICAL_LAYOUTS[index % ALPHABETICAL_LAYOUTS.length];
  }

  // For popularity and favorites, use balanced layouts
  return BALANCED_LAYOUTS[index % BALANCED_LAYOUTS.length];
}

// Alternative: Keep original sizes but optimize placement
export function shouldUseOriginalLayout(
  sortBy: "a-z" | "z-a" | "popularity" | "favorites",
): boolean {
  // You can toggle this to switch between dynamic and original layouts
  return false; // Set to true to use original component sizes
}
