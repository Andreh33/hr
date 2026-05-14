"use client";

import { Globe2, Sparkles, Star, Truck, UtensilsCrossed, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShineBorder } from "@/components/ui/shine-border";
import { Section } from "@/components/ui/section";
import { MENU_STATS } from "@/data/menu";
import { QOORDER_URL, externalLinkProps } from "@/lib/links";
import { SITE } from "@/lib/site";

// Frame-by-frame corrections:
// · "10 ciudades en patatas" replaces "3 continentes" (which was 4 anyway —
//   Europe/Africa/Asia/SouthAmerica) — concrete number from menu data.
// · Reparto card is now Qoorder-first with clear external CTA.
// · MENU_STATS.total is computed at build from MENU.length, no hardcode.

const cards = [
  {
    span: "md:col-span-3 md:row-span-2",
    eyebrow: "Reputación",
    Icon: Star,
    body: (
      <div className="relative flex h-full flex-col justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-display-hero text-[clamp(3rem,6vw,5.5rem)] leading-none text-gradient-hr">
            <NumberTicker value={SITE.rating.value} decimalPlaces={1} duration={1.4} className="!text-gradient-hr" />
          </span>
          <span className="text-eyebrow text-bone-100/60">/ 5</span>
        </div>
        <p className="font-display text-2xl text-bone-50">
          <NumberTicker value={SITE.rating.count} duration={1.6} className="!text-bone-50" /> reseñas Google
        </p>
        <p className="text-sm text-bone-100/55">
          Cada plato es una conversación con quien lo prueba.
        </p>
      </div>
    ),
  },
  {
    span: "md:col-span-3",
    eyebrow: "Carta",
    Icon: UtensilsCrossed,
    body: (
      <>
        <p className="font-display text-5xl text-bone-50">
          <NumberTicker value={MENU_STATS.total} className="!text-bone-50" />
        </p>
        <p className="mt-2 text-sm text-bone-100/60">
          platos vivos — de la clásica con queso a La Pantera con algodón de azúcar.
        </p>
      </>
    ),
  },
  {
    span: "md:col-span-3",
    eyebrow: "Casa de las papas",
    Icon: Globe2,
    body: (
      <>
        <p className="font-display text-5xl text-bone-50">
          <NumberTicker value={9} className="!text-bone-50" /> <span className="text-azure-400">ciudades</span>
        </p>
        <p className="mt-2 text-sm text-bone-100/60">
          Berlín, Nairobi, Tokio, Río, Helsinki, Lisboa… en una bandeja.
        </p>
      </>
    ),
  },
  {
    span: "md:col-span-2",
    eyebrow: "Horario",
    Icon: Sparkles,
    body: (
      <>
        <p className="font-display text-3xl text-bone-50">Mié → Dom</p>
        <p className="mt-2 text-sm text-bone-100/60">
          Noches, miércoles a domingo. Sin prisas.
        </p>
      </>
    ),
  },
  {
    span: "md:col-span-4",
    eyebrow: "Reparto",
    Icon: Truck,
    body: (
      <div className="flex h-full flex-col justify-between gap-4">
        <p className="font-display text-3xl text-bone-50">
          Pídelo en <span className="text-plum-400">Qoorder</span>
        </p>
        <p className="text-sm text-bone-100/60">
          Jueves a domingo. Lo pides, llega caliente.
        </p>
        <a
          href={QOORDER_URL}
          {...externalLinkProps}
          className="group inline-flex h-10 w-fit items-center gap-2 rounded-full bg-azure-400 px-5 font-mono text-xs uppercase tracking-[0.15em] text-ink-950 transition-transform hover:-translate-y-0.5"
        >
          Abrir Qoorder
          <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    ),
    isReparto: true,
  },
];

export function BentoStats() {
  return (
    <Section id="proof" className="border-t border-plum-500/10 py-24">
      <p className="text-eyebrow mb-10 text-bone-100/60">04 · Por qué la gente vuelve</p>
      <div className="grid gap-3 md:grid-cols-6 md:auto-rows-[160px]">
        {cards.map((c, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative overflow-hidden rounded-3xl border border-plum-500/15 bg-ink-900/80 p-6 transition-colors hover:border-plum-400/40 ${c.span}`}
          >
            <ShineBorder
              borderWidth={1}
              duration={12}
              shineColor={["#38B6FF", "#A87BFF"]}
              className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="flex items-center justify-between">
              <p className="text-eyebrow text-bone-100/55">{c.eyebrow}</p>
              <c.Icon className="h-4 w-4 text-plum-300/60 transition-transform duration-500 group-hover:rotate-12" />
            </div>
            <div className="mt-6">{c.body}</div>
          </motion.article>
        ))}
      </div>

      {/* Subtle CTA strip — separated 80px from the bento so it reads as its
          own moment, not as another card. Transparent, centered, sm buttons. */}
      <div className="mt-20 flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-bone-100/65">
          Mesa o reparto, tú eliges. Nosotros tenemos la brasa lista.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/reservar"
            className="inline-flex h-8 items-center rounded-full bg-hot px-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-950 hover:-translate-y-0.5 transition-transform"
          >
            Reservar mesa
          </Link>
          <a
            href={QOORDER_URL}
            {...externalLinkProps}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-azure-400/40 px-4 font-mono text-[11px] uppercase tracking-[0.15em] text-azure-400 hover:border-azure-400"
          >
            Pedir en Qoorder
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
    </Section>
  );
}
