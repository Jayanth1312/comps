"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

type IframePreviewProps = {
  code: string;
  library: string;
  className?: string;
};

const SANDBOX_URL = "http://localhost:3002";

export default function IframePreview({
  code,
  library,
  className = "",
}: IframePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { resolvedTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSandboxReady, setIsSandboxReady] = useState(false);

  /* ---------------- message listener ---------------- */
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // Filter origins for security in production
      // if (e.origin !== "http://localhost:3002") return;

      const { type, error: errorMsg } = e.data || {};

      if (type === "sandbox-ready") {
        console.log("Sandbox is ready");
        setIsSandboxReady(true);
      } else if (type === "preview-loaded") {
        setLoading(false);
        setError(null);
      } else if (type === "preview-error") {
        setLoading(false);
        setError(errorMsg || "Preview crashed");
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  /* ---------------- sync code ---------------- */
  useEffect(() => {
    if (!iframeRef.current || !code) return;

    // If sandbox isn't ready, we wait. The iframe will signal "sandbox-ready" on load
    // But if we hot-reload, the iframe might already be loaded.
    // We can also retry sending code periodically if needed, or rely on onLoad.

    const sendCode = () => {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "update-code", code }, "*");
      }
    };

    // Send immediately via postMessage if we think it's ready, or just try
    // Just blindly sending is often robust enough for prototyping
    sendCode();

    // Also set loading true when code changes
    setLoading(true);

    // Timeout safety
    const t = setTimeout(() => {
      // If still loading after 5s, maybe sandbox died or never replied
      // But we don't want to flash error if it's just slow
    }, 5000);

    return () => clearTimeout(t);
  }, [code, library, resolvedTheme, isSandboxReady]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsSandboxReady(true);
    // Resend code just in case
    if (iframeRef.current && code) {
      iframeRef.current.contentWindow?.postMessage(
        { type: "update-code", code },
        "*",
      );
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className={`relative h-full w-full ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-sm bg-white dark:bg-slate-900 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-blue-500 rounded-full" />
            <span>Loading Sandbox...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900 p-4 z-20">
          <div className="text-center max-w-md h-full">
            <div className="text-red-500 text-sm font-medium mb-2">
              Preview Error
            </div>
            <pre className="text-xs text-left text-gray-600 dark:text-gray-400 overflow-auto max-h-[200px]">
              {error}
            </pre>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={SANDBOX_URL}
        className="w-full h-full border-0"
        title="Preview"
        onLoad={handleIframeLoad}
        // Allow same-origin for easy messaging if on same domain, but here different ports
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
