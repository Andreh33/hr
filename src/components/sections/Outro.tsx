"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, ExternalLink, Phone, Truck, UtensilsCrossed } from "lucide-react";
import { SparklesText } from "@/components/ui/sparkles-text";
import { Section } from "@/components/ui/section";
import { GALLERY } from "@/data/photos";
import { QOORDER_URL, externalLinkProps } from "@/lib/links";
import { SITE } from "@/lib/site";

// S8 — "¿Hambre?" outro. Sparkles only around the headline (not the whole
// section) so the eye lands hard on the question. Three terminal CTAs: book,
// delivery, call. Each goes somewhere irreversible — that's the point.
export function Outro() {
  return (
    <Section
      id="hambre"
      className="relative isolate overflow-hidden border-t border-plum-500/15 py-32 text-center"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={GALLERY.pantera.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25 [filter:grayscale(0.4)_contrast(1.05)]"
          placeholder={GALLERY.pantera.blurDataURL ? "blur" : undefined}
          blurDataURL={GALLERY.pantera.blurDataURL || undefined}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 30%, color-mix(in oklch, var(--plum-600) 50%, transparent), transparent 70%), linear-gradient(180deg, transparent 0%, var(--ink-950) 90%)",
            mixBlendMode: "screen",
          }}
        />
        <div className="absolute inset-0 bg-ink-950/60" />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-eyebrow text-bone-100/55"
      >
        08 · La parte fácil
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6"
      >
        <SparklesText
          colors={{ first: "#38B6FF", second: "#A87BFF" }}
          sparklesCount={14}
          className="font-display-hero text-[clamp(5rem,18vw,14rem)] leading-none text-bone-50"
        >
          ¿Hambre?
        </SparklesText>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="font-editorial mx-auto mt-8 max-w-xl italic text-bone-100/75 text-lg"
      >
        Mesa, reparto o teléfono. Tú eliges en cuánto tarda la primera mordida.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center"
      >
        <Link
          href="/reservar"
          className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-hot px-7 font-mono text-sm uppercase tracking-[0.2em] text-ink-950 transition-transform hover:-translate-y-0.5"
        >
          <UtensilsCrossed className="h-4 w-4" />
          Reservar mesa
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <a
          href={QOORDER_URL}
          {...externalLinkProps}
          className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-azure-400 px-7 font-mono text-sm uppercase tracking-[0.2em] text-ink-950 transition-transform hover:-translate-y-0.5"
        >
          <Truck className="h-4 w-4" />
          Pedir en Qoorder
          <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        {/* On mobile the phone is the most physical action — make it large too */}
        <a
          href={`tel:${SITE.phone.e164}`}
          className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border border-plum-500/40 bg-ink-900/40 px-7 font-mono text-sm uppercase tracking-[0.2em] text-bone-50 transition-colors hover:border-plum-400"
        >
          <Phone className="h-4 w-4" />
          {SITE.phone.pretty}
        </a>
      </motion.div>
    </Section>
  );
}
