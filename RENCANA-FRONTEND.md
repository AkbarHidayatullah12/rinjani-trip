# Rencana Front End: Rinjani Trek

Dokumen ini memuat rencana restrukturisasi front end website **Rinjani Trek** dari satu halaman panjang menjadi beberapa halaman terpisah (pendekatan A: home ringkas + halaman profil lengkap). Backend (Supabase, WhatsApp, CMS admin, payment gateway) ditunda ke tahap berikutnya.

---

## 1. Tujuan

- Home menjadi pintu depan: ringan, cepat, memuat cuplikan profil Rinjani dan ajakan memesan.
- Profil gunung, jalur, musim, dan persiapan punya halaman sendiri agar mendalam dan bisa muncul di Google secara terpisah.
- Booking berdiri sendiri di `/booking` dengan fokus konversi.
- Seluruh halaman memakai bahasa desain yang sama: putih editorial, data konkret, tanpa emoji dekoratif, tanpa kartu generik.

---

## 2. Peta Halaman

| Rute | Isi | Sumber komponen |
|---|---|---|
| `/` | Hero, strip fakta, cuplikan tiap topik, galeri pilihan, paket, CTA | `ParallaxHero`, `MountainFacts`, versi ringkas komponen lain, `Packages` |
| `/gunung-rinjani` | Profil lengkap: geologi, sejarah Samalas, flora-fauna, budaya, galeri | `MountainAbout`, `NatureCulture`, `Gallery` + konten baru |
| `/jalur-pendakian` | Perbandingan 5 rute, peta jalur, profil elevasi | `TrailTabs` + peta dan grafik baru |
| `/musim-dan-iklim` | Jadwal buka-tutup TNGR, profil suhu, layering | `SeasonGuide` |
| `/persiapan` | Regulasi TNGR, keselamatan, perlengkapan, kebugaran, FAQ | `Safety` + konten baru |
| `/booking` | Form pemesanan + ringkasan biaya sticky | `BookingForm` |
| `/booking/[kode]` | Konfirmasi dan status reservasi `RJN-XXXXXX` | Baru |
| `/syarat-ketentuan` | Syarat pemesanan | Baru |
| `/kebijakan-pembatalan` | Aturan pembatalan dan perubahan jadwal | Baru |
| `/kebijakan-privasi` | Penanganan data pribadi pendaki | Baru |

Struktur direktori target:

```
app/
├── layout.tsx                  # Lenis, Navbar, Footer, metadata dasar
├── page.tsx                    # Home
├── gunung-rinjani/page.tsx
├── jalur-pendakian/page.tsx
├── musim-dan-iklim/page.tsx
├── persiapan/page.tsx
├── booking/
│   ├── page.tsx
│   └── [kode]/page.tsx
├── syarat-ketentuan/page.tsx
├── kebijakan-pembatalan/page.tsx
├── kebijakan-privasi/page.tsx
└── api/booking/route.ts        # tetap

components/
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── PageHeader.tsx
└── (komponen seksi yang sudah ada)
```

---

## 3. Komponen Bersama

### 3.1 Navbar (`components/layout/Navbar.tsx`)

- Tetap sticky dengan `backdrop-blur-md bg-white/90` dan garis bawah tipis `--border`.
- Logo teks Rinjani Trek + badge `3.726 m dpl · Lombok`.
- Tautan berubah dari anchor menjadi rute, dengan penanda halaman aktif (garis bawah `--danau`):
  - Gunung Rinjani → `/gunung-rinjani`
  - Jalur Pendakian → `/jalur-pendakian`
  - Musim & Iklim → `/musim-dan-iklim`
  - Persiapan → `/persiapan`
  - Paket → `/#paket`
- Tombol CTA **Pesan pendakian** (`--fajar`) → `/booking`.
- Mobile: menu hamburger berisi tautan yang sama, CTA tetap terlihat.
- Di `/booking`: versi ringan tanpa efek tambahan.

