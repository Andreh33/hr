"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

// Pintura/sangre derramada desde el borde superior: aparece un charco con
// borde inferior irregular, y de ahí descienden chorretones gruesos lentos
// que se quedan goteando a alturas variables. Bordes orgánicos vía SVG
// feTurbulence + feDisplacementMap aplicados a paths gordos, no a líneas
// finas — así no parece lluvia.
//
// Retrigger: 3 clicks en ventana de 1.5s la vuelven a disparar. Mientras
// está animando, los clicks no cuentan.

const TENDRIL_COUNT = 9;
const PUDDLE_REVEAL_S = 0.55;
const DRIP_BASE_S = 2.9;          // chorretón base — lento, viscoso
const DRIP_VAR_S = 1.4;           // ±1.4s de variación
const SETTLE_S = 1.4;             // cuánto se queda fijo después del descenso
const FADE_S = 1.4;
const TOTAL_BUDGET_MS = 9500;
const RETRIGGER_CLICKS = 3;
const RETRIGGER_WINDOW_MS = 1500;

type Tendril = {
  id: number;
  xPct: number;        // posición horizontal centro (viewBox %)
  widthTop: number;    // ancho en la unión con el charco
  widthBottom: number; // ancho en la zona de la gota
  lengthVh: number;    // longitud total descendente (viewBox %)
  zigA: number;        // desviación lateral primer tramo
  zigB: number;        // desviación lateral segundo tramo
  delay: number;       // s antes de empezar
  duration: number;    // s del descenso
  bulgeR: number;      // radio de la gota terminal
};

function prng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateTendrils(seed: number): Tendril[] {
  const r = prng(seed + 1);
  // Posiciones X espaciadas con jitter para que no queden alineadas regular.
  return Array.from({ length: TENDRIL_COUNT }, (_, i) => {
    const slot = (i / TENDRIL_COUNT) * 100;
    const jitter = (r() - 0.5) * (100 / TENDRIL_COUNT) * 0.8;
    const widthTop = 1.8 + r() * 2.2;             // 1.8–4.0
    const widthBottom = widthTop * (0.45 + r() * 0.2);
    return {
      id: i,
      xPct: Math.max(3, Math.min(97, slot + jitter + 4)),
      widthTop,
      widthBottom,
      lengthVh: 22 + r() * 55,                    // 22–77
      zigA: (r() - 0.5) * 1.6,
      zigB: (r() - 0.5) * 1.8,
      delay: PUDDLE_REVEAL_S * 0.4 + r() * 1.8,
      duration: DRIP_BASE_S + r() * DRIP_VAR_S,
      bulgeR: widthTop * (0.7 + r() * 0.5),
    };
  });
}

// Genera el path de un chorretón: dos curvas Bezier laterales que se
// estrechan al bajar + una gota terminal semicircular abajo.
function tendrilPath(t: Tendril): string {
  const topY = 3.8;
  const botY = topY + t.lengthVh;
  const xL_top = t.xPct - t.widthTop / 2;
  const xR_top = t.xPct + t.widthTop / 2;
  const xL_bot = t.xPct - t.widthBottom / 2 + t.zigA + t.zigB;
  const xR_bot = t.xPct + t.widthBottom / 2 + t.zigA + t.zigB;
  // Puntos de control de las curvas — añaden el zigzag orgánico.
  const cL1x = xL_top + t.zigA;
  const cL2x = xL_bot + t.zigB;
  const cR1x = xR_top + t.zigA;
  const cR2x = xR_bot + t.zigB;
  const cY1 = topY + t.lengthVh * 0.33;
  const cY2 = topY + t.lengthVh * 0.66;

  // La gota terminal: arco semicircular grande para que parezca pesada,
  // ligeramente desplazado hacia abajo (botY + bulgeR*0.1).
  const bulgeY = botY + t.bulgeR * 0.1;
  return [
    `M ${xL_top.toFixed(2)} ${topY}`,
    `C ${cL1x.toFixed(2)} ${cY1.toFixed(2)} ${cL2x.toFixed(2)} ${cY2.toFixed(2)} ${xL_bot.toFixed(2)} ${botY.toFixed(2)}`,
    `A ${t.bulgeR.toFixed(2)} ${t.bulgeR.toFixed(2)} 0 0 0 ${xR_bot.toFixed(2)} ${botY.toFixed(2)}`,
    `C ${cR2x.toFixed(2)} ${cY2.toFixed(2)} ${cR1x.toFixed(2)} ${cY1.toFixed(2)} ${xR_top.toFixed(2)} ${topY}`,
    `Z`,
  ].join(" ");
}

