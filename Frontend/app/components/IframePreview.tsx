"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { inlineShadcnComponents } from "../utils/shadcn-inliner";

interface IframePreviewProps {
  code: string;
  library: string;
  className?: string;
}

export default function IframePreview({
  code,
  library,
  className = "",
}: IframePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!iframeRef.current) return;

    const lib = library.toLowerCase();
    const isDark = resolvedTheme === "dark";
    setLoading(true);
    setError(null);

    // Pre-process code to inline Shadcn components
    const processedCode =
      lib === "shadcn" || lib === "shadcn-ui"
        ? inlineShadcnComponents(code)
        : code;

    const getHTMLContent = () => {
      let providerImports = "";
      let providerSetup = "";

      if (lib === "mui" || lib.includes("material")) {
        providerImports = `
          import { ThemeProvider, createTheme } from 'https://esm.sh/@mui/material@5.15.11/styles?external=react,react-dom';
          import CssBaseline from 'https://esm.sh/@mui/material@5.15.11/CssBaseline?external=react,react-dom';
        `;
        providerSetup = `
          const theme = createTheme({ palette: { mode: '${isDark ? "dark" : "light"}' } });
          const Provider = ({ children }) =>
            React.createElement(ThemeProvider, { theme },
              React.createElement(CssBaseline),
              children
            );
        `;
      } else if (lib === "chakra" || lib === "chakraui") {
        providerImports = `
          import { ChakraProvider } from 'https://esm.sh/@chakra-ui/react@2.8.2?external=react,react-dom';
        `;
        providerSetup = `
          const Provider = ({ children }) => React.createElement(ChakraProvider, {}, children);
        `;
      } else if (lib === "antd") {
        providerImports = `
          import { ConfigProvider, theme as antdTheme } from 'https://esm.sh/antd@5.15.0?external=react,react-dom';
        `;
        providerSetup = `
          const Provider = ({ children }) =>
            React.createElement(ConfigProvider, {
              theme: { algorithm: antdTheme.${isDark ? "darkAlgorithm" : "defaultAlgorithm"} }
            }, children);
        `;
      } else if (lib === "mantine") {
        providerImports = `
          import { MantineProvider } from 'https://esm.sh/@mantine/core@7.5.2?external=react,react-dom';
        `;
        providerSetup = `
          const Provider = ({ children }) =>
            React.createElement(MantineProvider, { forceColorScheme: '${isDark ? "dark" : "light"}' }, children);
        `;
      } else {
        providerSetup = `const Provider = ({ children }) => children;`;
      }

      let libraryCSS = "";
      if (lib === "mantine") {
        libraryCSS =
          '<link rel="stylesheet" href="https://esm.sh/@mantine/core@7.5.2/styles.css" />';
      } else if (lib === "antd") {
        libraryCSS =
          '<link rel="stylesheet" href="https://esm.sh/antd@5.15.0/dist/reset.css" />';
      }

      const encodedCode = btoa(unescape(encodeURIComponent(processedCode)));

      return `
<!DOCTYPE html>
<html lang="en" class="${isDark ? "dark" : ""}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>

  <script src="https://unpkg.com/@babel/standalone@7.23.5/babel.min.js" onerror="window.parent.postMessage({type:'preview-error',error:'Failed to load Babel'}, '*')"></script>
  <script src="https://cdn.tailwindcss.com" onerror="window.parent.postMessage({type:'preview-error',error:'Failed to load Tailwind'}, '*')"></script>

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
            muted: {
              DEFAULT: "hsl(var(--muted))",
              foreground: "hsl(var(--muted-foreground))",
            },
            destructive: {
              DEFAULT: "hsl(var(--destructive))",
              foreground: "hsl(var(--destructive-foreground))",
            },
            accent: {
              DEFAULT: "hsl(var(--accent))",
              foreground: "hsl(var(--accent-foreground))",
            },
          },
        },
      },
    };
  </script>

  <style>
    :root {
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
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
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 222.2 84% 4.9%;
    }
    .dark {
      --background: 222.2 84% 4.9%;
      --foreground: 210 40% 98%;
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
    body {
      margin: 0;
      background: transparent;
      min-height: 100vh;
    }
    #root {
      padding: 2rem;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .error-display {
      color: #ef4444;
      background: #fee;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #fca5a5;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      white-space: pre-wrap;
      max-width: 600px;
    }
  </style>
  ${libraryCSS}
  <link href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css" rel="stylesheet" />
</head>
<body>
  <div id="root">Loading...</div>

  <script type="module">
    window.parent.postMessage({ type: 'preview-bootstrap' }, '*');

    import React from 'https://esm.sh/react@18.2.0';
    import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client?external=react';
    import * as TablerIcons from 'https://esm.sh/@tabler/icons-react@3.2.0?external=react,react-dom';
    ${providerImports}

    window.process = { env: { NODE_ENV: 'development' } };

    const clsx = (...args) => args.filter(Boolean).join(' ');
    const cn = (...inputs) => clsx(...inputs);

    ${providerSetup}

    window.onerror = (msg, url, line, col, error) => {
      console.error('Runtime error:', msg, error);
      document.getElementById('root').innerHTML =
        '<div class="error-display"><strong>Runtime Error:</strong><br/>' + msg + '</div>';
      window.parent.postMessage({ type: 'preview-error', error: String(msg) }, '*');
      return false;
    };

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled rejection:', event.reason);
      document.getElementById('root').innerHTML =
        '<div class="error-display"><strong>Promise Error:</strong><br/>' + event.reason + '</div>';
      window.parent.postMessage({ type: 'preview-error', error: String(event.reason) }, '*');
    });

    async function renderComponent() {
      try {
        const encodedCode = "${encodedCode}";
        let userCode = decodeURIComponent(escape(atob(encodedCode)));

        // CRITICAL: Remove ALL import and export statements robustly
        // This regex handles multiline imports and various styles
        userCode = userCode
          .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
          .replace(/import\s+['"][^'"]+['"];?/g, '')
          .replace(/export\s+default\s+/g, '')
          .replace(/export\s+{[^}]*};?/g, '')
          .replace(/export\s+(const|let|var|function|class)\s+/g, '$1 ');

        if (!userCode.trim()) {
           throw new Error("No code found to render.");
        }

        console.log('Cleaned code:', userCode);

        // Transform TSX to JavaScript
        const transformedCode = window.Babel.transform(userCode, {
          presets: ['typescript', 'react'],
          filename: 'component.tsx',
        }).code;

        console.log('Transformed code:', transformedCode);

        // Create scope
        const moduleScope = {
          React,
          useState: React.useState,
          useEffect: React.useEffect,
          useMemo: React.useMemo,
          useCallback: React.useCallback,
          useRef: React.useRef,
          useContext: React.useContext,
          useLayoutEffect: React.useLayoutEffect,
          useImperativeHandle: React.useImperativeHandle,
          useCallback: React.useCallback,
          useTransition: React.useTransition,
          useDeferredValue: React.useDeferredValue,
          useId: React.useId,
          createContext: React.createContext,
          Fragment: React.Fragment,
          clsx,
          cn,
          // Conditionally spread icons to save memory if not likely needed
          ...(userCode.includes('Icon') ? TablerIcons : {}),
        };

        // Find component or wrap code
        let codeToExecute = transformedCode;

        if (!/(?:const|let|var|function)\\s+Component\\s*[=(/]/.test(transformedCode)) {
          const componentMatch = transformedCode.match(/(?:function|const|let|var)\\s+([A-Z][a-zA-Z0-9]*)/);
          if (componentMatch) {
            codeToExecute = transformedCode + \`
const Component = \${componentMatch[1]};\`;
          } else {
            codeToExecute = transformedCode + \`
const Component = () => {
  return React.createElement('div', { className: 'p-4 text-red-500' },
    'No component found. Please define a component starting with a capital letter.'
  );
};\`;
          }
        }

        // Execute
        const moduleFunction = new Function(
          ...Object.keys(moduleScope),
          codeToExecute + '\\nreturn Component;'
        );
        const Component = moduleFunction(...Object.values(moduleScope));

        if (!Component || typeof Component !== 'function') {
          throw new Error('Invalid component. Make sure to define a React component function.');
        }

        // Render
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
          React.createElement(Provider, {},
            React.createElement(Component)
          )
        );

        window.parent.postMessage({ type: 'preview-loaded' }, '*');

      } catch (err) {
        console.error('Preview error:', err);
        const errorMessage = err.message || String(err);
        const errorStack = err.stack || 'No stack trace';

        document.getElementById('root').innerHTML =
          '<div class="error-display">' +
          '<strong>Preview Error:</strong><br/>' +
          errorMessage +
          '<br/><br/><details><summary style="cursor: pointer; font-weight: 600;">Show Details</summary><pre style="margin-top: 8px; font-size: 12px; opacity: 0.8;">' +
          errorStack +
          '</pre></details></div>';

        window.parent.postMessage({ type: 'preview-error', error: errorMessage }, '*');
      }
    }

    renderComponent();
  </script>
</body>
</html>
      `;
    };

    try {
      const htmlContent = getHTMLContent();
      const iframe = iframeRef.current;
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;

      if (iframeDoc) {
        // Pass code via window property to avoid escaping issues in template strings
        (iframe.contentWindow as any).__PREVIEW_CODE__ = processedCode;

        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }

      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === "preview-loaded") {
          setLoading(false);
          setError(null);
        } else if (event.data.type === "preview-bootstrap") {
          // Iframe is alive but still loading deps
          console.log("Iframe bootstrap started");
        } else if (event.data.type === "preview-error") {
          setLoading(false);
          setError(event.data.error);
        }
      };

      window.addEventListener("message", handleMessage);

      const timeout = setTimeout(() => {
        setLoading(false);
      }, 5000);

      return () => {
        window.removeEventListener("message", handleMessage);
        clearTimeout(timeout);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to render preview");
      setLoading(false);
      console.error("Iframe preview error:", err);
    }
  }, [code, library, resolvedTheme]);

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-red-500 text-center p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20 dark:border-red-800 max-w-md">
          <p className="font-bold mb-2">Preview Error</p>
          <p className="text-sm font-mono break-words">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="text-muted-foreground animate-pulse">
            Loading preview...
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        className={`w-full h-full border-0 ${className}`}
        sandbox="allow-scripts allow-same-origin"
        title="Component Preview"
      />
    </div>
  );
}
