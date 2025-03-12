// app/ilmihalData.tsx

export interface IlmihalSection {
  id: string;
  title: string;
  content: string;
  subsections?: IlmihalSubsection[];
}

export interface IlmihalSubsection {
  id: string;
  title: string;
  content: string;
}

export interface Ilmihal {
  id: string;
  title: string;
  author: string;
  description: string;
  sections: IlmihalSection[];
}

export const ilmihalCollection: Ilmihal[] = [
  {
    id: 'temel-ilmihal',
    title: 'İslam\'ın Temel İlmihali',
    author: 'Çeşitli Alimler',
    description: 'İslam\'ın temel konularını içeren özet ilmihal.',
    sections: [
      {
        id: 'iman',
        title: 'İman',
        content: 'İman, Allah\'ın varlığına, birliğine, meleklerine, kitaplarına, peygamberlerine, ahiret gününe, kaza ve kadere inanmaktır. İslam\'da iman esasları şunlardır: Allah\'a iman, Meleklere iman, Kitaplara iman, Peygamberlere iman, Ahiret gününe iman, Kaza ve kadere imandır.'
      },
      {
        id: 'ibadet',
        title: 'İbadet',
        content: 'İbadet, kulun Allah\'a olan sevgi, saygı ve bağlılığını göstermek, O\'nun rızasını kazanmak için yapılan ve yapılması Allah tarafından istenen amellere denir. İslam\'ın beş şartı: Kelime-i şehadet, Namaz, Oruç, Zekat ve Hac\'tır.'
      },
      {
        id: 'ahlak',
        title: 'Ahlak',
        content: 'İslam ahlakı, insanın yaratıcısına, kendisine ve diğer insanlara karşı görevlerini ve sorumluluklarını belirleyen kurallar bütünüdür. Doğruluk, dürüstlük, merhamet, adalet, cömertlik, alçak gönüllülük İslam ahlakının temel prensipleridir.'
      }
    ]
  },
  {
    id: 'omer-nasuhi-bilmen',
    title: 'Büyük İslam İlmihali',
    author: 'Ömer Nasuhi Bilmen',
    description: 'Ömer Nasuhi Bilmen\'in meşhur ilmihal eseri.',
    sections: [
      {
        id: 'taharet',
        title: 'Taharet',
        content: 'Taharet, maddi ve manevi temizlik demektir. İslam dini temizliğe büyük önem vermiştir. Namaz için abdest ve gusül şarttır. Abdest, belli uzuvları yıkamak ve mesh etmek suretiyle yapılan temizliktir.'
      },
      {
        id: 'namaz',
        title: 'Namaz',
        content: 'Namaz, İslam\'ın beş şartından biridir. Günde beş vakit kılınması farzdır. Namaz, tekbir ile başlar, selam ile biter. Namazın şartları, rükünleri ve vacipleri vardır.'
      },
      {
        id: 'oruc',
        title: 'Oruç',
        content: 'Oruç, imsak vaktinden iftar vaktine kadar yeme, içme ve cinsel ilişkiden uzak durmaktır. Ramazan ayında oruç tutmak, İslam\'ın beş şartından biridir.'
      }
    ]
  },
  {
    id: 'diyanet-ilmihali',
    title: 'Diyanet İlmihali',
    author: 'Diyanet İşleri Başkanlığı',
    description: 'Türkiye Diyanet İşleri Başkanlığı tarafından hazırlanan resmi ilmihal kitabı.',
    sections: [
      {
        id: 'itikat',
        title: 'İtikat',
        content: 'İtikat, inanç demektir. İslam itikadının temeli tevhid inancıdır, yani Allah\'ın bir olduğuna inanmaktır. Müslümanların temel inanç esasları Kur\'an ve sünnette belirtilmiştir.'
      },
      {
        id: 'ibadetler',
        title: 'İbadetler',
        content: 'İbadetler, kulun Allah\'a yakınlaşmak için yaptığı her türlü hayırlı amellerdir. Farz ibadetler: Namaz, oruç, zekat ve hac\'tır. Bunların dışında nafile ibadetler de vardır.'
      },
      {
        id: 'muamelat',
        title: 'Muamelat',
        content: 'Muamelat, insanların birbirleriyle olan ilişkilerini düzenleyen hükümlerdir. Ticaret, evlilik, miras gibi konular muamelat bölümünde incelenir.'
      }
    ]
  }
]

