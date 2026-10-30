import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { getApiAdminAuth } from "@/lib/auth-helpers";

const packageUpdateSchema = z.object({
  name: z.string().trim().min(2, "Nama paket minimal 2 karakter"),
  duration: z.string().trim().min(2, "Durasi paket wajib diisi"),
  route: z.string().trim().min(2, "Rute pendakian wajib diisi"),
  summary: z.string().trim().min(5, "Deskripsi ringkas minimal 5 karakter"),
  priceIdr: z.coerce.number().min(100000, "Harga minimal Rp 100.000"),
  highlights: z.array(z.string().trim().min(1)).min(1, "Minimal 1 fasilitas/highlight"),
  isActive: z.boolean().default(true),
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
    const body = await req.json().catch(() => null);
    const parsed = packageUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Input paket tidak valid";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, duration, route, summary, priceIdr, highlights, isActive } = parsed.data;

    const result = await sql`
      UPDATE packages 
      SET 
        name = ${name},
        duration = ${duration},
        route = ${route},
        summary = ${summary},
        price_idr = ${priceIdr},
        highlights = ${highlights},
        is_active = ${isActive}
      WHERE id = ${id}
      RETURNING id, name, duration, route, summary, price_idr as "priceIdr", highlights, is_active as "isActive";
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Paket pendakian tidak ditemukan" }, { status: 404 });
    }

    // Revalidasi cache halaman utama dan booking agar harga baru langsung aktif
    revalidatePath("/");
    revalidatePath("/booking");

    return NextResponse.json({
      success: true,
      message: `Paket ${name} berhasil diperbarui`,
      package: {
        ...result[0],
        priceIdr: Number(result[0].priceIdr),
      },
    });
  } catch (err) {
    console.error("Gagal update paket pendakian:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server saat memperbarui paket" }, { status: 500 });
  }
}

