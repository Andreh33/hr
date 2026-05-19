"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";

// Decoupled sparkles field — same SVG glyph as the magicui SparklesText but
// positioned independently of any inline-flow element. Avoids the bug where
// SparklesText broke "fronteras." onto a hidden line.

type Sparkle = {
  id: string;
  x: number; // %
  y: number; // %
  scale: number;
  delay: number;
  color: string;
};

function generate(count: number): Sparkle[] {
  const out: Sparkle[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      id: `${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.4 + Math.random() * 0.8,
      delay: Math.random() * 2,
      color: Math.random() > 0.5 ? "#38B6FF" : "#A87BFF",
    });
  }
  return out;
}

export function SparklesField({
  count = 14,
  className = "absolute inset-0 -z-10 pointer-events-none",
}: {
  count?: number;
  className?: string;
}) {
  const isMobile = useIsMobile();
  const [sparkles, setSparkles] = useState<Sparkle[] | null>(null);

  const effectiveCount = isMobile ? Math.min(4, count) : count;

  useEffect(() => {
    setSparkles(generate(effectiveCount));
    // En mobile no regeneramos: evita reflujo de animaciones cada 6s.
    if (isMobile) return;
    const id = setInterval(() => setSparkles(generate(effectiveCount)), 6000);
    return () => clearInterval(id);
  }, [effectiveCount, isMobile]);

  if (!sparkles) return null;

  return (
    <div aria-hidden className={className}>
      {sparkles.map((s) => (
        <motion.svg
          key={s.id}
          width="14"
          height="14"
          viewBox="0 0 21 21"
          style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%` }}
          initial={{ opacity: 0, scale: 0, rotate: 75 }}
          animate={{ opacity: [0, 1, 0], scale: [0, s.scale, 0], rotate: [75, 120, 150] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        >
          <path
            d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
            fill={s.color}
          />
        </motion.svg>
      ))}
    </div>
  );
}
