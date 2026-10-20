"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useGaze } from "./useGaze";
import { VectorMay } from "./VectorMay";
import { SpriteMay, type SpriteManifest } from "./SpriteMay";
import manifestJson from "./sprite-manifest.json";
import { useI18n } from "@/i18n/client";
import { cx } from "@/components/ui/Button";

const manifest = manifestJson as unknown as SpriteManifest;

function subscribeHover(cb: () => void) {
  const mq = window.matchMedia("(hover: none)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * The hero character. Uses the rendered sprite strip when one has been built
 * (manifest.frames > 0), otherwise the vector placeholder. Both share the same gaze spring,
 * so swapping the art never changes the feel of the interaction.
 */
export function HeroCharacter() {
  const { t } = useI18n();
  const anchor = useRef<HTMLDivElement>(null);
  const gaze = useGaze(anchor);
  const touch = useSyncExternalStore(subscribeHover, () => window.matchMedia("(hover: none)").matches, () => false);
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setBubble(true), 900);
    const hide = window.setTimeout(() => setBubble(false), 5200);
    return () => {
      window.clearTimeout(id);
      window.clearTimeout(hide);
    };
  }, []);

  return (
    <div ref={anchor} className="relative mx-auto w-full max-w-[460px]">
      {/* speech bubble */}
      <div
        aria-hidden
        className={cx(
          "absolute -top-2 left-[6%] z-10 rounded-2xl rounded-bl-sm bg-white px-4 py-2 font-hand text-lg text-ink shadow-soft transition-all duration-500",
          bubble ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        )}
      >
        {t.hero.bubble}
      </div>

      <div className="animate-fade-up">
        {manifest.frames > 0 ? <SpriteMay gaze={gaze} manifest={manifest} /> : <VectorMay gaze={gaze} />}
      </div>

      <p className="mt-2 text-center font-hand text-base text-ink-muted">
        <span aria-hidden className="mr-1">↔</span>
        {touch ? t.hero.hintTouch : t.hero.hint}
      </p>
    </div>
  );
}
