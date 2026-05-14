import {
  Fraunces,
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
  Monoton,
} from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-stack",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
  preload: true,
});

export const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans-stack",
  display: "swap",
  preload: true,
});

export const editorialItalic = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-editorial-stack",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-stack",
  display: "swap",
});

// Neon-letter accent font. Used at most 3 times on the site (hero badge,
// gallery section title, footer EST. mark) — anywhere else would be abuse.
export const neon = Monoton({
  subsets: ["latin"],
  variable: "--font-neon-stack",
  weight: "400",
  display: "swap",
});

export const fontVariables = [
  fraunces.variable,
  sans.variable,
  editorialItalic.variable,
  mono.variable,
  neon.variable,
].join(" ");
