"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@solar-icons/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";

interface AuthRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthRequiredDialog({
  isOpen,
  onClose,
}: AuthRequiredDialogProps) {
  const pathname = usePathname();
  const router = useRouter();
  const redirectParam = encodeURIComponent(pathname);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        size="sm"
        className="rounded-xl border-border/50 bg-background/70 backdrop-blur-xs"
      >
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-primary/10 text-primary rounded-lg size-12 mb-4">
            <User weight="BoldDuotone" size={24} />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-xl font-bold tracking-tight">
            Login Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-balance text-muted-foreground leading-relaxed">
            Please sign in or create an account to start building with AI.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel
            onClick={onClose}
            className="rounded-md border-border/50 bg-secondary/50 hover:bg-secondary transition-all active:scale-95 cursor-pointer"
          >
            Maybe later
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => router.push(`/login?redirect=${redirectParam}`)}
            className="rounded-md bg-foreground text-background hover:opacity-90 transition-all active:scale-95 font-normal cursor-pointer"
          >
            Log In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
