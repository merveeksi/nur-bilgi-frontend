import NavbarDemo from "@/components/navbar-demo";

export default function HadisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarDemo />
      <main className="flex-1">{children}</main>
    </div>
  );
} 