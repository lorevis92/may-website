"use client";

import { useEffect, useRef } from "react";
import type { Gaze } from "./useGaze";

/**
 * An original, hand-drawn-style vector character ("May") that follows the cursor.
 * Layers move with different parallax amounts so a 2D drawing reads as a gentle 3D head turn.
 * All motion is applied directly to SVG transforms inside one animation frame loop — no React re-renders.
 *
 * This is the placeholder used until the real rendered sprite frames are dropped in (see SpriteMay).
 */
export function VectorMay({ gaze }: { gaze: React.MutableRefObject<Gaze> }) {
  const body = useRef<SVGGElement>(null);
  const hairBack = useRef<SVGGElement>(null);
  const head = useRef<SVGGElement>(null);
  const face = useRef<SVGGElement>(null);
  const hairFront = useRef<SVGGElement>(null);
  const irisL = useRef<SVGGElement>(null);
  const irisR = useRef<SVGGElement>(null);
  const lidL = useRef<SVGEllipseElement>(null);
  const lidR = useRef<SVGEllipseElement>(null);
  const brows = useRef<SVGGElement>(null);
  const mouth = useRef<SVGPathElement>(null);
  const shadow = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const hair = { x: 0, y: 0, r: 0 };
    let nextBlink = performance.now() + 2200;
    let blinkStart = -1;
    let doubleBlink = false;
    const BLINK_MS = 170;

    const set = (el: Element | null, v: string) => el && el.setAttribute("transform", v);

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const g = gaze.current;
      const breathe = Math.sin(now / 1000 * 1.3) * 1.6;
      const hx = g.x * 15;
      const hy = g.y * 9 + breathe;
      const hr = g.x * 4.5;

      // Hair lags behind the head so a quick turn gets a soft swish.
      const lag = Math.min(1, dt * 7);
      hair.x += (hx - hair.x) * lag;
      hair.y += (hy - hair.y) * lag;
      hair.r += (hr - hair.r) * lag;

      set(body.current, `translate(${g.x * 4.5} ${g.y * 2.5 + breathe * 0.5}) rotate(${g.x * 1.3} 240 440)`);
      set(hairBack.current, `translate(${hair.x * 0.9} ${hair.y}) rotate(${hair.r * 0.9} 240 318)`);
      set(head.current, `translate(${hx} ${hy}) rotate(${hr} 240 318)`);
      set(face.current, `translate(${g.x * 9} ${g.y * 5.5})`);
      set(hairFront.current, `translate(${hx + (hx - hair.x) * 0.35} ${hy}) rotate(${hr} 240 318)`);
      set(irisL.current, `translate(${g.x * 6.5} ${g.y * 3.5})`);
      set(irisR.current, `translate(${g.x * 6.5} ${g.y * 3.5})`);
      set(brows.current, `translate(0 ${-g.energy * 2.2 + Math.min(0, g.y) * 2})`);
      set(mouth.current, `translate(240 262) scale(${1 + g.energy * 0.1} ${1 + g.energy * 0.16}) translate(-240 -262)`);
      if (shadow.current) shadow.current.setAttribute("rx", String(118 + g.energy * 6));

      // Blinking: quick, with the occasional double blink.
      if (blinkStart < 0 && now >= nextBlink) {
        blinkStart = now;
        doubleBlink = Math.random() < 0.22;
      }
      let lidY = -24;
      if (blinkStart >= 0) {
        const p = (now - blinkStart) / BLINK_MS;
        if (p >= 1) {
          if (doubleBlink) {
            doubleBlink = false;
            blinkStart = now + 60;
          } else {
            blinkStart = -1;
            nextBlink = now + 2800 + Math.random() * 3800 - g.energy * 600;
          }
        } else if (p >= 0) {
          lidY = -24 * (1 - Math.sin(p * Math.PI));
        }
      }
      lidL.current?.setAttribute("cy", String(220 + lidY));
      lidR.current?.setAttribute("cy", String(220 + lidY));

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gaze]);

  return (
    <svg viewBox="0 0 480 520" className="w-full h-auto" role="img" aria-label="May, smiling at you from behind her laptop">
      <defs>
        <clipPath id="may-eye-l">
          <ellipse cx="212" cy="220" rx="13.5" ry="9.5" />
        </clipPath>
        <clipPath id="may-eye-r">
          <ellipse cx="268" cy="220" rx="13.5" ry="9.5" />
        </clipPath>
        <linearGradient id="may-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d2b4" />
          <stop offset="1" stopColor="#efc19e" />
        </linearGradient>
        <linearGradient id="may-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a2622" />
          <stop offset="1" stopColor="#1f1412" />
        </linearGradient>
        <linearGradient id="may-blouse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf5" />
          <stop offset="1" stopColor="#f3e7dc" />
        </linearGradient>
        <linearGradient id="may-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e4d9d0" />
          <stop offset="1" stopColor="#cfc2b7" />
        </linearGradient>
        <radialGradient id="may-blob" cx="50%" cy="45%" r="55%">
          <stop offset="0" stopColor="#fbe4e9" />
          <stop offset="1" stopColor="#fbe4e9" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft backdrop */}
      <circle cx="240" cy="250" r="215" fill="url(#may-blob)" />
      <ellipse ref={shadow} cx="240" cy="470" rx="118" ry="14" fill="#2a2024" opacity="0.08" />

      {/* hair, back layer */}
      <g ref={hairBack}>
        <path
          d="M150 215c-6-70 36-120 90-122 56-2 98 48 92 122 10 60 6 120-6 175-14 20-40 26-86 26s-72-6-86-26c-12-55-16-115-4-175z"
          fill="url(#may-hair)"
        />
        <path d="M172 230c-4 60 0 120 10 160" stroke="#4d3631" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
        <path d="M308 230c4 60 0 120-10 160" stroke="#4d3631" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* body */}
      <g ref={body}>
        {/* neck */}
        <path d="M222 286h36v44c0 10-8 16-18 16s-18-6-18-16z" fill="#e8b996" />
        {/* torso + blouse */}
        <path
          d="M118 520c-2-70 18-130 60-160 18-12 36-18 62-18s44 6 62 18c42 30 62 90 60 160z"
          fill="url(#may-blouse)"
          stroke="#e7d9cf"
          strokeWidth="2"
        />
        {/* collar */}
        <path d="M212 342c10 20 46 20 56 0l-6 30c-10 10-34 10-44 0z" fill="#5c9a86" />
        <path d="M240 356l-6 30h12z" fill="#fffaf5" />
        {/* arms */}
        <path d="M178 362c-26 20-40 50-42 86 0 10 8 16 18 16h40c-8-34-12-70-16-102z" fill="url(#may-blouse)" stroke="#e7d9cf" strokeWidth="2" />
        <path d="M302 362c26 20 40 50 42 86 0 10-8 16-18 16h-40c8-34 12-70 16-102z" fill="url(#may-blouse)" stroke="#e7d9cf" strokeWidth="2" />
        {/* hands */}
        <path d="M150 452c-6-12 4-22 16-20 10 2 16 10 14 20-2 8-8 12-16 12s-12-4-14-12z" fill="#f3c9a8" />
        <path d="M330 452c6-12-4-22-16-20-10 2-16 10-14 20 2 8 8 12 16 12s12-4 14-12z" fill="#f3c9a8" />
      </g>

      {/* head */}
      <g ref={head}>
        {/* ears */}
        <ellipse cx="163" cy="226" rx="11" ry="15" fill="#efc19e" />
        <ellipse cx="317" cy="226" rx="11" ry="15" fill="#efc19e" />
        <circle cx="163" cy="246" r="4" fill="#e8b45a" />
        <circle cx="317" cy="246" r="4" fill="#e8b45a" />
        {/* face */}
        <path
          d="M240 118c48 0 82 40 82 96 0 44-16 70-40 90-14 10-26 14-42 14s-28-4-42-14c-24-20-40-46-40-90 0-56 34-96 82-96z"
          fill="url(#may-skin)"
        />
        {/* chin shadow */}
        <path d="M200 296c12 12 26 16 40 16s28-4 40-16c-10 6-24 10-40 10s-30-4-40-10z" fill="#e3ad8a" opacity="0.5" />

        <g ref={face}>
          {/* blush */}
          <ellipse cx="198" cy="250" rx="13" ry="7" fill="#f0889c" opacity="0.32" />
          <ellipse cx="282" cy="250" rx="13" ry="7" fill="#f0889c" opacity="0.32" />
          {/* brows */}
          <g ref={brows} fill="none" stroke="#2b1d1a" strokeWidth="3.2" strokeLinecap="round">
            <path d="M196 200c8-6 20-6 30-2" />
            <path d="M254 198c10-4 22-4 30 2" />
          </g>
          {/* eyes */}
          <g clipPath="url(#may-eye-l)">
            <ellipse cx="212" cy="220" rx="13.5" ry="9.5" fill="#fffdfb" />
            <g ref={irisL}>
              <circle cx="212" cy="221" r="7.6" fill="#4a2f26" />
              <circle cx="212" cy="221" r="4" fill="#1b100e" />
              <circle cx="209.4" cy="218.2" r="2.4" fill="#fff" />
              <circle cx="214.6" cy="223.6" r="1.1" fill="#fff" opacity="0.9" />
            </g>
            <ellipse ref={lidL} cx="212" cy="196" rx="15" ry="11" fill="#f3c9a8" />
          </g>
          <g clipPath="url(#may-eye-r)">
            <ellipse cx="268" cy="220" rx="13.5" ry="9.5" fill="#fffdfb" />
            <g ref={irisR}>
              <circle cx="268" cy="221" r="7.6" fill="#4a2f26" />
              <circle cx="268" cy="221" r="4" fill="#1b100e" />
              <circle cx="265.4" cy="218.2" r="2.4" fill="#fff" />
              <circle cx="270.6" cy="223.6" r="1.1" fill="#fff" opacity="0.9" />
            </g>
            <ellipse ref={lidR} cx="268" cy="196" rx="15" ry="11" fill="#f3c9a8" />
          </g>
          {/* lash lines */}
          <path d="M198.5 218c4-7 23-7 27 0" fill="none" stroke="#2b1d1a" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M254.5 218c4-7 23-7 27 0" fill="none" stroke="#2b1d1a" strokeWidth="2.4" strokeLinecap="round" />
          {/* nose */}
          <path d="M236 240c2 6 6 6 8 0" fill="none" stroke="#d99f7c" strokeWidth="2.2" strokeLinecap="round" />
          {/* mouth */}
          <path ref={mouth} d="M226 262c6 8 22 8 28 0" fill="none" stroke="#c8506b" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {/* hair, front layer (fringe + side strands) */}
      <g ref={hairFront}>
        <path d="M158 212c-4-62 30-104 82-104s86 42 82 104c-14-22-30-44-58-50-22 10-40 26-50 44-18-6-40 2-56 6z" fill="url(#may-hair)" />
        <path d="M322 212c4-30-6-66-40-86 14 28 24 56 26 92z" fill="url(#may-hair)" />
        <path d="M160 214c-2-30 4-60 34-84-12 28-18 54-18 90z" fill="url(#may-hair)" />
        <path d="M196 132c22-14 56-14 80-2" stroke="#5a3f39" strokeWidth="4" strokeLinecap="round" opacity="0.55" fill="none" />
        {/* hair clip */}
        <ellipse cx="296" cy="150" rx="12" ry="5.5" transform="rotate(-24 296 150)" fill="#e8b45a" />
        <ellipse cx="296" cy="150" rx="7" ry="2.5" transform="rotate(-24 296 150)" fill="#fcefd7" opacity="0.8" />
      </g>

      {/* laptop lid, in front of everything */}
      <g>
        <path d="M160 368c0-6 4-10 10-10h140c6 0 10 4 10 10l-4 86H164z" fill="url(#may-lid)" stroke="#b9ab9f" strokeWidth="2" />
        <path d="M170 448l-2 10c0 4 2 6 6 6h132c4 0 6-2 6-6l-2-10z" fill="#bfb3a9" />
        <path d="M240 404c-6-9-18-4-16 5 1 6 8 11 16 17 8-6 15-11 16-17 2-9-10-14-16-5z" fill="#e0637c" opacity="0.9" />
      </g>
      {/* desk edge */}
      <path d="M40 464c0-6 4-10 10-10h380c6 0 10 4 10 10v56H40z" fill="#eacfb6" />
      <path d="M40 464h400v8H40z" fill="#dcbc9f" />
    </svg>
  );
}
