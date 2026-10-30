# Panduan Konfigurasi Cloudflare & Keamanan untuk Rinjani Trek

Dokumen ini berisi panduan manual bagi pemilik website untuk mengonfigurasi Cloudflare dan Cloudflare Turnstile (Anti-Bot) pada domain kustom Rinjani Trek yang terhubung ke Vercel.

---

### 1. Pengaturan DNS & Proxy Cloudflare
1. **Tambahkan Domain ke Cloudflare**:
   - Daftarkan domain kustom Anda (misal: `rinjanitrek.com`).
   - Ubah Nameserver di registrar domain Anda sesuai yang diberikan Cloudflare.
2. **Koneksi ke Vercel**:
   - Tambahkan CNAME record yang mengarah ke `cname.vercel-dns.com` (atau IP A record Vercel `76.76.21.21`).
   - **Rekomendasi Awal**: Gunakan status **DNS Only (Awan Abu-abu / Proxy Mati)** terlebih dahulu sampai domain aktif sempurna di Vercel.
   - *Catatan jika Proxy (Awan Jingga) diaktifkan nanti*:
     - Set SSL/TLS Encryption mode ke **Full (Strict)**.
     - Pastikan menonaktifkan Cloudflare caching untuk rute dinamis: `/api/*`, `/admin*`, `/akun*`.

---

### 2. Membuat Widget Cloudflare Turnstile (Anti-Bot)
1. Buka dashboard Cloudflare → menu **Turnstile**.
2. Klik **Add Widget**:
   - **Widget name**: `Rinjani Trek Booking Protection`
   - **Domains**: Masukkan domain Anda (misal `rinjanitrek.com` dan `localhost`).
   - **Widget Mode**: Pilih **Managed** (direkomendasikan, interaktif otomatis tanpa puzzle mengganggu pengunjung).
3. Setelah dibuat, Anda akan mendapatkan 2 kunci:
   - `Site Key` → Masukkan ke variabel: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `Secret Key` → Masukkan ke variabel: `TURNSTILE_SECRET_KEY`

---

### 3. Rate Limiting Rules (Jika Cloudflare Proxy Aktif)
Pada menu **Security** → **WAF** → **Rate limiting rules**:
1. **Rule Reservasi**:
   - URI Path: `/api/booking`
   - Batas: 10 permintaan per menit per IP.
   - Tindakan: Block atau Managed Challenge.
2. **Rule Autentikasi**:
   - URI Path: `/api/auth/*`
   - Batas: 20 permintaan per menit per IP.
   - Tindakan: Managed Challenge.

---

### 4. Proteksi Bot & WAF Tambahan
1. Buka **Security** → **Bots** → Aktifkan **Bot Fight Mode**.
2. Buka **SSL/TLS** → **Edge Certificates**:
   - Aktifkan **Always Use HTTPS**.
   - Aktifkan **HSTS** (setelah domain dipastikan stabil).
3. Buka **DNS** → Aktifkan **DNSSEC** untuk integritas resolusi domain.

