"use client";

import { useState } from "react";
import Link from "next/link";
import { allTrails, type TrailInfo } from "@/lib/trails";

interface TrailTabsProps {
  ringkas?: boolean;
}

export default function TrailTabs({ ringkas = false }: TrailTabsProps) {
  const displayedTrails = ringkas ? allTrails.slice(0, 3) : allTrails;
  const [activeId, setActiveId] = useState(displayedTrails[0].id);
  const active = displayedTrails.find((t) => t.id === activeId) ?? displayedTrails[0];

  return (
    <section id="jalur" className="bg-bg-subtle py-20 md:py-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-2">
              Karakter Rute Resmi TNGR
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-fg font-normal tracking-tight">
              {ringkas ? "Tiga karakter jalur resmi utama" : "Lima jalur pendakian resmi Gunung Rinjani"}
            </h2>
            <p className="mt-3 text-fg-muted text-base leading-relaxed">
              Setiap pintu masuk memiliki profil elevasi, tutupan kanopi vegetasi, dan ketersediaan mata air yang berbeda.
              Pilih rute yang sesuai dengan target waktu dan kondisi fisik Anda.
            </p>
          </div>

          {ringkas && (
            <Link
              href="/jalur-pendakian"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-danau hover:text-danau-hover transition-colors whitespace-nowrap"
            >
              <span>Semua 5 rute & profil elevasi</span>
              <span>→</span>
            </Link>
          )}
        </div>

        {/* Tab Navigasi */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-border pb-3">
          {displayedTrails.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                t.id === activeId
                  ? "bg-white text-fg shadow-sm border border-border"
                  : "text-fg-muted hover:text-fg hover:bg-white/60"
              }`}
            >
              {t.name.split(" (")[0]}
            </button>
          ))}
        </div>

        {/* Panel Detail Jalur */}
        <div className="mt-8 bg-white rounded-lg border border-border p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <h3 className="font-display text-2xl text-fg font-semibold">{active.name}</h3>
            <span className="text-xs text-fg-faint bg-bg-subtle px-3 py-1 rounded border border-border">
              {active.duration}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-xs font-medium text-fg-faint uppercase tracking-wider">Elevasi Awal & Puncak</p>
              <p className="mt-1 text-fg font-medium">{active.startElevation}</p>
              <p className="text-xs text-fg-muted mt-0.5">Maks: {active.maxElevation}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-fg-faint uppercase tracking-wider">Karakter Medan</p>
              <p className="mt-1 text-fg">{active.terrain}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-fg-faint uppercase tracking-wider">Mata Air</p>
              <p className="mt-1 text-fg">{active.waterSources}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-fg-muted leading-relaxed">{active.summary}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs font-semibold tracking-wider uppercase text-fg-faint mb-3">
              Tahapan Jalur & Estimasi Waktu
            </p>
            <ol className="space-y-2 text-xs sm:text-sm text-fg-muted list-decimal list-inside leading-relaxed">
              {active.steps.map((s, idx) => (
                <li key={idx} className="marker:text-danau marker:font-semibold">
                  <span className="text-fg font-medium">{s.split(":")[0]}:</span>
                  <span>{s.split(":")[1]}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
