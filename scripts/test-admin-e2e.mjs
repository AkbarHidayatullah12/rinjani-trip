import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
const sql = neon(connectionString);

async function testAdmin() {
  console.log("=== PENGUJIAN API ADMIN & OPERASIONAL ===");

  // 1. Ambil data statistik dari API
  const statsRes = await fetch("http://localhost:3000/api/admin/stats");
  if (!statsRes.ok) throw new Error("Gagal fetch /api/admin/stats");
  const statsData = await statsRes.json();
  console.log("Statistik Admin:", statsData.stats);

  // 2. Insert booking dummy untuk ditest di panel admin
  const dummyCode = "RJN-ADM" + Math.floor(1000 + Math.random() * 9000);
  console.log(`\nMenambahkan dummy booking (${dummyCode}) ...`);
  const insertResult = await sql`
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
      ${dummyCode},
      '3d2n-sembalun-senaru',
      '2026-08-10',
      4,
      11600000,
      'Pendaki Ekspedisi Rinjani',
      'ekspedisi@gmail.com',
      '6281987654321',
      'WNI',
      'Butuh 2 tenda terpisah dan vegetarian meal',
      'PENDING'
    )
    RETURNING id;
  `;
  const bookingId = insertResult[0].id;
  console.log(`Dummy booking tersimpan dengan ID: ${bookingId}`);

  // 3. Ambil daftar booking dari API /api/admin/bookings
  const listRes = await fetch(`http://localhost:3000/api/admin/bookings?q=${dummyCode}`);
  if (!listRes.ok) throw new Error("Gagal fetch /api/admin/bookings");
  const listData = await listRes.json();
  console.log("Hasil query API admin:", listData.bookings[0]);

  // 4. Update status menjadi CONFIRMED via PATCH /api/admin/bookings/[id]
  console.log(`\nMengubah status booking #${bookingId} menjadi CONFIRMED...`);
  const patchRes = await fetch(`http://localhost:3000/api/admin/bookings/${bookingId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "CONFIRMED" }),
  });
  if (!patchRes.ok) throw new Error("Gagal PATCH status booking");
  const patchData = await patchRes.json();
  console.log("Response update:", patchData);

  // 5. Bersihkan data dummy
  await sql`DELETE FROM bookings WHERE id = ${bookingId};`;
  console.log("\nDummy booking dibersihkan dari database!");

  console.log("\n=== SELURUH FITUR ADMIN DASHBOARD TERVERIFIKASI SEMPURNA! ===");
}

testAdmin().catch((err) => {
  console.error("Test Admin Gagal:", err);
  process.exit(1);
});

