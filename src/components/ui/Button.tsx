import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "line";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] font-heading font-medium tracking-[-0.005em] transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-jasmine/25 disabled:opacity-50 disabled:cursor-not-allowed select-none";

const variants: Record<Variant, string> = {
  primary: "bg-jasmine text-white shadow-[0_1px_2px_rgba(10,58,57,0.18),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-jasmine-deep active:translate-y-px",
  secondary: "bg-white text-ink border border-line-strong shadow-[0_1px_2px_rgba(29,26,25,0.05)] hover:border-ink-muted hover:bg-paper",
  ghost: "bg-transparent text-ink-soft hover:text-ink hover:bg-paper-2",
  line: "bg-[#06C755] text-white hover:brightness-95 shadow-[0_1px_2px_rgba(29,26,25,0.12)]",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3.5 py-2",
  md: "text-[15px] px-5 py-2.5",
  lg: "text-base px-6 py-3.5",
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
