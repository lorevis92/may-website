#!/usr/bin/env python3
"""
Build the hero sprite strip from a rendered "look around" clip.

Usage:
    python3 scripts/build-hero-sheet.py path/to/clip.mp4 [--crop W:H:X:Y] [--width 496] [--max-frames 33]
                                        [--keep-bg] [--left-first] [--preview]

What it does (the same method as the reference article, automated):
  1. ffmpeg extracts every frame (optionally cropped to the character + laptop).
  2. Measures how different each frame is from the next (mean squared error) to find the two head
     turns and the holds. Every frame of a turn is kept; holds are thinned.
  3. Finds the "eye contact" frame (closest to frame 0 among the second half) and the two extremes.
  4. Flood-fills the background from the frame border so the shirt survives even if it is nearly white.
  5. Writes public/hero/sheet.webp (a single horizontal strip kept under the 16383 px browser cap),
     public/hero/idle.webp (fallback still), and src/components/hero/sprite-manifest.json.

The clip must be filmed with a LOCKED camera: she starts looking at the camera, turns her head to one
side, then the other, glances up once, blinks, and returns to the centre. 8 seconds at 24 fps is ideal.

Requires: ffmpeg on PATH, Pillow, numpy  (pip install pillow numpy)
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from collections import deque
from datetime import datetime, timezone
from pathlib import Path

try:
    import numpy as np
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Please install Pillow and numpy:  pip install pillow numpy")

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "hero"
MANIFEST = ROOT / "src" / "components" / "hero" / "sprite-manifest.json"
MAX_SHEET_WIDTH = 16383


def run(cmd: list[str]) -> None:
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        sys.exit(f"command failed: {' '.join(cmd)}\n{proc.stderr}")


def extract_frames(clip: Path, out: Path, crop: str | None) -> list[Path]:
    out.mkdir(parents=True, exist_ok=True)
    vf = [f"crop={crop}"] if crop else []
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(clip)]
    if vf:
        cmd += ["-vf", ",".join(vf)]
    cmd += [str(out / "f_%04d.png")]
    run(cmd)
    frames = sorted(out.glob("f_*.png"))
    if len(frames) < 24:
        sys.exit(f"only {len(frames)} frames extracted — is this the right clip?")
    return frames


def load_gray(paths: list[Path], size: tuple[int, int] = (160, 160)) -> np.ndarray:
    arr = []
    for p in paths:
        im = Image.open(p).convert("L").resize(size, Image.BILINEAR)
        arr.append(np.asarray(im, dtype=np.float32))
    return np.stack(arr)


def neighbour_deltas(gray: np.ndarray) -> np.ndarray:
    d = ((gray[1:] - gray[:-1]) ** 2).mean(axis=(1, 2))
    return d


def choose_frames(gray: np.ndarray, max_frames: int) -> tuple[list[int], int, int, int, list[int]]:
    """Return (kept indices in strip order, idle, left, right, blink) — all as indices into `gray`."""
    n = len(gray)
    deltas = neighbour_deltas(gray)
    moving = deltas > max(2.0, float(np.percentile(deltas, 55)))  # frames that are part of a turn

    # Eye-contact frame: the frame most similar to frame 0 in the second half of the clip.
    ref = gray[0]
    second_half = range(n // 2, n)
    idle = min(second_half, key=lambda i: float(((gray[i] - ref) ** 2).mean()))

    # Extremes: the two frames most different from idle, one on each side of the clip's first big move.
    diff_from_idle = ((gray - ref) ** 2).mean(axis=(1, 2))
    first_move = int(np.argmax(moving)) if moving.any() else 1
    # Peak 1 (first turn) and peak 2 (second turn) separated by a return through the centre.
    peak1 = int(np.argmax(diff_from_idle[first_move : n // 2])) + first_move
    # Find the centre crossing after peak1.
    trough = peak1 + int(np.argmin(diff_from_idle[peak1 : n // 2 + n // 4])) if peak1 < n - 2 else peak1
    peak2 = trough + int(np.argmax(diff_from_idle[trough:idle])) if trough < idle else trough

    # Build strip: peak1 → trough(centre) → peak2, keeping every moving frame and thinning holds.
    def segment(a: int, b: int) -> list[int]:
        step = 1 if b >= a else -1
        idx = list(range(a, b + step, step))
        kept = [idx[0]]
        hold_skip = 0
        for i in idx[1:]:
            lo = min(i, i - step)
            if lo < len(moving) and moving[lo]:
                kept.append(i)
                hold_skip = 0
            else:
                hold_skip += 1
                if hold_skip % 4 == 0:
                    kept.append(i)
        if kept[-1] != idx[-1]:
            kept.append(idx[-1])
        return kept

    strip = segment(peak1, trough) + segment(trough, peak2)[1:]
    # Remove near-duplicates and blinks mid-turn (a blink is a sudden drop in similarity to both neighbours).
    cleaned: list[int] = []
    for i in strip:
        if cleaned and float(((gray[i] - gray[cleaned[-1]]) ** 2).mean()) < 1.0:
            continue
        cleaned.append(i)
    # Thin further if too long, always keeping the ends and the centre.
    while len(cleaned) > max_frames - 2:
        centre_pos = min(range(len(cleaned)), key=lambda k: abs(cleaned[k] - trough))
        # drop the frame whose removal changes the least (smallest delta to neighbours), never ends/centre
        cand = [
            k for k in range(1, len(cleaned) - 1) if k != centre_pos
        ]
        k = min(cand, key=lambda k: float(((gray[cleaned[k]] - gray[cleaned[k - 1]]) ** 2).mean()))
        cleaned.pop(k)

    centre_pos = min(range(len(cleaned)), key=lambda k: abs(cleaned[k] - trough))
    # Blink frames: the two frames after idle with the largest local change in the eye band (approximate: whole frame).
    tail = list(range(idle, min(n, idle + 24)))
    tail_deltas = [(float(((gray[i] - ref) ** 2).mean()), i) for i in tail]
    tail_deltas.sort(reverse=True)
    blink_src = sorted(i for _, i in tail_deltas[:2]) if len(tail_deltas) >= 2 else []

    strip_final = cleaned + blink_src
    left, right = 0, len(cleaned) - 1
    blink = list(range(len(cleaned), len(strip_final)))
    return strip_final, centre_pos, left, right, blink


def key_background(im: Image.Image, tol: int = 28) -> Image.Image:
    """Flood fill from the border: only background that touches the edge becomes transparent."""
    rgba = im.convert("RGBA")
    px = np.asarray(rgba).copy()
    h, w, _ = px.shape
    border = np.concatenate([px[0, :, :3], px[-1, :, :3], px[:, 0, :3], px[:, -1, :3]]).astype(np.int16)
    bg = np.median(border, axis=0)
    close = (np.abs(px[:, :, :3].astype(np.int16) - bg).sum(axis=2) <= tol * 3)
    seen = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        for y in (0, h - 1):
            if close[y, x] and not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if close[y, x] and not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and not seen[ny, nx] and close[ny, nx]:
                seen[ny, nx] = True
                q.append((ny, nx))
    px[seen, 3] = 0
    # Soften the edge one pixel to avoid a hard matte line.
    edge = seen & ~np.roll(seen, 1, 0) | seen & ~np.roll(seen, -1, 0) | seen & ~np.roll(seen, 1, 1) | seen & ~np.roll(seen, -1, 1)
    px[edge, 3] = np.minimum(px[edge, 3], 90)
    return Image.fromarray(px, "RGBA")


def auto_strip(frames: list[Path], args: argparse.Namespace) -> tuple[list[int], int, list[int]]:
    """Automatic frame selection; returns (strip in [viewer-left … idle … viewer-right] + blink order, idle index, blink)."""
    gray = load_gray(frames)
    strip_idx, centre_pos, left, right, blink = choose_frames(gray, args.max_frames)
    print(f"kept {len(strip_idx)} frames (turn: {len(strip_idx) - len(blink)}, blink: {len(blink)}); idle at index {centre_pos}")

    # Determine direction: compare horizontal centre of mass of the dark hair mass between the ends.
    first_im = gray[strip_idx[left]]
    last_im = gray[strip_idx[right]]
    def com_x(a: np.ndarray) -> float:
        dark = (255 - a)
        xs = np.arange(a.shape[1])
        return float((dark.sum(axis=0) * xs).sum() / max(1.0, dark.sum()))
    turns_right_first = com_x(last_im) > com_x(first_im)
    if args.left_first:
        turns_right_first = not turns_right_first
    # Strip order must be [viewer-left … idle … viewer-right].
    if turns_right_first:
        turn = strip_idx[: len(strip_idx) - len(blink)][::-1]
        centre_pos = len(turn) - 1 - centre_pos
        strip_idx = turn + strip_idx[len(turn):]
    return strip_idx, centre_pos, blink


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("clip", type=Path)
    ap.add_argument("--crop", help="ffmpeg crop W:H:X:Y to the character + laptop (optional)")
    ap.add_argument("--width", type=int, default=496, help="frame width in the strip (default 496)")
    ap.add_argument("--max-frames", type=int, default=33)
    ap.add_argument("--keep-bg", action="store_true", help="do not key out the background")
    ap.add_argument("--left-first", action="store_true", help="she turns to the viewer's LEFT first (default: right first)")
    ap.add_argument("--preview", action="store_true", help="also write public/hero/contact-sheet.png")
    ap.add_argument("--frames", help="manual strip: comma-separated 0-based clip frame numbers, viewer-left extreme → idle → viewer-right extreme (skips auto selection)")
    ap.add_argument("--idle", type=int, help="with --frames: the eye-contact frame number (must be in --frames)")
    ap.add_argument("--blink", help="with --frames: comma-separated frame numbers for the idle blink")
    args = ap.parse_args()
    if args.frames and (args.idle is None or args.idle not in [int(x) for x in args.frames.split(",")]):
        sys.exit("--frames needs --idle set to one of the listed frames")

    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg not found on PATH")
    if not args.clip.exists():
        sys.exit(f"clip not found: {args.clip}")

    with tempfile.TemporaryDirectory() as tmp:
        frames = extract_frames(args.clip, Path(tmp) / "frames", args.crop)
        print(f"extracted {len(frames)} frames")
        if args.frames:
            # Manual selection: already in strip order, so no direction detection.
            turn = [int(x) for x in args.frames.split(",")]
            blink = [int(x) for x in args.blink.split(",")] if args.blink else []
            if max(turn + blink) >= len(frames):
                sys.exit(f"frame numbers must be < {len(frames)}")
            strip_idx = turn + blink
            centre_pos = turn.index(args.idle)
            print(f"manual strip: {len(turn)} turn frames + {len(blink)} blink; idle at index {centre_pos}")
        else:
            strip_idx, centre_pos, blink = auto_strip(frames, args)

        with Image.open(frames[0]) as first:  # close it, or Windows can't delete the temp dir
            first_w, first_h = first.size
        scale = args.width / first_w
        fw, fh = args.width, int(round(first_h * scale))
        total_w = fw * len(strip_idx)
        if total_w > MAX_SHEET_WIDTH:
            sys.exit(f"strip would be {total_w}px wide (> {MAX_SHEET_WIDTH}). Reduce --width or --max-frames.")

        sheet = Image.new("RGBA", (total_w, fh), (0, 0, 0, 0))
        for k, i in enumerate(strip_idx):
            im = Image.open(frames[i]).convert("RGBA").resize((fw, fh), Image.LANCZOS)
            if not args.keep_bg:
                im = key_background(im)
            sheet.paste(im, (k * fw, 0))
        PUBLIC.mkdir(parents=True, exist_ok=True)
        sheet.save(PUBLIC / "sheet.webp", "WEBP", quality=88, method=6)
        sheet.crop((centre_pos * fw, 0, (centre_pos + 1) * fw, fh)).save(PUBLIC / "idle.webp", "WEBP", quality=90)
        if args.preview:
            cols = 8
            rows = (len(strip_idx) + cols - 1) // cols
            cs = Image.new("RGBA", (cols * 160, rows * int(160 * fh / fw)), (255, 255, 255, 255))
            for k in range(len(strip_idx)):
                th = sheet.crop((k * fw, 0, (k + 1) * fw, fh)).resize((160, int(160 * fh / fw)))
                cs.paste(th, ((k % cols) * 160, (k // cols) * int(160 * fh / fw)), th)
            cs.save(PUBLIC / "contact-sheet.png")

        manifest = {
            "frames": len(strip_idx),
            "frameWidth": fw,
            "frameHeight": fh,
            "idle": centre_pos,
            "left": 0,
            "right": len(strip_idx) - len(blink) - 1,
            "blink": [len(strip_idx) - len(blink) + k for k in range(len(blink))],
            "sheet": "/hero/sheet.webp",
            "fallback": "/hero/idle.webp",
            "generated": datetime.now(timezone.utc).isoformat(),
            "source": args.clip.name,
        }
        MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
        print(f"wrote {PUBLIC / 'sheet.webp'} ({total_w}x{fh}) and {MANIFEST}")
        print("Now run `npm run build` (or just reload the dev server) — the hero switches to the sprite automatically.")


if __name__ == "__main__":
    main()
