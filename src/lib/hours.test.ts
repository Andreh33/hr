import { describe, expect, it } from "vitest";
import {
  computeStatus,
  formatStatusLabel,
  madridDate,
  getZonedParts,
} from "./hours";

// Calendar anchors (2026):
//   05-13 Wed | 14 Thu | 15 Fri | 16 Sat | 17 Sun | 18 Mon | 19 Tue
//   Spring DST 2026: clocks jump forward 2026-03-29 02:00 → 03:00.
//
// SCHEDULE: no midday service. Wed–Sun open 20:00, closing at 24:00
// (Wed/Thu/Sun), 00:30 (Fri), or 01:00 (Sat).
// CLOSING_SOON threshold is 60 minutes per v3.1 brief.

describe("hours · state machine", () => {
  it("Friday 23:55 → CLOSING_SOON, closes at 00:30 next day", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 15, hour: 23, minute: 55 }));
    expect(s.kind).toBe("CLOSING_SOON");
    if (s.kind === "CLOSING_SOON") expect(s.closesAt).toBe("00:30");
  });

  it("Friday 22:30 → OPEN, closes at 00:30", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 15, hour: 22, minute: 30 }));
    expect(s.kind).toBe("OPEN");
    if (s.kind === "OPEN") expect(s.closesAt).toBe("00:30");
  });

  it("Saturday 02:00 → CLOSED_TODAY_OPENS_LATER (no midday — abre 20:00)", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 16, hour: 2, minute: 0 }));
    expect(s.kind).toBe("CLOSED_TODAY_OPENS_LATER");
    if (s.kind === "CLOSED_TODAY_OPENS_LATER") expect(s.opensAt).toBe("20:00");
  });

  it("Saturday 14:00 → CLOSED_TODAY_OPENS_LATER (sin mediodía, abre 20:00)", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 16, hour: 14, minute: 0 }));
    expect(s.kind).toBe("CLOSED_TODAY_OPENS_LATER");
    if (s.kind === "CLOSED_TODAY_OPENS_LATER") expect(s.opensAt).toBe("20:00");
  });

  it("Saturday 19:30 → CLOSED_TODAY_OPENS_LATER, abre 20:00", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 16, hour: 19, minute: 30 }));
    expect(s.kind).toBe("CLOSED_TODAY_OPENS_LATER");
    if (s.kind === "CLOSED_TODAY_OPENS_LATER") expect(s.minutesUntilOpen).toBe(30);
  });

  it("Saturday 22:30 → OPEN, closes at 01:00 next day", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 16, hour: 22, minute: 30 }));
    expect(s.kind).toBe("OPEN");
    if (s.kind === "OPEN") expect(s.closesAt).toBe("01:00");
  });

  it("Sunday 14:00 → CLOSED_TODAY_OPENS_LATER, abre 20:00 (sin mediodía)", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 17, hour: 14, minute: 0 }));
    expect(s.kind).toBe("CLOSED_TODAY_OPENS_LATER");
    if (s.kind === "CLOSED_TODAY_OPENS_LATER") expect(s.opensAt).toBe("20:00");
  });

  it("Sunday 22:00 → OPEN, closes at 24:00", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 17, hour: 22, minute: 0 }));
    expect(s.kind).toBe("OPEN");
    if (s.kind === "OPEN") expect(s.closesAt).toBe("24:00");
  });

  it("Monday 10:00 → CLOSED, next opening is Wednesday 20:00 (not tomorrow)", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 18, hour: 10, minute: 0 }));
    expect(s.kind).toBe("CLOSED");
    if (s.kind === "CLOSED") {
      expect(s.nextDay).toBe("miércoles");
      expect(s.opensAt).toBe("20:00");
      expect(s.isTomorrow).toBe(false);
    }
  });

  it("Tuesday 22:00 → CLOSED, next opening is tomorrow (Wednesday)", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 19, hour: 22, minute: 0 }));
    expect(s.kind).toBe("CLOSED");
    if (s.kind === "CLOSED") {
      expect(s.nextDay).toBe("miércoles");
      expect(s.opensAt).toBe("20:00");
      expect(s.isTomorrow).toBe(true);
    }
  });

  it("Wednesday 19:30 → CLOSED_TODAY_OPENS_LATER, abre 20:00 (ámbar, no rojo)", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 13, hour: 19, minute: 30 }));
    expect(s.kind).toBe("CLOSED_TODAY_OPENS_LATER");
    if (s.kind === "CLOSED_TODAY_OPENS_LATER") expect(s.opensAt).toBe("20:00");
  });

  it("Wednesday 22:00 → OPEN, closes at 24:00", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 13, hour: 22, minute: 0 }));
    expect(s.kind).toBe("OPEN");
    if (s.kind === "OPEN") expect(s.closesAt).toBe("24:00");
  });

  it("Wednesday 23:45 → CLOSING_SOON (15 min hasta el cierre 24:00)", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 13, hour: 23, minute: 45 }));
    expect(s.kind).toBe("CLOSING_SOON");
    if (s.kind === "CLOSING_SOON") expect(s.minutesUntilClose).toBe(15);
  });

  it("formatStatusLabel — CLOSED isTomorrow renders \"mañana\"", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 19, hour: 22, minute: 0 }));
    expect(formatStatusLabel(s)).toMatch(/Cerrado · abre mañana a las 20:00/);
  });

  it("formatStatusLabel — CLOSED days away renders \"el <día>\"", () => {
    const s = computeStatus(madridDate({ year: 2026, month: 5, day: 18, hour: 10, minute: 0 }));
    expect(formatStatusLabel(s)).toMatch(/Cerrado · abre el miércoles a las 20:00/);
  });

  it("madridDate roundtrips wall-clock parts under Europe/Madrid", () => {
    const d = madridDate({ year: 2026, month: 7, day: 4, hour: 21, minute: 15 });
    const parts = getZonedParts(d);
    expect(parts.hour).toBe(21);
    expect(parts.minute).toBe(15);
    expect(parts.day).toBe(4);
    expect(parts.month).toBe(7);
  });
});
