import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const BASE =
  "inline-flex h-12 items-center justify-center gap-2 rounded px-6 font-semibold transition-transform duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-bg hover:bg-ink/85",
  secondary: "border border-line text-ink hover:border-ink",
};

function classes(variant: Variant, className?: string) {
  return [BASE, VARIANTS[variant], className].filter(Boolean).join(" ");
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button type="button" className={classes(variant, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={classes(variant, className)} {...props} />;
}
