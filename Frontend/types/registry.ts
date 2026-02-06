import { ReactNode, ComponentType } from "react";

export type LibraryName = "shadcn" | "mui" | "chakra";

export interface ComponentUsage {
  component: ComponentType<any>;
  props?: Record<string, any>;
  code: string; // The code snippet to display
  containerStyle?: React.CSSProperties; // Optional wrapper style
}

export interface ComponentDefinition {
  id: string;
  name: string;
  description: string;
  usage: Record<LibraryName, ComponentUsage | null>; // Some libs might not have the component
}

export type Registry = Record<string, ComponentDefinition>;