### 3.2 PageHeader (`components/layout/PageHeader.tsx`)

Dipakai semua halaman dalam agar seragam.

- Props: `judul`, `deskripsi`, `breadcrumb` (array `{label, href}`), `eyebrow` (opsional, misalnya "Profil Gunung").
- Isi: breadcrumb kecil, judul besar, deskripsi satu sampai dua kalimat, garis pembatas tipis di bawah.
- Tanpa gambar latar besar agar halaman tetap ringan; foto cukup muncul di dalam konten.

### 3.3 Footer (`components/layout/Footer.tsx`)

Footer saat ini belum ada. Rancangan:

**Gaya**
- Latar `--fg` (`#191f26`), teks putih, tautan putih 70% dengan hover putih penuh.
- Garis pemisah antar blok memakai putih 12%.
- Tanpa emoji dan tanpa ikon dekoratif; ikon sosial boleh berupa teks atau SVG sederhana monokrom.

**Struktur (desktop 4 kolom, mobile bertumpuk)**

| Kolom | Isi |
|---|---|
| **Identitas** | Logo teks Rinjani Trek, satu kalimat deskripsi faktual (misalnya "Operator pendakian Gunung Rinjani, Lombok. Pemandu berlisensi dan simaksi resmi TNGR."), badge `3.726 m dpl` |
| **Jelajahi** | Gunung Rinjani, Jalur Pendakian, Musim & Iklim, Persiapan, Paket, Pesan Pendakian |
| **Jalur** | Sembalun, Senaru, Torean, Timbanuh, Aik Berik (masing-masing tautan ke `/jalur-pendakian#nama-jalur`) |
| **Kontak** | Nomor WhatsApp (tautan `wa.me/62...`), email, alamat kantor atau titik kumpul (Sembalun / Senaru), jam respons (contoh: 08.00–20.00 WITA) |

**Blok informasi resmi (satu baris di atas bar bawah)**
- Tautan ke informasi resmi Balai Taman Nasional Gunung Rinjani dan aplikasi e-Rinjani.
- Catatan: "Rinjani Trek adalah operator pendakian swasta dan bukan situs resmi TNGR."

**Bar bawah**
- Kiri: `© 2026 Rinjani Trek. Hak cipta dilindungi.`
- Kanan: Syarat & Ketentuan · Kebijakan Pembatalan · Kebijakan Privasi
- Opsional: tautan Instagram / WhatsApp Channel jika ada.

**Catatan teknis**
- Server component (tanpa `"use client"`) agar ringan.
- Letakkan di `app/layout.tsx` setelah `{children}`, sehingga muncul di semua halaman.
- Data tautan disimpan di satu konstanta (`lib/site.ts`) agar Navbar dan Footer memakai sumber yang sama.
- Kontak (nomor WA, email) juga diambil dari `lib/site.ts` supaya mudah diganti.

Contoh kerangka data:

```ts
// lib/site.ts
export const SITE = {
  nama: "Rinjani Trek",
  deskripsi:
    "Operator pendakian Gunung Rinjani, Lombok. Pemandu berlisensi dan simaksi resmi TNGR.",
  kontak: {
    whatsapp: "62xxxxxxxxxxx",
    email: "halo@rinjanitrek.id",
    jamRespons: "08.00–20.00 WITA",
  },
  nav: [
    { label: "Gunung Rinjani", href: "/gunung-rinjani" },
    { label: "Jalur Pendakian", href: "/jalur-pendakian" },
    { label: "Musim & Iklim", href: "/musim-dan-iklim" },
    { label: "Persiapan", href: "/persiapan" },
    { label: "Paket", href: "/#paket" },
  ],
  legal: [
    { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    { label: "Kebijakan Pembatalan", href: "/kebijakan-pembatalan" },
    { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
  ],
};
```

---

## 4. Rancangan Tiap Halaman

