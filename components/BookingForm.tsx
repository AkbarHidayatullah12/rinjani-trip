"use client";

import { useState } from "react";
import { packages } from "@/lib/data";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; id: string }
  | { kind: "error"; message: string };

const inputClasses =
  "w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-danau focus:ring-1 focus:ring-danau focus:outline-none transition-colors";

export default function BookingForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "loading" });
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal memproses formulir");
      setStatus({ kind: "ok", id: json.bookingId });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Terjadi kendala pada pengiriman data" });
    }
  }

  return (
    <section id="pemesanan" className="bg-white py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="border-b border-border pb-8">
          <h2 className="font-display text-3xl sm:text-4xl text-fg font-normal tracking-tight">
            Formulir pemesanan pendakian
          </h2>
          <p className="mt-3 text-fg-muted text-sm leading-relaxed">
            Data ini digunakan untuk verifikasi e-Rinjani Balai TNGR dan persiapan logistik tim porter.
            Setelah verifikasi kuota, instruksi pembayaran resmi akan dikirimkan ke email dan nomor WhatsApp Anda.
          </p>
        </div>

        {status.kind === "ok" ? (
          <div className="mt-8 rounded-lg border border-border bg-bg-subtle p-8 text-center">
            <span className="text-xs uppercase font-semibold tracking-wider text-danau block mb-2">
              Pendaftaran Tercatat
            </span>
            <p className="font-display text-2xl font-semibold text-fg">
              Kode Referensi: {status.id}
            </p>
            <p className="mt-3 text-sm text-fg-muted max-w-md mx-auto leading-relaxed">
              Tim operasional kami akan memeriksa ketersediaan kuota tanggal tersebut dan menghubungi Anda dalam waktu 1x24 jam.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                Pilihan paket perjalanan
              </label>
              <select name="packageId" required className={inputClasses} defaultValue="">
                <option value="" disabled>
                  Pilih paket rute dan durasi
                </option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.duration} ({p.route})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                  Rencana tanggal mulai
                </label>
                <input type="date" name="date" required className={inputClasses} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                  Jumlah peserta pendaki
                </label>
                <input
                  type="number"
                  name="participants"
                  min={1}
                  max={12}
                  defaultValue={2}
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                Nama ketua rombongan (sesuai KTP / Paspor)
              </label>
              <input name="name" required autoComplete="name" className={inputClasses} placeholder="Nama lengkap" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                  Alamat email aktif
                </label>
                <input type="email" name="email" required autoComplete="email" className={inputClasses} placeholder="nama@email.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                  Nomor WhatsApp
                </label>
                <input type="tel" name="whatsapp" required placeholder="+62 8..." autoComplete="tel" className={inputClasses} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                Kewarganegaraan
              </label>
              <input name="nationality" required className={inputClasses} defaultValue="Indonesia" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                Catatan kesehatan atau riwayat medis
              </label>
              <textarea
                name="notes"
                rows={3}
                className={inputClasses}
                placeholder="Alergi makanan, riwayat asma, cedera lutut, atau kebutuhan diet khusus (opsional)"
              />
            </div>

            {status.kind === "error" && (
              <p role="alert" className="text-sm text-fajar bg-fajar-subtle p-3 rounded border border-fajar/20">
                {status.message}
              </p>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={status.kind === "loading"}
                className="w-full sm:w-auto px-8 py-3 rounded-md bg-fajar text-white text-sm font-medium hover:bg-fajar-hover transition-colors disabled:opacity-50"
              >
                {status.kind === "loading" ? "Memeriksa kuota..." : "Kirim pengajuan jadwal"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
