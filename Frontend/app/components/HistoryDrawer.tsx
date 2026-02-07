"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  MinimalisticMagnifer,
  TrashBinMinimalistic,
  ChatLine,
  ClockCircle,
} from "@solar-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface HistorySession {
  _id: string;
  chatSessionId: string;
  title: string;
  updatedAt: string;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (sessionId: string) => void;
  currentSessionId?: string;
}

export default function HistoryDrawer({
  isOpen,
  onClose,
  onSelectSession,
  currentSessionId,
}: HistoryDrawerProps) {
  const { sessionId, user } = useAuth();
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadHistory();
    }
  }, [isOpen, user]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/history", {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/history/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });
      if (response.ok) {
        setHistory((prev) => prev.filter((s) => s.chatSessionId !== id));
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const filteredHistory = history.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="h-full flex flex-col border-l border-border/50 bg-background/95 backdrop-blur-xl">
        <DrawerHeader className="p-6 border-b border-border/50">
          <DrawerTitle className="text-xl font-bold flex items-center gap-2">
            <ChatLine weight="BoldDuotone" size={24} className="text-primary" />
            Chat History
          </DrawerTitle>
          <div className="relative mt-4">
            <MinimalisticMagnifer
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-muted/20 border border-border/50 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-lg bg-muted/20 animate-pulse"
                />
              ))}
            </div>
          ) : filteredHistory.length > 0 ? (
            <div className="space-y-1">
              {filteredHistory.map((session) => (
                <div
                  key={session._id}
                  onClick={() => onSelectSession(session.chatSessionId)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all group text-left cursor-pointer",
                    currentSessionId === session.chatSessionId
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/30 border border-transparent",
                  )}
                >
                  <div className="flex flex-col items-start gap-1 overflow-hidden">
                    <span
                      className={cn(
                        "text-sm font-medium truncate w-full",
                        currentSessionId === session.chatSessionId
                          ? "text-primary"
                          : "text-foreground",
                      )}
                    >
                      {session.title}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <ClockCircle size={12} />
                      {formatDistanceToNow(new Date(session.updatedAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteSession(e, session.chatSessionId)}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all"
                  >
                    <TrashBinMinimalistic size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-4 text-muted-foreground">
                <ChatLine size={24} />
              </div>
              <p className="text-sm font-medium text-foreground">
                No history found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {searchQuery
                  ? "Try a different search term"
                  : "Start a new chat to build your history"}
              </p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
