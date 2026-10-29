# Rinjani Trek — Ekspedisi Resmi Gunung Rinjani

Website resmi dan platform reservasi ekspedisi pendakian **Gunung Rinjani** (3.726 m dpl), Lombok, Nusa Tenggara Barat. Dibangun dengan arsitektur multi-halaman modern, hero parallax foto asli beresolusi tinggi (2.5D), integrasi kuota e-Rinjani Balai Taman Nasional Gunung Rinjani (TNGR), serta estetika **White Editorial** yang berakar pada bentang alam nyata Rinjani.

---

## 1. Filosofi & Karakter Desain

Website ini menerapkan prinsip **Anti AI-Slop Manifesto**:
- **Bukan Template Generik**: Menghindari kartu-kartu seragam dengan bayangan abu-abu identik, tombol melayang tanpa fungsi, dan dekorasi emoji yang kekanak-kanakan.
- **Palet Warna Alam Rinjani**: Warna elemen dan antarmuka diambil langsung dari subjek alam kaldera:
  - Abu-cokelat batu kaldera (`#191f26`) untuk tipografi utama berkontras tinggi.
  - Toska air Danau Segara Anak (`#1c5a60`) untuk tautan navigasi dan elemen interaktif.
  - Jingga semburat fajar puncak (`#bd481c`) untuk tombol tindakan utama (CTA).
  - Putih dan abu-abu kabut pelembut (`#ffffff`, `#f8fafc`) sebagai latar yang tenang dan bernapas.
- **Salinan Teks Nyata & Faktual**: Mengedepankan angka elevasi konkret, nama tempat geologis (Plawangan, Samalas 1257, Aik Kalak, Barujari), dan regulasi resmi TNGR, bukan kalimat klise hiperbolis.

---

## 2. Fitur Utama

### 2.1 Hero Parallax 8 Lapisan Foto Asli 1920×1080
- Menggunakan 8 lapisan terpisah beresolusi Full HD yang diekstraksi dari foto dokumentasi autentik:
  1. `01_langit`: Langit fajar dan cakrawala luas.
  2. `02_awan`: Awan dan kabut tinggi dengan animasi gerak melayang pelan (*drift*).
  3. `03_gunung_jauh`: Siluet punggungan gunung kejauhan.
  4. `04_kaldera`: Dinding tebing kawah megah Segara Anak.
  5. `05_air`: Permukaan air danau toska vulkanik (terkunci rapat dengan dinding kaldera).
  6. `06_kabut`: Kabut danau yang melayang mandiri di atas air (*looping drift*).
  7. `07_pulau`: Kerucut aktif Gunung Barujari di tengah danau.
  8. `08_terdepan`: Bingkai alami pepohonan pinus dan batuan tebing gardu pandang terdepan.
- **Interaktivitas Sensorik**: Mendukung pelacakan kursor mouse dengan interpolasi fisika (*lerp easing* `0.08`), sensor giroskop miring pada ponsel (kompatibel iOS Safari & Android), serta mode *idle auto-sway* yang mengayun lembut otomatis saat tidak ada interaksi.
- **Sinkronisasi Anti-Tearing**: Kecepatan gerak kaldera, danau, dan Barujari diselaraskan secara presisi sehingga tidak membuka celah dan tidak menimbulkan bayangan ganda (*ghosting*).

