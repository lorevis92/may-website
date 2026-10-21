/**
 * Portrait slot. Drop May's real photo at public/may.jpg (square, ≥ 800px) and it is used automatically;
 * until then a static version of the hero illustration is shown (same character, same style).
 */
import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

export function Portrait({ className }: { className?: string }) {
  const hasPhoto = existsSync(path.join(process.cwd(), "public", "may.jpg"));
  if (hasPhoto) {
    // Square crop anchored near the top so a portrait-orientation photo keeps her face in frame.
    return <Image src="/may.jpg" alt="May" width={426} height={562} className={`${className ?? ""} rounded-xl object-cover object-[50%_12%] aspect-square`} priority />;
  }
  return (
    <svg viewBox="80 60 320 320" className={`${className ?? ""} rounded-xl`} role="img" aria-label="Illustration of May">
      <defs>
        <linearGradient id="pt-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d2b4" />
          <stop offset="1" stopColor="#efc19e" />
        </linearGradient>
        <linearGradient id="pt-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a2622" />
          <stop offset="1" stopColor="#1f1412" />
        </linearGradient>
        <linearGradient id="pt-blouse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf5" />
          <stop offset="1" stopColor="#f3e7dc" />
        </linearGradient>
      </defs>
      <rect x="80" y="60" width="320" height="320" fill="#edf6f5" />
      <circle cx="240" cy="250" r="150" fill="#dcefec" />
      {/* hair back */}
      <path d="M150 215c-6-70 36-120 90-122 56-2 98 48 92 122 10 60 6 120-6 175-14 20-40 26-86 26s-72-6-86-26c-12-55-16-115-4-175z" fill="url(#pt-hair)" />
      {/* neck + body */}
      <path d="M222 286h36v44c0 10-8 16-18 16s-18-6-18-16z" fill="#e8b996" />
      <path d="M118 520c-2-70 18-130 60-160 18-12 36-18 62-18s44 6 62 18c42 30 62 90 60 160z" fill="url(#pt-blouse)" stroke="#e7d9cf" strokeWidth="2" />
      <path d="M212 342c10 20 46 20 56 0l-6 30c-10 10-34 10-44 0z" fill="#0d7f7b" />
      {/* ears */}
      <ellipse cx="163" cy="226" rx="11" ry="15" fill="#efc19e" />
      <ellipse cx="317" cy="226" rx="11" ry="15" fill="#efc19e" />
      <circle cx="163" cy="246" r="4" fill="#e8b45a" />
      <circle cx="317" cy="246" r="4" fill="#e8b45a" />
      {/* face */}
      <path d="M240 118c48 0 82 40 82 96 0 44-16 70-40 90-14 10-26 14-42 14s-28-4-42-14c-24-20-40-46-40-90 0-56 34-96 82-96z" fill="url(#pt-skin)" />
      <ellipse cx="198" cy="250" rx="13" ry="7" fill="#f0889c" opacity="0.32" />
      <ellipse cx="282" cy="250" rx="13" ry="7" fill="#f0889c" opacity="0.32" />
      <g fill="none" stroke="#2b1d1a" strokeWidth="3.2" strokeLinecap="round">
        <path d="M196 200c8-6 20-6 30-2" />
        <path d="M254 198c10-4 22-4 30 2" />
      </g>
      <ellipse cx="212" cy="220" rx="13.5" ry="9.5" fill="#fffdfb" />
      <ellipse cx="268" cy="220" rx="13.5" ry="9.5" fill="#fffdfb" />
      <circle cx="212" cy="221" r="7.6" fill="#4a2f26" />
      <circle cx="268" cy="221" r="7.6" fill="#4a2f26" />
      <circle cx="212" cy="221" r="4" fill="#1b100e" />
      <circle cx="268" cy="221" r="4" fill="#1b100e" />
      <circle cx="209.4" cy="218.2" r="2.4" fill="#fff" />
      <circle cx="265.4" cy="218.2" r="2.4" fill="#fff" />
      <path d="M198.5 218c4-7 23-7 27 0M254.5 218c4-7 23-7 27 0" fill="none" stroke="#2b1d1a" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M236 240c2 6 6 6 8 0" fill="none" stroke="#d99f7c" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M226 262c6 9 22 9 28 0" fill="none" stroke="#c8506b" strokeWidth="3" strokeLinecap="round" />
      {/* fringe */}
      <path d="M158 212c-4-62 30-104 82-104s86 42 82 104c-14-22-30-44-58-50-22 10-40 26-50 44-18-6-40 2-56 6z" fill="url(#pt-hair)" />
      <path d="M322 212c4-30-6-66-40-86 14 28 24 56 26 92z" fill="url(#pt-hair)" />
      <path d="M160 214c-2-30 4-60 34-84-12 28-18 54-18 90z" fill="url(#pt-hair)" />
      <ellipse cx="296" cy="150" rx="12" ry="5.5" transform="rotate(-24 296 150)" fill="#e8b45a" />
    </svg>
  );
}
