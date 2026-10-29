export type Package = {
  id: string;
  name: string;
  duration: string;
  route: string;
  summary: string;
  // Harga contoh (placeholder) dalam rupiah per orang. Ganti dengan data asli / ambil dari database.
  priceIdr: number;
  highlights: string[];
};

export const packages: Package[] = [
  {
    id: "2d1n-sembalun",
    name: "Summit Express",
    duration: "2 hari 1 malam",
    route: "Sembalun → Puncak → Sembalun",
    summary: "Untuk yang waktunya singkat dan ingin mengejar sunrise di puncak.",
    priceIdr: 1_800_000,
    highlights: ["Sunrise di puncak 3.726 mdpl", "Camp di Plawangan Sembalun", "Guide dan porter"],
  },
  {
    id: "3d2n-sembalun-senaru",
    name: "Crossing Trek",
    duration: "3 hari 2 malam",
    route: "Sembalun → Puncak → Senaru",
    summary: "Rute favorit: naik dari sisi savana, turun lewat hutan tropis.",
    priceIdr: 2_900_000,
    highlights: ["Danau Segara Anak", "Air panas alami", "Dua sisi gunung dalam satu trip"],
  },
  {
    id: "4d3n-segara-anak",
    name: "Segara Anak Journey",
    duration: "4 hari 3 malam",
    route: "Sembalun → Segara Anak → Puncak → Senaru",
    summary: "Ritme lebih santai dengan waktu penuh di tepi danau kawah.",
    priceIdr: 3_900_000,
    highlights: ["Dua malam dekat danau", "Waktu istirahat lebih longgar", "Cocok untuk fotografi"],
  },
];

export const itinerary = [
  {
    day: "Hari 1",
    title: "Savana Sembalun",
    text: "Jemput di Mataram atau bandara, lalu menuju gerbang Sembalun. Trekking melewati bukit savana menuju camp pertama.",
  },
  {
    day: "Hari 2",
    title: "Plawangan dan Puncak",
    text: "Berangkat dini hari menuju puncak untuk sunrise, kemudian turun dan lanjut ke Segara Anak atau kembali sesuai paket.",
  },
  {
    day: "Hari 3",
    title: "Segara Anak dan Senaru",
    text: "Sarapan di tepi danau, berendam di air panas, lalu turun melalui hutan lebat menuju gerbang Senaru.",
  },
];

export function formatIdr(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}
