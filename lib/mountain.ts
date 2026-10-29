/* ────────────────────────────────────────────────────────
   Konten profil Gunung Rinjani
   Semua angka & fakta wajib diverifikasi ke sumber resmi
   (Balai Taman Nasional Gunung Rinjani) sebelum dipublikasikan.
   ──────────────────────────────────────────────────────── */

export const mountainFacts = {
  elevation: "3.726",
  elevationUnit: "mdpl",
  location: "Pulau Lombok, Nusa Tenggara Barat",
  status: "Taman Nasional Gunung Rinjani",
  type: "Gunung berapi aktif dengan kaldera dan Danau Segara Anak",
};

export const mountainAbout = {
  title: "Tentang Rinjani",
  paragraphs: [
    "Gunung Rinjani (3.726 mdpl) adalah gunung berapi aktif tertinggi kedua di Indonesia, terletak di Pulau Lombok, Nusa Tenggara Barat. Puncaknya menjulang di atas kaldera seluas ±50 km² yang di dalamnya terdapat Danau Segara Anak — sebuah danau kawah berwarna biru kehijauan pada ketinggian 2.000 mdpl.",
    "Di tengah danau muncul kerucut vulkanik muda bernama Gunung Barujari yang masih aktif dan terakhir meletus pada tahun 2016. Lingkungan kaldera ini menjadikan Rinjani salah satu panorama geologi paling spektakuler di Asia Tenggara.",
    "Kawasan Taman Nasional Gunung Rinjani meliputi 41.330 hektar hutan hujan tropis, savana, dan ekosistem sub-alpin, yang melindungi keanekaragaman hayati serta menjadi sumber air bagi seluruh Pulau Lombok.",
  ],
};

export type Trail = {
  id: string;
  name: string;
  character: string;
  duration: string;
  difficulty: "Mudah" | "Sedang" | "Sulit" | "Sangat Sulit";
  description: string;
  highlights: string[];
};

export const trails: Trail[] = [
  {
    id: "sembalun",
    name: "Jalur Sembalun",
    character: "Savana terbuka, padang rumput luas, tanjakan stabil",
    duration: "2–4 hari",
    difficulty: "Sedang",
    description:
      "Jalur paling populer, dimulai dari Desa Sembalun Lawang (1.150 mdpl). Melewati padang savana yang luas sebelum memasuki zona hutan dan tanjakan tajam menuju Plawangan Sembalun (2.639 mdpl). Dari sini pendaki bisa langsung ke puncak atau turun ke Segara Anak.",
    highlights: [
      "Pemandangan savana terluas di Lombok",
      "Camp di Plawangan Sembalun menghadap kaldera",
      "Jalur sunrise paling langsung ke puncak",
    ],
  },
  {
    id: "senaru",
    name: "Jalur Senaru",
    character: "Hutan tropis lebat, air terjun, suasana mistis",
    duration: "2–4 hari",
    difficulty: "Sedang",
    description:
      "Dimulai dari Desa Senaru (601 mdpl) di sisi utara. Menelusuri hutan tropis lebat dengan kanopi tinggi, melewati pos-pos pendakian hingga Plawangan Senaru (2.641 mdpl). Turunan curam membawa pendaki langsung ke tepi Danau Segara Anak.",
    highlights: [
      "Hutan tropis primer yang masih alami",
      "Akses langsung ke tepi Danau Segara Anak",
      "Air Terjun Sindang Gile dan Tiu Kelep di kaki gunung",
    ],
  },
  {
    id: "torean",
    name: "Jalur Torean",
    character: "Jalur pendek tapi curam, langsung ke danau",
    duration: "1–2 hari",
    difficulty: "Sulit",
    description:
      "Jalur tercepat menuju Segara Anak, dimulai dari Desa Torean di sisi barat. Pendek namun sangat curam dengan medan berbatu. Biasanya dipakai sebagai jalur alternatif turun atau oleh pendaki berpengalaman.",
    highlights: [
      "Jalur terpendek ke danau",
      "Medan menantang untuk petualang",
      "Relatif sepi dibanding Sembalun/Senaru",
    ],
  },
  {
    id: "timbanuh",
    name: "Jalur Timbanuh",
    character: "Hutan lebat, sungai, jarang dijelajahi",
    duration: "3–4 hari",
    difficulty: "Sangat Sulit",
    description:
      "Jalur dari sisi tenggara yang jarang digunakan. Melewati hutan lebat dan aliran sungai. Membutuhkan pengalaman pendakian tinggi dan wajib didampingi guide lokal.",
    highlights: [
      "Eksplorasi hutan belantara yang masih perawan",
      "Pengalaman pendakian yang autentik",
      "Untuk pendaki berpengalaman saja",
    ],
  },
  {
    id: "aik-berik",
    name: "Jalur Aik Berik",
    character: "Hutan tropis, air terjun bertingkat",
    duration: "3–4 hari",
    difficulty: "Sulit",
    description:
      "Dari sisi selatan gunung, melewati rangkaian air terjun menakjubkan sebelum memasuki hutan montane. Jalur ini paling jarang dilalui namun menawarkan kekayaan air terjun yang tak tertandingi.",
    highlights: [
      "Rangkaian air terjun bertingkat",
      "Vegetasi tropis paling beragam",
      "Ketenangan — hampir tidak ada pendaki lain",
    ],
  },
];

