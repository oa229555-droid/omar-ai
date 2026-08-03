// بيانات تجريبية للأنميات — استبدلها ببيانات حقيقية أو اربطها بـ API لاحقًا
const ANIME_DB = [
  {
    id: "shadow-blade",
    title: "نصل الظل",
    titleEn: "Shadow Blade",
    cover: "https://picsum.photos/seed/shadow-blade/500/700",
    banner: "https://picsum.photos/seed/shadow-blade-b/1200/500",
    genres: ["أكشن", "خيال", "مغامرة"],
    year: 2024,
    studio: "استوديو كيتسونه",
    status: "مستمر",
    episodesCount: 24,
    rating: 8.9,
    trending: true,
    addedAt: "2026-08-01",
    synopsis: "في عالم مزّقته الحروب بين القبائل الظليّة، يخوض الشاب كايتو رحلة للانتقام من قاتل عائلته، ليكتشف أن العدو الحقيقي أقرب مما تخيّل.",
    seasons: [
      { name: "الموسم الأول", episodes: 12 },
      { name: "الموسم الثاني", episodes: 12 },
    ],
    episodeList: [
      { num: 24, title: "المواجهة الأخيرة", date: "2026-08-03" },
      { num: 23, title: "الحقيقة المخفية", date: "2026-07-27" },
      { num: 22, title: "خيانة", date: "2026-07-20" },
    ],
  },
  {
    id: "stellar-drift",
    title: "انجراف نجمي",
    titleEn: "Stellar Drift",
    cover: "https://picsum.photos/seed/stellar-drift/500/700",
    banner: "https://picsum.photos/seed/stellar-drift-b/1200/500",
    genres: ["خيال علمي", "دراما"],
    year: 2025,
    studio: "استوديو نوفا",
    status: "مستمر",
    episodesCount: 16,
    rating: 9.2,
    trending: true,
    addedAt: "2026-08-02",
    synopsis: "طاقم سفينة استكشاف يجد نفسه عالقًا في بُعد زمني موازٍ، وعليهم إيجاد طريق العودة قبل أن تنهار حقيقتهم بالكامل.",
    seasons: [{ name: "الموسم الأول", episodes: 16 }],
    episodeList: [
      { num: 16, title: "البُعد المنسي", date: "2026-08-03" },
      { num: 15, title: "الانهيار", date: "2026-07-27" },
    ],
  },
  {
    id: "sakura-diaries",
    title: "يوميات ساكورا",
    titleEn: "Sakura Diaries",
    cover: "https://picsum.photos/seed/sakura-diaries/500/700",
    banner: "https://picsum.photos/seed/sakura-diaries-b/1200/500",
    genres: ["رومانسي", "شريحة من الحياة"],
    year: 2023,
    studio: "استوديو هانا",
    status: "منتهي",
    episodesCount: 12,
    rating: 8.1,
    trending: false,
    addedAt: "2026-07-15",
    synopsis: "قصة صداقة تتحول إلى حب بين طالبين في مدرسة ثانوية يابانية صغيرة، وسط فصول الساكورا المتغيرة.",
    seasons: [{ name: "موسم واحد", episodes: 12 }],
    episodeList: [{ num: 12, title: "الوداع", date: "2023-12-20" }],
  },
  {
    id: "iron-fang",
    title: "الناب الحديدي",
    titleEn: "Iron Fang",
    cover: "https://picsum.photos/seed/iron-fang/500/700",
    banner: "https://picsum.photos/seed/iron-fang-b/1200/500",
    genres: ["أكشن", "رياضة"],
    year: 2022,
    studio: "استوديو تايجر",
    status: "منتهي",
    episodesCount: 26,
    rating: 7.8,
    trending: false,
    addedAt: "2026-06-10",
    synopsis: "بطل مصارعة سابق يعتزل بسبب إصابة قاسية، ثم يعود للحلبة ليثبت أن الإرادة أقوى من الجسد.",
    seasons: [{ name: "الموسم الأول", episodes: 26 }],
    episodeList: [{ num: 26, title: "البطل من جديد", date: "2022-09-01" }],
  },
  {
    id: "whispering-forest",
    title: "الغابة الهامسة",
    titleEn: "Whispering Forest",
    cover: "https://picsum.photos/seed/whispering-forest/500/700",
    banner: "https://picsum.photos/seed/whispering-forest-b/1200/500",
    genres: ["فانتازيا", "غموض"],
    year: 2026,
    studio: "استوديو موكو",
    status: "مستمر",
    episodesCount: 6,
    rating: 8.6,
    trending: true,
    addedAt: "2026-08-03",
    synopsis: "قرية معزولة تحيط بها غابة يُقال إنها تهمس بأسرار الموتى، وفتاة تحاول كشف لغز اختفاء والدتها.",
    seasons: [{ name: "الموسم الأول", episodes: 12 }],
    episodeList: [
      { num: 6, title: "الهمسات الأولى", date: "2026-08-03" },
      { num: 5, title: "الأثر", date: "2026-07-27" },
    ],
  },
  {
    id: "chrono-knights",
    title: "فرسان الزمن",
    titleEn: "Chrono Knights",
    cover: "https://picsum.photos/seed/chrono-knights/500/700",
    banner: "https://picsum.photos/seed/chrono-knights-b/1200/500",
    genres: ["أكشن", "خيال علمي", "مغامرة"],
    year: 2021,
    studio: "استوديو زينيث",
    status: "منتهي",
    episodesCount: 48,
    rating: 9.0,
    trending: false,
    addedAt: "2026-05-05",
    synopsis: "فرسان يمتلكون قدرة التنقل عبر الزمن، مهمتهم منع كارثة ستمحو التاريخ البشري بأكمله.",
    seasons: [
      { name: "الموسم الأول", episodes: 24 },
      { name: "الموسم الثاني", episodes: 24 },
    ],
    episodeList: [{ num: 48, title: "نهاية الحلقة الزمنية", date: "2021-12-30" }],
  },
  {
    id: "midnight-bakery",
    title: "مخبز منتصف الليل",
    titleEn: "Midnight Bakery",
    cover: "https://picsum.photos/seed/midnight-bakery/500/700",
    banner: "https://picsum.photos/seed/midnight-bakery-b/1200/500",
    genres: ["كوميدي", "شريحة من الحياة"],
    year: 2026,
    studio: "استوديو يوكي",
    status: "مستمر",
    episodesCount: 8,
    rating: 8.3,
    trending: false,
    addedAt: "2026-07-28",
    synopsis: "مخبز غامض لا يفتح أبوابه إلا بعد منتصف الليل، وزبائنه من كائنات لا تنتمي لعالمنا.",
    seasons: [{ name: "الموسم الأول", episodes: 12 }],
    episodeList: [
      { num: 8, title: "خبز القمر", date: "2026-08-03" },
      { num: 7, title: "الزبون الغريب", date: "2026-07-27" },
    ],
  },
  {
    id: "crimson-arena",
    title: "الحلبة القرمزية",
    titleEn: "Crimson Arena",
    cover: "https://picsum.photos/seed/crimson-arena/500/700",
    banner: "https://picsum.photos/seed/crimson-arena-b/1200/500",
    genres: ["أكشن", "دراما"],
    year: 2020,
    studio: "استوديو تايجر",
    status: "منتهي",
    episodesCount: 22,
    rating: 7.5,
    trending: false,
    addedAt: "2026-04-01",
    synopsis: "بطولة قتالية سرية يشارك فيها من لا خيار أمامه سوى الفوز أو الموت.",
    seasons: [{ name: "موسم واحد", episodes: 22 }],
    episodeList: [{ num: 22, title: "الفائز الأخير", date: "2020-08-15" }],
  },
];

// أنميات مقترحة اليوم (تُستخدم في قسم "حلقات نزلت اليوم")
function getEpisodesToday() {
  const today = new Date().toISOString().slice(0, 10);
  return ANIME_DB.filter((a) => a.episodeList[0] && a.episodeList[0].date === "2026-08-03");
}

function getTrending() {
  return ANIME_DB.filter((a) => a.trending);
}

function getTopRated() {
  return [...ANIME_DB].sort((a, b) => b.rating - a.rating).slice(0, 6);
}

function getLatestAdded() {
  return [...ANIME_DB].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)).slice(0, 6);
}

function getAllGenres() {
  const set = new Set();
  ANIME_DB.forEach((a) => a.genres.forEach((g) => set.add(g)));
  return [...set].sort();
}

function getAllStudios() {
  return [...new Set(ANIME_DB.map((a) => a.studio))].sort();
}

function getById(id) {
  return ANIME_DB.find((a) => a.id === id);
}
