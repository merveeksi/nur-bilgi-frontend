"use client";

import NavbarDemo from "@/components/navbar-demo";

export default function SSSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative">
      {/* Fixed floating navbar at the top */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4">
        <NavbarDemo />
      </div>
      
      {/* Main content */}
      <div className="pt-24">
        {children}
      </div>
    </div>
  );
} 