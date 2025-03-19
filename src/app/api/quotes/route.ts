import { NextResponse } from 'next/server';

// Örnek alıntılar - gerçek uygulamada bunlar bir veritabanında saklanabilir
const quotes = [
  { 
    id: 1,
    quote: "En hayırlınız, Kur'an'ı öğrenen ve öğretendir.", 
    source: "Hadis-i Şerif"
  },
  { 
    id: 2,
    quote: "Her zorlukla beraber muhakkak bir kolaylık vardır.", 
    source: "İnşirah Suresi, 6. Ayet" 
  },
  { 
    id: 3,
    quote: "Allah, sabredenlerle beraberdir.", 
    source: "Bakara Suresi, 153. Ayet" 
  },
  { 
    id: 4,
    quote: "İlim öğrenmek, her Müslüman erkek ve kadına farzdır.", 
    source: "Hadis-i Şerif" 
  },
  { 
    id: 5,
    quote: "Kim bir hayra vesile olursa, o hayrı yapan gibi sevap kazanır.", 
    source: "Hadis-i Şerif" 
  },
  { 
    id: 6,
    quote: "Gerçek zenginlik, mal çokluğu değil, gönül tokluğudur.", 
    source: "Hadis-i Şerif" 
  },
  { 
    id: 7,
    quote: "Allah'ın rahmeti, öfkesini geçmiştir.", 
    source: "Hadis-i Şerif" 
  },
  { 
    id: 8,
    quote: "Rabbinizden bağışlanma dileyin; O, çok bağışlayıcıdır.", 
    source: "Nuh Suresi, 10. Ayet" 
  },
  { 
    id: 9,
    quote: "Şüphesiz hardal tanesi ağırlığınca da olsa, Allah onu getirir.", 
    source: "Lokman Suresi, 16. Ayet" 
  }
];

export async function GET() {
  try {
    // Burada veritabanı bağlantısı veya harici API istekleri yapılabilir
    
    // Random quotes gönder (örnek olarak)
    const randomQuotes = [...quotes].sort(() => 0.5 - Math.random());
    
    return NextResponse.json({ 
      success: true, 
      data: randomQuotes 
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { success: false, error: 'Alıntılar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 