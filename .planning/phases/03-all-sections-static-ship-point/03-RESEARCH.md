# Phase 3: All sections, static (ship point) - Research

**Researched:** 2026-10-01
**Domain:** Final copy and static, server-rendered content for the hero, sections 01–08 and the footer; static SVG diagrams; honesty checks on the built HTML
**Confidence:** HIGH for the source facts (repo, master doc, AI report, citations were all read directly this session) and for the constraints set by the existing tests. MEDIUM for the Phase 2 component props, because Phase 2 has not been executed yet (its research exists; its code does not).

## Summary

Phase 3 is mostly a content and composition phase. No new packages, no client JS. Every section renders from three sources:
- `data.ts` (the CFAR dataset and its derived values);
- `data/claims.json`, which this phase extends with every structured list (requirement rows, flowchart nodes, loop steps, modules, roadmap, security layers, failure modes, ablation steps, chapters, citations, comparison rows);
- short one-off prose in the section components.

The copy deck below is final. It was written against the real sources:
- the AVOLITE repo at `9b985ca`, where module purposes come from the file headers and code;
- master doc §3, §4, §6, §15, §17, §23, §26–30, §39, §47–52;
- AI report §2, §4–10, §14.3, §15, §15.1, §17.

Five findings shape the plan:
1. **Phase 2 is not built yet.** `src/` still holds only the Phase 1 shell: there is no `data.ts`, `claims.json`, StatusTag or Figure. Phase 3 plans must name the Phase 2 interfaces they consume (see "Phase 2 contract" below) and cannot start until Phase 2 lands. The deadline is tomorrow (2026-10-02), so Phase 3 needs to be as parallel as possible.
2. **Phase 1 tests constrain the markup.**
   - `tests/build.test.mjs` regex-matches `<h2 id="{id}-h"><span…>{n}</span> {title}`, so SectionHeader must keep that h2. The large two-line headline therefore goes in a `<p class="headline">`.
   - `tests/smoke.spec.ts` needs the only h1 to read exactly "AVOLITE".
   - `tests/shell.spec.ts` scrolls to the bottom and expects `#why` to be the active nav link, which caps the **footer height at about 450 px at 1440×900**.
