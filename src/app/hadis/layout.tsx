export default function HadisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">{children}</main>
    </div>
  );
} 