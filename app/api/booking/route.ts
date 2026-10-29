import { NextResponse } from "next/server";
import { packages } from "@/lib/data";

/**
 * STUB. Alur yang akan dibangun di sini:
 *  1. Validasi input (sebaiknya pakai zod).
 *  2. Cek kuota tanggal tersebut di database (Supabase/Postgres), kunci kuota dalam satu transaksi.
 *  3. Simpan pemesanan dengan status "pending".
 *  4. Buat transaksi pembayaran (Midtrans Snap / Xendit Invoice), kembalikan token atau URL-nya.
 *  5. Webhook pembayaran di route lain mengubah status jadi "paid" lalu kirim email dan WhatsApp konfirmasi.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const { packageId, date, participants, name, email, whatsapp, nationality } = body as Record<string, string>;
  const pkg = packages.find((p) => p.id === packageId);

  if (!pkg) return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 400 });
  if (!date || !name || !email || !whatsapp || !nationality) {
    return NextResponse.json({ error: "Lengkapi semua data wajib" }, { status: 400 });
  }
  const count = Number(participants);
  if (!Number.isInteger(count) || count < 1 || count > 12) {
    return NextResponse.json({ error: "Jumlah peserta harus 1 sampai 12" }, { status: 400 });
  }

  const bookingId = "RJN-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  return NextResponse.json({ bookingId, totalIdr: pkg.priceIdr * count });
}
