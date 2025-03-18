"use client";

import React from "react";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
};

const IslamicLoader: React.FC<LoaderProps> = ({
  size = "md",
  text = "Yükleniyor...",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`relative ${sizeClasses[size]}`}>
          {/* Hilal animasyonu */}
          <div className="absolute inset-0 animate-pulse">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
            >
              <path
                d="M50 15C35.8 15 24 26.8 24 41C24 55.2 35.8 67 50 67C64.2 67 76 55.2 76 41C76 26.8 64.2 15 50 15ZM50 60C39.5 60 31 51.5 31 41C31 30.5 39.5 22 50 22C60.5 22 69 30.5 69 41C69 51.5 60.5 60 50 60Z"
                fill="currentColor"
                className="text-emerald-500 dark:text-emerald-400"
              />
            </svg>
          </div>

          {/* Dönen yıldız animasyonu */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
            >
              <path
                d="M50 20L53.9 35.1H69.8L56.9 44.9L60.9 60L50 50.2L39.1 60L43.1 44.9L30.2 35.1H46.1L50 20Z"
                fill="currentColor"
                className="text-emerald-600 dark:text-emerald-500"
              />
            </svg>
          </div>

          {/* Cami silueti */}
          <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
            >
              <path
                d="M50 10L40 25H60L50 10ZM45 25V40H55V25H45ZM30 40H70V45H30V40ZM35 45H65V75H55V60H45V75H35V45Z"
                fill="currentColor"
                className="text-emerald-700 dark:text-emerald-300"
              />
            </svg>
          </div>
        </div>
      </div>

      {text && (
        <p className="mt-4 text-center text-emerald-700 dark:text-emerald-300">{text}</p>
      )}
    </div>
  );
};

export default IslamicLoader; 