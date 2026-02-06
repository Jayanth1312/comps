"use client";

import React from "react";

interface LibraryStylesLoaderProps {
  children: React.ReactNode;
}

/**
 * LibraryStylesLoader wraps library components in a scoped container.
 * The actual CSS is loaded via the registry files.
 */
export function LibraryStylesLoader({ children }: LibraryStylesLoaderProps) {
  return (
    <div className="library-components-wrapper library-preview-container">
      {children}
    </div>
  );
}
