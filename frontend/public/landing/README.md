# Landing artwork derivatives

Only selected standalone artwork is served from this directory. Composite mockups and superseded drafts remain design references outside `public`.

Rebuild from unchanged PNG masters with `python scripts/prepare_landing_art.py` (Pillow required). The manifest records source hashes, actual dimensions and byte sizes. Hero widths are 768, 1280 and 1672 pixels; supporting widths are 640 and 1280 pixels. WebP is served directly from the frontend CDN, with no runtime image transformation or backend call.

The landing bootstrap prioritizes only the selected hero. Supporting artwork is requested when its section approaches the viewport. Theme URLs in CSS variables do not themselves trigger requests.
