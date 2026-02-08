"use client";

import { Library } from "@solar-icons/react";
import { LoginForm } from "@/components/login-form";
import Beams from "@/components/Beams";
import ThemeToggle from "@/app/components/theme-toggle";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-white dark:bg-black text-black dark:text-white">
      <div className="relative hidden lg:block overflow-hidden bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800">
        <div className="w-full h-full opacity-60">
          <Beams
            beamWidth={3}
            beamHeight={30}
            beamNumber={20}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={30}
          />
        </div>
        {/* Horizontal blending overlay (fades out towards the form) */}
        <div className="absolute inset-y-0 right-0 w-64 bg-linear-to-l from-background to-transparent z-10" />

        {/* Subtle vertical gradients for depth */}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-background to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent z-10" />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-1 font-medium group text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors"
          >
            <div className="flex size-7 items-center justify-center text-black dark:text-white group-hover:scale-110 transition-transform">
              <Library weight="BoldDuotone" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">Comps Inc.</span>
          </a>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
