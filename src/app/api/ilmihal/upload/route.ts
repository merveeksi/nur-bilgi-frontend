import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import formidable from 'formidable'; // veya başka bir kütüphane
import { promises as fs } from 'fs';
import path from 'path';
import { pool } from '../../../../lib/db'; // PostgreSQL bağlantısı
import { CatechismRepository } from '@/core/data/CatechismRepository';

// New App Router route segment config format
export const dynamic = 'force-dynamic';
export const bodyParser = false;

// POST => /api/catechisms/upload
export async function POST(req: NextRequest) {
  try {
    // 1) Form verisini al (formidable kullanarak)
    const form = formidable({ multiples: false }); // tek dosya yüklenecek
    
    // Düzeltilmiş tip tanımı ile Promise
    const formData: Promise<{ fields: formidable.Fields; files: formidable.Files }> = new Promise((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });
    
    const { fields, files } = await formData;

    // 2) Dosyayı buffer olarak oku - formidable.Files yapısını doğru şekilde işle
    // PDF dosyası bir dizi veya tek dosya olarak gelebilir
    const pdfFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
    
    if (!pdfFile) {
      return NextResponse.json({ message: 'PDF file is missing' }, { status: 400 });
    }

    const filePath = pdfFile.filepath; // formidable, temp path üretir
    const fileBuffer = await fs.readFile(filePath);

    // 3) pdf-parse ile metin ayrıştırma
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text; 
    // text içinde PDF'in ham metni var (satır satır)

    // 4) (Opsiyonel) Metni başlık başlık ayırma
    // Burada "BÖLÜM", "KONU", "Başlık:" gibi pattern'lar ile split edebilirsiniz.
    // Basit bir örnek:
    const splittedByTitle = text.split(/BÖLÜM\s+\d+|KONU\s+\d+/g); 
    // Yukarıdaki regex: "BÖLÜM 1", "KONU 5" gibi yerleri yakalamaya çalışır.
    // Her bir splittedByTitle[i] bir kısım olacak.

    // 5) Örnek olarak splittedByTitle elemanlarını veritabanına ekleyelim
    const repo = new CatechismRepository(pool);
    // splittedByTitle[0] genelde "BÖLÜM 1" öncesindeki kısım olabilir, 
    // bu verileri loop ile kaydedebiliriz.
    
    // Düzeltilmiş for döngüsü
    for (let index = 0; index < splittedByTitle.length; index++) {
      const partialText = splittedByTitle[index];
      if (!partialText.trim()) continue; // boşsa geç

      // CreateCatechismDTO arayüzüne uygun alanlar
      await repo.createCatechism({
        bookName: `İlmihal PDF ${new Date().toISOString().split('T')[0]}`,   
        authorName: 'PDF Upload',
        title: `Bölüm ${index}`, 
        description: partialText,
        tags: 'otomatik'
      });
    }

    return NextResponse.json({ message: 'PDF uploaded & parsed successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
