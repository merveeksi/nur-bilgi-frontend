"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookText } from "lucide-react";

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

export default function IlmihalPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [chapters, setChapters] = useState<IlmihalChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = new URL('/api/ilmihal', window.location.origin);
        if (searchQuery) {
          url.searchParams.set('q', searchQuery);
        }

        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`İlmihal verileri yüklenirken hata oluştu: ${res.status}`);
        }

        const data = await res.json();
        setChapters(data);
      } catch (err: any) {
        console.error("İlmihal verisi yüklenirken hata:", err);
        setError(err.message || "İlmihal verileri yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [searchQuery]);

  const handleChapterClick = (chapterId: string) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
    setExpandedSection(null);
  };

  const handleSectionClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const navigateToChapter = (chapterId: string) => {
    router.push(`/ilmihal/${chapterId}`);
  };

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <BookText className="w-12 h-12 text-emerald-600 mb-2" />
          <h1 className="text-3xl font-bold text-center">Büyük İslam İlmihali</h1>
          <p className="text-center mt-2 text-gray-600">Ömer Nasuhi Bilmen</p>
        </div>
        
        <div className="mb-8">
          <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
              <div className="p-4 bg-gray-100">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <BookText className="w-12 h-12 text-emerald-600 mb-2" />
          <h1 className="text-3xl font-bold text-center">Büyük İslam İlmihali</h1>
          <p className="text-center mt-2 text-gray-600">Ömer Nasuhi Bilmen</p>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Hata</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <BookText className="w-12 h-12 text-emerald-600 mb-2" />
        <h1 className="text-3xl font-bold text-center">Büyük İslam İlmihali</h1>
        <p className="text-center mt-2 text-gray-600">Ömer Nasuhi Bilmen</p>
      </div>
      
      <div className="mb-8">
        <input
          type="text"
          placeholder="İlmihal içinde ara..."
          className="w-full p-3 border rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {chapters.length === 0 ? (
          <p className="text-center text-gray-500 my-12">Arama sonucu bulunamadı.</p>
        ) : (
          chapters.map((chapter) => (
            <div key={chapter.id} className="border rounded-lg overflow-hidden">
              <div className="flex">
                <div 
                  className="p-4 bg-gray-100 flex-grow flex justify-between items-center cursor-pointer"
                  onClick={() => handleChapterClick(chapter.id)}
                >
                  <div>
                    <h2 className="text-xl font-bold">{chapter.title}</h2>
                    <p className="text-sm text-gray-600">{chapter.description}</p>
                  </div>
                  <span className="text-2xl">
                    {expandedChapter === chapter.id ? "−" : "+"}
                  </span>
                </div>
                <button
                  className="bg-emerald-100 text-emerald-800 px-4 hover:bg-emerald-200 flex items-center"
                  onClick={() => navigateToChapter(chapter.id)}
                  title="Tüm bölümü görüntüle"
                >
                  Detay
                </button>
              </div>
              
              {expandedChapter === chapter.id && (
                <div className="p-4 space-y-4">
                  {chapter.sections.map((section) => (
                    <div key={section.id} className="border rounded-lg">
                      <div 
                        className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer"
                        onClick={() => handleSectionClick(section.id)}
                      >
                        <div>
                          <h3 className="text-lg font-semibold">{section.title}</h3>
                          {section.description && (
                            <p className="text-sm text-gray-600">{section.description}</p>
                          )}
                        </div>
                        <span className="text-xl">
                          {expandedSection === section.id ? "−" : "+"}
                        </span>
                      </div>
                      
                      {expandedSection === section.id && (
                        <div className="p-3 space-y-3">
                          {section.subSections.map((subSection) => (
                            <div key={subSection.id} className="bg-white p-3 rounded border">
                              <h4 className="font-medium mb-2">{subSection.title}</h4>
                              <p className="text-gray-700">{subSection.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
