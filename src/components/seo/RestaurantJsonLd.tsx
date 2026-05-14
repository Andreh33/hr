import { SITE } from "@/lib/site";

// schema.org Restaurant data. openingHoursSpecification mirrors /lib/hours.ts.
// Updating one without the other will desync the badge from the snippet shown
// in search results — keep them in lockstep.
export function RestaurantJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    image: `${SITE.url}/opengraph-image`,
    url: SITE.url,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    telephone: SITE.phone.e164,
    servesCuisine: ["Hamburguesas", "Bocadillos", "Internacional"],
    priceRange: "€€",
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "20:00", closes: "24:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday",  opens: "20:00", closes: "24:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday",    opens: "20:00", closes: "00:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday",  opens: "20:00", closes: "01:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday",    opens: "20:00", closes: "24:00" },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.rating.value.toString(),
      reviewCount: SITE.rating.count.toString(),
    },
    hasMenu: `${SITE.url}/menu`,
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw, not React-escaped — Next supports this pattern.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
