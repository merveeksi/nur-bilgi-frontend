// app/api/hadisler/route.ts
import { NextResponse } from "next/server";

const hadisData = {
  sahihHadisler: [
    {
      id: "h1",
      category: "ibadet",
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
      turkishText: "Ameller niyetlere göredir.",
      source: "Buhârî, Bed'ü'l-vahy, 1; Müslim, İmâre, 155",
      explanation:
        "Bir kimsenin yaptığı işin değeri, o işi hangi niyetle yaptığına bağlıdır. İbadetler ve diğer davranışlar, kişinin niyetine göre değer kazanır veya kaybeder.",
    },
    {
      id: "h2",
      category: "ahlak",
      arabic:
        "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
      turkishText:
        "Sizden biriniz kendisi için sevdiğini kardeşi için de sevmedikçe iman etmiş olmaz.",
      source: "Buhârî, Îmân, 7; Müslim, Îmân, 71",
      explanation:
        "Bu hadis, İslam'daki kardeşlik ve empati anlayışını ortaya koyar. Bir mümin, kendisi için istediği iyiliği başkaları için de istemelidir.",
    },
    {
      id: "h3",
      category: "iman",
      arabic:
        "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ",
      turkishText:
        "İslam beş temel üzerine kurulmuştur: Allah'tan başka ilah olmadığına ve Muhammed'in Allah'ın Resulü olduğuna şahitlik etmek, namaz kılmak, zekât vermek, hacca gitmek ve Ramazan orucunu tutmak.",
      source: "Buhârî, Îmân, 2; Müslim, Îmân, 21",
      explanation:
        "İslam'ın beş şartını açıklayan bu hadis, Müslümanların yerine getirmesi gereken temel görevleri belirtir.",
    },
    {
      id: "h4",
      category: "ilim",
      arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
      turkishText: "İlim öğrenmek her Müslümana farzdır.",
      source: "İbn Mâce, Mukaddime, 17",
      explanation:
        "İslam dini, bilgi edinmeyi ve kendini geliştirmeyi tüm Müslümanlar için bir görev olarak görür. Kişinin dinini ve dünyasını doğru şekilde yaşaması için bilgi şarttır.",
    },
    {
      id: "h5",
      category: "muamelat",
      arabic: "الدِّينُ النَّصِيحَةُ",
      turkishText: "Din nasihattir (samimiyettir).",
      source: "Müslim, Îmân, 95",
      explanation:
        "İslam'da samimiyet ve iyiliği tavsiye etmek dinin özüdür. Kişinin Allah'a, Resulüne, İslam büyüklerine ve tüm Müslümanlara karşı samimi ve dürüst olması gerekir.",
    },
    {
      id: "h6",
      category: "ahlak",
      arabic:
        "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
      turkishText:
        "Allah'a ve ahiret gününe iman eden kimse, ya hayır söylesin ya da sussun.",
      source: "Buhârî, Edeb, 31; Müslim, Îmân, 74",
      explanation:
        "Bu hadis, konuşmanın önemini ve sözün değerini vurgular. Müslümanlar, konuşurken faydalı şeyler söylemeli veya susmalıdır.",
    },
    {
      id: "h7",
      category: "ibadet",
      arabic: "إِنَّ اللهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ",
      turkishText: "Allah her şeyde ihsanı (mükemmelliği) yazmıştır.",
      source: "Müslim, Sayd, 57",
      explanation:
        "İhsan, işi en güzel şekilde yapmak demektir. Bu hadis, her işte kaliteyi ve mükemmelliği aramanın gerekliliğini vurgular.",
    },
    {
      id: "h8",
      category: "ilim",
      arabic:
        "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
      turkishText:
        "Kim ilim talep etmek için bir yola girerse, Allah ona cennetin yolunu kolaylaştırır.",
      source: "Müslim, Zikr, 38",
      explanation:
        "İlim öğrenmenin ve bilgi peşinde koşmanın faziletini anlatan bu hadis, ilim yolunda çaba gösterenlere Allah'ın cennet yolunu kolaylaştıracağını müjdeler.",
    },
    {
      id: "h9",
      category: "muamelat",
      arabic: "خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ وَأَنَا خَيْرُكُمْ لِأَهْلِي",
      turkishText:
        "Sizin en hayırlınız, ailesine karşı en hayırlı olanınızdır. Ben de aileme karşı en hayırlı olanınızım.",
      source: "Tirmizî, Menâkıb, 63",
      explanation:
        "Bu hadis, aile ilişkilerinin önemini ve aile üyelerine iyi davranmanın gerekliliğini vurgular. Peygamber Efendimiz kendisinin de ailesine karşı en iyi şekilde davrandığını belirtmiştir.",
    },
    {
      id: "h10",
      category: "iman",
      arabic:
        "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ مِنْ وَالِدِهِ وَوَلَدِهِ وَالنَّاسِ أَجْمَعِينَ",
      turkishText:
        "Sizden biriniz, ben ona babasından, evladından ve bütün insanlardan daha sevimli olmadıkça, iman etmiş olmaz.",
      source: "Buhârî, Îمân, 8; Müslim, Îمân, 70",
      explanation:
        "Hz. Peygamber'e olan sevginin, imanın bir göstergesi olduğunu belirten bu hadis, kişinin Peygamberimizi çok sevmesi gerektiğini vurgular.",
    },
  ],
  kirkHadis: [
    {
      id: "k1",
      number: 1,
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ...",
      turkishText: "Ameller niyetlere göredir...",
      source: "Buhârî, Bed'ü'l-vahy, 1; Müslim, İmâre, 155",
      explanation:
        "Bu hadis İmam Nevevi'nin kırk hadis derlemesinin ilk hadisidir. Bir işin değerinin niyete göre belirleneceğini belirtir.",
    },
    {
      id: "k2",
      number: 2,
      arabic:
        "بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ...",
      turkishText:
        "Bir gün Allah Resûlü (s.a.v.)'in yanında bulunduğumuz sırada, elbisesi bembeyaz, saçları simsiyah bir adam çıkageldi...",
      source: "Müslim, Îمân, 1",
      explanation:
        "Cebrail hadisi olarak bilinen bu rivayette, İslam'ın, imanın ve ihsanın ne olduğu açıklanmaktadır.",
    },
    {
      id: "k3",
      number: 3,
      arabic: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ...",
      turkishText: "İslam beş temel üzerine kurulmuştur...",
      source: "Buhârî, Îمân, 2; Müslim, İmâre, 21",
      explanation:
        "İslam'ın beş şartını açıklayan bu hadis, Müslümanların temel sorumluluklarını belirtir.",
    },
    {
      id: "k4",
      number: 4,
      arabic:
        "إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْمًا...",
      turkishText:
        "Sizden birinizin yaratılışı, annesinin karnında kırk günde toplanır...",
      source: "Buhârî, Bed'ü'l-halk, 6; Müslim, Kader, 1",
      explanation:
        "İnsanın anne karnındaki oluşum sürecini ve kaderin nasıl yazıldığını anlatan bir hadistir.",
    },
    {
      id: "k5",
      number: 5,
      arabic:
        "مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ",
      turkishText:
        "Kim bizim bu işimizde (dinimizde) ondan olmayan bir şey ihdas ederse, o reddedilir.",
      source: "Buhârî, Sulh, 5; Müslim, Akdiye, 17",
      explanation:
        "Bu hadis bidatlerin (dinde olmayan yeni uygulamaların) reddedileceğini belirtir.",
    },
    {
      id: "k6",
      number: 6,
      arabic:
        "إِنَّ الْحَلَالَ بَيِّنٌ وَإِنَّ الْحَرَامَ بَيِّنٌ وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ...",
      turkishText:
        "Helal bellidir, haram da bellidir. İkisinin arasında ise şüpheli şeyler vardır...",
      source: "Buhârî, Îمân, 39; Müslim, Müsâkât, 107",
      explanation:
        "Bu hadis, helal ve haramların yanında şüpheli konulardan da kaçınmak gerektiğini öğütler. Kalbin huzuru için şüpheli şeylerden uzak durmak gerekir.",
    },
    {
      id: "k7",
      number: 7,
      arabic: "الدِّينُ النَّصِيحَةُ...",
      turkishText: "Din nasihattir (samimiyettir)...",
      source: "Müslim, Îمân, 95",
      explanation:
        "Bu hadis, dinin özünün samimiyet olduğunu ve kişinin Allah'a, Peygamber'e ve tüm Müslümanlara karşı samimi olması gerektiğini vurgular.",
    },
    {
      id: "k8",
      number: 8,
      arabic:
        "أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لَا إِلَهَ إِلَّا اللَّهُ...",
      turkishText:
        "İnsanlar 'Lâ ilâhe illallah' diyene kadar onlarla savaşmakla emrolundum...",
      source: "Buhârî, Îمân, 17; Müslim, Îمân, 36",
      explanation:
        "Bu hadis, İslam'ın temel prensiplerini kabul eden kişilerin can ve mal güvenliğinin sağlanması gerektiğini ifade eder.",
    },
  ],
  bilinenYanlislar: [
    {
      id: "y1",
      title:
        "Bütün Hadislerin Aynı Güvenilirlik Seviyesine Sahip Olduğu Yanılgısı",
      description:
        "Hadisler, sahih, hasen ve zayıf gibi farklı derecelere ayrılır. Tüm hadisler aynı güvenilirlikte değildir. Bu nedenle hadisleri değerlendirirken sıhhat derecesine bakmak önemlidir.",
    },
    {
      id: "y2",
      title:
        "Hadislerin Hepsinin Hz. Peygamber'den Hemen Sonra Yazıldığı Yanılgısı",
      description:
        "Hadislerin yazılı olarak kaydedilmesi uzun bir süreç içinde gerçekleşmiştir. Hz. Peygamber döneminde bazı hadisler yazılmış olsa da, sistematik hadis koleksiyonları daha sonraki yüzyıllarda oluşturulmuştur.",
    },
    {
      id: "y3",
      title:
        "Sadece Buhârî ve Müslim'deki Hadislerin Sahih Olduğu Yanılgısı",
      description:
        "Buhârî ve Müslim en güvenilir hadis kaynaklarından olsa da, diğer hadis kitaplarında da sahih hadisler bulunmaktadır. Ayrıca, bu iki kaynakta da farklı derecelerde hadisler yer almaktadır.",
    },
    {
      id: "y4",
      title: "\"Uydurma Hadis\" ile \"Zayıf Hadis\"in Aynı Olduğu Yanılgısı",
      description:
        "Uydurma hadisler tamamen asılsız olup, Hz. Peygamber'e ait olmayan sözlerdir. Zayıf hadisler ise isnad açısından bazı kusurları olan, ancak tamamen reddedilmesi gerekmeyen hadislerdir.",
    },
    {
      id: "y5",
      title:
        "İnternette ve Sosyal Medyada Paylaşılan Tüm Hadislerin Doğru Olduğu Yanılgısı",
      description:
        "Günümüzde internet ve sosyal medyada Hz. Peygamber'e atfedilen pek çok söz paylaşılmaktadır. Ancak bunların büyük bir kısmı hadis değil, özlü sözler veya tamamen uydurmadır. Hadis olarak paylaşılan sözlerin mutlaka güvenilir kaynaklardan teyit edilmesi gerekir.",
    },
    {
      id: "y6",
      title: "Herkesin Hadis Rivayet Edebileceği Yanılgısı",
      description:
        "Hadis ilminde raviler (hadisi aktaranlar) titizlikle incelenir ve adalet, zabt (ezber kuvveti), takva gibi özelliklere sahip olmaları beklenir. Herkes hadis rivayet edemez ve rivayet edilen hadisler çeşitli kriterlere göre değerlendirilir.",
    },
    {
      id: "y7",
      title: "Hadislerin Kur'an'dan Bağımsız Olduğu Yanılgısı",
      description:
        "Hadisler, Kur'an'ın açıklayıcısı ve tamamlayıcısıdır. Kur'an'a aykırı bir hadis kabul edilmez. Hadisler Kur'an'la birlikte değerlendirilmelidir.",
    },
  ],
};

export async function GET() {
  return NextResponse.json(hadisData);
}