3. **The Phase 2 wording lint scans block segments for `data-status="BUILT|SIMULATED"` next to AI words.** An SVG is a single segment, so SVG diagrams must **not** carry `data-status` attributes inside them. Statuses inside an SVG are drawn as glyph plus text. The real `StatusTag` components go in the "View as table" disclosure under each diagram.
4. **Phase 3 needs almost no numbers.** It uses only the CFAR five-target dataset and its derived values (all SIMULATED), plus the requirement-map tally, which is computed. The hero, flowchart, pipeline, roadmap, security and Why sections contain no quantities. Everything else that looks numeric is an identifier (SIH 2026, PS 26055, E1–E8, P1–P7, JEV #1/#2, 2-D, 01–08). A digit-allowlist test on `dist/index.html` can enforce success criterion 5 mechanically.
5. **Three citations are verified; the others are dropped.** The periodic-sync claim is in Clarkson's DASP paper (verbatim text read from the PDF), the sweep/dwell optimisation paper was checked (IEEE TAES 2011, Crossref), and the beam-agile paper was checked (IET RSN 2019, Crossref abstract). `iet-rsn.2010.0377` is by **Winsor and Hughes, not Clarkson**. FEATURES.md mislabels it, and its abstract was not readable, so it is dropped.

**Primary recommendation:** 5 plans.
- **03-01 (wave 1):** claims.json content plus the schema, Hero, Footer, `index.astro` composition with section stubs, and the honesty test extensions.
- **03-02, 03-03, 03-04 (wave 2, in parallel, disjoint files):** 01+02, 03+05, and 04+06+07+08.
- **03-05 (wave 3):** JS-off, axe and full-page integration verification.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Copy for structured lists (rows, nodes, phases, layers, citations) | Build-time data (`data/claims.json` validated by zod in `data.ts`) | — | Honesty rules (status enum, AI words only beside DESIGNED/PLANNED, digit ban, anchor validity) run on every build |
| One-off prose (headlines, ledes, callouts) | Astro section components (SSG) | — | Rendered once; the dist lint still scans it |
| CFAR numbers and derived values | `data.ts` (`derive`, ResultTable, Metric) | — | The only number path (DATA-02..04) |
| Diagrams (PPI scope, flowchart, ring, AI pipeline) | Inline SVG in Astro components (SSG) | CSS media queries (flowchart vs ring) | Final state in HTML; no JS; token colours via CSS classes |
| Roadmap track, requirement map, tables | Semantic HTML plus CSS grid | — | Real lists and tables work better for screen readers than SVG |
| Result tabs in 05 | HTML radio inputs plus CSS `:has()` | Phase 4 may upgrade to ARIA tabs | Works with JS off; native arrow-key behaviour |
| Deep-link highlight (PROB-04) | CSS `:target` | — | No JS |
| Real plots | `astro:assets` `<Picture>` via Phase 2 `Figure` + `figures.ts` | — | AVIF/WebP, width/height, never recoloured |

<user_constraints>
## User Constraints (no CONTEXT.md for this phase; from PROJECT.md "User answers", SUMMARY.md and the orchestrator)

### Locked decisions
- 8 sections in the order `problem, how, built, new, demo, security, roadmap, why`, plus an unnumbered hero and a footer. The ids are fixed.
- The six status tiers are BUILT, SIMULATED, PROTOTYPE, DESIGNED, PLANNED and ILLUSTRATIVE. Every number carries one. ILLUSTRATIVE never looks like a result.
- SARRS framing is approved: SARRS is the radar DSP/detection testbed and foundation, and the ES smart-scan scheduler is the designed layer on top.
- The headline result is `04_MATLAB/DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv`, SIMULATED. The second five-target run is omitted. Monte Carlo is never shown as a distribution. The SNR sweep is not shown while the SNR definition is PENDING.
- AoA and the ML scheduler stay DESIGNED until the team shares evidence. The dashboard is PROTOTYPE with a placeholder. Rule-based `AI/` modules are PROTOTYPE, rule-based, and presented as the baseline.
- No "Live", no "real-time", no defence over-claiming. AI/ML words appear only beside DESIGNED/PLANNED. The hero has no numbers. No file or module counts.
- Data visuals are SVG/code or unrecoloured MATLAB exports only (IMG-01).
- Deploy only when the user asks. Do not commit or push without being asked.

### Claude's discretion (resolved below)
Final copy, component split, SVG construction, how claims.json is extended, the tab mechanism, breakpoints, and which citations to keep.

### Deferred (out of scope for Phase 3)
- HOW-03 node explainers, BUILT-05 slider, BUILT-08 dumbbell, NEW-03/04 stepper and router, DEMO-03/04 simulator, SECU-02/03 picker and panel, all motion (Phase 4).
- AI mood images (Phase 5), real video and screenshots (Phase 5), QA and deploy (Phase 6).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FND-04 | Every section complete with JS off | Everything is SSG. No-JS tabs use radio + `:has()`. The flowchart/ring switch is a CSS media query. The JS-off Playwright spec is in 03-05 |
| SHELL-04 | Hero: eyebrow, AVOLITE, one-liner, Begin / See how it works, radar-scope SVG, status strip, no numbers | Copy deck §Hero; PPI SVG spec; `hero-no-digits` test |
| SHELL-05 | Footer facts, repo link, legend, honesty note, "Created by Sandesh Naik" | Copy deck §Footer; footer height ≤ 450 px (scroll-spy test) |
| PROB-01 | PS framing + Today vs Asked for | Copy deck §01 |
| PROB-02 | Emitter chips E1–E8 | Copy deck §01 (master doc §6) |
| PROB-03 | Requirement map A–H with evidence, status, tally | `claims.requirements[]`; tally computed; statuses from SUMMARY |
| PROB-04 | Rows deep-link and highlight on arrival | `href` validated against an anchor list; CSS `:target` |
| HOW-01 | Closed-loop flowchart SVG with prose | LoopFlow SVG spec; `<desc>` prose written below |
| HOW-02 | Status on every node | `claims.flow[]` statuses; glyph + text in SVG; StatusTag in the table |
| HOW-04 | 7-step ring on phones | LoopRing SVG, visible under 1024 px; 7-step list with tags at all widths |
| HOW-05 | Exploration/exploitation and ground-truth callouts | Copy deck §02 (master doc §26, §28) |
| BUILT-01 | SARRS banner | Copy deck §03 |
| BUILT-02 | What runs today (name + purpose) | `claims.modules[]` from repo headers (list below) |
| BUILT-03 | CFAR table, SIMULATED, source path | Phase 2 `ResultTable` on `cfar-a` |
| BUILT-04 | 4–6 MATLAB plots on plates | 5 figures chosen from the Phase 2 `figures.ts` list |
| BUILT-06 | Rule-based baseline, PROTOTYPE | `claims.baseline[]` (4 modules, purposes read from code) |
| BUILT-07 | Dashboard placeholder, PROTOTYPE | `Placeholder` 16/10 |
| NEW-01 | Two decisions | Copy deck §04 (report §2.2, §4, §5) |
| NEW-02 | AI pipeline diagram, DESIGNED | AiPipeline vertical SVG spec |
| NEW-05 | Prediction vs decision + ablation ladder (7, PLANNED, no values) | Copy deck §04 (report §8.5, §14.3) |
| DEMO-01 | Video box with chapters; placeholder now | `Placeholder` 16/9 + chapter `<ol>` |
| DEMO-02 | Result tabs reusing 03 components | Radio tabs: CFAR table / detection maps / expected vs detected |
| DEMO-05 | Repo link | `.btn` link to the repo at the pinned commit |
| SECU-01 | 7 layers from §15, DESIGNED, "not yet implemented" | `claims.security[]` + failure-mode table (§15.1) |
| ROAD-01 | P1–P7 with status and outcome | `claims.roadmap[]` |
| ROAD-02 | Maturity bar, WE ARE HERE at the end of P1 | CSS bar, `aria-current="step"` on P1 |
| WHY-01 | 3–4 argument cards | Copy deck §08 |
| WHY-02 | Qualitative comparison, no numbers | `claims.comparison[]` |
| WHY-03 | Clarkson papers cited, "not an AVOLITE result" | 3 verified citations below |
| WHY-04 | "Watch the demo" / "Back to the start" | Copy deck §08 |
| IMG-01 | SVG/code or real MATLAB exports only | No raster except repo PNGs; test counts `<img>` sources under `_astro` from `assets/repo` |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

`CLAUDE.md` predates the current plan. PROJECT.md says its stack and token pins are not binding; its honesty, accessibility and motion rules still apply:
- **Numbers:** every number comes through the one data module, and derived values are computed. Do not weaken the build-time zod rules.
- **Status colours:** pass/fail colours appear only on simulated or measured data. Phase 3 uses none (there is no threshold).
- **Visuals and accessibility:**
  - Server-render every visual in its final state; the site must be complete and honest with JS off.
  - Informative SVGs get `role="img"` plus `<title>`/`<desc>`; decorative ones get `aria-hidden`.
  - Every chart has a "View as table" `<details>`.
  - WCAG 2.2 AA, a visible 2px `--signal` focus ring, 44 px targets.
  - SVG colours use tokens or `currentColor`, never raw hex. `tests/tokens.test.mjs` bans hex, `rgb(`/`hsl(` and literal font-family outside `tokens.css`.
- **Copy:** sentence case; no "→" on buttons; uppercase only for stage names, eyebrows and tags. Buttons are the CSS classes `.btn`/`.btn--secondary` (not yet defined; 03-01 adds them).
- **Imagery:** no MathWorks logos (MATLAB/Simulink as text only). No Unsplash or stock imagery.
- **Tooling:** no chart library, icon package or Tailwind. Use Context7 for Astro API questions.
- **Contact:** contact details stay out until supplied.
- **Git:** never push or deploy without the user asking.

## Phase 2 contract (what Phase 3 consumes; verify against the Phase 2 code before planning tasks)

Taken from `02-RESEARCH.md`. If the Phase 2 executor changes names, the Phase 3 planner must follow the code.

| Export | Shape used by Phase 3 |
|---|---|
| `src/lib/status.ts` | `STATUS[id] = {label, definition, glyph, border}`; `type Status` |
| `src/lib/data.ts` | `data` (validated root, with `datasets`, `illustrative`, `definitions` plus **Phase 3 keys below**), `dataset(id)`, `derive(id)` → `{detected,total,maxAbsRangeError,meanAbsRangeError,maxAbsVelocityError,meanAbsVelocityError}`, `metric(id,key)` → `Tagged`, `fmt(v,precision)`, `requireTagged` |
| `src/lib/figures.ts` | Registry of the 10 PNGs (`image, alt, caption, status, source, ratio`) |
| `src/lib/site.ts` | `SECTIONS`, `REPO = {slug, commit, blob(path)}` |
| `ui/StatusTag.astro` | `{status, provenance?}` → `<span class="tag tag--x" data-status="X">` |
| `ui/StatusLegend.astro` | `{id?}` → the six tiers with definitions |
| `ui/SectionHeader.astro` | `{id, n, title, lede, headline?: [string, string], scope?: string}`. **Must emit `<h2 id="{id}-h"><span class="mono">{n}</span> {title}</h2>` exactly** (Phase 1 regex). Style that h2 as the eyebrow (mono, khaki, uppercase via CSS, separator via CSS margin, not a literal "·") and render `headline` as `<p class="headline">` in display type |
| `ui/Metric.astro` | `Tagged` + `precision` |
| `ui/Figure.astro` | `{image, alt, caption, status, source, table?}` |
| `ui/Placeholder.astro` | `{asset, status, ratio: '16/9'\|'16/10'\|'2.23/1'}` |
| `ui/ResultTable.astro` | `{dataset}`; must **not** emit fixed ids (it renders twice: 03 and 05) |
| `ui/TableDisclosure.astro` | "View as table" wrapper |
| `scripts/honesty.mjs` | `lintHtml`, `lintOutput`, run in `astro:build:done` |

`data.ts` builds its root with `z.object`, which **strips unknown keys by default**. Phase 3 must add its new claims keys to the Root schema, or `data.requirements` is silently `undefined`.

## Standard Stack

No new packages. Everything was verified as installed this session:

| Tool | Version | Use in Phase 3 |
|---|---|---|
| astro | 7.3.5 | SSG, `<Picture>` via Figure |
| astro/zod (zod 4.6.5) | bundled | claims schema and rules |
| @playwright/test | 1.63.0 | JS-off full page, flow/ring switch, axe |
| @axe-core/playwright | 4.13 | a11y |
| node:test | Node 24.21.0 | dist HTML checks, claims rules |

## Package Legitimacy Audit

No external packages are installed in this phase. slopcheck is not needed.

| Package | Registry | Disposition |
|---|---|---|
| (none) | — | — |

## Architecture Patterns

### System Architecture Diagram

```
 repo CSV ─(Phase 2 ingest)─► src/data/results.json ─┐
 data/claims.json (Phase 3 fills: requirements, flow, ├─► src/lib/data.ts  zod: status enum, anchors, digit ban,
   loop, modules, baseline, roadmap, security,        │     AI-words-only-beside-DESIGNED/PLANNED, one "here"
   failureModes, ablation, chapters, citations,       │        │ ✗ build fails
   comparison)                                        ┘        ▼
                                          sections/*.astro (one per section) ── ui/* primitives (Phase 2)
                                                  │                         └── viz/*.astro (inline SVG, no data-status inside)
                                                  ▼
                              pages/index.astro: Hero, Problem … Why; Base.astro adds <Footer/> after </main>
                                                  │ static HTML + CSS (0 new JS)
                                                  ▼
                   dist/index.html ─► astro:build:done lintOutput (banned words, AI next to BUILT/SIMULATED, <data> w/o status)
                                    ─► node --test: claims, sections, untagged-digit allowlist
                                    ─► Playwright: JS off at 1440/768/390, flow vs ring, no h-scroll, axe
```

### Recommended file layout (new files; ownership noted for parallel plans)

```
data/claims.json                         03-01 (all Phase 3 keys, final copy)
src/lib/data.ts                          03-01 (extend Root schema + claims rules; getters requirements(), tally())
src/lib/anchors.ts                       03-01 (ANCHORS list; node-importable, erasable TS)
src/components/sections/Hero.astro       03-01
src/components/ui/Footer.astro           03-01 (Base.astro renders it after </main>)
src/components/viz/PpiScope.astro        03-01
src/components/sections/Problem.astro    03-02 (stub by 03-01, filled by 03-02)
src/components/sections/How.astro        03-02
src/components/viz/LoopFlow.astro        03-02
src/components/viz/LoopRing.astro        03-02
src/components/sections/Built.astro      03-03
src/components/sections/Demo.astro       03-03
src/components/sections/New.astro        03-04
src/components/viz/AiPipeline.astro      03-04
src/components/sections/Security.astro   03-04
src/components/sections/Roadmap.astro    03-04
src/components/sections/Why.astro        03-04
src/pages/index.astro                    03-01 only (imports all 9 section components; wave 2 never edits it)
src/styles/global.css                    03-01 only (.btn, .btn--secondary, :target highlight, .chip)
tests/claims.test.mjs                    03-01
tests/numbers.test.mjs                   03-01 (untagged-digit allowlist on dist; red until wave 2 is done is fine only for section-specific asserts. Keep this test section-agnostic)
tests/sec-problem-how.test.mjs           03-02
tests/sec-built-demo.test.mjs            03-03
tests/sec-new-why.test.mjs               03-04
tests/phase3.spec.ts                     03-05
```

Each section component takes no props and reads `data.ts` itself. The `<section id data-section aria-labelledby>` wrapper lives **inside** each section component, so `index.astro` is only a list of imports. 03-01 writes each stub with the final `SectionHeader` (headline + lede), so the page is shippable after wave 1, although thin.

### Pattern 1: claims.json shape (Phase 3 keys)

```jsonc
{
  "definitions": { "snr": null },                    // Phase 2
  "illustrative": [ /* Phase 2: -92 dBm example, used on /preview/ only */ ],
  "requirements": [ { "id": "A", "ask": "…", "evidence": "…", "status": "SIMULATED",
                      "provenance": "CFAR_Performance_Table.csv", "href": "#built-results" } ],
  "flow":     [ { "id": "cfar", "label": "CFAR detection + tracking", "status": "SIMULATED",
                  "provenance": "radar testbed", "role": "…" } ],
  "loop":     [ { "id": "observe", "label": "Observe", "status": "DESIGNED", "line": "…" } ],
  "modules":  [ { "name": "CFARDetector2D", "path": "04_MATLAB/DSP/CFARDetector2D.m", "purpose": "…", "status": "SIMULATED" } ],
  "baseline": [ { "name": "ThreatClassifier", "path": "04_MATLAB/AI/ThreatClassifier.m", "purpose": "…", "status": "PROTOTYPE", "provenance": "rule-based" } ],
  "roadmap":  [ { "id": "P1", "title": "…", "status": "SIMULATED", "outcome": "…", "here": true } ],
  "security": [ { "title": "…", "body": "…", "status": "DESIGNED" } ],
  "failureModes": [ { "failure": "…", "response": "…" } ],
  "ablation": [ "SSM only (baseline)", "…" ],
  "chapters": [ { "title": "…" } ],
  "comparison": [ { "aspect": "…", "fixed": "…", "adaptive": "…" } ],
  "citations": [ { "authors": "…", "title": "…", "venue": "…", "year": "2011", "url": "https://…", "claim": "…" } ]
}
```

Zod rules to add (each one gets a failing fixture in `tests/claims.test.mjs`):
1. `status` is one of the six tiers. `requirements` has exactly 8 entries with ids A–H in order. `loop` has exactly 7. `roadmap` has exactly 7, ids P1–P7. `ablation` has exactly 7.
2. **Anchors:** every `requirements[].href` is in `ANCHORS` (`src/lib/anchors.ts`). The sections test then asserts each anchor id exists in `dist/index.html`.
3. **AI words:** `/\b(AI|ML|machine learning|neural|trained|learns?|predicts?|intelligent)\b/i` may appear in a claim's text fields only when that claim's `status` is DESIGNED or PLANNED. Exempt fields: `path`, `name` and the requirement `ask`. The ask is the PS's wording ("ML-based scheduler"), not a claim about AVOLITE. Citations have no status and are exempt.
4. **PROTOTYPE:** every PROTOTYPE entry in `baseline`/`flow`/`loop` has `provenance` containing "rule-based".
5. **One marker:** exactly one `roadmap[].here === true`, and it is P1.
6. **Digit ban:** after removing allowed identifiers (`/\bE\d\b|E\d–E\d|\bP\d\b|#\d|\b2-D\b|\b\d{4}\b/` in citations only, and file names in `path`/`provenance`), claim prose contains no digit. That makes "no untagged number" true at the data level.
7. **Citations:** `url` starts with `https://`, and `claim` is non-empty.

Getters in `data.ts`: `requirements()`, `tally()` (counts by status, computed, in the order the statuses appear), `flow()`, `loop()` and so on. They are plain accessors over the validated root.

### Pattern 2: Static SVG diagrams

Common rules for all four SVGs:
- Put them inline in the `.astro` markup. Informative SVGs get `role="img"`, `aria-labelledby="{id}-t {id}-d"`, `<title id>` and `<desc id>` with full prose. Decorative parts sit in a nested `<g aria-hidden="true">`.
- Colours come from CSS classes: `.st-simulated { color: var(--st-simulated) }`, shapes use `fill="currentColor"`/`stroke="currentColor"`, strokes use `var(--line-strong)` and `var(--signal)`. Gradient stops use `style="stop-color: var(--signal)"`, which is allowed because it is a var. No hex anywhere.
- Text uses `font-family: var(--ff-mono)` or `var(--ff-body)` set in the component `<style>` (use `:global(svg text)` if needed, because scoped styles only reach elements in the same component).
- Status glyphs are `<symbol>`s defined once per SVG: square, circle, half-circle, ring, dashed ring, hatch. They match the Phase 2 StatusTag glyphs. The glyph always appears with the status word, never colour alone.
- **Never put `data-status` inside an SVG** (finding 3). Use `data-st` or a class.
- Essential strokes are at least 1.5 px (`--line-strong`); decorative ones are 1 px `--line`. Use `vector-effect="non-scaling-stroke"` on the flowchart connectors so they stay crisp when scaled.
- Each diagram is followed by a `<details><summary>View as table</summary>`, a table with the real StatusTag components (UI-07, and the screen-reader path).

**a) Hero PPI scope (`viz/PpiScope.astro`)**
- `viewBox="-200 -200 400 400"`, square, `aspect-ratio: 1`, max-width 560 px at 1440 and 360 px on phones.
- Contents:
  - 4 range rings (`--line`) and a cross-hair.
  - 12 bearing ticks every 30° with **no labels** (SHELL-04: the hero has no numbers).
  - A sweep wedge: a sector path with a linear gradient from `--signal` to transparent, in a `<g class="sweep">` so Phase 4 can rotate it. It rests statically at about 40°.
  - 4 emitter blips at stepped opacities (afterglow final state).
  - One dashed bearing line with a lock reticle (4 short corner strokes).
