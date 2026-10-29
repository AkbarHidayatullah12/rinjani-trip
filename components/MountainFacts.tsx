export default function MountainFacts() {
  const specs = [
    { label: "Puncak tertinggi", value: "3.726 m dpl", detail: "Titik tertinggi ke-2 di Indonesia" },
    { label: "Danau kawah", value: "Segara Anak (2.000 m)", detail: "Kedalaman 230 meter, seluas ±11 km²" },
    { label: "Kerucut aktif", value: "Gunung Barujari", detail: "Tumbuh di tengah kaldera, aktif 2016" },
    { label: "Kawasan lindung", value: "Taman Nasional", detail: "41.330 hektar hutan lindung dan savana" },
  ];

  return (
    <section id="karakter" className="border-b border-border bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {specs.map((item, idx) => (
            <div key={idx} className="border-l border-border pl-5">
              <span className="text-xs uppercase tracking-wider text-fg-faint font-medium">
                {item.label}
              </span>
              <p className="font-display text-xl sm:text-2xl font-semibold text-fg mt-1">
                {item.value}
              </p>
              <p className="text-xs text-fg-muted mt-1 leading-normal">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