### 4.1 Home (`/`)

Urutan seksi:

1. Hero parallax (sudah ada)
2. `MountainFacts`: strip 4 data utama (sudah ada)
3. Cuplikan profil: 2 paragraf dari `MountainAbout` + tombol "Baca profil lengkap" → `/gunung-rinjani`
4. Ringkasan 5 jalur (nama, sisi, durasi) + tautan → `/jalur-pendakian`
5. Status musim satu baris ("Dibuka April–Desember, ditutup Januari–Maret") + tautan → `/musim-dan-iklim`
6. Galeri 6 foto pilihan + tautan ke galeri lengkap di `/gunung-rinjani`
7. `Packages`: 3 paket, tombol "Pesan paket ini" → `/booking?paket=...`
8. Ringkasan keselamatan dan regulasi + tautan → `/persiapan`
9. CTA band → `/booking`
10. Footer

### 4.2 Profil Gunung (`/gunung-rinjani`)

- PageHeader.
- Fakta utama (`MountainFacts` versi penuh).
- Geologi: kaldera Samalas 1257, pembentukan Segara Anak, Barujari.
- **Baru:** sejarah penamaan dan status geopark UNESCO.
- Flora dan fauna (`NatureCulture`).
- Tradisi Mulang Pekelem dan Aik Kalak.
- Galeri penuh dengan lightbox.
- Tautan lanjutan ke jalur dan booking.

### 4.3 Jalur Pendakian (`/jalur-pendakian`)

- PageHeader.
- `TrailTabs` dengan 5 rute (tiap rute punya `id` agar bisa ditautkan dari footer).
- **Baru:** peta jalur sederhana (SVG) berisi lima rute dan titik kemah.
- **Baru:** profil elevasi per rute (grafik naik-turun).
- Tabel perbandingan ringkas: elevasi awal, titik tertinggi, durasi, kesulitan, sumber air.

### 4.4 Musim dan Iklim (`/musim-dan-iklim`)

- PageHeader.
- Kalender 12 bulan (buka/tutup) dalam bentuk strip, bukan kartu.
- Profil suhu per ketinggian (puncak, Plawangan, Segara Anak).
- Sistem layering pakaian.

### 4.5 Persiapan (`/persiapan`)

- PageHeader.
- Regulasi TNGR: kuota e-Rinjani, pemandu wajib, pack-in pack-out, surat sehat.
- **Baru:** daftar perlengkapan (dibagi: wajib, disediakan operator, opsional).
- **Baru:** persiapan fisik dan tingkat kebugaran.
- **Baru:** FAQ (sinyal ponsel, air bersih, toilet, pengisian daya, kondisi kesehatan).

### 4.6 Booking (`/booking`)

- Layout dua kolom: form di kiri, ringkasan paket dan biaya di kanan (sticky di desktop, kolaps di mobile).
- Baca `?paket=` untuk mengisi pilihan awal.
- Validasi sisi klien dengan pesan error per kolom.
- Normalisasi nomor WhatsApp ke format `62...`.
- Status loading, error, dan sukses yang jelas.
- Rincian biaya per tiket (WNI/WNA) tampil transparan.
- Setelah sukses, arahkan ke `/booking/[kode]`.

### 4.7 Konfirmasi (`/booking/[kode]`)

- Kode reservasi, ringkasan pesanan, langkah berikutnya.
- Untuk sementara memakai data dari response API; nanti disambungkan ke database dan status bayar.

---

## 5. Refactor Komponen Versi Ringkas

Agar tidak menduplikasi kode, tiap komponen seksi menerima prop `ringkas`.

```tsx
<MountainAbout ringkas />   // di home: 2 paragraf + tombol "Baca selengkapnya"
<MountainAbout />           // di /gunung-rinjani: versi penuh
```

Komponen yang perlu prop ini: `MountainAbout`, `TrailTabs`, `SeasonGuide`, `Safety`, `Gallery`.

