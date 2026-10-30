"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatIdr } from "@/lib/data";
import { SITE } from "@/lib/site";

interface BookingData {
  bookingId: string;
  packageName?: string;
  packageDuration?: string;
  packageRoute?: string;
  date?: string;
  participants?: string;
  nationality?: string;
  name?: string;
  email?: string;
  whatsapp?: string;
  totalIdr?: number;
  createdAt?: string;
}

export default function BookingConfirmClient({ kode }: { kode: string }) {
  const [data, setData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(`booking_${kode}`);
      if (saved) {
        try {
          setData(JSON.parse(saved));
          return;
        } catch {
          // ignore
        }
      }
    }

    // Ambil langsung dari PostgreSQL Neon jika sessionStorage kosong
    setLoading(true);
    fetch(`/api/booking/${kode}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData && !resData.error) {
          setData(resData);
        }
      })
      .catch((err) => console.error("Gagal memuat reservasi dari server:", err))
      .finally(() => setLoading(false));
  }, [kode]);

  const waMessage = encodeURIComponent(
    `Halo Rinjani Trek, saya telah mengajukan reservasi pendakian dengan Kode Booking: ${kode}. Mohon konfirmasi ketersediaan kuota e-Rinjani tanggal ${data?.date || ""}.`
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      {/* Header Status */}
      <div className="rounded-xl border border-border bg-white p-8 sm:p-10 shadow-sm text-center">
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-danau/10 text-danau border border-danau/20 mb-3">
          Permintaan Reservasi Tercatat
        </span>

        <h1 className="font-display text-3xl sm:text-4xl text-fg font-semibold tracking-tight">
          Kode Booking: <span className="text-danau">{kode}</span>
        </h1>

        <p className="mt-3 text-sm text-fg-muted max-w-lg mx-auto leading-relaxed">
          Terima kasih. Pengajuan jadwal pendakian Anda telah masuk ke sistem antrean verifikasi kuota resmi e-Rinjani Balai TNGR.
        </p>

        {/* Ringkasan Data Reservasi */}
        <div className="mt-8 border-t border-border pt-6 text-left text-xs sm:text-sm bg-bg-subtle p-5 rounded-lg border space-y-2.5">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-fg-faint">Paket Ekspedisi:</span>
            <span className="font-semibold text-fg">{data?.packageName || "Paket Pendakian Rinjani"}</span>
          </div>
          {data?.packageDuration && (
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-fg-faint">Durasi & Rute:</span>
              <span className="text-fg">{data.packageDuration} ({data.packageRoute})</span>
            </div>
          )}
          {data?.date && (
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-fg-faint">Rencana Tanggal Mulai:</span>
              <span className="font-medium text-fg">{data.date}</span>
            </div>
          )}
          {data?.participants && (
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-fg-faint">Jumlah Peserta:</span>
              <span className="font-medium text-fg">{data.participants} Orang ({data?.nationality || "WNI"})</span>
            </div>
          )}
          {data?.name && (
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-fg-faint">Ketua Rombongan:</span>
              <span className="text-fg">{data.name}</span>
            </div>
          )}
          {data?.totalIdr && (
            <div className="flex justify-between pt-1 font-medium">
              <span className="text-fg-faint">Total Estimasi Biaya:</span>
              <span className="font-display text-base font-bold text-fg">{formatIdr(data.totalIdr)}</span>
            </div>
          )}
        </div>

        {/* 3 Langkah Selanjutnya */}
        <div className="mt-10 text-left border-t border-border pt-8">
          <p className="text-xs font-semibold tracking-wider uppercase text-fg-faint mb-4">
            Tahapan Selanjutnya:
          </p>
          <ol className="space-y-4 text-xs sm:text-sm text-fg-muted list-decimal list-inside leading-relaxed">
            <li>
              <strong className="text-fg">Pengecekan Kuota TNGR (Maks. 2 Jam Kerja):</strong> Tim kami memeriksa kuota gerbang Sembalun/Senaru di sistem e-Rinjani untuk tanggal yang Anda ajukan.
            </li>
            <li>
              <strong className="text-fg">Konfirmasi Melalui WhatsApp & Email:</strong> Petugas kami akan menghubungi nomor <strong>{data?.whatsapp || "WhatsApp Anda"}</strong> untuk mengirimkan rincian invoice dan surat pernyataan kesehatan.
            </li>
            <li>
              <strong className="text-fg">Pembayaran Uang Muka (DP 30%):</strong> Setelah tanggal diverifikasi, DP dibayarkan untuk penerbitan simaksi resmi dan pemesanan logistik tim porter.
            </li>
          </ol>
        </div>

        {/* Tombol Aksi Langsung ke WhatsApp */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`https://wa.me/${SITE.kontak.whatsapp}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#25D366] text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
          >
            <span>Konfirmasi Cepat via WhatsApp</span>
            <span>↗</span>
          </a>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-md border border-border text-fg text-sm hover:bg-bg-subtle transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

