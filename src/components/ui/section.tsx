import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  bleed?: boolean;
};

// All sections share the same vertical rhythm and container width.
// `bleed` disables the inner container for full-width experiences.
export function Section({
  className,
  children,
  bleed = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative isolate px-5 py-24 md:px-10 md:py-32",
        className
      )}
      {...props}
    >
      {bleed ? children : (
        <div className="mx-auto w-full max-w-[1440px]">{children}</div>
      )}
    </section>
  );
}

export function Eyebrow({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-eyebrow text-bone-100/60", className)}
      {...props}
    >
      {children}
    </p>
  );
}

type HeadlineProps = React.ComponentProps<"h2"> & {
  as?: "h1" | "h2" | "h3";
  size?: "hero" | "display" | "h2";
};

export function Headline({
  as = "h2",
  size = "display",
  className,
  children,
  ...props
}: HeadlineProps) {
  const Comp = as;
  const sizeCls =
    size === "hero" ? "text-hero font-display-hero" : size === "display" ? "text-display font-display" : "text-h2 font-display";
  return (
    <Comp className={cn(sizeCls, "text-balance text-bone-50", className)} {...props}>
      {children}
    </Comp>
  );
}
