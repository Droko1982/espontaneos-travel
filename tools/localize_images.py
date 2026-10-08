"""Descarga las fotos de Google Drive (lh3) y las guarda como WebP locales.

Uso:  python tools/localize_images.py
- Lee los IDs de Drive de js/data.js (tours + galería) y de index.html.
- Guarda assets/img/d/<id>-640.webp (tarjetas/miniaturas) y <id>-1600.webp (máx. 1600 px, ~200 KB).
- Convierte también las fotos locales .jpg pesadas de assets/img/ a WebP.
- Escribe js/img-local.js con el mapa de imágenes disponibles y su tamaño.
Se puede volver a ejecutar: salta lo que ya existe. Una imagen a la vez (poca memoria).
"""
import io, json, os, re, sys, time, urllib.request
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DST = os.path.join(ROOT, "assets", "img", "d")
UA = "Mozilla/5.0 (EspontaneosTravel image localizer; info@espontaneostravel.com)"
os.makedirs(DST, exist_ok=True)


def ids_from(path):
    with open(path, encoding="utf-8") as f:
        txt = f.read()
    found = set(re.findall(r"lh3\.googleusercontent\.com/d/([A-Za-z0-9_-]{20,})", txt))
    found |= set(re.findall(r'"(1[A-Za-z0-9_-]{24,40})"', txt))   # IDs en arrays imgs:[...] / id:"..."
    found |= set(re.findall(r'data-drive="([A-Za-z0-9_-]{20,})"', txt))
    return found


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read()


def save_versions(img, base):
    img = ImageOps.exif_transpose(img).convert("RGB")
    out = {}
    for w, box, q, limit in ((1600, (1600, 1600), 76, 210_000), (640, (640, 900), 72, 70_000)):
        im = img.copy()
        im.thumbnail(box, Image.LANCZOS)          # lado mayor acotado (retratos incluidos)
        p = f"{base}-{w}.webp"
        while True:                                # baja la calidad hasta ~200 KB / ~70 KB
            buf = io.BytesIO(); im.save(buf, "WEBP", quality=q, method=4)
            if buf.tell() <= limit or q <= 50:
                break
            q -= 6
        with open(p, "wb") as f:
            f.write(buf.getvalue())
        out[w] = im.size
    return out


def from_folder(folder):
    """Importa fotos desde una carpeta del equipo: <carpeta>/<id_del_tour>/*.jpg|png|webp
    (id_del_tour = el de js/data.js, p. ej. 'finca', 'cocorasalento'). Útil si Drive no es público."""
    tours = {}
    for tid in sorted(os.listdir(folder)):
        sub = os.path.join(folder, tid)
        if not os.path.isdir(sub):
            continue
        files = sorted(f for f in os.listdir(sub) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".heic")))
        n = 0
        for f in files[:10]:
            try:
                with Image.open(os.path.join(sub, f)) as im:
                    im.draft("RGB", (1600, 1600))
                    n += 1
                    save_versions(im, os.path.join(ROOT, "assets", "img", "t", f"{tid}-{n}"))
            except Exception as e:  # noqa: BLE001
                print("  no se pudo leer", f, e)
        if n:
            tours[tid] = n
            print(f"{tid}: {n} fotos")
    return tours


def main():
    args = sys.argv[1:]
    mapping_path = os.path.join(ROOT, "js", "img-local.js")
    prev = {"drive": {}, "local": {}, "tours": {}}
    if os.path.exists(mapping_path):
        try:
            txt = open(mapping_path, encoding="utf-8").read()
            prev.update(json.loads(txt[txt.index("{"): txt.rindex("}") + 1]))
        except Exception:  # noqa: BLE001
            pass
    if args[:1] == ["--from-folder"]:
        os.makedirs(os.path.join(ROOT, "assets", "img", "t"), exist_ok=True)
        prev["tours"].update(from_folder(args[1]))
        write_map(mapping_path, prev)
        return 0
    ids = [] if args[:1] == ["--local-only"] else ids_from(os.path.join(ROOT, "js", "data.js")) | ids_from(os.path.join(ROOT, "index.html"))
    ids = sorted(i for i in ids if len(i) >= 25)
    mapping = dict(prev.get("drive", {}))
    ok = fail = 0
    for n, i in enumerate(ids, 1):
        base = os.path.join(DST, i)
        if os.path.exists(base + "-1600.webp") and os.path.exists(base + "-640.webp"):
            with Image.open(base + "-1600.webp") as im:
                mapping[i] = list(im.size)
            ok += 1
            continue
        data = None
        for url in (f"https://lh3.googleusercontent.com/d/{i}=w1600",
                    f"https://drive.google.com/thumbnail?id={i}&sz=w1600"):
            try:
                data = fetch(url)
                if data and len(data) > 2000:
                    break
            except Exception as e:  # noqa: BLE001
                data = None
                print(f"  retry {i}: {e}", flush=True)
                time.sleep(2)
        if not data:
            fail += 1
            print(f"[{n}/{len(ids)}] FAIL {i}", flush=True)
            continue
        try:
            img = Image.open(io.BytesIO(data))
            img.draft("RGB", (1600, 1600))
            sizes = save_versions(img, base)
            mapping[i] = list(sizes[1600])
            ok += 1
            print(f"[{n}/{len(ids)}] ok {i} {sizes[1600]}", flush=True)
        except Exception as e:  # noqa: BLE001
            fail += 1
            print(f"[{n}/{len(ids)}] FAIL decode {i}: {e}", flush=True)
        time.sleep(0.4)

    # Fotos locales pesadas → WebP (se mantienen los .jpg originales como respaldo)
    local = {}
    for name in sorted(os.listdir(os.path.join(ROOT, "assets", "img"))):
        if name.lower().endswith((".jpg", ".jpeg")) and not name.startswith("og-"):
            src = os.path.join(ROOT, "assets", "img", name)
            base = os.path.splitext(src)[0]
            if not os.path.exists(base + "-1600.webp"):
                with Image.open(src) as im:
                    im.draft("RGB", (1600, 1600))
                    save_versions(im, base)
            with Image.open(base + "-1600.webp") as im:
                local[name] = list(im.size)

    prev.update({"drive": mapping, "local": local})
    write_map(mapping_path, prev)
    print(f"\nListo: {ok} ok, {fail} fallidas, {len(local)} locales → js/img-local.js", flush=True)


def write_map(path, data):
    with open(path, "w", encoding="utf-8") as f:
        f.write("/* GENERADO por tools/localize_images.py — fotos locales en WebP (640 y 1600 px).\n"
                "   drive: id de Google Drive → [ancho, alto]; local: .jpg de assets/img con versión WebP;\n"
                "   tours: id del tour → n.º de fotos importadas con --from-folder (assets/img/t/<id>-<n>-640|1600.webp). */\n")
        f.write("window.IMG_LOCAL = " + json.dumps(data, separators=(",", ":")) + ";\n")


if __name__ == "__main__":
    sys.exit(main())
