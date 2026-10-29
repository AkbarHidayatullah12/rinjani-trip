import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import MountainFacts from "@/components/MountainFacts";
import MountainAbout from "@/components/MountainAbout";
import NatureCulture from "@/components/NatureCulture";
import Gallery from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Profil Gunung Rinjani: Kaldera, Segara Anak, & Barujari",
  description:
    "Pelajari geologi Gunung Rinjani 3.726 m dpl, sejarah letusan kataklisma Samalas 1257, Danau Segara Anak, kerucut Barujari, serta tradisi adat Mulang Pekelem.",
  openGraph: {
    title: "Profil Gunung Rinjani | Rinjani Trek",
    description:
      "Kaldera Segara Anak, kerucut Barujari, dan titik tertinggi Pulau Lombok 3.726 m dpl.",
  },
};

export default function GunungRinjaniPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        eyebrow="Profil Geologi & Konservasi"
        judul="Gunung Rinjani (3.726 m dpl)"
        deskripsi="Gunung berapi aktif tertinggi kedua di Indonesia dengan kaldera megah seluas 50 km², Danau kawah Segara Anak, dan kerucut vulkanik Barujari di Pulau Lombok."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Gunung Rinjani" },
        ]}
      />

      {/* 1. Strip Spesifikasi Teknis */}
      <MountainFacts />

      {/* 2. Geologi & Morfologi (Versi Penuh) */}
      <MountainAbout ringkas={false} />

      {/* 3. Sejarah Geopark UNESCO & Letusan Samalas 1257 */}
      <section className="bg-bg-subtle py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-2">
                Sejarah Vulkanologi Dunia
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-fg font-normal tracking-tight">
                Letusan Samalas 1257 dan status UNESCO Global Geopark
              </h2>
              <div className="mt-6 space-y-4 text-fg-muted text-base leading-relaxed">
                <p>
                  Sebelum kaldera terbentuk, di lokasi ini berdiri Gunung Samalas dengan ketinggian diperkirakan mencapai
                  4.200 meter di atas permukaan laut. Pada tahun 1257 Masehi, Samalas meletus dengan kekuatan VEI-7,
                  melepaskan kolom abu setinggi 43 kilometer ke atmosfer dan memicu anomali iklim global yang tercatat
                  dalam inti es kutub dan naskah kuno Babad Lombok.
                </p>
                <p>
                  Runtuhnya tubuh kerucut Samalas melahirkan cekungan kaldera raksasa yang kemudian terisi air hujan
                  selama ratusan tahun membentuk Danau Segara Anak. Pada tahun 2018, kawasan Rinjani-Lombok resmi
                  ditetapkan sebagai UNESCO Global Geopark atas keunikan geologi, keanekaragaman hayati, dan kekayaan
                  budaya masyarakat lingkar gunung.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border">
                <div>
                  <p className="text-xs uppercase font-medium text-fg-faint tracking-wider">Tahun Pembentukan</p>
                  <p className="font-display text-2xl font-semibold text-fg mt-1">1257 M</p>
                  <p className="text-xs text-fg-muted mt-0.5">Letusan Purba Samalas</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-medium text-fg-faint tracking-wider">Kedalaman Danau</p>
                  <p className="font-display text-2xl font-semibold text-fg mt-1">230 Meter</p>
                  <p className="text-xs text-fg-muted mt-0.5">Ketinggian 2.000 m dpl</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-medium text-fg-faint tracking-wider">Status Geologi</p>
                  <p className="font-display text-2xl font-semibold text-fg mt-1">UNESCO</p>
                  <p className="text-xs text-fg-muted mt-0.5">Global Geopark</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <figure className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
                <img
                  src="/gallery/rinjani-9.jpg"
                  alt="Dinding kaldera purba Samalas dan Danau Segara Anak"
                  className="w-full aspect-[4/3] object-cover"
                />
                <figcaption className="p-4 text-xs text-fg-muted border-t border-border bg-white">
                  <span className="font-medium text-fg block mb-0.5">Dinding Runtuhan Kaldera Samalas</span>
                  Struktur batuan piroklastik raksasa yang membentengi Danau Segara Anak dari sisi Plawangan Senaru.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Keanekaragaman Hayati & Kearifan Sasak */}
      <NatureCulture />

      {/* 5. Galeri Dokumentasi Lapangan */}
      <Gallery ringkas={false} />

      {/* 6. CTA Lanjutan ke Jalur & Booking */}
      <section className="bg-white py-16 px-6 border-t border-border">
        <div className="mx-auto max-w-4xl text-center space-y-5">
          <h2 className="font-display text-3xl text-fg font-normal">
            Siap menjelajahi kaldera Segara Anak?
          </h2>
          <p className="text-fg-muted text-base max-w-xl mx-auto">
            Pelajari karakteristik 5 pintu masuk resmi atau langsung pilih tanggal keberangkatan ekspedisi Anda.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/jalur-pendakian"
              className="text-sm font-medium px-6 py-3 rounded-md border border-border text-fg hover:bg-bg-subtle transition-colors"
            >
              Bandingkan 5 Jalur Pendakian →
            </Link>
            <Link
              href="/booking"
              className="text-sm font-medium px-6 py-3 rounded-md bg-fajar text-white hover:bg-fajar-hover transition-colors shadow-sm"
            >
              Pesan Pendakian Sekarang →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

