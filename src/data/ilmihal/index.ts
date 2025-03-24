// Ömer Nasuhi Bilmen'in Büyük İslam İlmihali veri yapısı
export interface IlmihalSubSection {
  id: string;
  title: string;
  content: string;
}

export interface IlmihalSection {
  id: string;
  title: string;
  description?: string;
  subSections: IlmihalSubSection[];
}

export interface IlmihalChapter {
  id: string;
  title: string;
  description: string;
  sections: IlmihalSection[];
}

// İlmihal verileri
export const ilmihalData: IlmihalChapter[] = [
  {
    id: "itikat",
    title: "İtikat",
    description: "İslam dininin inanç esasları hakkında bilgiler",
    sections: [
      {
        id: "iman",
        title: "İman ve İslam",
        description: "İman ve İslam'ın manası, şartları, Allah'ın varlığı ve birliği",
        subSections: [
          {
            id: "iman-tanimi",
            title: "İmanın Tarifi",
            content: "İman, Hz. Muhammed'in (S.A.V.) Allah Teâlâ tarafından tebliğ buyurmuş olduğu şeylerin doğru olduğunu kalp ile kabul ve tasdik etmek demektir."
          },
          {
            id: "iman-sartlari",
            title: "İmanın Şartları",
            content: "İmanın şartları altıdır: Allah'a, Meleklere, Kitaplara, Peygamberlere, Ahiret Gününe, Kaza ve Kadere iman etmektir."
          },
          {
            id: "kelime-i-sehadet",
            title: "Kelime-i Şehadet",
            content: "Eşhedü en lâ ilâhe illallah ve eşhedü enne Muhammeden abdühû ve Rasûlüh."
          }
        ]
      },
      {
        id: "islam-esaslari",
        title: "İslam'ın Şartları",
        description: "İslam'ın beş şartı ve bunların önemi",
        subSections: [
          {
            id: "islam-sartlari",
            title: "İslam'ın Şartları",
            content: "İslam'ın şartları beştir: Kelime-i şehadet getirmek, namaz kılmak, oruç tutmak, zekât vermek ve hacca gitmektir."
          }
        ]
      }
    ]
  },
  {
    id: "taharet",
    title: "Taharet",
    description: "Temizlik ve abdest konuları hakkında bilgiler",
    sections: [
      {
        id: "abdest",
        title: "Abdest",
        description: "Abdestin tanımı, farzları, sünnetleri ve abdesti bozan şeyler",
        subSections: [
          {
            id: "abdestin-tanimi",
            title: "Abdestin Tanımı",
            content: "Abdest, belli uzuvları usulüne uygun olarak yıkamak ve mesh etmek suretiyle yapılan bir temizliktir."
          },
          {
            id: "abdestin-farzlari",
            title: "Abdestin Farzları",
            content: "Abdestin farzları dörttür: Yüzü bir kere yıkamak, kolları dirseklerle beraber yıkamak, başın dörtte birini mesh etmek, ayakları topuklarla beraber yıkamak."
          },
          {
            id: "abdesti-bozanlar",
            title: "Abdesti Bozan Şeyler",
            content: "Vücuttan kan, idrar, meni, mezi, vedi gibi şeylerin çıkması, yellenme, uyku ve bayılma gibi şeyler abdesti bozar."
          }
        ]
      },
      {
        id: "gusul",
        title: "Gusül",
        description: "Gusül abdesti ve önemi",
        subSections: [
          {
            id: "gusul-tanimi",
            title: "Gusül Abdestinin Tanımı",
            content: "Gusül, bütün vücudu su ile yıkamak suretiyle yapılan bir temizliktir."
          },
          {
            id: "gusul-farzlari",
            title: "Gusül Abdestinin Farzları",
            content: "Gusül abdestinin farzları üçtür: Ağza su vermek, buruna su vermek ve bütün vücudu kuru yer kalmayacak şekilde yıkamak."
          }
        ]
      }
    ]
  },
  {
    id: "namaz",
    title: "Namaz",
    description: "Namaz ibadeti hakkında detaylı bilgiler",
    sections: [
      {
        id: "namaz-vakitleri",
        title: "Namaz Vakitleri",
        description: "Beş vakit namazın vakitleri",
        subSections: [
          {
            id: "sabah-namazi",
            title: "Sabah Namazı",
            content: "Sabah namazının vakti, fecr-i sadık denilen tan yerinin ağarmasından güneşin doğmasına kadar olan zamandır."
          },
          {
            id: "ogle-namazi",
            title: "Öğle Namazı",
            content: "Öğle namazının vakti, güneşin zeval vaktinden, yani tepe noktasını geçip batıya doğru kaymasından başlayarak ikindi vaktine kadar olan zamandır."
          },
          {
            id: "ikindi-namazi",
            title: "İkindi Namazı",
            content: "İkindi namazının vakti, her şeyin gölgesi kendisinin iki misli olduğu zamandan güneşin batmasına kadar olan süredir."
          },
          {
            id: "aksam-namazi",
            title: "Akşam Namazı",
            content: "Akşam namazının vakti, güneşin batmasından şafağın kaybolmasına kadar olan zamandır."
          },
          {
            id: "yatsi-namazi",
            title: "Yatsı Namazı",
            content: "Yatsı namazının vakti, şafağın kaybolmasından fecrin doğmasına kadar olan zamandır."
          }
        ]
      },
      {
        id: "namaz-farzlari",
        title: "Namazın Farzları",
        description: "Namazın şartları ve rükünleri",
        subSections: [
          {
            id: "namaz-sartlari",
            title: "Namazın Şartları",
            content: "Namazın şartları: Hadesten taharet, necasetten taharet, setr-i avret, istikbal-i kıble, vakit ve niyet."
          },
          {
            id: "namaz-rukunleri",
            title: "Namazın Rükünleri",
            content: "Namazın rükünleri: İftitah tekbiri, kıyam, kıraat, rükû, secde, ka'de-i ahire."
          }
        ]
      }
    ]
  },
  {
    id: "oruc",
    title: "Oruç",
    description: "Oruç ibadeti, çeşitleri ve hükümleri",
    sections: [
      {
        id: "oruc-tanimi",
        title: "Orucun Tanımı ve Fazileti",
        description: "Orucun İslam'daki yeri ve önemi",
        subSections: [
          {
            id: "oruc-nedir",
            title: "Oruç Nedir?",
            content: "Oruç, imsak vaktinden iftar vaktine kadar yemek, içmek ve cinsel ilişkiden uzak durmaktır."
          },
          {
            id: "oruc-fazileti",
            title: "Orucun Fazileti",
            content: "Hz. Peygamber (S.A.V.) şöyle buyurmuştur: 'Oruç bir kalkandır. Kişi oruçlu olduğu zaman kötü söz söylemesin, kavga etmesin. Eğer biri kendisine sataşırsa, 'Ben oruçluyum' desin."
          }
        ]
      },
      {
        id: "oruc-cesitleri",
        title: "Oruç Çeşitleri",
        description: "Farz, vacip, nafile oruçlar",
        subSections: [
          {
            id: "farz-oruclar",
            title: "Farz Oruçlar",
            content: "Ramazan orucudur. Her mükellef Müslümanın Ramazan ayında oruç tutması farzdır."
          },
          {
            id: "vacip-oruclar",
            title: "Vacip Oruçlar",
            content: "Nezir (adak) orucu ve bozulan nafile orucun kazası vaciptir."
          },
          {
            id: "nafile-oruclar",
            title: "Nafile Oruçlar",
            content: "Pazartesi-Perşembe oruçları, Eyyam-ı Biyz oruçları (her ayın 13, 14, 15. günleri), Aşure orucudur."
          }
        ]
      }
    ]
  },
  {
    id: "zekat",
    title: "Zekât",
    description: "Zekât ibadeti ve hükümleri",
    sections: [
      {
        id: "zekat-tanimi",
        title: "Zekâtın Tanımı ve Fazileti",
        description: "Zekâtın İslam'daki yeri ve önemi",
        subSections: [
          {
            id: "zekat-nedir",
            title: "Zekât Nedir?",
            content: "Zekât, dinen zengin sayılan Müslümanların, her yıl mallarının belli bir miktarını Allah rızası için ihtiyaç sahiplerine vermeleridir."
          },
          {
            id: "zekat-fazileti",
            title: "Zekâtın Fazileti",
            content: "Zekât, İslam'ın beş şartından biridir. Allah Teâlâ Kur'an-ı Kerim'de zekâtı namazla birlikte zikretmiş ve verilmesini emretmiştir."
          }
        ]
      },
      {
        id: "zekat-sartlari",
        title: "Zekâtın Şartları",
        description: "Zekâtın farz olması ve verilmesi için gerekli şartlar",
        subSections: [
          {
            id: "zekat-farz-sartlari",
            title: "Zekâtın Farz Olmasının Şartları",
            content: "Müslüman olmak, hür olmak, akıl-baliğ olmak, nisab miktarı mala sahip olmak ve malın üzerinden bir yıl geçmesi."
          },
          {
            id: "zekat-verilebilecek-yerler",
            title: "Zekât Verilebilecek Yerler",
            content: "Fakirler, düşkünler, zekât toplama görevlileri, kalpleri İslam'a ısındırılmak istenenler, köleler, borçlular, Allah yolunda olanlar, yolda kalmış olanlar."
          }
        ]
      }
    ]
  }
]; 