# Landing exploration — restrained mythology, dense product views

Design phase only. The logged-out product UI has not been rebuilt. The concepts assume the complete [product rebuild plan](../../docs/PRODUCT_REBUILD_PLAN.md) succeeds.

The user rejected all three completed early Akshara images. V1 looked like a cheap statue banner with oversized type; V2 and V4 made mythology too faint and left too much unused space. All remain in `rejected/`; none is a selected design. V3 was an interrupted/failed attempt and has no completed artifact.

## Current design contract

The user accepted the round-8 heroes and rejected the dated container styling in the expanded workspace, capabilities and output views. Round 9 redesigns those three views in every theme. Round 10 adds character-free supporting background art to capabilities and outputs across all four themes, following the initial Sabha pair. Font investigation and the native-prototype detour remain stopped. The current deliverables are raster mockups generated with the built-in image tool.

- Proper laptop viewports, targeting 1920×1080 and 16:9. Record actual output dimensions, rather than calling an image 1920px without checking.
- Compact copy and useful density: modest outer headings, small software labels, 28–32px rows and icon actions, 36–40px application toolbars. Show useful content rather than enlarging every control. Preserve readable document text.
- One recognizable mythology scene belongs in the hero. Lower feature panels demonstrate the product through readable UI; they do not repeat character paintings. Artwork shows research, drafting or reviewing a presentation.
- Bold crop and layered painted scenes take inspiration from [Shopify Winter ’26 Renaissance Edition](https://www.shopify.com/editions/winter2026). Original artwork only; its assets and commerce content are not deliverables.
- The supplied Devin screenshots inform the compact product layout, broad workspace, varied feature previews and aligned lower-page grid.
- One substantial hero application begins around 40% of viewport height and occupies the lower half or more. It is the same application that expands and pins.
- Neutral compact application topbars, dark tonal outline rails and lightly tinted context panes replace broad colored banners. Astra uses teal/sage/copper; Akshara auburn/clay; Neel indigo/celadon; Sabha plum/lavender. Use quiet selected rows, small ghost actions, segmented controls, fine separators and restrained shadows. Avoid thick borders around every field or nested panel. The document stays a solid readable light paper surface.
- Capability previews are varied crops of real product UI: inline brief choices, a layered source inspector, sentence-level diff, a saved-version popover and paused section generation. They are not five full forms inside large bordered boxes. The logged-out page has horizontal navigation; no global dashboard sidebar or account avatar.
- Outputs lead with finished document pages and a 16:9 slide preview. A compact anchored export menu replaces giant format cards. FAQ is an open ruled list; the close is a horizontal page row rather than an isolated colored card.
- All four capability/output pairs carry original character-free background imagery behind their product previews. Capabilities use closer material and study crops; outputs use broader environments. Akshara uses manuscript desks and a warm sandstone atelier; Astra uses a lakeside research pavilion with teal/sage materials; Neel uses an indigo/celadon garden study with botanical details; Sabha uses archival books and a sunlit library alcove. These are distinct settings, not the same picture recolored. No characters or repeated hero scene. Opaque software surfaces, document pages and slide contents remain distinct from decorative art. Headings, captions, menus and FAQ sit on calm readable surfaces.
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

The accepted hero files are unchanged. The round-9 product chrome is a candidate for the working UI; implementation should carry it consistently into the hero's application inset and expanded stage while preserving the accepted hero composition and artwork.

Round 10 covers capabilities and outputs in all four directions. Heroes and expanded workspaces retain their existing revisions. Implement supporting art as separate decorative layers behind native UI, never by shipping these full mockup bitmaps as interactive controls or document contents. Individual background assets will be separated once a visual direction is selected.

## Review gate

Inspect every generated screen. Reject or revise if the hero mythology is indistinct, character art repeats through the lower feature panels, the app is too small, empty bands dominate, text is unreadable, future features contradict the plan, the same container cannot plausibly expand, or lower-page story/outputs are missing.

“Reviewed concept” means the composition was inspected by the agent. It never means user approval, implementation proof, motion proof or responsive QA. Imagegen text imperfections are logged; implementation uses native HTML text and controls.

Generated sample report prose, dates and reference links are illustrative, not research evidence. Production fixtures must use verified sources. Actual image dimensions are recorded in the manifest; a requested 1920×1080 canvas is not claimed as the returned resolution.

## Files and regeneration

The exact current prompts are recorded per image in `manifest.json`, which also tracks actual dimensions, hashes and review notes. `round-8-user-review.json` preserves the rejected lower-view metadata and accepted hero feedback. `round-9-rejected-candidates.json` records generated variants that invented dashboard navigation and were excluded. `round-9-background-art-request.json` preserves the initial Sabha pair before its background revision. `round-10-background-art-expansion.json` preserves the other six baseline entries plus hashes for the ten screens protected during that extension. `round-10-layout-rejected-candidates.json` records drafts excluded for enclosing frames, missing captions or a duplicated wordmark; exact correction prompts and generation chains remain in the manifest. Do not rerun `build_briefs.py` to regenerate current prompts: it describes the superseded round-7 approach. `build_gallery.py` builds the current four-direction comparison gallery. Older prompt and image versions remain available for history.

The live Devin browser request was declined; no alternative access was used. The user-provided screenshots supply that reference. Shopify Winter ’26 was inspected in the browser for its painted figure crops and image-led composition.
