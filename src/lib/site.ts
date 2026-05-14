export const SITE = {
  name: "HR+ World Food",
  shortName: "HR+",
  tagline: "Sabor sin fronteras",
  description:
    "Hamburguesas, bocadillos y la casa de las papas — hechos como en casa, servidos como en ningún sitio. Puebla de la Calzada, Badajoz.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hrworldfood.es",
  address: {
    street: "Avda. Carmen y Amigo 83E",
    locality: "Puebla de la Calzada",
    region: "Badajoz",
    postalCode: "06490",
    country: "ES",
  },
  phone: {
    e164: "+34641782962",
    pretty: "+34 641 78 29 62",
  },
  whatsapp: "https://wa.me/34641782962",
  rating: {
    value: 4.1,
    count: 103,
    googleUrl: "https://share.google/kgh3bGX9EveADFgT6",
  },
  social: {
    instagram: "https://instagram.com/hrworldfood",
    tiktok: "https://tiktok.com/@hrworldfood",
  },
  delivery: {
    provider: "Qoorder",
    note: "Reparto jueves a domingo (también mediodía los domingos)",
  },
} as const;

export const NAV = [
  { href: "#carta", label: "Carta" },
  { href: "/reservar", label: "Reservar" },
  { href: "#visitanos", label: "Visítanos" },
  // Reparto is a tag, not an anchor — handled separately in Navbar with the
  // external Qoorder link so the visitor leaves the site rather than scroll.
] as const;
