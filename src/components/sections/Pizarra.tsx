"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChefHat, Clock3, ExternalLink } from "lucide-react";
import { Section } from "@/components/ui/section";
import { QOORDER_URL, externalLinkProps } from "@/lib/links";
import { SCHEDULE, type DayIndex } from "@/lib/hours";
import { useEffect, useState } from "react";

// Pizarra del día — black slate. Redesigned after v2 feedback: the green
// "schoolboard" was outside the brand language. This is now a true bar
// chalkboard: ink-900 surface, dashed bone-50/15 wood frame, chalk-noise
// SVG, and Fraunces italic with white text-shadow simulating chalk.
//
// CTAs intentionally avoid "Pedir" on the web — the primary action is
// reservar (which IS gestionado web-side), and Qoorder is a secondary link
// for delivery. Stock counter removed (it was fake and read as fake).

// Specials rotate by day of week. NO midday specials — the venue only opens
// at night per the v3.1 brief.
const SPECIALS = [
  {
    id: "pantera-mode",
    title: "La Pantera en modo prueba",
    line: "Pan brioche, queso fundido, takis crujientes y un toque de algodón de azúcar.",
    price: "10,50 €",
  },
  {
    id: "rio-noche",
    title: "Patatas Río · ración doble",
    line: "Patatas cortadas hoy, bacon crispy y salsa de queso de la abuela.",
    price: "7,95 €",
  },
  {
    id: "gamberra-edicion",
    title: "Edición Gamberra Black",
    line: "Pan brioche negro, mermelada de bacon ahumado, mayonesa de trufa.",
    price: "10,50 €",
  },
] as const;

export function Pizarra() {
  const [today, setToday] = useState(() => new Date().getDay());
  useEffect(() => setToday(new Date().getDay()), []);
  const special = SPECIALS[today % SPECIALS.length]!;

  // Replace the old "mediodía" caption with the actual hours of today. If
  // the venue is closed today, show "DISPONIBLE EL PRÓXIMO DÍA DE APERTURA".
  const todaySchedule = SCHEDULE[today as DayIndex];
  const todayLabel = todaySchedule
    ? `DISPONIBLE HOY · ${todaySchedule.ranges.map((r) => `${r.open}–${r.close}`).join(" · ")}`
    : "DISPONIBLE PRÓXIMA APERTURA";

  return (
    <Section className="border-t border-plum-500/10 py-24 md:py-28">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-eyebrow text-bone-100/55">04¼ · Pizarra del día</p>
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-100/45">
            <Clock3 className="h-3 w-3" />
            actualizada hoy
          </span>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate overflow-hidden rounded-3xl shadow-2xl"
          style={{
            background:
              "linear-gradient(180deg, var(--ink-900) 0%, var(--ink-800) 100%)",
            boxShadow:
              "inset 0 0 0 2px color-mix(in oklch, var(--bone-50) 12%, transparent), inset 0 0 0 4px color-mix(in oklch, var(--ink-900) 90%, transparent), inset 0 0 60px color-mix(in oklch, var(--ink-950) 60%, transparent)",
          }}
        >
          {/* dashed wood-frame border, set inside the rounded card */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-2 rounded-[18px]"
            style={{
              border: "2px dashed color-mix(in oklch, var(--bone-50) 15%, transparent)",
            }}
          />

          {/* dense chalk-dust noise overlay */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.22] mix-blend-screen"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="pizarra-noise">
              <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="3" />
              <feColorMatrix type="matrix" values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.6 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#pizarra-noise)" />
          </svg>

          {/* faint chalk smudges in corners */}
          <span aria-hidden className="absolute left-7 top-7 inline-block h-1 w-12 -rotate-12 rounded-full bg-bone-50/35 blur-[1px]" />
          <span aria-hidden className="absolute right-9 bottom-7 inline-block h-1 w-8 rotate-6 rounded-full bg-bone-50/30 blur-[1px]" />

          <div className="relative grid gap-8 p-8 md:grid-cols-5 md:gap-6 md:p-12">
            <div className="md:col-span-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-bone-50/30 bg-bone-50/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-50/80">
                <span aria-hidden className="inline-flex h-2 w-2 rounded-full bg-open motion-safe:animate-[dot-pulse_1.6s_ease-in-out_infinite]" />
                Hoy en la pizarra
                <ChefHat className="h-3 w-3" />
              </div>
              <h3
                className="mt-5 font-editorial text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] italic text-bone-50"
                style={{
                  textShadow:
                    "0 0 1px rgba(246,241,232,0.95), 0 0 14px rgba(246,241,232,0.18)",
                }}
              >
                {special.title}
              </h3>
              <p
                className="mt-4 max-w-md font-editorial text-lg italic text-bone-50/85"
                style={{ textShadow: "0 0 1px rgba(246,241,232,0.5)" }}
              >
                {special.line}
              </p>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-50/55">
                {todayLabel}
              </p>
            </div>

            <div className="md:col-span-2 md:border-l md:border-bone-50/15 md:pl-8">
              <p className="text-eyebrow text-bone-50/55">precio especial</p>
              <p
                className="mt-2 font-display-hero text-6xl text-hot"
                style={{ textShadow: "0 0 2px rgba(255,90,31,0.6), 0 0 16px rgba(255,90,31,0.15)" }}
              >
                {special.price}
              </p>

              <div className="mt-8 flex flex-col gap-2">
                <Link
                  href="/reservar"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-bone-50 px-5 font-mono text-xs uppercase tracking-[0.18em] text-ink-950 transition-transform hover:-translate-y-0.5"
                >
                  Reservar mesa →
                </Link>
                <a
                  href={QOORDER_URL}
                  {...externalLinkProps}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-bone-50/40 px-5 font-mono text-xs uppercase tracking-[0.18em] text-bone-50 transition-colors hover:border-bone-50"
                >
                  Pedir en Qoorder
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </motion.article>

        <p className="mt-4 text-center font-editorial text-sm italic text-bone-100/45">
          La pizarra cambia con el día. Lo que está, está.
        </p>
      </div>
    </Section>
  );
}
