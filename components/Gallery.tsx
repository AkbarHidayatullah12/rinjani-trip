"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  location: string;
  category: "kaldera" | "puncak" | "jalur";
  description: string;
}

export const allGalleryItems: GalleryItem[] = [
  {
    id: "kaldera-4k",
    src: "/gallery/rinjani-4.jpg",
    title: "Kaldera Segara Anak & Kerucut Barujari",
    location: "Plawangan Sembalun, 2.639 m dpl",
    category: "kaldera",
    description: "Keluasan kaldera 50 km² dengan danau toska berkedalaman 230 meter dan kerucut vulkanik aktif Barujari di tengahnya.",
  },
  {
    id: "fajar-puncak",
    src: "/gallery/rinjani-1.jpg",
    title: "Semburat Fajar di Atas Samudra Awan",
    location: "Punggungan Puncak, 3.500 m dpl",
    category: "puncak",
    description: "Cahaya keemasan matahari terbit menyinari lautan awan kumulus sebelum mencapai titik tertinggi 3.726 m dpl.",
  },
  {
    id: "danau-toska",
    src: "/gallery/rinjani-5.jpg",
    title: "Kemegahan Danau Kawah Segara Anak",
    location: "Tepian Danau Segara Anak, 2.000 m dpl",
    category: "kaldera",
    description: "Pantulan langit pada air danau vulkanik yang tenang dengan latar tebing kaldera menjulang tegak 1.000 meter.",
  },
  {
    id: "kemah-bintang",
    src: "/gallery/rinjani-11.jpg",
    title: "Perkemahan Malam di Plawangan",
    location: "Bibir Kaldera Plawangan, 2.600 m dpl",
    category: "jalur",
    description: "Tenda-tenda ekspedisi di bawah gugusan bintang galaksi Bima Sakti sebelum persiapan summit attack dini hari.",
  },
  {
    id: "savana-sembalun",
    src: "/gallery/rinjani-2.jpg",
    title: "Padang Savana Luas Sembalun",
    location: "Pos 2 Lokok Khayangan, 1.500 m dpl",
    category: "jalur",
    description: "Hamparan bukit rumput savana terbuka yang terbentang luas dari kaki gunung di Desa Sembalun Lawang.",
  },
  {
    id: "tebing-samalas",
    src: "/gallery/rinjani-9.jpg",
    title: "Dinding Runtuhan Kaldera Purba Samalas",
    location: "Plawangan Senaru, 2.641 m dpl",
    category: "kaldera",
    description: "Struktur stratigrafi batuan vulkanik sisa letusan kataklisma Samalas tahun 1257 yang mengelilingi danau.",
  },
  {
    id: "summit-ridge",
    src: "/gallery/rinjani-8.jpg",
    title: "Igir Punggung Menuju Puncak 3.726 m",
    location: "Letter E Puncak Rinjani",
    category: "puncak",
    description: "Jalur sempit pasir dan kerikil vulkanik lepas dengan jurang kaldera di sisi kiri dan lereng Lombok Timur di sisi kanan.",
  },
  {
    id: "malam-kaldera",
    src: "/gallery/rinjani-12.jpg",
    title: "Siluet Puncak dan Kerucut Barujari",
    location: "Pusat Kaldera Rinjani",
    category: "kaldera",
    description: "Gradasi warna senja dramatis memantulkan bayangan puncak Rinjani ke atas permukaan air danau.",
  },
  {
    id: "hutan-senaru",
    src: "/gallery/rinjani-3.jpg",
    title: "Kanopi Rimba Tropis Jalur Senaru",
    location: "Pos 3 Mondokan Mandiri, 2.000 m dpl",
    category: "jalur",
    description: "Tutupan pohon berlumut dan pakis raksasa yang sejuk melindungi pendaki dari terik matahari.",
  },
  {
    id: "ngarai-danau",
    src: "/gallery/rinjani-10.jpg",
    title: "Perspektif Tebing Barat Segara Anak",
    location: "Turunan Jalur Torean",
    category: "kaldera",
    description: "Pemandangan ngarai curam dengan formasi batuan andesit vulkanik di jalur perlintasan air panas Aik Kalak.",
  },
  {
    id: "tim-pendaki",
    src: "/gallery/rinjani-7.jpg",
    title: "Iringan Tim di Punggungan Puncak",
    location: "Elevasi 3.300 m dpl",
    category: "puncak",
    description: "Langkah teratur pendaki dengan penerangan headlamp menyusuri kontur pasir menjelang waktu subuh.",
  },
  {
    id: "batu-vulkanik",
    src: "/gallery/rinjani-6.jpg",
    title: "Batuan Tebing & Savana Kering",
    location: "Jalur Punggung Rinjani",
    category: "jalur",
    description: "Tekstur batuan lava andesit yang membeku ratusan tahun lalu, dihiasi vegetasi cemara gunung endemik.",
  },
];