- The ILLUSTRATIVE StatusTag is **HTML**, absolutely positioned over the figure's top-left corner, so it stays readable at every size and is a real tag.
- `role="img"`. Title: "Radar scope illustration". Desc: "An illustrative plan-position scope with range rings, a sweep and four signal marks, one of them locked by a bearing line. It is a drawing, not AVOLITE output."
- No `<details>` table: it is decorative-illustrative and has no data.

**b) Closed-loop flowchart (`viz/LoopFlow.astro`), shown at ≥ 1024 px**
- `viewBox="0 0 1220 560"`, serpentine layout of 3 rows × 5 columns. Nodes are 200×76 rects, radius 4, `--bg-1` fill, `--line-strong` 1.5 px stroke. Columns x = 20/260/500/740/980; rows y = 20/222/424.
  - Row 1, left to right: RF environment → Emitters (E1–E8) → Propagation → Antenna / array → Receiver.
  - Down arrow at column 5.
  - Row 2, right to left: ADC → Digital down-conversion → DSP / FFT → CFAR detection + tracking → PDW / features.
  - Down arrow at column 1.
  - Row 3: column 1 holds two stacked half-height boxes, "Angle of arrival" and "Environment estimate" (the ‖ parallel pair), then AI → Prediction + uncertainty → Scheduler → Receiver control.
  - **Loop-back:** a path from Receiver control's right edge up along x = 1205 into Receiver's right edge, with an arrowhead and the label "next scan".
- Inside each node: line 1 is the label (Plex Sans, 18 SVG units); line 2 is the glyph plus the status word (Plex Mono, 13 units, uppercase, coloured by `.st-*`). With a 1024 px viewport the container is about 944 px, a scale of about 0.77, so the label renders at about 14 px and the status at about 10 px. Do not go smaller.
- Connectors are `--line-strong` 1.5 px with one arrowhead `<marker>`. The segments into and out of simulated nodes use `--signal-dim`, so the running path is visible. Cyan `--signal` is reserved for Phase 4 motion.
- `<desc>` prose (final):
  > "AVOLITE as one closed loop. An RF environment of emitters, both designed, passes through propagation, the antenna or array and the receiver, all designed, then analogue-to-digital conversion and digital down-conversion, also designed. DSP and FFT processing and CFAR detection with tracking are simulated in the team's radar testbed. Detections become pulse descriptor words and features, designed, which feed two estimators in parallel: angle of arrival and the RF environment estimate, both designed. The AI stage, designed, produces a prediction with its uncertainty, designed. The scheduler, a rule-based prototype, chooses the next scan, and receiver control, a rule-based prototype, reconfigures the receiver. The loop then starts again."
- The "View as table" lists 15 rows: node, what it does, StatusTag.

**c) Seven-step ring (`viz/LoopRing.astro`), shown under 1024 px**
- `viewBox="0 0 320 320"`, one circle of radius 118 (`--line-strong` 1.5 px) with a direction arrowhead. 7 step dots at 360/7° intervals starting at 12 o'clock, each coloured by status with its glyph. Labels outside the ring (Plex Mono 12, uppercase stage names), and "↺" in the centre.
- `role="img"`. Title: "The seven-step loop". Desc: "Observe, process, detect, estimate, predict, decide, scan again, then back to observe."
- The status per step is carried by the **7-step list** (below), which is shown at every width, so phones see a real StatusTag for every step without a table.

**Responsive switch (no JS):** `.loop-flow { display: none } @media (min-width: 1024px) { .loop-flow { display: block } .loop-ring { display: none } }`. `display: none` also removes the hidden one from the accessibility tree, so screen readers do not hear it twice. 1024 is the existing nav breakpoint (Phase 1), and the flowchart text becomes too small below it.

**d) AI pipeline (`viz/AiPipeline.astro`)**
- Vertical, so a single SVG works at every width. `viewBox="0 0 400 1000"`, max-width 440 px, placed in columns 7–12 on desktop and full width on phones.
- Nodes top to bottom:
  1. RF features
  2. JEV + Evidence #1: cluster selection ("which signal is this?")
  3. Cluster
  4. JEV + Evidence #2: skill selection ("what needs analysing now?")
  5. Skills
  6. Model router
  7. A row of three narrow boxes (110 wide): GNN | SSM | ST-GNN
  8. Conditional ensemble (**dashed** border = only when needed)
  9. RL decision layer
  10. Human engineer
  11. Scheduler
- A side branch from node 2: "no fit → agent proposes a new cluster → human approves". A loop-back on the left edge from Scheduler to RF features, labelled "receiver, new RF features".
- The whole diagram is DESIGNED, so one StatusTag `DESIGNED · AI architecture report` sits in the HTML figcaption. There are no per-node tags, and no values anywhere (the worked example is Phase 4, NEW-03).
- Desc: "Designed pipeline. RF features go to the first JEV and evidence stage, which selects a cluster. The second stage selects the skills needed now. A model router runs only the models those skills need: a graph neural network, a state-space model, a spatio-temporal graph network, or a combination. A conditional ensemble fuses them only when more than one runs. A reinforcement-learning layer decides the next action, a human engineer can approve it, and the scheduler sets the next receiver configuration. If no cluster fits, an agent proposes a new one for human approval."

### Pattern 3: Requirement map (HTML table, not SVG)

- `<table id="problem-map">` with a caption, the tally, then 8 rows. Columns: `#`, "PS asks for", "Evidence now", "Status", "Where". Each status cell is a StatusTag. Each "Where" cell is `<a href="#built-results">See the results</a>`, with link text naming the destination (not "click here").
- Under 768 px, the rows stack into cards using the same responsive-table CSS as Phase 2's ResultTable (explicit ARIA roles).
- **Tally**, rendered from `tally()`: `<p class="tally">` containing `<data value="1" data-status="SIMULATED">1</data> simulated, …`. Each count carries its tier's `data-status`, so the Phase 2 `<data>` rule passes and the numbers are tagged.
- **Highlight on arrival (PROB-04):** in global.css, `:target:not(section) { outline: 2px solid var(--signal-dim); outline-offset: var(--sp-2); border-radius: var(--r-panel); }`. The existing `html { scroll-padding-top }` already keeps the target below the header. This works with JS off; Phase 4 may add a fade-out.

### Pattern 4: Result tabs without JS (DEMO-02)

```astro
<div class="rtabs">
  <input class="visually-hidden" type="radio" name="demo-results" id="dr-table" checked />
  <label for="dr-table">CFAR table</label>
  <input class="visually-hidden" type="radio" name="demo-results" id="dr-maps" />
  <label for="dr-maps">Detection maps</label>
  <input class="visually-hidden" type="radio" name="demo-results" id="dr-evd" />
  <label for="dr-evd">Expected vs detected</label>
  <div class="rtab-panel" data-for="dr-table"><ResultTable dataset="cfar-a" /></div>
  <div class="rtab-panel" data-for="dr-maps">…two Figures…</div>
  <div class="rtab-panel" data-for="dr-evd">…two Figures…</div>
</div>
<style>
  .rtab-panel { display: none; }
  .rtabs:has(#dr-table:checked) [data-for="dr-table"],
  .rtabs:has(#dr-maps:checked) [data-for="dr-maps"],
  .rtabs:has(#dr-evd:checked) [data-for="dr-evd"] { display: block; }
  input:focus-visible + label { outline: 2px solid var(--signal); outline-offset: 2px; }
  input:checked + label { border-bottom: 2px solid var(--signal); color: var(--text-1); }
</style>
```

- The labels form one flex row. Put the inputs and labels first and the panels after them, in the same parent.
- The native radio group gives Tab-in plus arrow-key switching. Screen readers announce "radio button, CFAR table, 1 of 3", which is acceptable. Labels are at least 44 px tall.
- `:has()` is in all current engines [ASSUMED: Baseline since Dec 2023, Firefox 121]. Phase 4 may swap in the WAI-ARIA tabs pattern.

### Pattern 5: Roadmap track (ROAD-01/02)

- `<ol class="track">` with 7 `<li id="roadmap-p1">…`. Use CSS grid with 7 columns at ≥ 1280 px, 1 column below that with a left rail.
- P1 carries `aria-current="step"` and a visible badge, `<span class="here">WE ARE HERE</span>` (uppercase is allowed for this badge label).
- The maturity bar is a `<div class="maturity" aria-hidden="true">` with a CSS fill that ends at P1 (grid-aligned). **Do not use `<meter>` or `<progress>`**: they expose a numeric value, which would be an untagged number.
- Text above the track: "Maturity: the detection testbed runs in simulation; the smart-scan layers are designed."

### Pattern 6: Footer (SHELL-05)

- `<footer class="site-footer">` is rendered by `Base.astro` after `</main>`. It has 4 compact columns at ≥ 1024 px (Project, Code, Status legend, Honesty) plus a bottom row.
- **Height budget:** ≤ 450 px at 1440 px wide, or `tests/shell.spec.ts` "scroll-spy … #why" fails. At the page bottom, the 40–45% spy band must still fall inside `#why`. The compact StatusLegend is 2 columns × 3 tags with one-line definitions. Give the legend a `compact` prop if its height runs over.
- The team ID row renders only when `TEAM_ID` in `site.ts` is non-null (it is `null` now).

