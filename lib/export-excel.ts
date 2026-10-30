import * as XLSX from "xlsx";

export type ExportDateRange = "today" | "7days" | "30days" | "year" | "all" | "custom";

export interface ExportBookingData {
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
  notes?: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  cancellationReason?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  googleUserName?: string | null;
  googleUserEmail?: string | null;
}

export function filterBookingsForExport(
  bookings: ExportBookingData[],
  range: ExportDateRange,
  statusFilter: "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED" = "ALL",
  customStart?: string,
  customEnd?: string
): ExportBookingData[] {
  const now = new Date();

  return bookings.filter((b) => {
    // 1. Filter Status
    if (statusFilter !== "ALL" && b.status !== statusFilter) {
      return false;
    }

    // 2. Filter Rentang Tanggal berdasarkan waktu booking dibuat (createdAt)
    const createdDate = new Date(b.createdAt);

    switch (range) {
      case "today": {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        return createdDate >= startOfToday;
      }
      case "7days": {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return createdDate >= sevenDaysAgo;
      }
      case "30days": {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return createdDate >= thirtyDaysAgo;
      }
      case "year": {
        const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        return createdDate >= startOfYear;
      }
      case "custom": {
        if (!customStart) return true;
        const start = new Date(`${customStart}T00:00:00`);
        const end = customEnd ? new Date(`${customEnd}T23:59:59`) : new Date();
        return createdDate >= start && createdDate <= end;
      }
      case "all":
      default:
        return true;
    }
  });
}

export function exportBookingsToExcel(
  bookings: ExportBookingData[],
  rangeLabel: string
) {
  if (bookings.length === 0) {
    alert("Tidak ada data reservasi yang sesuai untuk diexport pada periode ini.");
    return false;
  }

  // Format baris untuk spreadsheet
  const rows = bookings.map((b, idx) => {
    const created = new Date(b.createdAt);
    const formattedCreated = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}-${String(created.getDate()).padStart(2, "0")} ${String(created.getHours()).padStart(2, "0")}:${String(created.getMinutes()).padStart(2, "0")}`;

    let statusText = "Menunggu Verifikasi";
    if (b.status === "CONFIRMED") statusText = "Terkonfirmasi";
    if (b.status === "CANCELLED") statusText = "Dibatalkan";

    return {
      No: idx + 1,
      "Kode Booking": b.bookingCode,
      "Waktu Pengajuan": formattedCreated,
      "Nama Pemesan": b.customerName,
      "Nomor WhatsApp": b.customerWhatsapp,
      "Email Pemesan": b.customerEmail,
      "Akun Google": b.googleUserEmail || b.customerEmail,
      Kewarganegaraan: b.nationality,
      "Paket Pendakian": b.packageName || b.packageId,
      Durasi: b.packageDuration || "-",
      "Rute Jalur": b.packageRoute || "-",
      "Jadwal Keberangkatan": b.departureDate,
      "Peserta (Org)": b.participantsCount,
      "Total Biaya (IDR)": b.totalPrice,
      "DP 30% (IDR)": Math.round(b.totalPrice * 0.3),
      "Status Reservasi": statusText,
      "Alasan Pembatalan": b.cancellationReason || "-",
      "Catatan Pemesan": b.notes || "-",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Lebar kolom rapi (auto width)
  worksheet["!cols"] = [
    { wch: 5 },  // No
    { wch: 14 }, // Kode Booking
    { wch: 18 }, // Waktu Pengajuan
    { wch: 22 }, // Nama Pemesan
    { wch: 16 }, // Nomor WhatsApp
    { wch: 25 }, // Email Pemesan
    { wch: 25 }, // Akun Google
    { wch: 16 }, // Kewarganegaraan
    { wch: 24 }, // Paket Pendakian
    { wch: 18 }, // Durasi
    { wch: 32 }, // Rute Jalur
    { wch: 20 }, // Jadwal Keberangkatan
    { wch: 14 }, // Peserta
    { wch: 16 }, // Total Biaya
    { wch: 14 }, // DP 30%
    { wch: 20 }, // Status Reservasi
    { wch: 32 }, // Alasan Pembatalan
    { wch: 35 }, // Catatan Pemesan
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Reservasi");

  const todayStr = new Date().toISOString().slice(0, 10);
  const cleanLabel = rangeLabel.toLowerCase().replace(/\s+/g, "-");
  const filename = `Laporan-Reservasi-Rinjani_${cleanLabel}_${todayStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
  return true;
}

