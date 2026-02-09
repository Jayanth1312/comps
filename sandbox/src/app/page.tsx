"use client";

import { RootProvider } from "../components/providers";
import PreviewRunner from "../components/preview-runner";

export default function Home() {
  return (
      <RootProvider>
        <PreviewRunner />
      </RootProvider>
  );
}
