# HR+ World Food — sitio web

Sitio premium one-pager + carta interactiva + reservas + PWA para el restaurante **HR+ World Food** (Puebla de la Calzada, Badajoz).

> Stack: Next.js 16.2 · TypeScript strict · Tailwind v4 · Motion · shadcn/ui · magicui · Turso (libSQL) · Drizzle · PWA.

## Setup

```bash
pnpm install
pnpm dev   # localhost:3000
```

### 🔐 Turso — rotación de token obligatoria

> **Lee esto antes de tocar nada de base de datos.** Un token anterior se filtró por chat — asume que está comprometido y **NO lo uses**.

1. Revoca el token comprometido:
   ```bash
   turso db tokens revoke <nombre-del-token-antiguo>
   ```
2. Genera uno nuevo:
   ```bash
   turso db tokens create hr-andreh
   ```
3. Copia el `.env.example` y rellena los valores:
   ```bash
   cp .env.example .env.local
   ```
   Edita `.env.local`:
   ```env
   TURSO_DATABASE_URL=libsql://<tu-db>.turso.io
   TURSO_AUTH_TOKEN=<token-nuevo>
   ```
4. **Antes del primer deploy a Vercel**, añade las mismas variables en
   *Vercel → Project → Settings → Environment Variables* (Production + Preview).

`.env.local` está en `.gitignore` — nunca lo subas.

### Variables de entorno

| Variable | Obligatoria | Para qué |
|---|---|---|
| `TURSO_DATABASE_URL` | sí (cuando se conecte la DB) | URL del libSQL de Turso |
| `TURSO_AUTH_TOKEN` | sí | token de Turso (¡el nuevo!) |
| `RESEND_API_KEY` | no | confirmaciones por email de reservas |
| `RESEND_FROM_EMAIL` | no | from configurado en Resend |
| `NEXT_PUBLIC_SITE_URL` | recomendado | URL canónica (default: `https://hrworldfood.es`) |
| `NEXT_PUBLIC_QOORDER_URL` | recomendado | URL pública del storefront en Qoorder (default: `https://qoorder.com/r/hr-world-food`) |
| `GOOGLE_PLACES_API_KEY` | opcional | Reseñas reales en `/api/google-reviews`. Sin key → fallback elegante a la sección minimalista. |
| `GOOGLE_PLACE_ID` | opcional | ID de la ficha de Google Maps del restaurante |

## Modelo de negocio

La web **no procesa pedidos**. Es una vitrina + reservas:
- "Reservar mesa" → formulario propio que escribe en Turso (cuando hay token configurado).
- "Pedir / Reparto" → redirige a Qoorder en pestaña nueva, vía `QOORDER_URL` en `src/lib/links.ts`. Cambia la URL ahí en un único sitio.

## ⚠️ TODO para el cliente

- **Google Business Profile**: revisar que el horario NO muestre franjas de mediodía sábado/domingo. La web ya refleja sólo apertura nocturna (Mié–Dom 20:00 → cierre variable). Si Google sigue mostrando 13:00–15:30 los fines de semana, llegará gente al local y se la encontrará cerrada.
- **Fotos reales** de platos (ver sección siguiente).
- **Google Places API key + Place ID** para activar reseñas reales (sin keys → modo fallback minimalista activo).
- **Token Turso nuevo** para que las reservas se guarden en base de datos (sin token → modo log-only).

## Imágenes

Las fotografías actuales son de **Pexels** (Pexels License — uso comercial sin atribución requerida). Lista de archivo → URL + nombre del fotógrafo en `public/images/dishes/_credits.json`. Sustituir por fotografías propias del local cuando el cliente las proporcione.

**Cómo añadir/reemplazar fotos:**

```bash
# 1. Drop the new 2400-wide source(s) in:
public/images/dishes/_raw/<slug>.jpg

# 2. Optimize → AVIF + WebP + JPEG + blur placeholder
node scripts/optimize-images.mjs
```

El script genera 4 archivos por foto (avif/webp/jpg + blur placeholder en `blur-data.ts`). Los componentes leen desde `src/data/photos.ts` que apunta a `/images/dishes/<slug>.jpg` — `next/image` se encarga del resto.

## Scripts

```bash
pnpm dev          # Next dev server con Turbopack
pnpm build        # build de producción
pnpm start        # arranca el build
pnpm lint         # ESLint
pnpm typecheck    # TypeScript strict
pnpm test         # Vitest (incluye /lib/hours.test.ts)
```

## Arquitectura

```
src/
  app/
    layout.tsx              ← root, fuentes, metadata, JSON-LD, providers
    page.tsx                ← Home one-pager (S1-S8)
    fonts.ts                ← Fraunces + Instrument Sans/Serif + JetBrains Mono
    globals.css             ← paleta CSS variables + tokens shadcn + animaciones
    menu/                   ← /menu como página propia indexable
    reservar/               ← form de reserva (RHF + Zod)
    api/reservations/       ← endpoint Drizzle + libSQL
    opengraph-image.tsx     ← OG generativo (ImageResponse)
  components/
    ui/                     ← shadcn + magicui
    sections/               ← S0…S8 del home
    seo/                    ← JSON-LD restaurant
    effects/                ← Grain, MeshGradient, AnimatedBeam custom
  lib/
    site.ts                 ← constantes de marca (dirección, teléfono, etc.)
    hours.ts                ← cálculo de estado abierto/cerrado (Europe/Madrid)
    hours.test.ts           ← Vitest ≥8 casos
    utils.ts                ← `cn` helper
  data/
    menu.ts                 ← dataset de la carta (categorías + platos)
```

## Diseño

- **Paleta:** azul eléctrico (`--azure-*`) + morado potente (`--plum-*`) sobre carbón (`--ink-*`), acento crema (`--bone-*`) y `--hot` (#FF5A1F) solo para CTA primario.
- **Tipografía:** Fraunces display con axes `opsz + SOFT + WONK`, Instrument Sans (cuerpo), Instrument Serif (itálica editorial), JetBrains Mono (precios y eyebrows).
- **Movimiento:** Motion + GSAP (lazy). Easings `[0.22, 1, 0.36, 1]` por defecto, `[0.83, 0, 0.17, 1]` para entradas dramáticas. Respeta `prefers-reduced-motion`.

## Deploy

```bash
pnpm add -g vercel
vercel link
vercel env add TURSO_DATABASE_URL production
vercel env add TURSO_AUTH_TOKEN production
vercel --prod
```

## Estado del proyecto

Ver `MEMORY.md` en `~/.claude/projects/D--PROYECTO-hr/memory/` (brief completo para Claude Code).
