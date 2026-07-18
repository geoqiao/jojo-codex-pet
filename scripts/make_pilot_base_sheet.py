from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "apps" / "web" / "public" / "pilot-bases"
OUTPUT = ROOT / "docs" / "visual" / "pilot-base-review" / "pilot-base-contact-sheet.png"

PETS = [
    ("part-03-jotaro-kujo", "JOTARO KUJO", "#7657d9", ["#171a33", "#7ed6c4", "#ff6b6b", "#e8c66a"]),
    ("part-03-star-platinum", "STAR PLATINUM", "#42c7d9", ["#5a2c6f", "#42c7d9", "#ff6b6b", "#f4e6c2"]),
    ("part-03-dio", "DIO", "#ff5f6f", ["#7a1f3d", "#f2e7cf", "#36c9c6", "#d9a441"]),
    ("part-03-the-world", "THE WORLD", "#d9a441", ["#1a686d", "#d9a441", "#7a1f3d", "#f2e7cf"]),
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


canvas = Image.new("RGB", (1600, 1240), "#17131e")
draw = ImageDraw.Draw(canvas)
draw.text((60, 42), "PART 03 / PILOT BASE DESIGN GATE", fill="#d8ff55", font=font(24, bold=True))
draw.text((60, 78), "SILHOUETTE · PROPORTION · FACE · COSTUME · PALETTE", fill="#fffaf0", font=font(44, bold=True))
draw.text((60, 132), "Review images only — no animation rows have been generated.", fill="#b9b0c0", font=font(20))

card_width = 720
card_height = 480
gap_x = 40
gap_y = 38
start_x = 60
start_y = 195

for index, (pet_id, label, accent, palette) in enumerate(PETS):
    column = index % 2
    row = index // 2
    x = start_x + column * (card_width + gap_x)
    y = start_y + row * (card_height + gap_y)

    draw.rectangle((x, y, x + card_width, y + card_height), fill="#fffaf0", outline="#fffaf0", width=3)
    draw.rectangle((x + 10, y + 10, x + 410, y + card_height - 10), fill=accent)
    draw.polygon(
        [(x + 10, y + 10), (x + 180, y + 10), (x + 75, y + 180)],
        fill="#ffffff55",
    )

    image = Image.open(SOURCE_DIR / f"{pet_id}.png").convert("RGBA")
    bounds = image.getbbox()
    if bounds is None:
        raise ValueError(f"No visible pixels in {pet_id}")
    image = image.crop(bounds)
    image.thumbnail((370, 405), Image.Resampling.NEAREST)
    image_x = x + 210 - image.width // 2
    image_y = y + 245 - image.height // 2
    canvas.paste(image, (image_x, image_y), image)

    copy_x = x + 445
    draw.text((copy_x, y + 45), f"0{index + 1}", fill="#ff5f6f", font=font(18, bold=True))
    draw.multiline_text((copy_x, y + 82), label, fill="#17131e", font=font(29, bold=True), spacing=4)
    draw.text((copy_x, y + 180), pet_id, fill="#6e6874", font=font(14))
    draw.text((copy_x, y + 225), "LOCKED PALETTE", fill="#17131e", font=font(15, bold=True))

    for swatch_index, color in enumerate(palette):
        swatch_x = copy_x + swatch_index * 58
        draw.rectangle((swatch_x, y + 258, swatch_x + 46, y + 304), fill=color, outline="#17131e", width=2)

    draw.rectangle((copy_x, y + 340, copy_x + 68, y + 367), fill="#17131e")
    draw.text((copy_x + 9, y + 344), "BASE", fill="#fffaf0", font=font(14, bold=True))
    draw.text((copy_x, y + 386), "AWAITING APPROVAL", fill="#17131e", font=font(17, bold=True))

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
canvas.save(OUTPUT, optimize=True)
print(OUTPUT)
