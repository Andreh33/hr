// Single source of truth for external action URLs.
// CRITICAL: the web does NOT process orders. All "pedir / delivery / reparto"
// CTAs route to the restaurant's Qoorder storefront. When Qoorder changes
// the slug or migrates platforms, edit this file only.
export const QOORDER_URL =
  process.env.NEXT_PUBLIC_QOORDER_URL ?? "https://qoorder.com/r/hr-world-food";

export const QOORDER_LABEL = "Abrir Qoorder";

// External rel/target wrapping consistently across the site.
export const externalLinkProps = {
  target: "_blank" as const,
  rel: "noopener noreferrer" as const,
};
