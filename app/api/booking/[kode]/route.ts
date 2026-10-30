import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const { kode } = await params;
    if (!kode) {
      return NextResponse.json({ error: "Kode booking diperlukan" }, { status: 400 });
    }

    const rows = await sql`
      SELECT 
        b.booking_code as "bookingId",
        b.departure_date as "date",
        b.participants_count as "participants",
        b.total_price as "totalIdr",
        b.customer_name as "name",
        b.customer_email as "email",
        b.customer_whatsapp as "whatsapp",
        b.nationality,
        b.notes,
        b.status,
        b.created_at as "createdAt",
        p.name as "packageName",
        p.duration as "packageDuration",
        p.route as "packageRoute"
      FROM bookings b
      LEFT JOIN packages p ON b.package_id = p.id
      WHERE b.booking_code = ${kode}
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 });
    }

    const booking = rows[0];
    return NextResponse.json({
      ...booking,
      totalIdr: Number(booking.totalIdr),
      participants: String(booking.participants),
      date: typeof booking.date === "string" ? booking.date : (booking.date as Date)?.toISOString().slice(0, 10),
    });
  } catch (error) {
    console.error("Gagal mengambil data booking dari DB:", error);
    return NextResponse.json({ error: "Gagal mengambil data reservasi" }, { status: 500 });
  }
}

