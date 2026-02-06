"use client";

import { SortProvider } from "@/contexts/sort-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { ReactNode } from "react";
import "../libraries.css";

export default function CompareLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SortProvider>{children}</SortProvider>
    </ThemeProvider>
  );
}
