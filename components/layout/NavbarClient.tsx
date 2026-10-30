"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import { handleSignOut } from "@/app/actions/auth";

interface NavbarClientProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "user" | "admin";
  } | null;
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  const showWhiteNav = !isHome || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showWhiteNav
          ? "bg-white/95 backdrop-blur-md border-b border-border shadow-[0_1px_4px_rgba(0,0,0,0.03)] py-3"
          : "bg-gradient-to-b from-black/60 via-black/25 to-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        {/* Brand Identitas */}
        <Link href="/" className="flex items-baseline gap-2 group">
          <span
            className={`font-display text-xl font-semibold tracking-tight transition-colors ${
              showWhiteNav ? "text-fg" : "text-white"
            }`}
          >
            {SITE.nama}
          </span>
          <span
            className={`text-xs transition-colors hidden sm:inline ${
              showWhiteNav ? "text-fg-faint" : "text-white/75"
            }`}
          >
            {SITE.elevasiPuncak} · Lombok
          </span>
        </Link>

        {/* Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {SITE.nav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  showWhiteNav
                    ? isActive
                      ? "text-danau font-semibold"
                      : "text-fg-muted hover:text-fg"
                    : isActive
                    ? "text-white font-semibold"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${
                      showWhiteNav ? "bg-danau" : "bg-white"
                    }`}
                  />
                )}
              </Link>
            );
          })}

          {/* Akses Cepat Panel Admin jika login sebagai admin */}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors flex items-center gap-1.5 ${
                showWhiteNav
                  ? "border-danau/40 text-danau bg-danau/5 hover:bg-danau/10"
                  : "border-white/40 text-white bg-white/15 hover:bg-white/25"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Panel Admin
            </Link>
          )}

          {/* Autentikasi / Akun Profil */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-border/40 hover:border-border transition cursor-pointer"
                title={user.name || "Akun Saya"}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Foto profil"}
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-danau text-white text-xs font-semibold flex items-center justify-center">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </span>
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-white p-2 shadow-lg text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="font-semibold text-fg truncate">{user.name}</p>
                    <p className="text-[10px] text-fg-muted truncate">{user.email}</p>
                    {user.role === "admin" && (
                      <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-danau/10 text-danau uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                  <Link
                    href="/akun"
                    className="block px-3 py-2 rounded-lg text-fg hover:bg-bg-subtle transition"
                  >
                    Akun Saya
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 rounded-lg text-danau font-medium hover:bg-danau/10 transition"
                    >
                      Panel Operasional
                    </Link>
                  )}
                  <form action={handleSignOut} className="mt-1 pt-1 border-t border-border">
                    <button
                      type="submit"
                      className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer"
                    >
                      Keluar
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/masuk"
              className={`text-xs font-semibold px-3 py-2 rounded-md transition-all flex items-center gap-1.5 border ${
                showWhiteNav
                  ? "border-border bg-white text-fg hover:border-danau hover:text-danau shadow-xs"
                  : "border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              <span>Login</span>
            </Link>
          )}

          <Link
            href="/booking"
            className={`text-sm font-medium px-4 py-2 rounded-md transition-all shadow-xs ${
              showWhiteNav
                ? "bg-fajar text-white hover:bg-fajar-hover"
                : "bg-white text-fg hover:bg-white/90"
            }`}
          >
            Pesan pendakian
          </Link>
        </nav>

        {/* Tombol Hamburger Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}
          className={`md:hidden p-2 rounded-md transition-colors ${
            showWhiteNav ? "text-fg hover:bg-bg-subtle" : "text-white hover:bg-white/10"
          }`}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Drawer Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-border px-6 py-5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3">
            {SITE.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base py-1.5 transition-colors ${
                    isActive ? "text-danau font-semibold" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-border mt-1 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 py-1">
                    {user.image && (
                      <Image
                        src={user.image}
                        alt={user.name || "Profil"}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-fg truncate">{user.name}</span>
                  </div>
                  <Link
                    href="/akun"
                    className="text-sm py-1 text-fg-muted hover:text-fg"
                  >
                    Akun Saya
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="text-sm py-1 text-danau font-medium"
                    >
                      Panel Operasional
                    </Link>
                  )}
                  <form action={handleSignOut}>
                    <button
                      type="submit"
                      className="text-left text-sm py-1 text-red-600 cursor-pointer"
                    >
                      Keluar
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/masuk"
                  className="flex items-center justify-center gap-2 text-sm py-2 px-3 rounded-lg border border-border font-medium text-fg bg-bg-subtle hover:bg-white hover:border-danau transition-all"
                >
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
                  <span>Login / Masuk Google</span>
                </Link>
              )}

              <Link
                href="/booking"
                className="mt-2 block text-center text-sm font-medium px-4 py-2.5 rounded-md bg-fajar text-white hover:bg-fajar-hover transition-colors"
              >
                Pesan pendakian
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

