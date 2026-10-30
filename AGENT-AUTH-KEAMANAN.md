# AGENT BRIEF: Login Google, Keamanan, dan Cloudflare untuk Rinjani Trek

Dokumen ini adalah instruksi kerja untuk agent AI. Baca seluruhnya sebelum menulis kode. Kerjakan berurutan sesuai bagian 5, dan berhenti untuk konfirmasi bila ada langkah yang berisiko merusak data.

---

## 1. Konteks Proyek

Website operator pendakian Gunung Rinjani. Seluruh halaman dan backend dasar sudah jadi.

| Item | Nilai |
|---|---|
| Framework | Next.js 15.5 (App Router), TypeScript 5.9 |
| Styling | Tailwind CSS v4 dengan token CSS (`--bg`, `--fg`, `--danau`, `--fajar`, `--border`) |
| Database | Neon Serverless PostgreSQL (ap-southeast-1) via `@neondatabase/serverless` |
| Deploy | Vercel (repo GitHub `AkbarHidayatullah12/rinjani-trip`) |
| Skill Neon | Ada di `.agents/skills/`; MCP Neon di `https://mcp.neon.tech/mcp` |

### Rute yang sudah ada
Publik: `/`, `/gunung-rinjani`, `/jalur-pendakian`, `/musim-dan-iklim`, `/persiapan`, `/booking`, `/booking/[kode]`, `/syarat-ketentuan`, `/kebijakan-pembatalan`, `/kebijakan-privasi`, `/sitemap.xml`, `/robots.txt`. Internal: `/admin`.

### API yang sudah ada
- `POST /api/booking`
- `GET /api/booking/[kode]`
- `GET /api/admin/bookings`
- `PATCH /api/admin/bookings/[id]`
- `DELETE /api/admin/bookings/[id]`
- `GET /api/admin/stats`

### Tabel yang sudah ada
- `packages`
- `bookings`: kode `RJN-XXXXXX`, tanggal trip, jumlah pendaki, total biaya, kontak, catatan, status (`PENDING`, `CONFIRMED`, `CANCELLED`)

### Masalah keamanan saat ini
- Panel `/admin` dilindungi satu PIN statis yang tertulis di kode/dokumentasi. PIN itu harus dianggap sudah bocor.
- `/api/booking` menerima email dari body request, sehingga siapa pun bisa memesan atas nama email lain.
- `DELETE /api/admin/bookings/[id]` menghapus data secara permanen.
- Belum ada login pengguna, rate limiting, atau verifikasi bot.

---

## 2. Tujuan

1. Pengunjung **wajib login dengan Google** sebelum memesan; email dan identitas Google tersimpan di database dan terikat ke tiap booking.
2. Panel admin memakai login Google yang sama, dibatasi daftar email admin. PIN dihapus total.
3. Semua endpoint memeriksa sesi dan otorisasi **di server**.
4. Cloudflare (DNS, Turnstile, rate limiting) menambah lapisan perlindungan.
5. Kebijakan privasi diperbarui sesuai data yang kini dikumpulkan.

Halaman publik informasi (home, profil, jalur, musim, persiapan, legal) **tetap terbuka tanpa login**.

---

## 3. Aturan untuk Agent

- **Jangan mengubah desain visual** halaman yang sudah ada. Halaman baru (`/masuk`, `/akun`) memakai token warna dan gaya editorial yang sama: putih, garis tipis, tanpa emoji dekoratif, tanpa kartu generik berbayangan identik, tanpa kata hiperbola.
- Teks antarmuka berbahasa Indonesia, lugas dan spesifik.
- **Jangan menulis rahasia ke repo.** Semua kunci lewat variabel lingkungan. Pastikan `.env*` ada di `.gitignore`. Sediakan `.env.example` berisi nama variabel tanpa nilai.
- **Jangan menyalin PIN lama ke file mana pun**, termasuk komentar, dokumen, atau log.
- Otorisasi diperiksa di server (route handler / server component). Menyembunyikan tombol di UI tidak dianggap proteksi.
- Validasi semua input dengan Zod.
- Setelah tiap tahap: jalankan `npm run typecheck` dan `npm run build`. Keduanya harus 0 error.
- Migrasi database harus **tidak menghapus data** yang ada. Gunakan `ADD COLUMN IF NOT EXISTS` dan `CREATE TABLE IF NOT EXISTS`. Konfirmasi dulu sebelum menjalankan migrasi ke database produksi.
- Gunakan versi paket yang kompatibel dengan Next.js 15. Periksa dokumentasi terbaru Auth.js sebelum menulis konfigurasi, karena API dan paket beta dapat berubah.

