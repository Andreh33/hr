import { z } from "zod";

// Single source of truth shared between the form (client) and API route.
// Strings are trimmed and bounded; phone allows international format.
export const reservationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(80, "Demasiado largo"),
  phone: z
    .string()
    .trim()
    .min(6, "Teléfono no válido")
    .max(20, "Teléfono no válido")
    .regex(/^[\d+\s().-]+$/u, "Solo números, espacios y + ( ) - ."),
  email: z
    .string()
    .trim()
    .email("Email no válido")
    .max(120)
    .optional()
    .or(z.literal("")),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/u, "Fecha no válida"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/u, "Hora no válida"),
  people: z
    .number({ message: "Indica el nº de comensales" })
    .int("Sin decimales")
    .min(1, "Mínimo 1")
    .max(20, "Para grupos grandes, llámanos"),
  notes: z.string().trim().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
