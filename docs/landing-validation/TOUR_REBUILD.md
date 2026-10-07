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
