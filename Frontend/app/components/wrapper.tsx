"use client";

import { Button, ChakraProvider, createSystem, defaultConfig, Box } from "@chakra-ui/react";
import { useTheme } from "@/contexts/theme-context";
import { useMemo, forwardRef } from "react";

interface ChakraButtonProps {
  aiColor?: string; // "red" | "blue" | "green" | "purple"
}

export const ChakraButtonWrapper = forwardRef<HTMLButtonElement, ChakraButtonProps>(
  ({ aiColor }, ref) => {
    const { isDark } = useTheme();

    const customSystem = useMemo(
      () => createSystem(defaultConfig, { preflight: false }),
      []
    );

    return (
      <ChakraProvider value={customSystem}>
        <Box
          className="library-preview-container"
          colorPalette={isDark ? "gray" : "blue"}
          data-theme={isDark ? "dark" : "light"}
        >
          <Button
            ref={ref}
            colorPalette={aiColor || "blue"}
          >
            Click me
          </Button>
        </Box>
      </ChakraProvider>
    );
  }
);

ChakraButtonWrapper.displayName = "ChakraButtonWrapper";
