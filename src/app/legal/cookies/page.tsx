import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies",
};

export default function Cookies() {
  return (
    <>
      <h1>Política de cookies</h1>
      <p>
        Esta web no utiliza cookies de seguimiento publicitario. Las únicas
        que podrían crearse son técnicas, estrictamente necesarias para que
        algunas funciones (instalación de la app, recordatorio del modo de
        pedido) recuerden tu última decisión durante 30 días.
      </p>

      <h2>Almacenamiento local</h2>
      <p>
        Usamos <code>localStorage</code> para recordar:
      </p>
      <ul>
        <li>Si ya rechazaste o aceptaste la invitación a instalar la app.</li>
      </ul>
      <p>
        Puedes borrarlo en cualquier momento desde la configuración de tu
        navegador.
      </p>
    </>
  );
}
