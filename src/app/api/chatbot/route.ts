import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentUser } from '@/services/authService';
import { aiService } from '@/services/aiService';
import { User } from '@/services/authService';

// Chatbot isteği için tür tanımlaması
interface ChatbotRequest {
  message: string;
  sessionId: string;
}

// Kullanıcı sorgu hakkı izleme için basit bir in-memory cache
// Gerçek uygulamada bu veritabanında saklanmalıdır
const userQuestionCounts: Record<string, number> = {};

// Debug için sorgu sayılarını kontrol et (geliştirme sırasında yardımcı olur)
function logQuestionCounts() {
  console.log('Mevcut kullanıcı sorgu sayıları:', userQuestionCounts);
}

// Kullanıcı sorgularını yönetme fonksiyonu
function manageUserQuestionCount(userId: string | number): { 
  canAsk: boolean; 
  remaining: number;
  requiresPremium: boolean; 
} {
  console.log(`Kullanıcı ${userId} için sorgu hakkı kontrol ediliyor...`);
  console.log(`Mevcut soru sayısı: ${userQuestionCounts[userId] || 0}`);
  
  // Kullanıcının daha önce hiç soru sormadığı durumda
  if (!userQuestionCounts[userId]) {
    userQuestionCounts[userId] = 1;
    
    // Kullanıcının ilk sorusu, 2 hakkı daha var
    console.log(`Kullanıcı ${userId} ilk sorusunu sordu. Kalan hak: 2`);
    return { canAsk: true, remaining: 2, requiresPremium: false };
  }
  
  // Kullanıcının 3 ücretsiz soru hakkı var
  const FREE_QUESTION_LIMIT = 3;
  
  // Kullanıcının mevcut soru sayısını artır
  userQuestionCounts[userId]++;
  console.log(`Kullanıcı ${userId} için sorgu sayısı arttırıldı: ${userQuestionCounts[userId]}`);
  
  // Ücretsiz soru limitini aşıp aşmadığını kontrol et
  if (userQuestionCounts[userId] <= FREE_QUESTION_LIMIT) {
    const remaining = FREE_QUESTION_LIMIT - userQuestionCounts[userId];
    console.log(`Kullanıcı ${userId} için kalan ücretsiz sorgu hakkı: ${remaining}`);
    return { canAsk: true, remaining, requiresPremium: false };
  }
  
  // Premium kontrolü yapılabilir
  // Bu örnekte sadece basit bir flag dönüyoruz
  // Gerçek uygulamada kullanıcının premium üyeliği olup olmadığı kontrol edilmeli
  console.log(`Kullanıcı ${userId} için ücretsiz sorgu hakkı kalmadı, premium gerekiyor`);
  return { canAsk: false, remaining: 0, requiresPremium: true };
}

export async function POST(request: NextRequest) {
  try {
    // İstek verisini al
    const data: ChatbotRequest = await request.json();
    
    // Mesajın varlığını kontrol et
    if (!data.message || data.message.trim() === '') {
      return NextResponse.json({ 
        success: false, 
        error: 'Mesaj boş olamaz' 
      }, { status: 400 });
    }
    
    // Kullanıcı oturum durumunu kontrol et
    const isLoggedIn = isAuthenticated();
    const currentUser = getCurrentUser();
    
    // Debug için kullanıcı bilgilerini logla
    console.log('Kullanıcı giriş durumu:', isLoggedIn);
    console.log('Mevcut kullanıcı:', currentUser);
    
    // Kullanıcının dini bir soru sorup sormadığını kontrol et
    const isReligious = await aiService.isReligiousQuestion(data.message);
    console.log('Soru dini mi:', isReligious, 'Soru:', data.message);
    
    if (!isReligious) {
      return NextResponse.json({
        success: false,
        error: 'Üzgünüm, sadece dini konularda sorulara yanıt verebiliyorum.'
      }, { status: 400 });
    }
    
    let questionStatus = {
      canAsk: true,
      remaining: 3, // Giriş yapmayan kullanıcılar için varsayılan değer
      requiresPremium: false
    };
    
    let userId = 'anonymous';
    
    // Kullanıcı giriş yapmışsa soru haklarını kontrol et
    if (isLoggedIn && currentUser) {
      userId = String(currentUser.id);
      questionStatus = manageUserQuestionCount(userId);
      
      // Kullanıcı premium üyelik gerektiriyorsa
      if (questionStatus.requiresPremium) {
        return NextResponse.json({
          success: false,
          error: 'Ücretsiz soru hakkınız doldu. Daha fazla soru sormak için premium üyelik satın alın.',
          requiresPremium: true
        }, { status: 403 });
      }
    } else {
      // Anonim kullanıcılar için session ID kullan
      userId = data.sessionId;
      questionStatus = manageUserQuestionCount(userId);
      
      // Anonim kullanıcı için de premium kontrolü yap
      if (questionStatus.requiresPremium) {
        return NextResponse.json({
          success: false,
          error: 'Ücretsiz soru hakkınız doldu. Daha fazla soru sormak için giriş yapın ve premium üyelik satın alın.',
          requiresPremium: true
        }, { status: 403 });
      }
    }
    
    // Sorgu sayılarını debug için logla
    logQuestionCounts();
    
    // AI yanıtı oluştur
    const aiResponse = await aiService.generateReligiousResponse({
      prompt: data.message,
      sessionId: data.sessionId,
      userId: currentUser?.id
    });
    
    // Yanıtı döndür
    return NextResponse.json({
      success: true,
      message: aiResponse.response,
      questionStatus: {
        remaining: questionStatus.remaining,
        requiresPremium: questionStatus.requiresPremium
      }
    });
  } catch (error) {
    console.error('Chatbot API hatası:', error);
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası oluştu'
    }, { status: 500 });
  }
} 