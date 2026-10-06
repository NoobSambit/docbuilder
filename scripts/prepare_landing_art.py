"""Build CDN-ready WebP derivatives from selected masters; never overwrite originals."""
from pathlib import Path
from PIL import Image
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
THEMES = ['01-akshara', '02-astra', '03-neel', '04-sabha', '05-vanam']
ASSETS = {'hero': 'hero-background-v4.png', 'capabilities': 'capabilities-background-v1.png',
          'archive': 'archive-detail-v1.png', 'outputs': 'outputs-background-v1.png'}
manifest = {}
for theme in THEMES:
    theme_id = theme.split('-', 1)[1]
    output = ROOT / 'frontend/public/landing' / theme_id
    output.mkdir(parents=True, exist_ok=True)
    manifest[theme_id] = {}
    for name, source_name in ASSETS.items():
        source = ROOT / 'design/landing-page-revamp' / theme / 'assets' / source_name
        with Image.open(source) as master:
            widths = [768, 1280, master.width] if name == 'hero' else [640, 1280]
            derivatives = []
            for width in widths:
                image = master.convert('RGB').resize((width, round(master.height * width / master.width)), Image.Resampling.LANCZOS)
                target = output / f'{name}-{width}.webp'
                image.save(target, 'WEBP', quality=86 if name == 'hero' else 80, method=6)
                derivatives.append({'file': str(target.relative_to(ROOT / 'frontend/public')), 'width': image.width,
                                    'height': image.height, 'bytes': target.stat().st_size})
            manifest[theme_id][name] = {'master': str(source.relative_to(ROOT)),
                                       'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                                       'derivatives': derivatives}
(ROOT / 'frontend/public/landing/asset-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('Prepared 45 derivatives; original masters preserved.')
print('Total optimized artwork bytes:', sum(d['bytes'] for t in manifest.values() for a in t.values() for d in a['derivatives']))
