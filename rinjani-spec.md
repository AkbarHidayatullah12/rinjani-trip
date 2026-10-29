# Spesifikasi: Website Rinjani Trek (parallax + booking)

Dokumen ini jadi pedoman pengembangan. Basis kodenya adalah prototipe `rinjani-trip` (Next.js 15, TypeScript, Tailwind v4, GSAP + ScrollTrigger, Lenis).

## 1. Tujuan

Website pemesanan trip pendakian Gunung Rinjani dengan tampilan parallax. Halaman beranda berfungsi sebagai profil gunung, lalu mengarahkan pengunjung ke paket dan pemesanan.

## 2. Perubahan dari prototipe

| # | Perubahan | Prioritas | Status |
|---|-----------|-----------|--------|
| 1 | Tema website putih & elegan (Anti AI-Slop) | Tinggi | ✅ Selesai (Palet alami: batu kaldera, air toska, fajar) |
| 2 | Beranda berisi profil Gunung Rinjani | Tinggi | ✅ Selesai (Struktur editorial & data faktual konkret) |
| 3 | Integrasi foto asli dokumentasi | Tinggi | ✅ Selesai (Foto `public/gallery/` aktif di Galeri & Profil) |
| 4 | Hero parallax foto asli HD 2.5D | Sedang | ✅ Selesai (8 lapisan Full HD 1920x1080 di `public/paralax/layers/`) |

> **Prinsip Desain Anti AI-Slop:** Menghindari template generik (tanpa kartu-kartu identik, tanpa dekorasi emoji, tanpa kata-kata hiperbola). Semua keputusan warna, bentuk, dan kata-kata berakar dari subjek nyata Rinjani: elevasi faktual, aturan TNGR, data suhu terukur, dan foto kaldera asli.

## 3. Tema Website (Dark Mountain / Dusk Atmosphere)

### Palet Warna
- **Latar belakang (`--bg`)**: Deep Slate `#0b1220`
- **Teks utama (`--fg`)**: Warm Sand `#f4ead8`
- **Aksen / Tombol (`--accent`)**: Ember Orange `#ff8a4c` (hover: `#ffa56f`)
- **Kartu konten (`--card`)**: `rgba(255, 255, 255, 0.05)` dengan border tipis `rgba(255, 255, 255, 0.1)`
- **Seksi alternatif (`--section-alt`)**: Dusk Navy `#111a2e`

### Keunggulan
- Kontras tinggi dan konsisten tanpa resiko kilatan tema salah (*FOUC*).
- Kode bersih tanpa overhead listener media-query atau local storage tema.
- Menampilkan foto pemandangan dan Danau Segara Anak dengan kontras visual maksimal.

## 4. Beranda = profil gunung

Hero tetap di atas dengan posisi judul yang disesuaikan agar siluet puncak tetap terlihat. Setelah hero, beranda memperkenalkan Rinjani dalam urutan berikut:

1. **Ringkasan cepat** (`MountainFacts.tsx`): Ketinggian (3.726 mdpl), Lokasi, Status TNGR, Jenis vulkanik.
2. **Tentang gunung** (`MountainAbout.tsx`): Gambaran umum kaldera, Danau Segara Anak, kerucut Barujari, lengkap dengan foto fitur asli `public/gallery/segara-anak.jpg`.
3. **Jalur pendakian** (`TrailTabs.tsx`): Tab interaktif untuk Sembalun, Senaru, Torean, Timbanuh, Aik Berik lengkap dengan durasi, karakter, dan tingkat kesulitan.
4. **Musim terbaik dan cuaca** (`SeasonGuide.tsx`): Periode buka/tutup, suhu puncak & danau, panduan pakaian pendakian.
5. **Alam dan budaya** (`NatureCulture.tsx`): Flora, fauna, sumber air panas, dan tradisi Mulang Pekelem masyarakat Sasak.
6. **Keselamatan** (`Safety.tsx`): Fisik, aklimatisasi, regulasi TNGR, daftar perlengkapan wajib.
7. **Galeri foto** (`Gallery.tsx`): Grid foto interaktif memuat gambar asli dari `public/gallery/` (`segara-anak.jpg`, `gunung-rinjani.jpg`) dilengkapi modal preview / lightbox (keyboard & navigation support).
8. Lanjut ke **Paket trip → Itinerary → Form pemesanan** (sudah terintegrasi).

> Catatan: Data profil terpusat di `lib/mountain.ts` sehingga mudah diperbarui.

