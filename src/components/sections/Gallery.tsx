"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Flame } from "lucide-react";
import { Bread, Cheese, Pepper, ForkKnife, Coffee, Pizza, Egg, Carrot, Drop, Plant } from "@phosphor-icons/react/dist/ssr";
import { GALLERY, INGREDIENT_TICKER, type Photo } from "@/data/photos";
import { Marquee } from "@/components/ui/marquee";
import { Section } from "@/components/ui/section";

// Editorial gallery with real Pexels photography. Replaces the previous
// typography-only placeholders after v4 feedback. The grid is preserved so
// when the client delivers their own plate shoots, the diff is one-line per
// slot in /data/photos.ts.
//
// IMPORTANT v4: the "Mapa de sabores" section that lived here was removed.
// The Top de la semana ("La Pantera, otra vez") now connects directly to the
// ingredient marquee — extra mt-24 between them so it breathes.

const TILES: ReadonlyArray<{
  photo: Photo;
  title: string;
  caption: string;
  span: string;
  aspect: string;
  priority?: boolean;
}> = [
  { photo: GALLERY.cocina,  title: "La cocina en plena hora punta", caption: "Bandeja saliendo de plancha · sábado 22:30", span: "md:col-span-8 md:row-span-2", aspect: "16/10", priority: true },
  { photo: GALLERY.papas,   title: "Patatas Río emplatadas",         caption: "Casa de las papas",                          span: "md:col-span-4",               aspect: "4/5" },
  { photo: GALLERY.queso,   title: "Queso fundido, sin censura",     caption: "Hamburguesas clásicas",                      span: "md:col-span-2",               aspect: "1/1" },
  { photo: GALLERY.bandeja, title: "Bandeja para compartir",         caption: "Mesa grande",                                span: "md:col-span-2",               aspect: "1/1" },
];

const ICON_FOR_INGREDIENT: ReadonlyArray<React.ComponentType<{ size?: number; weight?: "duotone" | "regular" | "fill" | "bold"; className?: string }>> = [
  Bread, Cheese, Pepper, ForkKnife, Coffee, Pizza, Egg, Carrot, Drop, Plant,
];

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yLarge = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const ySmall = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const weekISO = getISOWeek(new Date());

  return (
    <Section bleed className="border-t border-plum-500/10 py-24 md:py-32">
      <div className="mx-auto mb-12 max-w-[1440px] px-5 md:px-10">
        <p className="text-eyebrow text-bone-100/55">04½ · La cocina</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-display text-bone-50">
            <span className="font-neon text-azure-400 text-[clamp(2rem,5vw,4.5rem)]">CARNE,</span> fuego, oficio.<br />
            <span className="font-editorial italic text-bone-100/70">Nada más, nada menos.</span>
          </h2>
          <p className="max-w-md text-bone-100/65">
            Ingredientes elegidos uno a uno. Recetas pulidas durante años. Chapa siempre a la temperatura justa.
          </p>
        </div>
      </div>

      <div ref={ref} className="relative mx-auto grid max-w-[1440px] grid-cols-12 gap-3 px-5 md:px-10">
        {TILES.map((t, i) => {
          const parallaxY = i % 2 === 0 ? yLarge : ySmall;
          return (
            <motion.figure
              key={t.photo.id}
              style={{ y: parallaxY, aspectRatio: t.aspect }}
              className={`relative col-span-12 overflow-hidden rounded-3xl border border-plum-500/15 ${t.span}`}
            >
              <Image
                src={t.photo.src}
                alt={t.photo.alt}
                fill
                sizes={t.span.includes("col-span-8") ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                className="object-cover"
                placeholder={t.photo.blurDataURL ? "blur" : undefined}
                blurDataURL={t.photo.blurDataURL || undefined}
                priority={t.priority}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-transparent p-5 md:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-50/70">
                  Recetas de la casa
                </p>
                <h3 className="mt-1 font-display text-2xl leading-tight text-bone-50 md:text-3xl">
                  {t.title}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-bone-50/50">
                  {t.caption} · {String(i + 1).padStart(2, "0")} / 04
                </p>
              </div>
            </motion.figure>
          );
        })}

        {/* Top de la semana — magazine cover style */}
        <motion.div
          style={{ y: yLarge }}
          className="relative col-span-12 overflow-hidden rounded-3xl border border-plum-500/15"
        >
          <div className="relative aspect-[16/8]">
            <Image
              src={GALLERY.pantera.src}
              alt={GALLERY.pantera.alt}
              fill
              sizes="100vw"
              className="object-cover"
              placeholder={GALLERY.pantera.blurDataURL ? "blur" : undefined}
              blurDataURL={GALLERY.pantera.blurDataURL || undefined}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/75 via-ink-950/15 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-[60%] flex-col justify-center p-6 md:p-10">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-bone-50/40 bg-ink-950/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-50">
                <Flame className="h-3 w-3 text-hot" />
                Elegida por el chef · Semana {weekISO}
              </div>
              <p
                className="mt-4 font-display-hero leading-[0.95] text-bone-50"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", textShadow: "0 2px 24px rgba(0,0,0,0.55)" }}
              >
                La Pantera<span className="font-editorial italic text-bone-100/85">, otra vez.</span>
              </p>
              <p className="mt-3 max-w-md text-sm text-bone-100/80 md:text-base">
                Bacon ahumado, queso fundido, takis crujientes y algodón de azúcar. Sí, lo has leído bien.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ingredient ticker — connects directly to the carta below. mt-24 so
          the chef-pick callout above can breathe per v4 feedback. */}
      <div className="relative mt-24 overflow-hidden border-y border-plum-500/15 py-6 md:py-8">
        <Marquee className="[--duration:60s] [--gap:3rem]">
          {INGREDIENT_TICKER.map((ing, i) => {
            const Icon = ICON_FOR_INGREDIENT[i % ICON_FOR_INGREDIENT.length]!;
            return (
              <span
                key={`a-${i}`}
                className="inline-flex items-center gap-4 font-display text-[clamp(2rem,5vw,4rem)] leading-none text-bone-50/80"
              >
                <Icon size={36} weight="duotone" className="text-plum-300" />
                {ing}
              </span>
            );
          })}
        </Marquee>
      </div>
    </Section>
  );
}

function getISOWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
