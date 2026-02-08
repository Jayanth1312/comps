"use client";

import Header from "../components/header";
import App from "../../components/bento-grid-01";
import { SortProvider } from "@/contexts/sort-context";
import ScrollToTop from "../components/scroll-to-top";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 px-4 md:px-20">
      <Header showBuilder={true} />
      <main>
        <App />
      </main>
      <ScrollToTop />
    </div>
  );
}
