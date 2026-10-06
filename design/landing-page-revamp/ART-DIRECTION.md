# Landing exploration — full-page mythology, dense product views

Design phase only. The logged-out product UI has not been rebuilt. The concepts assume the complete [product rebuild plan](../../docs/PRODUCT_REBUILD_PLAN.md) succeeds.

The user rejected all three completed early Akshara images. V1 looked like a cheap statue banner with oversized type; V2 and V4 made mythology too faint and left too much unused space. All remain in `rejected/`; none is a selected design. V3 was an interrupted/failed attempt and has no completed artifact.

## Current design contract

The user's latest selection is **hero v7 for all five themes**. This supersedes the v8 hero interpretation and the earlier sparse standalone portrait crops. Preserve each v7 subject world and palette, use the approved refined painterly finish, and paint the entire hero page. Main figures and working gestures belong in the upper 40–50%, above the later wide native workspace. The completed standalone selection is [twenty artwork assets](assets/README.md), with detailed prompts and review notes. The existing lower assets for four themes are retained; Vanam now has a matching set. Font investigation and native-prototype testing remain stopped.

- Proper laptop viewports, targeting 1920×1080 and 16:9. Record actual output dimensions, rather than calling an image 1920px without checking.
- Compact copy and useful density: modest outer headings, small software labels, 28–32px rows and icon actions, 36–40px application toolbars. Show useful content rather than enlarging every control. Preserve readable document text.
- One recognizable mythology working scene belongs in the full-page hero background. Lower feature panels demonstrate the product through readable UI; they do not repeat character paintings. Artwork shows research, drafting or reviewing a presentation.
- Bold crop and layered painted scenes take inspiration from [Shopify Winter ’26 Renaissance Edition](https://www.shopify.com/editions/winter2026). Original artwork only; its assets and commerce content are not deliverables.
- The supplied Devin screenshots inform the compact product layout, broad workspace, varied feature previews and aligned lower-page grid.
- One substantial hero application begins within the 40–50% height region and occupies the lower half or more. It is the same application that expands and pins. Position the selected full-page artwork so focal faces and working hands remain visible; supporting scenery continues through the gutters and beneath the workspace.
- Neutral compact application topbars, dark tonal outline rails and lightly tinted context panes replace broad colored banners. Astra uses teal/sage/copper; Akshara auburn/clay; Neel indigo/celadon; Sabha plum/lavender. Use quiet selected rows, small ghost actions, segmented controls, fine separators and restrained shadows. Avoid thick borders around every field or nested panel. The document stays a solid readable light paper surface.
- Capability previews are varied crops of real product UI: inline brief choices, a layered source inspector, sentence-level diff, a saved-version popover and paused section generation. They are not five full forms inside large bordered boxes. The logged-out page has horizontal navigation; no global dashboard sidebar or account avatar.
- Outputs lead with finished document pages and a 16:9 slide preview. A compact anchored export menu replaces giant format cards. FAQ is an open ruled list; the close is a horizontal page row rather than an isolated colored card.
- All four capability/output pairs carry original character-free background imagery behind their product previews. Capabilities use closer material and study crops; outputs use broader environments. Akshara uses manuscript desks and a warm sandstone atelier; Astra uses a lakeside research pavilion with teal/sage materials; Neel uses an indigo/celadon garden study with botanical details; Sabha uses archival books and a sunlit library alcove. These are distinct settings, not the same picture recolored. No characters or repeated hero scene. Opaque software surfaces, document pages and slide contents remain distinct from decorative art. Headings, captions, menus and FAQ sit on calm readable surfaces.
- Mythological figures perform work related to the product: inspect sources, arrange an outline, draft or revise pages and prepare a slide storyboard. Contemporary writing laptops and report pages can live inside the epic painting. No weapons, war, chariot charge or armor narrative.
- Useful density comes from briefs, readable sections, inspected sources, reversible refinement, save state, version history and output previews. No invented dashboards, metrics or collaboration.
- Four separate landscape screenshots cover each direction. Do not squeeze the entire lower page into a tall presentation board.

## Five current hero selections

| Direction | Visible mythology | Palette and art medium |
| --- | --- | --- |
| Akshara | V7 Ganesha and Vyasa draft/review in a river pavilion | Vermilion, saffron, ivory, indigo and antique gold; matte painterly finish |
| Astra | V7 Krishna guides Arjuna through sources and drafting | Midnight navy, blue-gray, copper, lapis and rust-red; dark left copy region |
| Neel | V7 Krishna reviews sources with cows and peacocks in a botanical garden | Cream, indigo/lapis, yellow/ochre, green and pale pink; fine botanical painting |
| Sabha | V7 scribe, princely scholars, Krishna and elder form a working assembly | Limestone, plum/aubergine, verdigris, lapis and saffron; ordered architectural painting |
| Vanam | V7 Vyasa and Krishna work under a banyan beside the river | Celadon, forest/emerald, ochre, burnt orange and brass; refined botanical painting |

Themes retain the same feature story so comparisons concern the design rather than different product promises.

Vanam is now included in the five-theme standalone asset selection. The earlier four-direction composite gallery remains a record of the previous UI exploration; it is not the authority for the current hero choice. All five v7 reference screenshots remain preserved. New standalone images are listed in `assets/README.md`.

Existing composite mockups are unchanged. Use the v7 hero's full-page structure and colors with deliberate native controls when implementation starts; do not silently return to the v8 top-right crop, change Sabha back to Saraswati or omit Vanam.

Round 10 covers capabilities and outputs in four composite directions. The subsequent asset pass supplies separate hero, capabilities, archive-detail and outputs images for all five themes. Implement them as decorative layers behind native UI, never by shipping full mockup bitmaps as interactive controls or document contents. No runtime implementation or HTML/Python testing was performed in this artwork pass.

## Review gate

Inspect every generated screen. Reject or revise if the hero mythology is indistinct, character art repeats through the lower feature panels, the app is too small, empty bands dominate, text is unreadable, future features contradict the plan, the same container cannot plausibly expand, or lower-page story/outputs are missing.

“Reviewed concept” means the composition was inspected by the agent. It never means user approval, implementation proof, motion proof or responsive QA. Imagegen text imperfections are logged; implementation uses native HTML text and controls.

Generated sample report prose, dates and reference links are illustrative, not research evidence. Production fixtures must use verified sources. Actual image dimensions are recorded in the manifest; a requested 1920×1080 canvas is not claimed as the returned resolution.

## Files and regeneration

The composite mockups' earlier prompts, dimensions and review records remain in `manifest.json` and round-review files. The **current standalone artwork and v7 hero selection** are recorded in `assets/README.md` and `assets/ASSET-PLAN.md`; that selection overrides prior v8 hero-approval metadata. Every selected asset links to its detailed prompt, and superseded standalone hero crops are kept as drafts. Do not rerun `build_briefs.py` to regenerate these assets: it describes an earlier composite approach. `build_gallery.py` reproduces the previous four-direction composite gallery, not the new standalone selection.

The live Devin browser request was declined; no alternative access was used. The user-provided screenshots supply that reference. Shopify Winter ’26 was inspected in the browser for its painted figure crops and image-led composition.
