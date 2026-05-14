"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, MapPin, Navigation, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { DAY_NAMES_ES, SCHEDULE, type DayIndex, computeStatus, formatStatusLabel } from "@/lib/hours";
import { QOORDER_URL, externalLinkProps } from "@/lib/links";
import { SITE } from "@/lib/site";
import { Section } from "@/components/ui/section";
import { OpenStatusBadge } from "@/components/layout/OpenStatusBadge";
import { cn } from "@/lib/utils";

// MapLibre is heavy (~200KB) and depends on browser globals — lazy-load it
// client-side only. Skeleton uses the same aspect ratio so layout doesn't shift.
const MapLibreMap = dynamic(() => import("./visit/MapLibreMap").then((m) => m.MapLibreMap), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 animate-pulse bg-ink-800/40" />
  ),
});

const COORDS = { lat: 38.886, lng: -6.6307 };
const MAPS_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lng}&destination_place_id=${encodeURIComponent(
  SITE.name + " " + SITE.address.locality
)}`;

const WEEK_ORDER: DayIndex[] = [1, 2, 3, 4, 5, 6, 0];

// CTA order per v3 brief: Reservar > Cómo llegar > Llamar > Qoorder.
export function Visit() {
  const [todayIdx, setTodayIdx] = useState<DayIndex | null>(null);
  const [statusLabel, setStatusLabel] = useState<string | null>(null);

  useEffect(() => {
    setStatusLabel(formatStatusLabel(computeStatus()));
    setTodayIdx(new Date().getDay() as DayIndex);
  }, []);

  return (
    <Section id="visitanos" className="border-t border-plum-500/10 py-32">
      <div className="grid gap-10 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-plum-500/20 bg-ink-900 lg:col-span-3"
        >
          <div className="relative aspect-[5/4] w-full">
            <MapLibreMap />
          </div>
          <Link
            href={MAPS_DIRECTIONS}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-ink-950/85 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-bone-50 backdrop-blur-md transition-colors hover:text-azure-400"
          >
            <Navigation className="h-3.5 w-3.5" />
            Cómo llegar
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <OpenStatusBadge className="absolute right-4 top-4 z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2"
        >
          <p className="text-eyebrow text-bone-100/55">07 · Visítanos</p>
          <h2 className="mt-4 font-display text-display text-bone-50">
            Estamos<br />
            <span className="italic font-editorial text-bone-100/80">a la vuelta.</span>
          </h2>

          <div className="mt-8 space-y-5">
            <Row Icon={MapPin}>
              <p className="text-bone-50">{SITE.address.street}</p>
              <p className="text-sm text-bone-100/55">
                {SITE.address.postalCode} {SITE.address.locality}, {SITE.address.region}
              </p>
            </Row>
            <Row Icon={Phone}>
              <a
                href={`tel:${SITE.phone.e164}`}
                className="font-mono text-base text-bone-50 transition-colors hover:text-azure-400"
              >
                {SITE.phone.pretty}
              </a>
              <p className="text-sm text-bone-100/55">Llamar es el camino más rápido un sábado noche.</p>
            </Row>
          </div>

          <div className="mt-10 rounded-2xl border border-plum-500/15 bg-ink-900/70 p-5">
            <div className="flex items-center justify-between">
              <p className="text-eyebrow text-bone-100/60">Horario</p>
              {statusLabel && (
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-bone-100/50">
                  {statusLabel}
                </span>
              )}
            </div>
            <ul className="mt-4 divide-y divide-plum-500/10">
              {WEEK_ORDER.map((d) => (
                <DayRow key={d} day={d} isToday={todayIdx === d} />
              ))}
            </ul>
          </div>

          {/* CTAs in priority order: reservar → cómo llegar → llamar → Qoorder */}
          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            <Link
              href="/reservar"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-hot px-5 font-mono text-xs uppercase tracking-[0.2em] text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              Reservar mesa
            </Link>
            <Link
              href={MAPS_DIRECTIONS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-azure-400 px-5 font-mono text-xs uppercase tracking-[0.2em] text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              <Navigation className="h-4 w-4" />
              Cómo llegar
            </Link>
            <a
              href={`tel:${SITE.phone.e164}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-plum-500/40 px-5 font-mono text-xs uppercase tracking-[0.2em] text-bone-50 hover:border-plum-400"
            >
              <Phone className="h-4 w-4" />
              Llamar
            </a>
            <a
              href={QOORDER_URL}
              {...externalLinkProps}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-azure-400/40 bg-azure-400/10 px-5 font-mono text-xs uppercase tracking-[0.2em] text-azure-400 hover:border-azure-400"
            >
              Pedir en Qoorder
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function Row({ Icon, children }: { Icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-plum-500/25 text-plum-300">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function DayRow({ day, isToday }: { day: DayIndex; isToday: boolean }) {
  const slot = SCHEDULE[day];
  return (
    <li
      className={cn(
        "flex items-center justify-between gap-4 py-2.5 transition-colors",
        isToday && "rounded-md bg-plum-700/15 px-3"
      )}
    >
      <span
        className={cn(
          "font-mono text-xs uppercase tracking-[0.15em]",
          isToday ? "text-bone-50" : "text-bone-100/55"
        )}
      >
        {DAY_NAMES_ES[day]}
        {isToday && (
          <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-azure-400">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-azure-400 motion-safe:animate-[dot-pulse_1.6s_ease-in-out_infinite]"
            />
            hoy
          </span>
        )}
      </span>
      <span className={cn("font-mono text-xs tabular-nums", isToday ? "text-bone-50" : "text-bone-100/55")}>
        {!slot ? (
          <span className="text-closed">Cerrado</span>
        ) : (
          slot.ranges.map((r, i) => (
            <span key={i} className="ml-2 first:ml-0">
              {r.open} – {r.close}
            </span>
          ))
        )}
      </span>
    </li>
  );
}
