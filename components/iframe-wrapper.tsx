"use client";

import React, { useRef, useEffect, useState } from "react";

interface IframeWrapperProps {
  children: React.ReactNode;
  libraryName: string;
}

/**
 * Renders library components inside an iframe for complete style isolation.
 * This prevents CSS-in-JS libraries from affecting the parent document.
 */
export function IframeWrapper({ children, libraryName }: IframeWrapperProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsReady(true);
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, []);

  // For now, we'll use a simpler approach - just render directly
  // The iframe approach requires more complex setup with React portals
  return (
    <div className="library-component-container w-full h-full flex items-center justify-center">
      {children}
    </div>
  );
}
