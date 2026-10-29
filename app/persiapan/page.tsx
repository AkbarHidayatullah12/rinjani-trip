import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Safety from "@/components/Safety";

export const metadata: Metadata = {
  title: "Persiapan Mendaki Rinjani: Regulasi TNGR, Perlengkapan, & FAQ",
  description:
    "Daftar checklist perlengkapan wajib mendaki Gunung Rinjani, panduan latihan kebugaran fisik, protokol sampah TNGR, dan jawaban FAQ operasional di lapangan.",
  openGraph: {
    title: "Persiapan Mendaki Rinjani | Rinjani Trek",
    description: "Checklist perlengkapan, latihan fisik, dan regulasi resmi TNGR.",
  },
};

const gearList = [
  {
    category: "Wajib Dibawa oleh Setiap Pendaki",
    items: [
      "Sepatu trekking bertapak grip kokoh (wajib menopang mata kaki/engkel)",
      "Pakaian ganti secukupnya (bahan sintetis cepat kering, hindari katun tebal)",
      "Jaket windproof & waterproof tebal serta celana trekking elastis",
      "Headlamp (senter kepala) dengan baterai cadangan untuk summit attack",
      "Sarung tangan gunung hangat dan penahan angin",
      "Kupluk/beanie hangat dan buff pelindung debu pasir",
      "Trekking pole (sangat krusial untuk jalur pasir puncak dan turunan terjal)",
      "Surat keterangan sehat resmi dari dokter/klinik",
      "Obat-obatan pribadi (analgesik, antasida, plester lecet, obat alergi)",
    ],
  },
  {
    category: "Disediakan Penuh oleh Tim Rinjani Trek",
    items: [
      "Tenda gunung dobel kanopi tahan angin badai dan air",
      "Matras tidur busa tebal dan kantung tidur (sleeping bag) hangat bersuhu nyaman",
      "Tenda toilet khusus perkemahan dengan kursi lipat higienis",
      "Semua peralatan masak lapangan dan bahan makanan nutrisi seimbang",
      "Air minum bersih kemasan dan air masak mineral selama durasi ekspedisi",
      "Kotak P3K standar evakuasi gunung",
      "Tim porter berpengalaman untuk membawa tenda, logistik, dan alat masak",
      "Pemandu (mountain guide) berlisensi resmi Balai TNGR",
    ],
  },
  {
    category: "Sangat Disarankan / Opsional",
    items: [
      "Gaiter (sarung pelindung sepatu dari masuknya pasir vulkanik di puncak)",
      "Powerbank kapasitas 10.000–20.000 mAh (tidak ada listrik di gunung)",
      "Kacamata hitam UV protection (refleksi cahaya savana & kawah)",
      "Tabir surya (sunblock) SPF 50 dan pelembap bibir",
      "Baju renang/celana pendek untuk berendam di pemandian air panas Aik Kalak",
      "Sandal gunung ringan untuk dipakai santai di area tenda kemah",
    ],
  },
];

const faqs = [
  {
    q: "Apakah ada sinyal seluler di sepanjang jalur pendakian?",
    a: "Sinyal operator Telkomsel umumnya masih terjangkau di Pos 1 dan Pos 2 Sembalun serta bibir tebing Plawangan Sembalun. Namun di dasar kaldera Danau Segara Anak dan sepanjang jalur Torean, sinyal seluler hilang total.",
  },
  {
    q: "Bagaimana ketersediaan air bersih untuk minum dan memasak?",
    a: "Kebutuhan air minum dan masak selama ekspedisi dijamin sepenuhnya oleh tim Rinjani Trek. Porter kami mengambil air dari mata air alami terverifikasi yang kemudian dimasak hingga mendidih sempurna untuk konsumsi.",
  },
  {
    q: "Bagaimana fasilitas sanitasi dan buang air selama di gunung?",
    a: "Tim kami mendirikan tenda toilet khusus portabel di setiap lokasi kemah (Plawangan dan tepi Danau). Kami menerapkan prinsip penggalian lubang sanitasi sesuai pedoman ramah lingkungan Leave No Trace.",
  },
  {
    q: "Berapa beban barang bawaan yang dibawa oleh pendaki?",
    a: "Pendaki hanya perlu membawa daypack pribadi berisi pakaian ganti harian, jaket hangat, headlamp, air minum darurat, dan barang berharga (berat rata-rata 4–7 kg). Tenda, matras, sleeping bag, makanan, dan peralatan masak seluruhnya dibawa oleh porter kami.",
  },
  {
    q: "Apakah pemula yang belum pernah mendaki gunung bisa ikut?",
    a: "Bisa, asalkan memiliki kebugaran fisik yang baik dan melakukan latihan kardio rutin minimal 3–4 minggu sebelum jadwal. Paket 3D2N atau 4D3N sangat direkomendasikan bagi pemula karena ritme jalannya lebih bertahap dibanding paket kilat 2D1N.",
  },
];

