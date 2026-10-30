import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || "rinjani-dev-secret-key-32-chars-long!!",
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "select_account",
        },
      },
    }),
  ],
  pages: {
    signIn: "/masuk",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isProtected =
        pathname.startsWith("/booking") ||
        pathname.startsWith("/akun") ||
        pathname.startsWith("/admin");

      if (isProtected) {
        if (!isLoggedIn) return false;

        // Cek khusus halaman admin: jika bukan admin, alihkan ke beranda
        if (pathname.startsWith("/admin")) {
          const adminEmails = (process.env.ADMIN_EMAILS || "")
            .toLowerCase()
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean);
          const email = auth?.user?.email?.toLowerCase();
          const userRole = (auth.user as { role?: string })?.role;
          const isAdmin = userRole === "admin" || (email && adminEmails.includes(email));

          if (!isAdmin) {
            return Response.redirect(new URL("/", nextUrl));
          }
        }
      }

      return true;
    },
  },
};

