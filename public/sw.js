// Minimal service worker for HR+ World Food. Three concerns:
//  · Cache the home shell for offline fallback (network-first).
//  · Stale-while-revalidate for /_next/static and fonts (cheap, fast).
//  · Skip pre-cache of menu/api — they're light and must stay fresh.
//
// Avoid library SWs here (next-pwa, workbox) to stay tiny and Turbopack-safe.

const VERSION = "v1.0.0";
const SHELL = "hr-shell-" + VERSION;
const RUNTIME = "hr-runtime-" + VERSION;
const SHELL_URLS = ["/", "/manifest.webmanifest", "/icons/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== SHELL && k !== RUNTIME).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Static assets: stale-while-revalidate
  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(
      caches.open(RUNTIME).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Navigation requests: network-first with shell fallback
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(async () => {
        const cache = await caches.open(SHELL);
        return (await cache.match("/")) || new Response("Offline", { status: 503 });
      })
    );
    return;
  }
});
