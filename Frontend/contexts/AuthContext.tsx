"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  sessionId: string | null;
  login: (email: string, sessionId: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem("sessionId");
    const savedUser = localStorage.getItem("user");
    if (savedSession && savedUser) {
      setSessionId(savedSession);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, sId: string, u: User) => {
    setSessionId(sId);
    setUser(u);
    localStorage.setItem("sessionId", sId);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const logout = () => {
    setSessionId(null);
    setUser(null);
    localStorage.removeItem("sessionId");
    localStorage.removeItem("user");
    localStorage.removeItem("builder_messages");
    localStorage.removeItem("chat_session_id");
  };

  return (
    <AuthContext.Provider value={{ user, sessionId, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
