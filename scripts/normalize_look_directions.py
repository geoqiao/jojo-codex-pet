#!/usr/bin/env python3
"""Normalize v2 look cells to one visual weight, center line, and foot baseline."""

from __future__ import annotations

import argparse
import json
import math
import statistics
from pathlib import Path

from PIL import Image


CELL_WIDTH = 192
CELL_HEIGHT = 208
LOOK_ROWS = (9, 10)


def visible_area(image: Image.Image) -> int:
    return sum(alpha > 16 for alpha in image.getchannel("A").getdata())


def normalized_cell(
    cell: Image.Image,
    target_area: float,
    degrees: float,
    target_height: int | None,
    front_width: int,
    side_width: int,
    center_x: int,
    baseline_y: int,
    margin: int,
) -> tuple[Image.Image, dict[str, object]]:
    alpha_bbox = cell.getchannel("A").getbbox()
    if alpha_bbox is None:
        raise ValueError("look cell is empty")

    crop = cell.crop(alpha_bbox)
    original_area = visible_area(crop)
    if target_height is not None:
        directional_weight = abs(math.cos(math.radians(degrees)))
        width = round(side_width + (front_width - side_width) * directional_weight)
        height = target_height
        scale: float | str = "directional-box"
    else:
        scale = math.sqrt(target_area / original_area)
        maximum_scale = min(
            (CELL_WIDTH - margin * 2) / crop.width,
            (baseline_y - margin) / crop.height,
        )
        scale = min(scale, maximum_scale)
        width = max(1, round(crop.width * scale))
        height = max(1, round(crop.height * scale))
    width = min(width, CELL_WIDTH - margin * 2)
    height = min(height, baseline_y - margin)
    resized = crop.resize((width, height), Image.Resampling.NEAREST)

    left = round(center_x - width / 2)
    top = baseline_y - height
    left = min(max(margin, left), CELL_WIDTH - margin - width)
    top = max(margin, top)

    output = Image.new("RGBA", (CELL_WIDTH, CELL_HEIGHT), (0, 0, 0, 0))
    output.alpha_composite(resized, (left, top))
    return output, {
        "original_bbox": list(alpha_bbox),
        "original_area": original_area,
        "scale": scale,
        "normalized_bbox": [left, top, left + width, top + height],
        "normalized_area": visible_area(output),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input")
    parser.add_argument("--output", required=True)
    parser.add_argument("--webp-output")
    parser.add_argument("--json-out", required=True)
    parser.add_argument("--center-x", type=int, default=CELL_WIDTH // 2)
    parser.add_argument("--baseline-y", type=int, default=204)
    parser.add_argument("--margin", type=int, default=4)
    parser.add_argument(
        "--target-area",
        type=float,
        help="visible-pixel target; defaults to the median of all 16 look cells",
    )
    parser.add_argument("--target-height", type=int)
    parser.add_argument("--front-width", type=int, default=90)
    parser.add_argument("--side-width", type=int, default=72)
    args = parser.parse_args()

    input_path = Path(args.input).expanduser().resolve()
    output_path = Path(args.output).expanduser().resolve()
    report_path = Path(args.json_out).expanduser().resolve()

    with Image.open(input_path) as opened:
        atlas = opened.convert("RGBA")
    if atlas.size != (CELL_WIDTH * 8, CELL_HEIGHT * 11):
        raise SystemExit(f"expected 1536x2288 v2 atlas, found {atlas.size}")

    cells: list[Image.Image] = []
    for row in LOOK_ROWS:
        for column in range(8):
            left = column * CELL_WIDTH
            top = row * CELL_HEIGHT
            cells.append(atlas.crop((left, top, left + CELL_WIDTH, top + CELL_HEIGHT)))

    areas = [visible_area(cell) for cell in cells]
    target_area = args.target_area if args.target_area is not None else statistics.median(areas)
    entries: list[dict[str, object]] = []
    for index, cell in enumerate(cells):
        normalized, entry = normalized_cell(
            cell,
            target_area,
            index * 22.5,
            args.target_height,
            args.front_width,
            args.side_width,
            args.center_x,
            args.baseline_y,
            args.margin,
        )
        row = LOOK_ROWS[index // 8]
        column = index % 8
        atlas.paste(normalized, (column * CELL_WIDTH, row * CELL_HEIGHT))
        entries.append({"degrees": index * 22.5, "row": row, "column": column, **entry})

    output_path.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(output_path)
    if args.webp_output:
        webp_path = Path(args.webp_output).expanduser().resolve()
        webp_path.parent.mkdir(parents=True, exist_ok=True)
        atlas.save(webp_path, format="WEBP", lossless=True, quality=100, method=6, exact=True)

    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(
        json.dumps(
            {
                "ok": True,
                "input": str(input_path),
                "output": str(output_path),
                "target_area": target_area,
                "target_height": args.target_height,
                "front_width": args.front_width,
                "side_width": args.side_width,
                "center_x": args.center_x,
                "baseline_y": args.baseline_y,
                "margin": args.margin,
                "cells": entries,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(output_path)
    print(report_path)


if __name__ == "__main__":
    main()
