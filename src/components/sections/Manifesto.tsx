"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useIsMobile } from "@/hooks/use-is-mobile";

// v4 rewrite — fixes the "last two lines stay grey" bug by:
//  · Generous vertical padding (py-[40vh]/[50vh]) so the scroll range is
//    long enough to cover all words before the block exits the viewport.
//  · offset ["start 0.9", "end 0.4"] starts the animation when the block top
//    enters from the bottom and FINISHES while the block is still in view —
//    no more words half-coloured as they leave the screen.
//  · Each word interpolates inside its own sub-range; gradient pre-applied,
//    only opacity animates → no jarring colour swap.
//  · Constant -2° rotation (no per-scroll rotation animation — was costly).
//  · clamp:true keeps fast scrollers out of intermediate states.
//
// v4.1 mobile perf — el word-by-word useTransform crea ~46 suscripciones al
// scroll, lo que hace que el render se pille en móvil. En móvil cambiamos a
// una sola animación whileInView para todo el párrafo.

const PARAGRAPH =
  "Hay sitios donde se come. Y hay sitios donde te llevas algo. Una salsa que no probaste, una hamburguesa que te recuerda a tu padre, una papa que te transporta a Nairobi sin haber estado. Aquí cocinamos el mundo a 5 minutos de tu casa.";

export function Manifesto() {
  const isMobile = useIsMobile();
  return isMobile ? <ManifestoMobile /> : <ManifestoDesktop />;
}

function ManifestoMobile() {
  return (
    <section id="manifesto" className="relative isolate overflow-hidden">
      <Backdrop />
      <div className="mx-auto max-w-5xl px-6 py-[30vh]">
        <motion.p
          initial={{ opacity: 0.18 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display leading-[1.15] tracking-[-0.01em] text-[clamp(1.75rem,5vw,3.75rem)] text-balance bg-[linear-gradient(110deg,var(--azure-400),var(--plum-400))] bg-clip-text text-transparent"
          style={{ transform: "rotate(-2deg)", transformOrigin: "center" }}
        >
          {PARAGRAPH}
        </motion.p>
      </div>
    </section>
  );
}

function ManifestoDesktop() {
  const ref = useRef<HTMLDivElement>(null);
  const words = PARAGRAPH.split(" ");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.4"],
  });

  return (
    <section
      id="manifesto"
      ref={ref}
      className="relative isolate overflow-hidden"
    >
      <Backdrop />
      <div className="mx-auto max-w-5xl px-6 py-[40vh] sm:py-[50vh]">
        <p
          className="font-display leading-[1.15] tracking-[-0.01em] text-[clamp(1.75rem,5vw,3.75rem)] text-balance"
          style={{ transform: "rotate(-2deg)", transformOrigin: "center" }}
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = (i + 1) / words.length;
            return <Word key={`${i}-${word}`} word={word} start={start} end={end} progress={scrollYProgress} />;
          })}
        </p>
      </div>
    </section>
  );
}

function Backdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 bg-ink-950">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, color-mix(in oklch, var(--plum-400) 35%, transparent) 0.8px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.45,
          maskImage: "radial-gradient(70% 60% at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, color-mix(in oklch, var(--plum-500) 16%, transparent), transparent 70%), linear-gradient(180deg, var(--ink-950) 0%, transparent 18%, transparent 82%, var(--ink-950) 100%)",
        }}
      />
    </div>
  );
}

function Word({
  word,
  start,
  end,
  progress,
}: {
  word: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [start, end], [0.18, 1], { clamp: true });
  return (
    <motion.span
      style={{ opacity }}
      className="mr-[0.25em] inline-block bg-[linear-gradient(110deg,var(--azure-400),var(--plum-400))] bg-clip-text text-transparent"
    >
      {word}
    </motion.span>
  );
}
