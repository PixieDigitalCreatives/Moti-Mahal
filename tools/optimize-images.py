# Converts assets-src/images/*.jpg -> public/images/*.webp (resized, quality-tuned)
import sys, os
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
wide = {"hero-handi", "family-feast", "dining-room", "royal-ambience", "arch-corridor", "arches-agra", "marble-arches", "spices", "flames", "kitchen-fire", "warm-interior", "thali-spread"}
for f in sorted(os.listdir(src)):
    if not f.endswith(".jpg"): continue
    name = f[:-4]
    im = Image.open(os.path.join(src, f)).convert("RGB")
    maxw = 2200 if name in wide else 1400
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    out = os.path.join(dst, name + ".webp")
    im.save(out, "WEBP", quality=74, method=6)
    print(f"{name}: {im.width}x{im.height} {os.path.getsize(out)//1024}KB")
