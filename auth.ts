import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { sql } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;

      // Wajib email terverifikasi oleh Google
      const isVerified = (profile as { email_verified?: boolean })?.email_verified;
      if (!isVerified) {
        console.warn("Login Google ditolak: Email belum terverifikasi");
        return false;
      }

      const googleSub = profile?.sub;
      const email = profile?.email?.toLowerCase();
      const name = profile?.name || null;
      const image = profile?.picture || null;

      if (!googleSub || !email) return false;

      // Cek apakah email terdaftar sebagai admin di env
      const adminEmails = (process.env.ADMIN_EMAILS || "")
        .toLowerCase()
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      const isAdminByEnv = adminEmails.includes(email);

      try {
        // Cek data user yang sudah ada
        const existingUsers = await sql`
          SELECT id, role FROM users WHERE google_sub = ${googleSub} LIMIT 1;
        `;

        if (existingUsers.length > 0) {
          const currentRole = existingUsers[0].role as "user" | "admin";
          const newRole = isAdminByEnv ? "admin" : currentRole;

          await sql`
            UPDATE users 
            SET email = ${email}, name = ${name}, image = ${image}, role = ${newRole}, last_login_at = NOW()
            WHERE google_sub = ${googleSub};
          `;
        } else {
          const initialRole = isAdminByEnv ? "admin" : "user";
          await sql`
            INSERT INTO users (google_sub, email, name, image, role, last_login_at)
            VALUES (${googleSub}, ${email}, ${name}, ${image}, ${initialRole}, NOW());
          `;
        }

        return true;
      } catch (err) {
        console.error("Gagal sinkronisasi data user Google ke database:", err);
        return false;
      }
    },

    async jwt({ token, account, profile }) {
      // Ambil id dan role dari database saat login pertama kali
      if (account && profile?.sub) {
        try {
          const users = await sql`
            SELECT id, role FROM users WHERE google_sub = ${profile.sub} LIMIT 1;
          `;
          if (users.length > 0) {
            token.id = users[0].id as string;
            token.role = users[0].role as "user" | "admin";
          }
        } catch (err) {
          console.error("Gagal membaca profil user untuk JWT:", err);
        }
      }

      // Pastikan jika role belum ada di token, kita coba ambil
      if (!token.role && token.id) {
        try {
          const users = await sql`
            SELECT role FROM users WHERE id = ${token.id}::uuid LIMIT 1;
          `;
          if (users.length > 0) {
            token.role = users[0].role as "user" | "admin";
          }
        } catch {
          // fallback
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        const adminEmails = (process.env.ADMIN_EMAILS || "")
          .toLowerCase()
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
        const isAdmin =
          token.role === "admin" ||
          (session.user.email && adminEmails.includes(session.user.email.toLowerCase()));
        session.user.role = isAdmin ? "admin" : "user";
      }
      return session;
    },
  },
});

