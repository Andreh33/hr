import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Pizarra } from "@/components/sections/Pizarra";
import { BentoStats } from "@/components/sections/BentoStats";
import { Gallery } from "@/components/sections/Gallery";
import { CartaSection } from "@/components/sections/carta/CartaSection";
import { Reviews } from "@/components/sections/Reviews";
import { Visit } from "@/components/sections/Visit";
import { Outro } from "@/components/sections/Outro";
import { Footer } from "@/components/layout/Footer";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

export default function HomePage() {
  return (
    <>
      <main className="relative flex flex-col">
        <Hero />
        <Manifesto />
        <Pizarra />
        <BentoStats />
        <Gallery />
        <CartaSection />
        <Reviews />
        <Visit />
        <Outro />
      </main>
      <Footer />
      <InstallPrompt />
    </>
  );
}
