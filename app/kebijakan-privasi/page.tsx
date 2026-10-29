import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Kebijakan Privasi Perlindungan Data | Rinjani Trek",
  description:
    "Kebijakan penanganan data pribadi identitas pendaki untuk pendaftaran e-Rinjani TNGR dan koordinasi tim lapangan.",
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        eyebrow="Privasi Data"
        judul="Kebijakan Privasi Pendaki"
        deskripsi="Bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi yang Anda serahkan saat mendaftar ekspedisi Rinjani Trek."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Kebijakan Privasi" },
        ]}
      />

      <div className="mx-auto max-w-4xl px-6 py-16 text-sm text-fg-muted space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">1. Data yang Dikumpulkan</h2>
          <p>
            Untuk memproses reservasi, kami mengumpulkan: Nama lengkap (sesuai kartu identitas), nomor KTP/Paspor,
            alamat email, nomor WhatsApp aktif, kewarganegaraan, serta catatan medis atau alergi yang relevan untuk
            keamanan selama berada di ketinggian.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">2. Tujuan Penggunaan Data</h2>
          <p>Data pribadi Anda hanya digunakan untuk:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Pendaftaran resmi simaksi masuk kawasan di portal e-Rinjani Balai Taman Nasional Gunung Rinjani.</li>
            <li>Penerbitan asuransi kecelakaan pendakian resmi.</li>
            <li>Komunikasi konfirmasi teknis penjemputan bandara/hotel dan kesiapan logistik lapangan.</li>
            <li>Penyediaan menu konsumsi khusus sesuai alergi yang dilaporkan kepada tim koki porter kami.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">3. Keamanan & Kerahasiaan Data</h2>
          <p>
            Rinjani Trek tidak akan menjual, menyewakan, atau menyebarluaskan data pribadi Anda kepada pihak ketiga mana pun
            untuk tujuan pemasaran komersial di luar keperluan pendaftaran resmi ke Balai TNGR dan asuransi pendakian.
          </p>
        </section>
      </div>
    </main>
  );
}

