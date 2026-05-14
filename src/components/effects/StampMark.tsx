"use client";

import { cn } from "@/lib/utils";

// Circular "wax stamp" — text curves around a ring, dual-line border. Used
// sparingly as a tactile flourish in margins. Pure SVG, ~1.5KB inline.
//
// `text` is wrapped around the circle. Keep it short (3-4 words max).
type Props = {
  text: string;
  size?: number;
  tone?: "azure" | "plum" | "bone" | "hot";
  rotate?: number;
  className?: string;
  centerLabel?: string;
};

export function StampMark({
  text,
  size = 120,
  tone = "azure",
  rotate = -8,
  className,
  centerLabel,
}: Props) {
  const color = {
    azure: "var(--azure-400)",
    plum:  "var(--plum-400)",
    bone:  "var(--bone-50)",
    hot:   "var(--hot)",
  }[tone];

  const repeated = `${text} · ${text} · `;

  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      width={size}
      height={size}
      style={{ transform: `rotate(${rotate}deg)`, color }}
      className={cn("inline-block opacity-30", className)}
    >
      <defs>
        <path id="stamp-arc" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
      </defs>
      <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="100" cy="100" r="84" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <text fontSize="13" fontFamily="ui-monospace, monospace" fill="currentColor" letterSpacing="3">
        <textPath href="#stamp-arc" startOffset="0%">{repeated.repeat(3)}</textPath>
      </text>
      {centerLabel && (
        <text
          x="100"
          y="108"
          textAnchor="middle"
          fontSize="20"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fill="currentColor"
        >
          {centerLabel}
        </text>
      )}
    </svg>
  );
}
