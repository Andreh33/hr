import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso legal",
};

export default function LegalNotice() {
  return (
    <>
      <h1>Aviso legal</h1>
      <p>
        Este sitio es propiedad y está operado por {SITE.name}, restaurante
        físico ubicado en {SITE.address.street}, {SITE.address.postalCode}{" "}
        {SITE.address.locality}, {SITE.address.region}, España.
      </p>

      <h2>Contacto</h2>
      <p>Teléfono: {SITE.phone.pretty}</p>

      <h2>Propiedad intelectual</h2>
      <p>
        Los textos, identidad visual y arquitectura del sitio son propiedad de{" "}
        {SITE.name} salvo indicación contraria. El código de la web es
        propiedad del cliente y de los terceros cuyas licencias se mantienen.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        Hacemos lo razonable por mantener actualizados precios y disponibilidad,
        pero la información definitiva la confirma siempre el equipo en sala.
      </p>
    </>
  );
}
