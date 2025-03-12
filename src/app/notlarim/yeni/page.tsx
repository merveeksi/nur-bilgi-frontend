import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

// Dinamik olarak yükle çünkü zengin metin editörü window nesnesine bağlı
const NoteEditor = dynamic(() => import("../[id]/page"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  ),
});

export default function NewNotePage() {
  return <NoteEditor />;
} 