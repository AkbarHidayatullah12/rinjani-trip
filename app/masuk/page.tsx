import type { Metadata } from "next";
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Masuk | Rinjani Trek",
  description: "Masuk dengan akun Google untuk melanjutkan pemesanan dan melihat riwayat reservasi pendakian Rinjani.",
  robots: {
    index: false,
    follow: false,
  },
};

function getSafeRedirectUrl(nextParam?: string | null): string {
  if (!nextParam) return "/akun";
  if (
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//") &&
    !nextParam.startsWith("/\\") &&
    !nextParam.includes("://")
  ) {
    return nextParam;
  }
  return "/akun";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const session = await auth();
  const { next, error } = await searchParams;
  const safeNext = getSafeRedirectUrl(next);

  // Jika sudah login, langsung alihkan
  if (session?.user) {
    redirect(safeNext);
  }

  return (
    <main className="min-h-screen bg-bg">
      <PageHeader
        eyebrow="Autentikasi"
        judul="Masuk ke Rinjani Trek"
        deskripsi="Masuk agar data reservasi tersimpan di sistem resmi dan dapat dipantau kembali."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Masuk" },
        ]}
      />

      <section className="py-16 md:py-24 px-6">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 md:p-10 shadow-xs">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50/50 p-4 text-xs text-red-700">
              {error === "OAuthSignin" || error === "OAuthCallback"
                ? "Gagal menghubungkan akun Google. Silakan coba kembali."
                : error === "AccessDenied"
                ? "Akses ditolak. Pastikan email akun Google Anda sudah terverifikasi."
                : "Terjadi kendala saat proses masuk. Silakan ulangi."}
            </div>
          )}

          <div className="text-center space-y-2 mb-8">
            <h2 className="font-display text-xl font-semibold text-fg">
              Akses Portal Reservasi
            </h2>
            <p className="text-xs text-fg-muted leading-relaxed">
              Kami menggunakan akun Google untuk memverifikasi data identitas pendaki secara aman.
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: safeNext });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium text-fg shadow-xs hover:bg-bg-subtle hover:border-fg-muted/30 transition cursor-pointer"
            >
              {/* Google SVG Logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Lanjut dengan Google</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center text-[11px] text-fg-faint space-y-2">
            <p>
              Dengan masuk, Anda menyetujui{" "}
              <Link href="/syarat-ketentuan" className="underline hover:text-fg">
                Syarat & Ketentuan
              </Link>{" "}
              dan{" "}
              <Link href="/kebijakan-privasi" className="underline hover:text-fg">
                Kebijakan Privasi
              </Link>{" "}
              Rinjani Trek.
            </p>
            <p>Kami hanya meminta izin nama, email, dan foto profil publik.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

