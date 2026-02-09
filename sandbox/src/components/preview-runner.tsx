"use client";

import React, { useEffect, useState, useRef } from "react";
import * as MaterialUI from "@mui/material";
import * as ChakraUI from "@chakra-ui/react";
import * as Antd from "antd";
import * as Mantine from "@mantine/core";
import * as Lucide from "lucide-react";
import * as Shadcn from "@/components/ui";
import { transform } from "@babel/standalone";

const withLegacyCompat = (comp: any, type: "mantine" | "chakra") => {
  if (!comp || (typeof comp !== "function" && typeof comp !== "object"))
    return comp;

  if (
    typeof comp === "object" &&
    !comp.$$typeof &&
    !comp.render &&
    !comp.displayName
  )
    return comp;

  try {
    const Wrapped = React.forwardRef((props: any, ref: any) => {
      const { leftIcon, rightIcon, ...rest } = props;
      const newProps = { ...rest };

      if (type === "mantine") {
        if (leftIcon !== undefined && rest.leftSection === undefined)
          newProps.leftSection = leftIcon;
        if (rightIcon !== undefined && rest.rightSection === undefined)
          newProps.rightSection = rightIcon;
      } else if (type === "chakra") {
        if (leftIcon !== undefined && rest.startElement === undefined)
          newProps.startElement = leftIcon;
        if (rightIcon !== undefined && rest.endElement === undefined)
          newProps.endElement = rightIcon;
      }

      return React.createElement(comp, { ...newProps, ref });
    });

    for (const key in comp) {
      if (key !== "$$typeof" && key !== "render" && key !== "prototype") {
        try {
          (Wrapped as any)[key] = comp[key];
        } catch (e) {}
      }
    }

    return Wrapped;
  } catch (e) {
    return comp;
  }
};

