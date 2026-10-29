"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "Karakter Gunung", href: "#karakter" },
  { label: "Jalur Pendakian", href: "#jalur" },
  { label: "Musim & Iklim", href: "#musim" },
  { label: "Paket Perjalanan", href: "#paket" },
  { label: "Persiapan", href: "#persiapan" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-border shadow-[0_1px_3px_rgba(0,0,0,0.04)] py-3"
          : "bg-gradient-to-b from-black/50 via-black/20 to-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        {/* Brand */}
        <a href="#" className="flex items-baseline gap-2">
          <span
            className={`font-display text-xl font-semibold tracking-tight transition-colors ${
              scrolled ? "text-fg" : "text-white"
            }`}
          >
            Rinjani Trek
          </span>
          <span
            className={`text-xs transition-colors hidden sm:inline ${
              scrolled ? "text-fg-faint" : "text-white/70"
            }`}
          >
            3.726 m dpl · Lombok
          </span>
        </a>

        {/* Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? "text-fg-muted hover:text-fg"
                  : "text-white/85 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#pemesanan"
            className={`text-sm font-medium px-4 py-2 rounded-md transition-all ${
              scrolled
                ? "bg-danau text-white hover:bg-danau-hover"
                : "bg-white text-fg hover:bg-white/90"
            }`}
          >
            Pesan pendakian
          </a>
        </nav>

        {/* Hamburger Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}
          className={`md:hidden p-2 rounded-md transition-colors ${
            scrolled ? "text-fg hover:bg-bg-subtle" : "text-white hover:bg-white/10"
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

      {/* Drawer Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-border px-6 py-4 shadow-lg">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-fg-muted hover:text-fg py-1"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-border mt-1">
              <a
                href="#pemesanan"
                onClick={() => setMenuOpen(false)}
                className="block text-center text-sm font-medium px-4 py-2.5 rounded-md bg-danau text-white hover:bg-danau-hover"
              >
                Pesan pendakian
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
