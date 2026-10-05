# Landing exploration — dense epic direction

Design phase only. The logged-out product UI has not been rebuilt. The concepts assume the complete [product rebuild plan](../../docs/PRODUCT_REBUILD_PLAN.md) succeeds.

The user rejected all three completed early Akshara images. V1 looked like a cheap statue banner with oversized type; V2 and V4 made mythology too faint and left too much unused space. All remain in `rejected/`; none is a selected design. V3 was an interrupted/failed attempt and has no completed artifact.

## Current design contract

- Proper laptop viewports, targeting 1920×1080 and 16:9. Record actual output dimensions, rather than calling an image 1920px without checking.
- Compact copy and useful density: roughly 44–48px marketing headings, 15–17px navigation/body, 14px application controls, 36–40px rows. Do not reduce everything to unreadable miniatures.
- Recognizable Indian mythology carries the art direction. Figures are substantial, with a clear epic scene, rich painted materials and multiple coherent image crops.
- Bold crop and layered painted scenes take inspiration from [Shopify Winter ’26 Renaissance Edition](https://www.shopify.com/editions/winter2026). Original artwork only; its assets and commerce content are not deliverables.
- The supplied Devin screenshots inform the compact product layout, broad workspace, varied feature previews and aligned lower-page grid.
- One substantial hero application begins around 40% of viewport height and occupies the lower half or more. It is the same application that expands and pins.
- Theme-colored topbars, sidebars, utility panes and tinted paper distinguish the workspaces. Dark Astra uses slate/copper with blue-gray paper; other directions use coordinated sand, blue/teal, lavender/plum and sage/forest surfaces. Fine dividers and restrained corners keep the colored regions precise. Art remains outside working prose.
- Mythological figures perform work related to the product: inspect sources, arrange an outline, draft or revise pages and prepare a slide storyboard. Contemporary writing laptops and report pages can live inside the epic painting. No weapons, war, chariot charge or armor narrative.
- Useful density comes from briefs, readable sections, inspected sources, reversible refinement, save state, version history and output previews. No invented dashboards, metrics or collaboration.
- Four separate landscape screenshots cover each direction. Do not squeeze the entire lower page into a tall presentation board.

## Five distinct painted worlds

| Direction | Visible mythology | Palette and art medium |
| --- | --- | --- |
| Akshara | Ganesha writes while Vyasa dictates | Ivory, ink, vermilion; richly textured epic oil painting |
| Astra | Krishna guides Arjuna through sources and drafting at a desk | Midnight, slate, copper; epic writing-studio painting |
| Neel | Krishna researches and arranges report pages in a garden | Blue, teal, cobalt; detailed Pichwai-inspired painting |
| Sabha | Epic palace assembly with Krishna and scribes | Limestone, plum; intricate miniature gouache |
| Vanam | Vyasa and Krishna beneath a banyan | Celadon, forest; refined Kerala-mural-inspired painting |

Themes retain the same feature story so comparisons concern the design rather than different product promises.

## Review gate

Inspect every generated screen. Reject or revise if mythology is indistinct at thumbnail size, the app is too small, empty bands dominate, text is unreadable, component geometry drifts, future features contradict the plan, the same container cannot plausibly expand, or lower-page story/outputs are missing.

“Reviewed concept” means the composition was inspected by the agent. It never means user approval, implementation proof, motion proof or responsive QA. Imagegen text imperfections are logged; implementation uses native HTML text and controls.

## Files and regeneration

`build_briefs.py` generates the current twenty prompts while preserving review metadata. `manifest.json` tracks actual assets, dimensions and review status. `retired-screen-manifest.json` retains earlier tall-screen metadata. Old rejected edit prompts are historical; the four current screen stems are authoritative.

The live Devin browser request was declined; no alternative access was used. The user-provided screenshots supply that reference. Shopify Winter ’26 was inspected in the browser for its painted figure crops and image-led composition.
