import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import SeasonGuide from "@/components/SeasonGuide";

export const metadata: Metadata = {
  title: "Jadwal Buka Pendakian Rinjani & Suhu di Puncak 3.726 m dpl",
  description:
    "Informasi resmi jadwal penutupan dan pembukaan jalur pendakian Taman Nasional Gunung Rinjani, profil suhu windchill puncak, serta panduan layering pakaian tahan dingin.",
  openGraph: {
    title: "Musim Pendakian & Suhu Rinjani | Rinjani Trek",
    description: "Jadwal resmi TNGR dan sistem perlindungan cuaca ekstrem kaldera.",
  },
};

export default function MusimDanIklimPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        eyebrow="Klimatologi & Regulasi Kalender"
        judul="Jadwal Musim Pendakian & Profil Suhu"
        deskripsi="Kawasan kaldera Rinjani memiliki mikroklimat khas dengan penurunan suhu drastis di malam hari dan angin kencang di punggungan puncak. Pahami siklus muson untuk memilih bulan ekspedisi terbaik."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Musim & Iklim" },
        ]}
      />

      {/* Komponen Kalender & Suhu Lengkap */}
      <SeasonGuide ringkas={false} />

      {/* Rincian Tambahan: Risiko Cuaca & Pencegahan Hipotermia */}
      <section className="bg-bg-subtle py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-1">
              Protokol Medis Cuaca
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-fg font-normal">
              Antisipasi kondisi ekstrem: Hipotermia dan Dehidrasi Savana
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-border bg-white rounded-lg p-6 sm:p-7 shadow-sm">
              <h3 className="text-base font-semibold text-fg">1. Bahaya Hipotermia di Plawangan & Puncak</h3>
              <p className="mt-2.5 text-sm text-fg-muted leading-relaxed">
                Suhu 2°C yang dipadukan dengan hembusan angin 30–45 km/jam di punggungan puncak dapat menghasilkan
                efek windchill setara -5°C. Selalu ganti pakaian basah keringat segera setelah tiba di tenda kemah
                Plawangan. Jangan pernah memulai summit attack hanya dengan jaket tipis tanpa sarung tangan penahan angin
                dan kupluk hangat.
              </p>
            </div>

            <div className="border border-border bg-white rounded-lg p-6 sm:p-7 shadow-sm">
              <h3 className="text-base font-semibold text-fg">2. Paparan Sinar UV & Dehidrasi di Savana</h3>
              <p className="mt-2.5 text-sm text-fg-muted leading-relaxed">
                Di jalur Sembalun, pendaki melintasi padang savana terbuka tanpa naungan selama 4–5 jam. Refleksi sinar
                matahari di ketinggian 1.500 m dpl meningkatkan risiko dehidrasi cepat dan terbakar matahari (sunburn).
                Gunakan tabir surya minimal SPF 50, topi rimba lebar, dan minum cairan elektrolit secara berkala.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h2 className="font-display text-3xl text-fg font-normal">
            Rencanakan pendakian di bulan terbaik
          </h2>
          <p className="text-fg-muted text-base max-w-lg mx-auto">
            Bulan Juli hingga September memiliki permintaan kuota tertinggi. Disarankan memesan tiket slot e-Rinjani 1–2 bulan sebelumnya.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/booking"
              className="text-sm font-medium px-6 py-3 rounded-md bg-fajar text-white hover:bg-fajar-hover transition-colors shadow-sm"
            >
              Cek Ketersediaan Tanggal & Booking →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

