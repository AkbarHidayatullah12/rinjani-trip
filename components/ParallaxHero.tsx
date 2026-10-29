"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxLayer {
  id: string;
  label: string;
  depth: number;
  scrollSpeed: string;
  drift: boolean;
}

const LAYERS: ParallaxLayer[] = [
  { id: "01_langit", label: "Langit & Cakrawala Fajar", depth: 0.08, scrollSpeed: "0.04", drift: false },
  { id: "02_awan", label: "Awan & kabut jauh", depth: 0.16, scrollSpeed: "0.06", drift: true },
  { id: "03_gunung_jauh", label: "Gunung jauh", depth: 0.28, scrollSpeed: "0.08", drift: false },
  { id: "04_kaldera", label: "Dinding Kaldera", depth: 0.52, scrollSpeed: "0.14", drift: false },
  { id: "05_air", label: "Air Segara Anak", depth: 0.52, scrollSpeed: "0.14", drift: false },
  { id: "06_kabut", label: "Kabut Danau", depth: 0.70, scrollSpeed: "0.22", drift: true },
  { id: "07_pulau", label: "Gunung Barujari", depth: 0.52, scrollSpeed: "0.14", drift: false },
  { id: "08_terdepan", label: "Batuan & Pepohonan Depan", depth: 1.15, scrollSpeed: "0.38", drift: false },
];

const STRENGTH = 0.02;
const OVERSCAN = 1.14;
const EASE = 0.08;
const IDLE_MS = 2500;

export default function ParallaxHero() {
  const root = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [canTilt, setCanTilt] = useState(false);

  // ── 1. Penyesuaian Dimensi Wadah 16:9 Mengisi Layar Penuh ──
  useEffect(() => {
    const el = root.current;
    const box = boxRef.current;
    if (!el || !box) return;

    const fit = () => {
      const w = window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      let bw = w;
      let bh = (w * 9) / 16;
      if (bh < h) {
        bh = h;
        bw = (h * 16) / 9;
      }
      box.style.width = `${Math.ceil(bw)}px`;
      box.style.height = `${Math.ceil(bh)}px`;
    };

    fit();
    window.addEventListener("resize", fit, { passive: true });
    return () => window.removeEventListener("resize", fit);
  }, []);

  // ── 2. GSAP Scroll Parallax ──
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const factor = isMobile ? 0.6 : 1;

      el.querySelectorAll<HTMLElement>("[data-speed]").forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed ?? "0") * factor;
        gsap.to(layer, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      const heroText = el.querySelector<HTMLElement>("[data-hero-text]");
      if (heroText) {
        gsap.to(heroText, {
          yPercent: -40,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "55% top",
            scrub: true,
          },
        });
      }
    });

    return () => mm.revert();
  }, []);

  // ── 3. Interaksi Pointer & Awan Melayang ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastInteractTime = -1e9;
    let animId: number;

    const setTarget = (x: number, y: number) => {
      targetX = Math.max(-1, Math.min(1, x));
      targetY = Math.max(-1, Math.min(1, y));
      lastInteractTime = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      setTarget((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        setTarget(
          (e.touches[0].clientX / window.innerWidth - 0.5) * 2,
          (e.touches[0].clientY / window.innerHeight - 0.5) * 2
        );
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      setTarget(e.gamma / 25, (e.beta - 45) / 25);
    };

    if (
      typeof window !== "undefined" &&
      "DeviceOrientationEvent" in window &&
      // @ts-expect-error iOS Safari permission
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      setCanTilt(true);
    } else if ("ontouchstart" in window) {
      window.addEventListener("deviceorientation", onDeviceOrientation, { passive: true });
    }

    const render = (time: number) => {
      let x = targetX;
      let y = targetY;

      if (time - lastInteractTime > IDLE_MS) {
        const elapsed = (time - lastInteractTime - IDLE_MS) / 1000;
        const blend = Math.min(1, elapsed / 2);
        x = Math.sin(time / 3400) * 0.45 * blend;
        y = Math.sin(time / 4600) * 0.2 * blend;
      }

      currentX += (x - currentX) * EASE;
      currentY += (y - currentY) * EASE;

      const boxWidth = boxRef.current ? boxRef.current.clientWidth : window.innerWidth;

      LAYERS.forEach((layer, i) => {
        const img = imageRefs.current[i];
        if (!img) return;

        let dx = -currentX * STRENGTH * boxWidth * layer.depth;
        let dy = -currentY * STRENGTH * boxWidth * layer.depth * 0.55;

        if (layer.drift) {
          dx += Math.sin(time / 9000 + layer.depth * 10) * boxWidth * 0.005;
        }

        img.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${OVERSCAN})`;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("deviceorientation", onDeviceOrientation);
    };
  }, []);

  const requestTiltPermission = async () => {
    try {
      // @ts-expect-error iOS API
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        // @ts-expect-error iOS API
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === "granted") setCanTilt(false);
      }
    } catch {
      setCanTilt(false);
    }
  };

  return (
    <section ref={root} className="relative h-[110vh] overflow-hidden bg-bg">
      {/* ── 8 Lapisan Foto Asli 1920x1080 ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          ref={boxRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden pointer-events-none"
        >
          {LAYERS.map((layer, index) => (
            <div
              key={layer.id}
              data-speed={layer.scrollSpeed}
              className="absolute inset-0 h-full w-full pointer-events-none"
            >
              <img
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
                src={`/paralax/layers/${layer.id}.webp`}
                alt={layer.label}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none will-change-transform"
                style={{
                  transform: `translate3d(0, 0, 0) scale(${OVERSCAN})`,
                }}
                loading={index < 4 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Transisi Gradasi Halus ke Latar Putih Bersih di Bawah ── */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />

      {/* ── Sensor Tilt untuk iOS Safari ── */}
      {canTilt && (
        <button
          onClick={requestTiltPermission}
          className="absolute right-4 bottom-8 z-30 rounded bg-white/90 px-3 py-1.5 text-xs text-fg shadow-sm border border-border"
        >
          Aktifkan sensor miring
        </button>
      )}

      {/* ── Tipografi Hero Editorial yang Tenang & Berwibawa ── */}
      <div
        data-hero-text
        className="relative z-20 flex h-full flex-col items-center justify-start px-6 pt-[30vh] sm:pt-[32vh] text-center"
      >
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-normal text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] tracking-tight">
          Gunung Rinjani
        </h1>

        <p className="mt-4 max-w-xl text-base md:text-lg text-white/95 font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          Kaldera Segara Anak, 2.000 meter di atas permukaan laut. Lombok, Nusa Tenggara Barat.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <a
            href="/booking"
            className="text-sm font-medium px-6 py-3 rounded-md bg-white text-fg shadow-md hover:bg-white/90 transition-colors"
          >
            Pesan pendakian
          </a>
          <a
            href="/jalur-pendakian"
            className="text-sm font-medium px-6 py-3 rounded-md text-white/90 hover:text-white bg-black/30 backdrop-blur-sm border border-white/20 transition-colors"
          >
            Pelajari rute
          </a>
        </div>
      </div>
    </section>
  );
}
