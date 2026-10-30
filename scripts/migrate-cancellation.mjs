import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_VgzHq8ZB5ktn@ep-still-meadow-a1xp9if5-pooler.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
const sql = neon(connectionString);

async function run() {
  console.log("Menambahkan kolom cancellation_reason & cancelled_at ke tabel bookings...");
  await sql`
    ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
      ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
  `;
  console.log("Migrasi sukses! Kolom pembatalan telah ditambahkan.");
}

run().catch((err) => {
  console.error("Gagal migrasi:", err);
  process.exit(1);
});

