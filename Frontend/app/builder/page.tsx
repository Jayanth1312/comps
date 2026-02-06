"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  ArrowUp,
  ArrowLeft,
  Paperclip2,
  Copy,
  Code,
  Eye,
  Download,
  Unread,
  History
} from "@solar-icons/react";
import ThemeToggle from "@/app/components/theme-toggle";
import UserMessage from "@/app/components/UserMessage";
import AIMessage from "@/app/components/AIMessage";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneEarth } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Types for chat messages
type MessageType = "text" | "code";

interface CodeBlock {
  content: string;
  language: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  type: MessageType;
  codeBlock?: CodeBlock;
}

// Mock initial chat history
const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Hi! I'm your AI component builder. What would you like to build today?",
    type: "text",
  },
  {
    id: "2",
    role: "user",
    content: "Can you create a simple button component using Material?",
    type: "text",
  },
  {
    id: "3",
    role: "ai",
    content:
      "Sure! Here is a simple button component styled with Material UI library",
    type: "text",
    codeBlock: {
      content: `export default function Button({ children }) {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
      {children}
    </button>
  );
}`,
      language: "tsx",
    },
  },
];

export default function BuilderPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      type: "text",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate AI response (mock)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I'm working on that for you...",
        type: "text",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = () => {
    if (expandedCode) {
      const message = messages.find((m) => m.id === expandedCode);
      if (message?.codeBlock) {
        navigator.clipboard.writeText(message.codeBlock.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  // Preview component for demonstration
  const PreviewButton = () => (
    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg active:scale-95 transition-all">
      Click Me
    </button>
  );

  const currentExpandedMessage = messages.find((m) => m.id === expandedCode);

  return (
    <div className="min-h-screen bg-background text-foreground flex relative overflow-hidden">
      {/*
        ========================================
        Main Content Area (Left Side)
        ========================================
      */}
      <div
        className={cn(
          "flex flex-col relative transition-all duration-300 ease-in-out",
          expandedCode ? "w-full lg:w-1/2" : "w-full",
        )}
      >
        {/* Header (Top) */}
        <header
          className="fixed top-0 left-0 z-50 py-4 flex items-center justify-between pointer-events-none"
          style={{
            right: expandedCode ? "auto" : "0",
            width: expandedCode ? "calc(50% - 2rem)" : "auto",
          }}
        >
          {/* Back Button */}
          <div className="px-4 md:px-6">
            <button
              onClick={() => router.back()}
              className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-md bg-muted/20 backdrop-blur-md border border-border/50 hover:bg-muted/40 text-foreground transition-all duration-300 group cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft
                weight="BoldDuotone"
                size={20}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </button>
          </div>
          <div className="flex items-center">
            <div className="p-2.5 pointer-events-auto flex items-center justify-center rounded-md bg-muted/20 backdrop-blur-md border border-border/50 hover:bg-muted/40 text-foreground transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-2">
                <History weight="BoldDuotone" size={20} />
                History
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="pointer-events-auto px-4 md:px-6">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Chat Area (Middle) */}
        <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto pt-24 pb-32 px-4 md:px-14 space-y-6">
          {messages.map((msg) => {
            // Render User Messages
            if (msg.role === "user") {
              return <UserMessage key={msg.id} content={msg.content} />;
            }

            // Render AI Messages with optional code block
            if (msg.role === "ai") {
              return (
                <AIMessage key={msg.id} content={msg.content}>
                  {msg.codeBlock && (
                    <button
                      onClick={() => setExpandedCode(msg.id)}
                      className="w-full rounded-lg overflow-hidden bg-muted/30 border border-border/50 hover:border-primary/15 dark:hover:border-foreground/15 transition-all cursor-pointer text-left group p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-sm bg-muted/50 border border-border/50 flex items-center justify-center">
                            <Code
                              weight="BoldDuotone"
                              size={18}
                              className="text-muted-foreground"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              ComponentName
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Code · {msg.codeBlock.language.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-2 rounded-sm border border-border/50 bg-background text-sm font-medium hover:bg-muted/50 transition-colors flex items-center gap-2">
                          <Download weight="LineDuotone" size={16} />
                          Download
                        </div>
                      </div>
                    </button>
                  )}
                </AIMessage>
              );
            }

            return null;
          })}
          <div ref={messagesEndRef} />
        </main>

        {/* Input Area (Bottom) */}
        <div
          className="fixed bottom-0 left-0 z-50 pointer-events-none"
          style={{
            right: expandedCode ? "auto" : "0",
            width: expandedCode ? "50%" : "100%",
          }}
        >
          {/* Fog mask */}
          <div
            className="absolute inset-x-0 bottom-0 h-40 pointer-events-none select-none z-0"
            style={{
              maskImage:
                "linear-gradient(to top, black 0%, black 10%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.1) 80%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, black 0%, black 10%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.1) 80%, transparent 100%)",
              background:
                "linear-gradient(to top, var(--background) 0%, var(--background) 20%, transparent 100%)",
            }}
          />

          <div className="w-full pb-6 px-4 md:px-6 relative z-10 pointer-events-auto">
            <div className="max-w-3xl mx-auto flex gap-2 md:gap-3 items-end">
              {/* Input Container */}
              <div className="flex-1 bg-muted/20 backdrop-blur-md border border-border/50 rounded-lg p-2 flex items-end gap-2 transition-all">
                {/* Add Attachment Button */}
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0 cursor-pointer"
                  aria-label="Add attachment"
                >
                  <Paperclip2 weight="BoldDuotone" size={20} />
                </button>

                {/* Text Input */}
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AI to build something..."
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 min-h-[40px] max-h-[120px] py-2 resize-none text-[15px] font-medium leading-relaxed"
                  rows={1}
                  style={{
                    height: "auto",
                    minHeight: "40px",
                  }}
                />

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-md transition-all duration-300 shrink-0 cursor-pointer",
                    inputValue.trim()
                      ? "bg-foreground text-background hover:bg-foreground/90 shadow-md"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
                  )}
                  aria-label="Send message"
                >
                  <ArrowUp weight="BoldDuotone" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
        ========================================
        Right Side Panel (Code Expansion)
        ========================================
      */}
      <AnimatePresence>
        {expandedCode && currentExpandedMessage?.codeBlock && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full lg:w-1/2 bg-background border-l border-border flex flex-col z-40"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-background">
              <div className="flex items-center gap-4">
                {/* Tab Switcher (Pill Style) */}
                <div className="flex items-center gap-3">
                  <div className="flex bg-muted/30 rounded-md border border-border/50 p-1 relative">
                    {/* Code Tab */}
                    <button
                      onClick={() => setActiveTab("code")}
                      className={cn(
                        "relative w-9 h-9 flex items-center justify-center transition-colors cursor-pointer rounded-sm",
                        activeTab === "code"
                          ? "text-background"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {activeTab === "code" && (
                        <motion.div
                          layoutId="switcherIndicator"
                          className="absolute inset-0 bg-foreground rounded-sm"
                          transition={{
                            type: "spring",
                            bounce: 0,
                            duration: 0.3,
                          }}
                        />
                      )}
                      <Code
                        weight="BoldDuotone"
                        size={18}
                        className="relative z-10"
                      />
                    </button>

                    {/* Preview Tab */}
                    <button
                      onClick={() => setActiveTab("preview")}
                      className={cn(
                        "relative w-9 h-9 flex items-center justify-center transition-colors cursor-pointer rounded-sm",
                        activeTab === "preview"
                          ? "text-background"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {activeTab === "preview" && (
                        <motion.div
                          layoutId="switcherIndicator"
                          className="absolute inset-0 bg-foreground rounded-sm"
                          transition={{
                            type: "spring",
                            bounce: 0,
                            duration: 0.3,
                          }}
                        />
                      )}
                      <Eye
                        weight="LineDuotone"
                        size={18}
                        className="relative z-10"
                      />
                    </button>
                  </div>

                  {/* Component Info Label */}
                  <div className="flex items-center gap-1.5 text-[15px] font-medium">
                    <span className="text-foreground">Page</span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-muted-foreground uppercase">
                      {currentExpandedMessage.codeBlock.language}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-sm hover:bg-muted/80 transition-all text-sm font-medium cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Unread
                        weight="BoldDuotone"
                        className="text-green-500"
                        size={16}
                      />
                      <span className="text-green-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy weight="LineDuotone" size={16} />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={() => setExpandedCode(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-muted transition-all cursor-pointer"
                >
                  <Download weight="LineDuotone" size={20} />
                </button>
                <button
                  onClick={() => setExpandedCode(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-muted transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-background">
              {activeTab === "code" && (
                <SyntaxHighlighter
                  language={currentExpandedMessage.codeBlock.language}
                  style={duotoneEarth}
                  customStyle={{
                    background: "transparent",
                    margin: 0,
                    padding: "1.5rem",
                    fontSize: "14px",
                    width: "100%",
                    overflow: "visible",
                  }}
                  showLineNumbers={true}
                  wrapLongLines={true}
                >
                  {currentExpandedMessage.codeBlock.content}
                </SyntaxHighlighter>
              )}

              {activeTab === "preview" && (
                <div className="p-8 md:p-12 flex items-center justify-center min-h-full bg-muted/20">
                  <PreviewButton />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
