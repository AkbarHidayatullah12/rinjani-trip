import { itinerary } from "@/lib/data";

export default function Itinerary() {
  return (
    <section className="bg-bg-subtle py-24 border-b border-border">
      <div className="mx-auto max-w-4xl px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl text-fg font-normal tracking-tight">
            Linimasa perjalanan 3 hari 2 malam
          </h2>
          <p className="mt-3 text-fg-muted text-base leading-relaxed">
            Gambaran urutan rute melintasi Sembalun, puncak 3.726 m dpl, danau kawah, hingga pintu keluar Senaru.
          </p>
        </div>

        <div className="mt-12 border-l border-border pl-6 sm:pl-8 space-y-10 relative">
          {itinerary.map((d, idx) => (
            <div key={d.day} className="relative">
              {/* Penanda Hari */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-danau shadow-sm" />

              <span className="text-xs uppercase tracking-wider font-semibold text-danau block mb-1">
                {d.day}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-fg">
                {d.title}
              </h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                {d.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
