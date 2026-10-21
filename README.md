# May · Insurance & financial advisor — website

Bilingual (Thai / English) personal site for May, AIA Thailand advisor & MDRT member.
Warm, diary-like design, an interactive hero character that follows the cursor, six free planning tools,
four gated guides, a diary, "Chat with May" (Claude-powered), a booking form, lead capture with email
notifications, and a private leads inbox.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4**. No external CSS/JS CDNs; fonts are self-hosted.

---

## 1. Run it locally

```bash
npm install
cp .env.example .env.local     # then fill in the values (see §3)
npm run dev                    # http://localhost:3000  → redirects to /th
```

Production build: `npm run build && npm start`.

## 2. Make it May's (10-minute checklist)

| What | Where |
| --- | --- |
| Name, tagline, city, LINE ID / link, phone, email, licence numbers, MDRT years, stats, booking slots | `src/lib/site.config.ts` (every `TODO`) |
| Her photo | drop a square `public/may.jpg` (≥ 800 px) — used on the About page and home automatically |
| Social preview image | replace `public/og/cover.png` (1200×630) |
| Public URL | `NEXT_PUBLIC_SITE_URL` in `.env.local` / Vercel |
| Every UI string, tool question, quiz profile, disclaimer | `src/i18n/messages/th.ts` and `en.ts` (same keys; TypeScript enforces it) |
| Guides | `src/content/guides/*.ts` |
| Diary entries | `src/content/diary/*.ts` (add a file + register it in `src/content/index.ts`) |
| Privacy notice | `src/content/privacy.ts` |
| Chatbot personality & compliance rules | `src/lib/may-persona.ts` |
| Tax limits & brackets (update each tax year) | `src/lib/calc.ts` → `TAX_LIMITS`, `THAI_BRACKETS` |

## 3. Environment variables

| Variable | Needed for | Notes |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Chat with May | Get it at console.anthropic.com. Without it the chat shows a friendly "not connected yet" message and the rest of the site works. |
| `CHAT_MODEL` | optional | default `claude-sonnet-5-5`; `claude-haiku-5-5` is cheaper. |
| `RESEND_API_KEY`, `FROM_EMAIL`, `NOTIFY_EMAIL` | lead emails | Free Resend account, verify a sender domain. May gets an email for every lead; visitors who unlock a guide get it emailed. Without these, leads are still stored. |
| `DATABASE_URL` | lead storage on Vercel | Any Postgres (Neon via Vercel Marketplace is the easiest). The `leads` table is created automatically. Leave empty to use `data/leads.jsonl` on a single server. |
| `ADMIN_TOKEN` | private inbox | Long random string. Then open `https://your-site/admin/leads?token=THE_TOKEN` (bookmark it on May's phone). CSV export is on that page. |
| `NEXT_PUBLIC_SITE_URL` | SEO | `https://www.your-domain.com`, no trailing slash. |

## 4. Deploy (Vercel, ~5 minutes)

1. Push this folder to a GitHub repo.
2. vercel.com → *Add New Project* → import the repo (defaults are fine).
3. *Storage* → add **Neon Postgres** (free) → it sets `DATABASE_URL` for you.
4. *Settings → Environment Variables* → add the rest from §3.
5. Deploy. Add May's domain under *Domains*.

Any Node host works too (`npm run build && npm start`); keep `data/` writable if you don't set `DATABASE_URL`.

## 5. The hero character (rendered sprite)

The hero is a rendered sprite strip (`public/hero/`) that turns, glances and blinks toward the cursor (tap left/right on phones). `VectorMay.tsx` is only used when the manifest has `frames: 0`.
To regenerate it (new photo or clip):

1. **Image** (Higgsfield / any image model): front-facing photo of May + prompt such as
   *"Turn the person in the photo into a friendly 3D-animated-style character. Keep her face, hair, skin tone and smile recognisable. Sitting at a laptop on a plain white desk, front view, looking at the camera. Soft studio light, clean white background, no text."*
   Fix details with short follow-ups ("Same character, same framing. Make her…").
2. **Video** (image → video, locked camera, 8 s, 24 fps):
   *"Animate character looking around. Locked camera, no zoom, no cuts. She starts looking at the camera, turns her head to look to one side, then the other, glances up once, blinks naturally, and comes back to looking at the camera. Hands stay still. White background stays white. 8 seconds."*
3. **Build the strip** (needs `ffmpeg`, `pip install pillow numpy`):
   ```bash
   python3 scripts/build-hero-sheet.py path/to/clip.mp4 --preview
   # optional: --crop W:H:X:Y to frame her + the laptop, --width 496, --max-frames 33, --left-first
   ```
   It extracts frames, keeps every frame of the two head turns, thins the holds, removes the mid-turn blink
   (keeping two blink frames for idle), keys out the background with a border flood-fill, and writes
   `public/hero/sheet.webp`, `public/hero/idle.webp` and `src/components/hero/sprite-manifest.json` (kept under the 16 383 px browser limit).
4. Rebuild. The hero switches to the sprite automatically (`frames > 0` in the manifest). Same spring, same feel.
   If she looks the wrong way, re-run with `--left-first`.
5. If the automatic pick goes wrong (e.g. she blinks during a turn, or moves mostly her eyes), open `contact-sheet.png`
   and choose the frames yourself — 0-based clip frame numbers, viewer-left extreme → eye contact → viewer-right extreme:
   ```bash
   python3 scripts/build-hero-sheet.py public/hero/source-clip.mp4 --preview \
     --frames 60,56,53,50,48,47,46,45,34,87,89,91,92,93,94,96,98,101,105 --idle 34 --blink 38,39
   ```
   That is the exact command used for the current sprite. The source clip and contact sheet are git-ignored.

## 6. Project map

```
src/app/[locale]/        pages (th/en): home, about, tools/*, guides/*, diary/*, chat, book, privacy
src/app/api/leads        POST – stores a lead, notifies May, emails guides
src/app/api/chat         POST – streams Claude replies in May's voice
src/app/admin/leads      private inbox (token) + /api/admin/leads.csv
src/components/hero      useGaze (spring), VectorMay (placeholder), SpriteMay (real frames), Hero
src/components/tools     the six planners (pure maths in src/lib/calc.ts)
src/components/chat      ChatWithMay
src/content              guides, diary, privacy (typed content model in types.ts)
src/i18n                 locale config, messages, client provider
src/lib                  site config, calc, leads storage, notifications, persona, rate limit
scripts/build-hero-sheet.py   video → sprite strip pipeline
```

## 7. Compliance notes

- Every tool and guide carries a "general information, not personalised advice" notice; the chatbot is instructed never to quote premiums, guarantee returns, or give personal recommendations, and to hand off to May.
- Lead forms require explicit consent (PDPA) and link to the privacy notice; a honeypot and rate limiting protect the endpoints.
- Licence numbers are shown in the footer as required by the OIC — fill them in `site.config.ts`.
- Tax figures reflect Revenue Department rules for tax year 2026 (B.E. 2569). Review `TAX_LIMITS` each year.
