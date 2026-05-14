import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReservationForm } from "@/components/reservar/ReservationForm";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/site";
import { DAY_NAMES_ES, SCHEDULE, type DayIndex } from "@/lib/hours";

export const metadata: Metadata = {
  title: "Reservar mesa",
  description:
    "Reserva tu mesa en HR+ World Food en segundos. Puebla de la Calzada, Badajoz.",
};

const WEEK_ORDER: DayIndex[] = [1, 2, 3, 4, 5, 6, 0];

export default function ReservarPage() {
  return (
    <>
      <main className="relative pt-32 pb-24">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-eyebrow text-bone-100/55 hover:text-bone-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <p className="text-eyebrow text-bone-100/55">Reserva</p>
              <h1 className="mt-4 font-display-hero text-display text-bone-50">
                Asegura tu sitio<br />
                <span className="italic font-editorial">en menos de un minuto.</span>
              </h1>
              <p className="mt-4 max-w-md text-bone-100/65">
                Te confirmamos por teléfono. Si pones tu email, te llega también
                un recordatorio automático.
              </p>

              <div className="mt-10 rounded-3xl border border-plum-500/15 bg-ink-900/60 p-6 md:p-8">
                <ReservationForm />
              </div>
            </div>

            <aside className="lg:col-span-2">
              <div className="rounded-3xl border border-plum-500/15 bg-ink-900/40 p-6">
                <p className="text-eyebrow text-bone-100/55">Horario</p>
                <ul className="mt-4 divide-y divide-plum-500/10">
                  {WEEK_ORDER.map((d) => {
                    const slot = SCHEDULE[d];
                    return (
                      <li key={d} className="flex items-center justify-between gap-3 py-2.5">
                        <span className="font-mono text-xs uppercase tracking-[0.15em] text-bone-100/55">
                          {DAY_NAMES_ES[d]}
                        </span>
                        <span className="font-mono text-xs tabular-nums text-bone-100/70">
                          {!slot ? (
                            <span className="text-closed">Cerrado</span>
                          ) : (
                            slot.ranges.map((r, i) => (
                              <span key={i} className="ml-2 first:ml-0">
                                {r.open}–{r.close}
                              </span>
                            ))
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-6 rounded-3xl border border-plum-500/15 bg-ink-900/40 p-6">
                <p className="text-eyebrow text-bone-100/55">¿Prefieres llamar?</p>
                <a
                  href={`tel:${SITE.phone.e164}`}
                  className="mt-3 inline-block font-mono text-2xl text-bone-50 hover:text-azure-400"
                >
                  {SITE.phone.pretty}
                </a>
                <p className="mt-2 text-sm text-bone-100/55">
                  Grupos de más de 20 personas: llámanos directamente para coordinar.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
