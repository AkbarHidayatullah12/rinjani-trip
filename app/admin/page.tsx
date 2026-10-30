import type { Metadata } from "next";
import { requirePageAdmin } from "@/lib/auth-helpers";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Panel Operasional & Reservasi | Rinjani Trek Admin",
  description: "Manajemen kuota, verifikasi reservasi pendaki, dan pemantauan transaksi Rinjani Trek.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const adminUser = await requirePageAdmin();
  return <AdminDashboard adminUser={adminUser} />;
}
