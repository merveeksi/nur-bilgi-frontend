import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// CORS seçenekleri
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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
  sections: Record<string, IlmihalSection>;
}

interface FormattedChapter extends Omit<IlmihalChapter, 'sections'> {
  sections: IlmihalSection[];
}

// OPTIONS isteği için CORS yanıtı
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET isteği için ilmihal verilerini getir
export async function GET(request: Request) {
  try {
    // URL'den arama parametrelerini al
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    
    // Veritabanı bağlantısını kontrol et
    console.log("Veritabanına bağlanılıyor...");
    await pool.query('SELECT NOW()');
    console.log("Veritabanı bağlantısı başarılı!");

    // İlmihal verisini getir
    let query = `
      SELECT 
        id,
        book_name,
        author_name,
        title,
        description,
        content,
        chapter,
        section,
        subsection,
        tags,
        created_at,
        updated_at
      FROM ilmihal
      WHERE 1=1
    `;

    const queryParams: string[] = [];

    // Arama parametresi varsa filtreleme ekle
    if (searchQuery) {
      queryParams.push(`%${searchQuery}%`);
      query += `
        AND (
          title ILIKE $1 OR
          description ILIKE $1 OR
          content ILIKE $1 OR
          chapter ILIKE $1 OR
          section ILIKE $1 OR
          subsection ILIKE $1
        )
      `;
    }

    // Sıralama ekle
    query += `
      ORDER BY 
        COALESCE(chapter, ''),
        COALESCE(section, ''),
        COALESCE(subsection, ''),
        created_at DESC
    `;

    console.log("Veritabanı sorgusu çalıştırılıyor:", query);
    const result = await pool.query(query, queryParams);
    console.log(`${result.rows.length} kayıt bulundu`);

    // Sonuçları hiyerarşik yapıya dönüştür
    const chapters: Record<string, IlmihalChapter> = {};

    result.rows.forEach((row: any) => {
      const chapterKey = row.chapter || 'general';
      const sectionKey = row.section || 'general';
      
      // Chapter oluştur veya mevcut olanı al
      if (!chapters[chapterKey]) {
        chapters[chapterKey] = {
          id: chapterKey,
          title: chapterKey,
          description: `${chapterKey} bölümü`,
          sections: {}
        };
      }
      
      // Section oluştur veya mevcut olanı al
      if (!chapters[chapterKey].sections[sectionKey]) {
        chapters[chapterKey].sections[sectionKey] = {
          id: sectionKey,
          title: sectionKey,
          description: `${sectionKey} kısmı`,
          subSections: []
        };
      }
      
      // SubSection ekle
      chapters[chapterKey].sections[sectionKey].subSections.push({
        id: row.id.toString(),
        title: row.title,
        content: row.content || row.description,
        tags: row.tags,
        created_at: row.created_at,
        updated_at: row.updated_at
      });
    });

    // Her chapter için sections'ı diziye dönüştür
    const formattedChapters: FormattedChapter[] = Object.values(chapters).map(chapter => ({
      ...chapter,
      sections: Object.values(chapter.sections)
    }));

    return NextResponse.json(formattedChapters, { headers: corsHeaders });
  } catch (error: any) {
    console.error("İlmihal verisi API hatası:", error);
    return NextResponse.json(
      { 
        error: "İlmihal verisi alınırken bir hata oluştu", 
        details: error.message 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
