// Dua Service for managing common Islamic prayers and daily prayers

export interface Dua {
  id: string;
  title: string;
  arabic?: string;
  turkishText: string;
  transliteration?: string;
  translation?: string;
  source?: string; // Quran reference or hadith
  category: string;
  occasion?: string; // When this prayer is recommended
  virtues?: string; // Benefits of this prayer
}

export interface DailyDua {
  id: string;
  title: string;
  arabic?: string;
  turkishText: string;
  transliteration?: string;
  translation?: string;
  source?: string;
  date: string; // ISO date string
  virtues?: string;
}

// Common prayers in Islam
const commonDuas: Dua[] = [
  {
    id: "1",
    title: "Fatiha Suresi",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾",
    turkishText: "Bismillahirrahmanirrahim. Elhamdü lillahi rabbil alemin. Errahmanir rahim. Maliki yevmiddin. İyyake na'büdü ve iyyake neste'in. İhdinas sıratal müstakim. Sıratal leziyne en'amte aleyhim. Ğayril mağdubi aleyhim ve lad dallin.",
    translation: "Rahman ve Rahim olan Allah'ın adıyla. Hamd, alemlerin Rabbi Allah'a mahsustur. O Rahman'dır, Rahim'dir. Din (hesap) gününün sahibidir. (Rabbimiz!) Ancak sana kulluk ederiz ve yalnız senden yardım dileriz. Bizi doğru yola ilet. Kendilerine nimet verdiklerinin yoluna; gazaba uğrayanların ve sapıtanlarınkine değil.",
    source: "Kur'an-ı Kerim, 1:1-7",
    category: "Namaz Sureleri",
    virtues: "Her namazda okunan ve Kur'an'ın özü sayılan sure. Hastalıklara şifa olduğu ve duaların kabulüne vesile olduğu bildirilmiştir."
  },
  {
    id: "2",
    title: "Ayetel Kürsi",
    arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    turkishText: "Allahü la ilahe illa hüvel hayyül kayyum. La te'huzühu sinetün ve la nevm. Lehu ma fis semavati ve ma fil ard. Menzellezi yeşfeu indehu illa biiznih. Ya'lemü ma beyne eydihim ve ma halfehüm ve la yuhitune bişey'in min ilmihi illa bima şa'. Vesia kürsiyyühüs semavati vel ard. Ve la yeudühu hifzuhüma ve hüvel aliyyül azim.",
    translation: "Allah, kendisinden başka hiçbir ilah olmayandır. Diridir, kayyumdur. O'nu ne bir uyuklama tutabilir, ne de bir uyku. Göklerdeki ve yerdeki her şey O'nundur. İzni olmaksızın O'nun katında şefaatte bulunacak kimdir? O, kulların önlerindekini ve arkalarındakini (yaptıklarını ve yapacaklarını) bilir. Onlar O'nun ilminden, kendisinin dilediği kadarından başka bir şey kavrayamazlar. O'nun kürsüsü bütün gökleri ve yeri kaplayıp kuşatmıştır. (O, göklere, yere, bütün evrene hükmetmektedir.) Gökleri ve yeri koruyup gözetmek O'na güç gelmez. O, yücedir, büyüktür.",
    source: "Kur'an-ı Kerim, 2:255",
    category: "Koruyucu Dualar",
    virtues: "Her namazdan sonra okunması tavsiye edilir. Okuyan kişiyi korur ve şeytandan uzak tutar. Yatmadan önce okunursa, sabaha kadar koruma sağlar."
  },
  {
    id: "3",
    title: "Sabah Duası",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    turkishText: "Asbahna ve asbahal mülkü lillah, vel hamdü lillah, la ilahe illallahü vahdehü la şerikeleh, lehül mülkü ve lehül hamd, ve hüve ala külli şey'in kadir. Rabbi es'elüke hayra ma fi hazel yevmi ve hayra ma ba'dehü, ve euzü bike min şerri ma fi hazel yevmi ve şerri ma ba'dehü, rabbi euzü bike minel keseli ve suil kiber, rabbi euzü bike min azabin fin nari ve azabin fil kabr.",
    translation: "Sabahladık ve mülk de Allah için sabahladı. Hamd Allah'adır. Allah'tan başka ilah yoktur. O tektir, ortağı yoktur. Mülk O'nundur, hamd O'nadır ve O her şeye kadirdir. Ya Rabbi! Senden bu günün hayrını ve bundan sonrakinin hayrını isterim. Bu günün şerrinden ve bundan sonrakinin şerrinden de sana sığınırım. Ya Rabbi! Tembellikten ve kötü ihtiyarlıktan sana sığınırım. Ya Rabbi! Cehennemdeki ve kabirdeki azaptan sana sığınırım.",
    source: "Müslim",
    category: "Günlük Dualar",
    occasion: "Sabah kalkınca okunur",
    virtues: "Gün boyunca koruma ve bereket sağlar."
  },
  {
    id: "4",
    title: "Akşam Duası",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ، وَالْحَمْدُ للهِ، لَا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    turkishText: "Emseyna ve emsel mülkü lillah, vel hamdü lillah, la ilahe illallahü vahdehü la şerikeleh, lehül mülkü ve lehül hamd, ve hüve ala külli şey'in kadir. Rabbi es'elüke hayra ma fi hazihil leyleti ve hayra ma ba'deha, ve euzü bike min şerri ma fi hazihil leyleti ve şerri ma ba'deha, rabbi euzü bike minel keseli ve suil kiber, rabbi euzü bike min azabin fin nari ve azabin fil kabr.",
    translation: "Akşamladık ve mülk de Allah için akşamladı. Hamd Allah'adır. Allah'tan başka ilah yoktur. O tektir, ortağı yoktur. Mülk O'nundur, hamd O'nadır ve O her şeye kadirdir. Ya Rabbi! Senden bu gecenin hayrını ve bundan sonrakinin hayrını isterim. Bu gecenin şerrinden ve bundan sonrakinin şerrinden de sana sığınırım. Ya Rabbi! Tembellikten ve kötü ihtiyarlıktan sana sığınırım. Ya Rabbi! Cehennemdeki ve kabirdeki azaptan sana sığınırım.",
    source: "Müslim",
    category: "Günlük Dualar",
    occasion: "Akşam vakti okunur",
    virtues: "Gece boyunca koruma ve bereket sağlar."
  },
  {
    id: "5",
    title: "Yemek Duası",
    arabic: "بِسْمِ اللهِ وَعَلَى بَرَكَةِ الله",
    turkishText: "Bismillahi ve alâ bereketillah",
    translation: "Allah'ın adıyla ve Allah'ın bereketiyle",
    source: "Ebu Davud",
    category: "Günlük Dualar",
    occasion: "Yemekten önce okunur",
    virtues: "Yemeğe bereket katar ve şeytanı uzaklaştırır."
  },
  {
    id: "6",
    title: "Yemekten Sonra Dua",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَجَعَلَنَا مِنَ الْمُسْلِمِينَ",
    turkishText: "Elhamdü lillahillezi at'amena ve sekana ve ce'alena minel müslimin",
    translation: "Bizi yediren, içiren ve müslümanlardan kılan Allah'a hamd olsun.",
    source: "Tirmizi, Ebu Davud",
    category: "Günlük Dualar",
    occasion: "Yemekten sonra okunur",
    virtues: "Şükür vazifesini yerine getirmeye ve nimetin artmasına vesile olur."
  },
  {
    id: "7",
    title: "Uykudan Önce Dua",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    turkishText: "Bismike Allahumme emutü ve ahya",
    translation: "Allah'ım! Senin adınla ölür, senin adınla dirilirim.",
    source: "Buhari",
    category: "Günlük Dualar",
    occasion: "Yatarken okunur",
    virtues: "Uykuyu ibadete çevirir, koruma sağlar."
  },
  {
    id: "8",
    title: "Uykudan Uyanınca Dua",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    turkishText: "Elhamdü lillahillezi ahyana ba'de ma ematena ve ileyhin nüşur",
    translation: "Bizi öldürdükten sonra dirilten Allah'a hamd olsun. Dönüş yalnız O'nadır.",
    source: "Buhari",
    category: "Günlük Dualar",
    occasion: "Uykudan uyanınca okunur",
    virtues: "Güne şükür ve zikirle başlamayı sağlar."
  },
  {
    id: "9",
    title: "Yolculuk Duası",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    turkishText: "Sübhanellezi sehhara lena haza ve ma künna lehü mukriniyn ve inna ila Rabbina lemünkalibun",
    translation: "Bunu bizim hizmetimize vereni tesbih ederiz, yoksa biz buna güç yetiremezdik. Şüphesiz biz Rabbimize döneceğiz.",
    source: "Kur'an-ı Kerim, 43:13-14",
    category: "Günlük Dualar",
    occasion: "Yolculuğa çıkarken okunur",
    virtues: "Yolculuğun güvenli ve bereketli geçmesini sağlar."
  },
  {
    id: "10",
    title: "Sıkıntı Anında Okunacak Dua",
    arabic: "لا إِلَـهَ إِلاَّ اللهُ الْعَظِيمُ الْحَلِيمُ، لا إِلَـهَ إِلاَّ اللهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لا إِلَـهَ إِلاَّ اللهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
    turkishText: "La ilahe illallahül azimül halim. La ilahe illallahü rabbül arşil azim. La ilahe illallahü rabbüs semavati ve rabbül ardi ve rabbül arşil kerim",
    translation: "Azim ve halim olan Allah'tan başka ilah yoktur. Büyük arşın Rabbi olan Allah'tan başka ilah yoktur. Göklerin Rabbi, yerin Rabbi, değerli arşın Rabbi olan Allah'tan başka ilah yoktur.",
    source: "Buhari, Müslim",
    category: "Koruma ve Sıkıntı Duaları",
    occasion: "Üzüntü ve sıkıntı anında okunur",
    virtues: "Sıkıntının giderilmesine vesile olur."
  },
  {
    id: "11",
    title: "İstiğfar Duası",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلا أَنْتَ",
    turkishText: "Allahümme ente Rabbi la ilahe illa ente, halakteni ve ene abdüke, ve ene ala ahdike ve va'dike mestetat'tü, euzü bike min şerri ma sana'tü, ebuu leke bi ni'metike aleyye, ve ebuu bi zenbi fağfirli fe innehu la yağfiruz zünube illa ente.",
    translation: "Allah'ım! Sen benim Rabbimsin. Senden başka ilah yoktur. Beni Sen yarattın. Ben Senin kulunum ve gücüm yettiğince Sana olan ahdime ve vaadime bağlıyım. İşlediğim kötülüklerin şerrinden Sana sığınırım. Bana verdiğin nimetleri itiraf ederim. Günahlarımı da itiraf ederim. Beni bağışla, çünkü günahları ancak Sen bağışlarsın.",
    source: "Buhari",
    category: "Tövbe ve İstiğfar Duaları",
    virtues: "Bu duaya 'Seyyidü'l-İstiğfar' (istiğfarın efendisi) denilmiştir. Kim bunu gündüz okur ve o gün ölürse cennetlik olur. Kim bunu gece okur ve o gece ölürse cennetlik olur."
  },
  {
    id: "12",
    title: "Hasbünallah Duası",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    turkishText: "Hasbünallahü ve ni'mel vekil",
    translation: "Allah bize yeter. O ne güzel vekildir.",
    source: "Kur'an-ı Kerim, 3:173",
    category: "Koruma ve Sıkıntı Duaları",
    virtues: "Korkuları giderir, zorluklardan korur ve rızkı genişletir."
  }
];

// Current daily dua (would be updated regularly in a real app)
const dailyDua: DailyDua = {
  id: "daily-1",
  title: "Günün Duası - Bereket Duası",
  arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
  turkishText: "Allahümme barik lena fima razaktena ve kına azabennar",
  translation: "Allah'ım! Bize verdiğin rızıkta bereket ihsan eyle ve bizi cehennem azabından koru.",
  source: "Müslim",
  date: new Date().toISOString().split('T')[0], // Today's date
  virtues: "Günlük rızık ve bereket için okunması tavsiye edilir."
};

// Get all duas
export const getAllDuas = (): Dua[] => {
  return commonDuas;
};

// Get duas by category
export const getDuasByCategory = (category: string): Dua[] => {
  return commonDuas.filter(dua => dua.category === category);
};

// Get dua by ID
export const getDuaById = (id: string): Dua | undefined => {
  return commonDuas.find(dua => dua.id === id);
};

// Get daily dua
export const getDailyDua = (): DailyDua => {
  return dailyDua;
};

// Get unique categories
export const getDuaCategories = (): string[] => {
  const categories = new Set<string>();
  commonDuas.forEach(dua => categories.add(dua.category));
  return Array.from(categories);
}; 