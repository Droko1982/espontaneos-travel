"""Genera los recursos de marca a partir del logo transparente (RGBA).

Uso:  python tools/make_brand_assets.py RUTA/logo-espontaneos-transparente.png
Crea en assets/img/:
  logo.png            logo transparente (máx. 1024 px) para schema/compartir
  logo-h80.webp       header (80 px de alto)   · logo-h160.webp (@2x)
  icon-32.png, icon-192.png, icon-512.png, apple-touch-icon.png (180)  → solo el ícono (sol + montañas)
  og-cover.jpg        1200×630 para redes (foto + degradado + logo + texto)
"""
import sys, os
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "img")
FOREST = (39, 46, 25)
CREAM = (247, 245, 238)


def fit_h(img, h):
    w = round(img.width * h / img.height)
    return img.resize((w, h), Image.LANCZOS)


def main(src):
    logo = Image.open(src).convert("RGBA")
    bbox = logo.getbbox()                       # recorta márgenes transparentes
    if bbox:
        logo = logo.crop(bbox)

    big = logo.copy(); big.thumbnail((1024, 1024), Image.LANCZOS)
    big.save(os.path.join(OUT, "logo.png"), optimize=True)
    for h in (80, 160):
        fit_h(logo, h).save(os.path.join(OUT, f"logo-h{h}.webp"), "WEBP", quality=90, method=6)

    # Versión para fondos oscuros: el texto en arco (verde oscuro) pasa a blanco; ícono intacto
    light = logo.copy()
    px = light.load()
    lim = int(light.height * 0.31)
    for y in range(lim):
        for x in range(light.width):
            r, g, b, a = px[x, y]
            if a > 0 and r < 120 and g < 130 and b < 110:      # verde oscuro del texto (no toca el naranja)
                px[x, y] = (255, 255, 255, a)
    for h in (80, 160):
        fit_h(light, h).save(os.path.join(OUT, f"logo-light-h{h}.webp"), "WEBP", quality=90, method=6)

    # Ícono: parte inferior (sol + montañas), sin el texto en arco
    W, H = logo.size
    icon = logo.crop((0, int(H * 0.27), W, H))
    ib = icon.getbbox()
    if ib:
        icon = icon.crop(ib)
    side = int(max(icon.size) * 1.08)  # margen para que el sol no toque el borde
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    sq.paste(icon, ((side - icon.width) // 2, (side - icon.height) // 2), icon)
    for s in (32, 192, 512):
        sq.resize((s, s), Image.LANCZOS).save(os.path.join(OUT, f"icon-{s}.png"), optimize=True)
    # Apple touch icon: fondo crema (iOS no respeta transparencia)
    apple = Image.new("RGBA", (180, 180), CREAM + (255,))
    small = sq.resize((150, 150), Image.LANCZOS)
    apple.paste(small, (15, 15), small)
    apple.convert("RGB").save(os.path.join(OUT, "apple-touch-icon.png"), optimize=True)

    # og-cover 1200×630
    photo_path = None
    for name in ("palma2.jpg", "palma1.jpg", "termales.jpg"):
        p = os.path.join(OUT, name)
        if os.path.exists(p):
            photo_path = p
            break
    canvas = Image.new("RGB", (1200, 630), FOREST)
    if photo_path:
        ph = ImageOps.exif_transpose(Image.open(photo_path)).convert("RGB")
        ph = ImageOps.fit(ph, (1200, 630), Image.LANCZOS, centering=(0.5, 0.45))
        canvas.paste(ph, (0, 0))
    # degradado oscuro a la izquierda para legibilidad
    grad = Image.new("L", (1200, 1))
    for x in range(1200):
        grad.putpixel((x, 0), int(235 * max(0.0, 1 - x / 900)))
    grad = grad.resize((1200, 630))
    shade = Image.new("RGB", (1200, 630), FOREST)
    canvas = Image.composite(shade, canvas, grad)
    # logo
    lg = logo.copy(); lg.thumbnail((300, 300), Image.LANCZOS)
    plate = Image.new("RGBA", (lg.width + 40, lg.height + 40), CREAM + (235,))
    mask = Image.new("L", plate.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, plate.width - 1, plate.height - 1], 28, fill=235)
    canvas.paste(Image.new("RGB", plate.size, CREAM), (60, 60), mask)
    canvas.paste(lg, (80, 80), lg)
    d = ImageDraw.Draw(canvas)

    def font(names, size):
        for n in names:
            p = os.path.join(os.environ.get("WINDIR", "C:/Windows"), "Fonts", n)
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
        return ImageFont.load_default()

    title = font(["georgiab.ttf", "georgia.ttf"], 50)
    sub = font(["segoeui.ttf", "arial.ttf"], 26)
    y = 60 + plate.height + 34
    d.text((62, y), "Vive el campo cafetero", font=title, fill=(255, 255, 255))
    d.text((62, y + 60), "con quienes lo habitan", font=title, fill=(255, 176, 103))
    d.text((64, y + 134), "Eje Cafetero · Colombia · RNT 91795", font=sub, fill=(230, 236, 222))
    canvas.save(os.path.join(OUT, "og-cover.jpg"), "JPEG", quality=84, optimize=True, progressive=True)
    print("ok:", ", ".join(sorted(f for f in os.listdir(OUT) if f.startswith(("logo", "icon", "apple", "og-")))))


if __name__ == "__main__":
    main(sys.argv[1])
