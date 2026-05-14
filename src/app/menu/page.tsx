import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CartaSection } from "@/components/sections/carta/CartaSection";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Carta completa",
  description:
    "La carta de HR+ World Food: hamburguesas clásicas y gourmet, bocadillos, la casa de las papas, snacks, raciones y postres. Sabores de medio mundo a 5 min de tu casa.",
};

export default function MenuPage() {
  return (
    <>
      <main className="relative flex flex-col pt-24">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-eyebrow text-bone-100/55 hover:text-bone-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver
          </Link>
        </div>
        <CartaSection />
      </main>
      <Footer />
    </>
  );
}
