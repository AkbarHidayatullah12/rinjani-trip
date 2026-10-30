"use client";

import { useState } from "react";
import Link from "next/link";
import { formatIdr } from "@/lib/data";

export interface AccountBookingItem {
  id: number;
  bookingCode: string;
  departureDate: string;
  participantsCount: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  cancellationReason?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  packageName?: string | null;
  packageDuration?: string | null;
  packageRoute?: string | null;
}

interface AccountBookingsTableProps {
  initialBookings: AccountBookingItem[];
}

const PRESET_REASONS = [
  "Perubahan rencana / urusan keluarga mendadak",
  "Kondisi fisik atau kesehatan kurang memungkinkan",
  "Kendala tiket pesawat / transportasi menuju Lombok",
  "Ingin mengubah tanggal atau paket pendakian",
  "Lainnya",
];

export default function AccountBookingsTable({ initialBookings }: AccountBookingsTableProps) {
  const [bookings, setBookings] = useState<AccountBookingItem[]>(initialBookings);
  const [selectedForCancel, setSelectedForCancel] = useState<AccountBookingItem | null>(null);
  const [selectedPresetReason, setSelectedPresetReason] = useState<string>(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenCancelModal = (booking: AccountBookingItem) => {
    setSelectedForCancel(booking);
    setSelectedPresetReason(PRESET_REASONS[0]);
    setCustomReason("");
    setErrorMessage(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedForCancel) return;

    let finalReason = selectedPresetReason;
    if (selectedPresetReason === "Lainnya" || customReason.trim().length > 0) {
      if (selectedPresetReason === "Lainnya" && customReason.trim().length < 3) {
        setErrorMessage("Mohon ketikkan keterangan alasan pembatalan Anda.");
        return;
      }
      finalReason = customReason.trim()
        ? `${selectedPresetReason}: ${customReason.trim()}`
        : selectedPresetReason;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/booking/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingCode: selectedForCancel.bookingCode,
          reason: finalReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Gagal membatalkan reservasi.");
        setIsSubmitting(false);
        return;
      }

      // Update state secara lokal
      setBookings((prev) =>
        prev.map((item) =>
          item.bookingCode === selectedForCancel.bookingCode
            ? {
                ...item,
                status: "CANCELLED",
                cancellationReason: finalReason,
                cancelledAt: new Date().toISOString(),
              }
            : item
        )
      );

      setSelectedForCancel(null);
      showToast(`Reservasi ${selectedForCancel.bookingCode} berhasil dibatalkan.`);
    } catch {
      setErrorMessage("Terjadi gangguan jaringan. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center space-y-3">
        <p className="text-sm text-fg-muted">
          Anda belum memiliki pengajuan reservasi pendakian.
        </p>
        <div>
          <Link
            href="/booking"
            className="inline-block rounded-lg bg-danau px-4 py-2.5 text-xs font-medium text-white hover:bg-danau/90 transition shadow-xs"
          >
            Mulai Pesan Pendakian Rinjani →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800 animate-in fade-in slide-in-from-top-1 duration-200 flex items-center justify-between">
          <span>✓ {toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabel Data Reservasi */}
      <div className="rounded-xl border border-border bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-bg-subtle text-fg-muted font-medium uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Kode Booking</th>
                <th className="py-3.5 px-4">Paket Pendakian</th>
                <th className="py-3.5 px-4">Jadwal Trip</th>
                <th className="py-3.5 px-4 text-center">Peserta</th>
                <th className="py-3.5 px-4">Total Biaya</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-bg-subtle/40 transition">
                  {/* Kode */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-semibold text-danau block">
                      {b.bookingCode}
                    </span>
                    <span className="text-[10px] text-fg-muted">
                      {new Date(b.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Paket */}
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-fg block">
                      {b.packageName || "Paket Rinjani"}
                    </span>
                    {b.packageDuration && (
                      <span className="text-[10px] text-fg-muted block">
                        {b.packageDuration}
                      </span>
                    )}
                  </td>

                  {/* Tanggal */}
                  <td className="py-3.5 px-4 text-fg-muted">{b.departureDate}</td>

                  {/* Peserta */}
                  <td className="py-3.5 px-4 text-center font-medium">
                    {b.participantsCount} org
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 font-semibold text-fg">
                    {formatIdr(b.totalPrice)}
                  </td>

                  {/* Status & Alasan */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : b.status === "CANCELLED"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {b.status === "CONFIRMED"
                          ? "Terkonfirmasi"
                          : b.status === "CANCELLED"
                          ? "Dibatalkan"
                          : "Menunggu Verifikasi"}
                      </span>

                      {b.status === "CANCELLED" && b.cancellationReason && (
                        <p
                          className="text-[10px] text-red-600/90 leading-tight max-w-[170px] truncate"
                          title={`Alasan: ${b.cancellationReason}`}
                        >
                          <span className="font-medium">Alasan:</span> {b.cancellationReason}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <Link
                        href={`/booking/${b.bookingCode}`}
                        className="text-danau hover:underline font-medium text-xs whitespace-nowrap"
                      >
                        Lihat Tiket →
                      </Link>

                      {b.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleOpenCancelModal(b)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs font-medium border border-transparent hover:border-red-200 transition cursor-pointer whitespace-nowrap"
                          title="Batalkan reservasi ini"
                        >
                          Batalkan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi Pembatalan */}
      {selectedForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  Batalkan Reservasi
                </span>
                <h3 className="font-display text-base font-semibold text-fg mt-1">
                  Kode: {selectedForCancel.bookingCode}
                </h3>
                <p className="text-xs text-fg-muted mt-0.5">
                  Paket {selectedForCancel.packageName} ({selectedForCancel.departureDate})
                </p>
              </div>
              <button
                onClick={() => setSelectedForCancel(null)}
                disabled={isSubmitting}
                className="rounded-lg p-1 text-fg-muted hover:bg-bg-subtle transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form Alasan Pembatalan */}
            <div className="space-y-3 text-xs">
              <label className="block font-semibold text-fg">
                Pilih Alasan Pembatalan:
              </label>
              <div className="space-y-2">
                {PRESET_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition ${
                      selectedPresetReason === reason
                        ? "border-danau bg-danau/5 text-fg font-medium"
                        : "border-border text-fg-muted hover:bg-bg-subtle"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      value={reason}
                      checked={selectedPresetReason === reason}
                      onChange={(e) => setSelectedPresetReason(e.target.value)}
                      className="text-danau focus:ring-danau"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block font-medium text-fg-muted mb-1">
                  Keterangan Tambahan (Opsional):
                </label>
                <textarea
                  rows={3}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Ceritakan alasan Anda lebih rinci agar tim kami dapat memahami..."
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-fg focus:border-danau focus:ring-1 focus:ring-danau focus:outline-none"
                />
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800 leading-relaxed">
                ⚠️ <strong>Pemberitahuan:</strong> Pembatalan akan otomatis melepaskan slot reservasi e-Rinjani Anda dan memberitahukan tim admin melalui sistem WhatsApp operasional.
              </div>

              {errorMessage && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setSelectedForCancel(null)}
                disabled={isSubmitting}
                className="rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-fg-muted hover:bg-bg-subtle transition cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isSubmitting}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Ya, Batalkan Reservasi</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

