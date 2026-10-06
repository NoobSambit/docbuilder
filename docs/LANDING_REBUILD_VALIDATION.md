# DocBuilder landing rebuild validation

Implemented landing page, verified locally on 7 October 2026 (Asia/Kolkata). This is the landing implementation and its deterministic demonstration. The authenticated product and backend rebuild are outside this change.

## Preview

From the repository root:

```sh
cd frontend
npm run dev -- --port 3101
```

Open `http://localhost:3101/`. Review a specific theme with `/?landingTheme=akshara`, `astra`, `neel`, `sabha` or `vanam`. The footer artwork selector changes the current visit. Registration is `/register`; login is `/login`; signed-in primary CTAs use `/projects/new`.

For an isolated production preview that can coexist with a development server:

```sh
cd frontend
DOCBUILDER_BUILD_DIR=.next-landingqa npm run build
DOCBUILDER_BUILD_DIR=.next-landingqa npm start -- --port 3100
```

## Implementation and requirement evidence

| Requirement                                                                      | Implementation and verified evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| All five themes with v7 scene identity                                           | Typed `themes.ts` contains Akshara, Astra, Neel, Sabha and Vanam. Each uses its selected `hero-background-v4.png` derivative. Actual v7 hero and v9/v10 lower references were inspected before implementation. The shared lower structure uses Vanam's supplied forest assets. See the five-theme [laptop arrivals](landing-validation/evidence/hero-1366x768.webp), [taller laptop arrivals](landing-validation/evidence/hero-1440x900.webp) and [mobile arrivals](landing-validation/evidence/hero-375x812.webp).                                                                                                                                                                              |
| Full illustrated canvas and native workspace                                     | Hero artwork covers the viewport, with overscan for each vertical crop. Working faces and gestures remain above the wide preview, which begins at 46% of desktop viewport height. Opaque paper and software surfaces contain native HTML controls, text and icons. No composite mockup or draft is shipped in `public`.                                                                                                                                                                                                                                                                                                                                                                          |
| Expansion, stable shell, reversible chapters and release                         | One mounted `Workspace` remains through arrival, expansion and Shape, Research, Refine and Present. Native scrolling drives one animation-frame update; expansion takes 0.8 viewport heights and chapters take 0.825 each. Behavioral checks prove mounted identity, full viewport geometry, upward reversal, keyboard chapter selection and release into lower content. [Shape](landing-validation/evidence/chapter-1.webp), [Research](landing-validation/evidence/chapter-2.webp), [Refine](landing-validation/evidence/chapter-3.webp), [Present](landing-validation/evidence/chapter-4.webp).                                                                                               |
| Briefs, outlines, inspected sources, reversible refinement, history and playback | Shared local state drives brief and section-title editing, outline selection, include/exclude and source inspection, accept/discard, named checkpoints and restore. Restore adds a new snapshot. Pause/resume advances a labelled local sample sequence, initially paused. No API call or quota consumption occurs. See [capability renders](landing-validation/evidence/capabilities.webp) and the behavioral results.                                                                                                                                                                                                                                                                          |
| Distinct report and deck, filmstrip and working exports                          | Native finished report and separately authored presentation previews; five selectable slides. DOCX, PPTX, Markdown and HTML download real static files. Print opens a real reading view and invokes browser print. Downloads clearly state that local edits do not alter these fixtures. Source URLs were verified against the IEA and US DOE. Office ZIP/XML validation passes; LibreOffice opened and rendered two report pages and five slides. A source-link overlap on the deck references slide was corrected and re-rendered. See [output renders](landing-validation/evidence/outputs.webp).                                                                                             |
| Navigation, CTA, FAQ and footer                                                  | Actual registration and login entry points were exercised without submitting credentials. All rendered anchors have real destinations and fragment targets. All five FAQ rows were opened by keyboard. [FAQ, close and footer renders](landing-validation/evidence/faq.webp).                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Visit rotation, persistence, expiry and fallback                                 | Static homepage plus synchronous head bootstrap. One validated selection supplies scoped CSS before first paint; hydration reads that same choice. LocalStorage tracks a 30-minute inactivity expiry and avoids the previous theme for a new visit. Refresh/navigation persistence, malformed/unknown/future records, activity heartbeat, return to an idle tab, unavailable storage, switcher persistence and deterministic preview override were exercised. All five previews also render correct artwork with application JS blocked, proving selection precedes hydration.                                                                                                                   |
| Responsive and reduced-motion behavior                                           | At widths up to 1000px, outline/document/tools become readable single-column panels. Chapter controls reveal the relevant panel. Tablet, 320px phone and short desktop checks have no horizontal overflow. Reduced motion removes pinning/expansion and uses direct chapter navigation in normal flow. [Mobile workspace](landing-validation/evidence/mobile-workspace.webp), [tablet](landing-validation/evidence/responsive-834x1112.webp), [narrow phone](landing-validation/evidence/responsive-320x700.webp), [short desktop](landing-validation/evidence/responsive-1366x540.webp), [reduced motion](landing-validation/evidence/reduced-motion.webp).                                     |
| Accessibility                                                                    | Native buttons, labels, selects and details/summary; semantic headings and landmarks; named icons, visible focus, high-contrast solid surfaces and mobile touch targets. Automated axe scans for WCAG A/AA tags report zero violations across five desktop and five mobile theme cases. The scans caught and led to fixing the mobile Preview button's missing name. Focus rings on dark rails and artwork navigation were also corrected. This is automated/browser evidence, not an assistive-technology certification.                                                                                                                                                                        |
| Performance and free-tier fit                                                    | 45 WebP derivatives preserve PNG masters, with a hash/dimension/size manifest. Desktop hero files are 84.3% smaller on average than the original PNGs. Only the chosen hero is requested initially; supporting assets load near their sections. Browser requests confirm no unrelated theme artwork. Direct CDN assets have one-day caching and one-week stale-while-revalidate, without runtime image transforms. Homepage remains static: 14.6 kB route JS, 204 kB first-load JS including the unchanged app bundle, 8.41 kB landing CSS in the final build. Initial CLS is 0 in all 15 main theme/viewport captures. Local LCP timings are recorded, not predictions of deployed performance. |
| Landing-only boundary                                                            | Login, registration, authenticated product components, backend, global styles, dependencies and application theme preferences are unchanged. Both Vercel configs still contain `git.deploymentEnabled: false`. No push or deployment was performed.                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## Actual gates

