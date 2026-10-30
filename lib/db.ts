import { neon } from "@neondatabase/serverless";

// Gunakan DATABASE_URL (pooled) untuk query aplikasi
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";

if (!connectionString && process.env.NODE_ENV === "production") {
  console.warn("DATABASE_URL is not defined in environment variables");
}

export const sql = neon(connectionString);

