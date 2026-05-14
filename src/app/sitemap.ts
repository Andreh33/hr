import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${SITE.url}${path}`;
  return [
    { url: url("/"),                lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: url("/menu"),            lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/reservar"),        lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/legal/privacidad"),lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: url("/legal/aviso-legal"),lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/legal/cookies"),   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
