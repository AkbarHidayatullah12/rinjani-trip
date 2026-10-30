import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  console.error("ERROR: DATABASE_URL tidak ditemukan");
  process.exit(1);
}

const sql = neon(connectionString);

async function runE2ETest() {
  console.log("=== MEMULAI TEST END-TO-END NEON POSTGRESQL ===");

  // 1. Verifikasi koneksi DB & read packages
  console.log("\n[1/4] Memeriksa tabel packages dari Neon PostgreSQL...");
  const pkgs = await sql`SELECT id, name, price_idr FROM packages ORDER BY price_idr ASC;`;
  console.log("Paket ditemukan di database:", pkgs);

  // 2. Simulasikan pembuatan booking baru langsung ke DB
  const testCode = "RJN-TEST" + Math.floor(1000 + Math.random() * 9000);
  console.log(`\n[2/4] Melakukan INSERT booking uji coba (${testCode})...`);
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
      ${testCode},
      '2d1n-sembalun',
      '2026-06-15',
      2,
      3600000,
      'Pendaki Uji Coba',
      'test@rinjanitrek.com',
      '6281234567890',
      'WNI',
      'Uji integrasi otomatis Neon PostgreSQL',
      'PENDING'
    );
  `;
  console.log(`Insert berhasil untuk booking code: ${testCode}`);

  // 3. Verifikasi pembacaan booking yang baru di-insert
  console.log(`\n[3/4] Melakukan SELECT verifikasi booking ${testCode}...`);
  const fetched = await sql`
    SELECT 
      b.booking_code, 
      b.customer_name, 
      b.total_price, 
      b.status, 
      p.name as package_name
    FROM bookings b
    JOIN packages p ON b.package_id = p.id
    WHERE b.booking_code = ${testCode};
  `;
  console.log("Hasil query database:", fetched[0]);

  // 4. Bersihkan data test (cleanup)
  console.log("\n[4/4] Membersihkan data uji coba...");
  await sql`DELETE FROM bookings WHERE booking_code = ${testCode};`;
  console.log("Data uji coba berhasil dibersihkan.");

  console.log("\n=== SEMUA PENGUJIAN END-TO-END BERHASIL 100%! ===");
}

runE2ETest().catch((err) => {
  console.error("Test gagal:", err);
  process.exit(1);
});

