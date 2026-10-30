import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { packages } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    const {
      packageId,
      date,
      participants,
      name,
      email,
      whatsapp,
      nationality,
      notes = "",
    } = body as Record<string, string>;

    if (!packageId || !date || !name || !email || !whatsapp || !nationality) {
      return NextResponse.json({ error: "Lengkapi semua data wajib" }, { status: 400 });
    }

    const count = Number(participants);
    if (!Number.isInteger(count) || count < 1 || count > 12) {
      return NextResponse.json({ error: "Jumlah peserta harus 1 sampai 12" }, { status: 400 });
    }

    // Ambil data harga paket dari database atau fallback ke static
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

    const totalIdr = pkg.priceIdr * count;
    const bookingCode = "RJN-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    // Simpan ke PostgreSQL (Neon)
    try {
      await sql`
        INSERT INTO bookings (
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
          ${bookingCode},
          ${packageId},
          ${date},
          ${count},
          ${totalIdr},
          ${name},
          ${email},
          ${whatsapp},
          ${nationality},
          ${notes || null},
          'PENDING'
        );
      `;
    } catch (insertErr) {
      console.error("Gagal menyimpan booking ke Neon PostgreSQL:", insertErr);
      // Tetap kembalikan error yang jelas ke client jika database gagal
      return NextResponse.json(
        { error: "Gagal menyimpan data reservasi ke database. Silakan coba kembali." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookingId: bookingCode,
      totalIdr,
      packageName: pkg.name,
      packageDuration: pkg.duration,
      packageRoute: pkg.route,
      date,
      participants: count,
      name,
      email,
      whatsapp,
      nationality,
    });
  } catch (error) {
    console.error("Kesalahan internal server:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
  }
}
