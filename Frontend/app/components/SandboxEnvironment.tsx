"use client";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import { useTheme } from "next-themes";
import React, { useMemo } from "react";
import { ecoLight, gruvboxDark } from "@codesandbox/sandpack-themes";

interface SandboxEnvironmentProps {
  code: string;
  language?: string;
  onCodeChange?: (code: string) => void;
}

function SandpackListener({
  onCodeChange,
}: {
  onCodeChange?: (code: string) => void;
}) {
  const { sandpack } = useSandpack();
  const { files, activeFile } = sandpack;
  const latestCodeRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    latestCodeRef.current = files[activeFile]?.code;
  }, [files, activeFile]);

  React.useEffect(() => {
    const currentCode = files[activeFile]?.code;
    if (!currentCode || !onCodeChange) return;

    // Debounce the update to prevent high-frequency re-renders in parent
    const timer = setTimeout(() => {
      onCodeChange(currentCode);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (latestCodeRef.current && latestCodeRef.current !== currentCode) {
        onCodeChange(latestCodeRef.current);
      }
    };
  }, [files, activeFile, onCodeChange]);

  return null;
}

export default function SandboxEnvironment({
  code,
  language = "tsx",
  onCodeChange,
  mode = "full",
}: SandboxEnvironmentProps & { mode?: "full" | "preview" | "code" }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use useMemo for files so it updates when code prop changes
  const files = React.useMemo(() => {
    return {
      "/App.tsx": code,
    };
  }, [code]);

  const sandpackTheme = useMemo(() => {
    // Extra fallback check for "dark" class on document
    const isDark =
      resolvedTheme === "dark" ||
      (typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark"));
    return isDark ? gruvboxDark : ecoLight;
  }, [resolvedTheme]);

  const options = React.useMemo(
    () => ({
      externalResources: ["https://cdn.tailwindcss.com"],
      classes: {
        "sp-wrapper": "custom-wrapper",
        "sp-layout": "custom-layout",
        "sp-tab-button": "!font-sans",
      },
    }),
    [],
  );

  const customSetup = React.useMemo(
    () => ({
      dependencies: {
        "lucide-react": "latest",
        "@solar-icons/react": "latest",
        "framer-motion": "latest",
        clsx: "latest",
        "tailwind-merge": "latest",
        "@mui/material": "latest",
        "@emotion/react": "latest",
        "@emotion/styled": "latest",
        "@chakra-ui/react": "latest",
        antd: "latest",
        "@mantine/core": "latest",
        "@mantine/hooks": "latest",
      },
    }),
    [],
  );

  if (!mounted) return null;

  return (
    <div className="h-full w-full flex flex-col bg-background relative isolate">
      <style jsx global>{`
        .sp-wrapper {
          height: 100% !important;
          width: 100% !important;
        }
        .sp-layout {
          height: 100% !important;
          width: 100% !important;
          border-radius: 0 !important;
          border: none !important;
        }

        /* Custom Resizer Styling */
        .sp-resize-handler {
          background: transparent !important;
          width: 10px !important;
          margin: 0 -5px !important;
          position: relative;
          z-index: 20;
          cursor: col-resize;
          display: ${mode === "full" ? "block" : "none"} !important;
        }

        /* The visible pill handle */
        .sp-resize-handler::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 48px;
          background-color: var(--border);
          border-radius: 4px;
          transition:
            background-color 0.2s ease,
            transform 0.2s ease;
          opacity: 0.6;
        }

        .sp-resize-handler:hover::after,
        .sp-resize-handler[data-active="true"]::after {
          background-color: var(--primary);
          transform: translate(-50%, -50%) scaleX(1.5);
          opacity: 1;
        }

        /* Ensure all nested stacks take full height */
        .sp-stack,
        .sp-code-editor,
        .sp-preview-container,
        .cm-editor {
          height: 100% !important;
        }

        .sp-code-editor {
          flex: 1;
          min-width: 0;
        }

        .sp-preview-container {
          flex: 1;
          min-width: 0;
        }
      `}</style>

      <SandpackProvider
        template="react-ts"
        theme={sandpackTheme}
        files={files}
        options={options}
        customSetup={customSetup}
      >
        <SandpackListener onCodeChange={onCodeChange} />
        <SandpackLayout>
          {(mode === "full" || mode === "code") && (
            <SandpackCodeEditor
              showLineNumbers
              showInlineErrors
              wrapContent
              closableTabs={false}
              showTabs={true}
            />
          )}
          {(mode === "full" || mode === "preview") && (
            <SandpackPreview
              showNavigator={true}
              showRefreshButton={true}
              showOpenInCodeSandbox={false}
            />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
