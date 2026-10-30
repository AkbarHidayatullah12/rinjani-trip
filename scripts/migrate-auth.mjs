import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  console.error("ERROR: DATABASE_URL tidak ditemukan");
  process.exit(1);
}

const sql = neon(connectionString);

async function runAuthMigration() {
  console.log("Menjalankan migrasi autentikasi ke Neon PostgreSQL...");

  // 1. Buat tabel users
  console.log("1. Membuat tabel 'users' (jika belum ada)...");
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      google_sub    text NOT NULL UNIQUE,
      email         text NOT NULL UNIQUE,
      name          text,
      image         text,
      role          text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      created_at    timestamptz NOT NULL DEFAULT now(),
      last_login_at timestamptz NOT NULL DEFAULT now()
    );
  `;

  // 2. Tambah kolom user_id dan deleted_at pada tabel bookings
  console.log("2. Menambahkan kolom 'user_id' & 'deleted_at' pada tabel 'bookings'...");
  await sql`
    ALTER TABLE bookings
      ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
  `;

  // 3. Buat indeks user_id
  console.log("3. Membuat indeks 'idx_bookings_user_id'...");
  await sql`
    CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
  `;

  console.log("Migrasi skema users dan relasi bookings sukses 100%!");
}

runAuthMigration().catch((err) => {
  console.error("Gagal migrasi:", err);
  process.exit(1);
});

