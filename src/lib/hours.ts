// HR+ World Food — open/closed state machine in Europe/Madrid.
// Designed to be pure & deterministic: pass a Date, get a status. The
// `<OpenStatusBadge />` calls computeStatus() every 30s on the client.
//
// Keep the SCHEDULE in lockstep with /components/seo/RestaurantJsonLd.tsx and
// the JSON-LD openingHoursSpecification block.

export type Range = {
  open: string; // "HH:mm"
  close: string; // "HH:mm" — "24:00" is treated as midnight (00:00 next day)
  closesNextDay?: boolean; // true when close < open and crosses midnight
};

export type DayHours = { ranges: Range[] } | null; // null = closed all day

// 0 = Sunday, 6 = Saturday (matches JS Date.getDay).
//
// IMPORTANT: HR+ does NOT open at midday. Don't add 13:00–15:30 ranges back —
// the previous data came from a stale Google Business profile. If the venue
// adds lunch service in the future, restore the midday range AND have the
// client update Google Business at the same time so the two sources don't
// diverge again.
export const SCHEDULE: Record<0 | 1 | 2 | 3 | 4 | 5 | 6, DayHours> = {
  0: { ranges: [{ open: "20:00", close: "24:00" }] }, // domingo
  1: null, // lunes — cerrado
  2: null, // martes — cerrado
  3: { ranges: [{ open: "20:00", close: "24:00" }] }, // miércoles
  4: { ranges: [{ open: "20:00", close: "24:00" }] }, // jueves
  5: { ranges: [{ open: "20:00", close: "00:30", closesNextDay: true }] }, // viernes
  6: { ranges: [{ open: "20:00", close: "01:00", closesNextDay: true }] }, // sábado
};

export const TZ = "Europe/Madrid";

export const DAY_NAMES_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
] as const;

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Status =
  | { kind: "OPEN"; closesAt: string; minutesUntilClose: number }
  | { kind: "CLOSING_SOON"; closesAt: string; minutesUntilClose: number }
  | { kind: "CLOSED_TODAY_OPENS_LATER"; opensAt: string; minutesUntilOpen: number }
  | { kind: "CLOSED"; nextDay: string; opensAt: string; isTomorrow: boolean };

// Threshold to flip the OPEN badge to CLOSING_SOON. The brief asks for 60 min:
// gives the visitor enough margin to plan a walk-in vs. choose delivery.
const CLOSING_SOON_THRESHOLD_MIN = 60;

// ─────────────────────────────────────────────────────────────
// Time helpers — work in Europe/Madrid regardless of host TZ.
// We use Intl.DateTimeFormat with timeZone to extract Y/M/D/H/m
// from any Date instance, so the math stays correct under DST.
// ─────────────────────────────────────────────────────────────

type Parts = {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number; // 0-23
  minute: number;
  dayOfWeek: DayIndex;
};

const PARTS_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  weekday: "short",
});

const SHORT_WEEKDAY_TO_INDEX: Record<string, DayIndex> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function getZonedParts(date: Date): Parts {
  const parts = PARTS_FORMATTER.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  const weekday = map.weekday ?? "Sun";
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour === "24" ? "0" : map.hour),
    minute: Number(map.minute),
    dayOfWeek: SHORT_WEEKDAY_TO_INDEX[weekday] ?? 0,
  };
}

export function parseHHmm(value: string): { h: number; m: number } {
  const [h, m] = value.split(":");
  return { h: Number(h), m: Number(m) };
}

// Convert HH:mm into a minute offset from start of day. "24:00" → 1440.
export function toMinutes(value: string): number {
  const { h, m } = parseHHmm(value);
  return h * 60 + m;
}

