"use client";

import { useEffect, useState } from "react";
import { computeStatus, formatStatusLabel, type Status } from "@/lib/hours";
import { cn } from "@/lib/utils";

// SSR computes a snapshot to avoid empty flash; the client takes over and
// recomputes every 30s so the label stays honest across midnight rollovers.
// Hydration mismatch on this badge is suppressed deliberately — alternative
// is hiding the pill until hydrate, costing AT-fold polish.
type Props = { compact?: boolean; className?: string };

export function OpenStatusBadge({ compact = false, className }: Props) {
  const [status, setStatus] = useState<Status>(() => computeStatus());

  useEffect(() => {
    setStatus(computeStatus());
    const id = setInterval(() => setStatus(computeStatus()), 30_000);
    return () => clearInterval(id);
  }, []);

  const tone = toneFor(status.kind);
  const label = formatStatusLabel(status);

  return (
    <span
      suppressHydrationWarning
      role="status"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
        "backdrop-blur-md bg-ink-900/70",
        tone.border,
        tone.text,
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-2 w-2 rounded-full",
          tone.dot,
          status.kind !== "CLOSED" && "motion-safe:animate-[dot-pulse_1.6s_ease-in-out_infinite]"
        )}
      >
        {status.kind === "OPEN" && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-open/60 motion-safe:animate-ping"
          />
        )}
      </span>
      {compact ? tone.short : label}
    </span>
  );
}

// Color tones per state. CLOSED_TODAY_OPENS_LATER is amber (warm yellow);
// only CLOSED (days away) is red.
function toneFor(kind: Status["kind"]) {
  switch (kind) {
    case "OPEN":
      return { dot: "bg-open",   border: "border-open/40",   text: "text-open",   short: "Abierto"  };
    case "CLOSING_SOON":
      return { dot: "bg-warn",   border: "border-warn/40",   text: "text-warn",   short: "Cerrando" };
    case "CLOSED_TODAY_OPENS_LATER":
      return { dot: "bg-warn",   border: "border-warn/40",   text: "text-warn",   short: "Abre hoy" };
    case "CLOSED":
      return { dot: "bg-closed", border: "border-closed/40", text: "text-closed", short: "Cerrado"  };
  }
}
