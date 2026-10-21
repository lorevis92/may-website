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
    <p className={cx("kicker mb-4 inline-flex items-center gap-2.5", className)}>
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-jasmine-bright" />
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
    <div className={cx("max-w-2xl mb-10 sm:mb-12", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className={align === "center" ? "justify-center" : undefined}>{eyebrow}</Eyebrow>}
      <h2 className="text-[2rem] sm:text-[2.5rem] lg:text-[2.875rem] font-medium text-ink">{title}</h2>
      {subtitle && <p className="mt-4 max-w-xl text-ink-soft text-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("badge", className)}>{children}</span>;
}
