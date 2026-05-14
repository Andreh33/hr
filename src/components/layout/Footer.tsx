import Link from "next/link";
import { InstagramLogo, TiktokLogo } from "@phosphor-icons/react/dist/ssr";
import { StampMark } from "@/components/effects/StampMark";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative isolate border-t border-plum-500/15 bg-ink-950">
      {/* Editorial closer stamp — moved here from the Hero per v3.1 feedback;
          the hero already had too much info competing for attention. */}
      <StampMark
        text="BRASA REAL · EXTREMADURA"
        size={140}
        tone="plum"
        rotate={-8}
        className="hidden md:block absolute right-12 top-12 opacity-25"
        centerLabel="HR+"
      />
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <Link href="/" className="inline-flex items-end gap-1.5">
            <span
              className="font-display text-3xl leading-none text-bone-50"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1' }}
            >
              HR
            </span>
            <span className="text-3xl leading-none text-plum-400">+</span>
            <span className="ml-2 font-editorial italic text-bone-100/55">world food</span>
          </Link>
          <p className="mt-4 max-w-md text-sm text-bone-100/55">
            {SITE.description}
          </p>
        </div>

        <div>
          <p className="text-eyebrow text-bone-100/55">Visítanos</p>
          <address className="not-italic mt-4 space-y-1 text-sm text-bone-100/70">
            <p>{SITE.address.street}</p>
            <p>
              {SITE.address.postalCode} {SITE.address.locality}
            </p>
            <p>{SITE.address.region}, España</p>
            <p>
              <a href={`tel:${SITE.phone.e164}`} className="font-mono hover:text-azure-400">
                {SITE.phone.pretty}
              </a>
            </p>
          </address>
        </div>

        <div>
          <p className="text-eyebrow text-bone-100/55">Legal</p>
          <ul className="mt-4 space-y-1 text-sm text-bone-100/70">
            <li><Link href="/legal/privacidad" className="hover:text-azure-400">Privacidad</Link></li>
            <li><Link href="/legal/aviso-legal" className="hover:text-azure-400">Aviso legal</Link></li>
            <li><Link href="/legal/cookies" className="hover:text-azure-400">Cookies</Link></li>
          </ul>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de HR+"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-plum-500/30 text-bone-100/70 transition-colors hover:border-plum-400 hover:text-bone-50"
            >
              <InstagramLogo size={16} weight="duotone" />
            </Link>
            <Link
              href={SITE.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok de HR+"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-plum-500/30 text-bone-100/70 transition-colors hover:border-plum-400 hover:text-bone-50"
            >
              <TiktokLogo size={16} weight="duotone" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-plum-500/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-6 text-xs text-bone-100/45 md:flex-row md:items-center md:justify-between md:px-10">
          <p>© {new Date().getFullYear()} {SITE.name}. Hecho con cariño en Extremadura.</p>
          <p className="text-[10px] text-bone-100/35">
            Imágenes: Pexels · Pendiente de actualizar con fotografías propias del local.
          </p>
          <p className="font-neon text-lg tracking-[0.18em] text-azure-400/80">EST. 2024</p>
        </div>
      </div>
    </footer>
  );
}
