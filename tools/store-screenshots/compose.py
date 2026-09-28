"""Compose store screenshots from raw simulator captures.

Raw captures live in store/raw/{iphone,ipad}/NN-<slide>.png (taken from a
Release build with the status bar overridden to 9:41). This script frames
each one with a caption on a brand background and writes every size the
stores ask for into store/screenshots/<target>/.

    python3 tools/store-screenshots/compose.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "store" / "raw"
OUT = ROOT / "store" / "screenshots"
FONTS = ROOT / "node_modules" / "@expo-google-fonts"
TITLE_FONT = FONTS / "fredoka" / "700Bold" / "Fredoka_700Bold.ttf"
SUBTITLE_FONT = FONTS / "nunito" / "700Bold" / "Nunito_700Bold.ttf"

FOREST = "#2F5D2C"
CREAM = "#FBF5E8"
INK = "#34362F"
BEZEL = "#1E1F1C"

# (file stem, title, subtitle, accent colour behind the device)
SLIDES = [
    ("01-home", "Descubra o mundo animal", "Um animal novo para conhecer todo dia", "#F5C45D"),
    ("02-animal", "Ouça o nome e o som", "Sílabas, sons e curiosidades de cada bicho", "#8DCFE8"),
    ("03-challenge", "Aprenda brincando", "Desafios de arrastar e tocar, no ritmo da criança", "#6F9F52"),
    ("04-success", "Cada acerto vira festa", "Estrelas e incentivo, sem pressão", "#ED762E"),
    ("05-explore", "22 animais ilustrados", "Da fazenda à savana, com arte exclusiva", "#4DB6C6"),
    ("06-collection", "Monte sua Bichupédia", "Sem anúncios e sem coleta de dados", "#D94A2B"),
]

# name -> (canvas size, raw source folder, pixels of OS status bar to trim or 0)
TARGETS = {
    "ios-iphone-6.9": ((1320, 2868), "iphone", 0),
    "ios-ipad-13": ((2064, 2752), "ipad", 0),
    # Google Play: phone and tablet shots at 9:16. The Android versions trim the
    # iOS status bar so no iPhone/iPad chrome shows up on the Play listing.
    "android-phone": ((1080, 1920), "iphone", 180),
    "android-tablet-10": ((1440, 2560), "ipad", 64),
}


def hex_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def mix(a: str, b: str, t: float) -> tuple[int, int, int]:
    ca, cb = hex_rgb(a), hex_rgb(b)
    return tuple(round(ca[i] + (cb[i] - ca[i]) * t) for i in range(3))  # type: ignore[return-value]


def background(size: tuple[int, int], accent: str) -> Image.Image:
    w, h = size
    img = Image.new("RGB", size, CREAM)
    draw = ImageDraw.Draw(img)
    for y in range(h):
        draw.line([(0, y), (w, y)], fill=mix(CREAM, accent, 0.10 + 0.30 * (y / h)))
    # Two soft blobs keep the flat gradient from looking empty.
    blobs = Image.new("RGBA", size, (0, 0, 0, 0))
    bd = ImageDraw.Draw(blobs)
    r = int(w * 0.55)
    bd.ellipse([w - r * 0.9, h * 0.30, w + r * 1.1, h * 0.30 + r * 2], fill=(*hex_rgb(accent), 70))
    bd.ellipse([-r * 1.1, h * 0.62, r * 0.8, h * 0.62 + r * 1.9], fill=(*hex_rgb(accent), 55))
    blobs = blobs.filter(ImageFilter.GaussianBlur(w * 0.05))
    img.paste(blobs, (0, 0), blobs)
    return img


def fit_font(path: Path, text: str, max_width: int, start: int) -> ImageFont.FreeTypeFont:
    size = start
    while size > 10:
        font = ImageFont.truetype(str(path), size)
        if font.getlength(text) <= max_width:
            return font
        size -= 2
    return ImageFont.truetype(str(path), size)


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return mask


def device(shot: Image.Image, width: int, tablet: bool) -> Image.Image:
    """Scale the capture to `width` and wrap it in a simple rounded bezel."""
    scale = width / shot.width
    shot = shot.resize((width, round(shot.height * scale)), Image.LANCZOS)
    radius = round(width * (0.045 if tablet else 0.11))
    border = round(width * (0.022 if tablet else 0.03))
    frame = Image.new("RGBA", (shot.width + border * 2, shot.height + border * 2), (0, 0, 0, 0))
    ImageDraw.Draw(frame).rounded_rectangle(
        [0, 0, frame.width - 1, frame.height - 1], radius=radius + border, fill=BEZEL
    )
    frame.paste(shot, (border, border), rounded_mask(shot.size, radius))
    return frame


def compose(raw: Image.Image, size: tuple[int, int], title: str, subtitle: str, accent: str, tablet: bool) -> Image.Image:
    w, h = size
    canvas = background(size, accent).convert("RGBA")
    draw = ImageDraw.Draw(canvas)

    margin = round(w * 0.07)
    title_font = fit_font(TITLE_FONT, title, w - margin * 2, round(w * (0.075 if tablet else 0.088)))
    sub_font = fit_font(SUBTITLE_FONT, subtitle, w - margin * 2, round(w * (0.036 if tablet else 0.043)))
    top = round(h * 0.055)
    draw.text((w / 2, top), title, font=title_font, fill=FOREST, anchor="ma")
    sub_top = top + title_font.size * 1.25
    draw.text((w / 2, sub_top), subtitle, font=sub_font, fill=INK, anchor="ma")
    text_bottom = sub_top + sub_font.size * 1.6

    # Device: as big as the space under the caption allows; it bleeds off the
    # bottom edge on phones, which reads as "more below" on the store.
    avail_h = h - text_bottom - round(h * 0.02)
    max_w = round(w * (0.80 if tablet and w / h > 0.7 else 0.92 if tablet else 0.84))
    dev_w = min(max_w, round(avail_h * 1.02 * raw.width / raw.height)) if tablet else max_w
    frame = device(raw, dev_w, tablet)

    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    x = (w - frame.width) // 2
    y = round(text_bottom + h * 0.015)
    if tablet:  # centre in the space left under the caption instead of hugging the text
        y = round(text_bottom + max(h * 0.015, (h - text_bottom - frame.height) / 2))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [x + 10, y + 30, x + frame.width - 10, y + frame.height + 20], radius=round(frame.width * 0.1), fill=(40, 40, 30, 90)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(w * 0.025))
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(frame, (x, y))
    return canvas.convert("RGB")


def feature_graphic() -> None:
    """Google Play feature graphic, 1024x500."""
    w, h = 1024, 500
    canvas = background((w, h), "#6F9F52").convert("RGBA")
    draw = ImageDraw.Draw(canvas)
    wordmark = Image.open(ROOT / "assets" / "brand" / "wordmark.png").convert("RGBA")
    wordmark.thumbnail((470, 200))
    canvas.alpha_composite(wordmark, (70, 120))
    tagline = ImageFont.truetype(str(SUBTITLE_FONT), 34)
    draw.text((75, 120 + wordmark.height + 24), "Descubra o mundo animal brincando", font=tagline, fill=INK)
    mascot = Image.open(ROOT / "assets" / "brand" / "mascot-wave.png").convert("RGBA")
    mascot.thumbnail((380, 460))
    canvas.alpha_composite(mascot, (w - mascot.width - 60, h - mascot.height - 10))
    OUT.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(OUT / "android-feature-graphic-1024x500.png")


def main() -> None:
    for target, (size, source, trim) in TARGETS.items():
        folder = OUT / target
        folder.mkdir(parents=True, exist_ok=True)
        for stem, title, subtitle, accent in SLIDES:
            path = RAW / source / f"{stem}.png"
            if not path.exists():
                print(f"skip {target}/{stem}: missing {path.relative_to(ROOT)}")
                continue
            raw = Image.open(path).convert("RGB")
            if trim:
                raw = raw.crop((0, trim, raw.width, raw.height))
            out = compose(raw, size, title, subtitle, accent, tablet=source == "ipad")
            out.save(folder / f"{stem}.png", optimize=True)
            print(f"{target}/{stem}.png {out.size[0]}x{out.size[1]}")
    feature_graphic()
    print("android-feature-graphic-1024x500.png")


if __name__ == "__main__":
    main()
