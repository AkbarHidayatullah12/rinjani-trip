export interface TrailInfo {
  id: string;
  name: string;
  startElevation: string;
  maxElevation: string;
  duration: string;
  terrain: string;
  waterSources: string;
  summary: string;
  steps: string[];
}

export const allTrails: TrailInfo[] = [
  {
    id: "sembalun",
    name: "Jalur Sembalun (Sisi Timur)",
    startElevation: "1.150 m dpl (Desa Sembalun Lawang)",
    maxElevation: "3.726 m dpl (Puncak)",
    duration: "2 hari 1 malam atau 3 hari 2 malam",
    terrain: "Padang savana terbuka, kontur landai lalu menanjak tajam di 7 Bukit Penyesalan",
    waterSources: "Pos 2 (Sungai Lokok Khayangan), Plawangan Sembalun",
    summary:
      "Rute paling populer bagi pendaki yang menargetkan puncak. Menghemat 550 meter elevasi awal karena posisi desa yang tinggi. Savana tidak memiliki tutupan kanopi pohon, sehingga perlindungan dari sengatan terik matahari mutlak diperlukan.",
    steps: [
      "Gerbang Sembalun ke Pos 2: Jalur datar menyusuri savana terbuka (±2,5 jam)",
      "Pos 2 ke Pos 3: Mulai tanjakan bertahap melintasi padang rumput (±1,5 jam)",
      "Pos 3 ke Plawangan Sembalun: Tujuh bukit menanjak terjal 'Bukit Penyesalan' (±3,5 jam)",
      "Plawangan ke Puncak 3.726 m: Pendakian dini hari di atas pasir dan kerikil vulkanik lepas (±3,5 jam)",
    ],
  },
  {
    id: "senaru",
    name: "Jalur Senaru (Sisi Utara)",
    startElevation: "601 m dpl (Desa Senaru)",
    maxElevation: "2.641 m dpl (Plawangan Senaru)",
    duration: "3 hari 2 malam atau 4 hari 3 malam",
    terrain: "Hutan hujan primer basah, akar pohon besar, jalur teduh terlindung kanopi lebat",
    waterSources: "Pos 2 (Mondokan Lokok), Pos 3 (Mondokan Mandiri)",
    summary:
      "Rute klasik yang menembus hutan tropis lebat. Perjalanan lebih sejuk karena terlindung kanopi pohon, namun elevasi yang harus ditempuh dari pos gerbang lebih tinggi dibanding Sembalun. Merupakan jalur terbaik untuk turun dari Danau Segara Anak.",
    steps: [
      "Gerbang Senaru ke Pos 1: Jalan setapak di batas perkebunan kopi dan hutan (±1 jam)",
      "Pos 1 ke Pos 2 & 3: Jalur tanah padat dengan akar pohon besar di bawah kanopi rimba (±4 jam)",
      "Pos 3 ke Plawangan Senaru (2.641 m): Tanjakan berbatu dengan panorama kawah yang mulai terbuka (±2,5 jam)",
      "Plawangan Senaru ke Danau: Turunan terjal menyusuri tebing berbatu menuju tepi air (±2,5 jam)",
    ],
  },
  {
    id: "torean",
    name: "Jalur Torean (Lembah & Sungai)",
    startElevation: "585 m dpl (Desa Torean)",
    maxElevation: "2.000 m dpl (Segara Anak)",
    duration: "Umumnya dipakai sebagai rute turun dari danau (1 hari)",
    terrain: "Tebing lembah curam, aliran sungai belerang, jembatan kayu di tebing",
    waterSources: "Sepanjang aliran sungai lembah",
    summary:
      "Jalur tradisional masyarakat lokal yang kini resmi dibuka. Menawarkan pemandangan ngarai spektakuler dan Air Terjun Penimbungan setinggi 100 meter. Jalur ini tidak menuju puncak langsung, melainkan jalan pintas dramatis menuju Danau Segara Anak.",
    steps: [
      "Tepi Danau ke Gua Susu: Melintasi sumber air panas dan celah tebing (±1,5 jam)",
      "Gua Susu ke Lembah Penimbungan: Menuruni bibir tebing dengan pemandangan air terjun (±3 jam)",
      "Lembah ke Pos Birisan Nangka & Gerbang Torean: Hutan bambu dan perkebunan warga (±3 jam)",
    ],
  },
  {
    id: "timbanuh",
    name: "Jalur Timbanuh (Sisi Selatan)",
    startElevation: "800 m dpl (Desa Timbanuh)",
    maxElevation: "3.500 m dpl (Puncak Selatan)",
    duration: "3 hari 2 malam",
    terrain: "Hutan lebat perawan, sungai alami, jalur sepi dan menantang",
    waterSources: "Pos 2 & Pos 3",
    summary:
      "Rute alternatif dari Lombok Timur menuju Puncak Selatan Rinjani. Jalur ini jarang dilalui wisatawan massal, menyuguhkan nuansa rimba sejati dan hamparan padang edelweiss di ketinggian.",
    steps: [
      "Gerbang Timbanuh ke Pos 2: Menembus hutan primer tropis yang lebat (±3 jam)",
      "Pos 2 ke Pos 3 & Pelawangan Timbanuh: Tanjakan mantap di punggung bukit (±4 jam)",
      "Pelawangan ke Puncak Selatan (3.500 m): Jalur cadas berbatu tanpa turunan ke danau (±2,5 jam)",
    ],
  },
  {
    id: "aik-berik",
    name: "Jalur Aik Berik (Air Terjun)",
    startElevation: "650 m dpl (Desa Aik Berik, Lombok Tengah)",
    maxElevation: "2.800 m dpl (Kawah Sisi Selatan)",
    duration: "3 hari 2 malam",
    terrain: "Hutan montane basah, rangkaian air terjun bertingkat",
    waterSources: "Pos 1, Pos 2, Pos 3 (sangat melimpah)",
    summary:
      "Jalur resmi dari kabupaten Lombok Tengah yang terkenal dengan air terjun Benang Kelambu di kaki gunung. Sangat teduh dengan keanekaragaman flora lumut dan pakis raksasa.",
    steps: [
      "Gerbang Aik Berik ke Pos 2: Melewati aliran mata air dan hutan pegunungan (±3 jam)",
      "Pos 2 ke Pos 3: Lintasan lembah basah dan punggungan sejuk (±3,5 jam)",
      "Pos 3 ke Bibir Kaldera Selatan: Pemandangan Segara Anak dari sudut yang jarang diabadikan (±2,5 jam)",
    ],
  },
];

