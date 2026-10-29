import Link from "next/link";

interface SafetyProps {
  ringkas?: boolean;
}

export default function Safety({ ringkas = false }: SafetyProps) {
  const regulations = [
    {
      title: "Pendaftaran & Kuota Resmi e-Rinjani",
      desc: "Setiap pendaki wajib terdaftar di sistem e-Rinjani Balai TNGR dan didampingi guide resmi berlisensi lokal. Kuota harian dibatasi ketat demi konservasi.",
    },
    {
      title: "Protokol Sampah (Pack In, Pack Out)",
      desc: "TNGR memberlakukan pencatatan logistik di pintu masuk. Seluruh sampah kemasan plastik, kaleng, dan botol wajib dibawa turun kembali untuk ditimbang di gerbang keluar.",
    },
    {
      title: "Aklimatisasi di Plawangan (2.600 m)",
      desc: "Bibir kaldera berada di 2.600 m dpl. Luangkan waktu istirahat minimal 8 jam sebelum memulai *summit attack* pukul 02.00 dini hari menuju puncak 3.726 m.",
    },
    {
      title: "Kriteria Fisik & Surat Sehat",
      desc: "Pendaki wajib menyertakan surat keterangan sehat resmi dari dokter/klinik yang menyatakan bebas dari riwayat penyakit jantung, asma akut, dan hipertensi.",
    },
  ];

  return (
    <section id="persiapan" className="bg-bg-subtle py-20 md:py-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-2">
              SOP Resmi & Konservasi
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-fg font-normal tracking-tight">
              Standar keselamatan dan regulasi taman nasional
            </h2>
            <p className="mt-3 text-fg-muted text-base leading-relaxed">
              Pendakian Rinjani menuntut kesiapan fisik dan kepatuhan pada aturan konservasi.
              Seluruh trip kami menyertakan tim porter dan guide bersertifikat dari desa lingkar Rinjani.
            </p>
          </div>

          {ringkas && (
            <Link
              href="/persiapan"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-danau hover:text-danau-hover transition-colors whitespace-nowrap"
            >
              <span>Perlengkapan wajib & FAQ pendakian</span>
              <span>→</span>
            </Link>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {regulations.map((item, idx) => (
            <div key={idx} className="border border-border bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-base font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