---

## 4. Keputusan Teknis

**Library auth: Auth.js v5** (`next-auth@beta`) dengan provider Google.

- Strategi sesi: **JWT** (tanpa adapter database), agar middleware tetap kompatibel edge dan tidak perlu query DB pada setiap request.
- Pengguna disimpan ke tabel `users` sendiri lewat upsert di callback `signIn`, memakai `@neondatabase/serverless`.
- Konfigurasi dipecah dua file: `auth.config.ts` (tanpa akses DB, aman untuk middleware) dan `auth.ts` (callback yang memakai DB).
- Identitas unik pengguna: `google_sub` (klaim `sub` dari Google), bukan email.
- Scope Google: hanya `openid email profile`.
- Hanya login Google. Tidak ada form email/password.

Alternatif (Neon Auth) **tidak dipakai** pada brief ini.

---

## 5. Rencana Kerja (kerjakan berurutan)

### Tahap 1: Bersihkan PIN admin dan amankan rahasia

Tugas:
1. Cari di seluruh repo (`grep -ri`) semua tempat yang memakai PIN admin: kode, komponen `/admin`, dokumen audit, README, komentar. Hapus dari file aktif.
2. Pastikan `.gitignore` memuat `.env`, `.env.local`, `.env.*.local`.
3. Buat `.env.example` berisi nama variabel (lihat bagian 6) tanpa nilai.
4. Periksa riwayat git untuk rahasia yang pernah ter-commit (`git log -p -S"<kata kunci>"`). **Laporkan temuannya ke pemilik**; jangan menulis ulang riwayat tanpa persetujuan.
5. Tulis checklist untuk pemilik (manual, tidak bisa dikerjakan agent):
   - Rotasi password/connection string Neon bila pernah ter-commit.
   - Isi semua variabel di Vercel (Settings → Environment Variables), bukan di repo.

Kriteria selesai: tidak ada PIN atau rahasia di repo; `.env.example` ada; laporan temuan riwayat git dibuat.

### Tahap 2: Google OAuth, Auth.js, tabel `users`, `bookings.user_id`

Instal: `npm install next-auth@beta zod`.

Migrasi SQL (jalankan lewat Neon, setelah konfirmasi):

```sql
CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_sub    text NOT NULL UNIQUE,
  email         text NOT NULL UNIQUE,
  name          text,
  image         text,
  role          text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
```

Catatan: `user_id` sengaja **nullable** agar booking lama tetap valid. Booking baru wajib mengisinya (dipaksa di kode API).

File yang dibuat:

```
auth.config.ts          # provider Google + callback authorized (tanpa DB)
auth.ts                 # NextAuth(...) + callback signIn/jwt/session (pakai DB)
app/api/auth/[...nextauth]/route.ts   # export { GET, POST } dari handlers
lib/db.ts               # klien neon (jika belum ada)
lib/auth-helpers.ts     # requireUser(), requireAdmin()
types/next-auth.d.ts    # perluas tipe Session/JWT: id, role
```

Perilaku `auth.ts`:
- `signIn`: wajib `profile.email_verified === true`. Lakukan upsert ke `users` berdasarkan `google_sub` (perbarui `email`, `name`, `image`, `last_login_at`). Jika email ada di `ADMIN_EMAILS`, set `role = 'admin'`; jika tidak, jangan menurunkan role yang sudah ada secara diam-diam tanpa alasan (role admin hanya bersumber dari `ADMIN_EMAILS` atau diubah manual di DB).
- `jwt`: saat login pertama, ambil `id` dan `role` dari DB dan simpan di token.
- `session`: ekspos `session.user.id` dan `session.user.role`.
- `pages.signIn = '/masuk'`.