### Anti-Patterns to Avoid
- `data-status` or StatusTag components **inside** an SVG. The whole SVG becomes one lint segment with "AI", and the build fails.
- Bearing numbers on the hero scope, `<meter>` on the roadmap, line counts in the module list, "5 targets"-style digits typed in prose. Each is an untagged number. Render counts through `derive()`/`tally()` in `<data data-status>`.
- Replacing the Phase 1 h2 format, or adding a second h1 (for example, making the hero tagline an h1).
- Buttons that do nothing: chapter "seek" buttons without a video. Render chapters as plain `<li>` until the video arrives (Phase 5).
- Naming sponsors or endorsements (DRDO, MathWorks logos). Quoting the PS in quotation marks without the official text.
- Words: "AI"/"intelligent" in section 03; "learned models" even in a negation; "jamming" (CognitiveReceiver has jammer modes, so describe it neutrally); "real-time"; "Live"; "deployed".

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tabs without JS | a JS tab widget in Phase 3 | radio inputs + `:has()` | Native keyboard support, works with JS off |
| Disclosure ("View as table", layers) | a JS accordion | `<details>/<summary>` | Built-in a11y |
| Responsive image | manual srcset | Phase 2 `Figure` → `<Picture>` | Verified AVIF/WebP + width/height |
| Deep-link highlight | a scroll listener | CSS `:target` + existing `scroll-padding-top` | No JS, no CLS |
| Chart/flow layout engine | dagre/mermaid | hand-placed SVG coordinates (spec above) | 15 fixed nodes; mermaid is banned by the old CLAUDE.md, and heavy |

**Key insight:** Phase 3's risk is words, not code. The custom code worth writing is the set of claims rules and the digit and wording checks. Everything visual is static SVG/HTML.

## Common Pitfalls

### Pitfall 1: SVG status text trips the AI-next-to-SIMULATED lint
**What goes wrong:** The flowchart has "AI" (DESIGNED) and "CFAR" (SIMULATED) in one `<svg>`. If the nodes use StatusTag (`data-status`), `lintHtml` sees both in one segment and the build fails.
**How to avoid:** Draw SVG statuses as glyph plus text with `data-st`/class only; real StatusTags go in the table rows (each `<tr>` is its own segment).

### Pitfall 2: The footer breaks the scroll-spy test
**What goes wrong:** At max scroll, the viewport's 40–45% band lands in a tall footer, no nav link is `aria-current`, and `tests/shell.spec.ts` fails.
**How to avoid:** Footer ≤ 450 px at 1440 px. Check it in the 03-01 verify step with `npx playwright test -g "scroll-spy"`.

### Pitfall 3: The h2 regex and SectionHeader
**What goes wrong:** SectionHeader renders "01 · THE PROBLEM" as literal text, or puts the headline in the h2, and `build.test.mjs` fails.
**How to avoid:** Follow the contract above. Uppercase and the separator come from CSS.

### Pitfall 4: `z.object` strips the new claims keys
**What goes wrong:** Sections render empty lists with no error.
**How to avoid:** Extend the Root schema. `claims.test.mjs` asserts `data.requirements.length === 8`.

### Pitfall 5: Duplicate ids when ResultTable and Figures render twice (03 and 05)
**How to avoid:** Components take an optional `idPrefix` or emit no ids. `numbers.test.mjs` also asserts that ids are unique in `dist/index.html`. axe checks `duplicate-id` too.

