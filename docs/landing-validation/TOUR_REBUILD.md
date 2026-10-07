# Expanded product tour — implementation evidence

Scope: expanding/pinned landing container only; baseline `47d2f34`. Seven local implementation checkpoints; no push/deploy. Both Vercel configs retain `git.deploymentEnabled: false`. No browser tests, screenshot capture or visual-diff sessions are authorized for this rebuild. Visual acceptance belongs to the user.

## Reference measurement map (before implementation)

Measured from the four selected 1672 × 941 PNGs at original resolution. Coordinates are image pixels, not generation-prompt estimates. Native sans-serif glyph measurements are approximate; geometry is directly observable.

| Region | Brief | Research | Refine | Present |
| --- | --- | --- | --- | --- |
| Projectbar / track | y=0–60 / 61–124 | same | 0–60 / 61–122 | same |
| Narration | x=54, title y=137, support y=193 | x=51, same | x=53, title y=135, support y=183 | x=54, same |
| Working area | y=234–941 | y=234–941 | y=218–941 | regions y=228–846 |
| Pane boundaries | x=5–496 / 501–1239 / 1244–1669 | x=7–475 / 481–1184 / 1190–1668 | x=7–494 / 500–1239 / 1244–1669 | x=27–784 / 802–1645 |
| Gutters / pane radii | 5–6px / 6px | 6px / 6px | 6px / 6px | 18px / 6px |
| Internal padding | rail 30px; outline 16px; inspector 21px | rail 24px; editor 25px; inspector 23px | rail 27px; editor 25px; inspector 21px | header 22px; report 62px; deck 14px |