// Same-day minute offset for a Parts object.
export function partsMinutes(parts: Parts): number {
  return parts.hour * 60 + parts.minute;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function fmtMinutes(min: number): string {
  // 1440 (== 24:00) → display as "24:00" for clarity in CTAs
  if (min === 1440) return "24:00";
  const wrapped = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${pad(h)}:${pad(m)}`;
}

function prevDay(idx: DayIndex): DayIndex {
  return ((idx + 6) % 7) as DayIndex;
}

function nextDay(idx: DayIndex): DayIndex {
  return ((idx + 1) % 7) as DayIndex;
}

// ─────────────────────────────────────────────────────────────
// Core: build the timeline of intervals covering "today" so we
// can answer "are we inside one right now?".
//
// Each interval is in minutes-from-start-of-today (can be negative
// when carrying from the previous day, or > 1440 when carrying into
// the next day).
// ─────────────────────────────────────────────────────────────

type Interval = { startMin: number; endMin: number; closeLabel: string };

function buildIntervals(dayIdx: DayIndex): Interval[] {
  const intervals: Interval[] = [];

  // Yesterday's range that crosses midnight bleeds into today.
  const yesterday = SCHEDULE[prevDay(dayIdx)];
  if (yesterday) {
    for (const r of yesterday.ranges) {
      if (!r.closesNextDay) continue;
      const closeMin = toMinutes(r.close); // 0-1440
      intervals.push({
        startMin: -1, // covers the very start of today
        endMin: closeMin,
        closeLabel: r.close,
      });
    }
  }

  // Today's ranges
  const today = SCHEDULE[dayIdx];
  if (today) {
    for (const r of today.ranges) {
      const startMin = toMinutes(r.open);
      const closeMin = toMinutes(r.close);
      const endMin = r.closesNextDay ? 1440 + closeMin : closeMin;
      intervals.push({ startMin, endMin, closeLabel: r.close });
    }
  }

  return intervals;
}

// Find the next opening from a given moment, scanning up to 7 days ahead.
function findNextOpening(
  fromDayIdx: DayIndex,
  fromMin: number
): { dayIdx: DayIndex; openMin: number; openLabel: string } {
  for (let offset = 0; offset < 8; offset++) {
    const idx = ((fromDayIdx + offset) % 7) as DayIndex;
    const day = SCHEDULE[idx];
    if (!day) continue;
    for (const r of day.ranges) {
      const startMin = toMinutes(r.open);
      if (offset === 0 && startMin <= fromMin) continue;
      return { dayIdx: idx, openMin: startMin, openLabel: r.open };
    }
  }
  // Fallback (should never hit — schedule always has at least one open day)
  return { dayIdx: fromDayIdx, openMin: 0, openLabel: "00:00" };
}

export function computeStatus(now: Date = new Date()): Status {
  const parts = getZonedParts(now);
  const dayIdx = parts.dayOfWeek;
  const minNow = partsMinutes(parts);

  const intervals = buildIntervals(dayIdx);

  for (const interval of intervals) {
    if (minNow >= interval.startMin && minNow < interval.endMin) {
      const minutesUntilClose = interval.endMin - minNow;
      const closesAt = fmtMinutes(interval.endMin > 1440 ? interval.endMin - 1440 : interval.endMin);
      if (minutesUntilClose <= CLOSING_SOON_THRESHOLD_MIN) {
        return { kind: "CLOSING_SOON", closesAt, minutesUntilClose };
      }
      return { kind: "OPEN", closesAt, minutesUntilClose };
    }
  }

  // Closed right now. Is there another opening today?
  const today = SCHEDULE[dayIdx];
  if (today) {
    for (const r of today.ranges) {
      const startMin = toMinutes(r.open);
      if (startMin > minNow) {
        return {
          kind: "CLOSED_TODAY_OPENS_LATER",
          opensAt: r.open,
          minutesUntilOpen: startMin - minNow,
        };
      }
    }
  }

  // Otherwise find the next opening day.
  const next = findNextOpening(nextDay(dayIdx), -1);
  const isTomorrow = next.dayIdx === nextDay(dayIdx);
  return {
    kind: "CLOSED",
    nextDay: DAY_NAMES_ES[next.dayIdx],
    opensAt: next.openLabel,
    isTomorrow,
  };
}

// Single source of truth for the badge copy. Four exact states, no vague
// "Abre luego" or "Abre hoy" — always a concrete time, every time.
export function formatStatusLabel(status: Status): string {
  switch (status.kind) {
    case "OPEN":
      return `Abierto · cierra a las ${status.closesAt}`;
    case "CLOSING_SOON":
      return `Cierra en ${status.minutesUntilClose} min`;
    case "CLOSED_TODAY_OPENS_LATER":
      return `Cerrado · abre a las ${status.opensAt}`;
    case "CLOSED":
      return status.isTomorrow
        ? `Cerrado · abre mañana a las ${status.opensAt}`
        : `Cerrado · abre el ${status.nextDay} a las ${status.opensAt}`;
  }
}

// Helper for tests: synthesize a Date that represents the given wall-clock
// time in Europe/Madrid (handling DST automatically).
export function madridDate(input: {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
}): Date {
  // Brute-force search: start from UTC of the wall-clock and nudge until the
  // formatted Madrid time matches. Two iterations cover both DST possibilities.
  const utcGuess = Date.UTC(input.year, input.month - 1, input.day, input.hour, input.minute);
  for (let offsetHours = -2; offsetHours <= 2; offsetHours++) {
    const candidate = new Date(utcGuess - offsetHours * 60 * 60 * 1000);
    const parts = getZonedParts(candidate);
    if (
      parts.year === input.year &&
      parts.month === input.month &&
      parts.day === input.day &&
      parts.hour === input.hour &&
      parts.minute === input.minute
    ) {
      return candidate;
    }
  }
  // Fallback: assume UTC equals Madrid (shouldn't happen)
  return new Date(utcGuess);
}
