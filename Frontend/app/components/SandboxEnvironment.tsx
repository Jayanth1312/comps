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
  library?: string;
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
  library = "default",
  language = "tsx",
  onCodeChange,
  mode = "full",
}: SandboxEnvironmentProps & { mode?: "full" | "preview" | "code" }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use useMemo for files so it updates when code or library changes
  const files = React.useMemo(() => {
    const lib = library.toLowerCase();

    // Determine the wrapper code for Providers
    let appCode = "";

    if (lib === "mui" || lib.includes("material")) {
      appCode = `
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import * as ComponentModule from './Component';

const Component = ComponentModule.default ||
                 Object.entries(ComponentModule).find(([key, val]) => typeof val === 'function' && /^[A-Z]/.test(key) && key !== 'Icon' && key !== 'cn')?.[1] ||
                 Object.values(ComponentModule).find(val => typeof val === 'function');
const theme = createTheme({
  palette: {
    mode: '${resolvedTheme === "dark" ? "dark" : "light"}',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '2rem', minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Component ? <Component /> : <div>Component not found</div>}
      </div>
    </ThemeProvider>
  );
}`;
    } else if (lib === "chakra" || lib === "chakraui") {
      appCode = `
import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import * as ComponentModule from './Component';

// Improved component discovery: find the default export first, then the first capitalized function
const Component = ComponentModule.default ||
                 Object.entries(ComponentModule).find(([key, val]) => typeof val === 'function' && /^[A-Z]/.test(key) && key !== 'Icon' && key !== 'cn')?.[1] ||
                 Object.values(ComponentModule).find(val => typeof val === 'function');

export default function App() {
  return (
    <ChakraProvider>
      <div style={{ padding: '2rem', minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Component ? <Component /> : <div>Component not found</div>}
      </div>
    </ChakraProvider>
  );
}`;
    } else if (lib === "mantine") {
      appCode = `
import React from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import * as ComponentModule from './Component';

const Component = ComponentModule.default ||
                 Object.entries(ComponentModule).find(([key, val]) => typeof val === 'function' && /^[A-Z]/.test(key) && key !== 'Icon' && key !== 'cn')?.[1] ||
                 Object.values(ComponentModule).find(val => typeof val === 'function');

export default function App() {
  return (
    <MantineProvider forceColorScheme="${resolvedTheme === "dark" ? "dark" : "light"}">
      <div style={{ padding: '2rem', minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Component ? <Component /> : <div>Component not found</div>}
      </div>
    </MantineProvider>
  );
}`;
    } else if (lib === "antd") {
      appCode = `
import React from 'react';
import { ConfigProvider, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import * as ComponentModule from './Component';

const Component = ComponentModule.default ||
                 Object.entries(ComponentModule).find(([key, val]) => typeof val === 'function' && /^[A-Z]/.test(key) && key !== 'Icon' && key !== 'cn')?.[1] ||
                 Object.values(ComponentModule).find(val => typeof val === 'function');

export default function App() {
  return (
    <ConfigProvider
      locale={enUS}
      theme={{ algorithm: theme.${resolvedTheme === "dark" ? "darkAlgorithm" : "defaultAlgorithm"} }}
    >
      <div style={{ padding: '2rem', minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Component ? <Component /> : <div>Component not found</div>}
      </div>
    </ConfigProvider>
  );
}`;
    } else {
      // Default / Shadcn / DaisyUI path
      appCode = `
import React from 'react';
import * as ComponentModule from './Component';

const Component = ComponentModule.default ||
                 Object.entries(ComponentModule).find(([key, val]) => typeof val === 'function' && /^[A-Z]/.test(key) && key !== 'Icon' && key !== 'cn')?.[1] ||
                 Object.values(ComponentModule).find(val => typeof val === 'function');

export default function App() {
  return (
    <div className="${resolvedTheme === "dark" ? "dark" : ""}" style={{ padding: '2rem', minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {Component ? <Component /> : <div>Component not found</div>}
    </div>
  );
}`;
    }

    return {
      "/App.tsx": appCode,
      "/index.tsx": `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);`,
      "/Component.tsx": code,
      "/lib/utils.ts": `
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
      "/public/index.html": `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sandbox</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              border: "hsl(var(--border))",
              input: "hsl(var(--input))",
              ring: "hsl(var(--ring))",
              background: "hsl(var(--background))",
              foreground: "hsl(var(--foreground))",
              primary: {
                DEFAULT: "hsl(var(--primary))",
                foreground: "hsl(var(--primary-foreground))",
              },
              secondary: {
                DEFAULT: "hsl(var(--secondary))",
                foreground: "hsl(var(--secondary-foreground))",
              },
              destructive: {
                DEFAULT: "hsl(var(--destructive))",
                foreground: "hsl(var(--destructive-foreground))",
              },
              muted: {
                DEFAULT: "hsl(var(--muted))",
                foreground: "hsl(var(--muted-foreground))",
              },
              accent: {
                DEFAULT: "hsl(var(--accent))",
                foreground: "hsl(var(--accent-foreground))",
              },
              popover: {
                DEFAULT: "hsl(var(--popover))",
                foreground: "hsl(var(--popover-foreground))",
              },
              card: {
                DEFAULT: "hsl(var(--card))",
                foreground: "hsl(var(--card-foreground))",
              },
            },
            borderRadius: {
              lg: "var(--radius)",
              md: "calc(var(--radius) - 2px)",
              sm: "calc(var(--radius) - 4px)",
            },
          },
        },
      }
    </script>
    <style type="text/css">
      :root {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        --card: 0 0% 100%;
        --card-foreground: 222.2 84% 4.9%;
        --popover: 0 0% 100%;
        --popover-foreground: 222.2 84% 4.9%;
        --primary: 222.2 47.4% 11.2%;
        --primary-foreground: 210 40% 98%;
        --secondary: 210 40% 96.1%;
        --secondary-foreground: 222.2 47.4% 11.2%;
        --muted: 210 40% 96.1%;
        --muted-foreground: 215.4 16.3% 46.9%;
        --accent: 210 40% 96.1%;
        --accent-foreground: 222.2 47.4% 11.2%;
        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 210 40% 98%;
        --border: 214.3 32% 91.4%;
        --input: 214.3 32% 91.4%;
        --ring: 222.2 84% 4.9%;
        --radius: 0.5rem;
      }
      .dark {
        --background: 222.2 84% 4.9%;
        --foreground: 210 40% 98%;
        --card: 222.2 84% 4.9%;
        --card-foreground: 210 40% 98%;
        --popover: 222.2 84% 4.9%;
        --popover-foreground: 210 40% 98%;
        --primary: 210 40% 98%;
        --primary-foreground: 222.2 47.4% 11.2%;
        --secondary: 217.2 32.6% 17.5%;
        --secondary-foreground: 210 40% 98%;
        --muted: 217.2 32.6% 17.5%;
        --muted-foreground: 215 20.2% 65.1%;
        --accent: 217.2 32.6% 17.5%;
        --accent-foreground: 210 40% 98%;
        --destructive: 0 62.8% 30.6%;
        --destructive-foreground: 210 40% 98%;
        --border: 217.2 32.6% 17.5%;
        --input: 217.2 32.6% 17.5%;
        --ring: 212.7 26.8% 83.9%;
      }
    </style>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css" rel="stylesheet" type="text/css" />
  </head>
  <body class="${resolvedTheme === "dark" ? "dark" : ""}" style="background: transparent;">
    <div id="root"></div>
  </body>
