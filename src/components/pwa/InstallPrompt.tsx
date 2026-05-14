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

// 5s precise reveal, 320px max, slide-in spring, mini phone mockup.
// Three install paths:
//  · Chrome/Edge (desktop+Android): native beforeinstallprompt → prompt().
//  · iOS Safari: visual step-by-step (no API exists).
//  · Other browsers / event not yet fired: per-platform manual hint so the
//    button is never mute (the v4 bug — clicking did nothing when the
//    browser hadn't yet emitted the event).
type Platform = "android" | "ios" | "desktop-chrome" | "desktop-other" | "other";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  const isChromium = /Chrome|Edg|Opera|Brave/.test(ua) && !/Mobile/.test(ua);
  return isChromium ? "desktop-chrome" : "desktop-other";
}

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<Platform>("other");
  const [installing, setInstalling] = useState(false);
  const [needsManualHint, setNeedsManualHint] = useState(false);

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

    setPlatform(detectPlatform());

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
      setInstalling(true);
      try {
        await installEvent.prompt();
        const choice = await installEvent.userChoice;
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ state: choice.outcome, at: Date.now() } as Decision)
        );
      } finally {
        setInstalling(false);
        setVisible(false);
      }
      return;
    }
    // No native event captured. iOS already shows steps. For everything else
    // surface the per-platform manual instructions inline.
    if (platform !== "ios") setNeedsManualHint(true);
  }

  // Pick the inline hint shown when the native prompt isn't available.
  const hintFor = (p: Platform) => {
    switch (p) {
      case "ios":
        return null; // dedicated ios block below
      case "desktop-chrome":
        return "Pulsa el icono de instalación (un monitor con flecha) en la barra de direcciones del navegador.";
      case "android":
        return "Abre el menú del navegador (⋮) y elige “Instalar app” o “Añadir a pantalla de inicio”.";
      case "desktop-other":
        return "Tu navegador todavía no expone la instalación. En Chrome o Edge sí está disponible: copia esta URL allí y verás el icono de instalar.";
      default:
        return "Abre esta web en Chrome o Edge para instalarla como app.";
    }
  };

  const showIosSteps = platform === "ios";
  const inlineHint = needsManualHint ? hintFor(platform) : null;

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

            {showIosSteps && (
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
            )}

            {inlineHint && (
              <div className="mt-3 rounded-lg bg-ink-950/40 p-2.5 text-[11px] leading-snug text-bone-100/85">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-azure-400">Instalación manual</p>
                <p className="mt-1">{inlineHint}</p>
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={accept}
                disabled={installing}
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.15em] transition-all",
                  installing
                    ? "border border-plum-400/30 text-bone-100/50"
                    : "bg-azure-400 text-ink-950 hover:-translate-y-0.5"
                )}
              >
                {installing ? "Instalando…" : showIosSteps ? "Entendido" : inlineHint ? "Ver pasos ↑" : "Instalar"}
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
