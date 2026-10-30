import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/layout/PageHeader";
import BookingView from "@/components/booking/BookingView";
import { requirePageUser } from "@/lib/auth-helpers";
import { getActivePackages } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Pesan Pendakian Gunung Rinjani: Paket Resmi & Verifikasi Kuota",
  description:
    "Formulir reservasi trip pendakian resmi Gunung Rinjani dengan pemandu berlisensi dan simaksi e-Rinjani TNGR. Pilih paket 2D1N, 3D2N, atau 4D3N.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ paket?: string }>;
}) {
  const { paket } = await searchParams;
  const returnUrl = paket ? `/booking?paket=${encodeURIComponent(paket)}` : "/booking";
  const user = await requirePageUser(returnUrl);
  const activePackages = await getActivePackages();

  return (
    <main className="min-h-screen bg-bg-subtle/30 pb-24">
      <PageHeader
        eyebrow="Reservasi Ekspedisi Terkelola"
        judul="Pemesanan Tiket & Trip Pendakian Rinjani"
        deskripsi="Pilih rute ekspedisi, tanggal pendakian, dan isi data anggota tim Anda. Kami akan memverifikasi ketersediaan kuota harian di aplikasi e-Rinjani Balai TNGR."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Pemesanan Trip" },
        ]}
      />

      <div className="mx-auto max-w-6xl px-6 pt-12">
        <Suspense
          fallback={
            <div className="p-12 text-center text-sm text-fg-muted bg-white rounded-lg border border-border">
              Memuat formulir pemesanan...
            </div>
          }
        >
          <BookingView
            user={{ name: user.name, email: user.email }}
            availablePackages={activePackages}
          />
        </Suspense>
      </div>
    </main>
  );
}