</html>
      `,
    };
  }, [code, library, resolvedTheme]);

  const sandpackTheme = useMemo(() => {
    const isDark =
      resolvedTheme === "dark" ||
      (typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark"));
    return isDark ? gruvboxDark : ecoLight;
  }, [resolvedTheme]);

  const options = React.useMemo(
    () => ({
      externalResources: ["https://cdn.tailwindcss.com"],
      bundlerTimeout: 100000,
      classes: {
        "sp-wrapper": "custom-wrapper",
        "sp-layout": "custom-layout",
        "sp-tab-button": "!font-sans",
      },
      // Ensure the entry point is correctly set for our file structure
      main: "/index.tsx",
    }),
    [],
  );

  const customSetup = React.useMemo(() => {
    const lib = library.toLowerCase();

    // Shared base dependencies for ALL sandboxes
    const baseDeps = {
      "@tabler/icons-react": "latest",
      clsx: "latest",
      "tailwind-merge": "latest",
    };

    let specificDeps = {};

    if (lib === "mui" || lib.includes("material")) {
      specificDeps = {
        "@mui/material": "^5.15.11",
        "@mui/icons-material": "^5.15.11",
        "@emotion/react": "^11.11.3",
        "@emotion/styled": "^11.11.0",
      };
    } else if (lib === "chakra" || lib === "chakraui") {
      specificDeps = {
        "@chakra-ui/react": "^2.8.2",
        "@emotion/react": "^11.11.3",
        "@emotion/styled": "^11.11.0",
        "framer-motion": "^10.18.0",
      };
    } else if (lib === "antd") {
      specificDeps = {
        antd: "^5.15.0",
        dayjs: "^1.11.10",
        "@ant-design/icons": "^5.3.0",
      };
    } else if (lib === "mantine") {
      specificDeps = {
        "@mantine/core": "^7.1.0",
        "@mantine/hooks": "^7.1.0",
        "@mantine/dates": "^7.1.0",
        "date-fns": "^3.3.0",
        clsx: "latest",
      };
    } else if (lib === "daisyui" || lib === "shadcn") {
      specificDeps = {
        "react-daisyui": "^5.0.0",
        "@radix-ui/react-slot": "^1.0.2",
        "@radix-ui/react-dropdown-menu": "^2.0.6",
        "@radix-ui/react-dialog": "^1.0.5",
        "@radix-ui/react-tabs": "^1.0.4",
        "@radix-ui/react-popover": "^1.0.7",
        "@radix-ui/react-tooltip": "^1.0.7",
        "@radix-ui/react-select": "^2.0.0",
        "@radix-ui/react-checkbox": "^1.0.4",
        "@radix-ui/react-label": "^2.0.2",
        "@radix-ui/react-avatar": "^1.0.4",
        "@radix-ui/react-separator": "^1.0.3",
        "@radix-ui/react-scroll-area": "^1.0.5",
        "@radix-ui/react-accordion": "^1.1.2",
        "@radix-ui/react-collapsible": "^1.0.3",
      };
    }

    return {
      dependencies: {
        ...baseDeps,
        ...specificDeps,
      },
    };
  }, [library]);

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
        options={{
          ...options,
          activeFile: "/Component.tsx",
          visibleFiles: ["/Component.tsx"],
        }}
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
              showTabs={false}
            />
          )}
          {(mode === "full" || mode === "preview") && (
            <SandpackPreview
              showNavigator={false}
              showRefreshButton={true}
              showOpenInCodeSandbox={false}
            />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
