import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Component Library Comparison",
  description: "Compare UI components across different libraries",
  icons: {
    icon: "/icon.svg",
  },
};

import { UIProviders } from "@/components/ui-providers";
import { AuthProvider } from "@/contexts/AuthContext";
import { SortProvider } from "@/contexts/sort-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <AuthProvider>
          <SortProvider>
            <UIProviders>{children}</UIProviders>
          </SortProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
