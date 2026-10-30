import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function check() {
  const users = await sql`SELECT id, email, name, role, last_login_at FROM users;`;
  console.log("Users in DB count:", users.length);
  console.log("Users list:", users);
}

check().catch(console.error);