- Brand: 26px bold, 36px book icon, x=48. Project: 20px medium, centered. Restart: 163×44px, x=1471, y=10; border/radius 1px/8px.
- Track: four roughly 290–330px slots; numbers 26px, labels 23px, active 650 weight and 3px underline. Completed markers 28px circles. Continue hint right-aligned, 18px with thin divider.
- Narration: heading 42–44px / 1.15, weight 700; support 24px / 1.3. Brief/Research band 110px, Refine 96px, Present 106px.
- Pane headings: 28–30px / 1.2, weight 650–700. Body/input/outline labels 18px / 1.45, secondary text 16px / 1.45. Selected-section heading 24px. No serif in app chrome.
- Controls: selects/inputs 42–44px; goal 68px; guidance 76px; primary actions 46–49px. Padding 12–16px, radius 5–6px; Lucide 20–24px aligned centrally. Outline add 143×40px. Toolbar icons 22px in 42px targets.
- Brief outline: selected row x=516, y=299, w=709, h=155; first two sections expanded. Remaining rows ~73px, fine dividers; 42px numbered navigation circles; 18px bullet indentation. Inspector subsection rows 44px, 5px gaps.
- Research: source rows y=323/395, h=65, 8px gap; selected dusty-mulberry fill, white text. Citation selection x=501,y=393,w=646,h=63; connector from inline [2] to selected source row, 1.5px plum line. Draft table ~651×108px.
- Refine: toolbar y=276,h=49; pending diff x=524,y=376,w=694,h=193, 14px inset. Original 64px red wash with strike-through, suggested 44px sage wash. Inspector suggestion controls y=565,h=42; linked source 86px; disclosures 38px.
- Sabha surfaces: pearl shell (~#f7f4f8), ivory editor (~#fffdfa), dark aubergine rail (~#3f2b3e), pale lavender inspector (~#eee8f1), dusty mulberry selection (~#926487). Ink nearly navy (~#17152e), muted lavender (~#666080), thin lavender-gray borders; restrained shadow only for paper/menu.
- Present: document area ~757px; visible portrait page x=64–636,y=294 onward, width ~572px with 46px interior margin; page stack behind. Document title 46px serif, report section 28px serif, prose 18px/1.3. Menu x=555,y=281,w=210,h=184; four 44px items. Slide x=816–1632,y=291–697 in raster; logical implementation must be 16:9 (816×459), not this raster crop. Half title / half artwork; title ~62px serif. Filmstrip y=708, four 164×91 thumbnails, 12px gaps, 3px active ring; paging 116px. Completion bar y=888–941, action 220×42px.

## Construction boundaries

`Workspace` is imported only by `LandingPage`; `Brand`, `BriefPreview`, `SourcePreview`, `RefinePreview`, `HistoryPreview`, `GenerationPreview`, `DocumentPaper`, `SlidePreview` and `EnergyIllustration` are also consumed by lower sections. Expanded tour uses separate scoped component/CSS; legacy helper geometry stays unchanged. Shared fixture/hooks supply local state.

Radix Select and Dropdown Menu are the primary primitive approach, fully restyled. Registry verified MIT licenses and React/ReactDOM peers `^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc`; installed React is 18.2.0. No Next/Tailwind peer requirements or stack upgrade. Sources: https://www.radix-ui.com/primitives/docs/components/select, https://www.radix-ui.com/primitives/docs/components/dropdown-menu, https://github.com/radix-ui/primitives/blob/main/LICENSE.

## Delivered source and requirement audit

| Requirement | Current implementation evidence |
| --- | --- |
| Persistent projectbar / Brief–Research–Refine–Present track / narration | `Tour.tsx` keeps header/navigation mounted while stage bodies change; `Tour.module.css` uses 60px + 64px chrome and 110/110/94/104px narration bands. |
| Measured stage-specific pane geometry | Shared CSS uses Brief 29.7/44.6/25.7, Research 28.38/42.63/28.99, Refine 29.5/44.75/25.75 ratios with 5–6px gutters. Present uses 47.3/52.7 output regions. No whole-application scaling. |
| Editable brief and five-section outline | `BriefComposer`, `BriefOutline`, `SectionInspector`: goal, audience, tone, length, starter; expanded details; local heading/guidance/subsection editing; up to eight sections and six subsections. Dnd-kit pointer/keyboard sorting retains section identity/selection. |
| Brief contains an outline, with no finished report or duplicate tree | Brief body mounts only composer + outline editor + selected-section inspector. Legacy capability preview helpers stay outside this branch. |
| Research draft and exactly two evidence records | `TourDraft.tsx` carries the outline into navigation, formats/edits current paragraph, includes/excludes and inspects fixture records. Add source opens the same two-record sample library, never creates a third source. |
| Citation-to-source connection | Citation buttons inspect their matching record; connector measures actual buttons and rows and updates on resize, pane scroll, font load and draft mutation. Narrow layouts use citation-to-inspector navigation. |
| Main-editor pending diff, Accept / Discard, source [2] and original preservation | `InlineSuggestion` + `RefineInspector` use the exact storyboard pair. `useDemo` keeps the original, approval state, editor undo/redo and local checkpoint snapshots. Accept/Discard button tests prove the resulting portrait report keeps [2]. |
| Separate portrait report and logical 16:9 presentation | `TourPresent.tsx` renders a scrollable native report with contents/references, a distinct six-slide deck, four native thumbnails and previous/next paging. `slideViewport` explicitly uses `aspect-ratio: 16 / 9`. |
| DOCX / Markdown / HTML / browser print / PPTX | Restyled Radix menus use the existing valid sample paths. Prepared files were rebuilt from the canonical fixture with accepted wording; exports explicitly identify prepared files and local-preview differences. |
| Shared local deterministic state; restart preserves theme | All stages receive one `useDemo` instance. No fetch/provider/project persistence imports. Restart clears sample edits, source inclusion, approval, formatting, slide, timers and history; visit/theme state is separate and untouched. |
| All five themes, with one implementation | `themes.ts` supplies 15 scoped tour tokens per existing theme. Geometry, type, stages and behavior are shared. Original landing tokens/crops and visit selector are unchanged. |
| Reversible scroll / chapter navigation / release | `LandingPage.tsx` preserves the existing 0.8-viewport expansion and 0.825-viewport chapter pacing. Buttons use native scroll positions. The stable Workspace root remains mounted; Present releases to existing capabilities. Local query bootstrap adds deterministic review links. |
| Readable responsive source / keyboard / reduced motion | Below 1000px, chapter/pane controls choose one readable pane; Present stacks outputs and retains 16:9. Below 600px, slide body text sits in a readable transcript beneath the logical slide rather than being squeezed into the frame. Narrow controls use 44px targets. Short/reduced-motion views use a normal-flow tour. Radix manages popup keyboard/focus behavior; drag handles support keyboard sorting; native disclosures, explicit labels and focus styles remain. |
| Preserve other landing/product surfaces | Diff against `47d2f34` confirms no changes to `LowerSections.tsx`, its CSS, `visit.ts`, global styles, pages, context/auth, backend, original hero art or either Vercel config. Shared helper data follows the approved fixture; helper layout styles remain unchanged except the new scoped outer tour class. |
| Seven local checkpoints; no push/deploy | First six: `bf2cffc`, `42e1590`, `11d398c`, `7a05571`, `ddab375`, `8ea3d79`. The final evidence/polish commit is HEAD after this report is committed; use `git log 47d2f34..HEAD --oneline --reverse` for all seven IDs. No push, deployment or browser command was run. |

## Actual non-browser checks — 7 October 2026

- `cd frontend && DOCBUILDER_BUILD_DIR=.next-tour npm run build`: PASS. Next 13.4.4 built all eight pages, including unchanged auth/product routes. Build emitted existing stale Browserslist/baseline-data notices; no stack upgrade was made.
- `cd frontend && npm run lint`: PASS, zero warnings/errors.
- `cd frontend && npx tsc --noEmit --incremental false`: PASS.
- `cd frontend && npm run test:tour`: PASS, 19 tests in the existing Jest/jsdom harness. Covers brief/outline editing and identity, adding/reordering, source inclusion, pending/accepted/discarded wording, original/undo/redo, checkpoint restore, restart/theme isolation, local playback, all theme tokens; actual rendered React state tests exercise Accept/Discard → report, source context and deck paging. These are non-browser state tests, with no layout/viewport assertions.
- `git diff --check`: PASS.
- Prepared artifact inspection: DOCX/PPTX ZIP integrity and all XML parse; DOCX has accepted sentence and both source hyperlink relationships; PPTX has six slides and 16:9 geometry; Markdown/HTML contain accepted wording and both source URLs. Browser print keeps the existing `?print=1` reading-view mechanism.
- Installed compatibility: React/ReactDOM 18.2.0, Next 13.4.4 and Tailwind 3.3.2 remain unchanged. Radix Select 2.3.8 / Dropdown Menu 2.1.25 installed without peer conflicts.
- Color calculation (source tokens, not rendered/a11y-browser verification): body text ranges 12.44–17.60:1; muted text/context 4.62–4.92:1; light text/selected surfaces 4.56–5.40:1; light text/accent actions 7.18–8.23:1.
- Both Vercel `git.deploymentEnabled` values are still `false`.

## Local visual review

Run:

```sh
cd /home/noobsambit/Documents/docbuilder/frontend
npm run dev -- --port 3101
```

Use the original 1672 × 941 reference size for the user's visual comparison. The landing theme parameter uses the existing deterministic override. `tourChapter` enters the requested stage with native scroll; `tourEdit=accepted` initializes the approved local sample state for Present. Native navigation into Present without approval retains the original wording. `tourEdit=discarded` permits explicit original-state review. Invalid chapter/edit values are ignored. Restart clears preview state and returns to Brief without changing the selected artwork/theme.

| Theme | Brief | Research | Refine (pending) | Present (accepted sample) |
| --- | --- | --- | --- | --- |
| Akshara | [Brief](http://localhost:3101/?landingTheme=akshara&tourChapter=brief) | [Research](http://localhost:3101/?landingTheme=akshara&tourChapter=research) | [Refine](http://localhost:3101/?landingTheme=akshara&tourChapter=refine) | [Present](http://localhost:3101/?landingTheme=akshara&tourChapter=present&tourEdit=accepted) |
| Astra | [Brief](http://localhost:3101/?landingTheme=astra&tourChapter=brief) | [Research](http://localhost:3101/?landingTheme=astra&tourChapter=research) | [Refine](http://localhost:3101/?landingTheme=astra&tourChapter=refine) | [Present](http://localhost:3101/?landingTheme=astra&tourChapter=present&tourEdit=accepted) |
| Neel | [Brief](http://localhost:3101/?landingTheme=neel&tourChapter=brief) | [Research](http://localhost:3101/?landingTheme=neel&tourChapter=research) | [Refine](http://localhost:3101/?landingTheme=neel&tourChapter=refine) | [Present](http://localhost:3101/?landingTheme=neel&tourChapter=present&tourEdit=accepted) |
| Sabha | [Brief](http://localhost:3101/?landingTheme=sabha&tourChapter=brief) | [Research](http://localhost:3101/?landingTheme=sabha&tourChapter=research) | [Refine](http://localhost:3101/?landingTheme=sabha&tourChapter=refine) | [Present](http://localhost:3101/?landingTheme=sabha&tourChapter=present&tourEdit=accepted) |
| Vanam | [Brief](http://localhost:3101/?landingTheme=vanam&tourChapter=brief) | [Research](http://localhost:3101/?landingTheme=vanam&tourChapter=research) | [Refine](http://localhost:3101/?landingTheme=vanam&tourChapter=refine) | [Present](http://localhost:3101/?landingTheme=vanam&tourChapter=present&tourEdit=accepted) |

## Material limits and visual acceptance

No browser automation, screenshots, viewport-testing sessions, visual diff, Lighthouse or browser QA agents were used. Reference inspection/measurement and the source/state gates support implementation delivery; they do not prove browser-verified pixel perfection. Font rasterization, pane scrolling, responsive rendering and the live connector remain for the user's visual review.

The local suggestion is the prepared storyboard edit, not an AI response to arbitrary instructions. The toolbar formats the current section paragraph. Prepared downloads are static reviewed examples; arbitrary preview text, outline ordering, formatting and theme edits do not change them. The prepared PPTX retains an editable schematic illustration. Secondary slide artwork comes from small reference thumbnail crops and will look softer when enlarged in the full-slide viewport; the cover uses the larger approved artwork crop.
