"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { animate, useInView, useMotionValue, type Easing } from "motion/react";
import { cn } from "@/lib/utils";

// Custom NumberTicker — tween-based (not spring) so we control exact
// duration. Lands cleanly on the target value, never overshoots, never
// loops. Locale defaults to es-ES so 4.1 renders as "4,1".
//
// Use `duration={1.4}` for under-the-radar tickers (rating + count). Larger
// numbers feel faster than they are because of digit churn — 1.4-1.8s is the
// sweet spot before the eye reads it as a glitch.
interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  decimalPlaces?: number;
  locale?: string;
  ease?: Easing | Easing[];
  once?: boolean;
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  duration = 1.4,
  ease = [0.22, 1, 0.36, 1],
  once = true,
  decimalPlaces = 0,
  locale = "es-ES",
  className,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : startValue);
  const isInView = useInView(ref, { once, margin: "0px" });

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  useEffect(() => {
    if (!isInView) return;
    const target = direction === "down" ? startValue : value;
    const controls = animate(motionValue, target, {
      duration,
      delay,
      ease,
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = formatter.format(
            Number(latest.toFixed(decimalPlaces))
          );
        }
      },
    });
    return () => controls.stop();
  }, [motionValue, isInView, delay, value, startValue, direction, duration, decimalPlaces, formatter, ease]);

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)} {...props}>
      {formatter.format(direction === "down" ? value : startValue)}
    </span>
  );
}
