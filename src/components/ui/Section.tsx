import type { ReactNode } from "react";
import { cx } from "./Button";

export function Container({ children, className, wide }: { children: ReactNode; className?: string; wide?: boolean }) {
  return <div className={cx("mx-auto w-full px-4 sm:px-6", wide ? "max-w-7xl" : "max-w-6xl", className)}>{children}</div>;
}

export function Section({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cx("py-16 sm:py-24", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("font-hand text-rose-deep text-lg leading-none mb-3 inline-flex items-center gap-2", className)}>
      <span aria-hidden className="inline-block h-[3px] w-6 rounded-full bg-rose/70" />
      {children}
    </p>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cx("max-w-2xl mb-10 sm:mb-14", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className={align === "center" ? "justify-center" : undefined}>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-medium text-ink">{title}</h2>
      {subtitle && <p className="mt-4 text-ink-soft text-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function Sticker({ children, tone = "ink", className }: { children: ReactNode; tone?: "ink" | "rose" | "sage" | "honey" | "sky"; className?: string }) {
  const tones = {
    ink: "bg-white",
    rose: "bg-rose-soft",
    sage: "bg-sage-soft",
    honey: "bg-honey-soft",
    sky: "bg-sky-soft",
  };
  return <span className={cx("sticker", tones[tone], className)}>{children}</span>;
}
