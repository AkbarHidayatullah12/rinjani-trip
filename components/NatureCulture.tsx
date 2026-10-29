export default function NatureCulture() {
  const notes = [
    {
      topic: "Ekosistem & Keanekaragaman Hayati",
      content:
        "Lereng Rinjani terbentang dari hutan hujan tropis basah di utara hingga savana terbuka di timur. Wilayah ini menjadi habitat lutung hitam Lombok (Trachypithecus auratus), elang Flores, serta vegetasi cemara gunung dan edelweiss Jawa (Anaphalis javanica) di zona sub-alpin.",
    },
    {
      topic: "Nilai Suci bagi Masyarakat Sasak & Bali",
      content:
        "Bagi masyarakat Sasak dan umat Hindu di Lombok, Rinjani dan Danau Segara Anak adalah tempat bersemayam para leluhur dan Dewi Anjani. Setiap tahun dilaksanakan upacara Mulang Pekelem, di mana doa dan persembahan dilarung ke danau untuk memohon keselamatan dan kelimpahan air.",
    },
  ];

  return (
    <section className="bg-white py-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl text-fg font-normal tracking-tight">
            Ekologi dan nilai budaya
          </h2>
          <p className="mt-3 text-fg-muted text-base leading-relaxed">
            Rinjani bukan sekadar jalur pendakian; gunung ini adalah rumah bagi keanekaragaman hayati Lombok
            serta ruang spiritual yang dihormati selama ratusan tahun.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          {notes.map((item, idx) => (
            <div key={idx} className="border-l-2 border-danau pl-6">
              <h3 className="text-base font-semibold text-fg">{item.topic}</h3>
              <p className="mt-3 text-sm text-fg-muted leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
