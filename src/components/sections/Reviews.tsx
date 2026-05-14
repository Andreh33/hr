"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Section } from "@/components/ui/section";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

// LEGAL: zero invented reviews. Either:
//  · We have real reviews from Google Places API → render them (with author
//    photos + ratings + the words people actually wrote).
//  · We don't have a key → render a minimal version pointing to Google.
//
// Names with last initials and made-up quotes are out. Permanently.
type Review = {
  authorName: string;
  rating: number;
  text: string;
  time: number;
  profilePhotoUrl?: string;
  relativeTimeDescription?: string;
};

type ReviewsApiResponse = {
  configured: boolean;
  reviews: Review[];
  rating?: number | null;
  total?: number | null;
  error?: string;
};

export function Reviews() {
  const [data, setData] = useState<ReviewsApiResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/google-reviews", { cache: "force-cache" })
      .then((r) => r.json() as Promise<ReviewsApiResponse>)
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setData({ configured: false, reviews: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hasReviews = data && data.reviews.length > 0;
  const displayRating = data?.rating ?? SITE.rating.value;
  const displayCount = data?.total ?? SITE.rating.count;

  return (
    <Section id="reviews" className="relative overflow-hidden py-32">
      <div className="mx-auto mb-12 max-w-[1100px] text-center">
        <p className="text-eyebrow text-bone-100/55">06 · Voces</p>
        <h2 className="mt-4 font-display text-display text-bone-50">
          Lo que dicen los que <span className="italic font-editorial">vuelven</span>.
        </h2>
        <p className="mt-4 mx-auto max-w-md font-editorial italic text-bone-100/70">
          La conversación está en Google. Léenos allí, sin filtros.
        </p>
      </div>

      {hasReviews && (
        <>
          <Marquee pauseOnHover className="[--duration:90s] [--gap:1.25rem]">
            {data!.reviews.map((r, i) => (
              <ReviewCard key={`a-${i}`} review={r} />
            ))}
          </Marquee>
          {data!.reviews.length > 3 && (
            <Marquee pauseOnHover reverse className="mt-4 [--duration:120s] [--gap:1.25rem]">
              {[...data!.reviews].reverse().map((r, i) => (
                <ReviewCard key={`b-${i}`} review={r} subtle />
              ))}
            </Marquee>
          )}
        </>
      )}

      <div className="mt-24 flex flex-col items-center text-center">
        <p className="text-eyebrow text-bone-100/55">Media en Google</p>
        <p className="font-display-hero text-[clamp(5rem,15vw,12rem)] leading-none text-gradient-hr">
          <NumberTicker value={displayRating} decimalPlaces={1} duration={1.4} className="!text-gradient-hr" />
        </p>
        <div className="mt-4 flex items-center gap-1.5" aria-label={`${displayRating} de 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <StarTick key={i} index={i} value={displayRating} />
          ))}
        </div>
        <p className="mt-4 font-mono text-sm uppercase tracking-[0.2em] text-bone-100/60">
          <NumberTicker value={displayCount} duration={1.6} className="!text-bone-50" /> reseñas en Google
        </p>
        <Link
          href={SITE.rating.googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-plum-500/40 px-6 font-mono text-xs uppercase tracking-[0.2em] text-bone-50 transition-colors hover:border-azure-400 hover:text-azure-400"
        >
          Ver todas en Google
          <span aria-hidden>→</span>
        </Link>
      </div>
    </Section>
  );
}

function StarTick({ index, value }: { index: number; value: number }) {
  // Fractional fill so 4.1 ★ shows 4 full stars + 1 at 10%.
  const fillRatio = Math.max(0, Math.min(1, value - index));
  return (
    <motion.span
      initial={{ scale: 0, rotate: -10 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative inline-block h-7 w-7"
      aria-hidden
    >
      <Star className="absolute inset-0 h-full w-full text-bone-100/15" />
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillRatio * 100}%` }}>
        <Star className="h-7 w-7 fill-warn text-warn" />
      </span>
    </motion.span>
  );
}

function ReviewCard({ review, subtle = false }: { review: Review; subtle?: boolean }) {
  return (
    <article
      className={cn(
        "relative w-[320px] shrink-0 overflow-hidden rounded-2xl border p-6 md:w-[380px]",
        subtle ? "border-plum-500/10 bg-ink-900/40" : "border-plum-500/20 bg-ink-900/80"
      )}
    >
      <Quote className="absolute -top-2 -left-2 h-16 w-16 text-plum-500/15" aria-hidden />
      <div className="relative flex items-center gap-3">
        {review.profilePhotoUrl ? (
          <Image
            src={review.profilePhotoUrl}
            alt={review.authorName}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-azure-400/80 to-plum-500/80 font-mono text-xs font-bold uppercase text-ink-950">
            {review.authorName.slice(0, 2)}
          </span>
        )}
        <div>
          <p className="font-display text-sm text-bone-50">{review.authorName}</p>
          <div className="flex items-center gap-0.5" aria-label={`${review.rating} de 5`}>
            {Array.from({ length: review.rating }, (_, i) => (
              <Star key={i} className="h-3 w-3 fill-warn text-warn" />
            ))}
          </div>
          {review.relativeTimeDescription && (
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-bone-100/40">
              {review.relativeTimeDescription}
            </p>
          )}
        </div>
      </div>
      <p className="relative mt-4 font-editorial text-base leading-relaxed italic text-bone-100/85 line-clamp-6">
        “{review.text}”
      </p>
    </article>
  );
}
