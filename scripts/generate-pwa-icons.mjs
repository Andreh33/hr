// Rasterize the SVG brand mark into PNG icons that the PWA manifest can
// reference. Chrome's installability heuristic REQUIRES at least one PNG icon
// ≥ 192×192 — without it, beforeinstallprompt never fires and the "Instalar"
// button has nothing to invoke.
//
// We produce:
//  · icon-192.png        — manifest minimum + apple-touch-icon
//  · icon-512.png        — splash + larger contexts
//  · icon-192-maskable.png + icon-512-maskable.png — same art with safe-area
//    padding so Android's adaptive icon mask doesn't crop the "+".
//  · apple-touch-icon.png (180×180) — iOS Safari Add-to-Home-Screen.

import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const SRC = "public/icons/icon.svg";
const OUT = "public/icons";

const svg = await readFile(SRC);

async function out(name, size, opts = {}) {
  const { maskablePadding = 0, background = "#0E0C14" } = opts;
  const inner = size - maskablePadding * 2;
  // Render the SVG at the inner size then composite onto a solid background
  // with the safe-area padding. background-color picks up the brand ink so
  // there's no visible seam when the OS crops a circular icon.
  const innerBuf = await sharp(svg)
    .resize({ width: inner, height: inner })
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: innerBuf, top: maskablePadding, left: maskablePadding }])
    .png()
    .toFile(join(OUT, name));
  console.log(`  ✓ ${name}`);
}

console.log(`Generating PWA icons from ${SRC}…`);
await out("icon-192.png", 192);
await out("icon-512.png", 512);
// Maskable icons reserve ~15% safe-area padding per spec
await out("icon-192-maskable.png", 192, { maskablePadding: 28 });
await out("icon-512-maskable.png", 512, { maskablePadding: 76 });
await out("apple-touch-icon.png", 180);
console.log("Done.");