- Final production build: **PASS**, `DOCBUILDER_BUILD_DIR=.next-landingqa npm run build`.
- Existing lint: **PASS**, no warnings/errors, `npm run lint`.
- Type check: **PASS**, `npx tsc --noEmit --incremental false`.
- Diff whitespace: **PASS**, `git diff --check`.
- Focused browser behavior: **PASS**, 73 checks. [Recorded results](landing-validation/evidence/behavior-results.json).
- Render/loading/accessibility review: **PASS**, 20 cases, 10 axe scans, zero violations, no hydration exceptions or horizontal overflow. All five themes were captured at 1366×768, 1440×900 and 375×812; representative 834×1112, 768×1024, 320×700 and 1366×540 cases were also reviewed. Every mobile deck slide in every palette fits its text container. [Recorded results](landing-validation/evidence/render-results.json).
- Sample files: **PASS**, browser downloads, Office ZIP/XML parsing and LibreOffice visual review. Source references are actual hyperlinks.
- Existing auth Jest smoke suite: **FAIL**, two pre-existing tests expect literal `Login` and `Register` text that current auth pages do not contain. The test file and both auth pages are unchanged from the starting revision. This failure does not exercise the landing page. No auth behavior was changed to satisfy outdated selectors.

Visual corrections included per-theme crop offsets, copy/nav contrast, slide grid sizing and typography, capability density/alignment, portrait-tablet reflow, mobile control naming, sample identity, named checkpoints, references-slide link spacing and the taller-laptop artwork gutter fit. The final page was re-rendered after the last image-fit correction.

## Reproduce focused checks

QA packages are intentionally outside the product dependency tree. With a server on port 3100:

```sh
npm install --prefix /tmp/docbuilder-qa --no-audit --no-fund playwright @axe-core/playwright
/tmp/docbuilder-qa/node_modules/.bin/playwright install chromium
LANDING_QA_MODULES=/tmp/docbuilder-qa/node_modules node scripts/verify_landing.cjs
LANDING_QA_MODULES=/tmp/docbuilder-qa/node_modules node scripts/review_landing.cjs
```

`LANDING_QA_CHROME` optionally supplies an existing Chromium executable. `LANDING_QA_URL` overrides the URL. `LANDING_QA_OUTPUT` overrides the evidence destination. Native mouse coordinates are used for pinned header actions because Playwright's automatic scroll-into-view moves a sticky descendant's parent; the browser's physical pointer click keeps the active chapter stable. Keyboard chapter and FAQ actions use actual key presses.

Original PNG captures and downloads are under `/tmp/docbuilder-qa`. Committed WebP review sheets are compact derivatives of actual browser screenshots, not design references or product assets. [Capture manifest](landing-validation/evidence/capture-manifest.json) records the original screenshots' dimensions and hashes.

Artwork rebuild: `python scripts/prepare_landing_art.py`. Sample rebuild: `backend/venv/bin/python scripts/build_landing_samples.py`. Both preserve the original design masters; sample generation uses the repository's existing Office libraries without starting its backend.

## Ten checkpoints

| Commit           | Checkpoint                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `ac1511a`        | Responsive artwork for all five themes                                                          |
| `df0c153`        | Stable visit rotation and scoped theme tokens                                                   |
| `bd5235b`        | Verified sample content and valid downloads                                                     |
| `93e6a67`        | Native interactive workspace                                                                    |
| `0bfe3dc`        | Hero expansion and pinned scroll story                                                          |
| `6cfa483`        | Capabilities, outputs, FAQ and close                                                            |
| `5809622`        | Desktop crop, contrast and output corrections                                                   |
| `a38b890`        | Mobile/tablet/reduced-motion accessibility                                                      |
| `326dee9`        | Behavioral/render checks and production caching                                                 |
| Final checkpoint | Full-canvas gutter correction and recorded final validation; use `git log -1` for its commit ID |

The local review covers Chromium and LibreOffice. It makes no claim about a deployed CDN, real AI generation, backend/RAG readiness, account provisioning or all Office viewers. Downloads are explicitly static samples. The only failed existing gate is the unchanged auth smoke suite described above.
