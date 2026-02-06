import { ReactNode } from "react";

export interface ComponentExample {
  component: ReactNode;
  code: string;
  title?: string;
}

export interface ComponentRegistry {
  [componentSlug: string]: ComponentExample;
}

export interface LibraryRegistry {
  [libraryName: string]: ComponentRegistry;
}
