"use client";

import React from "react";
import IslamicLoader from "./IslamicLoader";

type FullPageLoaderProps = {
  text?: string;
  size?: "sm" | "md" | "lg";
};

const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  text = "Yükleniyor...",
  size = "lg",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen w-full items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-80">
      <IslamicLoader text={text} size={size} />
    </div>
  );
};

export default FullPageLoader; 