interface GalleryProps {
  ringkas?: boolean;
}

export default function Gallery({ ringkas = false }: GalleryProps) {
  const [filter, setFilter] = useState<"semua" | "kaldera" | "puncak" | "jalur">("semua");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const displayedItems = ringkas
    ? allGalleryItems.slice(0, 6)
    : filter === "semua"
    ? allGalleryItems
    : allGalleryItems.filter((item) => item.category === filter);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev !== null && prev < displayedItems.length - 1 ? prev + 1 : 0));
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayedItems.length - 1));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, displayedItems.length]);

  const activeItem = selectedIndex !== null ? displayedItems[selectedIndex] : null;

  return (
    <section id="galeri" className="bg-bg-subtle py-20 md:py-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-2">
              Dokumentasi Lapangan Autentik
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-fg font-normal tracking-tight">
              {ringkas ? "Dokumentasi kaldera dan puncak" : "Galeri visual lengkap ekspedisi Rinjani"}
            </h2>
            <p className="mt-3 text-fg-muted text-base leading-relaxed">
              Koleksi foto autentik dari kamera pemandu kami: Danau Segara Anak, kerucut Barujari, savana Sembalun,
              dan sunrise di puncak 3.726 m dpl.
            </p>
          </div>

          {ringkas && (
            <Link
              href="/gunung-rinjani#galeri"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-danau hover:text-danau-hover transition-colors whitespace-nowrap"
            >
              <span>Lihat semua 12 foto dokumentasi</span>
              <span>→</span>
            </Link>
          )}
        </div>

        {/* Filter Kategori (Hanya muncul di halaman lengkap) */}
        {!ringkas && (
          <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-3">
            {[
              { id: "semua", label: "Semua Koleksi (12)" },
              { id: "kaldera", label: "Kaldera & Segara Anak" },
              { id: "puncak", label: "Puncak 3.726 m & Sunrise" },
              { id: "jalur", label: "Jalur & Perkemahan" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filter === tab.id
                    ? "bg-white text-fg shadow-sm border border-border"
                    : "text-fg-muted hover:text-fg hover:bg-white/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Grid Foto Responsif & Berwarna */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item, idx) => (
            <figure
              key={item.id}
              onClick={() => setSelectedIndex(idx)}
              className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-white transition-all hover:border-fg-muted hover:shadow-md flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-bg-surface relative">
                <img
                  src={item.src}
                  alt={item.title}
                  loading={idx < 3 ? "eager" : "lazy"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                <span className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/60 text-[10px] text-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Perbesar ↗
                </span>
              </div>
              <figcaption className="p-4 border-t border-border flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-danau font-semibold block">
                    {item.location}
                  </span>
                  <p className="font-semibold text-fg mt-1 text-sm">{item.title}</p>
                </div>
                <p className="text-xs text-fg-muted mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Lightbox Layar Penuh dengan Navigasi Keyboard & Tombol Panah */}
      {activeItem && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-white rounded-xl overflow-hidden border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup */}
            <button
              onClick={() => setSelectedIndex(null)}
              aria-label="Tutup foto"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              ✕
            </button>

            {/* Tombol Navigasi Kiri */}
            <button
              onClick={() =>
                setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayedItems.length - 1))
              }
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              ‹
            </button>

            {/* Tombol Navigasi Kanan */}
            <button
              onClick={() =>
                setSelectedIndex((prev) => (prev !== null && prev < displayedItems.length - 1 ? prev + 1 : 0))
              }
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              ›
            </button>

            {/* Gambar Utama */}
            <div className="bg-black/95 flex items-center justify-center max-h-[70vh]">
              <img
                src={activeItem.src}
                alt={activeItem.title}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Takarir Keterangan Foto */}
            <div className="p-6 border-t border-border bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-danau font-semibold">
                  {activeItem.location} · {selectedIndex + 1} dari {displayedItems.length}
                </span>
                <p className="font-display text-xl text-fg font-semibold mt-0.5">{activeItem.title}</p>
                <p className="text-xs sm:text-sm text-fg-muted mt-1 leading-relaxed max-w-2xl">
                  {activeItem.description}
                </p>
              </div>
              <span className="text-xs text-fg-faint hidden md:inline shrink-0">
                Gunakan tombol ← → atau Esc
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
