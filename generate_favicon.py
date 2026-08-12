"""
generate_favicon.py
Genera todos los assets de favicon y og-image para CharlieGood Burgers.
Fuente: images/logo.png (canal alfa transparente — composita limpio sobre cualquier fondo)
"""
import os
from PIL import Image, ImageDraw

SOURCE   = "images/logo.png"   # PNG con fondo transparente: compositing limpio
BG_COLOR = (26, 18, 8)         # #1A1208 — carbon


def make_square(size, padding_pct=0.10):
    """Canvas RGB cuadrado con fondo carbon y logo centrado."""
    canvas = Image.new("RGB", (size, size), BG_COLOR)
    logo   = Image.open(SOURCE).convert("RGBA")
    inner  = int(size * (1 - padding_pct * 2))
    logo   = logo.resize((inner, inner), Image.LANCZOS)
    offset = (size - inner) // 2
    # Usa canal alfa del PNG como máscara → fondo carbon visible en el padding
    canvas.paste(logo, (offset, offset), logo.split()[3])
    return canvas


def add_rounded_corners(img, radius_pct=0.20):
    """Devuelve imagen RGB con esquinas redondeadas (fondo carbon en las esquinas)."""
    size = img.size[0]
    r    = int(size * radius_pct)
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=255)
    result = Image.new("RGB", (size, size), BG_COLOR)
    result.paste(img, mask=mask)
    return result


# ── 1. favicon-32x32.png ──────────────────────────────────
f32 = make_square(32, padding_pct=0.10)
f32.save("favicon-32x32.png", "PNG", optimize=True)
print(f"favicon-32x32.png    {os.path.getsize('favicon-32x32.png'):>8,} bytes")

# ── 2. favicon-16x16.png ──────────────────────────────────
f16 = make_square(16, padding_pct=0.08)
f16.save("favicon-16x16.png", "PNG", optimize=True)
print(f"favicon-16x16.png    {os.path.getsize('favicon-16x16.png'):>8,} bytes")

# ── 3. favicon.ico (multi-size: 16, 32, 48) ───────────────
f48 = make_square(48, padding_pct=0.10)
# Pillow guarda el ICO correcto pasando append_images con los tamaños menores
f48.save(
    "favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=[f32, f16],
)
print(f"favicon.ico          {os.path.getsize('favicon.ico'):>8,} bytes")

# ── 4. apple-touch-icon.png (180x180, esquinas redondeadas) ──
ati = add_rounded_corners(make_square(180, padding_pct=0.13), radius_pct=0.20)
ati.save("apple-touch-icon.png", "PNG", optimize=True)
print(f"apple-touch-icon.png {os.path.getsize('apple-touch-icon.png'):>8,} bytes")

# ── 5. og-image.png (1200x630, logo centrado para redes) ──
og        = Image.new("RGB", (1200, 630), BG_COLOR)
logo_og   = Image.open(SOURCE).convert("RGBA")
logo_size = int(630 * 0.62)        # 62% del alto → buen balance en tarjeta OG
logo_og   = logo_og.resize((logo_size, logo_size), Image.LANCZOS)
ox        = (1200 - logo_size) // 2
oy        = (630  - logo_size) // 2
og.paste(logo_og, (ox, oy), logo_og.split()[3])
og.save("og-image.png", "PNG", optimize=True)
print(f"og-image.png         {os.path.getsize('og-image.png'):>8,} bytes")

print("\n✓ Todos los archivos generados correctamente.")
