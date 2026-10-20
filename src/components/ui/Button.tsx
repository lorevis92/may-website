import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "line";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-heading font-medium transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose/30 disabled:opacity-50 disabled:cursor-not-allowed select-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white shadow-[4px_4px_0_var(--color-rose)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-rose)] active:translate-y-0 active:shadow-[2px_2px_0_var(--color-rose)]",
  secondary: "bg-white text-ink border-2 border-ink hover:bg-paper-2 hover:-translate-y-0.5",
  ghost: "bg-transparent text-ink hover:bg-paper-2",
  line: "bg-[#06C755] text-white hover:brightness-105 hover:-translate-y-0.5 shadow-soft",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-[15px] px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

interface ButtonBase {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = ButtonBase & Omit<ComponentProps<"button">, "className" | "children">;
type LinkProps = ButtonBase & { href: string } & Omit<ComponentProps<typeof Link>, "className" | "children" | "href">;

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <button className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "primary", size = "md", className, children, href, ...rest }: LinkProps) {
  const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  if (external) {
    return (
      <a href={href} className={cx(base, variants[variant], sizes[size], className)} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}
