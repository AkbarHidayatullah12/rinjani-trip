import Link from "next/link";
import { packages, formatIdr } from "@/lib/data";

export default function Packages() {
  return (
    <section id="paket" className="bg-white py-20 md:py-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-2">
            Pilihan Ekspedisi
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-fg font-normal tracking-tight">
            Paket pendakian terkelola resmi
          </h2>
          <p className="mt-3 text-fg-muted text-base leading-relaxed">
            Semua paket mencakup tiket masuk resmi e-Rinjani TNGR, asuransi pendakian, pemandu berlisensi, tim porter logistik,
            tenda berkualitas gunung tahan badai, matras tebal, serta tiga kali santap hangat setiap hari.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, idx) => {
            const isFeatured = idx === 1; // 3D2N Crossing Trek
            return (
              <div
                key={pkg.id}
                className={`flex flex-col rounded-lg border p-8 transition-shadow ${
                  isFeatured
                    ? "border-danau bg-bg-subtle ring-1 ring-danau/20 shadow-md"
                    : "border-border bg-white shadow-sm"
                }`}
              >
                {isFeatured && (
                  <span className="text-xs uppercase font-semibold tracking-wider text-danau mb-3 block">
                    Rute Paling Lengkap & Populer
                  </span>
                )}

                <h3 className="font-display text-2xl text-fg font-semibold">{pkg.name}</h3>
                <p className="text-xs text-fg-muted mt-1 font-medium">{pkg.duration} · {pkg.route}</p>

                <p className="text-sm text-fg-muted mt-4 leading-relaxed">
                  {pkg.summary}
                </p>

                <div className="my-6 border-t border-border pt-6 flex-1">
                  <span className="text-xs uppercase font-medium text-fg-faint tracking-wider block mb-3">
                    Fasilitas ekspedisi
                  </span>
                  <ul className="space-y-2 text-xs text-fg-muted">
                    {pkg.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-danau mt-0.5">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border pt-6 mt-auto">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xs text-fg-faint">Biaya per peserta</span>
                    <span className="font-display text-2xl font-semibold text-fg">
                      {formatIdr(pkg.priceIdr)}
                    </span>
                  </div>

                  <Link
                    href={`/booking?paket=${pkg.id}`}
                    className={`block w-full py-2.5 px-4 text-center text-sm font-medium rounded-md transition-colors ${
                      isFeatured
                        ? "bg-fajar text-white hover:bg-fajar-hover shadow-sm"
                        : "border border-border text-fg hover:bg-bg-subtle hover:border-fg-muted"
                    }`}
                  >
                    Pesan paket {pkg.duration.split(" ")[0]} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
