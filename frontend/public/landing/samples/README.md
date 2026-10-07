# Deterministic example downloads

These are static examples, not user projects or generated-on-demand exports. Report and deck are separately authored projects. The UI labels downloads as sample files; editing the local demo does not change these fixtures.

Canonical prose and slide text: `frontend/src/components/landing/sample.json`.
Rebuild with `backend/venv/bin/python scripts/build_landing_samples.py`, using the repository's existing `python-docx` and `python-pptx` libraries. No backend runtime, provider call or user data is involved. DOCX uses Letter pages. PPTX uses editable 16:9 slides with a schematic energy illustration. Sources are hyperlinked in the report and deck references; slide notes record attribution.

Verified primary sources on 2026-10-06:
- IEA, [Renewables 2025](https://www.iea.org/reports/renewables-2025): deployment across electricity, transport and heat through 2030; policy and market context.
- US DOE, [Energy Storage](https://www.energy.gov/energy-storage): storing intermittent wind/solar energy; battery research and pumped storage.

Source inspector excerpts are explicitly labelled summaries, not verbatim quotations. Next steps are sample analysis, not facts attributed to a source. No invented numerical projections or confidence scores appear.

The files were opened by headless LibreOffice and rendered as two document pages and five presentation slides for visual inspection. Browser download checks follow the page implementation.

Tour rebuild update: prepared report downloads now contain the storyboard's accepted sentence, “Storage saves renewable electricity for later use. [2]”. The separately authored deck has six slides, including Next steps. The live tour preview uses its local Accept/Discard state; prepared downloads do not follow arbitrary text edits, outline order, formatting or artwork palette. The tour's wind illustration is a crop of approved artwork; the prepared PPTX retains its editable schematic illustration.
