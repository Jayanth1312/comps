"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  ArrowUp,
  Paperclip2,
  CloudUpload,
  Gallery,
  Refresh,
} from "@solar-icons/react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ImageAttachment {
  name: string;
  data: string;
}

interface AIInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string, images: string[]) => void;
  onNewChat?: () => void;
  onRetry?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function AIInput({
  value,
  onChange,
  onSend,
  onNewChat,
  onRetry,
  placeholder = "Ask AI to build something...",
  disabled = false,
  isLoading = false,
}: AIInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const processFile = useCallback((file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImages((prev) => [
            ...prev,
            { name: file.name || "image.png", data: result },
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(processFile);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const file = new File([blob], `pasted-image-${Date.now()}.png`, {
            type: blob.type,
          });
          processFile(file);
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(processFile);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (value.trim() || images.length > 0) {
      onSend(
        value,
        images.map((img) => img.data),
      );
      setImages([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 relative">
      {/* Optimized Pill-Style Previews (Image 1 reference) */}
      <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
        <AnimatePresence>
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 5 }}
              className="flex items-center gap-1.5 px-3 py-1 bg-muted/60 backdrop-blur-sm border border-border/50 rounded-sm shadow-sm group"
            >
              <Gallery
                weight="BoldDuotone"
                size={14}
                className="text-muted-foreground"
              />
              <span className="text-[11px] font-medium text-foreground/90 max-w-[120px] truncate">
                {img.name}
              </span>
              <button
                onClick={() => removeImage(index)}
                className="hover:bg-foreground/10 rounded-full p-0.5 transition-colors cursor-pointer"
                title="Remove image"
              >
                <X
                  size={12}
                  className="text-muted-foreground group-hover:text-foreground"
                />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative group"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="absolute -inset-0.5 bg-linear-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-1000 group-hover:duration-200"></div>

        <div className="relative bg-background/80 backdrop-blur-xl border border-border/50 rounded-lg p-3 shadow-sm flex flex-col gap-2 transition-all duration-300 min-h-[100px] justify-between">
          {/* Drag & Drop Overlay (Image 2 reference) */}
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-muted/90 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 pointer-events-none"
              >
                <CloudUpload
                  weight="BoldDuotone"
                  size={38}
                  className="text-muted-foreground mb-2"
                />
                <p className="text-sm font-medium text-muted-foreground">
                  Drop images here
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 min-h-[40px] max-h-[220px] p-2 resize-none text-[16px] font-normal leading-relaxed placeholder:text-muted-foreground/50 transition-all font-sans"
            rows={1}
            disabled={disabled}
          />

          {onRetry && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2 pb-2"
            >
              <button
                onClick={onRetry}
                className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full transition-all cursor-pointer w-fit"
              >
                <Refresh size={14} weight="Bold" />
                <span>Last request failed. Try again?</span>
              </button>
            </motion.div>
          )}

          <div className="flex items-center justify-between gap-2 mt-1">
            <button
              onClick={onNewChat}
              className="flex items-center bg-muted/50 px-1 py-1 rounded-md text-sm font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group/btn active:scale-95 cursor-pointer"
              title="New Chat"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
                <Plus size={18} />
              </div>
              <span className="hidden sm:inline pr-2">New Chat</span>
            </button>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200 active:scale-90 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/20",
                  images.length > 0 && "text-primary bg-primary/10",
                )}
                aria-label="Add images"
              >
                <Paperclip2 weight="BoldDuotone" size={22} />
              </button>

              <button
                onClick={handleSend}
                disabled={
                  disabled ||
                  isLoading ||
                  (!value.trim() && images.length === 0)
                }
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-md transition-all duration-300 active:scale-90 cursor-pointer shadow-sm border border-transparent",
                  value.trim() || images.length > 0
                    ? "bg-foreground text-background hover:opacity-90 font-bold"
                    : "bg-muted text-muted-foreground",
                )}
                aria-label="Send message"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUp weight="Bold" size={22} />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
