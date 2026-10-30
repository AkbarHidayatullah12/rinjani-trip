import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Kebijakan Privasi Perlindungan Data | Rinjani Trek",
  description:
    "Kebijakan penanganan data pribadi identitas pendaki, akun Google, dan kepatuhan perlindungan data pribadi Rinjani Trek.",
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        eyebrow="Privasi Data"
        judul="Kebijakan Privasi Pendaki"
        deskripsi="Bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat menggunakan layanan reservasi ekspedisi Rinjani Trek."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Kebijakan Privasi" },
        ]}
      />

      <div className="mx-auto max-w-4xl px-6 py-16 text-sm text-fg-muted space-y-8 leading-relaxed">
        <div className="p-4 rounded-lg bg-bg-subtle border border-border text-xs text-fg-muted">
          Pembaruan Terakhir: <strong>30 Oktober 2026</strong>. Disusun selaras dengan prinsip Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022).
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">1. Data yang Dikumpulkan</h2>
          <p>
            Untuk memproses reservasi dan verifikasi tiket resmi pendakian, kami mengumpulkan:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              <strong>Akun Autentikasi Google:</strong> Pengenal unik (Google Subject ID), nama lengkap profil publik, alamat email terverifikasi, dan foto profil.
            </li>
            <li>
              <strong>Data Kontak & Reservasi:</strong> Nama ketua rombongan, nomor WhatsApp aktif, kewarganegaraan, jadwal pendakian, paket trip yang dipilih, dan catatan kebutuhan khusus (makanan/tenda).
            </li>
            <li>
              <strong>Data Identitas Resmi (KTP / Paspor):</strong> Diperlukan hanya saat pengurusan simaksi e-Rinjani resmi Balai Taman Nasional Gunung Rinjani (TNGR).
            </li>
            <li>
              <strong>Data Teknis Dasar:</strong> Alamat IP dan token keamanan verifikasi anti-bot Cloudflare Turnstile saat pengiriman formulir.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">2. Batasan Akses Login Google</h2>
          <p>
            Kami menerapkan prinsip minimisasi data. Saat Anda masuk menggunakan Google, kami hanya meminta cakupan (*scope*) paling mendasar: <code>openid</code>, <code>email</code>, dan <code>profile</code>. Kami <strong>tidak pernah</strong> meminta akses ataupun membaca kotak masuk Gmail, daftar kontak Google Drive, kalender, atau data pribadi Google lainnya.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">3. Tujuan Penggunaan Data</h2>
          <p>Data pribadi Anda digunakan semata-mata untuk:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Pendaftaran resmi simaksi masuk kawasan konservasi pada aplikasi e-Rinjani Balai TNGR.</li>
            <li>Penerbitan asuransi kecelakaan pendakian resmi selama berada di kawasan taman nasional.</li>
            <li>Komunikasi penjemputan, konfirmasi kuota keberangkatan, dan koordinasi tim logistik/guide lapangan.</li>
            <li>Keamanan sistem, pencegahan reservasi palsu (*spam/bot*), dan audit transaksi.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">4. Penyimpanan dan Keamanan Data</h2>
          <p>
            Seluruh data reservasi dan kredensial pengguna disimpan secara aman di basis data <strong>Neon PostgreSQL</strong> pada region Singapura (AWS <code>ap-southeast-1</code>) dengan enkripsi transit SSL/TLS wajib. Akses data dibatasi ketat melalui otorisasi berbasis peran (*role-based access control*), di mana nomor identitas sensitif disamarkan di antarmuka operasional.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">5. Pembagian Data kepada Pihak Ketiga</h2>
          <p>
            Rinjani Trek <strong>tidak menjual atau menyewakan</strong> data pribadi kepada pihak ketiga untuk kepentingan periklanan komersial. Data hanya diteruskan kepada entitas yang berkepentingan langsung:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Balai Taman Nasional Gunung Rinjani (Kementerian LHK) untuk penerbitan simaksi resmi.</li>
            <li>Penyedia infrastruktur teknologi terpercaya: Google (autentikasi), Vercel (hosting komputasi), Neon (database serverless), dan Cloudflare (keamanan jaringan & anti-bot).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">6. Cookie dan Sesi Pengguna</h2>
          <p>
            Website kami hanya menggunakan cookie esensial dan fungsional, yaitu cookie sesi terenkripsi (Auth.js) untuk menjaga status masuk Anda dan cookie Cloudflare Turnstile untuk memvalidasi bahwa pengunjung adalah manusia sah dan bukan bot berbahaya.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">7. Hak Pemilik Data & Penghapusan</h2>
          <p>
            Sesuai UU Perlindungan Data Pribadi, Anda berhak memeriksa, memperbarui, atau mengajukan permohonan penghapusan riwayat akun dan data reservasi Anda dari sistem kami setelah ekspedisi pendakian selesai dilaksanakan. Hubungi narahubung resmi kami melalui WhatsApp atau email yang tercantum pada situs ini.
          </p>
          <p className="text-xs text-fg-faint">
            *Catatan: Dokumen ini disusun untuk keterbukaan informasi operasional. Disarankan ditinjau bersama konsultan hukum sebelum peluncuran komersial penuh.
          </p>
        </section>
      </div>
    </main>
  );
}