### 2.2 Struktur Multi-Halaman Lengkap
- **`/` (Beranda Ringkas)**: Pintu depan yang ringan dan cepat. Menampilkan hero parallax, strip data teknis, cuplikan ringkas tiap seksi, pilihan paket, dan ajakan reservasi (*CTA band*).
- **`/gunung-rinjani` (Profil Lengkap)**: Eksplorasi mendalam mengenai sejarah letusan kataklisma Gunung Samalas 1257, pembentukan kaldera Segara Anak, status UNESCO Global Geopark, biodiversitas flora-fauna, tradisi sakral *Mulang Pekelem*, dan galeri foto penuh + *lightbox*.
- **`/jalur-pendakian` (5 Jalur Resmi)**: Panduan komparasi rute Sembalun, Senaru, Torean, Timbanuh, dan Aik Berik. Dilengkapi diagram skematik topografi dan profil elevasi SVG serta tabel matriks spesifikasi teknis.
- **`/musim-dan-iklim` (Musim & Suhu)**: Strip kalender operasional 12 bulan buka-tutup TNGR, profil suhu windchill puncak ($0^\circ\text{C}-5^\circ\text{C}$), sistem layering pakaian, dan protokol pencegahan hipotermia/dehidrasi savana.
- **`/persiapan` (Kesiapan Ekspedisi)**: Regulasi resmi e-Rinjani TNGR, checklist perlengkapan 3 kategori (wajib, disediakan operator, opsional), program latihan fisik 4 minggu, serta tanya jawab teknis lapangan (FAQ).
- **`/booking` (Formulir Pemesanan Interaktif)**: Layout dua kolom (formulir pendaftaran di kiri dan ringkasan paket serta estimasi biaya yang *sticky* di kanan). Membaca prefill `?paket=`, validasi input sisi klien, dan normalisasi nomor WhatsApp ke format internasional (`62...`).
- **`/booking/[kode]` (Konfirmasi Reservasi)**: Halaman status pengajuan booking dengan kode referensi unik `RJN-XXXXXX`, ringkasan jadwal, instruksi langkah verifikasi, serta tautan konfirmasi cepat ke WhatsApp admin.
- **Halaman Legalitas**:
  - `/syarat-ketentuan`: Ketentuan layanan, batas kesehatan, dan *force majeure*.
  - `/kebijakan-pembatalan`: Skema pengembalian dana berjenjang dan perubahan jadwal (*reschedule*).
  - `/kebijakan-privasi`: Kebijakan perlindungan data identitas pendaki untuk tiket e-Rinjani.

### 2.3 Performa, Animasi, & SEO
- **Lenis Smooth Scroll**: Pengguliran halaman yang sangat mulus, tersinkronisasi langsung dengan ticker GSAP dan ScrollTrigger.
- **SEO & OpenGraph**: Konfigurasi metadata dinamis per halaman, kartu OpenGraph, generator peta situs otomatis (`/sitemap.xml`), dan crawler rules (`/robots.txt`).

---

## 3. Tech Stack

