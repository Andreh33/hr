"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

// One-shot dramatic intro: gotas de jugo de carne / sangre caen desde
// arriba, impactan a alturas variables, salpican y se desvanecen. Después
// de la animación, todo queda limpio.
//
// Retrigger: 3 clicks consecutivos en cualquier punto de la página dentro
// de una ventana de 1.5s la vuelven a disparar. Mientras está animando, los
// clicks no cuentan (no se puede solapar consigo misma).
//
// Cero deps externas, cero textures de red — feTurbulence + radial gradient
// hacen el trabajo. Pointer-events:none para que no bloquee la UI.

const DROP_COUNT = 14;
const FALL_BASE_S = 1.4;
const FALL_VAR_S = 1.0;
const SETTLE_S = 1.0;     // gotas se quedan visibles después del impacto
const FADE_S = 1.4;       // duración del fade-out
const TOTAL_BUDGET_MS = 7000;
const RETRIGGER_CLICKS = 3;
const RETRIGGER_WINDOW_MS = 1500;

type DropConfig = {
  id: number;
  x: number;
  size: number;
  fallToVh: number;
  delay: number;
  duration: number;
};

function makePRNG(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateDrops(seed: number): DropConfig[] {
  const rand = makePRNG(seed + 1);
  return Array.from({ length: DROP_COUNT }, (_, i) => ({
    id: i,
    x: 4 + rand() * 92,
    size: 16 + rand() * 24,                  // 16–40 px head width
    fallToVh: 40 + rand() * 55,              // settle between 40 and 95vh
    delay: rand() * 1.8,
    duration: FALL_BASE_S + rand() * FALL_VAR_S,
  }));
}

export function BloodRain() {
  const [version, setVersion] = useState(0);
  const [running, setRunning] = useState(false);
  const drops = useMemo(() => generateDrops(version + 1), [version]);

  // Auto-fire on mount.
  useEffect(() => {
    setRunning(true);
  }, []);

  // Auto-stop after budget.
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setRunning(false), TOTAL_BUDGET_MS);
    return () => clearTimeout(t);
  }, [running, version]);

  // Click-3-times retrigger. While the animation is running, clicks don't
  // count (would otherwise let the user re-retrigger every 3 clicks mid-fall).
  useEffect(() => {
    let clicks = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    function onClick() {
      if (running) return;
      clicks++;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        clicks = 0;
      }, RETRIGGER_WINDOW_MS);
      if (clicks >= RETRIGGER_CLICKS) {
        clicks = 0;
        if (resetTimer) clearTimeout(resetTimer);
        setVersion((v) => v + 1);
        setRunning(true);
      }
    }

    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [running]);

  return (
    <>
      {/* Shared SVG defs — filter + gradients used by every drop. Lives in a
          zero-size SVG at root so the defs are reachable by url() inside
          inline SVGs below. */}
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
        <defs>
          <radialGradient id="blood-grad" cx="38%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#D63838" />
            <stop offset="32%" stopColor="#8B1818" />
            <stop offset="78%" stopColor="#4A0606" />
            <stop offset="100%" stopColor="#2A0303" />
          </radialGradient>
          <radialGradient id="blood-grad-light" cx="32%" cy="22%" r="55%">
            <stop offset="0%" stopColor="#FF6868" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#C12B2B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="blood-rough" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="2.6" />
          </filter>
          <filter id="blood-rough-strong" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="11" />
            <feDisplacementMap in="SourceGraphic" scale="4" />
          </filter>
        </defs>
      </svg>

      {running && (
        <div
          key={version}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[55] overflow-hidden"
        >
          {drops.map((d) => (
            <Drop key={d.id} {...d} />
          ))}
        </div>
      )}
    </>
  );
}

function Drop({ x, size, fallToVh, delay, duration }: DropConfig) {
  const totalLife = duration + SETTLE_S + FADE_S;

  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: 0 }}
      initial={{ y: "-18vh", opacity: 1 }}
      animate={{
        y: [`-18vh`, `${fallToVh}vh`, `${fallToVh}vh`],
        opacity: [1, 1, 0],
      }}
      transition={{
        delay,
        duration: totalLife,
        times: [0, duration / totalLife, 1],
        // Gravity ease front-loads progress so the drop falls fast and then
        // sits at its impact y for the settle + fade portion.
        ease: [0.55, 0, 0.92, 0.5],
      }}
    >
      {/* trailing streak — gives the drop momentum + a wet path */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: `-${size * 4.5}px`,
          width: size * 0.22,
          height: size * 4.5,
          background:
            "linear-gradient(180deg, transparent 0%, transparent 50%, rgba(92,14,14,0.45) 88%, rgba(139,24,24,0.95) 100%)",
          borderRadius: "999px",
          filter: "blur(0.3px)",
        }}
      />

      {/* drop head — teardrop with rough organic edge */}
      <svg
        width={size}
        height={size * 1.7}
        viewBox="0 0 40 68"
        className="relative block"
        style={{ filter: `drop-shadow(0 ${size * 0.1}px ${size * 0.35}px rgba(74,6,6,0.55))` }}
      >
        <path
          d="M 20 1 C 13 16 5 32 5 47 C 5 59 11 66 20 66 C 29 66 35 59 35 47 C 35 32 27 16 20 1 Z"
          fill="url(#blood-grad)"
          filter="url(#blood-rough)"
        />
        {/* wet sheen highlight */}
        <ellipse cx="14" cy="42" rx="3.5" ry="6" fill="url(#blood-grad-light)" />
      </svg>

      {/* splash impact — emerges at the moment the drop reaches fallToVh,
          spreads outward, holds, then fades with the rest. */}
      <motion.div
        className="absolute left-1/2"
        style={{
          top: `${size * 1.65}px`,
          width: size * 2.6,
          marginLeft: `-${size * 1.3}px`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.25, 1.05, 1.05, 1.05],
          opacity: [0, 1, 0.95, 0.9, 0],
        }}
        transition={{
          delay: delay + duration - 0.04,
          duration: SETTLE_S + FADE_S + 0.2,
          times: [0, 0.12, 0.3, 0.55, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <svg viewBox="0 0 80 28" className="block w-full" preserveAspectRatio="xMidYMid meet">
          {/* main organic splat */}
          <path
            d="M 40 14
               C 32 4 20 4 12 8
               C 5 12 6 18 14 19
               C 22 20 30 19 40 19
               C 50 19 58 20 66 19
               C 74 18 75 12 68 8
               C 60 4 48 4 40 14 Z"
            fill="url(#blood-grad)"
            filter="url(#blood-rough-strong)"
          />
          {/* satellite drops, randomized look via mixed shapes */}
          <circle cx="6" cy="23" r="1.6" fill="#5C0E0E" />
          <circle cx="74" cy="23" r="1.3" fill="#5C0E0E" />
          <ellipse cx="40" cy="24" rx="1.9" ry="0.9" fill="#5C0E0E" />
          <circle cx="14" cy="6" r="0.9" fill="#8B1818" />
          <circle cx="66" cy="6" r="1.1" fill="#8B1818" />
          <circle cx="24" cy="25" r="0.7" fill="#5C0E0E" />
          <circle cx="58" cy="25" r="0.8" fill="#5C0E0E" />
          {/* tiny mist droplets further out */}
          <circle cx="2" cy="20" r="0.5" fill="#5C0E0E" />
          <circle cx="78" cy="20" r="0.5" fill="#5C0E0E" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
