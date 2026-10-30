import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
const sql = neon(connectionString);

async function testHttpApi() {
  console.log("=== PENGUJIAN HTTP API ROUTE & POSTGRESQL E2E ===");

  const payload = {
    packageId: "3d2n-sembalun-senaru",
    date: "2026-07-20",
    participants: "3",
    name: "Akbar Hidayatullah",
    email: "akbar@test.com",
    whatsapp: "6281234567890",
    nationality: "WNI",
    notes: "Pengujian booking via API Next.js",
  };

  console.log("\n[1/3] Mengirim HTTP POST ke http://localhost:3000/api/booking ...");
  const postRes = await fetch("http://localhost:3000/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!postRes.ok) {
    const errText = await postRes.text();
    throw new Error(`HTTP POST gagal (${postRes.status}): ${errText}`);
  }

  const postData = await postRes.json();
  console.log("Response POST /api/booking:", postData);
  const bookingCode = postData.bookingId;

  console.log(`\n[2/3] Mengambil data booking via HTTP GET /api/booking/${bookingCode} ...`);
  const getRes = await fetch(`http://localhost:3000/api/booking/${bookingCode}`);
  if (!getRes.ok) {
    const errText = await getRes.text();
    throw new Error(`HTTP GET gagal (${getRes.status}): ${errText}`);
  }

  const getData = await getRes.json();
  console.log("Response GET /api/booking/[kode]:", getData);

  console.log(`\n[3/3] Membersihkan data uji coba (${bookingCode}) dari Neon...`);
  await sql`DELETE FROM bookings WHERE booking_code = ${bookingCode};`;
  console.log("Data uji coba berhasil dibersihkan dari database!");

  console.log("\n=== HTTP API & NEON POSTGRESQL TERBUKTI BERFUNGSI SEMPURNA! ===");
}

testHttpApi().catch((err) => {
  console.error("Test API gagal:", err);
  process.exit(1);
});

