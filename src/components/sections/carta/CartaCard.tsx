"use client";

import Image from "next/image";
import { Flame, Leaf, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import type { MenuItem } from "@/data/menu";
import { getDishPhoto } from "@/data/photos";
import { cn } from "@/lib/utils";
import { formatPrice } from "./format";
import { DishSticker, HeatSmoke, isBrasaDish, pickStickerSlug } from "./dish-extras";

type Props = {
  item: MenuItem;
  index: number;
};

// Vitrine card. The web no longer takes orders — the card simply tells the
// story of the dish. Photos for featured items use branded placeholders
// (typography on tinted gradient) until the client delivers real photography.
export function CartaCard({ item, index }: Props) {
  const stickerSlug = pickStickerSlug(item);
  const onBrasa = isBrasaDish(item);
  const photo = item.featured ? getDishPhoto(item.id) : undefined;
  const showPhoto = !!photo;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        delay: Math.min(0.05 * index, 0.6),
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "group relative isolate overflow-hidden rounded-2xl border bg-ink-900/70 transition-all duration-500",
        "border-plum-500/15 hover:-translate-y-1 hover:border-plum-400/50",
        item.featured && "ring-1 ring-azure-400/20",
        showPhoto ? "p-0" : "p-5"
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-16 h-40 w-40 rounded-full bg-plum-500/0 blur-3xl transition-colors duration-500 group-hover:bg-plum-500/40"
      />

      {showPhoto && photo && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            placeholder={photo.blurDataURL ? "blur" : undefined}
            blurDataURL={photo.blurDataURL || undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
          {stickerSlug && (
            <span className="absolute right-4 top-4">
              <DishSticker slug={stickerSlug} />
            </span>
          )}
          {onBrasa && <HeatSmoke className="absolute -top-6 left-6" />}
        </div>
      )}

      {!showPhoto && onBrasa && <HeatSmoke className="absolute -top-4 left-6" />}

      <div className={showPhoto ? "p-5" : ""}>
        <div className="relative flex items-start justify-between gap-4">
          <span className="font-mono text-xs tabular-nums text-bone-100/40">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-mono text-base tabular-nums text-bone-50 transition-colors duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:[background-image:var(--grad-text)]">
            {formatPrice(item.price)}
          </span>
        </div>

        <h3 className="relative mt-3 font-display text-2xl leading-[1.1] text-bone-50">
          {item.name}
        </h3>

        {item.description && (
          <p className="relative mt-2 text-sm leading-relaxed text-bone-100/60">
            {item.description}
          </p>
        )}

        <div className="relative mt-4 flex flex-wrap items-center gap-2">
          {!showPhoto && stickerSlug && (
            <span className="relative inline-block">
              <DishSticker slug={stickerSlug} />
              <span className="invisible inline-block px-2.5 py-1 font-display text-base">·</span>
            </span>
          )}
          {item.featured && !showPhoto && !stickerSlug && (
            <Chip tone="plum">
              <Sparkles className="h-3 w-3" aria-hidden /> Top
            </Chip>
          )}
          {item.spicy && (
            <Chip tone="fuego">
              <Flame className="h-3 w-3" aria-hidden /> Fuego
            </Chip>
          )}
          {item.vegetarian && (
            <Chip tone="green">
              <Leaf className="h-3 w-3" aria-hidden /> Vegetal
            </Chip>
          )}
          {onBrasa && (
            <Chip tone="brasa">
              <Flame className="h-3 w-3" aria-hidden /> A la brasa
            </Chip>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function Chip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "fuego" | "green" | "plum" | "brasa";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em]",
        // fuego = deep brick red (fire). NOT --closed pink — that color is
        // reserved for the "Cerrado" status badge and reading the two side
        // by side made spicy dishes look bloody.
        tone === "fuego" && "border-[#C8341B]/45 bg-[#C8341B]/12 text-[#FF8A6F]",
        tone === "green" && "border-open/40 bg-open/10 text-open",
        tone === "plum"  && "border-plum-400/40 bg-plum-500/10 text-plum-300",
        tone === "brasa" && "border-hot/40 bg-hot/10 text-hot-soft"
      )}
    >
      {children}
    </span>
  );
}
