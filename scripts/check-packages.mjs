import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_VgzHq8ZB5ktn@ep-still-meadow-a1xp9if5-pooler.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
const sql = neon(connectionString);

async function run() {
  const rows = await sql`
    SELECT id, name, duration, route, summary, price_idr as "priceIdr", highlights, is_active as "isActive" 
    FROM packages 
    ORDER BY price_idr ASC;
  `;
  console.log("Total packages in DB:", rows.length);
  console.log(JSON.stringify(rows, null, 2));
}

run().catch(console.error);

