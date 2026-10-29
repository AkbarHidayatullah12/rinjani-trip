"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface GalleryItem {
  src: string;
  title: string;
  location: string;
  description: string;
}

export const galleryItems: GalleryItem[] = [
  {
    src: "/gallery/segara-anak.jpg",
    title: "Kaldera Segara Anak dan Barujari",
    location: "Plawangan Sembalun, 2.639 m dpl",
    description: "Kerucut Gunung Barujari di tengah danau kawah vulkanik berwarna toska dengan tebing kaldera menjulang di belakangnya.",
  },
  {
    src: "/gallery/gunung-rinjani.jpg",
    title: "Puncak Gunung Rinjani",
    location: "Punggungan Puncak, 3.726 m dpl",
    description: "Titik tertinggi Pulau Lombok dilihat dari jalur pasir mendekati bibir kawah utama saat pagi hari.",
  },
];

interface GalleryProps {
  ringkas?: boolean;
}

export default function Gallery({ ringkas = false }: GalleryProps) {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveItem(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <section id="galeri" className="bg-bg-subtle py-20 md:py-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-2">
              Dokumentasi Lapangan
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-fg font-normal tracking-tight">
              Lanskap kaldera dan jalur pendakian
            </h2>
            <p className="mt-3 text-fg-muted text-base leading-relaxed">
              Foto dokumentasi autentik kawasan Taman Nasional Gunung Rinjani dari kamera tim pemandu kami.
            </p>
          </div>

          {ringkas && (
            <Link
              href="/gunung-rinjani#galeri"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-danau hover:text-danau-hover transition-colors whitespace-nowrap"
            >
              <span>Galeri & profil visual lengkap</span>
              <span>→</span>
            </Link>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {galleryItems.map((item, idx) => (
            <figure
              key={idx}
              onClick={() => setActiveItem(item)}
              className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-white transition-all hover:border-fg-muted shadow-sm"
            >
              <div className="aspect-[16/10] overflow-hidden bg-bg-surface">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
              </div>
              <figcaption className="p-5 border-t border-border">
                <span className="text-xs uppercase tracking-wider text-fg-faint font-medium">
                  {item.location}
                </span>
                <p className="font-semibold text-fg mt-1 text-base">{item.title}</p>
                <p className="text-xs text-fg-muted mt-1 leading-relaxed">{item.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Lightbox Minimalis */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              aria-label="Tutup foto"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              ✕
            </button>
            <img src={activeItem.src} alt={activeItem.title} className="w-full max-h-[75vh] object-contain bg-black" />
            <div className="p-6 border-t border-border bg-white">
              <span className="text-xs uppercase tracking-wider text-fg-faint font-medium">
                {activeItem.location}
              </span>
              <p className="font-display text-xl text-fg font-semibold mt-1">{activeItem.title}</p>
              <p className="text-sm text-fg-muted mt-1">{activeItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
