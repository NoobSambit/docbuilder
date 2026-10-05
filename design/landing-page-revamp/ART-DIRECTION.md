# Landing exploration — restrained mythology, dense product views

Design phase only. The logged-out product UI has not been rebuilt. The concepts assume the complete [product rebuild plan](../../docs/PRODUCT_REBUILD_PLAN.md) succeeds.

The user rejected all three completed early Akshara images. V1 looked like a cheap statue banner with oversized type; V2 and V4 made mythology too faint and left too much unused space. All remain in `rejected/`; none is a selected design. V3 was an interrupted/failed attempt and has no completed artifact.

## Current design contract

Round 8 supersedes the image-heavy round 7. The user rejected repeated mythology scenes in every feature tile and asked to focus on generating UI mockups. Font investigation and the native-prototype detour are stopped. The current deliverables are raster mockups generated with the built-in image tool.

- Proper laptop viewports, targeting 1920×1080 and 16:9. Record actual output dimensions, rather than calling an image 1920px without checking.
- Compact copy and useful density: roughly 44–48px marketing headings, 15–17px navigation/body, 14px application controls, 36–40px rows. Do not reduce everything to unreadable miniatures.
- One recognizable mythology scene belongs in the hero. Lower feature panels demonstrate the product through readable UI; they do not repeat character paintings. Artwork shows research, drafting or reviewing a presentation.
- Bold crop and layered painted scenes take inspiration from [Shopify Winter ’26 Renaissance Edition](https://www.shopify.com/editions/winter2026). Original artwork only; its assets and commerce content are not deliverables.
- The supplied Devin screenshots inform the compact product layout, broad workspace, varied feature previews and aligned lower-page grid.
- One substantial hero application begins around 40% of viewport height and occupies the lower half or more. It is the same application that expands and pins.
- Theme-colored topbars, outline rails and utility panes distinguish the workspaces. Astra uses teal/sage/copper; Akshara auburn/clay; Neel indigo/celadon; Sabha plum/lavender. Fine dividers and restrained corners keep these regions precise. The document stays a solid readable light paper surface.
- Mythological figures perform work related to the product: inspect sources, arrange an outline, draft or revise pages and prepare a slide storyboard. Contemporary writing laptops and report pages can live inside the epic painting. No weapons, war, chariot charge or armor narrative.
- Useful density comes from briefs, readable sections, inspected sources, reversible refinement, save state, version history and output previews. No invented dashboards, metrics or collaboration.
- Four separate landscape screenshots cover each direction. Do not squeeze the entire lower page into a tall presentation board.

## Four current directions

| Direction | Visible mythology | Palette and art medium |
| --- | --- | --- |
| Akshara | Ganesha and Vyasa research and draft in an atelier | Auburn, copper, clay; miniature-inspired gouache |
| Astra | Krishna guides Arjuna through sources and drafting | Teal, sage, copper; painterly writing scene |
| Neel | Krishna reads source material at a garden desk | Indigo, cobalt, celadon; Pichwai-inspired painting |
| Sabha | Saraswati reviews a presentation in a library | Plum, lavender, pearl; refined editorial fresco |

Themes retain the same feature story so comparisons concern the design rather than different product promises.

Vanam and prior versions remain archived; they are not counted in the current four-direction set. Each current direction has four separate laptop views: hero, expanded workspace, capabilities, and outputs/FAQ/close.

## Review gate

Inspect every generated screen. Reject or revise if the hero mythology is indistinct, character art repeats through the lower feature panels, the app is too small, empty bands dominate, text is unreadable, future features contradict the plan, the same container cannot plausibly expand, or lower-page story/outputs are missing.

“Reviewed concept” means the composition was inspected by the agent. It never means user approval, implementation proof, motion proof or responsive QA. Imagegen text imperfections are logged; implementation uses native HTML text and controls.

Generated sample report prose, dates and reference links are illustrative, not research evidence. Production fixtures must use verified sources. Actual image dimensions are recorded in the manifest; a requested 1920×1080 canvas is not claimed as the returned resolution.

## Files and regeneration

The exact round-8 prompts are recorded per image in `manifest.json`, which also tracks actual dimensions, hashes and review notes. Do not rerun `build_briefs.py` to regenerate current prompts: it describes the superseded round-7 image-heavy approach. `build_gallery.py` builds the current four-direction comparison gallery from reviewed entries. Older prompt and image versions remain available for history.

The live Devin browser request was declined; no alternative access was used. The user-provided screenshots supply that reference. Shopify Winter ’26 was inspected in the browser for its painted figure crops and image-led composition.
