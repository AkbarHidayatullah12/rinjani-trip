import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { requirePageUser } from "@/lib/auth-helpers";
import BookingConfirmClient from "@/components/booking/BookingConfirmClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kode: string }>;
}): Promise<Metadata> {
  const { kode } = await params;
  return {
    title: `Konfirmasi Reservasi ${kode} | Rinjani Trek`,
    description: `Status pengajuan pendaftaran pendakian Rinjani dengan kode booking ${kode}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function BookingConfirmPage({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;
  const user = await requirePageUser(`/booking/${kode}`);

  // Verifikasi kepemilikan booking di server
  const rows = await sql`
    SELECT id, user_id as "userId" 
    FROM bookings 
    WHERE booking_code = ${kode} AND deleted_at IS NULL 
    LIMIT 1;
  `;

  if (rows.length === 0) {
    notFound();
  }

  const booking = rows[0];
  const isOwner = booking.userId === user.id;
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-bg-subtle/40 pt-20">
      <BookingConfirmClient kode={kode} />
    </main>
  );
}
