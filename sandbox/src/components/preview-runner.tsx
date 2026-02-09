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
      // Direct property access
      let val = (target as any)[prop];

      // If missing, return a dummy component
      if (val === undefined) {
        if (prop === "then") return undefined; // Promise check
        console.warn(
          `[Sandbox] Missing global export: ${name}.${String(prop)}`,
        );
        const Missing = () => null;
        (Missing as any).displayName = `Missing(${name}.${String(prop)})`;
        return Missing;
      }

      // Apply compatibility layer if needed
      if (compatType) {
        val = withLegacyCompat(val, compatType);
      }

      return val;
    },
  });
};

const MantineCompat = createSafeProxy(Mantine, "Mantine", "mantine");
const ChakraCompat = createSafeProxy(ChakraUI, "ChakraUI", "chakra");
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
    const handleMessage = (event: MessageEvent) => {
      const { code } = event.data;
      if (!code) return;

      try {
        // Transpile code using Babel
        const transformResult = transform(code, {
          presets: ["react", ["env", { modules: "commonjs" }]],
          filename: "component.tsx",
        }).code;

        if (!transformResult) throw new Error("Transpilation failed");

        // DEBUG: See what the code actually looks like
        console.log("Transpiled Code:", transformResult);

        // Mock module system
        const module = { exports: {} };
        const exports = module.exports;

        // Robust require mock
        const customRequire = (id: string) => {
          // console.log("Sandbox require:", id); // Reduce noise, only log unresolved or key libs

          if (id === "react") {
            return { default: React, ...React, __esModule: true };
          }

          let res = libs[id];

          if (!res) {
            if (id.startsWith("@/components/ui")) res = Shadcn;
            else if (id.startsWith("@/lib/utils")) res = require("@/lib/utils");
            else if (id.startsWith("@mui/material")) res = MaterialSafe;
            else if (id.startsWith("@chakra-ui/react")) res = ChakraCompat;
            else if (id.startsWith("@mantine/core")) res = MantineCompat;
            else if (id === "lucide-react") res = LucideSafe;
          }

          // Deep import or case-insensitive resolution
          const parts = id.split("/");
          const lastPart = parts[parts.length - 1];
          const capitalized =
            lastPart.charAt(0).toUpperCase() + lastPart.slice(1);

          // Try to find the component in the library
          let comp = res ? res[lastPart] || res[capitalized] : null;

          // CRITICAL FALLBACK: If component not found in targeted lib, search EVERYWHERE
          if (!comp) {
            const allPossibleLibs = [
              Shadcn,
              MaterialSafe,
              ChakraCompat,
              MantineCompat,
              AntdSafe,
              LucideSafe,
              utils,
            ];
            for (const lib of allPossibleLibs) {
              const l = lib as any;
              if (l && (l[lastPart] || l[capitalized])) {
                comp = l[lastPart] || l[capitalized];
                break;
              }
            }
          }

          if (comp) {
            return {
              ...(res || {}), // Include all other exports (like CardHeader if we found Card from Shadcn)
              default: comp,
              [lastPart]: comp,
              [capitalized]: comp,
              __esModule: true,
            };
          }

          // FIX: If we found the library (e.g. Shadcn) but didn't find the specific component 'Card' via string manipulation above
          // AND the ID looks like a file path (ends with lowercase), we might need to return the whole library subset
          // OR if we returned 'Shadcn' as 'res' earlier, we need to make sure 'default' works if the user did 'import Card from ...'

          // But wait, if 'res' is Shadcn, and we are looking for '.../card',
          // and 'comp' (Shadcn.Card) was found?
          // The block above returns { default: comp, ... }.
          // So 'require(.../card).default' is 'Card'. This is CORRECT for 'import Card from .../card'.
          // 'require(.../card).Card' is 'Card'. This is CORRECT for 'import { Card } from .../card'.

          // SO WHY DID IT FAIL?
          // Maybe `lastPart` is "card", `capitalized` is "Card".
          // Shadcn["Card"] exists.
          // So 'comp' IS found.

          // Let's add explicit logging to debug this fallback logic.
          if (res && !comp) {
            // Maybe it is a deeper path? or different casing?
            // try to find ANY export that looks like the file name
            const keys = Object.keys(res);
            const match = keys.find(
              (k) => k.toLowerCase() === lastPart.toLowerCase(),
            );
            if (match) {
              console.log(`[Sandbox] Fallback match: ${id} -> ${match}`);
              comp = res[match];
              return {
                ...(res || {}), // Include siblings
                default: comp,
                [match]: comp,
                __esModule: true,
              };
            } else {
              console.log(
                `[Sandbox] No case-insensitive match for '${lastPart}' in`,
                keys,
              );
            }
          }

          // If still not found and it's a library namespace, return the namespace
          if (res) {
            const base = { default: res, ...res, __esModule: true };
            return createSafeProxy(base, id);
          }

          // Proxy to handle missing exports gracefully
          const safeRes = new Proxy(
            { default: () => null, __esModule: true },
            {
              get: (target, prop) => {
                // If it's a known property, return it
                if (prop in target) return (target as any)[prop];
                if (prop === "then") return undefined; // distinct for promises

                // Otherwise, return a dummy component that warns but doesn't crash
                console.warn(
                  `[Sandbox] Warning: Component/Export '${String(
                    prop,
                  )}' was imported but not found in module '${id}'. Returning fallback.`,
                );
                return () => (
                  <div
                    style={{
                      border: "1px dashed red",
                      padding: "4px",
                      color: "red",
                      fontSize: "10px",
                    }}
                  >
                    Missing: {String(prop)}
                  </div>
                );
              },
            },
          );

          console.warn(`Module/Component not resolved: ${id}`);
          return safeRes;
        };

        const scopeKeys = Object.keys(scope);
        const scopeValues = Object.values(scope);

        // Debug scope
        console.log("Allowed Scope Keys:", scopeKeys);

        // Add module system vars to scope
        const argNames = [...scopeKeys, "module", "exports", "require"];
        const argValues = [...scopeValues, module, exports, customRequire];

        const renderFunc = new Function(...argNames, transformResult);

        // Execute the function
        renderFunc(...argValues);

        // 4. Retrieve content
        // Babel 'env' transforms `export default` to `exports.default = ...`
        // or sometimes `module.exports = ...` depending on config.
        // We check both.
        const ExportedComponent =
          (module.exports as any).default || module.exports;

        if (
          !ExportedComponent ||
          (typeof ExportedComponent !== "function" &&
            typeof ExportedComponent !== "object")
        ) {
          throw new Error(
            "Code did not return a valid React component. Ensure you have 'export default function Component...'",
          );
        }

        setComponent(() => ExportedComponent);
        setError(null);
        window.parent.postMessage({ type: "preview-loaded" }, "*");
      } catch (err: any) {
        console.error("Preview Error:", err);
        setError(err.message);
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
          console.error("Runtime Render Error:", err);
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
