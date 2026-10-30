import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  console.error("ERROR: DATABASE_URL tidak ditemukan di environment variables");
  process.exit(1);
}

const sql = neon(connectionString);

async function main() {
  console.log("Menghubungkan ke Neon PostgreSQL...");

  // 1. Tes koneksi & versi PostgreSQL
  const versionResult = await sql`SELECT version();`;
  console.log("Terhubung ke PostgreSQL:", versionResult[0].version);

  // 2. Buat tabel packages jika belum ada
  console.log("Membuat tabel 'packages'...");
  await sql`
    CREATE TABLE IF NOT EXISTS packages (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      duration VARCHAR(100) NOT NULL,
      route VARCHAR(255) NOT NULL,
      summary TEXT NOT NULL,
      price_idr BIGINT NOT NULL,
      highlights TEXT[] NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // 3. Buat tabel bookings jika belum ada
  console.log("Membuat tabel 'bookings'...");
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      booking_code VARCHAR(32) UNIQUE NOT NULL,
      package_id VARCHAR(64) NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,
      departure_date DATE NOT NULL,
      participants_count INT NOT NULL,
      total_price BIGINT NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_whatsapp VARCHAR(64) NOT NULL,
      nationality VARCHAR(64) NOT NULL,
      notes TEXT,
      status VARCHAR(32) DEFAULT 'PENDING',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // 4. Seed data paket awal
  console.log("Memeriksa data paket awal...");
  const initialPackages = [
    {
      id: "2d1n-sembalun",
      name: "Summit Express",
      duration: "2 hari 1 malam",
      route: "Sembalun → Puncak → Sembalun",
      summary: "Untuk yang waktunya singkat dan ingin mengejar sunrise di puncak.",
      priceIdr: 1800000,
      highlights: ["Sunrise di puncak 3.726 mdpl", "Camp di Plawangan Sembalun", "Guide dan porter"],
    },
    {
      id: "3d2n-sembalun-senaru",
      name: "Crossing Trek",
      duration: "3 hari 2 malam",
      route: "Sembalun → Puncak → Senaru",
      summary: "Rute favorit: naik dari sisi savana, turun lewat hutan tropis.",
      priceIdr: 2900000,
      highlights: ["Danau Segara Anak", "Air panas alami", "Dua sisi gunung dalam satu trip"],
    },
    {
      id: "4d3n-segara-anak",
      name: "Segara Anak Journey",
      duration: "4 hari 3 malam",
      route: "Sembalun → Segara Anak → Puncak → Senaru",
      summary: "Ritme lebih santai dengan waktu penuh di tepi danau kawah.",
      priceIdr: 3900000,
      highlights: ["Dua malam dekat danau", "Waktu istirahat lebih longgar", "Cocok untuk fotografi"],
    },
  ];

  for (const pkg of initialPackages) {
    await sql`
      INSERT INTO packages (id, name, duration, route, summary, price_idr, highlights)
      VALUES (${pkg.id}, ${pkg.name}, ${pkg.duration}, ${pkg.route}, ${pkg.summary}, ${pkg.priceIdr}, ${pkg.highlights})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        duration = EXCLUDED.duration,
        route = EXCLUDED.route,
        summary = EXCLUDED.summary,
        price_idr = EXCLUDED.price_idr,
        highlights = EXCLUDED.highlights;
    `;
  }

  // 5. Verifikasi isi tabel
  const countPackages = await sql`SELECT count(*) FROM packages;`;
  const countBookings = await sql`SELECT count(*) FROM bookings;`;
  console.log(`Sukses migrasi! Jumlah paket di database: ${countPackages[0].count}, bookings: ${countBookings[0].count}`);
}

main().catch((err) => {
  console.error("Gagal menjalankan migrasi:", err);
  process.exit(1);
});

