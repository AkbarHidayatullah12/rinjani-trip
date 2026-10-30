import { formatIdr } from "@/lib/data";
import { SITE } from "@/lib/site";

export interface BookingNotificationData {
  bookingCode: string;
  packageName: string;
  packageDuration?: string;
  packageRoute?: string;
  departureDate: string;
  participantsCount: number;
  nationality: string;
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string;
  totalPrice: number;
  notes?: string | null;
}

/**
 * Format Pesan 1: Dikirim oleh Pendaki saat mengajukan reservasi
 */
export function formatCustomerToAdminMessage(data: BookingNotificationData): string {
  return [
    `Halo Tim *${SITE.nama}*, saya baru saja mengajukan reservasi pendakian melalui website resmi:`,
    ``,
    `📋 *RINCIAN RESERVASI:*`,
    `• Kode Booking : *${data.bookingCode}*`,
    `• Paket Trip   : *${data.packageName}*`,
    data.packageDuration ? `• Durasi & Rute: ${data.packageDuration} (${data.packageRoute || ""})` : null,
    `• Jadwal Mulai : *${data.departureDate}*`,
    `• Peserta      : *${data.participantsCount} Orang (${data.nationality})*`,
    `• Nama Kontak  : *${data.customerName}*`,
    `• Total Biaya  : *${formatIdr(data.totalPrice)}*`,
    data.notes ? `• Catatan Khusus: _"${data.notes}"_` : null,
    ``,
    `Mohon konfirmasi ketersediaan kuota e-Rinjani TNGR dan instruksi tahapan selanjutnya. Terima kasih!`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/**
 * Format Pesan 2: Notifikasi Masuk ke WhatsApp Pengelola/Admin
 */
export function formatAdminAlertMessage(data: BookingNotificationData): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rinjani-trip.vercel.app";
  return [
    `🚨 *NOTIFIKASI RESERVASI MASUK — ${SITE.nama.toUpperCase()}*`,
    `=============================`,
    `Ada pengajuan booking baru di website:`,
    ``,
    `• *Kode Booking* : ${data.bookingCode}`,
    `• *Paket*        : ${data.packageName}`,
    `• *Tanggal Trip* : ${data.departureDate}`,
    `• *Peserta*      : ${data.participantsCount} Orang (${data.nationality})`,
    `• *Total Tagihan*: ${formatIdr(data.totalPrice)}`,
    ``,
    `👤 *Data Pendaki:*`,
    `• Nama     : ${data.customerName}`,
    `• WhatsApp : ${data.customerWhatsapp}`,
    `• Email    : ${data.customerEmail}`,
    data.notes ? `• Catatan  : "${data.notes}"` : `• Catatan  : -`,
    ``,
    `=============================`,
    `🔗 Buka Panel Admin untuk verifikasi:`,
    `${siteUrl}/admin`,
  ].join("\n");
}

/**
 * Format Pesan Notifikasi Pembatalan oleh Pendaki
 */
export function formatCancellationAlertMessage(data: {
  bookingCode: string;
  customerName: string;
  customerWhatsapp: string;
  packageName: string;
  departureDate: string;
  reason: string;
}): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rinjani-trip.vercel.app";
  return [
    `⚠️ *PEMBATALAN RESERVASI — ${SITE.nama.toUpperCase()}*`,
    `=============================`,
    `Pendaki telah mengajukan pembatalan booking:`,
    ``,
    `• *Kode Booking* : ${data.bookingCode}`,
    `• *Nama Pendaki* : ${data.customerName} (${data.customerWhatsapp})`,
    `• *Paket Trip*   : ${data.packageName}`,
    `• *Tanggal Trip* : ${data.departureDate}`,
    ``,
    `📝 *Alasan Pembatalan:*`,
    `"${data.reason}"`,
    ``,
    `Status reservasi telah diubah menjadi BATAL di sistem.`,
    `=============================`,
    `🔗 Cek Dashboard Admin:`,
    `${siteUrl}/admin`,
  ].join("\n");
}

/**
 * Format Pesan 3: Konfirmasi Resmi dari Admin ke Pendaki (Lolos Kuota)
 */
