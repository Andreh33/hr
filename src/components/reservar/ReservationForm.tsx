"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarDays, Check, Clock, Loader2, Mail, Phone, Users } from "lucide-react";
import { reservationSchema, type ReservationInput } from "@/lib/reservation-schema";
import { cn } from "@/lib/utils";

const todayISO = () => new Date().toISOString().slice(0, 10);

export function ReservationForm() {
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      date: todayISO(),
      time: "21:00",
      people: 2,
      notes: "",
    },
  });

  const onSubmit = async (values: ReservationInput) => {
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json()) as { ok: boolean; id?: string; error?: string };
      if (!res.ok || !json.ok) {
        toast.error(json.error ?? "No pudimos guardar la reserva.");
        return;
      }
      setSuccess(json.id ?? "ok");
      toast.success("Reserva enviada. Te confirmamos por teléfono.");
      reset({
        ...values,
        notes: "",
      });
    } catch {
      toast.error("Sin conexión. Llámanos y lo arreglamos al teléfono.");
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-open/15 text-open">
          <Check className="h-7 w-7" />
        </span>
        <p className="font-display text-2xl text-bone-50">Reserva recibida</p>
        <p className="max-w-sm text-bone-100/65">
          Te llamamos en breve para confirmar el sitio. Referencia: <span className="font-mono text-bone-50">{success.slice(0, 8)}</span>
        </p>
        <button
          type="button"
          onClick={() => setSuccess(null)}
          className="mt-2 inline-flex h-10 items-center rounded-full border border-plum-500/40 px-5 font-mono text-xs uppercase tracking-[0.2em] text-bone-50 hover:border-plum-400"
        >
          Hacer otra reserva
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre" error={errors.name?.message}>
          <input
            {...register("name")}
            type="text"
            autoComplete="name"
            placeholder="Tu nombre"
            className="hr-input"
          />
        </Field>

        <Field label="Teléfono" error={errors.phone?.message} Icon={Phone}>
          <input
            {...register("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+34 600 000 000"
            className="hr-input"
          />
        </Field>
      </div>

      <Field label="Email (opcional, para confirmación)" error={errors.email?.message} Icon={Mail}>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          className="hr-input"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Fecha" error={errors.date?.message} Icon={CalendarDays}>
          <input
            {...register("date")}
            type="date"
            min={todayISO()}
            className="hr-input"
          />
        </Field>

        <Field label="Hora" error={errors.time?.message} Icon={Clock}>
          <input
            {...register("time")}
            type="time"
            step={900}
            className="hr-input"
          />
        </Field>

        <Field label="Comensales" error={errors.people?.message} Icon={Users}>
          <input
            {...register("people", { valueAsNumber: true })}
            type="number"
            inputMode="numeric"
            min={1}
            max={20}
            className="hr-input"
          />
        </Field>
      </div>

      <Field label="Notas (alergias, ocasión, etc.)" error={errors.notes?.message}>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="¿Alguna alergia? ¿Cumpleaños? Cuéntanos."
          className="hr-input resize-none"
        />
      </Field>

      <div className="flex items-center justify-between gap-3 pt-2">
        <p className="text-xs text-bone-100/45">
          Al enviar, aceptas nuestra <a href="/legal/privacidad" className="underline hover:text-bone-50">política de privacidad</a>.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "inline-flex h-12 items-center gap-2 rounded-full px-6 font-mono text-xs uppercase tracking-[0.2em] transition-transform",
            "bg-hot text-ink-950 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando…
            </>
          ) : (
            <>Reservar mesa →</>
          )}
        </button>
      </div>

      <style>{`
        .hr-input {
          width: 100%;
          background: var(--ink-950);
          color: var(--bone-50);
          border: 1px solid color-mix(in oklch, var(--plum-500) 25%, transparent);
          border-radius: 0.75rem;
          padding: 0.75rem 0.95rem;
          font-family: var(--font-sans-stack), system-ui, sans-serif;
          font-size: 0.95rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .hr-input::placeholder {
          color: color-mix(in oklch, var(--bone-50) 32%, transparent);
        }
        .hr-input:focus {
          outline: none;
          border-color: var(--azure-400);
          box-shadow: 0 0 0 3px color-mix(in oklch, var(--azure-400) 25%, transparent);
        }
        .hr-input::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.6);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  Icon,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  Icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <label className="block">
      <span className="text-eyebrow flex items-center gap-2 text-bone-100/60">
        {Icon && <Icon className="h-3 w-3" aria-hidden />}
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1.5 text-xs text-closed">{error}</p>}
    </label>
  );
}
