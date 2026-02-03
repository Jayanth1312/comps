"use client";

import Header from "../components/header";
import App from "../../components/bento-grid-01";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 px-4 md:px-20">
      <Header />
      <main>
        <App />
      </main>
    </div>
  );
}
