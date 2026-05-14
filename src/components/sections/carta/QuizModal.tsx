"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles, Wand2, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { findItem, type MenuItem } from "@/data/menu";
import { QOORDER_URL, externalLinkProps } from "@/lib/links";
import { cn } from "@/lib/utils";
import { formatPrice } from "./format";

// ──────────────────────────────────────────────────────────────────────
// "¿Qué hamburguesa eres?" — 3 questions → archetype + recommended dishes.
// Decoupled from order state: the trio is shown as a recommendation. Users
// who want to order tap "Pedir en Qoorder" (external) or "Reservar mesa".
// ──────────────────────────────────────────────────────────────────────

type Answer = {
  label: string;
  audacia: number;
  social: number;
  picante: number;
};
type Question = { prompt: string; options: Answer[] };

const QUESTIONS: ReadonlyArray<Question> = [
  {
    prompt: "¿Cómo vienes hoy?",
    options: [
      { label: "Quiero algo de toda la vida", audacia: 0, social: 0, picante: 0 },
      { label: "Sorpréndeme un poco",         audacia: 1, social: 0, picante: 0 },
      { label: "A romper la barra",           audacia: 2, social: 0, picante: 1 },
    ],
  },
  {
    prompt: "¿Solo o en compañía?",
    options: [
      { label: "Solo, sin hablar con nadie", audacia: 0, social: 0, picante: 0 },
      { label: "En pareja",                  audacia: 0, social: 1, picante: 0 },
      { label: "Mesa grande, a compartir",   audacia: 0, social: 2, picante: 0 },
    ],
  },
  {
    prompt: "¿Picante?",
    options: [
      { label: "Cero, gracias",          audacia: 0, social: 0, picante: 0 },
      { label: "Un toque, soporto bien", audacia: 0, social: 0, picante: 1 },
      { label: "Cuanto más, mejor",      audacia: 1, social: 0, picante: 2 },
    ],
  },
];

type ArchetypeId = "classic" | "bold" | "spicy" | "premium" | "group";
type Archetype = {
  id: ArchetypeId;
  name: string;
  tagline: string;
  desc: string;
  dishIds: [string, string, string];
  accent: "azure" | "plum" | "hot";
};

const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  classic: { id: "classic", name: "Clásic@ con criterio", tagline: "Pan, queso, oficio.", desc: "Lo conocido te tranquiliza, pero exiges que esté bien hecho. La cocina te respeta.",  dishIds: ["cheese-burguer", "boc-secreto", "papas-moscu"], accent: "azure" },
  bold:    { id: "bold",    name: "El/la gamberr@",       tagline: "Si no me sorprende, no cuenta.", desc: "Pan negro, takis, algodón de azúcar — cuanto más raro, más te gusta.", dishIds: ["pantera", "la-koqueta", "papas-tokio"], accent: "plum" },
  spicy:   { id: "spicy",   name: "Fuego puro",           tagline: "Quiero llorar en el primer mordisco.", desc: "Picante, BBQ, salsas con carácter. La carta te pide perdón antes de servirte.", dishIds: ["diabla", "papas-denver", "rac-secreto-brasa"], accent: "hot" },
  premium: { id: "premium", name: "Refinad@",             tagline: "Brioche, trufa, secreto.", desc: "Vienes a disfrutar. La presentación te importa y los ingredientes también.", dishIds: ["gamberra", "rac-solomillo", "la-jefa"], accent: "plum" },
  group:   { id: "group",   name: "Equipo grande",        tagline: "Pedimos de todo y compartimos.", desc: "Bandejas en el centro, manos cruzadas, todo el mundo prueba.", dishIds: ["doble-ternera-pollo", "papas-profesor", "rac-cachopo"], accent: "azure" },
};

function pickArchetype(scores: { audacia: number; social: number; picante: number }): ArchetypeId {
  if (scores.picante >= 3) return "spicy";
  if (scores.social >= 3) return "group";
  if (scores.audacia >= 3) return "bold";
  if (scores.audacia >= 2 && scores.social <= 1) return "premium";
  return "classic";
}

