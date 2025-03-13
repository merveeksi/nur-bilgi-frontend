"use client";

export default function DuaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative">
      
      {/* Main content */}
      <div className="pt-24">
        {children}
      </div>
    </div>
  );
} 