export function formatAdminToCustomerMessage(
  data: BookingNotificationData,
  status: "CONFIRMED" | "PENDING" | "CANCELLED"
): string {
  if (status === "CONFIRMED") {
    return [
      `Halo Kak *${data.customerName}*, salam lestari! 🏔️`,
      ``,
      `Kami dari pengelola *${SITE.nama}* mengabarkan bahwa pengajuan pendakian Anda dengan Kode Booking *${data.bookingCode}* untuk paket *${data.packageName}* pada tanggal *${data.departureDate}* telah kami verifikasi:`,
      ``,
      `✅ *STATUS: KUOTA TERSEDIA & DISETUJUI*`,
      ``,
      `Rincian Pemesanan:`,
      `• Jumlah Peserta : ${data.participantsCount} Orang (${data.nationality})`,
      `• Total Biaya    : ${formatIdr(data.totalPrice)}`,
      `• Uang Muka (DP) : ${formatIdr(Math.round(data.totalPrice * 0.3))} (30%)`,
      ``,
      `Untuk penguncian tiket simaksi resmi e-Rinjani Balai TNGR dan reservasi tim porter/guide, silakan melakukan transfer DP ke rekening resmi kami. Informasi nomor rekening dan invoice akan kami lampirkan setelah pesan ini.`,
      ``,
      `Terima kasih dan sampai jumpa di puncak Rinjani!`,
    ].join("\n");
  }

  if (status === "CANCELLED") {
    return [
      `Halo Kak *${data.customerName}*,`,
      ``,
      `Terkait pengajuan reservasi *${data.bookingCode}* untuk tanggal *${data.departureDate}*, kami menginformasikan bahwa jadwal tersebut saat ini *DIBATALKAN / KUOTA TNGR PENUH*.`,
      ``,
      `Jika Anda berkenan mengganti tanggal keberangkatan alternatif, silakan beritahu kami agar dapat kami carikan kuota yang tersedia. Terima kasih.`,
    ].join("\n");
  }

  return [
    `Halo Kak *${data.customerName}*, kami dari *${SITE.nama}*. Pengajuan reservasi Anda (*${data.bookingCode}*) sedang dalam antrean verifikasi kuota e-Rinjani. Kami akan segera menghubungi Anda kembali dalam 1–2 jam kerja.`,
  ].join("\n");
}

/**
 * Helper pengiriman otomatis ke WhatsApp Gateway (Fonnte atau CallMeBot) jika dikonfigurasi
 */
export async function sendWhatsAppGateway(toPhone: string, text: string): Promise<boolean> {
  const cleanPhone = toPhone.replace(/[^0-9]/g, "");

  // 1. Opsi A: Fonnte Gateway (Rekomendasi Indonesia)
  const fonnteToken = process.env.FONNTE_TOKEN;
  if (fonnteToken) {
    try {
      const res = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          Authorization: fonnteToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: cleanPhone,
          message: text,
        }),
      });
      if (res.ok) {
        console.log(`[WhatsApp Gateway] Sukses mengirim notifikasi via Fonnte ke ${cleanPhone}`);
        return true;
      }
      const errText = await res.text();
      console.warn(`[WhatsApp Gateway] Gagal kirim via Fonnte:`, errText);
    } catch (err) {
      console.warn("[WhatsApp Gateway] Error koneksi Fonnte:", err);
    }
  }

  // 2. Opsi B: CallMeBot (Gratis Langsung Tanpa Daftar Akun)
  const callMeBotKey = process.env.CALLMEBOT_API_KEY;
  if (callMeBotKey) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(
        text
      )}&apikey=${callMeBotKey}`;
      const res = await fetch(url);
      if (res.ok) {
        console.log(`[WhatsApp Gateway] Sukses mengirim notifikasi via CallMeBot ke ${cleanPhone}`);
        return true;
      }
    } catch (err) {
      console.warn("[WhatsApp Gateway] Error koneksi CallMeBot:", err);
    }
  }

  if (!fonnteToken && !callMeBotKey) {
    console.warn(
      `[WhatsApp Gateway] Notifikasi ke ${cleanPhone} belum bisa terkirim otomatis di latar belakang karena FONNTE_TOKEN atau CALLMEBOT_API_KEY belum diisi di .env.local.`
    );
  }

  return false;
}