export function QuizLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-2.5 rounded-full border border-plum-500/30 bg-ink-900/60 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-bone-100/80 transition-all hover:border-azure-400 hover:text-bone-50"
      >
        <Wand2 className="h-3.5 w-3.5 text-azure-400 transition-transform group-hover:rotate-12" />
        ¿Qué hamburguesa eres?
        <span className="text-[10px] text-bone-100/40">90 s</span>
      </button>
      <AnimatePresence>{open && <QuizDialog onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function QuizDialog({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const isResult = step === QUESTIONS.length;

  const scores = answers.reduce(
    (acc, a) => ({ audacia: acc.audacia + a.audacia, social: acc.social + a.social, picante: acc.picante + a.picante }),
    { audacia: 0, social: 0, picante: 0 }
  );
  const archetype = isResult ? ARCHETYPES[pickArchetype(scores)] : null;

  function answer(a: Answer) {
    setAnswers((prev) => [...prev, a]);
    setStep((s) => s + 1);
  }
  function reset() {
    setAnswers([]);
    setStep(0);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[70] bg-ink-950/85 backdrop-blur-md"
      />
      <motion.div
        role="dialog"
        aria-label="Quiz · ¿Qué hamburguesa eres?"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-1/2 top-1/2 z-[80] flex w-[min(94vw,640px)] max-h-[88vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-plum-500/30 bg-ink-900 shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 border-b border-plum-500/15 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-plum-500/20 text-plum-300">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-eyebrow text-bone-100/55">Quiz</p>
              <p className="font-display text-lg leading-none text-bone-50">¿Qué hamburguesa eres?</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar quiz"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-plum-500/25 text-bone-100/70 hover:border-plum-400 hover:text-bone-50"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="h-1 w-full bg-ink-800">
          <motion.div
            className="h-full bg-gradient-to-r from-azure-400 to-plum-400"
            animate={{ width: `${(step / QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="overflow-y-auto px-6 py-8 md:px-10 md:py-10">
          <AnimatePresence mode="wait">
            {!isResult ? (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-100/45">
                  {String(step + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight text-bone-50">
                  {QUESTIONS[step]!.prompt}
                </h3>
                <div className="mt-6 grid gap-2.5">
                  {QUESTIONS[step]!.options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => answer(opt)}
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-plum-500/20 bg-ink-950/40 px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-azure-400 hover:bg-ink-950/60"
                    >
                      <span className="font-display text-lg text-bone-50">{opt.label}</span>
                      <ArrowRight className="h-4 w-4 text-bone-100/40 transition-transform group-hover:translate-x-1 group-hover:text-azure-400" />
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep((s) => s - 1);
                      setAnswers((a) => a.slice(0, -1));
                    }}
                    className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-bone-100/55 hover:text-bone-50"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Atrás
                  </button>
                )}
              </motion.div>
            ) : (
              archetype && <QuizResult archetype={archetype} onReset={reset} onClose={onClose} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

function QuizResult({
  archetype,
  onReset,
  onClose,
}: {
  archetype: Archetype;
  onReset: () => void;
  onClose: () => void;
}) {
  const dishes = archetype.dishIds.map((id) => findItem(id)).filter((d): d is MenuItem => !!d);
  const accent = {
    azure: "from-azure-400/90 to-azure-600/30",
    plum:  "from-plum-500/90 to-plum-700/30",
    hot:   "from-hot/90 to-plum-700/30",
  }[archetype.accent];

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-eyebrow text-bone-100/55">Tu hamburguesa-personalidad</p>
      <h3 className={`mt-3 inline-block bg-gradient-to-br ${accent} bg-clip-text font-display-hero text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.95] text-transparent`}>
        {archetype.name}
      </h3>
      <p className="mt-3 font-editorial text-xl italic text-bone-50">{archetype.tagline}</p>
      <p className="mt-3 max-w-md text-sm text-bone-100/70">{archetype.desc}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {dishes.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.2 + i * 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
            className={cn(
              "group relative flex h-full flex-col items-start justify-between gap-3 overflow-hidden rounded-2xl border border-plum-500/20 bg-ink-950/60 p-4 text-left"
            )}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-100/45">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-display text-xl leading-tight text-bone-50">{d.name}</p>
            <div className="mt-auto flex w-full items-center justify-between">
              <span className="font-mono text-sm tabular-nums text-azure-400">{formatPrice(d.price)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/reservar"
          onClick={onClose}
          className="inline-flex h-12 items-center rounded-full bg-hot px-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-950 transition-transform hover:-translate-y-0.5"
        >
          Reservar mesa →
        </Link>
        <a
          href={QOORDER_URL}
          {...externalLinkProps}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-azure-400/40 bg-azure-400/10 px-5 font-mono text-xs uppercase tracking-[0.2em] text-azure-400 hover:border-azure-400"
        >
          Pedir en Qoorder
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-plum-500/30 px-5 font-mono text-xs uppercase tracking-[0.2em] text-bone-100/70 hover:border-plum-400 hover:text-bone-50"
        >
          Repetir quiz
        </button>
      </div>
    </motion.div>
  );
}
