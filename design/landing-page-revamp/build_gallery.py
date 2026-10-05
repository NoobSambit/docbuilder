"""Build an offline comparison gallery from inspected concepts."""
from pathlib import Path
from html import escape
import json
THEMES = [
    {"id": "01-akshara", "name": "Akshara · The epic scribe", "thesis": "Miniature authorship artwork; auburn, copper and clay workspace."},
    {"id": "02-astra", "name": "Astra · The guided draft", "thesis": "One Krishna-Arjuna research scene; teal, sage and copper workspace."},
    {"id": "03-neel", "name": "Neel · The story garden", "thesis": "Pichwai-inspired scholarly garden; indigo and celadon workspace."},
    {"id": "04-sabha", "name": "Sabha · The scholarly library", "thesis": "Saraswati reviewing a presentation; plum and lavender workspace."},
]

ROOT=Path(__file__).resolve().parent
items=json.loads((ROOT/"manifest.json").read_text())
screens={"01-hero":"Hero","02-scroll-showcase":"Expanded showcase",
         "03-capabilities":"Capabilities","04-outputs-close":"Outputs and close"}
sections=[]
count=0
for theme in THEMES:
    cards=[]
    for item in (x for x in items if x["theme"]==theme["id"]):
        if item.get("status")!="concept-reviewed":
            continue
        image=ROOT/item["output"]
        if not image.is_file():
            raise SystemExit(f"Missing gallery image: {image}")
        prompt=ROOT/item["prompt"]
        if not prompt.is_file():
            raise SystemExit(f"Missing exact prompt: {prompt}")
        width,height=item["dimensions"]
        title=screens[item["screen"]]
        cards.append(f'<article><a class="image" href="{escape(item["output"],quote=True)}" target="_blank" rel="noopener" aria-label="Open {escape(theme["name"])} {escape(title)} at native size"><img src="{escape(item["output"],quote=True)}" alt="{escape(theme["name"])} — {escape(title)} future-state concept" width="{width}" height="{height}" loading="lazy"></a><div class="caption"><h3>{escape(title)}</h3><span>{width} × {height}</span><a href="{escape(item["prompt"],quote=True)}">Exact prompt</a></div><details><summary>Review notes</summary><p>{escape(item["review"])}</p></details></article>')
        count+=1
    sections.append(f'<section id="{theme["id"]}"><div class="section-title"><h2>{escape(theme["name"])}</h2><p>{escape(theme["thesis"])}</p></div><div class="screens">{"".join(cards) if cards else "<p>Current revision is generating.</p>"}</div></section>')
nav="".join(f'<a href="#{t["id"]}">{escape(t["name"].split(" · ")[0])}</a>' for t in THEMES)
page='''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DocBuilder — epic authorship concepts</title>
<style>
:root{color-scheme:dark;background:#171819;color:#ededeb;font-family:Inter,Arial,sans-serif}*{box-sizing:border-box}body{margin:0}a{color:#c8dbff;text-underline-offset:4px}a:focus-visible,summary:focus-visible{outline:3px solid #8eb8ff;outline-offset:5px}header,main{max-width:1820px;margin:auto;padding:32px}header{border-bottom:1px solid #383a3b}header h1{font-size:28px;font-weight:600;letter-spacing:-.7px;margin:0 0 12px}header p{max-width:940px;font-size:15px;line-height:1.6;color:#b6bbbd;margin:6px 0}nav{display:flex;flex-wrap:wrap;gap:12px 26px;margin-top:22px}nav a{font-size:14px}section{scroll-margin-top:22px;margin-bottom:60px}.section-title{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:16px}h2{font-size:22px;letter-spacing:-.4px;margin:0}.section-title p{font-size:14px;color:#b6bbbd;margin:0;max-width:760px;line-height:1.5}.screens{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}article{border:1px solid #373a3c;background:#202223;overflow:hidden;border-radius:6px}a.image{display:block}img{display:block;width:100%;height:auto;background:#111}.caption{display:flex;align-items:center;gap:16px;padding:14px 16px;font-size:12px;color:#b6bbbd}.caption h3{font-size:15px;font-weight:500;color:#ededeb;margin:0 auto 0 0}.caption a{white-space:nowrap}details{padding:0 16px 14px;font-size:13px;color:#b6bbbd}summary{cursor:pointer}details p{line-height:1.6;margin:12px 0 0}footer{border-top:1px solid #383a3b;margin-top:32px;padding:24px 0;font-size:13px;color:#a9b0b3}@media(max-width:800px){header,main{padding:22px 16px}.screens{grid-template-columns:1fr}.caption{flex-wrap:wrap}.section-title{display:block}.section-title p{margin-top:8px}header h1{font-size:24px}}
</style></head><body><header><h1>DocBuilder — epic authorship concepts</h1><p>Four visual directions. One mythology scene in each hero, colored workspaces and product-only feature previews. Click any image to inspect its native laptop viewport.</p><p>Future-state concepts assume the product rebuild succeeds. Reviewed by the agent; awaiting your design feedback. These images do not demonstrate implemented UI or scrolling.</p><p>''' + str(count) + ''' inspected screens · <a href="ART-DIRECTION.md">Art direction</a> · <a href="SCROLL-STORY.md">Scroll sequence</a> · <a href="FUTURE-STATE-CONTRACT.md">Product scope</a></p><nav aria-label="Design directions">''' + nav + '''</nav></header><main>''' + "".join(sections) + '''<footer>Built-in image generation. Actual dimensions and exact prompts are recorded for every concept. Earlier sparse, oversized, war-scene and repeated-art attempts remain archived and are excluded from this gallery.</footer></main></body></html>'''
(ROOT/"gallery.html").write_text(page)
print(json.dumps({"gallery":str(ROOT/"gallery.html"),"screens":count}))
