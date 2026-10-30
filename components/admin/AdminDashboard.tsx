"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { formatIdr } from "@/lib/data";
import { handleSignOut } from "@/app/actions/auth";
import type { AuthUser } from "@/lib/auth-helpers";
import { formatAdminToCustomerMessage } from "@/lib/whatsapp";
import { filterBookingsForExport, exportBookingsToExcel, type ExportDateRange } from "@/lib/export-excel";
import type { DbPackage } from "@/lib/packages";

interface BookingItem {
  id: number;
  bookingCode: string;
  packageId: string;
  packageName?: string;
  packageDuration?: string;
  packageRoute?: string;
  departureDate: string;
  participantsCount: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  nationality: string;
  notes?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  cancellationReason?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  googleUserName?: string | null;
  googleUserEmail?: string | null;
}

interface StatsData {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalClimbers: number;
  confirmedRevenue: number;
  potentialRevenue: number;
}

interface AdminDashboardProps {
  adminUser: AuthUser;
}

export default function AdminDashboard({ adminUser }: AdminDashboardProps) {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // State Tab Navigasi Admin
  const [activeTab, setActiveTab] = useState<"bookings" | "packages">("bookings");
  const [packagesList, setPackagesList] = useState<DbPackage[]>([]);
  const [editingPackage, setEditingPackage] = useState<DbPackage | null>(null);
  const [packageSaveLoading, setPackageSaveLoading] = useState(false);
  const [editHighlightsText, setEditHighlightsText] = useState("");

  // State Export Excel
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportRange, setExportRange] = useState<ExportDateRange>("30days");
  const [exportStatus, setExportStatus] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, statsRes, packagesRes] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/admin/stats"),
        fetch("/api/admin/packages"),
      ]);

      if (bookingsRes.ok) {
        const bData = await bookingsRes.json();
        setBookings(bData.bookings || []);
      }
      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData.stats || null);
      }
      if (packagesRes.ok) {
        const pData = await packagesRes.json();
        setPackagesList(pData.packages || []);
      }
    } catch (err) {
      console.error("Gagal mengambil data admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdateStatus = async (
    id: number,
    newStatus: "PENDING" | "CONFIRMED" | "CANCELLED",
    reason?: string
  ) => {
    let cancellationReason = reason;
    if (newStatus === "CANCELLED" && !cancellationReason) {
      const inputReason = prompt("Masukkan alasan pembatalan reservasi:", "Kuota pendakian TNGR penuh");
      if (inputReason === null) return; // Dibatalkan oleh admin
      cancellationReason = inputReason || "Dibatalkan oleh pengelola";
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          cancellationReason: newStatus === "CANCELLED" ? cancellationReason : undefined,
        }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: newStatus,
                  cancellationReason: newStatus === "CANCELLED" ? cancellationReason : b.cancellationReason,
                }
              : b
          )
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({
            ...selectedBooking,
            status: newStatus,
            cancellationReason: newStatus === "CANCELLED" ? cancellationReason : selectedBooking.cancellationReason,
          });
        }
        showToast(`Status booking #${id} berhasil diubah ke ${newStatus}`);
        fetch("/api/admin/stats")
          .then((r) => r.json())
          .then((d) => setStats(d.stats))
          .catch(() => null);
      } else {
        alert("Gagal memperbarui status.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBooking = async (id: number, code: string) => {
    if (!confirm(`Arsipkan data reservasi ${code}? Data akan disembunyikan (soft delete).`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        if (selectedBooking?.id === id) setSelectedBooking(null);
        showToast(`Booking ${code} berhasil diarsipkan.`);
        fetch("/api/admin/stats")
          .then((r) => r.json())
          .then((d) => setStats(d.stats))
          .catch(() => null);
      } else {
        alert("Gagal mengarsipkan booking.");
      }
    } catch (err) {
      console.error(err);
      alert("Kesalahan saat menghapus data.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartEditPackage = (pkg: DbPackage) => {
    setEditingPackage({ ...pkg });
    setEditHighlightsText(pkg.highlights.join("\n"));
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    setPackageSaveLoading(true);
    try {
      const highlightsArray = editHighlightsText
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean);

      const payload = {
        name: editingPackage.name.trim(),
        duration: editingPackage.duration.trim(),
        route: editingPackage.route.trim(),
        summary: editingPackage.summary.trim(),
        priceIdr: Number(editingPackage.priceIdr),
        highlights: highlightsArray.length > 0 ? highlightsArray : ["Pemandu & porter resmi"],
        isActive: editingPackage.isActive,
      };

      const res = await fetch(`/api/admin/packages/${editingPackage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal memperbarui paket");
        setPackageSaveLoading(false);
        return;
      }

      setPackagesList((prev) =>
        prev.map((p) => (p.id === editingPackage.id ? { ...p, ...payload } : p))
      );
      showToast(`Paket "${editingPackage.name}" berhasil diperbarui!`);
      setEditingPackage(null);
    } catch {
      alert("Terjadi kesalahan jaringan saat menyimpan perubahan paket");
    } finally {
      setPackageSaveLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const matchesStatus = filterStatus === "ALL" || item.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.bookingCode.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.customerWhatsapp.includes(q) ||
        item.customerEmail.toLowerCase().includes(q) ||
        (item.googleUserEmail && item.googleUserEmail.toLowerCase().includes(q)) ||
        (item.packageName && item.packageName.toLowerCase().includes(q));

      return matchesStatus && matchesQuery;
    });
  }, [bookings, filterStatus, searchQuery]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage, ITEMS_PER_PAGE]);

  // Preview data export yang cocok dengan filter rentang
  const exportFiltered = useMemo(() => {
    return filterBookingsForExport(
      bookings,
      exportRange,
      exportStatus,
      customStart,
      customEnd
    );
  }, [bookings, exportRange, exportStatus, customStart, customEnd]);

  const exportTotalAmount = useMemo(() => {
    return exportFiltered.reduce((sum, b) => sum + b.totalPrice, 0);
  }, [exportFiltered]);

  const handleTriggerExport = () => {
    let label = "Semua-Waktu";
    if (exportRange === "today") label = "Hari-Ini";
    else if (exportRange === "7days") label = "7-Hari-Terakhir";
    else if (exportRange === "30days") label = "30-Hari-Terakhir";
    else if (exportRange === "year") label = "Tahun-Ini";
    else if (exportRange === "custom")
      label = `${customStart || "awal"}_sd_${customEnd || "akhir"}`;

    const ok = exportBookingsToExcel(exportFiltered, label);
    if (ok) {
      showToast(`Sukses mengekspor ${exportFiltered.length} data ke file Excel!`);
      setShowExportModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-batu-kawah px-4 py-3 text-xs font-medium text-white shadow-lg border border-border">
          {notification}
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg font-semibold tracking-tight text-fg">
                  Panel Operasional Rinjani Trek
                </h1>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-danau/10 text-danau uppercase">
                  Role: Admin
                </span>
              </div>
              <p className="text-xs text-fg-muted">
                Masuk sebagai <span className="font-medium text-fg">{adminUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-fg hover:border-danau hover:text-danau hover:bg-danau/5 transition flex items-center gap-1.5 shadow-xs"
              title="Kembali ke halaman utama website"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Ke Website</span>
            </Link>

            <Link
              href="/akun"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-fg-muted hover:text-fg hover:bg-bg-subtle transition hidden sm:inline-flex"
              title="Ke halaman Akun Saya"
            >
              Akun Saya
            </Link>

            <button
              onClick={() => setShowExportModal(true)}
              className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Export Laporan Reservasi ke File Excel"
            >
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export Excel</span>
            </button>

            <button
              onClick={fetchData}
              disabled={loading}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-fg hover:bg-bg-subtle transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? "Sinkronisasi..." : "Perbarui Data"}
            </button>

            <form action={handleSignOut}>
              <button
                type="submit"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-fg-muted hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition cursor-pointer"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Tab Switcher: Data Reservasi vs Kelola Paket */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === "bookings"
                ? "bg-danau text-white shadow-xs"
                : "bg-white border border-border text-fg-muted hover:text-fg hover:bg-bg-subtle"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Daftar Reservasi Booking</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "bookings" ? "bg-white/20 text-white" : "bg-bg-subtle text-fg-muted"
              }`}
            >
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("packages")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === "packages"
                ? "bg-danau text-white shadow-xs"
                : "bg-white border border-border text-fg-muted hover:text-fg hover:bg-bg-subtle"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Kelola Paket Pendakian & Harga</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "packages" ? "bg-white/20 text-white" : "bg-bg-subtle text-fg-muted"
              }`}
            >
              {packagesList.length}
            </span>
          </button>
        </div>

        {activeTab === "bookings" && (
          <>
            {/* Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
            <p className="text-xs font-medium text-fg-muted">Total Reservasi Aktif</p>
            <p className="mt-2 text-2xl font-bold font-display text-fg">
              {stats?.totalBookings ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-fg-muted">
              {stats?.totalClimbers ?? 0} total pendaki terdaftar
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-5 shadow-xs">
            <p className="text-xs font-medium text-amber-800">Menunggu Verifikasi</p>
            <p className="mt-2 text-2xl font-bold font-display text-amber-700">
              {stats?.pendingBookings ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-amber-600">
              Perlu dicek ketersediaan kuota e-Rinjani
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-xs">
            <p className="text-xs font-medium text-emerald-800">Terkonfirmasi (Lolos)</p>
            <p className="mt-2 text-2xl font-bold font-display text-emerald-700">
              {stats?.confirmedBookings ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-emerald-600">
              Jadwal & tiket TNGR siap diproses
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
            <p className="text-xs font-medium text-fg-muted">Nilai Terkonfirmasi</p>
            <p className="mt-2 text-2xl font-bold font-display text-danau">
              {formatIdr(stats?.confirmedRevenue ?? 0)}
            </p>
            <p className="mt-1 text-[11px] text-fg-muted">
              Potensi total: {formatIdr(stats?.potentialRevenue ?? 0)}
            </p>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "ALL", label: "Semua", count: bookings.length },
              {
                id: "PENDING",
                label: "Menunggu",
                count: bookings.filter((b) => b.status === "PENDING").length,
              },
              {
                id: "CONFIRMED",
                label: "Terkonfirmasi",
                count: bookings.filter((b) => b.status === "CONFIRMED").length,
              },
              {
                id: "CANCELLED",
                label: "Batal",
                count: bookings.filter((b) => b.status === "CANCELLED").length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  filterStatus === tab.id
                    ? "bg-danau text-white"
                    : "bg-white text-fg-muted hover:text-fg border border-border"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    filterStatus === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-bg-subtle text-fg-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <input
              type="text"
              placeholder="Cari kode, nama, email Google, WhatsApp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-1.5 pl-8 text-xs outline-none focus:border-danau focus:ring-1 focus:ring-danau"
            />
            <svg
              className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-fg-muted pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-xs text-fg-muted hover:text-fg cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tabel Data Reservasi */}
        <div className="rounded-xl border border-border bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-bg-subtle text-fg-muted font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Kode Booking</th>
                  <th className="py-3.5 px-4">Pemesan</th>
                  <th className="py-3.5 px-4">Akun Google</th>
                  <th className="py-3.5 px-4">Paket & Jadwal</th>
                  <th className="py-3.5 px-4 text-center">Peserta</th>
                  <th className="py-3.5 px-4">Total Biaya</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-fg-muted">
                      {searchQuery
                        ? "Tidak ada data reservasi yang cocok dengan pencarian Anda."
                        : "Belum ada data reservasi aktif."}
                    </td>
                  </tr>
                ) : (
                  paginatedBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-bg-subtle/50 transition cursor-pointer"
                      onClick={() => setSelectedBooking(b)}
                    >
                      {/* Kode */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-semibold text-danau block">
                          {b.bookingCode}
                        </span>
                        <span className="text-[10px] text-fg-muted">
                          {new Date(b.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Pemesan */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-fg block">
                          {b.customerName}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-fg-muted">
                          <span>{b.customerWhatsapp}</span>
                          <span>•</span>
                          <span className="uppercase text-[10px] bg-bg-subtle px-1.5 py-0.5 rounded border border-border">
                            {b.nationality}
                          </span>
                        </div>
                      </td>

                      {/* Akun Google Terhubung */}
                      <td className="py-3.5 px-4">
                        <span className="text-fg font-medium block truncate max-w-[150px]">
                          {b.googleUserEmail || b.customerEmail}
                        </span>
                        {b.googleUserName && (
                          <span className="text-[10px] text-fg-muted block truncate max-w-[150px]">
                            {b.googleUserName}
                          </span>
                        )}
                      </td>

                      {/* Paket & Jadwal */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-fg block">
                          {b.packageName || b.packageId}
                        </span>
                        <span className="text-[11px] text-danau">
                          Berangkat: {b.departureDate}
                        </span>
                      </td>

                      {/* Peserta */}
                      <td className="py-3.5 px-4 text-center font-medium">
                        {b.participantsCount} org
                      </td>

                      {/* Total Biaya */}
                      <td className="py-3.5 px-4 font-semibold text-fg">
                        {formatIdr(b.totalPrice)}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-start gap-1">
                          <select
                            value={b.status}
                            disabled={actionLoading}
                            onChange={(e) =>
                              handleUpdateStatus(
                                b.id,
                                e.target.value as "PENDING" | "CONFIRMED" | "CANCELLED"
                              )
                            }
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold border outline-none cursor-pointer transition ${
                              b.status === "CONFIRMED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : b.status === "CANCELLED"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            <option value="PENDING">Menunggu</option>
                            <option value="CONFIRMED">Terkonfirmasi</option>
                            <option value="CANCELLED">Batal</option>
                          </select>
                          {b.status === "CANCELLED" && b.cancellationReason && (
                            <span
                              className="text-[10px] text-red-600 max-w-[130px] truncate block font-normal"
                              title={`Alasan: ${b.cancellationReason}`}
                            >
                              Alasan: {b.cancellationReason}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${b.customerWhatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              formatAdminToCustomerMessage(
                                {
                                  bookingCode: b.bookingCode,
                                  packageName: b.packageName || b.packageId,
                                  departureDate: b.departureDate,
                                  participantsCount: b.participantsCount,
                                  nationality: b.nationality,
                                  customerName: b.customerName,
                                  customerWhatsapp: b.customerWhatsapp,
                                  customerEmail: b.customerEmail,
                                  totalPrice: b.totalPrice,
                                  notes: b.notes,
                                },
                                b.status
                              )
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Hubungi via WhatsApp"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                            </svg>
                          </a>

                          <button
                            onClick={() => handleDeleteBooking(b.id, b.bookingCode)}
                            className="p-1.5 text-fg-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Arsipkan (soft delete)"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredBookings.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border px-4 py-3 bg-white text-xs text-fg-muted gap-3">
              <div className="flex items-center gap-2">
                <span>
                  Menampilkan{" "}
                  <strong className="text-fg">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </strong>{" "}
                  –{" "}
                  <strong className="text-fg">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)}
                  </strong>{" "}
                  dari <strong className="text-fg">{filteredBookings.length}</strong> reservasi
                </span>
                {totalPages > 1 && (
                  <>
                    <span className="text-border">|</span>
                    <span>
                      Halaman {currentPage} dari {totalPages} (maks. 20 baris/halaman)
                    </span>
                  </>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-fg hover:bg-bg-subtle disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    ← Sebelumnya
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === totalPages ||
                          Math.abs(p - currentPage) <= 1
                      )
                      .map((pageNum, idx, arr) => {
                        const prev = arr[idx - 1];
                        return (
                          <div key={pageNum} className="flex items-center">
                            {prev && pageNum - prev > 1 && (
                              <span className="px-1 text-fg-muted">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(pageNum)}
                              className={`min-w-[28px] h-7 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                currentPage === pageNum
                                  ? "bg-danau text-white"
                                  : "border border-border text-fg hover:bg-bg-subtle"
                              }`}
                            >
                              {pageNum}
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-fg hover:bg-bg-subtle disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    Berikutnya →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        </>
        )}

        {/* Tab 2: Manajemen Paket Pendakian & Harga */}
        {activeTab === "packages" && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border shadow-xs">
              <div>
                <h2 className="font-display text-xl font-semibold text-fg">
                  Katalog Paket & Tarif Pendakian
                </h2>
                <p className="text-xs text-fg-muted mt-0.5">
                  Ubah tarif dasar per peserta, durasi, rute, atau fasilitas. Perubahan harga di sini otomatis terupdate di website.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium">
                  ✓ Database Real-Time Aktif
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packagesList.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                      <span className="font-mono text-[11px] font-semibold text-danau bg-danau/10 px-2 py-0.5 rounded">
                        {pkg.id}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          pkg.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {pkg.isActive ? "Aktif di Web" : "Dinonaktifkan"}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold text-fg">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-fg-muted mt-0.5 font-medium">
                        {pkg.duration} · {pkg.route}
                      </p>
                    </div>

                    <div className="rounded-xl bg-bg-subtle/80 p-3.5 border border-border">
                      <p className="text-[10px] uppercase font-semibold text-fg-muted">
                        Tarif per Peserta
                      </p>
                      <p className="font-display text-2xl font-bold text-emerald-700 mt-0.5">
                        {formatIdr(pkg.priceIdr)}
                      </p>
                    </div>

                    <p className="text-xs text-fg-muted leading-relaxed line-clamp-3">
                      {pkg.summary}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-border">
                      <p className="text-[11px] font-semibold text-fg">Fasilitas Termasuk:</p>
                      <ul className="space-y-1 text-xs text-fg-muted">
                        {pkg.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-danau">•</span>
                            <span className="line-clamp-1">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-bg-subtle border-t border-border">
                    <button
                      onClick={() => handleStartEditPackage(pkg)}
                      className="w-full rounded-xl bg-white border border-border hover:border-danau hover:text-danau py-2.5 px-4 text-xs font-semibold text-fg transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Ubah Harga & Informasi Paket</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Modal Rincian Booking */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-danau bg-danau/10 px-2 py-0.5 rounded">
                    Rincian Reservasi
                  </span>
                  <h3 className="font-display text-lg font-semibold text-fg mt-1">
                    Kode: {selectedBooking.bookingCode}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-lg p-1.5 text-fg-muted hover:bg-bg-subtle transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-fg-muted">Nama Kontak</p>
                  <p className="font-semibold text-fg">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-fg-muted">Kewarganegaraan</p>
                  <p className="font-semibold text-fg">{selectedBooking.nationality}</p>
                </div>
                <div>
                  <p className="text-fg-muted">Nomor WhatsApp</p>
                  <p className="font-semibold text-fg">{selectedBooking.customerWhatsapp}</p>
                </div>
                <div>
                  <p className="text-fg-muted">Akun Google Pemesan</p>
                  <p className="font-semibold text-fg truncate">
                    {selectedBooking.googleUserEmail || selectedBooking.customerEmail}
                  </p>
                </div>
                <div>
                  <p className="text-fg-muted">Paket Pendakian</p>
                  <p className="font-semibold text-fg">{selectedBooking.packageName}</p>
                </div>
                <div>
                  <p className="text-fg-muted">Jadwal Keberangkatan</p>
                  <p className="font-semibold text-danau">{selectedBooking.departureDate}</p>
                </div>
                <div>
                  <p className="text-fg-muted">Jumlah Peserta</p>
                  <p className="font-semibold text-fg">{selectedBooking.participantsCount} Orang</p>
                </div>
                <div>
                  <p className="text-fg-muted">Total Pembayaran</p>
                  <p className="font-semibold text-danau text-sm">
                    {formatIdr(selectedBooking.totalPrice)}
                  </p>
                </div>
              </div>

              {selectedBooking.status === "CANCELLED" && (
                <div className="rounded-xl bg-red-50/80 border border-red-200 p-4 text-xs text-red-900 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-red-700">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Reservasi Ini Telah Dibatalkan</span>
                  </div>
                  <p className="text-red-800 leading-relaxed">
                    <strong>Alasan Pembatalan:</strong>{" "}
                    <span className="italic">
                      "{selectedBooking.cancellationReason || "Tidak ada rincian alasan"}"
                    </span>
                  </p>
                  {selectedBooking.cancelledAt && (
                    <p className="text-[10px] text-red-600/80">
                      Waktu pembatalan: {new Date(selectedBooking.cancelledAt).toLocaleString("id-ID")}
                    </p>
                  )}
                </div>
              )}

              {selectedBooking.notes && (
                <div className="rounded-lg bg-bg-subtle p-3 text-xs border border-border">
                  <p className="text-fg-muted font-medium mb-1">Catatan Tambahan:</p>
                  <p className="text-fg">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Status Update */}
              <div className="border-t border-border pt-4">
                <p className="text-xs font-medium text-fg-muted mb-2">Ubah Status Reservasi:</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, "PENDING")}
                    disabled={actionLoading || selectedBooking.status === "PENDING"}
                    className="flex-1 rounded-lg border border-amber-300 bg-amber-50 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-40 transition cursor-pointer"
                  >
                    Menunggu
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, "CONFIRMED")}
                    disabled={actionLoading || selectedBooking.status === "CONFIRMED"}
                    className="flex-1 rounded-lg border border-emerald-300 bg-emerald-50 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-40 transition cursor-pointer"
                  >
                    Konfirmasi Kuota
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, "CANCELLED")}
                    disabled={actionLoading || selectedBooking.status === "CANCELLED"}
                    className="flex-1 rounded-lg border border-red-300 bg-red-50 py-2 text-xs font-semibold text-red-800 hover:bg-red-100 disabled:opacity-40 transition cursor-pointer"
                  >
                    Batalkan
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${selectedBooking.customerWhatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    formatAdminToCustomerMessage(
                      {
                        bookingCode: selectedBooking.bookingCode,
                        packageName: selectedBooking.packageName || selectedBooking.packageId,
                        departureDate: selectedBooking.departureDate,
                        participantsCount: selectedBooking.participantsCount,
                        nationality: selectedBooking.nationality,
                        customerName: selectedBooking.customerName,
                        customerWhatsapp: selectedBooking.customerWhatsapp,
                        customerEmail: selectedBooking.customerEmail,
                        totalPrice: selectedBooking.totalPrice,
                        notes: selectedBooking.notes,
                      },
                      selectedBooking.status
                    )
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-emerald-700 transition"
                >
                  Kirim Format Konfirmasi WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Modal Export Excel */}
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
              {/* Header Modal */}
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-fg">
                      Export Data ke Excel (.xlsx)
                    </h3>
                    <p className="text-xs text-fg-muted">
                      Unduh rekapitulasi data pemesanan pendakian resmi.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="rounded-lg p-1.5 text-fg-muted hover:bg-bg-subtle transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Filter Rentang Waktu */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-fg mb-2">
                    Pilih Periode Waktu:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "today", label: "Hari Ini" },
                      { id: "7days", label: "7 Hari (Seminggu)" },
                      { id: "30days", label: "30 Hari (Sebulan)" },
                      { id: "year", label: "Tahun Ini (1 Tahun)" },
                      { id: "all", label: "Semua Waktu" },
                      { id: "custom", label: "Kustom Tanggal" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setExportRange(item.id as ExportDateRange)}
                        className={`p-2.5 rounded-lg border text-left font-medium transition cursor-pointer ${
                          exportRange === item.id
                            ? "border-danau bg-danau/10 text-danau font-semibold shadow-xs"
                            : "border-border text-fg-muted hover:bg-bg-subtle"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              exportRange === item.id ? "bg-danau" : "bg-transparent border border-fg-muted"
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Kustom Tanggal jika dipilih */}
                {exportRange === "custom" && (
                  <div className="rounded-xl border border-border bg-bg-subtle/60 p-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-fg-muted mb-1">
                        Dari Tanggal:
                      </label>
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-fg focus:border-danau focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-fg-muted mb-1">
                        Sampai Tanggal:
                      </label>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-fg focus:border-danau focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Filter Status Reservasi */}
                <div>
                  <label className="block font-semibold text-fg mb-1.5">
                    Filter Status Reservasi:
                  </label>
                  <select
                    value={exportStatus}
                    onChange={(e) =>
                      setExportStatus(e.target.value as "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED")
                    }
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-fg focus:border-danau focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">Semua Status (Menunggu, Terkonfirmasi, Batal)</option>
                    <option value="CONFIRMED">Hanya Terkonfirmasi (Lolos Kuota TNGR)</option>
                    <option value="PENDING">Hanya Menunggu Verifikasi</option>
                    <option value="CANCELLED">Hanya yang Dibatalkan</option>
                  </select>
                </div>

                {/* Kotak Preview Ringkasan */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-900 font-medium">Data Siap Diexport:</span>
                    <span className="font-bold text-emerald-800 text-sm">
                      {exportFiltered.length} Reservasi
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-800/80 pt-1 border-t border-emerald-200/60">
                    <span>Total Estimasi Omset Periode Ini:</span>
                    <span className="font-semibold">{formatIdr(exportTotalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-fg-muted hover:bg-bg-subtle transition cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleTriggerExport}
                  disabled={exportFiltered.length === 0}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Excel (.xlsx)</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal Edit Paket */}
        {editingPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-danau bg-danau/10 px-2 py-0.5 rounded">
                    Edit Paket ID: {editingPackage.id}
                  </span>
                  <h3 className="font-display text-lg font-bold text-fg mt-1">
                    Ubah Paket & Tarif Pendakian
                  </h3>
                </div>
                <button
                  onClick={() => setEditingPackage(null)}
                  disabled={packageSaveLoading}
                  className="rounded-lg p-1 text-fg-muted hover:bg-bg-subtle transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-fg mb-1">Nama Paket:</label>
                  <input
                    type="text"
                    required
                    value={editingPackage.name}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-fg focus:border-danau focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-fg mb-1">
                      Tarif per Peserta (IDR):
                    </label>
                    <input
                      type="number"
                      required
                      min={100000}
                      step={50000}
                      value={editingPackage.priceIdr}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          priceIdr: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-fg font-semibold focus:border-danau focus:outline-none"
                    />
                    <p className="text-[11px] text-emerald-700 font-bold mt-1">
                      = {formatIdr(editingPackage.priceIdr || 0)}
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-fg mb-1">Durasi Paket:</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 3 hari 2 malam"
                      value={editingPackage.duration}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, duration: e.target.value })
                      }
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-fg focus:border-danau focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-fg mb-1">Rute Perjalanan:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sembalun → Puncak → Senaru"
                    value={editingPackage.route}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, route: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-fg focus:border-danau focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-fg mb-1">
                    Deskripsi Ringkas (Summary):
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingPackage.summary}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, summary: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-fg focus:border-danau focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <label className="block font-semibold text-fg">
                      Fasilitas Termasuk (Highlights):
                    </label>
                    <span className="text-[10px] text-fg-muted">1 fasilitas per baris</span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={editHighlightsText}
                    onChange={(e) => setEditHighlightsText(e.target.value)}
                    placeholder="Tenda dome tahan badai&#10;Koki & 3x makan sehari&#10;Tiket resmi e-Rinjani TNGR"
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-fg focus:border-danau focus:outline-none font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingPackage.isActive}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, isActive: e.target.checked })
                    }
                    className="rounded text-danau focus:ring-danau"
                  />
                  <label htmlFor="isActive" className="text-xs font-medium text-fg cursor-pointer">
                    Aktifkan dan tampilkan paket ini untuk dipesan di website
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingPackage(null)}
                    disabled={packageSaveLoading}
                    className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-fg-muted hover:bg-bg-subtle transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={packageSaveLoading}
                    className="rounded-lg bg-danau px-4 py-2 text-xs font-semibold text-white hover:bg-danau/90 disabled:opacity-50 transition shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    {packageSaveLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <span>Simpan Perubahan Paket</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
