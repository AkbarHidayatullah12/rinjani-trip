import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getApiAdminAuth } from "@/lib/auth-helpers";

interface BookingDbRow {
  id: number;
  bookingCode: string;
  packageId: string;
  departureDate: string | Date;
  participantsCount: number;
  totalPrice: number | string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  nationality: string;
  notes?: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  cancellationReason?: string | null;
  cancelledAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  packageName?: string | null;
  packageDuration?: string | null;
  packageRoute?: string | null;
  googleUserName?: string | null;
  googleUserEmail?: string | null;
}

export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await getApiAdminAuth();
    if (errorResponse) return errorResponse;
    if (!user) return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q")?.toLowerCase();

    let query: BookingDbRow[];
    if (status && status !== "ALL") {
      query = (await sql`
        SELECT 
          b.id,
          b.booking_code as "bookingCode",
          b.package_id as "packageId",
          b.departure_date as "departureDate",
          b.participants_count as "participantsCount",
          b.total_price as "totalPrice",
          b.customer_name as "customerName",
          b.customer_email as "customerEmail",
          b.customer_whatsapp as "customerWhatsapp",
          b.nationality,
          b.notes,
          b.status,
          b.cancellation_reason as "cancellationReason",
          b.cancelled_at as "cancelledAt",
          b.created_at as "createdAt",
          b.updated_at as "updatedAt",
          p.name as "packageName",
          p.duration as "packageDuration",
          p.route as "packageRoute",
          u.name as "googleUserName",
          u.email as "googleUserEmail"
        FROM bookings b
        LEFT JOIN packages p ON b.package_id = p.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.status = ${status}
          AND b.deleted_at IS NULL
        ORDER BY b.created_at DESC;
      `) as unknown as BookingDbRow[];
    } else {
      query = (await sql`
        SELECT 
          b.id,
          b.booking_code as "bookingCode",
          b.package_id as "packageId",
          b.departure_date as "departureDate",
          b.participants_count as "participantsCount",
          b.total_price as "totalPrice",
          b.customer_name as "customerName",
          b.customer_email as "customerEmail",
          b.customer_whatsapp as "customerWhatsapp",
          b.nationality,
          b.notes,
          b.status,
          b.cancellation_reason as "cancellationReason",
          b.cancelled_at as "cancelledAt",
          b.created_at as "createdAt",
          b.updated_at as "updatedAt",
          p.name as "packageName",
          p.duration as "packageDuration",
          p.route as "packageRoute",
          u.name as "googleUserName",
          u.email as "googleUserEmail"
        FROM bookings b
        LEFT JOIN packages p ON b.package_id = p.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.deleted_at IS NULL
        ORDER BY b.created_at DESC;
      `) as unknown as BookingDbRow[];
    }

    let results = query.map((row) => ({
      ...row,
      totalPrice: Number(row.totalPrice),
      departureDate:
        typeof row.departureDate === "string"
          ? row.departureDate
          : (row.departureDate as Date)?.toISOString().slice(0, 10),
    }));

    if (q) {
      results = results.filter(
        (b) =>
          b.bookingCode.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.customerWhatsapp.includes(q) ||
          b.customerEmail.toLowerCase().includes(q) ||
          (b.packageName && b.packageName.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ bookings: results });
  } catch (error) {
    console.error("Gagal mengambil daftar booking admin:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
