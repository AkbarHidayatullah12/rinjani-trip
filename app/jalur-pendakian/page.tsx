import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import TrailTabs from "@/components/TrailTabs";
import { allTrails } from "@/lib/trails";

export const metadata: Metadata = {
  title: "5 Jalur Pendakian Rinjani: Sembalun, Senaru, Torean, Timbanuh, Aik Berik",
  description:
    "Komparasi lengkap 5 jalur resmi Gunung Rinjani: elevasi awal, tutupan medan, ketersediaan air minum, tingkat kesulitan teknis, dan profil jalur menuju kaldera Segara Anak.",
  openGraph: {
    title: "5 Jalur Pendakian Resmi Gunung Rinjani | Rinjani Trek",
    description: "Sembalun, Senaru, Torean, Timbanuh, dan Aik Berik.",
  },
};

export default function JalurPendakianPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        eyebrow="Navigasi Rute Resmi"
        judul="5 Jalur Pendakian Resmi Gunung Rinjani"
        deskripsi="Taman Nasional Gunung Rinjani memiliki 5 pintu masuk resmi yang melintasi karakter bentang alam berbeda: dari savana luas di sisi timur, hutan hujan lebat di utara, hingga lembah ngarai sungai di barat."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Jalur Pendakian" },
        ]}
      />

      {/* Skema Peta Rute & Profil Elevasi (SVG Editorial Monokrom) */}
      <section className="bg-white py-16 border-b border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-1">
              Topografi & Elevasi
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-fg font-normal">
              Skema topografi dan titik kumpul kaldera
            </h2>
            <p className="mt-2 text-sm text-fg-muted leading-relaxed">
              Semua rute pendakian bermuara pada cekungan kaldera Segara Anak (2.000 m dpl) atau bibir kawah Plawangan sebelum summit attack.
            </p>
          </div>

          {/* Diagram Skematik SVG Elegan */}
          <div className="rounded-lg border border-border bg-bg-subtle p-6 sm:p-10 shadow-sm overflow-x-auto">
            <div className="min-w-[640px]">
              <svg viewBox="0 0 800 320" className="w-full h-auto text-fg">
                {/* Garis Dasar Kontur Gunung */}
                <path
                  d="M 50 280 L 220 180 L 320 220 L 480 50 L 560 210 L 680 190 L 750 280"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Danau Segara Anak */}
                <rect x="280" y="210" width="220" height="25" rx="6" fill="#1c5a60" opacity="0.15" />
                <text x="390" y="227" textAnchor="middle" fill="#1c5a60" fontSize="11" fontWeight="600">
                  Danau Segara Anak (2.000 m)
                </text>

                {/* Kerucut Puncak Rinjani */}
                <circle cx="480" cy="50" r="5" fill="#bd481c" />
                <text x="480" y="32" textAnchor="middle" fill="#191f26" fontSize="13" fontWeight="700">
                  Puncak 3.726 m dpl
                </text>

                {/* Plawangan Sembalun */}
                <circle cx="320" cy="180" r="4" fill="#1c5a60" />
                <text x="320" y="168" textAnchor="middle" fill="#191f26" fontSize="10" fontWeight="600">
                  Plawangan Sembalun (2.639 m)
                </text>

                {/* Plawangan Senaru */}
                <circle cx="560" cy="175" r="4" fill="#1c5a60" />
                <text x="560" y="163" textAnchor="middle" fill="#191f26" fontSize="10" fontWeight="600">
                  Plawangan Senaru (2.641 m)
                </text>

                {/* 5 Titik Gerbang Awal */}
                {/* 1. Sembalun */}
                <circle cx="90" cy="280" r="4" fill="#53606f" />
                <text x="90" y="302" textAnchor="middle" fill="#53606f" fontSize="11" fontWeight="600">
                  Sembalun (1.150 m)
                </text>

                {/* 2. Torean */}
                <circle cx="230" cy="280" r="4" fill="#53606f" />
                <text x="230" y="302" textAnchor="middle" fill="#53606f" fontSize="11" fontWeight="600">
                  Torean (585 m)
                </text>

                {/* 3. Senaru */}
                <circle cx="680" cy="280" r="4" fill="#53606f" />
                <text x="680" y="302" textAnchor="middle" fill="#53606f" fontSize="11" fontWeight="600">
                  Senaru (601 m)
                </text>

                {/* Garis lintasan jalur rute */}
                {/* Sembalun ke Plawangan Sembalun ke Puncak */}
                <path d="M 90 280 Q 200 240 320 180 T 480 50" fill="none" stroke="#bd481c" strokeWidth="2.5" />
                {/* Senaru ke Plawangan Senaru ke Danau */}
                <path d="M 680 280 Q 620 220 560 175 L 470 215" fill="none" stroke="#1c5a60" strokeWidth="2" strokeDasharray="3 3" />
                {/* Torean ke Danau */}
                <path d="M 230 280 Q 250 250 310 220" fill="none" stroke="#365337" strokeWidth="2" strokeDasharray="2 2" />
              </svg>

              <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-center gap-6 text-xs text-fg-muted">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-fajar inline-block" />
                  <span>Jalur Sembalun (Rute Puncak)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-danau border-t border-dashed border-danau inline-block" />
                  <span>Jalur Senaru (Rute Danau Hutan)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-rumput border-t border-dotted border-rumput inline-block" />
                  <span>Jalur Torean (Rute Lembah Ngarai)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Interaktif 5 Jalur Lengkap */}
      <TrailTabs ringkas={false} />

      {/* Visual Karakteristik 3 Lanskap Jalur Utama */}
      <section className="bg-bg-subtle py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-1">
              Visual Lapangan
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-fg font-normal">
              Perbedaan visual bentang alam antar jalur
            </h2>
            <p className="mt-2 text-sm text-fg-muted leading-relaxed">
              Dari padang rumput terbuka tanpa naungan, hutan hujan kanopi tinggi, hingga tebing ngarai sungai belerang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <figure className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src="/gallery/rinjani-2.jpg"
                  alt="Savana terbuka Sembalun"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <figcaption className="p-4 border-t border-border">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-danau block mb-0.5">
                  Sisi Timur: Jalur Sembalun
                </span>
                <p className="font-semibold text-fg text-sm">Savana Terbuka & Bukit Penyesalan</p>
                <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                  Jalur langsung menuju Plawangan dan puncak dengan bentang langit terbuka tanpa pepohonan lebat.
                </p>
              </figcaption>
            </figure>

            <figure className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src="/gallery/rinjani-10.jpg"
                  alt="Ngarai dan tebing Torean"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <figcaption className="p-4 border-t border-border">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-danau block mb-0.5">
                  Sisi Barat: Jalur Torean
                </span>
                <p className="font-semibold text-fg text-sm">Ngarai Curam & Air Terjun</p>
                <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                  Menyusuri tebing vertikal sungai belerang dan Air Terjun Penimbungan langsung ke Segara Anak.
                </p>
              </figcaption>
            </figure>

            <figure className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src="/gallery/rinjani-3.jpg"
                  alt="Hutan tropis Senaru"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <figcaption className="p-4 border-t border-border">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-danau block mb-0.5">
                  Sisi Utara: Jalur Senaru
                </span>
                <p className="font-semibold text-fg text-sm">Rimba Kanopi Tropis Lebat</p>
                <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                  Lintasan teduh di bawah naungan pohon raksasa berlumut dengan jalur tanah padat dan akar pohon.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Tabel Komparasi Teknis */}
      <section className="bg-white py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-1">
              Matriks Ringkasan
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-fg font-normal">
              Perbandingan spesifikasi teknis antar jalur
            </h2>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm text-fg-muted">
              <thead className="bg-bg-subtle text-fg border-b border-border font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Nama Jalur</th>
                  <th className="py-3.5 px-4">Elevasi Gerbang</th>
                  <th className="py-3.5 px-4">Titik Tertinggi</th>
                  <th className="py-3.5 px-4">Durasi Standar</th>
                  <th className="py-3.5 px-4">Karakter Utama</th>
                  <th className="py-3.5 px-4">Tingkat Kesulitan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {allTrails.map((t) => (
                  <tr key={t.id} className="hover:bg-bg-subtle/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-fg">{t.name.split(" (")[0]}</td>
                    <td className="py-3.5 px-4">{t.startElevation.split(" (")[0]}</td>
                    <td className="py-3.5 px-4 font-medium text-fg">{t.maxElevation.split(" (")[0]}</td>
                    <td className="py-3.5 px-4">{t.duration}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate">{t.terrain}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-bg-subtle border border-border text-fg">
                        {t.id === "timbanuh" ? "Sangat Menantang" : t.id === "torean" ? "Teknis / Curam" : "Sedang"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA ke Form Booking */}
      <section className="bg-bg-subtle py-16 px-6">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h2 className="font-display text-3xl text-fg font-normal">
            Sudah menentukan jalur pilihan Anda?
          </h2>
          <p className="text-fg-muted text-base max-w-lg mx-auto">
            Rute Sembalun dan Senaru dapat dikombinasikan dalam paket ekspedisi lintas jalur (Crossing Trek).
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/booking"
              className="text-sm font-medium px-6 py-3 rounded-md bg-fajar text-white hover:bg-fajar-hover transition-colors shadow-sm"
            >
              Pilih Paket & Tanggal Keberangkatan →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