Catatan performa:
- GSAP, Lenis, dan parallax hanya dimuat di home. Halaman lain memakai komponen statis atau animasi ringan.
- Gambar memakai `next/image` dengan ukuran sesuai tampilan.
- Periksa Lighthouse mobile untuk home, khususnya hero 8 lapisan.

---

## 6. SEO dan Metadata

Setiap halaman memiliki `metadata` sendiri:

| Halaman | Contoh judul | Fokus kata kunci |
|---|---|---|
| `/` | Rinjani Trek: Paket Pendakian Gunung Rinjani | paket pendakian Rinjani |
| `/gunung-rinjani` | Profil Gunung Rinjani: Kaldera, Segara Anak, Barujari | profil Gunung Rinjani |
| `/jalur-pendakian` | 5 Jalur Pendakian Rinjani: Sembalun, Senaru, Torean | jalur pendakian Rinjani |
| `/musim-dan-iklim` | Jadwal Buka Pendakian Rinjani dan Suhu di Puncak | jadwal buka Rinjani |
| `/persiapan` | Persiapan Mendaki Rinjani: Regulasi, Perlengkapan, FAQ | persiapan mendaki Rinjani |
| `/booking` | Pesan Pendakian Rinjani | pesan trip Rinjani |

Tambahan:
- Gambar OG per halaman.
- `sitemap.ts` dan `robots.ts`.
- Data terstruktur (`Organization` di layout, `FAQPage` di `/persiapan`, `Product`/`Offer` untuk paket).
- Breadcrumb markup di PageHeader.

---

## 7. Urutan Pengerjaan

1. **Fondasi:** `lib/site.ts`, Navbar baru, Footer, PageHeader.
2. **`/gunung-rinjani`:** halaman profil pertama, menjadi pola untuk halaman lain.
3. **Home:** rapikan menjadi versi ringkas dengan tautan ke tiap halaman.
4. **`/jalur-pendakian`, `/musim-dan-iklim`, `/persiapan`.**
5. **`/booking` dan `/booking/[kode]`.**
6. **Halaman legal** (syarat, pembatalan, privasi).
7. **SEO, sitemap, dan uji performa mobile.**

---

## 8. Checklist

### Fondasi
- [ ] `lib/site.ts` (nav, kontak, legal)
- [ ] Navbar dengan penanda halaman aktif dan menu mobile
- [ ] Footer 4 kolom + blok info resmi + bar bawah
- [ ] PageHeader dengan breadcrumb

### Halaman
- [ ] `/gunung-rinjani`
- [ ] `/jalur-pendakian` (+ peta SVG dan profil elevasi)
- [ ] `/musim-dan-iklim`
- [ ] `/persiapan` (+ perlengkapan dan FAQ)
- [ ] `/booking` (+ baca `?paket=`)
- [ ] `/booking/[kode]`
- [ ] Tiga halaman legal

### Home
- [ ] Prop `ringkas` pada komponen seksi
- [ ] Tombol paket mengarah ke `/booking?paket=...`
- [ ] CTA band sebelum footer

### Kualitas
- [ ] Tampilan mobile diuji di layar 360–414 px
- [ ] Metadata dan OG per halaman
- [ ] Lighthouse mobile untuk home dan booking
- [ ] Kepatuhan anti AI-slop (tanpa emoji dekoratif, tanpa hiperbola, data konkret)

---

## 9. Ditunda ke Tahap Berikutnya

- Integrasi Supabase (`bookings`, `participants`, `departures`, `notifications_log`)
- Dashboard admin / CMS dan manifes pendaki
- Notifikasi WhatsApp (Fonnte atau Cloud API) dan email (Resend)
- Payment gateway (Midtrans / Xendit) dan webhook status bayar

Bentuk data form dan response API dijaga rapi sekarang agar tahap-tahap di atas bisa disambungkan tanpa mengubah tampilan.
