import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Kebijakan Pembatalan & Pengembalian Dana | Rinjani Trek",
  description:
    "Aturan pembatalan reservasi trip pendakian Gunung Rinjani, perubahan tanggal (reschedule), dan ketentuan pengembalian dana deposit.",
};

export default function KebijakanPembatalanPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        eyebrow="Ketentuan Pembatalan"
        judul="Kebijakan Pembatalan & Reschedule"
        deskripsi="Panduan transparan mengenai prosedur pembatalan pemesanan, pengembalian deposit, serta perubahan tanggal ekspedisi."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Kebijakan Pembatalan" },
        ]}
      />

      <div className="mx-auto max-w-4xl px-6 py-16 text-sm text-fg-muted space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">1. Pembatalan oleh Peserta</h2>
          <ul className="list-disc list-inside space-y-2 text-fg-muted">
            <li>
              <strong>Lebih dari 14 hari sebelum keberangkatan:</strong> Uang muka (DP) dapat dikembalikan sebesar 70%
              (potongan 30% untuk biaya administrasi dan pembatalan simaksi e-Rinjani yang tidak dapat di-refund oleh sistem TNGR).
            </li>
            <li>
              <strong>7 hingga 14 hari sebelum keberangkatan:</strong> Pengembalian dana sebesar 40% dari total DP yang telah dibayarkan.
            </li>
            <li>
              <strong>Kurang dari 7 hari sebelum keberangkatan:</strong> Uang muka tidak dapat dikembalikan (*non-refundable*) karena alokasi logistik, bahan makanan, dan honor porter telah dipersiapkan.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">2. Perubahan Tanggal (Reschedule)</h2>
          <p>
            Permintaan perubahan tanggal keberangkatan dapat diajukan maksimal 10 hari sebelum tanggal pendakian awal,
            dengan syarat kuota tiket harian e-Rinjani pada tanggal baru masih tersedia. Reschedule dikenakan biaya
            penerbitan ulang tiket simaksi TNGR sesuai tarif resmi yang berlaku.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">3. Penutupan Jalur Darurat oleh TNGR / Bencana Alam</h2>
          <p>
            Jika pendakian dibatalkan secara sepihak oleh Balai TNGR akibat peningkatan status aktivitas vulkanik
            Gunung Barujari atau cuaca ekstrem badai, peserta berhak memilih:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Menggeser jadwal ekspedisi (*open date*) berlaku hingga 12 bulan ke depan tanpa biaya tambahan, ATAU</li>
            <li>Pengembalian dana 85% dari total biaya yang telah dibayarkan.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

