#!/usr/bin/env python3
"""Combine all Codex Pet v2 states into one labeled QA reel."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


STATE_DURATIONS = [
    ("idle", [280, 110, 110, 140, 140, 320]),
    ("running-right", [120, 120, 120, 120, 120, 120, 120, 220]),
    ("running-left", [120, 120, 120, 120, 120, 120, 120, 220]),
    ("waving", [140, 140, 140, 280]),
    ("jumping", [140, 140, 140, 140, 280]),
    ("failed", [140, 140, 140, 140, 140, 140, 140, 240]),
    ("waiting", [150, 150, 150, 150, 150, 260]),
    ("running", [120, 120, 120, 120, 120, 220]),
    ("review", [150, 150, 150, 150, 150, 280]),
]

STATE_LABELS = {
    "idle": "01  IDLE",
    "running-right": "02  MOVE RIGHT",
    "running-left": "03  MOVE LEFT",
    "waving": "04  WAVE",
    "jumping": "05  JUMP",
    "failed": "06  FAILED",
    "waiting": "07  WAITING FOR INPUT",
    "running": "08  WORKING",
    "review": "09  REVIEW",
}

LOOK_LABELS = [
    "000 UP",
    "022.5 UP-RIGHT",
    "045 UP-RIGHT",
    "067.5 UP-RIGHT",
    "090 RIGHT",
    "112.5 DOWN-RIGHT",
    "135 DOWN-RIGHT",
    "157.5 DOWN-RIGHT",
    "180 DOWN",
    "202.5 DOWN-LEFT",
    "225 DOWN-LEFT",
    "247.5 DOWN-LEFT",
    "270 LEFT",
    "292.5 UP-LEFT",
    "315 UP-LEFT",
    "337.5 UP-LEFT",
]

CELL_SIZE = (192, 208)
HEADER_HEIGHT = 32
SCALE = 2


def checkerboard() -> Image.Image:
    image = Image.new("RGBA", CELL_SIZE, "#eef0f4")
    draw = ImageDraw.Draw(image)
    square = 16
    for y in range(0, CELL_SIZE[1], square):
        for x in range(0, CELL_SIZE[0], square):
            if (x // square + y // square) % 2:
                draw.rectangle((x, y, x + square - 1, y + square - 1), fill="#dfe3e9")
    return image


def labeled_frame(frame: Image.Image, pet_label: str, state_label: str) -> Image.Image:
    canvas = Image.new("RGBA", (CELL_SIZE[0], CELL_SIZE[1] + HEADER_HEIGHT), "#111523")
    canvas.alpha_composite(checkerboard(), (0, HEADER_HEIGHT))
    canvas.alpha_composite(frame.convert("RGBA"), (0, HEADER_HEIGHT))

    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()
    draw.text((6, 4), pet_label.upper(), fill="#f4e6c2", font=font)
    draw.text((6, 17), state_label, fill="#7ed6c4", font=font)
    return canvas.resize((canvas.width * SCALE, canvas.height * SCALE), Image.Resampling.NEAREST)


def load_state_frames(frames_root: Path, state: str, expected: int) -> list[Image.Image]:
    files = sorted((frames_root / state).glob("*.png"))
    if len(files) != expected:
        raise SystemExit(f"{state}: expected {expected} PNG frames, found {len(files)}")
    frames: list[Image.Image] = []
    for path in files:
        with Image.open(path) as opened:
            frames.append(opened.convert("RGBA"))
    return frames


def load_look_frames(atlas_path: Path) -> list[Image.Image]:
    with Image.open(atlas_path) as opened:
        atlas = opened.convert("RGBA")
    expected_size = (CELL_SIZE[0] * 8, CELL_SIZE[1] * 11)
    if atlas.size != expected_size:
        raise SystemExit(f"atlas: expected {expected_size}, found {atlas.size}")

    frames: list[Image.Image] = []
    for index in range(16):
        row = 9 + index // 8
        column = index % 8
        left = column * CELL_SIZE[0]
        top = row * CELL_SIZE[1]
        frames.append(atlas.crop((left, top, left + CELL_SIZE[0], top + CELL_SIZE[1])))
    return frames


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--frames-root", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--pet-label", required=True)
    parser.add_argument("--atlas", help="optional v2 atlas; appends all 16 look directions")
    args = parser.parse_args()

    frames_root = Path(args.frames_root).expanduser().resolve()
    output = Path(args.output).expanduser().resolve()
    reel_frames: list[Image.Image] = []
    reel_durations: list[int] = []

    for state, durations in STATE_DURATIONS:
        frames = load_state_frames(frames_root, state, len(durations))
        for index, (frame, duration) in enumerate(zip(frames, durations, strict=True)):
            reel_frames.append(labeled_frame(frame, args.pet_label, STATE_LABELS[state]))
            reel_durations.append(duration + (420 if index == 0 else 0))

    if args.atlas:
        look_frames = load_look_frames(Path(args.atlas).expanduser().resolve())
        for index, (frame, label) in enumerate(zip(look_frames, LOOK_LABELS, strict=True)):
            reel_frames.append(labeled_frame(frame, args.pet_label, f"10  LOOK {label}"))
            reel_durations.append(620 if index == 0 else 190)

    output.parent.mkdir(parents=True, exist_ok=True)
    reel_frames[0].save(
        output,
        save_all=True,
        append_images=reel_frames[1:],
        duration=reel_durations,
        loop=0,
        disposal=2,
        optimize=False,
    )
    print(f"wrote {output}")


if __name__ == "__main__":
    main()
