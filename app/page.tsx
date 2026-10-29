import Link from "next/link";
import ParallaxHero from "@/components/ParallaxHero";
import MountainFacts from "@/components/MountainFacts";
import MountainAbout from "@/components/MountainAbout";
import TrailTabs from "@/components/TrailTabs";
import SeasonGuide from "@/components/SeasonGuide";
import Gallery from "@/components/Gallery";
import Packages from "@/components/Packages";
import Safety from "@/components/Safety";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── 1. Hero Parallax Foto Asli 1920x1080 ── */}
      <ParallaxHero />

      {/* ── 2. Strip Data Spesifikasi Teknis Cepat ── */}
      <MountainFacts />

      {/* ── 3. Cuplikan Narasi Kaldera & Danau Segara Anak ── */}
      <MountainAbout ringkas={true} />

      {/* ── 4. Ringkasan Karakter 3 Jalur Utama (+ Tautan ke 5 Rute) ── */}
      <TrailTabs ringkas={true} />

      {/* ── 5. Status Kalender Musim & Cuaca (+ Tautan ke Profil Suhu) ── */}
      <SeasonGuide ringkas={true} />

      {/* ── 6. Galeri Dokumentasi Foto Pilihan ── */}
      <Gallery ringkas={true} />

      {/* ── 7. Paket Pendakian Terkelola Resmi (CTA ke /booking?paket=...) ── */}
      <Packages />

      {/* ── 8. Standar Keselamatan & SOP Resmi TNGR ── */}
      <Safety ringkas={true} />

      {/* ── 9. CTA Band Sebelum Footer (Sesuai Rencana) ── */}
      <section className="bg-bg-subtle py-20 px-6 border-t border-border">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <p className="text-xs font-semibold tracking-wider uppercase text-danau">
            Mulai Petualangan Anda
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-fg font-normal tracking-tight">
            Amankan kuota tiket e-Rinjani untuk musim pendakian ini
          </h2>
          <p className="text-fg-muted text-base max-w-xl mx-auto leading-relaxed">
            Kuota harian Taman Nasional dibatasi demi kelestarian alam kaldera.
            Pesan paket terkelola kami untuk pendakian yang aman, terencana, dan berizin resmi.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/booking"
              className="text-sm font-medium px-8 py-3.5 rounded-md bg-fajar text-white hover:bg-fajar-hover transition-colors shadow-sm"
            >
              Pesan Pendakian Sekarang →
            </Link>
            <Link
              href="/gunung-rinjani"
              className="text-sm font-medium px-8 py-3.5 rounded-md border border-border text-fg hover:bg-white transition-colors"
            >
              Pelajari Profil Gunung
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