### Pitfall 6: Lazy images in the JS-off full-page screenshot
With scripting disabled, browsers treat `loading="lazy"` as eager, per the HTML lazy-loading rules [ASSUMED: from the HTML spec's "will lazy load element steps"; verify in the 03-05 spec by asserting every `img.complete && naturalWidth > 0` after load]. With JS on, the full-page screenshot may show unloaded images. Scroll through the page before capturing, or capture with JS off only.

### Pitfall 7: Copy drift into banned or over-claiming words
**How to avoid:** Extend `honesty.mjs` RULES in 03-01 with `/\b(deployed|battle[- ]tested|military[- ]grade|neutrali[sz]e|jamm(?:ing|er)s?|guaranteed?)\b/i`. It fails the build. Add fixtures to `tests/honesty.test.mjs`.

### Pitfall 8: The flowchart unreadable on tablets
**How to avoid:** Use the ring and list below 1024 px. The flowchart's "View as table" is available at every width.

## Final copy deck

Conventions: sentence case; stage names, eyebrows, tags and the WE ARE HERE badge are uppercase through CSS only. "→" appears only inside diagrams, never on buttons. **Bold labels below are field names, not copy.**

### Menu subtitles (`SECTIONS[].subtitle` in `site.ts`; the tests read from `site.ts`, so they follow automatically)
| n | title | subtitle |
|---|---|---|
| 01 | The problem | PS 26055 and where we stand on each requirement |
| 02 | How it works | The closed loop, from RF energy to the next scan |
| 03 | What we built | Detection, range-Doppler and tracking in MATLAB |
| 04 | What's new | Pick the cluster, pick the skills, run only what's needed |
| 05 | Demo | Watch the loop, then explore the results |
| 06 | Security | Provenance, fallbacks and a person who decides |
| 07 | Roadmap | From simulation to receiver hardware |
| 08 | Why AVOLITE | The case for adaptive scanning |

### Hero (`#top`, SHELL-04)
- **Eyebrow:** SIH 2026 · PS 26055 · Smart Scan strategy for Electronic Warfare
- **h1:** AVOLITE (text exactly; smoke test)
- **Tagline:** Adaptive smart scanning for electronic support.
- **One-liner:** AVOLITE turns a fixed RF sweep into a closed loop: observe, detect, estimate, then decide where the receiver should look next.
- **CTAs:** `Begin` (`.btn`, `#problem`) · `See how it works` (`.btn--secondary`, `#how`)
- **Status strip:** "Results on this page come from the team's MATLAB simulation. Stages marked designed are architecture, not yet running." plus the link "How to read the status tags", pointing to `#problem-legend`.
- **Scope:** the PPI SVG with an ILLUSTRATIVE tag in its corner. No numbers anywhere in the hero.

### 01 The problem (`#problem`)
- **Headline:** Open-loop sweeps, / and what they miss.
- **Lede:** PS 26055 asks for scheduler software that tells an Electronic Support receiver where to look next. Here is the problem, and where AVOLITE stands on each requirement.
- **Scope line:** Status from the team's audit of the AVOLITE MATLAB repository.
- **Framing paragraph (PROB-01):** An Electronic Support receiver can listen to only part of the spectrum at a time, so it has to choose where to look. Today that choice is usually an open-loop sweep: a fixed order and fixed dwell times, with no prior intelligence about the emitters. It loses time on emitters that do not matter and can miss the ones that do. PS 26055 asks for a machine-learning scheduler, trained on hits and misses, that keeps intercept time low and the intercept rate high against spatially scanning and frequency-agile emitters. It also asks how to intercept a periodic scan receiver optimally.
  - Sources: PROJECT.md PS summary; Clarkson DASP paper for "part of the spectrum". Do not put this paragraph in quotation marks: it paraphrases the official text.
- **Today vs Asked for** (2-column table; column headers "Today: fixed sweep" / "Asked for: PS 26055"):

| Today: fixed sweep | Asked for: PS 26055 |
|---|---|
| Steps through bands in a fixed order | Decides which band to look at next |
| Gives every band the same dwell time | Spends dwell where an intercept is likely |
| Keeps no record of hits and misses | Learns from hits and misses |
| Can fall into step with a periodic emitter and keep missing it | Intercepts periodic scanning emitters reliably |
| Needs a plan made in advance | Works with no prior intelligence |

- **Emitter chips (PROB-02).** Heading: "Emitter classes in our test scenarios". Tag on the group: `DESIGNED · master doc`. Chips: `E1 Persistent`, `E2 Periodic`, `E3 Intermittent`, `E4 Frequency-agile`, `E5 Staggered`, `E6–E7 Communication-like`, `E8 Unknown or new`. Note: "Spatially scanning emitters add a second pattern, in angle, on top of any of these."
- **Legend (UI-02):** `<StatusLegend id="problem-legend" />` with the heading "How to read the status tags".
- **Requirement map (PROB-03/04).** Heading: "Requirements A to H". Tally line: `{1} simulated, {1} prototype, {3} designed, {3} planned`, computed.

| # | PS asks for (`ask`) | Evidence now (`evidence`) | Status | href (link text) |
|---|---|---|---|---|
| A | Probability of detection and false alarm | 2-D CA-CFAR in the SARRS testbed detected every target in one synthetic radar scenario. The false-alarm rate is a detector setting, not yet measured over many runs. | SIMULATED · CFAR_Performance_Table.csv | `#built-results` (See the results) |
| B | Sensitivity | An SNR sweep exists in the repo. It is held back until the team confirms how SNR is defined. | PLANNED | `#built-snr` (Why it is held back) |
| C | A scheduler that decides what to scan next | ScanScheduler and CognitiveReceiver set revisit, dwell and receiver mode from fixed rules, on the radar side. | PROTOTYPE · rule-based | `#built-baseline` (See the baseline) |
| D | An ML scheduler trained on hits and misses | Cluster and skill selection, a model router and a reinforcement-learning decision layer, from the AI architecture report. | DESIGNED | `#new-pipeline` (See the design) |
| E | Spatially scanning and frequency-agile emitters | Periodic and frequency-agile emitter classes and the angle-of-arrival stage are designed; they are not yet in code. | DESIGNED | `#how-flow` (See the loop) |
| F | Average intercept rate and intercept time error | Needs the emitter scene and a fixed-sweep baseline first. | PLANNED | `#roadmap-p4` (See roadmap P4) |
| G | Average reward or cost, and the share of correct predictions | To be measured in the ablation and reinforcement-learning experiments. | PLANNED | `#new-ablation` (See the ablation plan) |
| H | Intercepting a periodic scan receiver optimally | An adaptive dwell pattern avoids falling into step with a periodic scan. Outside research shows why this matters. | DESIGNED | `#why-sync` (See the argument) |

  Row A's "every target" stays in words. Optionally the planner may render `{detected} of {total}` through `derive('cfar-a')` in `<data data-status="SIMULATED">`. Do not type digits.
  "E1–E8"-style ids are allowed in evidence, but the text above avoids them.
  The href for E is `#how-flow`, which sits on the wrapper `<figure>` holding both the flowchart and the ring, so it resolves at every width.

### 02 How it works (`#how`)
- **Headline:** One loop, seven steps. / Each scan decides the next.
- **Lede:** AVOLITE is one closed loop, not a single model. Every scan produces observations, and those observations choose the next scan.
- **Seven steps** (`claims.loop`; `<ol id="how-loop">`, stage name + StatusTag + line):

| Step | Status | Line |
|---|---|---|
| Observe | DESIGNED | The receiver listens to one band and sector for one dwell. |
| Process | SIMULATED · radar testbed | Samples are filtered and transformed with an FFT into a range-Doppler map. |
| Detect | SIMULATED · radar testbed | CFAR sets the threshold from the local noise, so the false-alarm rate stays constant. |
| Estimate | DESIGNED | Pulse features, angle of arrival and the state of the RF environment are estimated. |
| Predict | DESIGNED | Specialist models predict what each signal will do next, with an uncertainty. |
| Decide | PROTOTYPE · rule-based | The scheduler picks the next band, sector and dwell. Today this is fixed rules. |
| Scan again | DESIGNED | The receiver is reconfigured and the loop repeats. |

- **Flowchart figure** (`<figure id="how-flow">`). It contains LoopFlow (≥ 1024 px) and LoopRing (< 1024 px). Caption: "The full loop, with the status of every stage." Then "View as table".
- **Flowchart nodes** (`claims.flow`, 15, in flow order):

| id | label | status (provenance) | role |
|---|---|---|---|
| env | RF environment | DESIGNED | The simulated world: emitters, noise and interference. |
| emitters | Emitters (E1–E8) | DESIGNED | Signal sources with timing, frequency and scan patterns. |
| prop | Propagation | DESIGNED | Path loss, fading and multipath between emitter and receiver. |
| antenna | Antenna / array | DESIGNED | One or more channels; several are needed for angle of arrival. |
| rx | Receiver | DESIGNED | Tunes to one band and sector per dwell. |
| adc | ADC | DESIGNED | Turns the received signal into samples. |
| ddc | Digital down-conversion | DESIGNED | Shifts the band of interest to baseband. |
| dsp | DSP / FFT | SIMULATED (radar testbed) | Filtering and spectral analysis; range-Doppler in SARRS. |
| cfar | CFAR detection + tracking | SIMULATED (radar testbed) | Adaptive threshold, then tracks kept across scans. |
| pdw | PDW / features | DESIGNED | Each detection becomes a compact observation record. |
| aoa | Angle of arrival | DESIGNED | Direction from phase or time differences between channels. |
| envest | Environment estimate | DESIGNED | Noise floor, occupancy and interference level. |
| ai | AI | DESIGNED | Cluster and skill selection, then only the models needed. |
| pred | Prediction + uncertainty | DESIGNED | What each signal is likely to do next, and how sure we are. |
| sched | Scheduler | PROTOTYPE (rule-based) | Chooses the next band, sector and dwell. |
| rxctl | Receiver control | PROTOTYPE (rule-based) | Applies the new configuration; the loop closes. |

  That is 16 rows. The AoA/environment pair shares one slot, so the SVG shows 15 positions with 16 boxes. HOW-02's "tracking SIMULATED" is covered by the `cfar` node.
- **Callouts (HOW-05)**, two side-by-side panels, each tagged `DESIGNED · design principle`:
  - **Exploration vs exploitation:** Exploitation spends more scan time where activity is likely. Exploration keeps checking quiet bands so that new emitters are found. A scheduler that only exploits misses new emitters; one that only explores is a fixed sweep again. (master doc §28)
  - **Ground truth vs observation:** The simulator knows every emitter's true frequency, direction and state. The prediction models see only what the receiver measured. Ground truth is used to score results, never as an input. (master doc §26)

### 03 What we built (`#built`)
- **Headline:** The detection testbed runs today. / The smart scan builds on it.
- **Lede:** Our MATLAB code runs a radar-side signal-processing and detection testbed on synthetic targets. These are the pieces that run today, and the results they produced.
- **SARRS banner** (`<aside id="built-sarrs">`, BUILT-01): "Our simulation code is named SARRS internally: Self-Adaptive Reconfigurable Radar Receiver System. It models a radar DSP chain (range-Doppler processing, CFAR detection and tracking) on synthetic targets, and we use it as the signal-processing and detection testbed. The Electronic Support parts come next on the roadmap: passive intercept, PDW extraction, angle of arrival and the smart-scan scheduler. They are designed, not yet built." The expansion was verified in `Run_Final_SARRS_Demo.m`, line 9.
- **"What runs today"** (`<ul id="built-modules">`, BUILT-02). Group tag: `SIMULATED · synthetic targets`. Name in mono, linked to the file at the pinned commit. Purposes come from each file's header:

| name | path (`04_MATLAB/…`) | purpose |
|---|---|---|
| FiveTargetRadarEchoSimulator | DSP/FiveTargetRadarEchoSimulator.m | Simulates radar echoes from five synthetic targets. |
| PulseCompression | DSP/PulseCompression.m | Matched filter that compresses each received pulse. |
| MTI and MTD | DSP/MTI.m, DSP/MTD.m | Suppress stationary clutter and separate moving targets by Doppler. |
| RangeDopplerCFAR | DSP/RangeDopplerCFAR.m | Builds the multi-PRF range-Doppler map and runs CFAR on it. |
| CFARDetector2D | DSP/CFARDetector2D.m | Two-dimensional cell-averaging CFAR detector for range-Doppler data. |
| AdaptiveCFAR | DSP/AdaptiveCFAR.m | Adaptive CA-CFAR that keeps one detection per target. |
| CFAR_FiveTargetRadar | DSP/CFAR_FiveTargetRadar.m | Runs 2-D CA-CFAR on the five-target scenario and exports the results table. |
| MultiPRFAmbiguityResolver | DSP/MultiPRFAmbiguityResolver.m | Resolves range and velocity ambiguity across several PRFs. |
| KalmanTracker | DSP/KalmanTracker.m | Range-velocity Kalman filter for each track. |
| TrackManager and TargetAssociation | DSP/TrackManager.m, DSP/TargetAssociation.m | Keeps tracks across scans and matches new detections to them. |
| SARRS_Telemetry | DSP/SARRS_Telemetry.m | Collects system-level telemetry from every scan. |

  "five" and "2-D" appear in prose. "five" is a word, not a digit; the scenario name is tied to the SIMULATED group tag. The digit rule allows "2-D".
  Deliberately **omitted:** the empty stubs (81 files); the PPI and trajectory display code (no exports yet); the Monte Carlo and SNR scripts (see the note); the `Core/` main engine, whose header says "Smart AI Radar Research Simulator" and would put "AI" beside SIMULATED.
- **Results** (`<div id="built-results">`, BUILT-03):
  - Metrics row via `Metric`: "Targets detected" `{detected} of {total}`; "Largest range error" `{maxAbsRangeError}` m; "Largest velocity error" `{maxAbsVelocityError}` m/s. All `SIMULATED · CFAR_Performance_Table.csv`.
  - Then `<ResultTable dataset="cfar-a" />`, whose caption carries the title, the scenario, the StatusTag and the source path.
- **Held-back note** (`<p id="built-snr">`): "The repo also holds a repeated-run table and an SNR sweep. The repeated runs used one fixed scenario and produced identical output, so we do not show them as a spread of results. The SNR sweep is held back until the team confirms how SNR is defined in the script." (no digits)
- **Plots** (`<div id="built-plots">`, BUILT-04), 5 `Figure`s, all SIMULATED with their repo paths. Keep numbers out of the alt text:
  1. `CFAR_Threshold_Analysis/04_CFAR_Complete_Analysis.png`. Caption: "From range-Doppler map to CFAR threshold to detections." Alt: "Three MATLAB panels: the range-Doppler map, the CFAR threshold surface and the resulting detection map."
  2. `DSP/FiveTarget_RangeDoppler_Map_Annotated.png`. Caption: "Range-Doppler map with the five synthetic targets marked." Alt: "Annotated range-Doppler map with five labelled target peaks."
  3. `CFAR_Performance/Expected_vs_Detected_Range.png`. Caption: "Expected and detected range for each target."
  4. `CFAR_Performance/Expected_vs_Detected_Velocity.png`. Caption: "Expected and detected velocity for each target."
  5. `CFAR_Performance/Range_Velocity_Errors.png`. Caption: "Range and velocity error for each target."

  Plots 3–5 get `table` = the cfar-a TableDisclosure ("View as table"). Do not crop or recolour; "SARRS" stays visible in the titles.
- **Rule-based baseline** (`<section-like div id="built-baseline">`, BUILT-06). Heading: "Rule-based decision logic: our baseline". Tag: `PROTOTYPE · rule-based`. Intro: "These modules follow fixed, hand-written rules. We keep them as the baseline that the designed scheduler in section 04 will be measured against."

| name | path | purpose (read from code) |
|---|---|---|
| ThreatClassifier | 04_MATLAB/AI/ThreatClassifier.m | Scores each track by range, speed and track confidence, then labels it high, medium or low. |
| TargetPriority | 04_MATLAB/AI/TargetPriority.m | Sorts tracks by that score and attaches a recommended action. |
| ScanScheduler | 04_MATLAB/Radar/ScanScheduler.m | Radar resource management: maps each level to a fixed revisit time and dwell time, then orders the scan. |
| CognitiveReceiver | 04_MATLAB/AI/CognitiveReceiver.m | Adjusts receiver gain, filter and mode with fixed rules on environment conditions and the highest threat level. |

  The `AI/` paths sit beside PROTOTYPE, which Phase 2's lint exempts on purpose. No thresholds or times are quoted, so there are no numbers.
- **Dashboard** (`<div id="built-dashboard">`, BUILT-07). Heading: "MATLAB App Designer dashboard". Tag: `PROTOTYPE · simulated data`. `<Placeholder asset="Dashboard screenshots" status="PROTOTYPE" ratio="16/10" />`. Text: "The repo includes a MATLAB App Designer dashboard (Dashboard.mlapp) for the simulated results. Screenshots are pending from the team and will appear in this box."

### 04 What's new (`#new`)
- **Headline:** Pick the cluster, then the skills. / Run only the models that matter.
- **Lede:** The designed scheduler makes two decisions for every observation, then runs only the models those decisions call for. Everything in this section is designed, not yet implemented.
- **Scope line:** From the AVOLITE AI architecture report. Tag: `DESIGNED · AI architecture report`.
- **Two decisions** (`<div id="new-decisions">`, NEW-01), two numbered cards:
  1. **Cluster selection:** "Which signal is this?" JEV + Event/Evidence #1 compares the new observation with a short list of known clusters. It weighs feature, timing and angle evidence and picks the best-supported cluster. If none fits, an agent proposes a new cluster and a person approves it.
  2. **Skill selection:** "What needs analysing now?" JEV + Event/Evidence #2 looks at the chosen cluster and the current observation, and picks only the skills needed now: for example temporal, spatial or relational analysis.
  - Footnote: "JEV is the team's evidence-and-decision mechanism. Its exact maths will be fixed before benchmarking." (report §17)
- **Pipeline figure** (`<figure id="new-pipeline">`, NEW-02): AiPipeline SVG plus the caption "Designed AI pipeline" plus the DESIGNED tag. "View as table" lists: stage | what it does. Stage descriptions:
  - Model router: turns skills into models (temporal → SSM; relational → GNN; spatial and temporal → ST-GNN; several aspects → a combination).
  - GNN: relations among signals, tracks and clusters.
  - SSM: long time sequences such as frequency or PRI evolution.
  - ST-GNN: space and time together.
  - Conditional ensemble: fuses outputs only when more than one model runs.
  - RL decision layer: picks the next sensing action.
  - Human engineer: approves high-impact changes.
  - Scheduler: sets the next receiver configuration.
- **Fast path and escalation** (short paragraph beside the figure): "Known, stable signals take a fast path: the stored cluster, skills and best-validated model are reused, so nothing is relearned. When a prediction and the next observation disagree, the system escalates. It selects more skills, runs more models and fuses them."
- **Prediction vs decision** (NEW-05), two-column callout:
  - "Specialist models and the ensemble: what is likely to happen?"
  - "RL decision layer: what should the receiver do next?"
  - "Keeping them apart means each can be tested on its own."
- **Ablation ladder** (`<ol id="new-ablation">`, NEW-05). Heading: "How we will prove each piece earns its place". Tag: `PLANNED · no results yet`. Intro: "Each step is added only if it measurably beats the step before it, on accuracy and on cost." Steps:
  1. SSM only (baseline)
  2. SSM + GNN
  3. SSM + ST-GNN
  4. GNN + SSM + ST-GNN
  5. Add the conditional ensemble
  6. Add JEV skill and model routing
  7. Add the RL decision loop
  - The step numbers are `<ol>` ordinals, not digits in the text.

### 05 Demo (`#demo`)
- **Headline:** Watch the loop, / then open the results.
- **Lede:** A screen recording of the MATLAB testbed, with chapters. Below it are the exported results and the code, so you can check them yourself.
- **Video box** (`<div id="demo-video">`, DEMO-01): `<Placeholder asset="Demo video" status="PLANNED" ratio="16/9" />`, whose label reads "Demo video · footage pending from the team". Beside it (below it on phones) is `<ol class="chapters">`, headed "Chapters":
  1. Radar scene and set-up
  2. Range-Doppler processing
  3. CFAR detection
  4. Tracking the five targets
  5. Dashboard walkthrough
  - Note under the list: "Chapter titles describe the planned recording. Times are added with the footage."
- **Results** (`<div id="demo-results">`, DEMO-02). Heading: "Explore the exported results". Radio tabs:
  - "CFAR table": ResultTable cfar-a.
  - "Detection maps": Figures `CFAR_Performance/CFAR_Detection_Map.png` and `CFAR_Threshold_Analysis/SARRS_Final_Radar_CA_CFAR_Result.png`.
  - "Expected vs detected": the two expected-vs-detected Figures. These duplicate section 03 Figures; that is fine, and there are no ids to collide.
- **Code** (`<div id="demo-code">`, DEMO-05):
  - Heading: "Open the MATLAB code".
  - `.btn` "Open the AVOLITE repository", linking to `https://github.com/abhishekpj0902-apj/AVOLITE/tree/9b985ca7f8ef99000724f8ce870918a40d0d95c8/04_MATLAB`.
  - `.btn--secondary` "See the result files", linking to `…/tree/<commit>/04_MATLAB/DSP/SARRS_Results`.
  - Mono line: "Entry point: 04_MATLAB/DSP/Run_Final_SARRS_Demo.m". This is a file path, and the digit rule allows paths inside `<code>`.

### 06 Security (`#security`)
- **Headline:** Safeguards by design. / A person stays in command.
- **Lede:** AVOLITE treats every model output as an estimate, not the truth. These are the safeguards in the design.
- **Note** (SECU-01, visible under the lede): "These are design controls from the AI architecture report. They are not yet implemented, and they are not certifications." Tag: `DESIGNED · AI architecture report §15`. The "§15" is a section reference: allowlist `§\d+` in the digit test.
- **Layers** (`<ol id="security-layers">`, `claims.security`, all DESIGNED):
  1. **Provenance and audit trail:** Every prediction and decision records its inputs, model version and skill configuration. Agent recommendations and human changes are logged too.
  2. **Ground truth kept out:** Simulator ground truth is used only to score results. The models see only what the receiver measured.
  3. **Confidence thresholds and fallbacks:** Low-confidence outputs fall back to a conservative path or go to a person for review.
  4. **Protected, versioned cluster profiles:** One unusual observation cannot rewrite a cluster profile. Profiles, the knowledge graph and the model registry are versioned.
  5. **Human approval:** New permanent clusters and other high-impact changes need a person to approve, modify or reject them.
  6. **Simulation before hardware:** A policy or configuration runs in a sandboxed simulation before it may control physical hardware.
  7. **Safe receiver state:** If the control interface fails, the receiver falls back to a safe configuration and reports an explicit error.
- **Failure modes** (`<table id="security-failures">`, caption "What goes wrong, and what catches it", DESIGNED; report §15.1). Phase 4's picker (SECU-02) upgrades this table.

| Failure | What catches it |
|---|---|
| Wrong cluster chosen | Second-stage evidence and confidence checks |
| Wrong skills chosen | Escalation and model-disagreement monitoring |
| Model drift | Performance monitoring against verified outcomes |
| A new, unknown signal | The agent proposes a cluster; a person approves |
| Prediction error | An event triggers deeper analysis |
| Uncertain RL decision | Conservative fallback or human review |
| Interface failure | Safe receiver configuration and an explicit error state |

### 07 Roadmap (`#roadmap`)
- **Headline:** From a simulated testbed / to receiver hardware.
- **Lede:** Where AVOLITE stands, and the order in which we will build the rest. Each phase has to produce evidence before the next one starts.
- **Maturity line:** "Maturity: the detection testbed runs in simulation; the smart-scan layers are designed."
- **Phases** (`<ol id="roadmap-track">`, `claims.roadmap`, each `<li id="roadmap-pN">`):

| id | title | status | outcome |
|---|---|---|---|
| P1 | DSP foundation | SIMULATED | CFAR, range-Doppler and tracking run in the MATLAB testbed on synthetic targets. **WE ARE HERE** (at the end of P1) |
| P2 | ES emitter scene and receiver chain | PLANNED | The emitter classes and the receiver modules that are still stubs. |
| P3 | Angle-of-arrival validation | PLANNED | Estimate the direction of arrival and check it against known reference directions. |
| P4 | Fixed-sweep baseline and intercept metrics | PLANNED | A fixed sequential sweep on the same scenario and budget, scored on intercept rate and intercept time. |
| P5 | AI layer | DESIGNED | Cluster and skill selection with the model router, proven step by step on the ablation ladder. |
| P6 | RL closed loop against the baseline | DESIGNED | The RL scheduler runs the loop in simulation and is compared with the fixed sweep. |
| P7 | SDR receiver hardware | PLANNED | A multi-channel software-defined receiver, human-supervised, after sandboxed simulation. |

  Do not show "to be confirmed" text publicly. The marker placement is the conservative one.

### 08 Why AVOLITE (`#why`)
- **Headline:** The case for adaptive scanning, / and what we still have to prove.
- **Lede:** Adaptive scanning has strong support in the research literature. AVOLITE's design adds evidence-based decisions, compute spent only where things change, and a person in charge. Our own comparison against a fixed sweep is planned for roadmap P4 and P6.
- **Argument cards** (`<div id="why-args">`, WHY-01), 4 cards. Group line: "Designed benefits, not yet measured." Group tag: DESIGNED.
  1. **A fixed sweep wastes dwell.** It gives every band the same time, including bands that are empty or hold nothing of interest.
  2. **A periodic sweep can lock into step** (`id="why-sync"`). When the receiver's sweep and an emitter's scan are both periodic, the two can stay out of step, and that emitter may never be intercepted. See Clarkson below.
  3. **The fast path spends compute only on change.** Known, stable signals reuse their stored cluster, skills and validated model. More models run only when a prediction and a new observation disagree.
  4. **The human stays in command.** The agent proposes new clusters and high-impact changes; a person approves, modifies or rejects them.
- **Comparison** (`<table id="why-compare">`, WHY-02). Caption: "Fixed sweep and AVOLITE, compared by design. No measurements yet." Header tags: fixed sweep = `PLANNED · baseline, roadmap P4`; AVOLITE = `DESIGNED`.

| Aspect | Fixed sequential sweep | AVOLITE adaptive scan |
|---|---|---|
| Dwell allocation | Equal time for every band, in a fixed order | More time where an intercept is likely, with regular checks of quiet bands |
| A new emitter appears | Found only when the sweep reaches it | Flagged as novel; a new cluster is proposed for approval |
| Use of history | None | Cluster profiles and past hits and misses |
| Frequency-agile emitters | Intercepted only when sweep and hop happen to coincide | Temporal and frequency skills follow the pattern |
| Periodic emitters | Can fall into step and keep missing | The dwell pattern changes, so it does not stay in step |
| Compute | Fixed | Fast path for known signals; more analysis only on change |
| Explaining a decision | Simple and predictable | Every decision logs its evidence, models and version |

- **Sources** (`<div id="why-sources">`, WHY-03). Each card has a khaki left rule, **no status tag**, the line "Outside research · not an AVOLITE result", and links `rel="noopener"` with no `target="_blank"`, marked ↗. See "Section 08 citations" below for the text.
- **Closing** (WHY-04, centred): line "AVOLITE: a closed loop that decides where to look next." Buttons: `.btn` "Watch the demo" (`#demo`) · `.btn--secondary` "Back to the start" (`#top`).

### Footer (SHELL-05)
- **Project:** Smart India Hackathon 2026 / Problem Statement 26055: Smart Scan strategy for Electronic Warfare / Team Avoflare. The team ID row is hidden while `TEAM_ID === null`.
- **Code:**
  - "AVOLITE MATLAB repository ↗": https://github.com/abhishekpj0902-apj/AVOLITE
  - "Website source ↗": https://github.com/SandeshSatishhNaik/Avolite_web
- **Status legend:** `<StatusLegend compact />`.
- **Honesty note:** "Results come from the team's MATLAB simulation exports, and each one names its source file. Stages marked designed or planned describe the architecture, not a running system. Items marked illustrative explain an idea and are not results. Outside research is linked and is not an AVOLITE result." Phase 5 appends "Scenes marked AI-generated are mood images only" when images land.
- **Bottom row:** "© 2026 Team Avoflare" · "Created by Sandesh Naik", linking to https://github.com/SandeshSatishhNaik · "Back to the start", linking to `#top`. Render these as separate items, not one dotted string.

### Numbers inventory (every quantity on the page)

| Where | Value(s) | Source | Status |
|---|---|---|---|
| 03 results table, 05 CFAR tab | Target 1–5 expected/detected/error range (m) and velocity (m/s) | `data.ts` dataset `cfar-a` | SIMULATED |
| 03 metrics row | detected 5 of 5; max abs range error 0.5 m; max abs velocity error 0.165 m/s | `derive('cfar-a')` (computed) | SIMULATED |
| 03/05 table caption | scenario "Five synthetic targets at 25–145 m, SARRS radar-echo testbed" | ingest manifest `scenario` | SIMULATED (inside the tagged caption) |
| 01 tally | 1 simulated, 1 prototype, 3 designed, 3 planned | `tally()` over `claims.requirements` (computed) | each count is tagged with its own tier |
| — | **No ILLUSTRATIVE values on `/` in Phase 3** | `claims.illustrative` stays on `/preview/` | — |

Identifiers that are not quantities, and are allowlisted in `numbers.test.mjs`: "SIH 2026", "PS 26055", "© 2026", E1–E8, P1–P7, "JEV + Event/Evidence #1/#2", "2-D", section numbers 01–08 inside `h2 > span`, `§15`, ordered-list ordinals (not text), file paths inside `<code>`/tag provenance, and citation venue/year inside `[data-cite]`.

## Section 08 citations (verified this session)

| # | Citation (render as) | URL | Faithful sentence for the card | Verification |
|---|---|---|---|---|
| 1 | I. V. L. Clarkson, "Optimal periodic sensor scheduling in Electronic Support", Proc. Defence Applications of Signal Processing (DASP), 2005 | https://staff.itee.uq.edu.au/vaughan/Publications/dasp-04a.pdf | "When a receiver's sweep and a radar's scan are both periodic with commensurate periods, the two can stay out of step, so the radar may never be intercepted." | PDF text read. Source text: intercept time "can be infinite … if the periods are commensurate … the two pulse trains are said to be synchronised … the radar of interest may never be intercepted". Venue and date from the author's publication list ("Proc. Defence Appl. Signal Process., March 2005") [VERIFIED: PDF + staff.itee.uq.edu.au/vaughan/Publications/] |
| 2 | I. V. L. Clarkson, "Optimisation of periodic search strategies for electronic support", IEEE Transactions on Aerospace and Electronic Systems, 2011 | https://doi.org/10.1109/TAES.2011.5937264 | "Jointly optimising a receiver's sweep time and its dwell time on each band reduced the maximum and expected intercept times, compared with other periodic and jittered search strategies, in theory and simulation." | Crossref: TAES vol 47 no 3 pp 1770–1784, July 2011. Abstract read from the author's preprint (optsearch.pdf). The abstract's "more than 10%" is **deliberately omitted**: an outside number would need its own treatment, and the claim reads well without it [VERIFIED: Crossref + PDF] |
| 3 | I. V. L. Clarkson, "Sensor scheduling for electronic support to intercept beam-agile radar", IET Radar, Sonar & Navigation, 2019 | https://doi.org/10.1049/iet-rsn.2018.5668 | "For an electronically scanned radar whose beam dwells run in order, the beam schedule looks periodic to the receiver, to a good approximation; when the dwells are shuffled every scan, a Markov-chain model helps guide receiver settings." | Crossref: vol 13 no 9 pp 1556–1567, Aug 2019, abstract read verbatim [VERIFIED: Crossref] |

**Dropped:**
- `10.1049/iet-rsn.2010.0377`: by Winsor and Hughes (IET RSN 2012), not Clarkson; abstract not readable (403).
- Clarkson, El-Mahassni and Howard, "Sensor scheduling in electronic support using Markov chains" (IEE Proc. RSN 2006): exists (Crossref) but the abstract was not read.
- "The arithmetic of receiver scheduling for electronic support" (ResearchGate): not opened. Citation 1 already covers its synchronisation claim.

**Official PS 26055 text:** not found online. Other teams' READMEs paraphrase it and are not authoritative. Keep the PROJECT.md paraphrase, without quotation marks.

## State of the Art

| Old Approach | Current Approach | Impact |
|---|---|---|
| JS tab widgets | radio + `:has()` for no-JS tabs; ARIA tabs as an enhancement | Tabs work with JS off |
| Mermaid/D3 diagrams | Hand-placed inline SVG with `role="img"` + `<desc>` | 0 KB JS, exact tokens |
| `<meter>` progress | A decorative bar plus a text marker | No untagged number |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Phase 2 components ship with the props in "Phase 2 contract" | Contract | The planner adjusts names; content is unaffected |
| A2 | `:has()` is supported in all target browsers (Baseline 2023) | Pattern 4 | Tabs show all panels (still honest) if unsupported |
| A3 | With scripting disabled, `loading="lazy"` images load eagerly | Pitfall 6 | The JS-off screenshot shows blank plates; the 03-05 spec asserts `complete` |
| A4 | The requirement rows A–H, their statuses, the roadmap order and the marker at the end of P1 match the team's view | Copy deck | Wording/status edits in claims.json only |
| A5 | PS 26055 paraphrase (PROJECT.md) is faithful | 01 framing | Swap in the official text when supplied |
| A6 | Receiver control counts as PROTOTYPE (CognitiveReceiver, rule-based) rather than DESIGNED | Flow nodes | One status change |
| A7 | A 450 px footer keeps the scroll-spy test green at 1440×900 | Pattern 6 | Measure in 03-01; shrink the legend if needed |
| A8 | Chapter titles fit what the team will record | 05 | Edit claims.chapters in Phase 5 |

## Open Questions (RESOLVED)

All resolved with defaults (the user is asleep); these are logged for review.

1. **Official PS 26055 wording? (RESOLVED)** It is not findable online. Use the PROJECT.md paraphrase without quotation marks. The requirement-map `ask` column is the PS figures of merit in plain words.
2. **Requirement statuses, roadmap order, marker? (RESOLVED)** Use the SUMMARY.md tables (A SIMULATED, B PLANNED, C PROTOTYPE, D/E/H DESIGNED, F/G PLANNED; P1 SIMULATED with the marker at its end, P2–P4 PLANNED, P5–P6 DESIGNED, P7 PLANNED). No "to be confirmed" text on the page.
3. **SectionHeader vs the Phase 1 h2 regex? (RESOLVED)** Keep the test unchanged. The h2 is the eyebrow ("01 The problem", styled), and the two-line headline is `<p class="headline">`.
4. **Tabs with JS off? (RESOLVED)** Radio + `:has()`. Phase 4 may upgrade to ARIA tabs.
5. **Flowchart vs ring breakpoint? (RESOLVED)** 1024 px: the existing nav breakpoint, and flowchart text is too small below it. The 7-step list with tags shows at all widths.
6. **Where does "tracking SIMULATED" sit? (RESOLVED)** In the "CFAR detection + tracking" node.
7. **Receiver control status? (RESOLVED)** PROTOTYPE · rule-based (CognitiveReceiver). Everything else follows HOW-02.
8. **Clarkson's "more than 10%"? (RESOLVED)** Omit it. The qualitative claim is faithful and avoids an outside number.
9. **Which citations? (RESOLVED)** The three verified ones above. The rest are dropped.
10. **Menu subtitles? (RESOLVED)** Update `site.ts` to the copy-deck list. The Phase 1 tests read `SECTIONS`, so they follow.
11. **Line counts or visualization modules in "What runs today"? (RESOLVED)** No line counts. Leave out PPI/trajectory until exports exist.
12. **Team ID? (RESOLVED)** `TEAM_ID = null` in `site.ts`; the row is hidden.
13. **SNR and Monte Carlo? (RESOLVED)** One honest note (`#built-snr`), no numbers, no charts.
14. **External links? (RESOLVED)** Same tab (no `target="_blank"`), `rel="noopener"` anyway, ↗ glyph plus visible text.
15. **Name the PS sponsor (DRDO)? (RESOLVED)** No. It is not in the project sources, and there is endorsement risk.
16. **Dates in the hero strip? (RESOLVED)** None. The hero stays digit-free except the required eyebrow.
17. **Which metrics in 03? (RESOLVED)** Detected of total, largest range error, largest velocity error (all derived). Means stay in the table disclosure only if Phase 2 exposes them. Not needed.
18. **Chapters without video? (RESOLVED)** A plain `<ol>` (not buttons) plus the note. Phase 5 turns them into seek buttons.
19. **Failure modes in Phase 3? (RESOLVED)** Yes, as a static table. SECU-02 upgrades it in Phase 4.
20. **CSP header? (RESOLVED)** Not in Phase 3. Astro may inline small module scripts, and `script-src 'self'` could break the menu. Phase 6 decides, with hashes.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node | build, node:test | ✓ | 24.21.0 | — |
| Playwright Chromium | JS-off spec, axe | ✓ | 1.63 / chromium-1243 | — |
| Firefox/WebKit browsers | QA-04 (Phase 6) | ✗ | — | Not needed in Phase 3 |
| AVOLITE repo clone | module purposes (done) | ✓ | `9b985ca` at `%TEMP%/avl` | GitHub raw at the pinned commit |
| Phase 2 code (`data.ts`, primitives, `figures.ts`) | every section | ✗ (not executed yet) | — | **Blocking:** Phase 3 starts after Phase 2 |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | node:test (Node 24) + Playwright 1.63 + @axe-core/playwright 4.13 + `astro check` |
| Config file | `playwright.config.ts` (existing, chromium); `package.json` scripts |
| Quick run command | `npm run build && node --test tests/claims.test.mjs tests/numbers.test.mjs tests/sec-*.test.mjs` |
| Full suite command | `npm run build && npm test && npm run check && npm run test:e2e` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| (all claims) | Status enum, counts (8/7/7/7), anchors, AI-word scope, PROTOTYPE "rule-based", one `here` at P1, digit ban, https citations | unit + fixtures | `node --test tests/claims.test.mjs` | ❌ Wave 0 (03-01) |
| Crit. 5 | No digit in `<main>`/`<footer>` text outside `<data data-status>`, tag provenance, `<code>`, `[data-cite]`, `h2>span`, allowlist; every `<data>` has `data-status`; ids unique | dist | `node --test tests/numbers.test.mjs` | ❌ 03-01 |
| DATA-07 ext. | Build fails on deployed/battle-tested/military-grade/neutralise/jamming/guaranteed + existing live/real-time/TODO | build + fixtures | `npm run build` ; `node --test tests/honesty.test.mjs` | ✅ (Phase 2) + extend |
| SHELL-04 | Hero: one h1 "AVOLITE"; eyebrow text; `a[href="#problem"]` "Begin", `a[href="#how"]` "See how it works"; `svg[role=img]` with title/desc; ILLUSTRATIVE tag; no digits except the eyebrow | dist | `node --test tests/numbers.test.mjs` (hero block) + `build.test.mjs` | ❌/✅ |
| SHELL-05 | Footer has legend (6 tiers), honesty note, "Created by Sandesh Naik" linked to github.com/SandeshSatishhNaik, repo link; no team ID row | dist | `node --test tests/numbers.test.mjs` (footer block) | ❌ 03-01 |
| SHELL-05 guard | Footer height keeps scroll-spy green | e2e | `npx playwright test -g "scroll-spy"` | ✅ |
| PROB-01..03 | `#problem` has the framing, a 5-row contrast table, 7 chips, `#problem-legend`, `#problem-map` with 8 rows each carrying a `data-status` tag; tally counts equal the row statuses | dist | `node --test tests/sec-problem-how.test.mjs` | ❌ 03-02 |
| PROB-04 | Every row href resolves to an id in the dist; `:target` rule present in the CSS | dist + e2e | same + `npx playwright test -g "requirement link"` | ❌ |
| HOW-01/02 | `#how-flow` holds `svg.loop-flow[role=img]` with title + desc mentioning every node label; the table lists 16 nodes with StatusTags matching claims | dist | `node --test tests/sec-problem-how.test.mjs` | ❌ 03-02 |
| HOW-04 | At 1440 the flow is visible and the ring hidden; at 390 the reverse; the 7-step list is visible at both | e2e | `npx playwright test -g "loop switch"` | ❌ 03-05 |
| HOW-05 | Both callouts present | dist | sec-problem-how | ❌ |
| BUILT-01..04,06,07 | "SARRS" + "Self-Adaptive Reconfigurable Radar Receiver System" in `#built`; `#built-modules` ≥ 10 li with repo links; ResultTable caption contains `CFAR_Performance_Table.csv` + SIMULATED; ≥ 4 `<picture>` in `#built-plots`; 4 baseline items + "rule-based" PROTOTYPE tag; dashboard placeholder with PROTOTYPE | dist | `node --test tests/sec-built-demo.test.mjs` | ❌ 03-03 |
| DEMO-01/02/05 | 16/9 placeholder + "footage pending"; 5 chapter li; 3 radio tabs; the repo link to github.com/abhishekpj0902-apj/AVOLITE | dist + e2e | sec-built-demo + `npx playwright test -g "result tabs"` (click a label, panel visible, JS off) | ❌ |
| NEW-01/02/05 | Two decision cards; `svg[role=img]` pipeline + DESIGNED tag; prediction vs decision; `#new-ablation` 7 li + PLANNED; no `<data>` in `#new` | dist | `node --test tests/sec-new-why.test.mjs` | ❌ 03-04 |
| SECU-01 | 7 layers, DESIGNED, "not yet implemented"; 7 failure rows | dist | sec-new-why | ❌ |
| ROAD-01/02 | 7 phases P1–P7 with tags; exactly one `aria-current="step"` on `#roadmap-p1` containing "WE ARE HERE"; no `<meter>`/`<progress>` | dist | sec-new-why | ❌ |
| WHY-01..04 | 4 cards; comparison table with ≥ 6 rows, no digits; 3 citation cards each with "not an AVOLITE result" + an https link + `rel` containing noopener; CTAs to `#demo` and `#top` | dist | sec-new-why | ❌ |
| FND-04 | JS disabled at 1440/768/390: all 8 h2 visible, footer visible, no horizontal scroll, all `img` complete; full-page screenshot attached as an artifact (not diffed) | e2e | `npx playwright test tests/phase3.spec.ts` | ❌ 03-05 |
| IMG-01 | Every `<img>` in `/` comes from `_astro/` files derived from `assets/repo` (names start with a repo PNG basename); no other rasters | dist | numbers.test.mjs (img check) | ❌ |
| QA pre-check | axe clean with JS on and off at 1440/768/390 | e2e | `npx playwright test -g "axe"` (extend `axe.spec.ts` with 768 and JS-off) | ✅ extend |

### Sampling Rate
- **Per task commit:** the quick run command (about 20 s).
- **Per wave merge:** `npm run build && npm test && npm run check`.
- **Phase gate:** full suite green, including `npm run test:e2e`, before `/gsd:verify-work`.

### Wave 0 Gaps
- [ ] `tests/claims.test.mjs`: fixtures for each claims rule (03-01)
- [ ] `tests/numbers.test.mjs`: untagged-digit allowlist, unique ids, hero and footer blocks, img provenance (03-01)
- [ ] `tests/sec-problem-how.test.mjs`, `tests/sec-built-demo.test.mjs`, `tests/sec-new-why.test.mjs` (one per wave-2 plan)
- [ ] `tests/phase3.spec.ts`: JS-off full page, loop switch, result tabs, requirement-link `:target` (03-05)
- [ ] Extend `tests/honesty.test.mjs` fixtures for the new banned words (03-01)

## Plan split recommendation

| Plan | Wave | Owns (files) | Requirements | Notes |
|---|---|---|---|---|
| **03-01 Content data, frame, hero, footer** | 1 | `data/claims.json` (all Phase 3 keys, final copy from this deck), `src/lib/data.ts` (schema + getters), `src/lib/anchors.ts`, `src/lib/site.ts` (subtitles, TEAM_ID), `index.astro`, `Base.astro` (footer mount), `global.css` (.btn, `:target`, chip), `sections/*.astro` **stubs** (the section wrapper + final SectionHeader), `Hero.astro`, `viz/PpiScope.astro`, `ui/Footer.astro`, `scripts/honesty.mjs` (new banned words), `tests/claims.test.mjs`, `tests/numbers.test.mjs` | SHELL-04, SHELL-05, (FND-04, IMG-01 scaffolding) | The page is shippable after this plan. Verify the footer height with the scroll-spy spec |
| **03-02 Problem + How** | 2 | `sections/Problem.astro`, `sections/How.astro`, `viz/LoopFlow.astro`, `viz/LoopRing.astro`, `tests/sec-problem-how.test.mjs` | PROB-01..04, HOW-01, HOW-02, HOW-04, HOW-05 | The largest SVG effort |
| **03-03 Built + Demo** | 2 | `sections/Built.astro`, `sections/Demo.astro`, `tests/sec-built-demo.test.mjs` | BUILT-01..04, BUILT-06, BUILT-07, DEMO-01, DEMO-02, DEMO-05 | Heaviest Phase 2 dependency (ResultTable, Figure, Placeholder, figures.ts) |
| **03-04 New + Security + Roadmap + Why** | 2 | `sections/New.astro`, `viz/AiPipeline.astro`, `sections/Security.astro`, `sections/Roadmap.astro`, `sections/Why.astro`, `tests/sec-new-why.test.mjs` | NEW-01, NEW-02, NEW-05, SECU-01, ROAD-01, ROAD-02, WHY-01..04 | Mostly claims-driven lists + one SVG |
| **03-05 Integration verification** | 3 | `tests/phase3.spec.ts`, `tests/axe.spec.ts` (extend), small fix-ups anywhere | FND-04, IMG-01 (close-out), criterion 5 audit | Full-page JS-off screenshots at 3 widths for the verifier |

- Wave 2 plans touch disjoint files, and none of them edits `claims.json`, `index.astro` or `global.css`, so they can run in parallel (worktrees). If a wave-2 plan finds a copy error in claims, it records it for 03-05 instead of editing the shared file.
- **If time is short:** merge 03-05 into each wave-2 plan's verify step, and run the JS-off spec once at the end. Cut order within Phase 3, if the deadline forces it: the ring's SVG (keep the 7-step list), then the AI pipeline SVG (keep its table), then the comparison table. Never cut the requirement map, the CFAR table, the SARRS banner or the footer honesty note.

## Security Domain (ASVS L1, static site)

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No accounts |
| V3 Session Management | no | No sessions |
| V4 Access Control | no | Public content |
| V5 Input Validation / Output Encoding | yes | Inputs are the committed `claims.json` and results JSON, validated with zod. Astro escapes `{expr}`. **No `set:html`** for claims or captions. Citation URLs are validated as `https://` |
| V6 Cryptography | no | (sha256 pinning is Phase 2 integrity, not a security control) |
| V14 Configuration | yes | Existing `_headers` (nosniff, referrer policy). No third-party embeds: no YouTube, no analytics, no CDN fonts (`build.test.mjs` already asserts no googleapis/gstatic). CSP deferred to Phase 6 (Open Question 20) |

### Known Threat Patterns
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Reverse tabnabbing via external links | Tampering | No `target="_blank"`; `rel="noopener"` on all external links (the test asserts it) |
| Misleading claims (untagged numbers, AI words by BUILT) | Repudiation / integrity of claims | claims zod rules, digit allowlist test, dist wording lint |
| XSS through data strings | Tampering | Astro auto-escaping; no `set:html`; no client JS added |
| Third-party tracking/embeds | Information disclosure | None used; the video will be self-hosted in Phase 5 |
| Operationally sensitive content | — | Synthetic scenarios only; no real emitter parameters or named platforms; rule-based thresholds are not quoted |

## Sources

### Primary (HIGH confidence)
- AVOLITE repo clone at `9b985ca7f8ef99000724f8ce870918a40d0d95c8`: `find -size +0` line counts; headers of 18 DSP/tracking/visualization files; full text of `ThreatClassifier.m`, `TargetPriority.m`, `ScanScheduler.m` and `CognitiveReceiver.m` (jammer cases noted); `Run_Final_SARRS_Demo.m` line 9 (SARRS expansion); `CFAR_Performance_Table.csv`; the `SARRS_Results/` listing.
- `AVOLITE_Master_Project_Documentation.md` §1–4, §6, §14–17, §23–30, §38–40, §42–43, §47–52, §56.
- AI Architecture Report text (`%TEMP%/ai_report.txt`), all sections, especially §2.2, §4–10, §11, §14.3, §15, §15.1, §17.
- Project code and tests: `tests/build.test.mjs`, `tests/shell.spec.ts`, `tests/smoke.spec.ts`, `tests/axe.spec.ts`, `tests/tokens.test.mjs`, `src/lib/site.ts`, `src/layouts/Base.astro`, `src/styles/*`, `astro.config.mjs`, `public/_headers`.
- Planning: REQUIREMENTS.md, ROADMAP.md, PROJECT.md, STATE.md, research/SUMMARY, FEATURES, DESIGN, PITFALLS, and `02-RESEARCH.md`.
- Citations:
  - Clarkson, dasp-04a.pdf (text extracted with pypdf) and the author's publication list https://staff.itee.uq.edu.au/vaughan/Publications/
  - Clarkson, optsearch.pdf (abstract extracted)
  - Crossref API records for `10.1109/TAES.2011.5937264`, `10.1049/iet-rsn.2018.5668` (with abstract), `10.1049/iet-rsn.2010.0377` (Winsor & Hughes) and `10.1049/ip-rsn:20050055`

### Secondary (MEDIUM confidence)
- WebSearch: IEEE Xplore document 5937264 listing (volume/pages, confirmed by Crossref); other teams' public READMEs for PS 26055 (paraphrases only; not used as a source of wording).

### Tertiary (LOW confidence)
- `:has()` baseline status and lazy-loading-with-scripting-disabled behaviour (training knowledge; checked by the 03-05 spec).

Context7 was not needed. Phase 3 introduces no new library API; Astro `<Picture>` and zod behaviour were verified by the Phase 2 spikes against the installed packages.

## Metadata

**Confidence breakdown:**
- Copy deck and content facts: HIGH. Every module purpose, status and design statement traces to a file or document section read this session.
- Citations: HIGH for the three kept (full text or Crossref abstract read).
- Architecture and plan split: HIGH for the constraints from existing tests; MEDIUM for the Phase 2 props (not yet built).
- Pitfalls: HIGH (the lint segmentation, the h2 regex and the scroll-spy footer interaction were read from the code).

**Research date:** 2026-10-01
**Valid until:** 2026-10-02 (deadline). Revisit if the team supplies the official PS text, assets or new evidence.
