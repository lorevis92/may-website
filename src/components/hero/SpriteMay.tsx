"use client";

import { useEffect, useRef, useState } from "react";
import type { Gaze } from "./useGaze";

export interface SpriteManifest {
  frames: number;
  frameWidth: number;
  frameHeight: number;
  /** Index of the resting pose (eye contact). */
  idle: number;
  /** Index of the extreme "looking left" frame (viewer's left). */
  left: number;
  /** Index of the extreme "looking right" frame (viewer's right). */
  right: number;
  /** Frames appended at the end of the strip for an idle blink (usually 2). */
  blink: number[];
  sheet: string;
  fallback?: string;
}

/**
 * Canvas sprite scrubber for the real rendered character.
 * Cursor x → target frame along the strip [left … idle … right]. A critically-damped spring
 * (shared via useGaze) chases it, and each draw cross-fades the next frame over the current one so
 * motion between discrete frames reads as motion rather than steps. Blink frames are played
 * from the idle pose when the viewer is still.
 */
export function SpriteMay({ gaze, manifest }: { gaze: React.MutableRefObject<Gaze>; manifest: SpriteManifest }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const sheet = new Image();
    sheet.decoding = "async";
    sheet.src = manifest.sheet;
    let raf = 0;
    const w = manifest.frameWidth;
    const h = manifest.frameHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    el.width = Math.round(w * dpr);
    el.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let blinkAt = performance.now() + 3000;
    let blinkFrameUntil = 0;
    let blinkIndex = 0;

    const draw = (pos: number) => {
      const i = Math.max(0, Math.min(manifest.frames - 1, Math.floor(pos)));
      const f = pos - i;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(sheet, i * w, 0, w, h, 0, 0, w, h);
      if (f > 0.005 && i + 1 < manifest.frames) {
        ctx.globalAlpha = f;
        ctx.drawImage(sheet, (i + 1) * w, 0, w, h, 0, 0, w, h);
        ctx.globalAlpha = 1;
      }
    };

    const tick = (now: number) => {
      const g = gaze.current;
      // Map gaze -1..1 onto the strip. The two halves can have different lengths.
      const span = g.x < 0 ? manifest.idle - manifest.left : manifest.right - manifest.idle;
      let pos = manifest.idle + g.x * span;

      // Idle blink using dedicated frames (never while the cursor is parked mid-turn).
      const still = Math.abs(g.x) < 0.08 && !g.following;
      if (manifest.blink.length && still) {
        if (now > blinkAt && now > blinkFrameUntil) {
          blinkIndex = 0;
          blinkFrameUntil = now + 70;
          blinkAt = now + 3200 + Math.random() * 3000;
        }
        if (now < blinkFrameUntil + 70 * (manifest.blink.length - 1)) {
          const step = Math.min(manifest.blink.length - 1, Math.floor((now - (blinkFrameUntil - 70)) / 70));
          blinkIndex = step;
          pos = manifest.blink[blinkIndex];
        }
      }
      draw(pos);
      raf = requestAnimationFrame(tick);
    };

    sheet.onload = () => {
      setReady(true);
      raf = requestAnimationFrame(tick);
    };
    return () => cancelAnimationFrame(raf);
  }, [gaze, manifest]);

  return (
    <div className="relative w-full" style={{ aspectRatio: `${manifest.frameWidth} / ${manifest.frameHeight}` }}>
      {!ready && manifest.fallback && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={manifest.fallback} alt="" className="absolute inset-0 h-full w-full object-contain" />
      )}
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" style={{ width: "100%", height: "100%" }} aria-label="May" role="img" />
    </div>
  );
}
