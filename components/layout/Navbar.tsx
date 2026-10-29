"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
        <nav className="hidden md:flex items-center gap-7">
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

          <Link
            href="/booking"
            className={`text-sm font-medium px-4 py-2 rounded-md transition-all shadow-sm ${
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
            <div className="pt-3 border-t border-border mt-1">
              <Link
                href="/booking"
                className="block text-center text-sm font-medium px-4 py-2.5 rounded-md bg-fajar text-white hover:bg-fajar-hover transition-colors"
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