`lib/auth-helpers.ts`:
- `requireUser()`: ambil sesi di server; jika tidak ada, kembalikan 401 (API) atau `redirect('/masuk')` (halaman).
- `requireAdmin()`: panggil `requireUser()`, lalu pastikan `role === 'admin'`; selain itu 403.

Kriteria selesai: login Google berjalan di lokal; baris `users` terbuat/terperbarui; `session.user.id` dan `role` tersedia; build lulus.

### Tahap 3: Halaman `/masuk`, Navbar, middleware

**Halaman `/masuk`** (`app/masuk/page.tsx`):
- Memakai `PageHeader` yang sudah ada bila tersedia.
- Satu tombol "Lanjut dengan Google" (server action `signIn('google', { redirectTo })`).
- Satu kalimat alasan: "Masuk agar reservasi tersimpan dan dapat dilihat kembali."
- Tautan ke Kebijakan Privasi dan Syarat & Ketentuan.
- Baca parameter `next`; **validasi bahwa `next` adalah path internal** yang diawali `/` dan bukan `//` atau URL absolut (cegah open redirect). Jika tidak valid, pakai `/akun`.
- Jika pengguna sudah login, langsung redirect ke tujuan.
- Tampilkan pesan error yang jelas bila login gagal (`?error=`).

**Navbar**:
- Belum login: tombol teks "Masuk" di samping CTA "Pesan pendakian".
- Sudah login: foto kecil (atau inisial) + menu berisi "Akun saya" dan "Keluar" (server action `signOut`). Admin melihat tambahan "Panel admin".
- Versi mobile: item yang sama di menu hamburger.
- Navbar membaca sesi di server (server component) agar tidak ada kedipan status.

**Middleware** (`middleware.ts`, memakai `auth.config.ts`):
- Matcher: `/booking/:path*`, `/akun/:path*`, `/admin/:path*`.
- Tanpa sesi → redirect ke `/masuk?next=<path+query asli>`.
- `/admin/*` tanpa role admin → redirect ke `/` (atau halaman 403).
- Rute publik lainnya tidak disentuh.
- Middleware hanya lapisan pertama; endpoint API tetap memeriksa sendiri (Tahap 4 dan 5).

Tombol "Pesan paket ini" tetap mengarah ke `/booking?paket=...`; query `paket` harus ikut terbawa lewat login dan kembali.

Kriteria selesai: membuka `/booking?paket=crossing-trek` saat logout membawa ke `/masuk`, dan setelah login kembali ke URL itu dengan paket terpilih.

### Tahap 4: API booking memakai sesi, dan halaman `/akun`

`POST /api/booking`:
1. `requireUser()`.
2. Validasi body dengan Zod. **Hapus kolom email dari skema input**; email dan `user_id` selalu diambil dari sesi.
3. Simpan booking dengan `user_id = session.user.id` dan `email = session.user.email`.
4. Rate limit sederhana per pengguna: maksimal beberapa booking berstatus `PENDING` aktif sekaligus (misal 5); lewat batas → 429 dengan pesan jelas.
5. Verifikasi token Turnstile bila Tahap 6 sudah aktif (siapkan fungsi `verifyTurnstile()` yang di-skip bila `TURNSTILE_SECRET_KEY` kosong di development).

`GET /api/booking/[kode]`:
- `requireUser()`; hanya pemilik (`bookings.user_id = session.user.id`) atau admin yang boleh membaca.
- Jika bukan pemilik, kembalikan **404** (bukan 403) agar keberadaan kode tidak bocor.

Halaman `/booking/[kode]`: sesuaikan agar memakai aturan yang sama; tampilkan 404 untuk non-pemilik.

Form `/booking`:
- Nama dan email awal terisi dari sesi; **email dikunci (read-only)** dengan keterangan "Email dari akun Google".
- Nama kontak boleh diubah; nomor WhatsApp tetap diisi manual dan dinormalisasi ke format `62...`.

