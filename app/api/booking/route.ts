import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import { packages } from "@/lib/data";
import { getApiAuth } from "@/lib/auth-helpers";
import { verifyTurnstile } from "@/lib/turnstile";
import { SITE } from "@/lib/site";
import { formatAdminAlertMessage, sendWhatsAppGateway } from "@/lib/whatsapp";

// Validasi input pemesanan via Zod (Email dihapus dari skema karena wajib dari sesi Google)
const bookingSchema = z.object({
  packageId: z.string().min(1, "Paket pendakian wajib dipilih"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)"),
  participants: z.coerce.number().int().min(1, "Minimal 1 peserta").max(12, "Maksimal 12 peserta"),
  name: z.string().trim().min(2, "Nama minimal 2 karakter"),
  whatsapp: z.string().trim().min(8, "Nomor WhatsApp tidak valid"),
  nationality: z.string().trim().min(2, "Kewarganegaraan wajib diisi"),
  notes: z.string().nullable().optional().default(""),
  turnstileToken: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    // 1. Wajib autentikasi sesi server
    const { user, errorResponse } = await getApiAuth();
    if (errorResponse) return errorResponse;
    if (!user || !user.email) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    // 2. Parse & validasi JSON body
    const body = await req.json().catch(() => null);
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Data input tidak valid";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { packageId, date, participants, name, whatsapp, nationality, notes, turnstileToken } = parsed.data;

    // 3. Verifikasi Cloudflare Turnstile
    const clientIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for");
    const turnstileCheck = await verifyTurnstile(turnstileToken, clientIp);
    if (!turnstileCheck.success) {
      return NextResponse.json({ error: turnstileCheck.error || "Verifikasi keamanan gagal" }, { status: 400 });
    }

    // 4. Rate limiting: Cek jumlah booking PENDING yang sedang aktif milik user ini
    const pendingCountResult = await sql`
      SELECT COUNT(*)::int as count 
      FROM bookings 
      WHERE user_id = ${user.id}::uuid 
        AND status = 'PENDING' 
        AND deleted_at IS NULL;
    `;
    const pendingCount = pendingCountResult[0]?.count || 0;
    if (pendingCount >= 5) {
      return NextResponse.json(
        {
          error: "Anda memiliki 5 pengajuan reservasi yang sedang menunggu verifikasi. Mohon tunggu proses konfirmasi sebelum mengajukan kembali.",
        },
        { status: 429 }
      );
    }

    // 5. Validasi Paket Pendakian
    let pkg = packages.find((p) => p.id === packageId);
    try {
      const dbPackages = await sql`
        SELECT id, name, duration, route, price_idr as "priceIdr" 
        FROM packages 
        WHERE id = ${packageId} AND is_active = TRUE 
        LIMIT 1;
      `;
      if (dbPackages.length > 0) {
        pkg = {
          ...pkg,
          ...dbPackages[0],
          priceIdr: Number(dbPackages[0].priceIdr),
        } as typeof pkg;
      }
    } catch (dbErr) {
      console.warn("Peringatan: Gagal membaca packages dari DB, menggunakan data lokal:", dbErr);
    }

    if (!pkg) {
      return NextResponse.json({ error: "Paket pendakian tidak ditemukan" }, { status: 400 });
    }

    // Normalisasi WhatsApp (hanya angka, pastikan awalan 62)
    let cleanWa = whatsapp.replace(/[^0-9]/g, "");
    if (cleanWa.startsWith("0")) cleanWa = "62" + cleanWa.slice(1);
    if (!cleanWa.startsWith("62")) cleanWa = "62" + cleanWa;

    const totalIdr = pkg.priceIdr * participants;
    const bookingCode = "RJN-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    // 6. Simpan ke database dengan user_id & email dari sesi Google
    await sql`
      INSERT INTO bookings (
        user_id,
        booking_code,
        package_id,
        departure_date,
        participants_count,
        total_price,
        customer_name,
        customer_email,
        customer_whatsapp,
        nationality,
        notes,
        status
      ) VALUES (
        ${user.id}::uuid,
        ${bookingCode},
        ${packageId},
        ${date},
        ${participants},
        ${totalIdr},
        ${name},
        ${user.email},
        ${cleanWa},
        ${nationality},
        ${notes || null},
        'PENDING'
      );
    `;

    // 7. Pengiriman notifikasi WA otomatis ke WhatsApp Admin (bila FONNTE_TOKEN / gateway terpasang)
    const adminPhone = process.env.WHATSAPP_ADMIN_PHONE || SITE.kontak.whatsapp;
    if (adminPhone) {
      const alertMsg = formatAdminAlertMessage({
        bookingCode,
        packageName: pkg.name,
        packageDuration: pkg.duration,
        packageRoute: pkg.route,
        departureDate: date,
        participantsCount: participants,
        nationality,
        customerName: name,
        customerWhatsapp: cleanWa,
        customerEmail: user.email,
        totalPrice: totalIdr,
        notes: notes || null,
      });
      sendWhatsAppGateway(adminPhone, alertMsg).catch(() => null);
    }

    return NextResponse.json({
      success: true,
      bookingId: bookingCode,
      totalIdr,
      packageName: pkg.name,
      packageDuration: pkg.duration,
      packageRoute: pkg.route,
      date,
      participants,
      name,
      email: user.email,
      whatsapp: cleanWa,
      nationality,
    });
  } catch (error) {
    console.error("Kesalahan pembuatan reservasi:", error);
    return NextResponse.json(
      { error: "Gagal memproses data reservasi. Silakan periksa kembali." },
      { status: 500 }
    );
  }
}
