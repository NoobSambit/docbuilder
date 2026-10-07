# Tour illustration

`wind-landscape.webp` is an artwork-only crop (x=1225, y=292, 406×403) of the approved `design/landing-page-revamp/04-sabha/showcase-tour/mockups/04-present-v4.png`. No text, chrome, controls or complete chapter screenshot is included. All output page, slide and filmstrip content is native React/HTML. The same energy illustration accompanies all five palette variants.

Reproduce with ImageMagick:

```
convert design/landing-page-revamp/04-sabha/showcase-tour/mockups/04-present-v4.png -crop 406x403+1225+292 +repage -quality 92 frontend/public/landing/tour/wind-landscape.webp
```
