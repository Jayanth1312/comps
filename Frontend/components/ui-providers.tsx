"use client";

import React from "react";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  MantineProvider,
  createTheme as createMantineTheme,
} from "@mantine/core";

// Create systems/themes without global style injection
const chakraSystem = createSystem(defaultConfig, { preflight: false });
const muiTheme = createTheme();
const mantineTheme = createMantineTheme({});

// Individual wrappers for each library - only wrap when needed
export function ChakraWrapper({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={chakraSystem}>{children}</ChakraProvider>;
}

export function MUIWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}

export function MantineWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={mantineTheme} withGlobalClasses={false}>
      {children}
    </MantineProvider>
  );
}

// Keep UIProviders as a noop for now to avoid breaking the layout
export function UIProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
