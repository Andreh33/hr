// Grain noise overlay — fixed full-viewport SVG turbulence, blend overlay.
// Stays under the cursor for "film grain" feel without trashing perf
// (single SVG paint, no JS). En móvil el mix-blend-overlay sobre un SVG fijo
// fuerza repintado del viewport en cada scroll → lo ocultamos por debajo de md.
export function Grain({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-0 mix-blend-overlay hidden md:block"
      style={{ opacity }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="hr-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hr-grain)" />
      </svg>
    </div>
  );
}
