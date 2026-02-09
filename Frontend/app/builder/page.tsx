"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Login,
  User,
  Logout,
  ClockCircle,
  Library,
} from "@solar-icons/react";
import ThemeToggle from "@/app/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import UserMessage from "@/app/components/UserMessage";
import AIMessage from "@/app/components/AIMessage";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";
import AIInput from "@/app/components/AIInput";
import CodeCard from "@/app/components/CodeCard";
import CodeExpansionPanel from "@/app/components/CodeExpansionPanel";
import AITextLoading from "@/components/kokonutui/ai-text-loading";
import HistoryDrawer from "../components/HistoryDrawer";
import AuthRequiredDialog from "../components/AuthRequiredDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type MessageType = "text" | "code";

interface CodeVariant {
  library: string;
  code: string;
  language: string;
}

interface CodeBlock {
  language: string;
  content: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  type: MessageType;
  codeBlock?: CodeBlock; // Legacy support
  codeVariants?: CodeVariant[]; // New support
  images?: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    content: "Hi! Describe a component you want me to build.",
    type: "text",
  },
];

export default function BuilderPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<
    CodeVariant | undefined
  >(undefined);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string>("");
  const [generationError, setGenerationError] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const panelWidth = 65;

  useEffect(() => {
    const savedMessages = localStorage.getItem("builder_messages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed)) {
          setMessages(
            parsed.map((m: any) => ({
              ...m,
              id: String(m.id || m._id || Date.now().toString()),
            })),
          );
        }
      } catch (error) {
        console.error("Failed to load saved messages:", error);
      }
    }

    let savedSessionId = localStorage.getItem("chat_session_id");
    if (!savedSessionId) {
      savedSessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("chat_session_id", savedSessionId);
    }
    setChatSessionId(savedSessionId);

    setMessagesLoaded(true);
  }, []);

  // Reset state on logout
  useEffect(() => {
    if (messagesLoaded && !user) {
      setMessages(INITIAL_MESSAGES);
      const newSessionId = Math.random().toString(36).substring(2, 15);
      setChatSessionId(newSessionId);
      setExpandedCode(null);
      setSelectedVariant(undefined);
    }
  }, [user, messagesLoaded]);

  // Save messages to localStorage on change
  useEffect(() => {
    if (messagesLoaded) {
      localStorage.setItem("builder_messages", JSON.stringify(messages));
    }
  }, [messages, messagesLoaded]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (
    text?: string,
    images?: string[],
    insertAfterId?: string,
  ) => {
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    const messageContent = text || inputValue;
    if (!messageContent.trim() && (!images || images.length === 0)) return;

    setGenerationError(false);

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      type: "text",
      images: images || [],
    };

    setMessages((prev) => {
      if (insertAfterId) {
        const index = prev.findIndex((m) => m.id === insertAfterId);
        if (index !== -1) {
          // Truncate the messages: keep everything before the edited message
          return [...prev.slice(0, index), newMessage];
        }
      }
      return [...prev, newMessage];
    });

    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: newMessage.content,
          sessionId: chatSessionId || "default-session",
          images: images || [],
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate component");
      }

      const data = await response.json();

      // Determine if response is an array (variants) or single object
      let variants: CodeVariant[] = [];
      let aiContent = "";

      const processVariant = (v: any): CodeVariant => ({
        library: v.library || "default",
        code: v.code || "",
        language: v.language || "tsx", // Ensure language exists
      });

      if (data.variants && Array.isArray(data.variants)) {
        // New structure: { message, variants }
        variants = data.variants.map(processVariant);
        aiContent =
          data.message ||
          `Here are ${variants.length} implementation${variants.length !== 1 ? "s" : ""} for your request.`;
      } else if (Array.isArray(data)) {
        // Fallback: CodeVariant[]
        variants = data.map(processVariant);
        aiContent = `Here are ${variants.length} implementation${variants.length !== 1 ? "s" : ""} for your request.`;
      } else if (data.code) {
        // Fallback: Single CodeVariant
        variants = [processVariant(data)];
        aiContent = "Here is the component you requested.";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiContent,
        type: "code",
        codeVariants: variants,
        // Fallback for legacy components
        codeBlock:
          variants.length > 0
            ? {
                language: variants[0].language,
                content: variants[0].code,
              }
            : undefined,
      };

      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === newMessage.id);
        const newMessages = [...prev];
        if (index !== -1) {
          newMessages.splice(index + 1, 0, aiMessage);
        } else {
          newMessages.push(aiMessage);
        }

        // If the panel was open on the message we just followed up on,
        // update it to the new AI message to keep the view "live".
        if (expandedCode) {
          // 'prev' contains the messages before the AI message was added.
          // The last message in 'prev' is the NEW user message.
          // The one before that is the OLD AI message.
          const lastAiMessage = prev.length >= 1 ? prev[prev.length - 1] : null;
          // Wait, prev[prev.length-1] is the user message.
          // We want to check if expandedCode was the PREVIOUS AI msg.
          const previousAiMessage = prev.findLast(
            (m) => m.role === "ai" && m.id === expandedCode,
          );

          if (previousAiMessage) {
            setExpandedCode(aiMessage.id);
            // Sync selected variant to the new message's variants
            if (variants.length > 0) {
              const currentLib = selectedVariant?.library;
              const nextVariant =
                variants.find((v) => v.library === currentLib) || variants[0];
              setSelectedVariant(nextVariant);
            }
          }
        }
        return newMessages;
      });
    } catch (error) {
      console.error("Error generating component:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Sorry, something went wrong while generating the component.",
        type: "text",
      };
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === newMessage.id);
        const newMessages = [...prev];
        if (index !== -1) {
          newMessages.splice(index + 1, 0, errorMessage);
        } else {
          newMessages.push(errorMessage);
        }
        return newMessages;
      });
      setGenerationError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatSession = async (sessionIdToLoad: string) => {
    setIsLoading(true);
    setIsHistoryOpen(false);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/history/${sessionIdToLoad}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sessionId")}`,
          },
        },
      );
      if (response.ok) {
        const sessionData = await response.json();
        // Restore messages with proper string IDs
        const normalizedMessages = sessionData.messages.map((m: any) => ({
          ...m,
          id: String(m.id || m._id || Date.now().toString()),
        }));
        setMessages(normalizedMessages);
        setChatSessionId(sessionIdToLoad);
        localStorage.setItem("chat_session_id", sessionIdToLoad);
        // localStorage.setItem("builder_messages", JSON.stringify(normalizedMessages)) is handled by the useEffect
        setExpandedCode(null);
        setSelectedVariant(undefined);
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoading(true); // Temporary flip to force a re-render or state check if needed
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleNewChat = () => {
    setMessages(INITIAL_MESSAGES);
    const newSessionId = Math.random().toString(36).substring(2, 15);
    setChatSessionId(newSessionId);
    localStorage.setItem("chat_session_id", newSessionId);
    localStorage.removeItem("builder_messages");
    setInputValue("");
    setExpandedCode(null);
    setSelectedVariant(undefined);
  };

  const handleDeleteSession = (deletedId: string) => {
    if (deletedId === chatSessionId) {
      handleNewChat();
    }
  };

  // Preview component for demonstration
  const PreviewButton = () => (
    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg active:scale-95 transition-all">
      Click Me
    </button>
  );

  const [activeTab, setActiveTab] = useState<"code" | "preview" | "sandbox">(
    "code",
  );

  const currentExpandedMessage = messages.find(
    (m) => String(m.id || (m as any)._id) === String(expandedCode),
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex relative overflow-hidden">
      {/*
        ========================================
        Main Content Area (Left Side)
        ========================================
      */}
      <div
        className={cn(
          "flex flex-col relative",
          "transition-all duration-300 ease-in-out",
        )}
        style={{
          width: expandedCode ? `${100 - panelWidth}%` : "100%",
          minWidth: expandedCode ? "320px" : "auto",
        }}
      >
        {/* Header Elements (Fixed) */}
        <div className="fixed top-0 left-0 w-full z-40 pointer-events-none p-4 md:p-6 flex justify-between items-start transition-all">
          <div className="pointer-events-auto flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-3 bg-muted/20 backdrop-blur-sm border border-border/50 hover:bg-muted/30 transition-all rounded-md cursor-pointer"
            >
              <ArrowLeft
                weight="BoldDuotone"
                size={20}
                className="text-muted-foreground hover:text-foreground"
              />
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 bg-muted/20 backdrop-blur-sm border border-border/50 hover:bg-muted/30 transition-all duration-300 px-3 py-3 rounded-full"
            >
              <div className="">
                <Library
                  weight="BoldDuotone"
                  className="w-5 h-5 text-black dark:text-white"
                />
              </div>
              <span className="font-semibold text-lg tracking-tight sm:block text-black dark:text-white md:inline hidden">
                Comps Inc.
              </span>
            </Link>
          </div>

          {/* Theme Toggle & Auth */}
          <div className="pointer-events-auto flex items-center gap-2">
            {user && (
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-muted/50 hover:bg-muted text-foreground rounded-md text-[14px] font-semibold transition-all cursor-pointer"
              >
                <ClockCircle weight="BoldDuotone" size={18} />
                <span className="hidden sm:inline">History</span>
              </button>
            )}
            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-3 bg-foreground text-background rounded-md text-[14px] font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Logout weight="BoldDuotone" size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname)}`}
                  className="flex items-center gap-2 px-4 py-3 bg-foreground text-background rounded-md text-[14px] font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Login weight="BoldDuotone" size={18} />
                  <span>Login</span>
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto pt-20 pb-56 scroll-smooth">
          <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-6">
            {messages.map((msg, index) => {
              if (msg.role === "user") {
                return (
                  <UserMessage
                    key={`${msg.id}-${index}`}
                    content={msg.content}
                    images={msg.images}
                    onCopy={() => {
                      navigator.clipboard.writeText(msg.content);
                    }}
                    onResend={() =>
                      handleSendMessage(msg.content, msg.images, msg.id)
                    }
                    onEdit={(newContent) =>
                      handleSendMessage(newContent, msg.images, msg.id)
                    }
                  />
                );
              }

              if (msg.role === "ai") {
                return (
                  <AIMessage key={`${msg.id}-${index}`} content={msg.content}>
                    {msg.codeVariants && msg.codeVariants.length > 0 && (
                      <div className="max-w-2xl">
                        <CodeCard
                          name={`Generated Component`}
                          language={msg.codeVariants[0].language} // Default/Fallback
                          code={msg.codeVariants[0].code} // Default/Fallback
                          variants={msg.codeVariants}
                          onExpand={(variant) => {
                            setExpandedCode(msg.id);
                            setSelectedVariant(variant);
                          }}
                        />
                      </div>
                    )}
                    {/* Fallback for old messages without variants */}
                    {!msg.codeVariants && msg.codeBlock && (
                      <CodeCard
                        language={msg.codeBlock.language}
                        code={msg.codeBlock.content}
                        onExpand={(variant) => {
                          setExpandedCode(msg.id);
                          setSelectedVariant(variant);
                        }}
                      />
                    )}
                  </AIMessage>
                );
              }

              return null;
            })}
            {isLoading && (
              <AIMessage content="">
                <AITextLoading />
              </AIMessage>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area (Bottom) */}
        <div
          className="fixed bottom-0 left-0 z-50 pointer-events-none"
          style={{
            right: expandedCode ? "auto" : "0",
            width: expandedCode ? `${100 - panelWidth}%` : "100%",
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
            <AIInput
              value={inputValue}
              onChange={setInputValue}
              onSend={(text, images) => handleSendMessage(text, images)}
              onNewChat={handleNewChat}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/*
        ========================================
        Right Side Panel (Code Expansion)
        ========================================
      */}
      <CodeExpansionPanel
        isOpen={!!expandedCode}
        onClose={() => {
          setExpandedCode(null);
          setActiveTab("code"); // Reset tab when closing
          setSelectedVariant(undefined);
        }}
        codeBlock={currentExpandedMessage?.codeBlock}
        variants={currentExpandedMessage?.codeVariants}
        selectedVariant={selectedVariant}
        PreviewComponent={PreviewButton}
        width={`${panelWidth}%`}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        messageId={expandedCode || undefined}
      />

      {/* Auth Required Dialog */}
      <AuthRequiredDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectSession={loadChatSession}
        onDeleteSession={handleDeleteSession}
        currentSessionId={chatSessionId}
      />
    </div>
  );
}
