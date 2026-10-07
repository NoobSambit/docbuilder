# Scroll story and implementation contract

The substantial lower-half hero workspace becomes the same full-screen product showcase. Four chapters follow its expansion; normal page scrolling resumes after the final output. These are design specifications, not implemented motion.

The latest Sabha tour references are in [showcase-tour](04-sabha/showcase-tour/README.md). The previous single refinement screenshot does not specify the whole tour. Brief, Research, Refine and Present each need a distinct, purposeful visible state: input → editable outline, source → citation, instruction → pending edit → approval, and reviewed output → export. Keep useful density and readable stage narration; do not communicate a chapter merely by switching a small utility tab beside the same mostly unchanged document.

## Desktop sequence

| Beat | Composition | Demo state |
| --- | --- | --- |
| Arrival | Compact hero, recognizable epic artwork, broad workspace beginning around 40% of viewport height | Completed source-backed sample, structured brief, saved state |
| Expand | Over roughly 0.8 viewport heights, hero copy/art leave and app gutters/corners reduce to zero | Same shell fills viewport before chapter changes |
| 01 Brief | Full-screen shell pins | Brief audience/purpose/tone, template structure, editable outline |
| 02 Research | Same shell and project | Source rows and excerpts; include/exclude; grounded sample prose appears |
| 03 Refine | Original/suggested diff and instruction | Review, accept/discard, original preserved; history and checkpoint |
| 04 Present | Document preview and export; separate deck example within demo | Format-appropriate output, layout/theme, DOCX or PPTX |
| Release | Final frame leaves with normal flow | Dense image-backed capability examples, outputs, FAQ, CTA and footer |

Give chapters about 0.75–1 viewport height each, with roughly 4–5 viewport heights total for expansion and story. Tune pacing during implementation. Progress is reversible when scrolling upward. Do not intercept native scrolling or force autoplay.

## Construction

Use a long section with `position: sticky; top: 0`. Framer Motion is already installed. Derive local progress from section bounds. Keep the outer application shell mounted with recognizable project/navigation continuity. Main-pane emphasis and contents can change to show the relevant action and result; use controlled pane/selection transitions rather than an unchanged paper view through all chapters. Artwork uses separate optimized image layers. Native HTML supplies all text and controls; do not ship generated screenshots as the editor.

The narrative band replaces marketing navigation while pinned. Clean solid paper and stable text contrast remain throughout. Painted layers can reveal as the hero exits, without expensive WebGL, physics or a video dependency.

This is a deterministic sample demo, labelled as such in implementation. Scrolling makes no backend calls, creates no projects and consumes no user quota. Start creating links to registration, Log in to login, Explore the workflow to the stage. Chapter buttons also permit keyboard navigation.

## Mobile and accessibility

- Headline, recognizable crop, then substantial single-column preview. Do not shrink three desktop panes into unreadable labels.
- Use compact outline tabs and utility drawers. Keep main content readable; 44px interactive targets and visible focus.
- Shorten sticky duration on mobile. Small/short viewports can use four readable chapter examples in normal flow.
- With reduced motion, remove expansion/crossfades and present the sequence normally.
- Maintain native scroll, semantic headings and chapter labels, descriptive art alternatives where informative, and stable high-contrast surfaces.
- Use `svh`/`dvh` carefully for browser chrome; inspect narrow and short viewport behavior during implementation.

## What the four images establish

`01-hero.png` establishes compact arrival and broad container. `02-scroll-showcase.png` shows a full-screen refinement beat. `03-capabilities.png` and `04-outputs-close.png` cover consecutive lower-page compositions in laptop aspect ratio. They do not prove live motion, responsive behavior or accessibility; implementation and rendered QA follow theme selection.

For the revised Sabha container, use the separate stage references under `04-sabha/showcase-tour/`. Their scope is the pinned showcase only. They preserve the theme and existing landing direction while correcting the missing tour story and sparse workspace presentation. Other themes, heroes and lower sections are outside this mockup revision.
