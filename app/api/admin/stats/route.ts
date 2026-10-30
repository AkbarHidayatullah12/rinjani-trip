import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getApiAdminAuth } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const { user, errorResponse } = await getApiAdminAuth();
    if (errorResponse) return errorResponse;
    if (!user) return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });

    const stats = await sql`
      SELECT 
        COUNT(*)::int as "totalBookings",
        COALESCE(SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END), 0)::int as "pendingBookings",
        COALESCE(SUM(CASE WHEN status = 'CONFIRMED' THEN 1 ELSE 0 END), 0)::int as "confirmedBookings",
        COALESCE(SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END), 0)::int as "cancelledBookings",
        COALESCE(SUM(participants_count), 0)::int as "totalClimbers",
        COALESCE(SUM(CASE WHEN status = 'CONFIRMED' THEN total_price ELSE 0 END), 0)::bigint as "confirmedRevenue",
        COALESCE(SUM(total_price), 0)::bigint as "potentialRevenue"
      FROM bookings
      WHERE deleted_at IS NULL;
    `;

    return NextResponse.json({
      stats: {
        totalBookings: stats[0].totalBookings,
        pendingBookings: stats[0].pendingBookings,
        confirmedBookings: stats[0].confirmedBookings,
        cancelledBookings: stats[0].cancelledBookings,
        totalClimbers: stats[0].totalClimbers,
        confirmedRevenue: Number(stats[0].confirmedRevenue),
        potentialRevenue: Number(stats[0].potentialRevenue),
      },
    });
  } catch (error) {
    console.error("Gagal mengambil statistik admin:", error);
    return NextResponse.json({ error: "Gagal mengambil statistik" }, { status: 500 });
  }
}
