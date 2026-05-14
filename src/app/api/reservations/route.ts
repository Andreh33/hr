import { NextResponse } from "next/server";
import { reservationSchema } from "@/lib/reservation-schema";
import { getDb } from "@/db";
import { reservations } from "@/db/schema";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Cuerpo JSON inválido" },
      { status: 400 }
    );
  }

  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos no válidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const id = crypto.randomUUID();
  const row = {
    id,
    name: data.name,
    phone: data.phone,
    email: data.email ? data.email : null,
    date: data.date,
    time: data.time,
    people: data.people,
    notes: data.notes ? data.notes : null,
    source: "web",
  };

  // Persist if Turso is wired; otherwise log and continue. The form is the
  // critical path — losing one row to a credential gap shouldn't block the
  // user-facing UX, and the server log lets the owner reconcile manually.
  const db = getDb();
  if (db) {
    try {
      await db.insert(reservations).values(row);
    } catch (err) {
      console.error("[reservations] DB insert failed", err);
      return NextResponse.json(
        { ok: false, error: "No pudimos guardar la reserva. Llámanos al " + SITE.phone.pretty },
        { status: 500 }
      );
    }
  } else {
    console.warn(
      "[reservations] TURSO_* env vars not set — reservation accepted in log-only mode:",
      row
    );
  }

  // Best-effort confirmation email when Resend is configured.
  if (data.email && process.env.RESEND_API_KEY) {
    try {
      await sendConfirmationEmail({ ...data, id });
    } catch (err) {
      // Don't fail the booking on email issues.
      console.error("[reservations] Email send failed", err);
    }
  }

  return NextResponse.json({ ok: true, id });
}

async function sendConfirmationEmail(reservation: {
  id: string;
  name: string;
  email?: string;
  date: string;
  time: string;
  people: number;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "HR+ <reservas@hrworldfood.es>";
  if (!apiKey || !reservation.email) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: reservation.email,
      subject: `Tu reserva en ${SITE.name} — ${reservation.date} a las ${reservation.time}`,
      text: `Hola ${reservation.name},\n\nHemos recibido tu reserva para ${reservation.people} persona(s) el ${reservation.date} a las ${reservation.time}.\n\nReferencia: ${reservation.id.slice(0, 8)}\n\nNos vemos pronto.\n\n${SITE.name}\n${SITE.address.street}, ${SITE.address.locality}\n${SITE.phone.pretty}`,
    }),
  });
}
