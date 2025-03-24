"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

// Tip tanımlamaları
interface IlmihalSubSection {
  id: string;
  title: string;
  content: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

interface IlmihalSection {
  id: string;
  title: string;
  description: string;
  subSections: IlmihalSubSection[];
}

interface IlmihalChapter {
  id: string;
  title: string;
  description: string;
  sections: IlmihalSection[];
}

export default function IlmihalDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [chapter, setChapter] = useState<IlmihalChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/ilmihal/${id}`);
        
        if (!res.ok) {
          throw new Error(`İlmihal bölümü yüklenirken hata oluştu: ${res.status}`);
        }

        const data = await res.json();
        setChapter(data);
      } catch (err: any) {
        console.error("İlmihal verisi yüklenirken hata:", err);
        setError(err.message || "İlmihal bölümü yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChapterData();
    }
  }, [id]);

  const handleSectionClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-8 mx-auto"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Hata</h1>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => router.push('/ilmihal')}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            İlmihal Ana Sayfasına Dön
          </button>
        </div>
      </div>
    );
  }

  // Bölüm bulunamadı
  if (!chapter) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bölüm Bulunamadı</h1>
          <p className="mb-6">İstediğiniz ilmihal bölümü bulunamadı.</p>
          <button
            onClick={() => router.push('/ilmihal')}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            İlmihal Ana Sayfasına Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/ilmihal" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          ← İlmihal Ana Sayfasına Dön
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">{chapter.title}</h1>
      <p className="text-gray-600 mb-8">{chapter.description}</p>

      <div className="space-y-6">
        {chapter.sections.map((section) => (
          <div key={section.id} className="border rounded-lg overflow-hidden">
            <div 
              className="p-4 bg-gray-100 flex justify-between items-center cursor-pointer"
              onClick={() => handleSectionClick(section.id)}
            >
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                {section.description && (
                  <p className="text-sm text-gray-600">{section.description}</p>
                )}
              </div>
              <span className="text-2xl">
                {expandedSection === section.id ? "−" : "+"}
              </span>
            </div>
            
            {expandedSection === section.id && (
              <div className="p-4 space-y-4">
                {section.subSections.map((subSection) => (
                  <div key={subSection.id} className="bg-white p-4 rounded border">
                    <h3 className="font-medium text-lg mb-3">{subSection.title}</h3>
                    <div className="prose max-w-none">
                      <p>{subSection.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 