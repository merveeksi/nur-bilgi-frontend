"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { FullPageLoader } from "@/components/ui/loading";

// Define loading context type
interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
}

// Create context with default values
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  loadingText: "Yükleniyor...",
  showLoading: () => {},
  hideLoading: () => {},
});

// Create provider component
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Yükleniyor...");

  const showLoading = (text = "Yükleniyor...") => {
    setLoadingText(text);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingText,
        showLoading,
        hideLoading,
      }}
    >
      {children}
      {isLoading && <FullPageLoader text={loadingText} />}
    </LoadingContext.Provider>
  );
};

// Custom hook to use loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}; 