Halaman baru `/akun` (`app/akun/page.tsx`, server component):
- Header: nama, email, foto.
- Daftar booking milik pengguna (kode, paket, tanggal trip, jumlah, total, status) dengan tautan ke `/booking/[kode]`. Gaya tabel/garis tipis editorial, bukan kartu.
- Keadaan kosong: kalimat singkat + tautan ke `/booking`.
- Tombol "Keluar".
- Booking lama tanpa `user_id` tidak tampil (sudah diterima).

Kriteria selesai: pengguna A tidak dapat membuka booking pengguna B (diuji manual dan lewat panggilan API langsung); body yang membawa `email` palsu diabaikan.

### Tahap 5: Admin berbasis role Google, hapus PIN

- Hapus seluruh mekanisme PIN (halaman input PIN, cookie/header PIN, verifikasi PIN di API).
- `/admin` dan semua `/api/admin/*` memakai `requireAdmin()` di sisi server.
- Daftar admin berasal dari `ADMIN_EMAILS` (dipisah koma, dicocokkan huruf kecil) dan kolom `users.role`.
- `DELETE /api/admin/bookings/[id]` diubah menjadi **soft delete**: isi `deleted_at = now()` dan catat siapa yang melakukannya (tambah kolom `deleted_by uuid` bila perlu). Semua query daftar dan statistik mengabaikan baris dengan `deleted_at IS NOT NULL`.
- `PATCH` hanya menerima kolom yang diizinkan (status, catatan admin), divalidasi Zod.
- Tampilan daftar admin: data identitas (KTP/paspor, jika ada) **disamarkan** (hanya 4 digit terakhir); tampilkan penuh hanya di halaman detail dan hanya untuk admin.
- Tambahkan kolom/tampilan "Akun Google pemesan" (email, nama) di detail booking admin.
- `robots.txt` tetap memblokir `/admin/`; tambahkan `/akun/` dan `/api/`. Tambahkan `noindex` di metadata halaman `/admin`, `/akun`, `/masuk`.

Kriteria selesai: pengguna non-admin yang membuka `/admin` atau memanggil `/api/admin/*` mendapat redirect atau 403; tidak ada sisa kode PIN (`grep` bersih).

### Tahap 6: Cloudflare (DNS, Turnstile, rate limiting)

Bagian ini terbagi menjadi tugas **kode** (agent) dan tugas **dasbor** (pemilik).

**Tugas kode (agent):**
- Komponen `components/Turnstile.tsx` (client) yang memuat widget Turnstile dan mengirim token ke form booking.
- `lib/turnstile.ts` dengan `verifyTurnstile(token, ip)` yang memanggil endpoint siteverify Cloudflare dari server. Gagal verifikasi → 400. Jika `TURNSTILE_SECRET_KEY` kosong dan `NODE_ENV !== 'production'`, lewati.
- Pasang Turnstile di form `/booking` (bukan di tombol OAuth Google).
- Header keamanan di `next.config.ts`: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal, dan CSP yang mengizinkan `challenges.cloudflare.com` (script, frame), `accounts.google.com`, serta `lh3.googleusercontent.com` (foto profil Google). Uji CSP agar hero parallax, font, dan gambar tidak rusak; mulai dengan `Content-Security-Policy-Report-Only` bila ragu.
- Tambahkan `lh3.googleusercontent.com` ke `images.remotePatterns` di `next.config.ts`.
- Rate limiting di tingkat aplikasi hanya sebagai cadangan (batas booking `PENDING` per pengguna di Tahap 4). Jangan mengandalkan memori proses untuk rate limit di Vercel serverless, karena tidak bertahan antar instance.

