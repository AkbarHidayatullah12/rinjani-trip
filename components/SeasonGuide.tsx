import Link from "next/link";

interface SeasonGuideProps {
  ringkas?: boolean;
}

const months = [
  { name: "Jan", status: "closed", note: "Tutup (Pemulihan & Cuaca)" },
  { name: "Feb", status: "closed", note: "Tutup (Hujan Lebat)" },
  { name: "Mar", status: "closed", note: "Tutup (Pemulihan)" },
  { name: "Apr", status: "open", note: "Buka (Awal Musim)" },
  { name: "Mei", status: "open", note: "Buka (Savana Menghijau)" },
  { name: "Jun", status: "peak", note: "Terbaik (Cerah & Sejuk)" },
  { name: "Jul", status: "peak", note: "Paling Stabil (Langit Bersih)" },
  { name: "Agu", status: "peak", note: "Paling Stabil (Jalur Kering)" },
  { name: "Sep", status: "peak", note: "Terbaik (Sunrise Jernih)" },
  { name: "Okt", status: "open", note: "Buka (Peralihan)" },
  { name: "Nov", status: "open", note: "Buka (Hujan Ringan)" },
  { name: "Des", status: "open", note: "Buka (Akhir Musim)" },
];

export default function SeasonGuide({ ringkas = false }: SeasonGuideProps) {
  return (
    <section id="musim" className="bg-white py-20 md:py-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-2">
              Klimatologi & Regulasi Kalender
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-fg font-normal tracking-tight">
              Musim pendakian dan profil suhu kaldera
            </h2>
            <p className="mt-3 text-fg-muted text-base leading-relaxed">
              Balai Taman Nasional Gunung Rinjani menetapkan kalender buka-tutup jalur berdasarkan siklus muson barat
              dan intensitas curah hujan di kawasan kaldera.
            </p>
          </div>

          {ringkas && (
            <Link
              href="/musim-dan-iklim"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-danau hover:text-danau-hover transition-colors whitespace-nowrap"
            >
              <span>Pelajari kalender cuaca & layering</span>
              <span>→</span>
            </Link>
          )}
        </div>

        {/* Kalender 12 Bulan Strip (Sesuai Rencana: Strip, bukan kartu) */}
        {!ringkas && (
          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-faint mb-3">
              Status Operasional Jalur Per Bulan
            </p>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 text-center">
              {months.map((m) => {
                const isClosed = m.status === "closed";
                const isPeak = m.status === "peak";
                return (
                  <div
                    key={m.name}
                    className={`p-2.5 rounded border text-xs transition-colors ${
                      isClosed
                        ? "bg-bg-subtle border-border text-fg-faint"
                        : isPeak
                        ? "bg-danau/10 border-danau/30 text-danau font-semibold"
                        : "bg-white border-border text-fg"
                    }`}
                  >
                    <span className="block font-medium">{m.name}</span>
                    <span
                      className={`block text-[10px] mt-1 ${
                        isClosed ? "text-fajar font-medium" : isPeak ? "text-danau" : "text-fg-muted"
                      }`}
                    >
                      {isClosed ? "Tutup" : isPeak ? "Puncak" : "Buka"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-fg-faint">
              *Juli–September merupakan bulan dengan stabilitas atmosfer tertinggi dan curah hujan terendah.
            </p>
          </div>
        )}

        {/* Tabel Kalender Operasional Resmi */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-border rounded-lg p-6 bg-bg-subtle">
            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-danau">Jalur Dibuka</span>
              <span className="text-sm font-semibold text-fg">April — Desember</span>
            </div>
            <p className="mt-4 text-sm text-fg-muted leading-relaxed">
              Bulan terbaik dengan langit cerah dan curah hujan terendah adalah <strong>Juli hingga September</strong>.
              Pada bulan-bulan ini, jalur pasir menuju puncak kering dan stabil untuk dipijak.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 bg-bg-subtle">
            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-fajar">Jalur Ditutup Total</span>
              <span className="text-sm font-semibold text-fg">Januari — Maret</span>
            </div>
            <p className="mt-4 text-sm text-fg-muted leading-relaxed">
              Jalur ditutup total setiap musim hujan lebat demi keselamatan dari risiko longsor tebing kaldera,
              serta memberi waktu bagi pemulihan ekosistem savana dan hutan lindung.
            </p>
          </div>
        </div>

        {/* Rincian Suhu & Rekomendasi Pakaian */}
        {!ringkas && (
          <div className="mt-12 border-t border-border pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-fg">Suhu di Puncak (3.726 m)</h3>
              <p className="text-2xl font-display font-medium text-fg mt-2">0°C — 7°C</p>
              <p className="text-xs text-fg-muted mt-2 leading-relaxed">
                Menjelang subuh di punggungan puncak terbuka, angin kencang dapat menurunkan suhu efektif (windchill) hingga di bawah titik beku.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-fg">Suhu di Kaldera & Danau (2.000 m)</h3>
              <p className="text-2xl font-display font-medium text-fg mt-2">14°C — 22°C</p>
              <p className="text-xs text-fg-muted mt-2 leading-relaxed">
                Udara tepi danau relatif stabil. Sumber air panas alami Aik Kalak bersuhu sekitar 40°C, biasa digunakan pendaki untuk merelaksasi otot.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-fg">Sistem Lapisan Pakaian (Layering)</h3>
              <ul className="text-xs text-fg-muted mt-2 space-y-1.5 leading-relaxed">
                <li>• <strong>Lapisan dasar:</strong> Kaos dryfit sintetis atau wool merino (hindari katun).</li>
                <li>• <strong>Lapisan isolasi:</strong> Jaket fleece atau down jacket hangat.</li>
                <li>• <strong>Lapisan luar:</strong> Jaket tahan angin (windbreaker) dan jas hujan waterproof.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
