"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown, Flame, Star } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { MeshGradient } from "@/components/effects/MeshGradient";
import { SparklesField } from "@/components/effects/SparklesField";
import { GALLERY } from "@/data/photos";
import { SITE } from "@/lib/site";

// Word-by-word load-time reveal. Each word is an inline-block span; the
// trailing &nbsp; lives OUTSIDE the motion span so the space is never eaten
// by overflow:hidden on the parent — that was the v2 "Saborsin" bug.
function HeadlineReveal({ children, delay = 0 }: { children: string; delay?: number }) {
  const words = children.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-flex items-baseline align-baseline">
          <span className="inline-block overflow-hidden">
            <motion.span
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                delay: delay + i * 0.08,
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? <span aria-hidden>&nbsp;</span> : null}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-32 pb-20 md:px-10"
      style={{ background: "var(--ink-950)" }}
    >
      {/* Background photo — warm filter preserved so it looks like food, not a
          sci-fi poster. The plum/azure tint sits on the OUTER vignette only
          (radial gradient ring), not over the photo itself. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={GALLERY.cocina.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.55] motion-safe:scale-[1.03]"
          style={{ filter: "contrast(1.05) saturate(1.1) brightness(0.78)" }}
          placeholder={GALLERY.cocina.blurDataURL ? "blur" : undefined}
          blurDataURL={GALLERY.cocina.blurDataURL || undefined}
        />
        {/* radial vignette keeps the food warm in the center, tint only at the edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 45%, transparent 0%, transparent 35%, color-mix(in oklch, var(--ink-950) 75%, transparent) 75%, var(--ink-950) 100%)",
          }}
        />
        {/* outer-only colour tint (no overlay on the centre where the dish is) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 90% at 12% 0%, color-mix(in oklch, var(--azure-500) 32%, transparent), transparent 45%), radial-gradient(120% 90% at 92% 100%, color-mix(in oklch, var(--plum-600) 32%, transparent), transparent 50%)",
            mixBlendMode: "screen",
            opacity: 0.6,
          }}
        />
        {/* keep enough contrast for the type at the bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-[40%]"
          style={{ background: "linear-gradient(180deg, transparent 0%, var(--ink-950) 90%)" }}
        />
      </div>

      <MeshGradient variant="soft" />
      <SparklesField count={12} className="absolute inset-0 -z-[5] pointer-events-none" />

      {/* corner eyebrows */}
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-eyebrow absolute left-5 top-24 hidden text-bone-100/55 md:left-10 md:block"
      >
        EST. PUEBLA DE LA CALZADA · BADAJOZ
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-eyebrow absolute right-5 top-24 hidden text-bone-100/55 md:right-10 md:block"
      >
        BADAJOZ · ESPAÑA
      </motion.div>

      <div className="relative z-10 flex max-w-[1100px] flex-col items-center text-center">
        {/* Brand promise pill. NO emoji — uses lucide Flame SVG. NO SplitText
            — single fade so the spaces between "A LA BRASA" are guaranteed
            preserved. NO Monoton on this badge (its thick outlined glyphs
            looked like an emoji halo on the v3 build). */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6 flex flex-wrap items-center justify-center gap-2 text-eyebrow text-bone-100/60"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hot/40 bg-hot/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-50">
            <Flame className="h-3.5 w-3.5 text-hot" aria-hidden />
            <span>A&nbsp;LA&nbsp;BRASA</span>
          </span>
          <Dot />
          <span>Hamburguesas</span>
          <Dot />
          <span>Bocadillos</span>
          <Dot />
          <span>Casa&nbsp;de&nbsp;las&nbsp;papas</span>
        </motion.div>

        {/* Two-line headline. Line 1 in Fraunces hero. Line 2 in Instrument
            Serif italic — editorial contrast between straight + slanted. */}
        <h1 className="font-display-hero text-bone-50 [text-wrap:balance]" style={{ lineHeight: 0.85 }}>
          <span className="block text-hero">
            <HeadlineReveal delay={0.5}>Sabor sin</HeadlineReveal>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ delay: 0.5 + 3 * 0.08, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block font-editorial italic text-gradient-hr"
              style={{ fontSize: "clamp(3.5rem, 12vw, 11rem)", lineHeight: 0.85 }}
            >
              fronteras.
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-editorial text-body mt-8 italic text-bone-100/85"
        >
          Hamburguesas, bocadillos y la <em className="not-italic font-display text-bone-50">casa de las papas</em> —
          hechos como en casa, servidos como en ningún sitio.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/reservar"
            className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-hot px-7 font-mono text-sm uppercase tracking-[0.2em] text-ink-950 transition-transform hover:-translate-y-0.5"
          >
            <span className="relative z-10">Reservar mesa</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-plum-500 to-azure-500 transition-transform duration-500 group-hover:translate-x-0"
            />
          </Link>
          <Link
            href="#carta"
            className="group inline-flex h-12 items-center gap-2 rounded-full border border-plum-500/40 px-7 font-mono text-sm uppercase tracking-[0.2em] text-bone-50 transition-colors hover:border-plum-400 hover:text-azure-400"
          >
            Ver la carta
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-8 left-5 z-10 flex items-center gap-2 text-bone-100/70 md:left-10"
      >
        <Star className="h-4 w-4 fill-warn text-warn" aria-hidden />
        <span className="font-mono text-sm tabular-nums">
          <NumberTicker value={SITE.rating.value} decimalPlaces={1} className="!text-bone-50" />
          <span className="px-1.5 text-bone-100/40">·</span>
          <NumberTicker value={SITE.rating.count} className="!text-bone-50" />
          <span className="text-bone-100/40"> reseñas Google</span>
        </span>
      </motion.div>

      {/* DESLIZA cue from t=2s, fades out on first scroll */}
      <ScrollCue />
    </section>
  );
}

// Middle-dot separator — the typographic character, not an emoji or SVG.
// Coloured at 30% of bone-50 so it sits behind the category labels.
function Dot() {
  return <span aria-hidden style={{ color: "color-mix(in oklch, var(--bone-50) 30%, transparent)" }}>·</span>;
}

function ScrollCue() {
  return (
    <motion.a
      href="#manifesto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileInView={{ opacity: 1 }}
      className="text-eyebrow absolute bottom-10 right-5 z-10 hidden items-center gap-2 text-bone-100/55 md:right-10 md:flex"
    >
      Desliza
      <ChevronDown className="h-3.5 w-3.5 motion-safe:animate-bounce" aria-hidden />
    </motion.a>
  );
}
