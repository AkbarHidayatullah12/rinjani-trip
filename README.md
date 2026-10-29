# Rinjani Trek: prototipe website parallax + booking

Stack: Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Struktur

```
app/
  layout.tsx            layout + SmoothScroll (Lenis)
  page.tsx              susunan halaman
  api/booking/route.ts  STUB API pemesanan
components/
  SmoothScroll.tsx      Lenis disambung ke ticker GSAP
  ParallaxHero.tsx      hero parallax berlapis (data-speed per lapisan)
  Packages.tsx          kartu paket
  Itinerary.tsx         timeline yang terisi saat scroll
  BookingForm.tsx       form pemesanan
lib/data.ts             data paket (contoh)
```

## Cara kerja parallax

Setiap lapisan hero punya atribut `data-speed`. Saat hero digulir keluar,
GSAP menggeser lapisan sebesar `speed × tinggi` memakai `transform`
(bukan `top`), jadi tetap ringan. Lapisan yang lebih dekat ke kamera memakai
speed lebih besar.

## Langkah berikutnya

1. Ganti SVG placeholder di `ParallaxHero.tsx` dengan foto Rinjani yang dipotong per lapisan (PNG/WebP transparan) lewat `next/image`.
2. Pindahkan data paket ke Supabase (tabel `packages`, `departures` dengan kuota, `bookings`).
3. Lengkapi `app/api/booking/route.ts`: validasi (zod), cek dan kunci kuota, simpan booking "pending", buat transaksi Midtrans/Xendit.
4. Tambah route webhook pembayaran, lalu kirim email (Resend) dan WhatsApp konfirmasi.
5. Tambah halaman admin (kelola jadwal, kuota, pemesanan), i18n (Indonesia/Inggris), dan foto asli.

Harga dan teks di prototipe ini hanya contoh.
