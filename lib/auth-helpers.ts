import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export type AuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "user" | "admin";
};

/**
 * Helper untuk Server Components / Halaman
 * Jika belum login, otomatis redirect ke /masuk?next=...
 */
export async function requirePageUser(returnUrl?: string): Promise<AuthUser> {
  const session = await auth();
  if (!session?.user?.id) {
    const nextParam = returnUrl ? `?next=${encodeURIComponent(returnUrl)}` : "";
    redirect(`/masuk${nextParam}`);
  }
  return session.user as AuthUser;
}

/**
 * Helper untuk Server Components / Halaman Admin
 * Jika belum login -> /masuk, jika bukan admin -> redirect ke /
 */
export async function requirePageAdmin(): Promise<AuthUser> {
  const user = await requirePageUser("/admin");
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .toLowerCase()
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const isAdmin =
    user.role === "admin" ||
    (user.email && adminEmails.includes(user.email.toLowerCase()));

  if (!isAdmin) {
    redirect("/");
  }
  return { ...user, role: "admin" };
}

/**
 * Helper untuk Route Handlers (API)
 * Mengembalikan objek user atau NextResponse dengan HTTP status error
 */
export async function getApiAuth(): Promise<{ user: AuthUser | null; errorResponse: NextResponse | null }> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Autentikasi diperlukan. Silakan masuk terlebih dahulu." },
        { status: 401 }
      ),
    };
  }
  return {
    user: session.user as AuthUser,
    errorResponse: null,
  };
}

export async function getApiAdminAuth(): Promise<{ user: AuthUser | null; errorResponse: NextResponse | null }> {
  const { user, errorResponse } = await getApiAuth();
  if (errorResponse) return { user: null, errorResponse };

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .toLowerCase()
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const isAdmin =
    user?.role === "admin" ||
    (user?.email && adminEmails.includes(user.email.toLowerCase()));

  if (!isAdmin) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Akses ditolak. Endpoint ini hanya untuk administrator." },
        { status: 403 }
      ),
    };
  }

  return { user: { ...user!, role: "admin" }, errorResponse: null };
}

