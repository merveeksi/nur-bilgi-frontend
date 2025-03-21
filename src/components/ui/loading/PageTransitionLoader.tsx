"use client";

import React from "react";
import { useNavigationEvents } from "@/contexts/NavigationEvents";

const PageTransitionLoader = () => {
  const { isNavigating } = useNavigationEvents();

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm">
      <div className="flex items-center">
        <span className="loader"></span>
        <div className="ml-4 text-3xl font-bold text-emerald-600 dark:text-emerald-400 animate-pulse-text">
          <span className="inline-block animation-delay-100">N</span>
          <span className="inline-block animation-delay-200">u</span>
          <span className="inline-block animation-delay-300">r</span>
          <span className="inline-block animation-delay-400">&nbsp;</span>
          <span className="inline-block animation-delay-500">B</span>
          <span className="inline-block animation-delay-600">i</span>
          <span className="inline-block animation-delay-700">l</span>
          <span className="inline-block animation-delay-800">g</span>
          <span className="inline-block animation-delay-900">i</span>
        </div>
      </div>
    </div>
  );
};

export default PageTransitionLoader;

// CSS for the loader is added via a global stylesheet 