export const seasonGuide = {
  title: "Musim Terbaik & Cuaca",
  openSeason: "April – Desember (tergantung kebijakan Balai TNGR tiap tahun)",
  closedSeason: "Januari – Maret (musim hujan, jalur rawan longsor)",
  note: "Jadwal buka-tutup jalur berubah tiap tahun. Selalu cek informasi resmi Balai TNGR sebelum merencanakan pendakian.",
  weather: [
    {
      label: "Suhu puncak",
      value: "2–10 °C (malam bisa di bawah 0 °C saat musim kering)",
    },
    {
      label: "Suhu Segara Anak",
      value: "15–20 °C, air danau sekitar 20 °C",
    },
    {
      label: "Waktu terbaik",
      value: "Juni – September (kering, langit cerah, peluang sunrise terbaik)",
    },
  ],
  clothingTips: [
    "Lapisan dasar: kaos dryfit / merino wool",
    "Lapisan tengah: jaket fleece atau down ringan",
    "Lapisan luar: jaket tahan angin dan air (windbreaker / rain jacket)",
    "Celana panjang trekking, hindari jeans",
    "Sarung tangan, topi kupluk, buff / balaclava untuk puncak",
    "Sepatu trekking mid-cut dengan sol karet yang baik",
  ],
};

export const natureCulture = {
  title: "Alam & Budaya",
  sections: [
    {
      subtitle: "Flora",
      text: "Dari hutan hujan tropis dataran rendah hingga padang edelweiss Jawa (Anaphalis javanica) di ketinggian. Pohon-pohon Casuarina, pakis raksasa, dan anggrek endemik menghiasi lereng.",
    },
    {
      subtitle: "Fauna",
      text: "Lutung hitam Lombok (Trachypithecus auratus), musang luwak, elang Flores, dan berbagai jenis burung endemik. Danau Segara Anak juga menjadi habitat ikan mujair dan belut air tawar.",
    },
    {
      subtitle: "Air Panas Alami",
      text: "Di tepi Danau Segara Anak terdapat sumber air panas vulkanik yang digunakan pendaki untuk berendam setelah turun dari puncak — pengalaman paling ikonik di Rinjani.",
    },
    {
      subtitle: "Budaya Sasak & Wetu Telu",
      text: "Bagi masyarakat Sasak, Rinjani adalah gunung suci. Upacara Mulang Pekelem diadakan setiap tahun: persembahan berupa emas, kain, dan sesaji dilarung ke Danau Segara Anak sebagai wujud rasa syukur dan permohonan keselamatan.",
    },
  ],
};

export const safetyInfo = {
  title: "Keselamatan",
  items: [
    {
      icon: "❤️",
      label: "Kondisi Fisik",
      text: "Pendakian Rinjani membutuhkan stamina baik. Latihan kardio minimal 4 minggu sebelum trip. Tidak direkomendasikan bagi yang memiliki masalah jantung atau paru serius.",
    },
    {
      icon: "🏔️",
      label: "Aklimatisasi",
      text: "Ketinggian di atas 3.000 mdpl bisa menyebabkan mountain sickness. Naik perlahan, minum banyak air, dan jangan memaksakan diri saat merasa pusing atau mual.",
    },
    {
      icon: "📋",
      label: "Aturan Taman Nasional",
      text: "Wajib mendaftar di pos gerbang dan didampingi guide resmi. Dilarang membawa plastik sekali pakai. Seluruh sampah wajib dibawa turun. Dilarang merusak flora/fauna.",
    },
    {
      icon: "🎒",
      label: "Perlengkapan Wajib",
      text: "Sleeping bag (comfort rating 0 °C), matras, headlamp, rain cover, air minum minimal 3 liter/hari, obat pribadi, tabir surya, dan trekking pole.",
    },
  ],
};

export const navLinks = [
  { label: "Profil", href: "#profil" },
  { label: "Jalur", href: "#jalur" },
  { label: "Galeri", href: "#galeri" },
  { label: "Paket", href: "#paket" },
  { label: "Itinerary", href: "#itinerary" },
];

