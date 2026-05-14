"use client";

import { AnimatePresence, motion } from "motion/react";
import { Share, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const SHOW_DELAY_MS = 5_000;
const STORAGE_KEY = "hr-install-decision";
const COOLDOWN_DAYS = 30;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1_000;

type Decision = { state: "dismissed" | "accepted"; at: number };

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

// 5-second precise reveal, 320px max width, slide-in spring, mini phone
// mockup. Cooldown 30 days on dismiss/accept.
export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.matchMedia("(display-mode: standalone)").matches) return;
      const navAny = window.navigator as Navigator & { standalone?: boolean };
      if (navAny.standalone) return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Decision;
        if (Date.now() - parsed.at < COOLDOWN_MS) return;
      } catch {
        // ignore
      }
    }

    const ua = window.navigator.userAgent;
    const iosLike = /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
    setIsIos(iosLike);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const timer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: "dismissed", at: Date.now() } as Decision)
    );
    setVisible(false);
  }

  async function accept() {
    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ state: choice.outcome, at: Date.now() } as Decision)
      );
    } else {
      return;
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="dialog"
          aria-label={`Instalar ${SITE.name} como app`}
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className={cn(
            "fixed z-[60] overflow-hidden rounded-2xl border border-plum-400/40 shadow-2xl backdrop-blur-md",
            "bottom-4 left-4 right-4 max-w-[320px] mx-auto md:left-auto md:right-6 md:mx-0 md:bottom-6"
          )}
          style={{
            background:
              "linear-gradient(140deg, color-mix(in oklch, var(--plum-700) 80%, var(--ink-900)) 0%, color-mix(in oklch, var(--ink-900) 90%, var(--azure-500)) 100%)",
          }}
        >
          <div className="relative p-4">
            <button
              type="button"
              onClick={dismiss}
              aria-label="Descartar invitación"
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-bone-100/60 hover:bg-ink-950/40 hover:text-bone-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-start gap-3 pr-8">
              {/* Mini phone mockup — single inline SVG, ~1KB */}
              <PhoneMockup />
              <div>
                <h3 className="font-display text-lg leading-tight text-bone-50">
                  Llévatelo en el bolsillo
                </h3>
                <p className="mt-1 text-xs leading-snug text-bone-100/80">
                  Instala HR+ en tu móvil. Carta, reservas y horario, en un toque.
                </p>
              </div>
            </div>

            {isIos && !installEvent ? (
              <ul className="mt-3 space-y-1 rounded-lg bg-ink-950/40 p-2.5 text-[11px] leading-snug text-bone-100/85">
                <li className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-azure-400">1.</span>
                  Pulsa <Share className="inline h-3 w-3 text-azure-400" /> en Safari.
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-azure-400">2.</span>
                  Elige <span className="font-mono">Añadir a pantalla de inicio</span>.
                </li>
              </ul>
            ) : null}

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={accept}
                disabled={isIos && !installEvent}
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.15em] transition-all",
                  isIos && !installEvent
                    ? "border border-plum-400/30 text-bone-100/50"
                    : "bg-azure-400 text-ink-950 hover:-translate-y-0.5"
                )}
              >
                {isIos && !installEvent ? "Sigue los pasos ↑" : "Instalar"}
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-bone-100/70 hover:text-bone-50"
              >
                Ahora no
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function PhoneMockup() {
  return (
    <svg width="48" height="84" viewBox="0 0 48 84" aria-hidden className="shrink-0">
      <rect x="2" y="2" width="44" height="80" rx="8" fill="#0E0C14" stroke="rgba(246,241,232,0.25)" strokeWidth="1" />
      <rect x="6" y="10" width="36" height="64" rx="4" fill="url(#hr-screen)" />
      <rect x="19" y="76" width="10" height="2" rx="1" fill="rgba(246,241,232,0.35)" />
      <defs>
        <linearGradient id="hr-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38B6FF" />
          <stop offset="100%" stopColor="#A87BFF" />
        </linearGradient>
      </defs>
      <text x="24" y="40" textAnchor="middle" fontSize="14" fontWeight="700" fill="#07060A" fontFamily="Georgia, serif">
        HR
      </text>
      <text x="24" y="56" textAnchor="middle" fontSize="14" fontWeight="700" fill="#07060A" fontFamily="Georgia, serif">
        +
      </text>
    </svg>
  );
}
