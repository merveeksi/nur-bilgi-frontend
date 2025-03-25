import { api } from './apiClient';

// AI Yanıt İstek Modeli
export interface AiRequestModel {
  prompt: string;
  sessionId?: string;
  userId?: string | number;
}

// AI Yanıt Sonuç Modeli
export interface AiResponseModel {
  response: string;
  isReligious: boolean;
  confidence: number;
}

/**
 * AI API'sine istek göndererek dini soruların yanıtlarını oluşturan servis
 * 
 * Not: Bu dosya gerçek bir AI API'sine (OpenAI, HuggingFace, vb.) bağlanacak şekilde
 * değiştirilmelidir. Şu anki haliyle test amacıyla mock yanıtlar üretmektedir.
 */
export const aiService = {
  // Dini bir soruya yanıt oluşturur
  async generateReligiousResponse(request: AiRequestModel): Promise<AiResponseModel> {
    try {
      // OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4", // İslami bilgiye sahip bir model kullanın
          messages: [
            {
              role: "system",
              content: "Sen dini konularda bilgi veren bir dini yapay zeka asistanısın. Sadece dini sorulara cevap vermelisin."
            },
            {
              role: "user", 
              content: request.prompt
            }
          ],
          max_tokens: 500
        })
      });

      const data = await response.json();
      return {
        response: data.choices[0].message.content,
        isReligious: true,
        confidence: 0.95
      };
    } catch (error) {
      console.error('AI yanıt oluşturma hatası:', error);
      // API hatası durumunda mock yanıtı döndür
      return this.mockResponseGenerator(request.prompt);
    }
  },
  
  // Gelen metnin dini bir soru olup olmadığını kontrol eder
  async isReligiousQuestion(text: string): Promise<boolean> {
    try {
      // Gerçek uygulamada burada NLP/AI API'sine istek yapılmalıdır
      // Örneğin:
      // const response = await api.post<{ isReligious: boolean }>('/ai/classifyText', { text });
      // return response.isReligious;
      
      // Daha gelişmiş bir keyword tabanlı sınıflandırma
      const religiousKeywords = [
        // Temel dini terimler
        'allah', 'tanrı', 'islam', 'müslüman', 'kuran', 'ayet', 'hadis', 
        'peygamber', 'muhammed', 'namaz', 'oruç', 'zekat', 'hac', 'ibadet',
        'dua', 'sure', 'dini', 'ahiret', 'cennet', 'cehennem', 'günah', 'sevap',
        'helal', 'haram', 'cami', 'abdest', 'gusül', 'mezhep', 'fetva', 'şeriat',
        'mekruh', 'vacip', 'farz', 'sünnet', 'ezan', 'ramazan', 'kurban', 'bayram',
        
        // Yaygın dini tamlamalar
        'iman', 'imanın', 'şartları', 'islamın şartları', 'beş vakit', 'secde',
        'kaza', 'kaza namazı', 'teravih', 'kelime-i şehadet', 'şehadet',
        'orucu bozan', 'abdesti bozan', 'guslü', 'bozan', 'bozulur', 'iman şartları',
        'sabah namazı', 'akşam namazı', 'öğle namazı', 'yatsı namazı', 'ikindi namazı',
        'salavat', 'ayet-el kürsi', 'fatiha', 'ihlas', 'sahabeler', 'sahabe',
        'teyemmüm', 'fıkıh', 'kelam', 'tefsir', 'tesettür', 'başörtüsü', 'türban',
        'meal', 'tefsir', 'sadaka', 'fitre', 'fidye', 'iftar', 'sahur', 'niyaz',
        'mevlid', 'kandil', 'cuma namazı', 'bayram namazı', 'teravih namazı',
        'mübarek', 'hicri', 'miladı', 'hicret', 'rekat', 'sure', 'ayet',
        'mekke', 'medine', 'kudüs', 'kıble', 'zemzem', 'tavaf', 'umre',
        'şükür', 'tövbe', 'tevbe', 'kul hakkı', 'kaza', 'kader', 'tevekkül',
        'alim', 'imam', 'müftü', 'vaiz', 'hutbe', 'vaaz', 
        
        // Yaygın soru formları
        'dinen', 'dini açıdan', 'caiz mi', 'günah mı', 'sevap mı', 'nasıl', 'yapılır',
        'namaz nasıl', 'abdest nasıl', 'gusül nasıl', 'oruç nasıl', 'ne zaman',
        'nedir', 'nelerdir', 'kaç', 'hangi', 'nasıl kılınır', 'nasıl tutulur'
      ];
      
      const lowerText = text.toLowerCase();
      
      // Tam kelime eşleşmesi kontrolü
      for (const keyword of religiousKeywords) {
        if (lowerText.includes(keyword)) {
          return true;
        }
      }
      
      // Ayrıca bazı özel tamlamaları kontrol et
      const religiousPhrases = [
        'orucu bozan', 'orucum bozulur', 'namazım bozulur', 'abdestim bozulur',
        'imanın şartları', 'islamın şartları', 'namaz nasıl kılınır', 'oruç nasıl tutulur',
        'dini günler', 'dini bayramlar', 'dinen caiz mi', 'dini hükümler'
      ];
      
      for (const phrase of religiousPhrases) {
        if (lowerText.includes(phrase)) {
          return true;
        }
      }
      
      // Eğer hiçbir kelime veya tamlama eşleşmezse false döndür
      return false;
    } catch (error) {
      console.error('Metin sınıflandırma hatası:', error);
      throw error;
    }
  },
  
  // Test amacıyla örnek yanıtlar üreten fonksiyon
  mockResponseGenerator(prompt: string): AiResponseModel {
    const sampleResponses = [
      "İslam'da namaz, günde beş vakit kılınması farz olan bir ibadettir. Sabah, öğle, ikindi, akşam ve yatsı vakitlerinde yerine getirilir.",
      "Ramazan ayı, İslam dininde oruç tutulması farz olan mübarek bir aydır. Bu ayda gün doğumundan gün batımına kadar yeme, içme ve diğer belirli davranışlardan uzak durulur.",
      "Kuran-ı Kerim, Allah tarafından Hz. Muhammed'e vahiy yoluyla indirilen kutsal kitaptır ve İslam'ın temel kaynaklarından biridir.",
      "İslam'ın beş şartı: Kelime-i şehadet getirmek, namaz kılmak, zekat vermek, oruç tutmak ve hacca gitmektir.",
      "Hadisler, Hz. Muhammed'in söz, fiil ve takrirlerini içeren rivayetlerdir ve İslam hukukunun Kuran'dan sonraki ikinci temel kaynağıdır.",
      "Zekat, belirli bir miktarda mala sahip olan Müslümanların yılda bir kez mallarının kırkta birini ihtiyaç sahiplerine vermeleri gereken mali bir ibadettir.",
      "Allah'ın 99 ismi (Esma-ül Hüsna) vardır ve bunlar Allah'ın sıfatlarını ve niteliklerini yansıtır.",
      "İslam'da tevbe, kişinin günahlarından pişmanlık duyarak Allah'tan af dilemesi ve bir daha o günahı işlememeye niyet etmesidir.",
      "Orucu bozan şeyler temel olarak bilerek yemek yemek, içmek, cinsel ilişkide bulunmak, sigara içmek, enjeksiyon dışında damardan ilaç almak, kusmak (kasten) ve adet/loğusa hali olarak sayılabilir.",
      "İmanın şartları 6 tanedir: Allah'a inanmak, Meleklere inanmak, Kitaplara inanmak, Peygamberlere inanmak, Ahiret gününe inanmak ve Kader ve kazaya inanmak.",
    ];
    
    // Kullanıcının sorusuna daha uygun yanıt seçimi için basit bir anahtar kelime kontrolü
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('orucu bozan') || lowerPrompt.includes('oruç bozulur')) {
      return {
        response: "Orucu bozan durumlar şunlardır: Kasten yemek veya içmek, cinsel ilişkide bulunmak, sigara içmek ve benzeri şeyler ağızdan duman almak, kusma (kasten), ağız dolusu kusmak, kan aldırmak, gıybet etmek ve adet görmek/loğusa olmak.",
        isReligious: true,
        confidence: 0.98
      };
    }
    
    if (lowerPrompt.includes('iman') && (lowerPrompt.includes('şartlar') || lowerPrompt.includes('şart'))) {
      return {
        response: "İmanın şartları 6 tanedir: 1) Allah'a inanmak, 2) Meleklere inanmak, 3) Kitaplara inanmak, 4) Peygamberlere inanmak, 5) Ahiret gününe inanmak, 6) Kader ve kazaya inanmak.",
        isReligious: true,
        confidence: 0.99
      };
    }
    
    // İslami içerik kontrolü
    const isReligious = this.isReligiousPrompt(prompt);
    
    if (!isReligious) {
      return {
        response: "Üzgünüm, sadece dini sorulara yanıt verebiliyorum.",
        isReligious: false,
        confidence: 0.95
      };
    }
    
    // Rastgele bir yanıt seç
    const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
    
    return {
      response: randomResponse,
      isReligious: true,
      confidence: 0.92
    };
  },
  
  // Prompt'un dini içerikli olup olmadığını kontrol eden yardımcı fonksiyon
  isReligiousPrompt(prompt: string): boolean {
    const religiousKeywords = [
      'allah', 'tanrı', 'islam', 'müslüman', 'kuran', 'ayet', 'hadis', 
      'peygamber', 'muhammed', 'namaz', 'oruç', 'zekat', 'hac', 'ibadet',
      'dua', 'sure', 'dini', 'ahiret', 'cennet', 'cehennem', 'günah', 'sevap',
      'helal', 'haram', 'cami', 'abdest', 'gusül', 'mezhep', 'fetva', 'şeriat',
      'iman', 'şart', 'islamın', 'bozan', 'bozulur', 'şartlar'
    ];
    
    const lowerPrompt = prompt.toLowerCase();
    return religiousKeywords.some(keyword => lowerPrompt.includes(keyword));
  }
}; 