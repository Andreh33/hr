"use client";

import { useEffect } from "react";

// Registers /sw.js once on first mount. We skip registration entirely in
// development to avoid Turbopack/HMR conflicts — the SW would aggressively
// cache stale dev chunks otherwise.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silent — SW is a progressive enhancement.
    });
  }, []);
  return null;
}
