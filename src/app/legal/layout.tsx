import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="relative pt-32 pb-24">
        <div className="mx-auto w-full max-w-[820px] px-5 md:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-eyebrow text-bone-100/55 hover:text-bone-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver
          </Link>
          <article className="prose prose-invert mt-10 max-w-none text-bone-100/80 [&_h1]:font-display [&_h1]:text-display [&_h1]:text-bone-50 [&_h2]:font-display [&_h2]:text-h2 [&_h2]:text-bone-50 [&_a]:text-azure-400 [&_a:hover]:underline">
            {children}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
