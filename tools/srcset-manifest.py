#!/usr/bin/python3
"""Generate assets/srcset-manifest.json: {"/images/x.webp": origWidth} for each image that has an -m.webp sibling."""
import os, json
from PIL import Image
out = {}
SKIP = ('/images/career/apple/hero.webp',)  # promo/ and hero have art-directed -m crops used in <picture>
for r, _, fs in os.walk('public/images'):
    for f in fs:
        if f.endswith('-m.webp'):
            base = os.path.join(r, f[:-7])
            for ext in ('webp', 'jpg', 'jpeg', 'png'):
                o = base + '.' + ext
                if os.path.exists(o) and o[len('public'):] not in SKIP and '/equipment/promo/' not in o:
                    out[o[len('public'):]] = Image.open(o).size[0]
                    break
os.makedirs('assets', exist_ok=True)
json.dump(dict(sorted(out.items())), open('assets/srcset-manifest.json', 'w'), ensure_ascii=False, indent=0)
print(len(out))
