import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Layanan Pendakian | Rinjani Trek",
  description:
    "Ketentuan umum pemesanan trip pendakian Gunung Rinjani, hak & kewajiban pendaki, asuransi keselamatan, dan ketentuan batas usia.",
};

export default function SyaratKetentuanPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        eyebrow="Ketentuan Layanan"
        judul="Syarat & Ketentuan Pemesanan"
        deskripsi="Ketentuan umum ini mengatur hak dan kewajiban peserta pendakian yang menggunakan jasa pemandu dan logistik Rinjani Trek."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Syarat & Ketentuan" },
        ]}
      />

      <div className="mx-auto max-w-4xl px-6 py-16 text-sm text-fg-muted space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">1. Ketentuan Umum & Tiket e-Rinjani</h2>
          <p>
            Seluruh pendakian wajib mematuhi Peraturan Balai Taman Nasional Gunung Rinjani (TNGR). Tiket masuk dan
            simaksi pendakian didaftarkan secara resmi menggunakan identitas asli (KTP bagi WNI atau Paspor bagi WNA).
            Pendaftaran tiket tunduk pada kuota kuota harian yang ditetapkan pemerintah.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">2. Kesehatan & Persyaratan Medis</h2>
          <p>
            Peserta wajib dalam kondisi jasmani dan rohani yang sehat. Pendaki dengan riwayat penyakit jantung,
            hipertensi berat, asma akut, epilepsi, atau wanita hamil tidak diperkenankan mengikuti pendakian puncak.
            Surat keterangan sehat dari klinik atau dokter wajib diserahkan sebelum memasuki gerbang registrasi.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">3. Tanggung Jawab & Force Majeure</h2>
          <p>
            Rinjani Trek bertanggung jawab menyediakan pemandu berlisensi, porter logistik, tenda, makanan, dan
            peralatan standar keselamatan yang tercantum dalam paket. Kami tidak bertanggung jawab atas keterlambatan,
            pembatalan jalur, atau penghentian ekspedisi yang diakibatkan oleh bencana alam, aktivitas vulkanik erupsi
            Gunung Barujari, cuaca ekstrem, atau penutupan darurat oleh Balai TNGR (*Force Majeure*).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">4. Aturan Perilaku & Konservasi Alam</h2>
          <p>
            Peserta dilarang keras membuang sampah sembarangan, merusak flora fauna, menyalakan api unggun sembarangan,
            serta membawa zat terlarang atau minuman keras berkadar tinggi. Seluruh sampah kemasan plastik yang dibawa naik
            wajib dibawa turun kembali untuk pemeriksaan tim penimbang sampah TNGR.
          </p>
        </section>
      </div>
    </main>
  );
}

