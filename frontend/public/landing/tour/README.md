# Tour illustration

`wind-landscape.webp` is an artwork-only crop (x=1225, y=292, 406×403) of the approved `design/landing-page-revamp/04-sabha/showcase-tour/mockups/04-present-v4.png`. No text, chrome, controls or complete chapter screenshot is included. All output page, slide and filmstrip content is native React/HTML. The same energy illustration accompanies all five palette variants.

Reproduce with ImageMagick:

```
convert design/landing-page-revamp/04-sabha/showcase-tour/mockups/04-present-v4.png -crop 406x403+1225+292 +repage -quality 92 frontend/public/landing/tour/wind-landscape.webp
```

Secondary illustration crops from the same approved frame retain the thumbnail artwork: `market-landscape.webp` (1082,710; 73×87), `storage-landscape.webp` (1264,710; 67×87), `risks-landscape.webp` (1440,710; 64×87). These contain only art. Their source resolution is suitable for the reference-sized filmstrip; full-slide viewing enlarges these small reference illustrations. No new mockups or artwork were generated.
