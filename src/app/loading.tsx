// Stub used by Next when a route segment is loading. We keep it intentionally
// minimal: dark canvas + grain so the FOUC is on-brand. The Hero already
// orchestrates its own intro animation, so a second one would just lag the
// experience.
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950">
      <div
        aria-hidden
        className="absolute inset-0 opacity-90"
        style={{ background: "var(--grad-hero)" }}
      />
      <p className="relative font-display text-4xl text-bone-50">
        HR
        <span className="text-plum-400 motion-safe:animate-pulse">+</span>
      </p>
    </div>
  );
}