// Helper to create a safe proxy for any library
const createSafeProxy = (
  target: any,
  name: string,
  compatType?: "mantine" | "chakra",
) => {
  return new Proxy(target, {
    get: (target, prop) => {
      // Basic checks
      if (prop === "Symbol(Symbol.iterator)") return undefined;
      if (prop === "__esModule") return target.__esModule ?? true;
      if (prop === "then") return undefined;

      let val = target[prop];

      if (val === undefined) {
        if (typeof prop === "symbol") return undefined;
        // Don't warn for common internal React/DevTools props
        if (
          typeof prop === "string" &&
          (prop.startsWith("__") || prop === "displayName")
        ) {
          return undefined;
        }

        // console.warn(`[Sandbox] Missing export: ${name}.${String(prop)}`);
        const Missing = (props: any) => {
          // console.error(
          //   `[Sandbox] Rendering missing component: ${name}.${String(prop)}`,
          // );
          return null;
        };
        Missing.displayName = `Missing(${name}.${String(prop)})`;
        return Missing;
      }

      // Apply compatibility layer if needed
      if (compatType && val) {
        val = withLegacyCompat(val, compatType);
      }

      return val;
    },
    ownKeys(target) {
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
  });
};

const MantineCompat = createSafeProxy(Mantine, "Mantine", "mantine");
const ChakraCompat = createSafeProxy(
  {
    ...ChakraUI,
    useDisclosure: () => {
      const [isOpen, setIsOpen] = React.useState(false);
      return {
        isOpen,
        onOpen: () => setIsOpen(true),
        onClose: () => setIsOpen(false),
        onToggle: () => setIsOpen((prev) => !prev),
      };
    },
  },
  "ChakraUI",
  "chakra",
);
const MaterialSafe = createSafeProxy(MaterialUI, "MaterialUI");
const AntdSafe = createSafeProxy(Antd, "Antd");
const LucideSafe = createSafeProxy(Lucide, "Lucide");

// Simple Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500 font-mono text-sm bg-red-50 border border-red-200 rounded">
          <strong>Render Error:</strong>
          <pre className="mt-2 whitespace-pre-wrap">
            {this.state.error?.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Comprehensive library mapping for the 'require' mock
const libs: Record<string, any> = {
  react: React,
  "react-dom": require("react-dom"),
  "@mui/material": MaterialSafe,
  "@chakra-ui/react": ChakraCompat,
  antd: AntdSafe,
  "@mantine/core": MantineCompat,
  "lucide-react": LucideSafe,
  clsx: require("clsx"),
  "tailwind-merge": require("tailwind-merge"),
  "class-variance-authority": require("class-variance-authority"),
  // Mock emotion for Chakra/MUI if they try to require it
  "@emotion/react": {
    css: () => null,
    jsx: React.createElement,
    Global: () => null,
    ThemeContext: React.createContext({}),
  },
  "@emotion/styled": {
    default: (tag: any) => (props: any) => React.createElement(tag, props),
  },
  daisyui: {},
  lucide: LucideSafe,
};

// Common utility components to expose as globals (prevent ReferenceErrors)
const utils = {
  cn: (Shadcn as any).cn || require("@/lib/utils").cn,
  // Spread common layout components
  ...(ChakraCompat as any),
  ...(MaterialUI || {}),
};

// Global scope for variables used directly
const scope: Record<string, any> = {
  React,
  MaterialUI: MaterialSafe,
  ChakraUI: ChakraCompat,
  antd: AntdSafe,
  Mantine: MantineCompat,
  Lucide: LucideSafe, // Capitalized
  lucide: LucideSafe, // Lowercase
  ...Shadcn,
  ...utils,
  // Add Lucide to scope explicitly for common names
  ...LucideSafe,
  // DaisyUI is classes-only, but mock the global in case AI tries to use it as a lib
  daisy: {},
  daisyui: {},
  // Force presence of highly common components
  Box: (ChakraUI as any)?.Box || (MaterialUI as any)?.Box,
  Flex: (ChakraUI as any)?.Flex,
  Stack:
    (Shadcn as any)?.Stack ||
    (ChakraUI as any)?.Stack ||
    (MaterialUI as any)?.Stack,
};

export default function PreviewRunner() {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Inject Tailwind CDN with DaisyUI support
    if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => {
        (window as any).tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                  DEFAULT: "var(--primary)",
                  foreground: "var(--primary-foreground)",
                },
                secondary: {
                  DEFAULT: "var(--secondary)",
                  foreground: "var(--secondary-foreground)",
                },
                destructive: {
                  DEFAULT: "var(--destructive)",
                  foreground: "var(--destructive-foreground)",
                },
                muted: {
                  DEFAULT: "var(--muted)",
                  foreground: "var(--muted-foreground)",
                },
                accent: {
                  DEFAULT: "var(--accent)",
                  foreground: "var(--accent-foreground)",
                },
                popover: {
                  DEFAULT: "var(--popover)",
                  foreground: "var(--popover-foreground)",
                },
                card: {
                  DEFAULT: "var(--card)",
                  foreground: "var(--card-foreground)",
                },
              },
            },
          },
          plugins: [], // Plugins are harder via CDN without loading them first
        };
      };
      document.head.appendChild(script);

      // Add DaisyUI CSS via CDN link as well for full support
      const daisyLink = document.createElement("link");
      daisyLink.rel = "stylesheet";
      daisyLink.href =
        "https://cdn.jsdelivr.net/npm/daisyui@5.0.0-beta.8/daisyui.css";
      document.head.appendChild(daisyLink);
    }

    const handleMessage = (event: MessageEvent) => {
      // console.log("Sandbox received message:", event.data);
      const { code } = event.data;
      if (!code) return;

      try {
        // Transpile code using Babel
        // console.log("[Sandbox] Starting Babel transform...");
        const transformResult = transform(code, {
          presets: ["react", ["env", { modules: "commonjs" }]],
          filename: "component.tsx",
        }).code;

        if (!transformResult) throw new Error("Transpilation failed");
        // console.log("[Sandbox] Babel transform complete.");

        // Mock module system
        const module = { exports: {} };
        const exports = module.exports;

        // Robust require mock
        const coreLibs: Record<string, any> = {
          react: { default: React, ...React, __esModule: true },
          "@mui/material": MaterialSafe,
          "@chakra-ui/react": ChakraCompat,
          antd: AntdSafe,
          "@mantine/core": MantineCompat,
          "lucide-react": LucideSafe,
          "@emotion/react": libs["@emotion/react"],
          "@emotion/styled": libs["@emotion/styled"],
          daisyui: { default: {}, __esModule: true },
        };

        const customRequire = (id: string) => {
          // console.log("[Sandbox] customRequire:", id);

          if (coreLibs[id]) {
            const res = coreLibs[id];
            if (res && res.default) return res;
            return { default: res, ...res, __esModule: true };
          }

          let res = libs[id];
          if (!res) {
            if (id.startsWith("@/components/ui")) res = Shadcn;
            else if (id.startsWith("@/lib/utils")) res = require("@/lib/utils");
            else if (id.startsWith("@mui/material")) res = MaterialSafe;
            else if (id.startsWith("@chakra-ui/react")) res = ChakraCompat;
            else if (id.startsWith("@mantine/core")) res = MantineCompat;
          }

          const parts = id.split("/");
          const lastPart = parts[parts.length - 1];
          const capitalized =
            lastPart.charAt(0).toUpperCase() + lastPart.slice(1);

          // Try to resolve a specific component from a library
          let comp = res ? res[lastPart] || res[capitalized] : null;

          // If still not found, search through all known major UI libs
          if (!comp && res) {
            const allPossibleLibs = [
              Shadcn,
              MaterialSafe,
              ChakraCompat,
              MantineCompat,
              AntdSafe,
              LucideSafe,
            ];
            for (const lib of allPossibleLibs) {
              if (lib[lastPart] || lib[capitalized]) {
                comp = lib[lastPart] || lib[capitalized];
                break;
              }
            }
          }

          if (comp) {
            // console.log(`[Sandbox] Resolved '${id}' to component: ${lastPart}`);
            return {
              default: comp,
              [lastPart]: comp,
              [capitalized]: comp,
              // Spread siblings if 'res' is the library it came from
              ...(res || {}),
              __esModule: true,
            };
          }

          // If we have a library 'res' but couldn't find the specific 'comp', return the whole lib wrapped in safe proxy
          if (res) {
            // console.log(`[Sandbox] Resolved '${id}' to library namespace.`);
            return createSafeProxy(
              { default: res, ...res, __esModule: true },
              id,
            );
          }

          // console.warn(`[Sandbox] Module ID '${id}' reached fallback.`);
          return createSafeProxy({ default: () => null, __esModule: true }, id);
        };

        const argNames = [
          ...Object.keys(scope),
          "module",
          "exports",
          "require",
        ];
        const argValues = [
          ...Object.values(scope),
          module,
          exports,
          customRequire,
        ];

        // console.log("[Sandbox] Executing render function...");
        const renderFunc = new Function(...argNames, transformResult);
        renderFunc(...argValues);

        let ExportedComponent =
          (module.exports as any).default || module.exports;

        // CRITICAL FIX: If AI exported an ELEMENT like 'export default <div />'
        // instead of a COMPONENT, wrap it. This fixes "got: object" errors.
        if (React.isValidElement(ExportedComponent)) {
          // console.log(
          //   "[Sandbox] Exported value is a JSX element. Wrapping in component.",
          // );
          const Element = ExportedComponent as React.ReactElement;
          ExportedComponent = () => Element;
        }

        if (
          !ExportedComponent ||
          (typeof ExportedComponent !== "function" &&
            typeof ExportedComponent !== "object")
        ) {
          throw new Error(
            "No valid component exported. Use 'export default function Component()'.",
          );
        }

        // Final safety check for objects
        if (
          typeof ExportedComponent === "object" &&
          !ExportedComponent.$$typeof &&
          !(ExportedComponent as any).render
        ) {
          // console.warn(
          //   "[Sandbox] Exported object is not a valid React component. Attempting to use its first export.",
          // );
          const firstKey = Object.keys(ExportedComponent).find(
            (k) => typeof (ExportedComponent as any)[k] === "function",
          );
          if (firstKey)
            ExportedComponent = (ExportedComponent as any)[firstKey];
        }

        // console.log("[Sandbox] Success. Setting component state.");
        setComponent(() => ExportedComponent);
        setError(null);
        window.parent.postMessage({ type: "preview-loaded" }, "*");
      } catch (err: any) {
        // console.error("[Sandbox] Error in handleMessage:", err);
        setError(err.message || "Execution Error");
        window.parent.postMessage(
          { type: "preview-error", error: err.message },
          "*",
        );
      }
    };

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "sandbox-ready" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (error) {
    return (
      <div className="p-4 text-red-500 font-mono text-sm bg-red-50 border border-red-200 rounded overflow-auto">
        <strong>Runtime Error:</strong>
        <pre className="mt-2 whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-sm">
        Ready to render...
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ErrorBoundary
        onError={(err) => {
          // console.error("Runtime Render Error:", err);
          window.parent.postMessage(
            { type: "preview-error", error: err.message },
            "*",
          );
        }}
      >
        <Component />
      </ErrorBoundary>
    </div>
  );
}