## 5. Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 (`@theme inline`)
- GSAP + ScrollTrigger (parallax), Lenis (scroll halus)
- `next/image` dengan format WebP/AVIF / optimized assets
- Supabase (PostgreSQL, auth, storage foto)
- Midtrans atau Xendit (pembayaran), Stripe atau PayPal untuk turis asing
- Resend (email), WhatsApp Cloud API / Fonnte (notifikasi)
- Vercel (hosting)

## 6. Struktur proyek

```
app/
  layout.tsx            font, navbar, smooth scroll
  page.tsx              hero → profil gunung → paket → itinerary → booking
  globals.css           variabel tema Dark Dusk Mountain, Tailwind v4 @theme inline
  api/booking/route.ts
components/
  Navbar.tsx            navbar responsif dengan link menu & CTA booking
  SmoothScroll.tsx      integrasi GSAP ScrollTrigger + Lenis
  ParallaxHero.tsx      hero parallax berlapis atmosferik Rinjani
  MountainFacts.tsx     kartu ringkasan angka/fakta
  MountainAbout.tsx     gambaran umum kaldera & foto fitur Segara Anak
  TrailTabs.tsx         tab navigasi jalur pendakian
  SeasonGuide.tsx       musim pendakian, cuaca, & tips perlengkapan
  NatureCulture.tsx     flora, fauna, air panas, budaya Sasak
  Safety.tsx            panduan keselamatan & perlengkapan wajib
  Gallery.tsx           grid foto asli + lightbox fullscreen viewer
  Packages.tsx          daftar paket trip
  Itinerary.tsx         garis waktu perjalanan
  BookingForm.tsx       formulir pemesanan trip
lib/
  data.ts               data paket & itinerary trip
  mountain.ts           data konten profil Gunung Rinjani
public/
  gallery/              foto-foto asli pendakian (*.jpg, *.webp)
    segara-anak.jpg     Danau Segara Anak & Gunung Barujari
    gunung-rinjani.jpg  Pemandangan puncak Rinjani
  hero/                 lapisan grafis parallax
```

## 7. Model data (Supabase)

- `packages` (id, slug, name, duration_days, route, price_idr, price_usd, description)
- `departures` (id, package_id, date, quota, booked)
- `bookings` (id, departure_id, status [pending/paid/cancelled], participants, total, contact_name, email, whatsapp, nationality, notes, created_at)
- `participants` (id, booking_id, full_name, id_number, health_notes, emergency_contact)

Kuota dikunci dalam satu transaksi saat membuat booking agar tidak terjadi pemesanan berlebih.

## 8. Alur pemesanan

1. Pengunjung memilih paket dan tanggal, mengisi data.
2. API memvalidasi input (zod) dan mengecek kuota.
3. Booking disimpan berstatus `pending`, transaksi Midtrans/Xendit dibuat.
4. Pengunjung membayar. Webhook mengubah status menjadi `paid`.
5. Email dan WhatsApp konfirmasi terkirim.
6. Kebijakan pembatalan dan jadwal ulang ditampilkan jelas (penutupan jalur karena cuaca sering terjadi).

## 9. Performa dan aksesibilitas

- Animasi hanya `transform` dan `opacity`.
- Efek parallax dikurangi di HP, dimatikan bila `prefers-reduced-motion`.
- Teks selalu HTML asli, bukan di dalam gambar.
- Gambar dioptimasi, target LCP di bawah 2,5 detik.
- Navigasi dan form bisa dipakai dengan keyboard. Setiap gambar punya `alt`.
- Multi-bahasa (Indonesia dan Inggris) lewat `next-intl`, karena banyak pendaki dari mancanegara.

## 10. Status & Urutan pengerjaan

- [x] **1. Tema disatukan ke tema tunggal Dark Dusk Mountain** (bersih, konsisten, tanpa toggle siang/malam)
- [x] **2. Navbar + bagian profil gunung** (konten di `lib/mountain.ts`, `MountainFacts`, `MountainAbout`, `TrailTabs`, `SeasonGuide`, `NatureCulture`, `Safety`, `Gallery`)
- [x] **3. Foto asli per lapisan parallax & galeri** (4 lapisan foto WebP aktif di `public/hero/` & foto dokumentasi aktif di galeri)
- [ ] **4. Database Supabase + data paket dan jadwal**
- [ ] **5. API booking + pembayaran + webhook** (Midtrans / Xendit)
- [ ] **6. Email / WhatsApp konfirmasi** (Resend / Fonnte)
- [ ] **7. Admin panel** (jadwal, kuota, pemesanan)
- [ ] **8. i18n, SEO, uji performa, deploy**

## 11. Catatan

- Harga dan teks di prototipe saat ini merupakan contoh (dapat diubah sesuai data resmi/database).
- Posisi judul teks hero sudah disesuaikan agar tidak menutupi puncak Rinjani dan dilengkapi drop shadow.
