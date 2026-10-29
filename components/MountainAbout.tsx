import Link from "next/link";

interface MountainAboutProps {
  ringkas?: boolean;
}

export default function MountainAbout({ ringkas = false }: MountainAboutProps) {
  return (
    <section id="karakter" className="bg-white py-20 md:py-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Kolom Teks Utama */}
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-3">
              Geologi & Morfologi
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-fg font-normal tracking-tight leading-tight">
              Satu kaldera besar, satu kerucut muda di tengah danau
            </h2>

            <div className="mt-8 space-y-5 text-fg-muted text-base sm:text-lg leading-relaxed">
              <p>
                Rinjani terbentuk dari runtuhan letusan masa purba yang meninggalkan kaldera seluas 50 kilometer persegi.
                Di dasar kaldera pada ketinggian 2.000 meter, tergenang Danau Segara Anak berair toska dengan kedalaman
                mencapai 230 meter.
              </p>
              <p>
                Dari perut danau muncul kerucut vulkanik baru, Gunung Barujari, yang terus tumbuh dan terakhir
                meletus pada tahun 2016. Di tepian danau terdapat mata air panas alami Aik Kalak yang bersumber
                langsung dari aktivitas hidrotermal di bawah dasar kaldera.
              </p>
              {!ringkas && (
                <>
                  <p>
                    Letusan kataklisma Gunung Samalas pada tahun 1257 Masehi diakui sebagai salah satu letusan vulkanik
                    terbesar dalam sejarah bumi, melontarkan lebih dari 40 kilometer kubik batuan piroklastik dan
                    menghasilkan musim dingin vulkanik global. Sisa struktur kerucut purba inilah yang membentuk
                    kompleks Rinjani-Samalas modern.
                  </p>
                  <p>
                    Bentang alam ini diakui secara internasional sebagai bagian dari UNESCO Global Geopark Rinjani-Lombok,
                    menjadi tumpuan hidrologis Pulau Lombok yang menyuplai air tanah dan belasan sungai utama.
                  </p>
                </>
              )}
            </div>

            {ringkas && (
              <div className="mt-8 pt-4">
                <Link
                  href="/gunung-rinjani"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-danau hover:text-danau-hover transition-colors group"
                >
                  <span>Baca profil geologi, sejarah & ekologi lengkap</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Kolom Visual Foto Dokumentasi Asli */}
          <div className="lg:col-span-5">
            <figure className="overflow-hidden rounded-lg border border-border bg-bg-subtle shadow-sm">
              <img
                src="/gallery/segara-anak.jpg"
                alt="Danau Segara Anak dan kerucut Gunung Barujari dilihat dari bibir tebing Plawangan"
                className="w-full aspect-[4/3] object-cover"
              />
              <figcaption className="p-4 text-xs text-fg-muted border-t border-border bg-white">
                <span className="font-medium text-fg block mb-0.5">Danau Segara Anak & Gunung Barujari</span>
                Diambil dari tebing Plawangan pada elevasi 2.639 m dpl saat cuaca cerah di musim kemarau.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
