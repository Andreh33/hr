"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ExternalLink } from "lucide-react";
import { CATEGORIES, FILTER_PILLS, MENU, type MenuCategory } from "@/data/menu";
import { QOORDER_URL, externalLinkProps } from "@/lib/links";
import { cn } from "@/lib/utils";
import { CartaCard } from "./CartaCard";
import { QuizLauncher } from "./QuizModal";

type FilterId = MenuCategory | "todo" | "vegetal";

// Pure vitrine: filter, browse, learn. Ordering happens off-platform via
// Qoorder or in-person via the reservation form. No cart, no drawer, no
// WhatsApp message builder.
export function CartaSection() {
  return <CartaInner />;
}

// Microcopys re-written for personality after frame-by-frame review.
const SIDEBAR_BLURBS: Record<MenuCategory, string> = {
  "hamburguesas-clasicas": "Pan, fuego, queso. Lo de siempre, mejor que nunca.",
  "hamburguesas-gourmet":  "Cuando la hamburguesa va de gala.",
  "bocadillos":            "Pan, relleno, hambre que no espera.",
  "casa-papas":            "Diez ciudades en una bandeja.",
  "snacks":                "Para picar sin pensar.",
  "raciones":              "Plato grande, mesa contenta.",
  "postres":               "El final feliz, sin tópicos.",
};

function CartaInner() {
  const [filter, setFilter] = useState<FilterId>("todo");
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("hamburguesas-clasicas");

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<MenuCategory, HTMLElement | null>>({
    "hamburguesas-clasicas": null,
    "hamburguesas-gourmet": null,
    "bocadillos": null,
    "casa-papas": null,
    "snacks": null,
    "raciones": null,
    "postres": null,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.2", "end 0.9"],
  });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (changes) => {
        for (const change of changes) {
          if (change.isIntersecting) {
            const id = change.target.getAttribute("data-cat") as MenuCategory | null;
            if (id) setActiveCategory(id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    for (const el of Object.values(sectionRefs.current)) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const filteredCategories = useMemo(() => {
    if (filter === "todo") return CATEGORIES;
    if (filter === "vegetal") {
      const ids = new Set(MENU.filter((m) => m.vegetarian).map((m) => m.category));
      return CATEGORIES.filter((c) => ids.has(c.id as MenuCategory));
    }
    return CATEGORIES.filter((c) => c.id === filter);
  }, [filter]);

  const itemsBy = useMemo(() => {
    const grouped = new Map<MenuCategory, typeof MENU[number][]>();
    for (const cat of CATEGORIES) {
      grouped.set(
        cat.id as MenuCategory,
        MENU.filter((m) => m.category === cat.id && (filter !== "vegetal" || m.vegetarian))
      );
    }
    return grouped;
  }, [filter]);

  return (
    <section
      id="carta"
      ref={containerRef}
      className="relative isolate border-t border-plum-500/10 bg-ink-950 px-5 py-24 md:px-10"
    >
      <motion.div
        aria-hidden
        style={{ width: progressWidth }}
        className="sticky top-14 z-30 h-px bg-gradient-to-r from-azure-400 via-plum-400 to-azure-400"
      />

      <header className="mx-auto mb-12 max-w-[1440px]">
        <p className="text-eyebrow text-bone-100/55">05 · La carta</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-display text-bone-50">
            Hecha como en casa.<br />
            <span className="italic font-editorial text-bone-100/70">Servida como en ningún sitio.</span>
          </h2>
          <QuizLauncher />
        </div>

        <FilterRow filter={filter} onChange={setFilter} />
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-12">
        <aside className="hidden lg:col-span-4 lg:block">
          <nav className="sticky top-28">
            <ul className="flex flex-col">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => {
                      const el = sectionRefs.current[cat.id as MenuCategory];
                      if (el) {
                        const top = el.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top, behavior: "smooth" });
                      }
                    }}
                    className={cn(
                      "group flex w-full items-center gap-4 border-l py-4 pl-4 pr-2 text-left transition-colors",
                      activeCategory === cat.id
                        ? "border-azure-400 text-bone-50"
                        : "border-plum-500/10 text-bone-100/50 hover:text-bone-50"
                    )}
                  >
                    <span className="font-mono text-xs tabular-nums">{cat.number}</span>
                    <div className="flex-1">
                      <p
                        className={cn(
                          "font-display text-2xl leading-tight transition-all",
                          activeCategory === cat.id && "translate-x-1 text-gradient-hr"
                        )}
                      >
                        {cat.label}
                      </p>
                      <p className="text-xs text-bone-100/40">{SIDEBAR_BLURBS[cat.id as MenuCategory] ?? ""}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-plum-500/15 bg-ink-900/60 p-5">
              <p className="text-eyebrow text-bone-100/55">Mesa o reparto</p>
              <p className="mt-2 text-sm leading-relaxed text-bone-100/70">
                Tú eliges. Nosotros tenemos la brasa lista.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/reservar"
                  className="inline-flex h-10 items-center rounded-full bg-hot px-5 font-mono text-xs uppercase tracking-[0.15em] text-ink-950 transition-transform hover:-translate-y-0.5"
                >
                  Reservar mesa
                </Link>
                <a
                  href={QOORDER_URL}
                  {...externalLinkProps}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-plum-500/40 px-4 font-mono text-xs uppercase tracking-[0.15em] text-bone-50 hover:border-azure-400"
                >
                  Qoorder
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </nav>
        </aside>

        <div className="lg:col-span-8">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((cat) => {
              const items = itemsBy.get(cat.id as MenuCategory) ?? [];
              if (items.length === 0) return null;
              return (
                <motion.div
                  key={cat.id}
                  layout
                  ref={(el) => {
                    sectionRefs.current[cat.id as MenuCategory] = el;
                  }}
                  data-cat={cat.id}
                  className="mb-16 scroll-mt-32"
                >
                  <div className="mb-6 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-h2 text-bone-50">
                      <span className="font-mono text-sm tabular-nums text-bone-100/40">{cat.number} </span>
                      {cat.label}
                    </h3>
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-bone-100/40">
                      {items.length} platos
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {items.map((it, i) => (
                      <CartaCard key={it.id} item={it} index={i} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FilterRow({ filter, onChange }: { filter: FilterId; onChange: (f: FilterId) => void }) {
  const pills: ReadonlyArray<{ id: FilterId; label: string }> = [
    ...FILTER_PILLS,
    { id: "vegetal", label: "Vegetal" },
  ];
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      {pills.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id)}
          aria-pressed={filter === p.id}
          className={cn(
            "rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.15em] transition-colors",
            filter === p.id
              ? "border-azure-400 bg-azure-400/15 text-azure-400"
              : "border-plum-500/20 text-bone-100/60 hover:border-plum-400/50 hover:text-bone-50"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