**Tugas dasbor (pemilik, agent cukup membuat checklistnya di `docs/CLOUDFLARE-CHECKLIST.md`):**
1. Tambahkan domain ke Cloudflare, arahkan nameserver, atur DNS ke Vercel.
2. Mulai dengan **proxy mati (awan abu-abu, DNS only)**. Vercel sudah memiliki CDN dan perlindungan DDoS sendiri; proxy Cloudflare di depan Vercel dapat menimbulkan masalah caching, redirect loop SSL, dan IP pengunjung. Bila nanti proxy diaktifkan: SSL/TLS mode **Full (strict)**, baca IP asli dari header `CF-Connecting-IP`, dan lewati cache untuk `/api/*`, `/admin*`, `/akun*`. Periksa dokumentasi Cloudflare dan Vercel terbaru sebelum mengaktifkan.
3. Buat widget Turnstile (mode Managed), isi `NEXT_PUBLIC_TURNSTILE_SITE_KEY` dan `TURNSTILE_SECRET_KEY` di Vercel.
4. Rate limiting rules (hanya berlaku bila proxy aktif): `/api/booking` (misal 10 request/menit/IP) dan `/api/auth/*` (misal 20 request/menit/IP), aksi blokir atau challenge.
5. Aktifkan WAF managed rules dan Bot Fight Mode; pantau Security Events seminggu pertama untuk memastikan pengguna sah tidak terblokir.
6. Aktifkan DNSSEC dan HSTS bila domain sudah stabil.

Kriteria selesai: form booking menolak permintaan tanpa token Turnstile valid di produksi; header keamanan terlihat di respons; checklist Cloudflare tersedia.

### Tahap 7: Perbarui kebijakan privasi

Perbarui `/kebijakan-privasi` (bahasa Indonesia, lugas) agar memuat:
- **Data yang dikumpulkan:** akun Google (ID unik, nama, email, foto profil), data reservasi (kontak, WhatsApp, catatan), data identitas pendaki (KTP/paspor) bila diminta, dan data teknis dasar.
- **Tujuan:** memproses reservasi, mengurus simaksi TNGR, komunikasi, keamanan, dan pencegahan penyalahgunaan.
- **Dasar login Google:** kami hanya meminta scope `openid`, `email`, `profile`; kami tidak mengakses Gmail, kontak, atau data Google lain.
- **Penyimpanan dan keamanan:** disimpan di Neon PostgreSQL (Singapura), akses admin dibatasi, identitas disamarkan di antarmuka admin.
- **Pembagian data:** pihak yang diperlukan (TNGR untuk simaksi, penyedia infrastruktur seperti Vercel, Neon, Cloudflare, dan Google untuk autentikasi; nanti payment gateway dan layanan WhatsApp bila diaktifkan). Tidak dijual ke pihak lain.
- **Penyimpanan dan penghapusan:** jangka waktu retensi dan cara meminta penghapusan atau koreksi (kontak email/WhatsApp).
- **Cookie:** cookie sesi login dan Turnstile (fungsional/keamanan).
- **Tanggal pembaruan.**

Tinjau selaras dengan UU Pelindungan Data Pribadi (UU PDP). Teks ini bukan nasihat hukum; beri catatan kepada pemilik untuk meninjaunya dengan ahli hukum sebelum peluncuran komersial.

---

## 6. Variabel Lingkungan

Isi di Vercel dan `.env.local` (jangan di-commit). Buat `.env.example` dengan nama yang sama tanpa nilai.

| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | Connection string Neon (sudah ada) |
| `AUTH_SECRET` | Rahasia acak panjang (`npx auth secret` atau `openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` | Client ID dari Google Cloud Console |
| `AUTH_GOOGLE_SECRET` | Client secret dari Google Cloud Console |
| `AUTH_TRUST_HOST` | `true` bila diperlukan di lingkungan tertentu; di Vercel biasanya otomatis |
| `ADMIN_EMAILS` | Email admin dipisah koma, huruf kecil |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site key Turnstile |
| `TURNSTILE_SECRET_KEY` | Secret key Turnstile (server saja) |
| `NEXT_PUBLIC_SITE_URL` | URL produksi, dipakai untuk sitemap dan metadata |

### Setup Google Cloud Console (pemilik, manual)
1. Buat project, aktifkan OAuth consent screen (nama aplikasi, logo, email dukungan, tautan kebijakan privasi dan syarat).
2. Buat OAuth Client ID, tipe Web application.
3. Authorized JavaScript origins: domain produksi dan `http://localhost:3000`.
4. Authorized redirect URI: `https://<domain-produksi>/api/auth/callback/google` dan `http://localhost:3000/api/auth/callback/google`.
5. Scope: hanya `openid`, `email`, `profile`.
6. Selama status consent screen "Testing", hanya akun yang terdaftar sebagai test user yang dapat login. Ubah ke "In production" sebelum peluncuran.

---

## 7. Daftar File (ringkasan perubahan)

Baru:
```
auth.config.ts
auth.ts
middleware.ts
types/next-auth.d.ts
lib/auth-helpers.ts
lib/turnstile.ts
components/Turnstile.tsx
app/api/auth/[...nextauth]/route.ts
app/masuk/page.tsx
app/akun/page.tsx
docs/CLOUDFLARE-CHECKLIST.md
.env.example
```

Diubah:
```
components/layout/Navbar.tsx        # tombol Masuk / menu akun
app/api/booking/route.ts            # wajib sesi, abaikan email dari body
app/api/booking/[kode]/route.ts     # hanya pemilik atau admin
app/booking/page.tsx                # email terkunci, Turnstile
app/booking/[kode]/page.tsx         # 404 bagi non-pemilik
app/admin/**                        # hapus PIN, pakai requireAdmin
app/api/admin/**                    # requireAdmin, soft delete, validasi
app/kebijakan-privasi/page.tsx      # isi baru
app/robots.ts                       # blokir /admin/, /akun/, /api/
next.config.ts                      # header keamanan, remotePatterns
.gitignore
```

---

## 8. Checklist Pengujian

Autentikasi
- [ ] Login Google berhasil; baris `users` terbuat; login kedua memperbarui `last_login_at`
- [ ] Akun Google dengan email belum terverifikasi ditolak
- [ ] Logout menghapus sesi
- [ ] Parameter `next` eksternal (`//evil.com`, `https://evil.com`) diabaikan

Akses
- [ ] Logout → `/booking`, `/akun`, `/admin` mengarah ke `/masuk` dengan `next` yang benar
- [ ] Setelah login, kembali ke `/booking?paket=...` dengan paket terpilih
- [ ] Panggilan `POST /api/booking` tanpa sesi → 401
- [ ] Pengguna A mengakses `/booking/<kode milik B>` → 404
- [ ] Non-admin ke `/admin` atau `/api/admin/*` → ditolak
- [ ] Body booking dengan `email` palsu → diabaikan, email dari sesi yang tersimpan

Data
- [ ] Booking baru selalu punya `user_id`
- [ ] Booking lama (tanpa `user_id`) tidak menyebabkan error di admin
- [ ] Hapus di admin menjadi soft delete; data tetap ada di DB, tidak tampil di daftar

Keamanan
- [ ] Tidak ada PIN atau rahasia tersisa (`grep` repo bersih)
- [ ] `.env*` tidak ter-track git
- [ ] Header keamanan muncul di respons produksi
- [ ] Turnstile menolak permintaan tanpa token di produksi
- [ ] CSP tidak merusak hero, font, galeri, atau login Google

Kualitas
- [ ] `npm run typecheck` 0 error
- [ ] `npm run build` sukses
- [ ] Tampilan `/masuk`, `/akun`, dan Navbar diuji di layar 360–414 px
- [ ] Tidak ada emoji dekoratif atau gaya kartu generik di halaman baru

---

## 9. Di Luar Lingkup (jangan dikerjakan sekarang)

- Notifikasi WhatsApp dan email
- Payment gateway (Midtrans / Xendit) dan webhook
- Penguncian kuota keberangkatan atomik
- Dashboard manifes untuk guide
- Login selain Google, termasuk email/password

---

## 10. Laporan Akhir yang Diminta dari Agent

Setelah semua tahap, berikan ringkasan berisi: file yang dibuat/diubah, migrasi SQL yang dijalankan, variabel lingkungan yang perlu diisi pemilik, langkah manual yang tersisa (Google Cloud, Cloudflare, rotasi kunci), hasil `typecheck` dan `build`, serta temuan keamanan yang belum teratasi.
