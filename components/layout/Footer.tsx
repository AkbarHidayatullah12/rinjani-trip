"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="bg-fg text-white/80 border-t border-white/10 text-sm">
      {/* 4 Kolom Utama */}
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Kolom 1: Identitas */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-semibold text-white tracking-tight">
                {SITE.nama}
              </span>
              <span className="text-xs text-white/50 border border-white/15 px-1.5 py-0.5 rounded">
                {SITE.elevasiPuncak}
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed max-w-xs">
              {SITE.deskripsi}
            </p>
            <p className="text-xs text-white/50">
              Lombok, Nusa Tenggara Barat, Indonesia.
            </p>
          </div>

          {/* Kolom 2: Jelajahi */}
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-white/90 mb-4">
              Jelajahi
            </p>
            <ul className="space-y-2.5 text-xs text-white/70">
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/booking" className="text-fajar-subtle hover:text-white transition-colors">
                  Pesan Pendakian →
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: 5 Jalur Resmi */}
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-white/90 mb-4">
              Jalur Pendakian
            </p>
            <ul className="space-y-2.5 text-xs text-white/70">
              {SITE.jalur.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Kontak & Bantuan */}
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-white/90 mb-4">
              Kontak & Bantuan
            </p>
            <div className="text-xs text-white/70 space-y-2">
              <p>
                <span className="text-white/40 block text-[11px]">WhatsApp Ekspedisi:</span>
                <a
                  href={`https://wa.me/${SITE.kontak.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline font-medium"
                >
                  {SITE.kontak.whatsappDisplay}
                </a>
              </p>
              <p>
                <span className="text-white/40 block text-[11px]">Email Resmi:</span>
                <a href={`mailto:${SITE.kontak.email}`} className="text-white hover:underline">
                  {SITE.kontak.email}
                </a>
              </p>
              <p>
                <span className="text-white/40 block text-[11px]">Pos Registrasi & Kumpul:</span>
                {SITE.kontak.alamat}
              </p>
              <p className="text-[11px] text-white/50 pt-1">
                Jam operasional: {SITE.kontak.jamRespons}
              </p>
            </div>
          </div>
        </div>

        {/* Blok Informasi Resmi Pengelola */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/60">
          <p>
            Rinjani Trek adalah operator jasa wisata pendakian independen dan bukan situs resmi Balai Taman Nasional Gunung Rinjani.
          </p>
          <a
            href="https://rinjaninationalpark.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/75 hover:text-white underline underline-offset-4 shrink-0"
          >
            Portal e-Rinjani TNGR ↗
          </a>
        </div>
      </div>

      {/* Bar Bawah & Legal */}
      <div className="border-t border-white/10 bg-black/20 py-6 px-6 text-xs text-white/50">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {SITE.nama}. Hak cipta dilindungi.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {SITE.legal.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
            <Link href="/admin" className="text-white/30 hover:text-white/70 transition-colors text-[11px]">
              Panel Operasional
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

