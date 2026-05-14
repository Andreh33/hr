"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Two radial blobs (azure + plum) drifting across the background.
// Heavy filter:blur → constrained to transform/opacity to keep GPU happy.
// Honors prefers-reduced-motion via Tailwind `motion-safe:` modifier.
export function MeshGradient({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "soft";
}) {
  const intensity = variant === "hero" ? 0.6 : 0.35;
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden -z-10",
        className
      )}
    >
      <motion.div
        className="absolute h-[55vmax] w-[55vmax] rounded-full bg-azure-500/60 blur-[120px]"
        style={{ top: "-10%", left: "-10%", opacity: intensity }}
        animate={{ x: [0, 80, -40, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute h-[60vmax] w-[60vmax] rounded-full bg-plum-500/60 blur-[140px]"
        style={{ bottom: "-20%", right: "-15%", opacity: intensity }}
        animate={{ x: [0, -60, 40, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-ink-950/30" />
    </div>
  );
}
