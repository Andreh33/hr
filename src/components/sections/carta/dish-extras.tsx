"use client";

import { motion } from "motion/react";
import type { MenuItem } from "@/data/menu";
import { cn } from "@/lib/utils";

// Unified sticker vocabulary. We dropped BOOM/Crispy after v2 feedback —
// noise without information. The remaining set maps to honest dish attributes
// and each has a tooltip with restaurant voice.
type StickerSlug = "fuego" | "jugoso" | "veg" | "top" | "brasa";

const STICKER_RULES: Array<{
  slug: StickerSlug;
  match: (item: MenuItem) => boolean;
}> = [
  { slug: "brasa",  match: (i) => /brasa/i.test(i.name + " " + (i.description ?? "")) },
  { slug: "fuego",  match: (i) => !!i.spicy },
  { slug: "jugoso", match: (i) => /pantera|solomillo|cachopo|brioche|pulled|jugos/i.test(i.name + " " + (i.description ?? "")) },
  { slug: "veg",    match: (i) => !!i.vegetarian },
  { slug: "top",    match: (i) => !!i.featured },
];

const STICKER_COPY: Record<StickerSlug, {
  label: string;
  rotate: number;
  tone: "hot" | "azure" | "plum" | "open" | "brasa";
  tooltip: string;
}> = {
  fuego:  { label: "Fuego",   rotate: 6,  tone: "hot",   tooltip: "Pica de verdad. Sin disimulos." },
  jugoso: { label: "Jugoso",  rotate: -5, tone: "azure", tooltip: "Avisado: hay que tener servilleta cerca." },
  veg:    { label: "Vegetal", rotate: 4,  tone: "open",  tooltip: "Sin carne. Sí sabor." },
  top:    { label: "Top",     rotate: -4, tone: "plum",  tooltip: "Lo más pedido esta temporada." },
  brasa:  { label: "Brasa",   rotate: -7, tone: "brasa", tooltip: "Brasa real. Nada de imitaciones." },
};

export function pickStickerSlug(item: MenuItem): StickerSlug | null {
  for (const rule of STICKER_RULES) {
    if (rule.match(item)) return rule.slug;
  }
  return null;
}

export function DishSticker({ slug }: { slug: StickerSlug }) {
  const { label, rotate, tone, tooltip } = STICKER_COPY[slug];
  const toneCls = {
    hot:   "bg-closed text-bone-50 border-closed shadow-[0_8px_24px_-12px_rgba(255,77,106,0.7)]",
    azure: "bg-azure-400 text-ink-950 border-azure-500 shadow-[0_8px_24px_-12px_rgba(0,168,255,0.7)]",
    plum:  "bg-plum-500 text-bone-50 border-plum-600 shadow-[0_8px_24px_-12px_rgba(139,77,255,0.7)]",
    open:  "bg-open text-ink-950 border-open shadow-[0_8px_24px_-12px_rgba(54,211,153,0.6)]",
    brasa: "bg-hot text-ink-950 border-hot shadow-[0_8px_24px_-12px_rgba(255,90,31,0.7)]",
  }[tone];

  return (
    <motion.span
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      whileInView={{ scale: 1, rotate, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.2 }}
      style={{ transform: `rotate(${rotate}deg)` }}
      title={tooltip}
      className={cn(
        "absolute inline-block rounded-md border-2 px-2.5 py-1 font-display text-base leading-none tracking-tight",
        toneCls
      )}
    >
      <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1' }}>{label}</span>
    </motion.span>
  );
}

export function HeatSmoke({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 100"
      className={cn("pointer-events-none absolute h-20 w-16 motion-reduce:hidden", className)}
    >
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d="M20 90 Q 15 70 25 55 T 20 25 T 25 5"
          stroke="rgba(246,241,232,0.55)"
          strokeWidth={1.4}
          fill="none"
          strokeLinecap="round"
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [-2, -16, -28],
            x: [0, i === 1 ? 6 : -4, i === 1 ? -2 : 8],
          }}
          transition={{
            duration: 3.2,
            delay: i * 0.9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transform: `translateX(${i * 14}px)` }}
        />
      ))}
    </svg>
  );
}

export function isBrasaDish(item: MenuItem): boolean {
  return /brasa/i.test(item.name + " " + (item.description ?? ""));
}
