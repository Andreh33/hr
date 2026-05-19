"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";

// Two radial blobs (azure + plum) drifting across the background.
// Heavy filter:blur — on mobile we kill the animation and shrink the blur so
// the GPU doesn't repaint a 120px-blurred 60vmax surface on every scroll tick.
export function MeshGradient({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "soft";
}) {
  const isMobile = useIsMobile();
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
        className={cn(
          "absolute rounded-full bg-azure-500/60",
          isMobile ? "h-[60vmax] w-[60vmax] blur-[60px]" : "h-[55vmax] w-[55vmax] blur-[120px]"
        )}
        style={{ top: "-10%", left: "-10%", opacity: intensity }}
        animate={isMobile ? undefined : { x: [0, 80, -40, 0], y: [0, 40, -30, 0] }}
        transition={isMobile ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={cn(
          "absolute rounded-full bg-plum-500/60",
          isMobile ? "h-[65vmax] w-[65vmax] blur-[70px]" : "h-[60vmax] w-[60vmax] blur-[140px]"
        )}
        style={{ bottom: "-20%", right: "-15%", opacity: intensity }}
        animate={isMobile ? undefined : { x: [0, -60, 40, 0], y: [0, -40, 20, 0] }}
        transition={isMobile ? undefined : { duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-ink-950/30" />
    </div>
  );
}
