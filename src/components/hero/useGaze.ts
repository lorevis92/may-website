"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks the pointer relative to an anchor element and exposes a spring-smoothed
 * gaze value in -1..1 (x) and -1..1 (y) through a mutable ref. The ref is updated
 * on an animation frame loop so consumers can read it without re-rendering.
 *
 * - Mouse/pen: follows the pointer anywhere on the page.
 * - Touch (no hover): tapping left/right/up/down of the anchor sets the target, and it
 *   returns to centre after a short hold.
 * - When the pointer leaves the window (or the anchor scrolls far away) the gaze eases home.
 *
 * Spring: critically damped (c = 2√k), the same shape as the reference implementation.
 */
export interface Gaze {
  x: number;
  y: number;
  /** 0..1 — how "engaged" the viewer is (1 while actively following). Used for blink timing/bubbles. */
  energy: number;
  following: boolean;
}

export function useGaze(anchorRef: React.RefObject<HTMLElement | null>, opts?: { reach?: number }) {
  const gaze = useRef<Gaze>({ x: 0, y: 0, energy: 0, following: false });
  const reach = opts?.reach ?? 0.82;

  useEffect(() => {
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    let following = false;
    let raf = 0;
    let last = performance.now();
    let releaseTimer: number | undefined;
    const coarse = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setTargetFromPoint = (clientX: number, clientY: number) => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.42; // eye line sits above the centre
      // Normalise by half the viewport so the far edge of the screen is a full turn.
      const nx = (clientX - cx) / (window.innerWidth / 2);
      const ny = (clientY - cy) / (window.innerHeight / 2);
      const u = Math.max(-1, Math.min(1, nx / reach));
      const v = Math.max(-1, Math.min(1, ny / reach));
      // Ease-out so small movements near the centre are gentle, big ones commit.
      target.x = Math.sign(u) * (1 - Math.pow(1 - Math.abs(u), 1.6));
      target.y = Math.sign(v) * (1 - Math.pow(1 - Math.abs(v), 1.6)) * 0.6;
      following = true;
    };

    const release = () => {
      following = false;
      target.x = 0;
      target.y = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      setTargetFromPoint(e.clientX, e.clientY);
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      setTargetFromPoint(t.clientX, t.clientY);
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(release, 1800);
    };
    const onLeave = () => release();
    const onVisibility = () => {
      if (document.hidden) release();
    };

    if (!reduced) {
      if (coarse) {
        window.addEventListener("touchstart", onTouch, { passive: true });
        window.addEventListener("touchmove", onTouch, { passive: true });
      } else {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("mouseleave", onLeave);
      }
      document.addEventListener("visibilitychange", onVisibility);
    }

    // Idle wander: when nobody is interacting, glance around a little now and then.
    let idleSince = performance.now();
    let nextWander = idleSince + 2500;
    let wanderUntil = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) {
        if (following) {
          idleSince = now;
          nextWander = now + 2500 + Math.random() * 2500;
        } else if (now > wanderUntil && now > nextWander) {
          target.x = (Math.random() - 0.5) * 0.7;
          target.y = (Math.random() - 0.5) * 0.3;
          wanderUntil = now + 900 + Math.random() * 900;
          nextWander = wanderUntil + 2500 + Math.random() * 3500;
        } else if (now > wanderUntil && target.x !== 0 && !following) {
          target.x = 0;
          target.y = 0;
        }
      }
      const k = following ? 170 : 55;
      const c = 2 * Math.sqrt(k);
      vel.x += (k * (target.x - pos.x) - c * vel.x) * dt;
      vel.y += (k * (target.y - pos.y) - c * vel.y) * dt;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;
      const g = gaze.current;
      g.x = pos.x;
      g.y = pos.y;
      g.following = following;
      g.energy += ((following ? 1 : 0) - g.energy) * Math.min(1, dt * 4);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(releaseTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [anchorRef, reach]);

  return gaze;
}
