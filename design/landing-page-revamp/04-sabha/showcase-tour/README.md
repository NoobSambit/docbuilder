# Sabha — four guided scroll-showcase mockups

Selected after direct visual review. These replace the single refinement-only reference for the **Sabha pinned container**. Scope is mockups and handoff notes; runtime code, other themes, heroes and lower landing sections are unchanged.

The user's latest correction keeps the existing laptop dimensions and asks for a denser design. Each selected image is **1672 × 941**, approximately 16:9. Useful working panes fill most of the container; a clear active chapter, headline and focal action explain the product tour.

| Stage | Selected mockup | What the visitor understands | Exact final prompt |
| --- | --- | --- | --- |
| 01 Brief | [Open full size](mockups/01-brief-v3.png) | A concrete goal and brief produce an editable section/subsection plan. | [Structure cleanup](prompts/01-brief-v3-structure-cleanup.txt) |
| 02 Research | [Open full size](mockups/02-research-v3.png) | Included evidence is connected to a selected citation in the draft. | [Chapter-track correction](prompts/02-research-v3-track-fix.txt) |
| 03 Refine | [Open full size](mockups/03-refine-v4.png) | A concise instruction produces a pending inline edit; the user chooses Accept or Discard. | [Source-label correction](prompts/03-refine-v4-source-label.txt) |
| 04 Present | [Open full size](mockups/04-present-v4.png) | Reviewed work is previewed as distinct document/presentation examples with the correct exports. | [Slide/filmstrip correction](prompts/04-present-v4-slide-proportion.txt) |

## Review and corrections

- **Brief:** rejected the first oversized two-card form for sparse density. Added a dark brief composer, expanded outline sections and a real selected-section inspector. Removed a duplicate outline-tree preview; useful subsection detail fills that space instead. All five section names and the selected Executive summary remain consistent.
- **Research:** selected a dense editor/source relationship with an explicit [2] → Energy Storage connection. Restored the dropped Present chapter. Both sources and their publishers are visible and correctly spaced.
- **Refine:** moved the pending red/green edit into the main document. Replaced the repeated brief form with the carried-forward outline, corrected the accidental third source to two, retained [2] in both alternatives and corrected Energy Storage spacing. The state remains pending, with an explicit original-preservation note.
- **Present:** retained the accepted shorter sentence and corrected the bibliography to Renewables 2025 / IEA and Energy Storage / US Department of Energy. Removed invented contents-page numbers and redundant options. Enlarged the slide and kept four thumbnails/paging in one compact filmstrip. Output examples are separate, with DOCX/Markdown/HTML/Browser print and PPTX kept distinct.

The selected frames have the same project, five-section structure, two source records, palette and outer tour grammar. Each stage's main body changes visibly rather than leaving a large paper sheet unchanged and switching a small tab.

## Container-only implementation handoff

1. Keep the outer projectbar and four-chapter track mounted. Use concise, readable narration and give the body most of the available viewport.
2. Brief: input → generated outline → editable section details. Do not show a finished report yet.
3. Research: the outline becomes navigation; draft prose appears with citations and a source inspector. Selecting a citation should make its evidence relationship obvious.
4. Refine: focus the relevant sentence and show the pending diff in the editor. Acceptance applies the shorter text; Discard preserves the original. Keep its citation. The still shows the pending beat; the accepted text carries into Present.
5. Present: collapse irrelevant inspectors and show finished artifacts. Keep report and deck examples distinct and use format-appropriate actions. Implement the actual presentation surface with `aspect-ratio: 16 / 9`; imagegen's raster viewport is illustrative, not proof of exact PPTX geometry.
6. Keep native scrolling, reversible chapter progress, coherent pane transitions, keyboard access and reduced-motion behavior. The frames specify visual beats, not tested animation.
7. Reproduce all chrome/text/controls natively. Do not ship these composite PNGs as interactive UI. Generated body prose is illustrative; use exact grounded fixtures and source records in implementation. Outline circles are visual selection markers, not a new radio-based template selector.

## Prompt and generation history

The final prompt often describes a targeted correction. Initial designs and intermediate prompts are preserved alongside it:

| Stage | Main design prompt | Refinements |
| --- | --- | --- |
| Brief | [Dense design](prompts/01-brief-v2-dense.txt) | [Remove redundant structure](prompts/01-brief-v3-structure-cleanup.txt) |
| Research | [Dense design](prompts/02-research-v2-dense.txt) | [Restore four-chapter track](prompts/02-research-v3-track-fix.txt) |
| Refine | [Dense design](prompts/03-refine-v2-dense.txt) | [Correct outline/source continuity](prompts/03-refine-v3-continuity-fix.txt), [correct source label](prompts/03-refine-v4-source-label.txt) |
| Present | [Dense design](prompts/04-present-v2-dense.txt) | [Correct bibliography/output details](prompts/04-present-v3-output-fix.txt), [refine slide/filmstrip](prompts/04-present-v4-slide-proportion.txt) |

The first generated Brief was `mockups/drafts/01-brief-v1.png`. Its density redesign, `mockups/drafts/01-brief-v2.png`, seeded the other three stages so their shell and styling stayed coordinated. Their draft v2 images seeded the corresponding correction prompts; Refine and Present draft v3 images seeded the final fixes. Those images remain under `mockups/drafts/` as generation history, not selected references.

Generated with the built-in **imagegen** tool. Reviewed by the agent; user approval remains separate. No app implementation or HTML/Python testing was performed in this mockup pass.

[Story and continuity contract](STORYBOARD.md)
