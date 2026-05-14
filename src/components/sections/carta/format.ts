// Price formatting kept on its own so components can share it without
// dragging in stateful imports.
export function formatPrice(n: number): string {
  return n.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
}
