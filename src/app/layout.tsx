import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { fontVariables } from "./fonts";
import { SITE } from "@/lib/site";
import { RestaurantJsonLd } from "@/components/seo/RestaurantJsonLd";
import { Navbar } from "@/components/layout/Navbar";
import { Grain } from "@/components/effects/Grain";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Sabor sin fronteras en Puebla de la Calzada`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  keywords: [
    "hamburguesas",
    "Puebla de la Calzada",
    "Badajoz",
    "restaurante",
    "world food",
    "casa de las papas",
    "bocadillos gourmet",
    "Extremadura",
  ],
  openGraph: {
    title: `${SITE.name} — Sabor sin fronteras`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Sabor sin fronteras`,
    description: SITE.description,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
  alternates: {
    canonical: SITE.url,
  },
  formatDetection: {
    telephone: true,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0C14",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fontVariables} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-full flex flex-col bg-background text-foreground">
        <Grain />
        <Navbar />
        {children}
        <Toaster position="bottom-right" theme="dark" richColors />
        <RestaurantJsonLd />
        <ServiceWorkerRegister />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
