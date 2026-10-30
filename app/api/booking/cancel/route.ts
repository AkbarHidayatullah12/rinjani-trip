import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import { getApiAuth } from "@/lib/auth-helpers";
import { SITE } from "@/lib/site";
import { formatCancellationAlertMessage, sendWhatsAppGateway } from "@/lib/whatsapp";

const cancelSchema = z.object({
  bookingCode: z.string().trim().min(1, "Kode booking wajib diisi"),
  reason: z.string().trim().min(3, "Mohon berikan alasan pembatalan minimal 3 karakter"),
});

export async function POST(req: Request) {
  try {
    const { user, errorResponse } = await getApiAuth();
    if (errorResponse) return errorResponse;
    if (!user || !user.id) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = cancelSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Input pembatalan tidak valid";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { bookingCode, reason } = parsed.data;

    // Ambil data reservasi
    const bookings = await sql`
      SELECT 
        b.id,
        b.booking_code as "bookingCode",
        b.package_id as "packageId",
        b.departure_date as "departureDate",
        b.customer_name as "customerName",
        b.customer_whatsapp as "customerWhatsapp",
        b.status,
        b.user_id as "userId",
        p.name as "packageName"
      FROM bookings b
      LEFT JOIN packages p ON b.package_id = p.id
      WHERE b.booking_code = ${bookingCode}
        AND b.deleted_at IS NULL
      LIMIT 1;
    `;

    if (bookings.length === 0) {
      return NextResponse.json({ error: "Data reservasi tidak ditemukan" }, { status: 404 });
    }

    const booking = bookings[0];

    // Pastikan hanya pemilik reservasi atau admin yang dapat membatalkan
    if (booking.userId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Anda tidak memiliki akses untuk membatalkan pesanan ini" }, { status: 403 });
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json({ error: "Reservasi ini sudah berstatus dibatalkan" }, { status: 400 });
    }

    // Update status menjadi CANCELLED
    await sql`
      UPDATE bookings 
      SET 
        status = 'CANCELLED',
        cancellation_reason = ${reason},
        cancelled_at = NOW(),
        updated_at = NOW()
      WHERE id = ${booking.id};
    `;

    // Kirim notifikasi alert pembatalan ke WhatsApp Admin
    const adminPhone = process.env.WHATSAPP_ADMIN_PHONE || SITE.kontak.whatsapp;
    if (adminPhone) {
      const depDateStr =
        typeof booking.departureDate === "string"
          ? booking.departureDate
          : (booking.departureDate as Date).toISOString().slice(0, 10);

      const cancelMsg = formatCancellationAlertMessage({
        bookingCode: booking.bookingCode,
        customerName: booking.customerName,
        customerWhatsapp: booking.customerWhatsapp,
        packageName: booking.packageName || "Paket Rinjani",
        departureDate: depDateStr,
        reason,
      });

      sendWhatsAppGateway(adminPhone, cancelMsg).catch(() => null);
    }

    return NextResponse.json({
      success: true,
      message: "Reservasi berhasil dibatalkan",
      bookingCode,
      status: "CANCELLED",
    });
  } catch (error) {
    console.error("Gagal memproses pembatalan:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat memproses pembatalan" },
      { status: 500 }
    );
  }
}