// Charco superior: línea quebrada con curvas Bezier irregulares para que
// el borde inferior no parezca un recorte recto.
function puddlePath(seed: number): string {
  const r = prng(seed + 99);
  const segments = 14;
  const baseY = 3.0;
  const points: Array<[number, number]> = [];
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * 100;
    const y = baseY + (r() - 0.3) * 3.5; // -1 a +2.5
    points.push([x, Math.max(1.5, y)]);
  }
  const head = "M 0 0 L 100 0";
  // viaje al borde inferior derecho
  const lineToFirstBottom = ` L 100 ${points[points.length - 1]![1].toFixed(2)}`;
  // curvas Bezier suaves entre puntos, de derecha a izquierda
  const curves: string[] = [];
  for (let i = points.length - 1; i > 0; i--) {
    const a = points[i]!;
    const b = points[i - 1]!;
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2 + (r() - 0.5) * 1.2;
    curves.push(`Q ${mx.toFixed(2)} ${my.toFixed(2)} ${b[0].toFixed(2)} ${b[1].toFixed(2)}`);
  }
  return `${head}${lineToFirstBottom} ${curves.join(" ")} L 0 0 Z`;
}

export function BloodRain() {
  const [version, setVersion] = useState(0);
  const [running, setRunning] = useState(false);
  const tendrils = useMemo(() => generateTendrils(version + 1), [version]);
  const puddle = useMemo(() => puddlePath(version + 1), [version]);

  useEffect(() => {
    setRunning(true);
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setRunning(false), TOTAL_BUDGET_MS);
    return () => clearTimeout(t);
  }, [running, version]);

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

  if (!running) return null;

  return (
    <motion.div
      key={version}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[55] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{
        duration: TOTAL_BUDGET_MS / 1000,
        times: [0, (TOTAL_BUDGET_MS - FADE_S * 1000) / TOTAL_BUDGET_MS, 1],
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bloodv6-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#7A0E0E" />
            <stop offset="30%" stopColor="#5C0808" />
            <stop offset="70%" stopColor="#3D0404" />
            <stop offset="100%" stopColor="#2A0303" />
          </linearGradient>
          <radialGradient id="bloodv6-sheen" cx="35%" cy="30%" r="60%">
            <stop offset="0%"  stopColor="#C12B2B" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#7A1414" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          {/* Desplazamiento orgánico — scale alto rompe la simetría Bezier
              y hace que el borde parezca papel mojado / pintura goteando. */}
          <filter id="bloodv6-rough" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.06" numOctaves="3" seed="13" />
            <feDisplacementMap in="SourceGraphic" scale="2.2" />
          </filter>
          {/* clip-path por chorretón — animado de altura 0 → lengthVh para
              "revelar" el path progresivamente como si manara desde arriba. */}
          {tendrils.map((t) => (
            <clipPath key={t.id} id={`bloodv6-clip-${t.id}`}>
              <motion.rect
                x={t.xPct - t.widthTop * 1.5 - t.bulgeR}
                y={0}
                width={t.widthTop * 3 + t.bulgeR * 2}
                initial={{ height: 0 }}
                animate={{ height: 3.8 + t.lengthVh + t.bulgeR * 1.4 }}
                transition={{
                  delay: t.delay,
                  duration: t.duration,
                  ease: [0.55, 0.04, 0.85, 0.4], // gravity-ish, lento al final
                }}
              />
            </clipPath>
          ))}
        </defs>

        {/* Charco superior — aparece primero, "se derrama" sobre el borde */}
        <motion.path
          d={puddle}
          fill="url(#bloodv6-grad)"
          filter="url(#bloodv6-rough)"
          initial={{ scaleY: 0, transformOrigin: "top" }}
          animate={{ scaleY: 1 }}
          transition={{ duration: PUDDLE_REVEAL_S, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Chorretones — cada uno con su clip-path para revelar al bajar */}
        {tendrils.map((t) => (
          <g key={t.id} clipPath={`url(#bloodv6-clip-${t.id})`}>
            <path
              d={tendrilPath(t)}
              fill="url(#bloodv6-grad)"
              filter="url(#bloodv6-rough)"
            />
            {/* sheen húmedo sobre la zona ancha del chorretón */}
            <ellipse
              cx={t.xPct - t.widthTop * 0.15}
              cy={3.8 + t.lengthVh * 0.18}
              rx={t.widthTop * 0.32}
              ry={t.lengthVh * 0.18}
              fill="url(#bloodv6-sheen)"
            />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}
