"use client";

import React from "react";
import { MantineProvider } from "@mantine/core";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ConfigProvider, theme as antdTheme } from "antd";
import { Toaster } from "@/components/ui/sonner";

// Create MUI theme
const muiTheme = createTheme({
  palette: {
    mode: "light", // Default to light, can be dynamic later
  },
});

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <ConfigProvider
            theme={{
              algorithm: antdTheme.defaultAlgorithm,
            }}
          >
            {children}
            <Toaster />
          </ConfigProvider>
        </ThemeProvider>
      </ChakraProvider>
    </MantineProvider>
  );
}
