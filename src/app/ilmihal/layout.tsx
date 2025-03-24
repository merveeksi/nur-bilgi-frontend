"use client";

export default function IlmihalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Main content */}
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
} 