- **Framework**: [Next.js 15.5](https://nextjs.org/) (App Router, Server & Client Components)
- **Bahasa**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4.3](https://tailwindcss.com/) (`@theme` dengan CSS custom variables)
- **Animasi**: [GSAP 3.15](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Smooth Scrolling**: [Lenis 1.3](https://lenis.darkroom.engineering/)
- **Pengolahan Citra Aset**: Format WebP terkompresi dengan cadangan PNG Full HD

---

## 4. Struktur Direktori

```
e:\rinjani-trip/
├── app/
│   ├── api/
│   │   └── booking/route.ts      # API endpoint penerimaan pendaftaran reservasi
│   ├── booking/
│   │   ├── [kode]/page.tsx       # Halaman bukti & status reservasi RJN-XXXXXX
│   │   └── page.tsx              # Halaman formulir pemesanan 2 kolom
│   ├── gunung-rinjani/page.tsx   # Halaman profil lengkap geologi & budaya
│   ├── jalur-pendakian/page.tsx  # Halaman perbandingan 5 jalur & peta SVG
│   ├── musim-dan-iklim/page.tsx  # Halaman kalender operasional & suhu
│   ├── persiapan/page.tsx        # Halaman regulasi TNGR, gear list, & FAQ
│   ├── syarat-ketentuan/page.tsx # Halaman legal syarat & ketentuan
│   ├── kebijakan-pembatalan/page.tsx # Halaman legal aturan refund & reschedule
│   ├── kebijakan-privasi/page.tsx# Halaman legal privasi data
│   ├── globals.css               # Definisi palet warna editorial & token tema
│   ├── layout.tsx                # Shell root: Navbar, Footer, SmoothScroll, SEO
│   ├── page.tsx                  # Beranda ringkas
│   ├── robots.ts                 # Generator robots.txt dinamis
│   └── sitemap.ts                # Generator sitemap.xml dinamis
├── components/
│   ├── booking/
│   │   ├── BookingConfirmClient.tsx # Tampilan status konfirmasi kode booking
│   │   └── BookingView.tsx       # Form interaktif pemesanan 2 kolom
│   ├── layout/
│   │   ├── Footer.tsx            # Footer 4 kolom & legalitas
│   │   ├── Navbar.tsx            # Navigasi sticky rute aktif & drawer mobile
│   │   └── PageHeader.tsx        # Header seragam halaman dalam dengan breadcrumb
│   ├── Gallery.tsx               # Galeri dokumentasi + modal lightbox
│   ├── Itinerary.tsx             # Linimasa tahapan ekspedisi
│   ├── MountainAbout.tsx         # Narasi kaldera (mendukung prop ringkas)
│   ├── MountainFacts.tsx         # Strip data spesifikasi elevasi 3.726 m dpl
│   ├── NatureCulture.tsx         # Biodiversitas & tradisi Mulang Pekelem
│   ├── Packages.tsx              # Pilihan paket trip terkelola
│   ├── ParallaxHero.tsx          # Hero 8 lapisan foto HD 1920x1080 (2.5D)
│   ├── Safety.tsx                # Standar keselamatan (mendukung prop ringkas)
│   ├── SeasonGuide.tsx           # Kalender musim & suhu (mendukung prop ringkas)
│   ├── SmoothScroll.tsx          # Handler scroll Lenis + GSAP ticker
│   └── TrailTabs.tsx             # Komparator rute (mendukung prop ringkas)
├── lib/
│   ├── data.ts                   # Data paket trip, harga IDR, dan jadwal itinerary
│   ├── mountain.ts               # Data spesifikasi resmi TNGR
│   ├── site.ts                   # Konfigurasi master metadata, kontak, & tautan
│   └── trails.ts                 # Master data 5 jalur pendakian resmi
├── public/
│   ├── gallery/                  # Foto dokumentasi lapangan resolusi penuh
│   └── paralax/
│       ├── layers/               # 8 Lapisan Full HD aktif (.webp & .png)
│       └── layers_backup/        # Cadangan aman lapisan asli
├── AUDIT-WEBSITE.md              # Laporan audit lengkap komponen & status rute
├── RENCANA-FRONTEND.md           # Rencana acuan restrukturisasi front end
└── README.md                     # Dokumentasi utama proyek ini
```

---

## 5. Menjalankan Proyek Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18.18 atau yang lebih baru
- npm, pnpm, atau yarn

### Langkah Instalasi & Menjalankan

1. **Pasang Dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka peramban di [http://localhost:3000](http://localhost:3000).

3. **Pemeriksaan Tipe (Typecheck)**:
   ```bash
   npm run typecheck
   ```

4. **Build untuk Produksi**:
   ```bash
   npm run build
   npm run start
   ```

---

## 6. Integrasi & Rencana Tahap Lanjutan (Backend)

Struktur data formulir dan rute API saat ini telah disiapkan agar dapat dihubungkan dengan mulus pada tahap berikutnya:
1. **Basis Data Supabase (PostgreSQL)**:
   - Tabel `packages`, `departures` (kuota harian), `bookings`, dan `participants`.
   - Penguncian kuota atomik (*concurrency lock*) saat pembuatan booking.
2. **Payment Gateway**:
   - Midtrans Snap atau Xendit Invoice untuk pembayaran otomatis via QRIS, Virtual Account, dan Kartu Kredit.
3. **Notifikasi Otomatis**:
   - Integrasi WhatsApp API (Fonnte / Cloud API) dan Email (Resend) untuk pengiriman invoice dan e-tiket simaksi.
4. **Dashboard Admin**:
   - Panel kelola manifes tim pemandu dan porter di pos registrasi Sembalun/Senaru.
