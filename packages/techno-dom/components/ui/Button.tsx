import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Variant = "primary" | "outline" | "ghost";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

const base =
  "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]",
  outline:
    "border border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50",
  ghost: "text-[var(--color-text-muted)] hover:bg-gray-100",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
