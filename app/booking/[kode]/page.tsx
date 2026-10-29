import type { Metadata } from "next";
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
  };
}

export default async function BookingConfirmPage({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;
  return (
    <main className="min-h-screen bg-bg-subtle/40 pt-20">
      <BookingConfirmClient kode={kode} />
    </main>
  );
}

