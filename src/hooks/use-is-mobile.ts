"use client";

import { useEffect, useState } from "react";

// Single source of truth para "es móvil": <768 px = breakpoint md de Tailwind.
// SSR-safe: arranca en `false` para no romper hidratación; el primer efecto
// corrige tras el mount.
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
