# DocBuilder — product and UI rebuild plan

**Date:** 2026-10-05  
**Status:** Proposed roadmap; implementation has not started.  
**Constraint:** Free-tier hosting and API plans. No required paid infrastructure, paid model, automatic billing upgrade, or temporary trial masquerading as a sustainable free plan.  
**Scope:** Improve the existing document/presentation product to a reliable release standard, add useful capabilities, and rebuild the entire UI. The landing-page exploration remains unfinished and must reflect the product we actually deliver.

## 1. What we are building

A polished writing workspace where a user can turn a brief into an editable, researched document or presentation; understand its sources; refine it without losing earlier work; and export a usable file. The product should remain useful when research quota runs out, an AI provider is unavailable, or the free backend is waking up.

The rebuild includes the logged-out landing page, login/register/recovery, dashboard, project creation, document editor, presentation editor, outline, research, refinement, history, export, settings, and their mobile, loading, empty, failure and quota states. It is not limited to a prettier homepage.

“Production level” means verified authentication, data integrity, predictable failures, bounded resource consumption, maintainable deployment, usable output and a consistent premium interface. It does not mean unlimited public capacity or guaranteed always-on infrastructure. Render explicitly advises against production applications on its free instances; we must treat this as a constrained public beta/release until the hosting policy and availability requirements support more. [Render free-instance guidance](https://render.com/docs/free)

## 2. Current evidence and first fixes

These findings are from the current repository. The live Render service, account plan, environment values and outage logs have **not** been inspected. The user's reported RAG failure is real context; an out-of-memory diagnosis remains a hypothesis until logs and a resource-limited reproducer confirm it.

| Area | Current evidence | Required improvement |
| --- | --- | --- |
| Hosting | [`render.yaml`](../render.yaml) defines a Python backend. [`backend/railway.toml`](../backend/railway.toml) and deployment docs also describe Railway. No explicit `plan: free` is present in the Render Blueprint. | Establish the actual host, region, plan and deployed commit. Keep one accurate deployment contract with explicit free-plan selection. |
| Provider configuration | `render.yaml` sets `LLM_PROVIDER=gemini`; [`get_llm_adapter()`](../backend/app/core/llm.py) only selects Groq, otherwise returning the mock adapter. | Reject unsupported providers and missing credentials in production; align deployment and code. Never silently serve mock AI. |
| RAG compute | [`rag.py`](../backend/app/core/rag.py) loads `all-MiniLM-L6-v2` through HuggingFace and constructs `FAISS.from_documents` per retrieval. [`requirements.txt`](../backend/requirements.txt) includes sentence-transformers and FAISS. | Remove local neural inference and per-request vector indexing from the free-server path. Measure build size, startup RSS and peak request RSS. |
| RAG failure behavior | Missing search credentials, empty results and search exceptions can produce mock research documents. Initialization prints part of the API key. | Explicit research outcomes; no fake evidence; no credential logging; honest user-visible degradation. |
| Fetching | RAG uses blocking `requests.get`; extraction is truncated only after the full response is downloaded. | Bound response bytes and decompressed size, duration and concurrency before parsing. Validate URLs and redirects. |
| Authentication | [`auth.py`](../backend/app/core/auth.py) accepts the literal `mock_token` independently of an environment check. | Remove this production path. Tests use dependency overrides or an emulator. |
| Actor identity | Refinement, comments and reactions accept client-provided user IDs in [`endpoints.py`](../backend/app/api/endpoints.py). | Derive the actor from the verified Firebase token for every mutation. Preserve ownership checks. |
| Save correctness | [`SectionUnit.tsx`](../frontend/src/components/SectionUnit.tsx) clears unsaved state immediately after calling the asynchronous save callback. | Keep a draft until the server acknowledges it. Failed saves retain edited text and a clear retry action. |
| Concurrent edits | Mutations read and replace the whole outline array; section `version` exists but requests do not enforce an expected version. | Version checks and transactional writes; return an explicit conflict instead of overwriting newer content. |
| Data growth | Full generation responses and refinement histories accumulate inside project/section arrays. | Separate section/history records, bound retention and stored bytes, and paginate reads. |
| Source visibility | RAG metadata is returned inside the LLM result and retained in generation history, while `Section` has no research/source contract. | Persist structured evidence alongside the section and expose it to the editor and export path. |
| Execution | Async routes directly call synchronous LLM chains and database operations. | Keep blocking work off the event loop; enforce admission limits, deadlines and recoverable job state. |
| CI | [CI](../.github/workflows/ci.yml) installs frontend dependencies but skips its build/tests. `test_refinement.py` imports `app.main`, while the app entry is `backend/main.py`. | Repair test discovery, use isolated test dependencies, and enforce meaningful backend and frontend gates. |

Existing assets worth keeping: Firebase sign-in, ownership-aware projects, AI outlines, editable ordered sections, optional research, context-aware refinement, reaction history, DOCX export and four PPTX themes. Improve these before replacing working behavior.

## 3. Free-tier architecture and policy

### Proposed baseline

| Component | Proposed approach | Constraint / qualification |
| --- | --- | --- |
| Frontend | Keep Next.js/React and rebuild the shared UI; choose supported, patched versions during implementation. Serve static marketing content through the frontend CDN. | Vercel Hobby is restricted to personal, non-commercial use. If this is a commercial launch, select an eligible free frontend host and verify framework support before launch. No assumption that every Next.js route can simply be statically exported. [Vercel policy](https://vercel.com/docs/plans/hobby) |
| API and exports | One lean FastAPI Render Free service, initially one process with bounded work. | Free compute is 0.1 CPU / 512 MB. Idle services sleep after 15 minutes; filesystem changes are ephemeral; 750 running hours are shared across the workspace monthly. No always-on worker assumption. [Compute](https://render.com/docs/compute-plans), [free limits](https://render.com/docs/free) |
| Identity | Existing Firebase Auth; email/password, verification and recovery as appropriate to the confirmed project quotas. | No required SMS/phone sign-in or custom paid mail service. Inspect the account's actual limits before promising signup volume. |
| Durable application data | Existing Firestore on an eligible no-cost configuration. | Free allowance: 1 GiB storage, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day, 10 GiB outbound/month. Individual documents max 1 MiB. Managed TTL deletes and backups require billing. [Firestore quotas](https://firebase.google.com/docs/firestore/quotas) |
| LLM | Keep a configurable Groq adapter first; select an available free-plan model after a small quality evaluation. | Exact limits vary by organization/model. Read current account limits and honor `Retry-After`; do not build around the currently hardcoded model remaining available. [Groq limits](https://console.groq.com/docs/rate-limits) |
| Web research | Provider abstraction; recommended first candidate is Tavily Basic Search, subject to account verification and retrieval-quality checks. | 1,000 free credits/month, no card required; Basic Search uses one credit. Explicitly disable advanced/auto-selected modes, paid overage and automatic provider upgrades. [Credits](https://docs.tavily.com/documentation/api-credits), [search parameters](https://docs.tavily.com/documentation/api-reference/endpoint/search) |
| Retrieval | Small bounded chunks ranked by pure-Python lexical/BM25-style scoring, then passed to the LLM. | No Torch, sentence-transformers, local embedding download, FAISS, GPU, paid vector database or separate embedding server in the baseline. Lexical quality needs evaluation; it is not assumed equivalent to embeddings. |
| Files | Generate DOCX/PPTX on demand, return the download, then release temporary data. Store small extracted text only where needed. | No required persistent file bucket. Firebase Storage requires Blaze even where no-cost usage exists, so it is excluded from the strict no-billing baseline. [Firebase Storage requirements](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024) |
| Background state | Durable operation records and leases in Firestore; bounded execution within the active API process. | On restart/sleep, unfinished work becomes interrupted and resumes through a user action or active request. No promise of completion while the free service is asleep. |

Google Custom Search is a compatibility option only if the existing account still works. It is closed to new customers, with existing customers required to transition by **January 1, 2027**. Do not make it the new research foundation. [Google notice](https://developers.google.com/custom-search/v1/overview)

Keep provider credentials server-side. Use the same user's authorized data for all retrieval and AI calls. Global cache reuse is permitted only for genuinely public page extracts with no private topic, document or user data attached; private prompts, generated content and source selections remain isolated by owner/project.

### Initial application limits — proposals, not provider entitlements

Start conservatively; measure and adjust configuration without changing the free-only policy.

| Resource | Proposed starting limit / response |
| --- | --- |
| Active AI work | One per user, one service-wide initially; additional accepted work is bounded or returns a retry state. Manual editing remains usable. |
| AI usage | 10 operations/user/day initially, plus a global model request/token budget derived from the actual account. A bulk generation counts every section and retry against its budget. |
| Research | 3 uncached searches/user/day; 30/day and 900/month globally, leaving credit headroom. Counter periods must match the provider's actual reset behavior. |
| Research size | At most 3 results, 50 chunks, 12,000 characters of selected context; document token budget is enforced separately. |
| Direct page retrieval | Only when needed: at most 2 concurrent fetches, 5 seconds/page, 12 seconds total retrieval deadline, 1 MiB response and decompressed-byte ceiling, HTML/text only. No crawl. |
| Project limits | 20 active projects/user; 12 report sections or 20 slides/project initially, with explicit per-section and total stored-byte limits. |
| Storage / history | Keep documents well under the 1 MiB hard limit; proposed 200 KiB/section record. Retain at most 10 version snapshots and 20 refinement records/section, with a per-user total storage budget. |
| Firestore headroom | Target usage below 80% of daily reads/writes and 75% of storage; quota operations, history, jobs and cache reads count too. Reserve capacity for saving, deletion and recovery. |
| Autosave | Debounce changes about 1.5–2 seconds, save only changed content, coalesce writes, pause retries offline, and keep an explicit Save action. No write per keystroke. |
| Export | One export/service at a time initially; input-size caps and a measured deadline. Reuse a result only when project version/theme match, and only within a short bounded cache lifetime. |

Quota reservation is atomic and durable before a provider call. Concurrent retries must not escape counters. Track uncertain provider consumption conservatively when a timeout may already have consumed credits. Disable expensive actions on exhaustion; preserve manual editing and local draft recovery. Database outages also need an honest offline state because saving cannot be promised without durable storage.

Render can bill bandwidth/build overages when a payment method exists. Free tier selection alone is insufficient to prove a zero bill: inspect account billing settings, disable paid overage where supported, and fail closed otherwise. Do not enable billing or change existing account payment settings without explicit authorization. [Render quota behavior](https://render.com/docs/free)

## 4. RAG rebuild — first engineering milestone

**Goal:** Research works within the free server's measured budget, uses real evidence, shows sources, and fails clearly.

### Investigation before choosing the final implementation

1. Capture the deployed commit, actual service plan, failed build/runtime logs, peak memory and first-RAG-request behavior. Distinguish build failure, model download failure, OOM, missing credentials, provider rejection and network timeout.
2. Reproduce startup and research under a 512 MB container limit with clean caches. Record dependency/image size and peak RSS rather than inferring suitability from the embedding model's file size.
3. Verify the currently configured provider and search entitlement without logging secrets. The `gemini` → mock fallback must be fixed regardless of the reported RAG cause.
4. Implement and compare the lightweight pipeline against a small saved research set. If lexical retrieval is insufficient, evaluate a free hosted embedding option behind the same adapter; do not restore heavyweight inference to the backend by default.

### Proposed pipeline

```mermaid
flowchart LR
  A[Section and project context] --> B[Authorize and reserve quota]
  B --> C[Owner-scoped research cache]
  C --> D[Basic search or user-supplied sources]
  D --> E[Bounded extraction and deduplication]
  E --> F[Small chunks and lexical ranking]
  F --> G[Evidence IDs and bounded prompt]
  G --> H[LLM generation]
  H --> I[Validate citations and output]
  I --> J[Save draft, research state and sources]
```

- Use search-result content directly where adequate. Fetch full pages only for an explicit quality need within the resource budget. A search snippet and a full-page extract must be labelled differently.
- Normalize source URLs, deduplicate repeated pages/chunks, preserve title, publisher/domain, retrieval time and extracted evidence. A retrieval timestamp does not prove a page's publication date.
- Assign stable source IDs; attach each selected chunk to its source. Model citations may reference only those IDs. Validate that a quoted excerpt exists in retrieved text; distinguish “has a source” from “claim verified.”
- Treat retrieved text as untrusted data. It cannot override system instructions, request secrets, invoke tools or alter application behavior.
- For direct fetching, allow only appropriate public HTTP(S) destinations; block loopback, private/link-local/reserved addresses and metadata endpoints. Recheck DNS destinations and every redirect; cap redirects, content type, bytes and elapsed time. Test adversarial URLs before URL-source features ship.
- Persist sources on the section, not just inside raw generation history. Refinement preserves evidence unless a user removes it, and warns when a changed claim needs renewed research.
- Avoid global raw-prompt SQLite persistence. The current local cache is ephemeral and has no retention/ownership policy; replace it with bounded, scoped caches or remove it.
- When research fails, retain the user's existing work. Offer “Try research again,” “Use my sources,” or an explicit “Generate without research.” Never silently present an unresearched draft as researched.

### Research result contract

`status`: `off | searching | ready | partial | no_results | unavailable | quota_exceeded | failed`.

`sources[]`: `{id, url, title, retrieved_at, published_at?, content_kind, excerpt, content_hash}`. `content_kind` distinguishes snippet, fetched page and user-provided text. Unknown dates remain unknown.

`research`: `{query, provider, status, source_ids, retrieval_version, warning_codes}`. Save safe structured fields; avoid raw exceptions, API keys and unlimited HTML.

**Acceptance:** A clean free-instance-sized build has no local model download; measured peak RSS remains below a proposed 400 MB target with headroom; real research returns persistent source records; missing keys/429/timeouts/no results never produce mock evidence; hostile URLs are rejected; manual editing works during provider failure; citation IDs survive save/reload/export. If memory or retrieval quality misses the gate, revise the architecture before declaring RAG fixed.

## 5. Existing features to improve

P0 = release blocker. P1 = required for the first rebuilt release. P2 = next iteration after the foundation proves reliable. All rows below are proposed work, not completed features.

| ID | Priority | Improvement | Completion evidence |
| --- | --- | --- | --- |
| IMP-01 | P0 | Real authentication and actor identity: remove production mock tokens, derive all actor IDs, enforce ownership across every route; verified profile flow and safe auth errors. | Cross-user access/mutation tests; missing/expired/invalid/test tokens fail; production dependencies cannot select mocks. |
| IMP-02 | P0 | Correct environment/provider contract; lean locked dependencies; supported Python/Node/Next versions; explicit feature availability. | Clean reproducible build; startup rejects bad config; provider smoke check returns real output; no secret logs. |
| IMP-03 | P0 | Lightweight honest RAG and durable sources, as specified above. | Resource-limited retrieval/failure/citation gates pass. |
| IMP-04 | P0 | Safe persistence: section-level writes, expected-version checks, stable server-issued IDs, transaction-safe reordering and generation results. | Two-tab editing cannot silently overwrite work; AI result cannot replace a newer manual edit; reorder contains every section exactly once. |
| IMP-05 | P0 | Durable operation states, idempotency, deadlines, rate limits and bounded retries; blocking work off the event loop. | Duplicate submission consumes one admitted operation; restart interrupts safely; health/editor routes remain responsive under bounded AI/export work. |
| IMP-06 | P0 | Validation and content safety across manual, generated, refined and exported content; request/body limits; safe structured errors and exact origin configuration. | Malicious HTML/URLs, oversized content and invalid parameters have consistent tested outcomes without exposing provider exceptions. |
| IMP-07 | P0 | Quota accounting, retention and recoverable database schema migration. | Concurrent requests respect global/user limits; migrate real-shaped sample projects without data loss; rollback path and quota measurements are documented. |
| IMP-08 | P0 | Repair CI and replace inaccurate “production-ready” docs with actual release evidence. | Backend tests collect and pass; frontend type/lint/build and focused flow tests run; deployment/config documentation matches the selected architecture. |
| IMP-09 | P1 | Better outline generation: audience, purpose, output length, section/slide count, uniqueness and editable targets. | Representative briefs produce ordered, type-appropriate outlines; IDs are server-issued; malformed responses fail safely. |
| IMP-10 | P1 | Better generation: document vs slide structure, bounded context, actual word counts, preserved formatting and recoverable section errors. | Evaluate report/deck examples; report word counts are computed; slide content remains within layout limits; retries preserve prior content. |
| IMP-11 | P1 | Refinement that is reversible: diff preview, accept/discard, document context and consistent evidence handling. | User can reject a refinement without losing the original; accepted changes persist with their actor, version and source references. |
| IMP-12 | P1 | Reliable editor: confirmed Save, debounced autosave, undo/redo, draft recovery and explicit sync state. | Reload, offline/reconnect, failed save and two-tab scenarios preserve content and clearly identify saved vs local drafts. |
| IMP-13 | P1 | Useful project dashboard: paginated summaries, search/filter, rename, duplicate, archive and clear empty/error states. | List loads without full histories; project actions preserve ownership and quotas; navigation is functional on mobile. |
| IMP-14 | P1 | DOCX/PPTX exports: consistent rich-text interpretation, ordered sections, links/references, typography and content-aware slide layout. | Open exported files in Word-compatible and PowerPoint-compatible viewers; visually inspect long sections, lists, emphasis, links, references and every theme for clipping. |
| IMP-15 | P1 | Auth UX: recovery, verification, helpful errors, profile display name, session expiry and account/data deletion. | Recovery and expired-session flows work; delete cascades are complete and quota-bounded; retries do not lose unsaved work. |
| IMP-16 | P1 | Entire UI rebuild with shared tokens, components, typography, responsive layouts and accessible interaction. | Review all surfaces/states in section 7; keyboard and screen-reader checks; mobile render evidence; no isolated page-style drift. |

## 6. New features to add

The additions are chosen to improve real writing work without requiring expensive autonomous agents or a permanently running research service.

| ID | Priority | Addition and user value | Free-tier implementation / dependency |
| --- | --- | --- | --- |
| NEW-01 | P1 | **Structured project brief:** audience, purpose, tone, desired length and output type before generating. | Small validated fields stored with the project; one existing outline call, no separate planning-agent call. Depends on IMP-09. |
| NEW-02 | P1 | **Research panel:** inspect source links/excerpts, see partial/unavailable research, include or exclude sources, refresh deliberately. | Reuse stored evidence; a refresh consumes quota. No invented source scores. Depends on IMP-03. |
| NEW-03 | P1 | **Sources supplied by the user:** paste reference text or add a few public URLs when global web search is unavailable or unnecessary. | Text first, bounded safe URL extraction second; store extracts, not binary uploads. No search credit for pasted text. Depends on fetch safety. |
| NEW-04 | P1 | **Version history and restore:** named checkpoints before generation/refinement and a bounded history of accepted changes. | Small snapshots in separate owner-scoped records; restore creates a new version. No paid Firestore backup feature. Depends on IMP-04/07/12. |
| NEW-05 | P1 | **Writing presets:** concise, expand, clarify, formalize, convert to bullets, improve transition. | One visible refinement call per action; diff/accept/discard reuse IMP-11. No hidden multi-agent critique loop. |
| NEW-06 | P1 | **Starter structures:** business report, research brief, academic outline, proposal and presentation. | Versioned local template definitions; editable before any AI request. No marketplace/service dependency. |
| NEW-07 | P1 | **Usage and service state:** remaining AI/research allowance, reset time, warming backend, interrupted work and retry guidance. | Read aggregate safe counters at low frequency; no continuous full-project polling. Depends on quota and job contracts. |
| NEW-08 | P1 | **Bounded bulk generation:** generate selected sections sequentially, with progress, stop and resume. | Admit only work the budget supports; checkpoint each section. Stop prevents further calls; already-dispatched calls may still consume quota. Depends on IMP-05/07. |
| NEW-09 | P1 | **Output preview:** document reading view and slide-by-slide preview before download, including references. | Native HTML/CSS preview using the canonical content/layout model. Test export fidelity; it is not an embedded Office renderer. |
| NEW-10 | P2 | **Quality checks:** word-count targets, empty sections, repeated headings, excessive slide text, broken source references and unsupported citation markers. | Deterministic local checks first; optional deeper AI review is user-triggered and quota-counted. No meaningless universal quality score. |
| NEW-11 | P2 | **Presentation layouts and style controls:** title/body, two-column, section divider; controlled fonts, spacing and theme tokens. | Deterministic layouts; charts use explicit structured numbers supplied/verified by the user. No generated fake metrics or paid image pipeline. |
| NEW-12 | P2 | **Create a presentation from a report:** choose sections, review slide outline, then generate concise slide content. | A new project linked to the source version; explicit bounded per-slide AI cost. Not an instant format toggle. |
| NEW-13 | P2 | **Portable text:** Markdown/HTML export and a printable reading view. | Browser-side serialization/print where feasible; no LibreOffice or headless browser service required on the 512 MB backend. DOCX/PPTX remain primary. |
| NEW-14 | P2 | **Small text/document imports:** extract bounded TXT/Markdown/DOCX text; evaluate browser-side PDF extraction later. | No persistent binary storage by default; file size/type guards and clear extraction limitations. Only ship once parser/memory/security tests pass. |

Defer real-time collaborative editing, public share links, scheduled research, unbounded document libraries, huge PDF ingestion/OCR, always-on agents, paid vector services, AI-generated images per slide, subscription billing and unlimited generation. These are outside the first free-tier release and are not landing-page promises. Existing single-user comments/reactions may be polished; they do not establish a working collaboration system.

## 7. Entire UI rebuild contract

The premium bar applies to the working product as strongly as the homepage. The first two imagegen hero drafts were rejected or held back; neither is an approved design direction. Five themes and three mockup states per theme remain the design exploration target in [`design/landing-page-revamp`](../design/landing-page-revamp/ART-DIRECTION.md).

| Surface | Required experience |
| --- | --- |
| Landing | Image-led Indian epic/mythology direction selected through reviewed mockups. Workspace occupies the lower hero half, expands to full screen, advances through outline → generate → refine → export, then releases into image-backed capability stories and a clear CTA. No unsupported proof, fictional customers or unfinished feature claims. |
| Login / register / recovery | Same visual language, readable forms, clear validation, visible loading/failure, accessible focus and a useful expiry/recovery flow. |
| Dashboard | Fast summary list, last edited/output type/status, search/filter, clear project actions and purposeful empty state. Avoid a decorative analytics dashboard with invented metrics. |
| Creation | A clear brief and document/presentation choice; useful starter structure; limits explained where they affect the decision. |
| Document editor | Quiet paper and typography, stable outline, clean toolbar, readable research/refinement rail, real Save/sync state and keyboard access. |
| Presentation editor | Slide navigation, readable preview, layout/theme controls, concise content limits and reliable ordering. Do not shrink the report editor and call it a slide editor. |
| Research / refinement / history | Inspectable evidence, reversible changes, useful state labels, visible quota impact and no ambiguous fake success. |
| Export | Preview, actual available formats/themes, progress, actionable failure and clear download completion. |
| Settings / account | Profile, allowed preferences, usage, recovery and data deletion; no technical implementation clutter in normal user flows. |
| Mobile | Adapt outline/secondary rails into tabs/drawers; keep readable text and useful actions. No miniature three-column desktop workspace. |
| Failure states | Offline/local draft, backend warming, unavailable research, exhausted quota, auth expiry, save conflict and interrupted generation are designed experiences. |

Build one spacing/type/color/surface/focus system and reuse it across pages. Imagery lives around working surfaces; editor text always has a calm solid background. Use controlled motion, native scrolling and a reduced-motion alternative. A static mockup does not prove scrolling behavior or accessibility. No runtime UI changes begin during this planning pass.

## 8. Contracts and data changes

- **Project:** owner, output type, brief, schema version, section order, timestamps and small summary fields. Lists return summaries with cursors.
- **Section:** stable server ID, content/bullets, computed count, expected version, layout/theme fields as appropriate, generation state and structured research. Move sections out of large whole-project arrays.
- **Revision/refinement:** owner, project/section, base/result version, accepted status, safe instruction/diff, bounded snapshot, creation time. Restore creates another revision; never rewrites history silently.
- **Operation:** owner, type, idempotency key, base version, reserved budget, phase, lease/attempt/deadline, safe error and result reference. States: `queued → running → succeeded | failed | interrupted | cancelled`. Recovery never blindly repeats an uncertain provider call.
- **Usage:** atomic per-user and global counters for requests, tokens/search credits and storage; configured reset boundaries and reserved capacity. Do not expose other users' counters.
- **Source/cache:** deduplicated bounded evidence with expiry; private scope by default. Cache expiry is enforced during reads and bounded cleanup; managed Firestore TTL is not a no-billing assumption.

Keep existing routes compatible during migration where practical; add version/idempotency fields and stable error codes deliberately. Conflicting mutations return `409`; quota failures return a documented `429` or provider-unavailable state; unsupported configuration never returns mock success. Stream progress only after the operation and persistence contracts are correct; reconnect must reconcile final durable state.

Migrate existing project arrays with an idempotent, owner-preserving tool, sample validation, a dry run, an exported rollback snapshot and explicit cutover. Do not run migration or alter live data during planning. Account deletion must also remove subcollections, cached private evidence and operation records; deleting a parent alone is not an adequate cleanup strategy.

## 9. Delivery order and checkpoints

| Milestone | Deliverable | Exit condition |
| --- | --- | --- |
| M0 — Baseline | Verify live topology, logs, billing limits, provider entitlement, supported versions and actual core flows. Capture current data shape. | Evidence-backed problem list and resource/quota baseline; no secret exposure. |
| M1 — Release foundation | IMP-01–08: authentication, provider config, RAG rebuild, data integrity, bounded execution, quotas and CI. | P0 gates pass locally and on the selected free host; no production mocks or fabricated research. |
| M2 — Core workflow | IMP-09–15 plus NEW-01–09, staged in small complete flows. | Brief → outline → researched draft → reversible refinement → save/reload → usable export demonstrated. |
| M3 — Design system and app UI | Select a reviewed visual direction; rebuild every surface in section 7 around the delivered contracts. Landing mockup exploration can continue earlier, but final copy/demo follows real product behavior. | Responsive, accessible rendered review of working flows, including all failure states. |
| M4 — Landing and bounded beta | Implement the selected imagery, full-screen scroll story and subsequent sections; verify quotas and release instructions. | Manual deployment smoke test and limited-beta admission; no unverified “production-ready” declaration. |
| M5 — Next additions | NEW-10–14 after usage/quality evidence supports them. | Each addition has its own budget, correctness and UX gate before becoming a product promise. |

Commit important checkpoints with accurate descriptions. Existing Vercel Git-deployment disable config is in the root and frontend `vercel.json` files, committed locally in `0b21ddd`; it has not been pushed or verified against the live Vercel project. Preserve that setting while rebuilding. Check Render deployment behavior separately before any future push; the Vercel JSON does not control Render. No push, migration, provider account creation or deployment is authorized by this planning document.

## 10. Release evidence required

1. **Trust:** no production test-token/mock-provider paths; every user-data route enforces identity/ownership; hostile HTML and network destinations are covered.
2. **Data integrity:** saves survive reload; failed saves keep drafts; concurrent edits conflict safely; generation cannot overwrite newer edits; interrupted operations recover without duplicate uncontrolled calls.
3. **Research:** sources are real and persistent; missing/partial/quota states are honest; unknown sources are rejected; citation rendering survives refinement and export.
4. **Free-server fit:** clean resource-limited build, measured startup/AI/research/export RSS and CPU, no model download; bounded simultaneous work leaves health and editing APIs responsive. Proposed warm non-AI API p95 target below one second is a target to measure, not a guarantee.
5. **Cold starts and outages:** test a genuinely idle free service; preserve drafts through the wake-up window; respect timeouts/backoff instead of pretending the server is always on. No keep-alive ping scheme is part of the architecture.
6. **Quota fit:** concurrent quota tests, provider 429/deadline behavior, request/write/token cost per complete workflow, retention cleanup and account-wide headroom documented. Remaining-user UI never claims extra capacity after exhaustion.
7. **Output quality:** representative research brief, business report and presentation evaluated; DOCX/PPTX opened and visually inspected across long-content and theme cases. No clipping, silent truncation or fabricated sources.
8. **UI quality:** desktop/tablet/mobile renders, keyboard/focus/navigation, readable contrast, reduced motion, real Save/export behavior, and the complete scroll expansion/pin/release sequence verified in a browser.
9. **Maintenance:** pinned supported dependencies, working CI, safe logs, documented recovery and manual release/rollback. Use free operational tooling and bounded logs; do not send raw user documents to telemetry.
10. **Migration and availability:** existing projects survive schema changes; actual hosting terms and expected audience match the chosen public release model. All unresolved launch-critical decisions below must be closed with evidence.

## 11. Decisions still open

These require live account evidence or a product decision before implementation/release, not a guess in this file:

- Actual backend URL/plan/region, deployed commit, RAG failure log and OOM/build/network evidence.
- Current Firebase plan, free quotas, rules, usage and existing project sizes.
- Groq model availability/account limits and search-provider entitlement; Tavily is a recommendation, not an account already created or a proven migration.
- Whether this remains a personal/non-commercial application or becomes a commercial service; this changes frontend-host eligibility.
- Expected beta audience and acceptable cold-start/outage behavior. Free capacity is shared, not “three searches per day for unlimited users.”
- The quality benchmark for generated reports/slides, language coverage and acceptable lexical retrieval recall.
- Retention/storage limits, recovery expectations and how to export user data without paid managed backups.
- Final visual direction after reviewed iterations; mythology belongs in the art direction and must not impair working UI.

**Next action:** M0 evidence capture, then the M1 RAG/config/auth/data foundation. This document records proposed scope and acceptance criteria; it does not claim those changes are implemented or authorize a paid upgrade.
