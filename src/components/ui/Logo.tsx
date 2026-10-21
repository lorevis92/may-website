import Image from "next/image";

/** Cursive "may" wordmark (public/logo.svg, 2498×966). Size it with a height class; width follows. */
export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return <Image src="/logo.svg" alt="" width={2498} height={966} className={`w-auto ${className ?? ""}`} priority={priority} />;
}
