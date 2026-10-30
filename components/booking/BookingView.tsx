"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { packages, formatIdr, type Package } from "@/lib/data";
import { SITE } from "@/lib/site";
import Turnstile from "@/components/Turnstile";

type FieldErrors = {
  packageId?: string;
  date?: string;
  participants?: string;
  name?: string;
  email?: string;
  whatsapp?: string;
  nationality?: string;
};

interface BookingViewProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  availablePackages?: Package[];
}

export default function BookingView({ user, availablePackages }: BookingViewProps) {
  const packageList = availablePackages && availablePackages.length > 0 ? availablePackages : packages;
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPackage = searchParams.get("paket") || packageList[1]?.id || packageList[0]?.id || "2d1n-sembalun";

  const [packageId, setPackageId] = useState(preselectedPackage);
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState(2);
  const [nationality, setNationality] = useState<"WNI" | "WNA">("WNI");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [hasPrefilled, setHasPrefilled] = useState(false);

  useEffect(() => {
    if (user && !hasPrefilled) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      setHasPrefilled(true);
    }
  }, [user, hasPrefilled]);

  useEffect(() => {
    const p = searchParams.get("paket");
    if (p && packageList.some((pkg) => pkg.id === p)) {
      setPackageId(p);
    }
  }, [searchParams, packageList]);

  const selectedPkg = packageList.find((p) => p.id === packageId) || packageList[0];

  // Hitungan tiket resmi TNGR: WNA memiliki selisih tarif tiket konservasi
  const basePricePerPerson = selectedPkg.priceIdr;
  const tngrSurchargePerPerson = nationality === "WNA" ? 350_000 : 0;
  const totalPricePerPerson = basePricePerPerson + tngrSurchargePerPerson;
  const grandTotal = totalPricePerPerson * participants;

  function normalizeWhatsapp(phone: string): string {
    let clean = phone.replace(/[^0-9+]/g, "");
    if (clean.startsWith("+")) clean = clean.slice(1);
    if (clean.startsWith("08")) clean = "628" + clean.slice(2);
    if (clean.startsWith("8")) clean = "62" + clean;
    return clean;
  }

  function validate(): boolean {
    const newErrors: FieldErrors = {};
    if (!packageId) newErrors.packageId = "Pilih salah satu paket pendakian.";
    if (!date) newErrors.date = "Pilih rencana tanggal pendakian.";
    if (!participants || participants < 1 || participants > 12) {
      newErrors.participants = "Jumlah peserta minimal 1 dan maksimal 12 orang.";
    }
    if (!name.trim()) newErrors.name = "Nama lengkap wajib diisi sesuai KTP/Paspor.";
    if (!email.trim() || !email.includes("@")) newErrors.email = "Masukkan alamat email yang valid.";
    if (!whatsapp.trim() || whatsapp.length < 8) newErrors.whatsapp = "Masukkan nomor WhatsApp yang valid.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");

    if (!validate()) return;

    setIsLoading(true);
    const normalizedWA = normalizeWhatsapp(whatsapp);

    try {
      const payload = {
        packageId,
        date,
        participants: String(participants),
        nationality,
        name: name.trim(),
        whatsapp: normalizedWA,
        notes: notes ? notes.trim() : "",
        totalIdr: grandTotal,
        turnstileToken: turnstileToken || null,
      };

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses pendaftaran. Silakan coba lagi.");
      }

      // Simpan data konfirmasi sementara di sessionStorage untuk halaman konfirmasi
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `booking_${data.bookingId}`,
          JSON.stringify({
            ...payload,
            bookingId: data.bookingId,
            packageName: selectedPkg.name,
            packageDuration: selectedPkg.duration,
            packageRoute: selectedPkg.route,
            totalIdr: grandTotal,
            createdAt: new Date().toISOString(),
          })
        );
      }

      router.push(`/booking/${data.bookingId}`);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "Terjadi kendala jaringan.");
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Kolom Kiri: Formulir Pemesanan */}
      <div className="lg:col-span-7">
        <form onSubmit={handleSubmit} className="space-y-6">
          {globalError && (
            <div className="p-4 rounded-md border border-fajar/30 bg-fajar-subtle text-xs text-fajar font-medium">
              {globalError}
            </div>
          )}

          {/* 1. Paket & Tanggal */}
          <div className="bg-white p-6 sm:p-7 rounded-lg border border-border shadow-sm space-y-5">
            <h2 className="text-base font-semibold text-fg border-b border-border pb-3">
              1. Rincian Ekspedisi
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                Pilihan Paket
              </label>
              <select
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-fg focus:border-danau focus:ring-1 focus:ring-danau focus:outline-none"
              >
                {packageList.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} — {pkg.duration} ({pkg.route})
                  </option>
                ))}
              </select>
              {errors.packageId && <p className="text-xs text-fajar mt-1">{errors.packageId}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                  Tanggal Mulai Pendakian
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-fg focus:border-danau focus:ring-1 focus:ring-danau focus:outline-none"
                />
                {errors.date && <p className="text-xs text-fajar mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                  Jumlah Peserta (1–12)
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={participants}
                  onChange={(e) => setParticipants(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                  className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-fg focus:border-danau focus:ring-1 focus:ring-danau focus:outline-none"
                />
                {errors.participants && (
                  <p className="text-xs text-fajar mt-1">{errors.participants}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                Kategori Kewarganegaraan
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNationality("WNI")}
                  className={`py-2 px-3 text-xs font-medium rounded border transition-colors text-center ${
                    nationality === "WNI"
                      ? "border-danau bg-danau/5 text-danau font-semibold"
                      : "border-border text-fg-muted hover:bg-bg-subtle"
                  }`}
                >
                  Warga Negara Indonesia (WNI)
                </button>
                <button
                  type="button"
                  onClick={() => setNationality("WNA")}
                  className={`py-2 px-3 text-xs font-medium rounded border transition-colors text-center ${
                    nationality === "WNA"
                      ? "border-danau bg-danau/5 text-danau font-semibold"
                      : "border-border text-fg-muted hover:bg-bg-subtle"
                  }`}
                >
                  Warga Negara Asing (WNA)
                </button>
              </div>
              {nationality === "WNA" && (
                <p className="text-[11px] text-fg-faint mt-1.5">
                  *Penyesuaian tiket retribusi konservasi e-Rinjani resmi untuk turis internasional (+Rp 350.000/orang).
                </p>
              )}
            </div>
          </div>

          {/* 2. Data Kontak Pemesan */}
          <div className="bg-white p-6 sm:p-7 rounded-lg border border-border shadow-sm space-y-5">
            <h2 className="text-base font-semibold text-fg border-b border-border pb-3">
              2. Data Kontak Ketua Rombongan
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                Nama Lengkap (Sesuai KTP / Paspor)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-fg focus:border-danau focus:ring-1 focus:ring-danau focus:outline-none"
              />
              {errors.name && <p className="text-xs text-fajar mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted">
                    Email Akun
                  </label>
                  {user?.email && (
                    <span className="text-[10px] text-danau font-medium bg-danau/10 px-1.5 py-0.5 rounded">
                      Google Terverifikasi
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  value={email}
                  readOnly={!!user?.email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@contoh.com"
                  className={`w-full rounded-md border border-border px-3.5 py-2.5 text-sm text-fg focus:outline-none ${
                    user?.email
                      ? "bg-bg-subtle text-fg-muted cursor-not-allowed border-dashed"
                      : "bg-white focus:border-danau focus:ring-1 focus:ring-danau"
                  }`}
                />
                {user?.email && (
                  <p className="text-[10px] text-fg-faint mt-1">
                    Email terkunci otomatis sesuai akun Google Anda untuk keamanan reservasi.
                  </p>
                )}
                {errors.email && <p className="text-xs text-fajar mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08123456789 atau +628..."
                  className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-fg focus:border-danau focus:ring-1 focus:ring-danau focus:outline-none"
                />
                {errors.whatsapp && <p className="text-xs text-fajar mt-1">{errors.whatsapp}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-1.5">
                Catatan Medis atau Diet Khusus (Opsional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Riwayat asma, cedera sendi, alergi makanan, atau menu vegetarian untuk tim porter..."
                className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-fg focus:border-danau focus:ring-1 focus:ring-danau focus:outline-none"
              />
            </div>
          </div>

          <p className="text-xs text-fg-muted leading-relaxed">
            Dengan menekan tombol di bawah, Anda menyetujui{" "}
            <Link href="/syarat-ketentuan" className="text-danau underline hover:text-danau-hover">
              Syarat & Ketentuan
            </Link>{" "}
            serta{" "}
            <Link href="/kebijakan-pembatalan" className="text-danau underline hover:text-danau-hover">
              Kebijakan Pembatalan
            </Link>{" "}
            pendakian Rinjani Trek.
          </p>

          <Turnstile onVerify={(token) => setTurnstileToken(token)} />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-md bg-fajar text-white font-medium text-sm hover:bg-fajar-hover transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? "Memproses Verifikasi Kuota..." : "Ajukan Reservasi Pendakian →"}
          </button>
        </form>
      </div>

      {/* Kolom Kanan: Ringkasan Paket & Biaya (Sticky di Desktop) */}
      <div className="lg:col-span-5 sticky top-28 space-y-6">
        <div className="bg-bg-subtle rounded-lg border border-border p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-danau mb-1">
            Ringkasan Ekspedisi
          </p>
          <h3 className="font-display text-2xl font-semibold text-fg">
            {selectedPkg.name}
          </h3>
          <p className="text-xs text-fg-muted mt-0.5 font-medium">
            {selectedPkg.duration} · {selectedPkg.route}
          </p>

          <div className="my-5 border-t border-border pt-4 text-xs text-fg-muted space-y-2">
            <p className="font-medium text-fg">Fasilitas yang sudah termasuk:</p>
            {selectedPkg.highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-danau">•</span>
                <span>{item}</span>
              </div>
            ))}
            <div className="flex items-start gap-2">
              <span className="text-danau">•</span>
              <span>Tenda gunung, matras tebal, koki & 3x makan sehari</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-danau">•</span>
              <span>Tiket resmi simaksi e-Rinjani TNGR & asuransi</span>
            </div>
          </div>

          {/* Rincian Transparan */}
          <div className="border-t border-border pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-fg-muted">
              <span>Tarif dasar per orang</span>
              <span>{formatIdr(basePricePerPerson)}</span>
            </div>
            {nationality === "WNA" && (
              <div className="flex justify-between text-fg-muted">
                <span>Retribusi WNA resmi TNGR</span>
                <span>+{formatIdr(tngrSurchargePerPerson)}</span>
              </div>
            )}
            <div className="flex justify-between text-fg-muted">
              <span>Jumlah pendaki</span>
              <span>× {participants} orang</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-baseline font-medium text-fg">
              <span className="text-sm font-semibold">Total Estimasi</span>
              <span className="font-display text-2xl font-semibold text-fg">
                {formatIdr(grandTotal)}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border text-[11px] text-fg-faint leading-relaxed">
            *Belum termasuk tip sukarela untuk tim porter/guide. Pembayaran resmi diverifikasi setelah konfirmasi slot e-Rinjani.
          </div>
        </div>

        {/* Bantuan Cepat */}
        <div className="p-4 rounded-lg border border-border bg-white text-xs text-fg-muted flex items-center justify-between gap-3">
          <span>Butuh konsultasi rute khusus atau rombongan &gt;12 orang?</span>
          <a
            href={`https://wa.me/${SITE.kontak.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-danau hover:underline shrink-0"
          >
            Chat WhatsApp ↗
          </a>
        </div>
      </div>
    </div>
  );
}

