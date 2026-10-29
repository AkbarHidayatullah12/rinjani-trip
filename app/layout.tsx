import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nama} | ${SITE.tagline}`,
    template: `%s | ${SITE.nama}`,
  },
  description: SITE.deskripsi,
  keywords: [
    "Gunung Rinjani",
    "pendakian Rinjani",
    "trekking Rinjani",
    "paket Rinjani",
    "Segara Anak",
    "Sembalun",
    "Senaru",
    "Torean",
  ],
  authors: [{ name: SITE.nama }],
  openGraph: {
    title: `${SITE.nama} | ${SITE.tagline}`,
    description: SITE.deskripsi,
    url: SITE.url,
    siteName: SITE.nama,
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-fg antialiased selection:bg-danau/15 selection:text-danau">
        <SmoothScroll />
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
