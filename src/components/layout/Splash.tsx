"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

// Module state survives client-side navigations (including a locale switch remounting the layout)
// but resets on a full load or refresh, so the splash only plays once per page load.
let played = false;

/**
 * Quick first-load splash: the logo fades/scales in, then the overlay fades out (~550ms total).
 * Pure CSS animation, so it clears itself even before hydration; skipped under prefers-reduced-motion.
 */
export function Splash() {
  const [show, setShow] = useState(() => !played);

  useEffect(() => {
    played = true;
    if (!show) return;
    const id = window.setTimeout(() => setShow(false), 700);
    return () => window.clearTimeout(id);
  }, [show]);

  if (!show) return null;
  return (
    <div aria-hidden="true" className="splash fixed inset-0 z-[90] grid place-items-center bg-paper pointer-events-none">
      <Logo className="splash-logo h-16 sm:h-20" priority />
    </div>
  );
}
