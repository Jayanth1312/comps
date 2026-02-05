"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ShadowDOMWrapperProps {
  children: React.ReactNode;
}

/**
 * Wraps children in a Shadow DOM to completely isolate library styles
 * from the main application.
 */
export function ShadowDOMWrapper({ children }: ShadowDOMWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.shadowRoot) {
      const shadow = containerRef.current.attachShadow({ mode: "open" });

      // Add minimal styles for the shadow DOM container
      const style = document.createElement("style");
      style.textContent = `
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: transparent;
        }
        .shadow-content {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
      `;
      shadow.appendChild(style);

      // Create a container div for React portal
      const contentDiv = document.createElement("div");
      contentDiv.className = "shadow-content";
      shadow.appendChild(contentDiv);

      setShadowRoot(shadow);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="shadow-dom-host w-full h-full flex items-center justify-center"
    >
      {shadowRoot &&
        createPortal(
          children,
          shadowRoot.querySelector(".shadow-content") as Element,
        )}
    </div>
  );
}
