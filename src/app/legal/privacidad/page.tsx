import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  robots: { index: true, follow: true },
};

export default function Privacy() {
  return (
    <>
      <h1>Política de privacidad</h1>
      <p>
        En {SITE.name} tratamos tus datos personales con la mínima invasión
        posible. Esta página explica qué recogemos, para qué y cuáles son tus
        derechos según el RGPD.
      </p>

      <h2>Datos que recogemos</h2>
      <ul>
        <li>Nombre, teléfono y, opcionalmente, email — cuando reservas mesa.</li>
        <li>Notas que añadas (alergias, ocasión) — solo para preparar tu visita.</li>
        <li>Datos analíticos anónimos vía Vercel Analytics (sin cookies de seguimiento personal).</li>
      </ul>

      <h2>Para qué los usamos</h2>
      <p>
        Solo para gestionar tu reserva y, si lo activas, enviarte el recordatorio
        por email. No cedemos tus datos a terceros para marketing.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión y
        oposición escribiéndonos a <a href={`tel:${SITE.phone.e164}`}>{SITE.phone.pretty}</a> o
        en persona en {SITE.address.street}, {SITE.address.locality}.
      </p>
    </>
  );
}
