import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { requirePageUser } from "@/lib/auth-helpers";
import { sql } from "@/lib/db";
import { handleSignOut } from "@/app/actions/auth";
import AccountBookingsTable, { type AccountBookingItem } from "@/components/account/AccountBookingsTable";

export const metadata: Metadata = {
  title: "Akun Saya | Rinjani Trek",
  description: "Daftar riwayat reservasi dan status pengajuan pendakian Gunung Rinjani Anda.",
  robots: {
    index: false,
    follow: false,
  },
};

interface BookingQueryRow {
  id: number;
  bookingCode: string;
  departureDate: string | Date;
  participantsCount: number;
  totalPrice: number | string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  cancellationReason?: string | null;
  cancelledAt?: string | Date | null;
  createdAt: string | Date;
  packageName?: string | null;
  packageDuration?: string | null;
  packageRoute?: string | null;
}

export default async function AkunPage() {
  const user = await requirePageUser("/akun");

  // Ambil daftar booking milik pengguna yang aktif (tidak di-soft-delete)
  const rows = (await sql`
    SELECT 
      b.id,
      b.booking_code as "bookingCode",
      b.departure_date as "departureDate",
      b.participants_count as "participantsCount",
      b.total_price as "totalPrice",
      b.status,
      b.cancellation_reason as "cancellationReason",
      b.cancelled_at as "cancelledAt",
      b.created_at as "createdAt",
      p.name as "packageName",
      p.duration as "packageDuration",
      p.route as "packageRoute"
    FROM bookings b
    LEFT JOIN packages p ON b.package_id = p.id
    WHERE b.user_id = ${user.id}::uuid
      AND b.deleted_at IS NULL
    ORDER BY b.created_at DESC;
  `) as unknown as BookingQueryRow[];

  const formattedBookings: AccountBookingItem[] = rows.map((b) => ({
    id: b.id,
    bookingCode: b.bookingCode,
    departureDate:
      typeof b.departureDate === "string"
        ? b.departureDate
        : (b.departureDate as Date)?.toISOString().slice(0, 10),
    participantsCount: b.participantsCount,
    totalPrice: Number(b.totalPrice),
    status: b.status,
    cancellationReason: b.cancellationReason || null,
    cancelledAt: b.cancelledAt ? new Date(b.cancelledAt).toISOString() : null,
    createdAt:
      typeof b.createdAt === "string"
        ? b.createdAt
        : (b.createdAt as Date)?.toISOString(),
    packageName: b.packageName || null,
    packageDuration: b.packageDuration || null,
    packageRoute: b.packageRoute || null,
  }));

  return (
    <main className="min-h-screen bg-bg pt-28 pb-20 px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header Profil Pengguna */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "Foto profil"}
                width={56}
                height={56}
                className="rounded-full object-cover border border-border shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-danau text-white text-lg font-bold flex items-center justify-center">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-semibold text-fg">
                  {user.name || "Pendaki"}
                </h1>
                {user.role === "admin" && (
                  <span className="text-[10px] font-semibold bg-danau/10 text-danau px-2 py-0.5 rounded uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-fg-muted mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="flex-1 sm:flex-none text-center rounded-lg bg-danau/10 text-danau px-4 py-2 text-xs font-semibold hover:bg-danau/20 transition"
              >
                Panel Operasional
              </Link>
            )}
            <form action={handleSignOut} className="flex-1 sm:flex-none">
              <button
                type="submit"
                className="w-full text-center rounded-lg border border-border px-4 py-2 text-xs font-medium text-fg-muted hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition cursor-pointer"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>

        {/* Bagian Riwayat Reservasi */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-fg">
                Riwayat Pengajuan Reservasi
              </h2>
              <p className="text-xs text-fg-muted">
                Daftar pengajuan tiket dan paket ekspedisi Gunung Rinjani Anda.
              </p>
            </div>
            <Link
              href="/booking"
              className="text-xs font-semibold text-danau hover:underline"
            >
              + Buat Reservasi Baru
            </Link>
          </div>

          <AccountBookingsTable initialBookings={formattedBookings} />
        </div>
      </div>
    </main>
  );
}
