"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ExternalLink, Menu, X } from "lucide-react";
import { OpenStatusBadge } from "./OpenStatusBadge";
import { NAV, SITE } from "@/lib/site";
import { QOORDER_URL, externalLinkProps } from "@/lib/links";
import { cn } from "@/lib/utils";

// Sticky chrome. At scrollY > 80px we shrink the padding, fade in a
// backdrop-blur and the hairline border. The "+ HR" wordmark uses Fraunces
// with a tracked-out plum "+" so the icon reads as type, not a glyph.
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 80);
  });

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-plum-500/15 bg-ink-950/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-10",
          scrolled ? "h-14" : "h-20"
        )}
      >
        <Link href="/" className="group flex items-center gap-2" aria-label={SITE.name}>
          <span
            className="font-display text-2xl leading-none text-bone-50 transition-colors group-hover:text-azure-400"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1' }}
          >
            HR
          </span>
          <span
            aria-hidden
            className="text-2xl leading-none text-plum-400 transition-transform duration-300 group-hover:rotate-90"
          >
            +
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="px-3 py-2 text-sm text-bone-100/75 transition-colors hover:text-azure-400"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={QOORDER_URL}
              {...externalLinkProps}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-bone-100/75 transition-colors hover:text-azure-400"
            >
              Reparto
              <ExternalLink className="h-3 w-3" />
            </a>
          </li>
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <OpenStatusBadge compact={scrolled} />
          <Link
            href="/reservar"
            className="inline-flex h-9 items-center rounded-full bg-hot px-5 font-mono text-xs uppercase tracking-[0.2em] text-ink-950 transition-transform hover:-translate-y-0.5"
          >
            Reservar
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-plum-500/30 text-bone-50 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>

      {/* Mobile drawer — full-bleed Sheet styled with the brand chrome. */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-ink-950/95 backdrop-blur-2xl md:hidden"
        >
          <div className="flex h-full flex-col px-6 pb-10 pt-6">
            <div className="flex items-center justify-between">
              <OpenStatusBadge />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-plum-500/40 text-bone-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-6">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-5xl text-bone-50 hover:text-gradient-hr"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * NAV.length, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href={QOORDER_URL}
                  {...externalLinkProps}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 font-display text-5xl text-bone-50 hover:text-azure-400"
                >
                  Reparto
                  <ExternalLink className="h-6 w-6" />
                </a>
              </motion.li>
            </ul>
            <Link
              href="/reservar"
              onClick={() => setOpen(false)}
              className="inline-flex h-12 items-center justify-center rounded-full bg-hot font-mono text-sm uppercase tracking-[0.2em] text-ink-950"
            >
              Reservar mesa
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
