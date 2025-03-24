import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

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

// GET isteği için belirli bir ilmihal bölümünü getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // URL'den query parametrelerini al
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('section');
    const subSectionId = searchParams.get('subsection');
    
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
      WHERE chapter = $1
    `;

    const queryParams: string[] = [id];

    // Section ID varsa filtreleme ekle
    if (sectionId) {
      query += ` AND section = $2`;
      queryParams.push(sectionId);

      // SubSection ID varsa filtreleme ekle
      if (subSectionId) {
        query += ` AND subsection = $3`;
        queryParams.push(subSectionId);
      }
    }

    // Sıralama ekle
    query += `
      ORDER BY 
        COALESCE(section, ''),
        COALESCE(subsection, ''),
        created_at DESC
    `;

    console.log("Veritabanı sorgusu çalıştırılıyor:", query);
    const result = await pool.query(query, queryParams);
    console.log(`${result.rows.length} kayıt bulundu`);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: `${id} bölümü bulunamadı` },
        { status: 404, headers: corsHeaders }
      );
    }

    // Sonuçları hiyerarşik yapıya dönüştür
    const chapter: IlmihalChapter = {
      id,
      title: id,
      description: `${id} bölümü`,
      sections: {}
    };

    result.rows.forEach((row: any) => {
      const sectionKey = row.section || 'general';
      
      // Section oluştur veya mevcut olanı al
      if (!chapter.sections[sectionKey]) {
        chapter.sections[sectionKey] = {
          id: sectionKey,
          title: sectionKey,
          description: `${sectionKey} kısmı`,
          subSections: []
        };
      }
      
      // SubSection ekle
      chapter.sections[sectionKey].subSections.push({
        id: row.id.toString(),
        title: row.title,
        content: row.content || row.description,
        tags: row.tags,
        created_at: row.created_at,
        updated_at: row.updated_at
      });
    });

    // Sections'ı diziye dönüştür
    const formattedChapter: FormattedChapter = {
      ...chapter,
      sections: Object.values(chapter.sections)
    };
    
    // Sadece bir alt bölüm istenmişse
    if (subSectionId) {
      const section = formattedChapter.sections.find(s => s.id === sectionId);
      if (!section) {
        return NextResponse.json(
          { error: `${sectionId} kısmı bulunamadı` },
          { status: 404, headers: corsHeaders }
        );
      }

      const subSection = section.subSections.find(ss => ss.id === subSectionId);
      if (!subSection) {
        return NextResponse.json(
          { error: `${subSectionId} alt başlığı bulunamadı` },
          { status: 404, headers: corsHeaders }
        );
      }

      return NextResponse.json(subSection, { headers: corsHeaders });
    }

    // Sadece bir kısım istenmişse
    if (sectionId) {
      const section = formattedChapter.sections.find(s => s.id === sectionId);
      if (!section) {
        return NextResponse.json(
          { error: `${sectionId} kısmı bulunamadı` },
          { status: 404, headers: corsHeaders }
        );
      }

      return NextResponse.json(section, { headers: corsHeaders });
    }

    // Tüm bölümü dön
    return NextResponse.json(formattedChapter, { headers: corsHeaders });
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