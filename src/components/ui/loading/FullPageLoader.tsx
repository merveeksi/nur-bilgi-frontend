"use client";

import React from "react";

type FullPageLoaderProps = {
  text?: string;
  size?: "sm" | "md" | "lg";
};

const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  text = "Yükleniyor...",
  size = "lg",
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-80">
      <div className="flex flex-col items-center">
        <div className={`${sizeClasses[size]}`}>
          <span className="loader"></span>
        </div>
        {text && (
          <p className="mt-4 text-center text-emerald-700 dark:text-emerald-300">{text}</p>
        )}
      </div>
    </div>
  );
};

export default FullPageLoader; 