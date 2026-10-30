import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import { getApiAdminAuth } from "@/lib/auth-helpers";

const patchSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await getApiAdminAuth();
    if (errorResponse) return errorResponse;
    if (!user) return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });

    const { id } = await params;
    const bookingId = Number(id);
    if (!Number.isInteger(bookingId)) {
      return NextResponse.json({ error: "ID booking tidak valid" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data pembaruan tidak valid" }, { status: 400 });
    }

    const { status, notes, cancellationReason } = parsed.data;

    await sql`
      UPDATE bookings 
      SET 
        status = COALESCE(${status || null}, status),
        notes = COALESCE(${notes !== undefined ? notes : null}, notes),
        cancellation_reason = COALESCE(${cancellationReason !== undefined ? cancellationReason : null}, cancellation_reason),
        cancelled_at = CASE WHEN ${status === "CANCELLED"} THEN NOW() ELSE cancelled_at END,
        updated_at = NOW() 
      WHERE id = ${bookingId} AND deleted_at IS NULL;
    `;

    return NextResponse.json({ success: true, message: "Status booking berhasil diperbarui" });
  } catch (error) {
    console.error("Gagal update booking:", error);
    return NextResponse.json({ error: "Gagal memperbarui status" }, { status: 500 });
  }
}

/**
 * Soft Delete: Mengisi kolom deleted_at = NOW()
 * Data tidak dihapus permanen dari database
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await getApiAdminAuth();
    if (errorResponse) return errorResponse;
    if (!user) return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });

    const { id } = await params;
    const bookingId = Number(id);
    if (!Number.isInteger(bookingId)) {
      return NextResponse.json({ error: "ID booking tidak valid" }, { status: 400 });
    }

    await sql`
      UPDATE bookings 
      SET deleted_at = NOW(), updated_at = NOW() 
      WHERE id = ${bookingId};
    `;

    return NextResponse.json({ success: true, message: "Booking berhasil diarsipkan (soft delete)" });
  } catch (error) {
    console.error("Gagal soft delete booking:", error);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}