export default function PersiapanPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        eyebrow="SOP & Kesiapan Ekspedisi"
        judul="Persiapan Pendakian, Perlengkapan, & FAQ"
        deskripsi="Tingkat keselamatan dan kenyamanan pendakian Rinjani 3.726 m dpl ditentukan oleh persiapan fisik matang, kelengkapan perlengkapan individu, serta kepatuhan pada regulasi konservasi taman nasional."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Persiapan" },
        ]}
      />

      {/* Regulasi Resmi TNGR */}
      <Safety ringkas={false} />

      {/* Checklist Perlengkapan */}
      <section className="bg-white py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-1">
              Checklist Logistik
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-fg font-normal">
              Daftar perlengkapan ekspedisi
            </h2>
            <p className="mt-2 text-sm text-fg-muted leading-relaxed">
              Ketahui pembagian barang bawaan pribadi Anda dan fasilitas yang telah kami sediakan di dalam paket pendakian.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {gearList.map((col, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-bg-subtle p-6 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-danau block mb-3 pb-2 border-b border-border">
                  {col.category}
                </span>
                <ul className="space-y-3 text-xs text-fg leading-relaxed">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-danau mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Persiapan Fisik */}
      <section className="bg-bg-subtle py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-1">
              Ketahanan Fisik
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-fg font-normal">
              Panduan latihan kebugaran (4 minggu sebelum trip)
            </h2>
            <p className="mt-2 text-sm text-fg-muted leading-relaxed">
              Pendakian Rinjani melibatkan berjalan 6 hingga 9 jam sehari dengan beban ransel di atas lereng berbatu dan berpasir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <span className="text-xs font-semibold text-fg-faint uppercase tracking-wider block mb-2">Latihan Kardio</span>
              <h3 className="font-semibold text-fg text-base">Jogging & Renang 3x Seminggu</h3>
              <p className="mt-2 text-xs text-fg-muted leading-relaxed">
                Tingkatkan volume paru-paru dan daya tahan kardiovaskular dengan lari santai 30–45 menit atau berenang teratur untuk memudahkan aklimatisasi oksigen tipis di atas 2.500 m dpl.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <span className="text-xs font-semibold text-fg-faint uppercase tracking-wider block mb-2">Kekuatan Kaki</span>
              <h3 className="font-semibold text-fg text-base">Naik-Turun Tangga / Squat</h3>
              <p className="mt-2 text-xs text-fg-muted leading-relaxed">
                Latih otot paha (quadriceps), betis, dan engkel dengan latihan naik-turun tangga gedung atau tanjakan bukit. Ini sangat krusial saat menuruni tebing curam Senaru/Torean.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <span className="text-xs font-semibold text-fg-faint uppercase tracking-wider block mb-2">Beban Ransel</span>
              <h3 className="font-semibold text-fg text-base">Simulasi Daypack 5 Kilogram</h3>
              <p className="mt-2 text-xs text-fg-muted leading-relaxed">
                Biasakan berjalan kaki 5–8 km dengan ransel berisi beban 4–5 kg dan sepatu trekking yang akan Anda pakai di Rinjani agar sepatu lentur dan tidak membuat kaki melepuh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pertanyaan yang Sering Diajukan (FAQ) */}
      <section className="bg-white py-20 border-b border-border">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-1">
              Informasi Lapangan
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-fg font-normal">
              Pertanyaan yang sering diajukan (FAQ)
            </h2>
          </div>

          <div className="space-y-5">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-border rounded-lg p-6 bg-bg-subtle/50">
                <h3 className="text-sm sm:text-base font-semibold text-fg">{faq.q}</h3>
                <p className="mt-2 text-xs sm:text-sm text-fg-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-subtle py-16 px-6">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h2 className="font-display text-3xl text-fg font-normal">
            Kesiapan Anda adalah prioritas kami
          </h2>
          <p className="text-fg-muted text-base max-w-lg mx-auto">
            Daftarkan diri Anda untuk mengamankan kuota e-Rinjani pada musim pendakian ini.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/booking"
              className="text-sm font-medium px-6 py-3 rounded-md bg-fajar text-white hover:bg-fajar-hover transition-colors shadow-sm"
            >
              Mulai Pendaftaran Pendakian →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

