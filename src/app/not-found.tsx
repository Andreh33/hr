import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--grad-hero)" }}
    >
      <p className="text-eyebrow text-bone-100/55">404</p>
      <h1 className="mt-4 font-display-hero text-hero text-bone-50">
        <span className="text-gradient-hr">Esta página</span>{" "}
        <span className="italic font-editorial">aún no existe.</span>
      </h1>
      <p className="font-editorial mt-6 max-w-md text-lg italic text-bone-100/70">
        Pero la carta sí, y huele de lujo.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-hot px-6 font-mono text-sm uppercase tracking-[0.2em] text-ink-950 hover:-translate-y-0.5 transition-transform"
        >
          Volver al inicio
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/menu"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-plum-500/40 px-6 font-mono text-sm uppercase tracking-[0.2em] text-bone-50 hover:border-plum-400"
        >
          Ir a la carta
        </Link>
      </div>
    </main>
  );
}
