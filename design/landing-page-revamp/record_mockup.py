"""Persist one generated concept and its provenance. No runtime changes."""
from pathlib import Path
import argparse, hashlib, json, shutil
from PIL import Image

ROOT=Path(__file__).resolve().parent
parser=argparse.ArgumentParser()
parser.add_argument("theme")
parser.add_argument("screen")
parser.add_argument("source")
parser.add_argument("--prompt",required=True)
parser.add_argument("--review",required=True)
parser.add_argument("--status",choices=["concept-reviewed","revision-needed"],default="concept-reviewed")
parser.add_argument("--output")
args=parser.parse_args()
source=Path(args.source).resolve()
manifest_path=ROOT/"manifest.json"
manifest=json.loads(manifest_path.read_text())
item=next(x for x in manifest if x["theme"]==args.theme and x["screen"]==args.screen)
prompt=ROOT/args.prompt
if not prompt.is_file():
    raise SystemExit(f"Missing exact prompt: {prompt}")
with Image.open(source) as im:
    width,height=im.size
if abs(width/height-16/9)>0.015:
    raise SystemExit(f"Not a laptop 16:9 viewport: {width}x{height}")
output=ROOT/(args.output or f"{args.theme}/mockups/{args.screen}.png")
if output.exists():
    raise SystemExit(f"Do not overwrite a concept: {output}")
output.parent.mkdir(parents=True,exist_ok=True)
shutil.copy2(source,output)
item.update(output=str(output.relative_to(ROOT)),source=str(source),prompt=args.prompt,
    prompt_sha256=hashlib.sha256(prompt.read_bytes()).hexdigest(),
    image_sha256=hashlib.sha256(output.read_bytes()).hexdigest(),
    dimensions=[width,height],aspect_ratio=round(width/height,5),
    status=args.status,review=args.review,reviewed_by="agent",user_approval="pending review")
manifest_path.write_text(json.dumps(manifest,indent=2)+"\n")
print(json.dumps({"theme":args.theme,"screen":args.screen,"output":str(output),"dimensions":[width,height],"status":args.status}))
