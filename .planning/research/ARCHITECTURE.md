# Architecture Research

**Domain:** Static single-page engineering storytelling site (SIH 2026 judges), Cloudflare Pages
**Researched:** 2026-09-30
**Confidence:** HIGH for structure, data flow and build order (standard static-site patterns, checked against the real repo exports). MEDIUM for R2 video details (from Cloudflare docs as I remember them, not re-fetched).

Assumed stack (STACK.md makes the final call): Astro 7.x (npm shows `astro@7.3.5`), static output, TypeScript, plain CSS custom properties, GSAP 3.15 (`gsap@3.15.0`; all plugins free) loaded on the page as one script. The architecture below is mostly stack-agnostic. Any static generator with components and a build step could use the same boundaries.

---

## Standard Architecture

### System Overview

```
 BUILD TIME (node)                                              RUNTIME (browser)
┌──────────────────────────────────────────────┐
│ SOURCE LAYER (in repo, committed)            │
│  data/raw/*.csv   (copied from AVOLITE repo) │
│  data/claims.json (hand-written: status tags,│
│                    illustrative values, cites)│
│  src/assets/repo/*.png  src/assets/ai/*.webp │
│  public/video/chapters.vtt  (video -> R2)    │
└──────────────┬───────────────────────────────┘
               │ scripts/ingest.mjs (CSV -> JSON, records sha256 + file name)
               ▼
┌──────────────────────────────────────────────┐
│ DATA LAYER                                   │
│  src/data/results.json  (generated, committed)│
│  src/lib/data.ts  zod schema + honesty rules │──── build FAILS on a violation
│    exports typed getters: dataset(), claim() │
└──────────────┬───────────────────────────────┘
               │ typed imports only (no component reads JSON directly)
               ▼
┌──────────────────────────────────────────────┐        ┌───────────────────────────────┐
│ PRESENTATION LAYER (server-rendered HTML)    │        │ ENHANCEMENT LAYER (JS, opt.)  │
│  layouts/Base  ─ Header ─ Footer             │  HTML  │  scripts/main.ts  (one entry) │
│  sections/01..08 (one file each) + Hero      │ ─────▶ │   ├ motion/*.ts  (GSAP, per   │
│  ui/ primitives (StatusTag, Metric, Figure,  │ data-* │   │   section, matchMedia)    │
│      SectionHeader, Placeholder, Tabs, ...)  │ hooks  │   └ widgets/*.ts (tabs, slider│
│  viz/ SVG charts + diagrams (final state)    │        │       carousel, video chaps,  │
└──────────────────────────────────────────────┘        │       loop explainer, menu)   │
                                                        └───────────────────────────────┘
                                                                     │ fetch (range requests)
                                                                     ▼
                                                        ┌───────────────────────────────┐
                                                        │ Cloudflare R2 (demo video MP4) │
                                                        └───────────────────────────────┘
```

Data flows only downward and rightward. Raw exports go to JSON, JSON goes through the validator, the validator feeds components, components emit HTML, and JS enhances that HTML. Nothing flows back. The browser never loads CSV or JSON.

### Component Responsibilities

| Component | Owns | Talks to | Implementation |
|-----------|------|----------|----------------|
| `scripts/ingest.mjs` | Turning the AVOLITE repo CSVs into `results.json`: column mapping, unit fields, source file name, sha256, run timestamp from the file name | reads `data/raw/`, writes `src/data/results.json` | Node script, no deps (split on commas; these CSVs have no quoting) |
| `data/claims.json` | Everything that is not a repo export: status of each component and requirement, illustrative example values, outside citations | read by `src/lib/data.ts` | Hand-edited JSON |
| `src/lib/data.ts` | Schema, honesty rules and derived values (means, max error, pass counts). It is the only module that imports JSON. | imported by sections and viz | zod `parse` at module load; throwing fails `astro build` |
| `layouts/Base.astro` | `<head>`, fonts, tokens, skip link, `<noscript>`-safe defaults, one `<script>` for `main.ts` | Header, Footer, slot | Astro layout |
| `ui/*` primitives | Visual vocabulary, fed through props only, with no data imports | used by sections | Astro components, scoped CSS |
| `viz/*` | SVG charts and diagrams rendered in their final state; they expose `data-*` hooks for motion | get typed data via props from sections | Astro + inline SVG; hand-written scales (no chart lib) |
| `sections/*` | One section each: copy, layout, and choosing which data to show | `lib/data.ts`, ui, viz | One `.astro` file per section |
| `scripts/main.ts` | Boot: feature checks, `gsap.matchMedia()`, calling each section's motion `init` and each widget's `init` | motion/*, widgets/* | Single module, bundled by Vite |
| `motion/*` | Per-section timelines built from the rendered final state | DOM `data-motion` hooks only | GSAP + ScrollTrigger |
| `widgets/*` | Interaction that is not decorative (tabs, before/after, carousel, video chapters, mobile menu, loop explainer) | DOM `data-widget` hooks only | Vanilla TS, no GSAP dependency |

---

## Page / Section Breakdown

The order comes from PROJECT.md. Each section is one file, and each one depends only on the shell, the primitives and `lib/data.ts`. That is what lets sections be built in parallel.

| # | Section file | Content blocks | Primitives / viz used | Data used |
|---|--------------|----------------|-----------------------|-----------|
| — | `Hero.astro` | Name, tagline, one-liner, 2 CTAs (anchor links), radar/beam SVG | `RadarScene` (viz), `.btn` | none (no numbers in the hero) |
| 01 | `Problem.astro` | SIH 26055 framing, "today vs asked for" contrast, requirement map | `SectionHeader`, `CompareTable`, `RequirementMap`, `StatusTag` | `claims.requirements[]` |
| 02 | `HowItWorks.astro` | Closed loop Observe → … → Scan again, with per-stage detail | `LoopDiagram` (viz, SVG ring), `StageList` | `claims.components[]` (status per block) |
| 03 | `WhatWeBuilt.astro` | DSP chain, CFAR, range-Doppler, five-target sim, AI modules, dashboard; carousel of built pieces; result tables and plots | `Carousel`, `Figure`, `ResultTable`, `Metric`, `BeforeAfter` (raw RD map vs CFAR detection map), `Placeholder` (dashboard screenshots are pending) | `results.datasets.*`, `claims.components[]` |
| 04 | `WhatsNew.astro` | JEV + Evidence two-stage selection, model router, ensemble, RL, human-in-the-loop, fast path vs escalation | `Tabs`, `FlowDiagram` (viz), `StatusTag` (all DESIGNED) | `claims.aiArchitecture[]` |
| 05 | `Demo.astro` | Chaptered video, in-browser loop explainer, exported-results view, repo links | `VideoPlayer`, `LoopExplainer` (widget over `LoopDiagram`), `ResultTable`, `Placeholder` | `results.datasets.*`, `claims.video` |
| 06 | `Security.astro` | Provenance, audit trail, ground-truth separation, human approval, thresholds and fallbacks, sandbox before hardware, failure modes table | `Tabs` or layered list, `FaultTable` | `claims.security[]`, `claims.failureModes[]` |
| 07 | `Roadmap.astro` | Phases from simulation to hardware and closed loop, "we are here" marker | `Timeline` | `claims.roadmap[]` (one entry has `current: true`) |
| 08 | `WhyAvolite.astro` | Adaptive vs fixed sweep, with cited outside sources kept visually apart | `CitationCard` (always carries "not an AVOLITE result"), `CompareTable` | `claims.citations[]` |
| — | `Header.astro` / `Footer.astro` | Numbered nav with 8 anchors, mobile menu with subtitles, progress; project facts, code links, data-honesty note, credit | `SectionNav`, `MobileMenu` widget | `site.ts` constants |

`SectionNav` and `MobileMenu` read the same `SECTIONS` array in `src/lib/site.ts` (id, number, title, subtitle). Every section's anchor id comes from that array, so the nav and the sections cannot drift apart.

---

## Shared UI Primitives

These have to exist before section work starts. Keep them small and prop-driven. None of them imports data.

| Primitive | Props (contract) | Behavior / rules |
|-----------|------------------|------------------|
| `StatusTag` | `status: 'BUILT'\|'SIMULATED'\|'PROTOTYPE'\|'DESIGNED'\|'PLANNED'\|'ILLUSTRATIVE'`, `size?` | Text, not color alone: label, icon and a token color. Each value has a fixed tooltip or `title` defining it. There is also an `AI-GENERATED` image tag variant. |
| `SectionHeader` | `n: '01'`, `title`, `lede`, `id` | Renders `<h2 id>` with the number in mono. It is the anchor target for nav. |
| `Metric` | `value: number\|null`, `unit`, `label`, `status`, `precision`, `source?` | Required `status`. `ILLUSTRATIVE` renders a different treatment (outlined, lower weight, "example" prefix), so it never looks measured. `null` renders "Pending". The real value sits in the DOM, and any count-up animates from it. |
| `Figure` | `src` (ImageMetadata) or `placeholder`, `alt`, `caption`, `status`, `source` (repo path), `ratio` | `<figure>` + `<figcaption>`, with the source path shown in mono. A fixed `aspect-ratio` means swapping in a placeholder causes no layout shift. |
| `Placeholder` | `kind: 'image'\|'video'\|'data'`, `ratio`, `label`, `expected` (what arrives, e.g. "Dashboard screenshot") | Same box as the final asset. Visibly marked "Pending asset", never lorem ipsum. |
| `ResultTable` | `dataset` (typed), `columns[]`, `caption`, `status` | `<table>` with `<caption>`, units in the headers, and tabular numerals. The source file and sha short hash go in the footer row. |
| `VideoPlayer` | `src` (R2 URL) or placeholder, `poster`, `chapters: {t, title}[]`, `captions?` | Native `<video controls preload="none">`. The chapter list is `<ol>` of buttons, and each seeks to its time. Also adds a `<track kind="chapters">`. With JS off it degrades to plain controls plus a static chapter list with timestamps. |
| `Tabs` | `items: {id, label, content slot}[]` | Server-renders all panels stacked with headings (works without JS). The widget upgrades them to the ARIA tabs pattern (roving tabindex, arrow keys). |
| `Carousel` | slot of cards | CSS `scroll-snap` row that is native and swipeable. The widget only adds prev/next buttons and a "3 / 7" counter. Without JS it is still a scrollable row. |
| `BeforeAfter` | `before`, `after` (images), `labels` | Both images stacked, and a native `<input type="range">` drives a CSS var `--pos` → `clip-path: inset(0 calc(100% - var(--pos)) 0 0)`. That gives keyboard support for free. Without JS the two render side by side (a `.no-js` or `:not(.js)` fallback). |
| `CitationCard` | `source`, `url`, `claim`, `year` | Always prints "Outside research, not an AVOLITE result". |
| `.btn`, `.btn--secondary` | CSS classes | Not components. |

---

## Data Layer

### What the real exports look like (inspected in the AVOLITE repo, `04_MATLAB/`)

| File | Shape | Notes that drive the schema |
|------|-------|-----------------------------|
| `DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv` | 5 rows: `Target, ExpectedRange_m, DetectedRange_m, RangeError_m, ExpectedVelocity_mps, DetectedVelocity_mps, VelocityError_mps` | Scenario A: targets at 25/50/75/110/145 m. Range error is ±0.5 m. |
| `DSP/SARRS_Results/CFAR_Threshold_Analysis/FINAL_DEMONSTRATION/SARRS_Final_Target_Table.csv` | 5 rows: `Target, Range_m, Velocity_mps, Power_dB` | The same scenario A detections, with relative power |
| `SARRS_Results/FiveTarget_PerformanceTable_20260914_011431.csv` (top-level `04_MATLAB/SARRS_Results/`) | 5 rows: `TargetID, TrueRange_m, TrueVelocity_mps, Detected, RangeError_m, VelocityError_mps` | **A different scenario B**: 75/150/225/300/375 m. Range error goes up to 1.76 m. |
| `SARRS_Results/FiveTarget_DetectionTable_*.csv` | `RangeBin, DopplerBin, Range_m, Doppler_Hz, Velocity_mps, Power` | Scenario B, with raw linear power |
| `DSP/SARRS_Results/MonteCarlo_PerformanceTable_20260914_011821.csv` | 100 rows: `Run, DetectionProbability, DetectedTargets, TotalPeaks, FalseAlarms, RangeRMSE_m, …` | **All 100 rows are identical.** The run looks deterministic (fixed seed or no noise variation). |
| `DSP/SARRS_Results/SNR_Sweep_PerformanceTable_*.csv` (3 files) | 16 rows each. The oldest file has `SNR_dB, …`; the newer two have `RequestedSNR_dB, MeasuredSNRMean_dB, MeasuredSNRStd_dB, …` | **The schema changed between runs.** The two newest files are byte-identical in size. `DetectionProbability_percent` is in 0–100 here, but `DetectionProbability` in the Monte Carlo file is in 0–1. |
| `*.mat` | Binary | Not ingested. Anything needed from a MAT file is exported to CSV in MATLAB first (MAT v7.3 is HDF5, and a JS parser is not worth it for a 2-day build). |
| `*.png` (8 in `CFAR_Performance` + `CFAR_Threshold_Analysis`, 30–160 KB each, plus the annotated RD map) | Figures | They go through the image pipeline, tagged SIMULATED and linked to their source path. |

What this means for the schema: key every dataset by **scenario + source file**, never just by "five-target". Store units explicitly, and normalize probabilities to one convention (0–1) at ingest. Never average across files.

### Schema (one file, two sources, one validator)

```ts
// src/lib/data.ts  (sketch)
import { z } from 'astro/zod';            // or 'zod'
import results from '../data/results.json';
import claims  from '../../data/claims.json';

export const Status = z.enum(['BUILT','SIMULATED','PROTOTYPE','DESIGNED','PLANNED','ILLUSTRATIVE']);

const Source = z.object({
  repo: z.literal('abhishekpj0902-apj/AVOLITE'),
  path: z.string(),                        // 04_MATLAB/DSP/SARRS_Results/...
  sha256: z.string().length(64),
  commit: z.string().optional(),
  runAt: z.string().optional(),            // parsed from _YYYYMMDD_HHMMSS
});

const Dataset = z.object({
  id: z.string(),                          // 'cfar-scenario-a'
  title: z.string(),
  status: z.enum(['SIMULATED','BUILT']),   // repo exports can never be ILLUSTRATIVE
  source: Source,
  scenario: z.string(),                    // disambiguates A vs B
  columns: z.array(z.object({ key: z.string(), label: z.string(), unit: z.string().nullable() })),
  rows: z.array(z.record(z.number().nullable())).min(1),
  note: z.string().optional(),             // e.g. "100 runs produced identical results"
});

const Illustrative = z.object({             // numbers from docs, never from the repo
  id: z.string(), value: z.number(), unit: z.string(),
  status: z.literal('ILLUSTRATIVE'),        // the ONLY allowed tier
  from: z.string(),                         // "Master doc §31"
});

export const data = z.object({ datasets: z.array(Dataset), /* … */ })
  .superRefine(rules)                       // cross-field honesty rules below
  .parse({ ...results, ...claims });        // throws => astro build exits non-zero
```

### Honesty rules enforced at build (the build fails, it does not warn)

1. Every dataset has a `source.path` and `sha256`. `scripts/verify-raw.mjs`, run in `prebuild`, re-hashes `data/raw/*` and must match, so a CSV edited by hand after ingest fails the build.
2. A dataset's `status` is `SIMULATED` or `BUILT`, never `ILLUSTRATIVE`. Illustrative values live in a separate `illustrative[]` array whose status is the literal `ILLUSTRATIVE`. The type system stops the two from mixing.
3. `Metric` requires a `status` prop (TypeScript). A lookup helper `metric(id)` returns `{value, unit, status, source}` together, so a component cannot get a number without its tag.
4. Derived values (mean, max |error|, detections/total) are computed in `data.ts` from `rows` and are never typed in by hand.
5. Consistency checks: `RangeError_m ≈ Detected − Expected` (±1e-6) where both columns exist, and probabilities in [0, 1] after normalization.
6. Degenerate data gets a note. If every row in a dataset is identical (Monte Carlo), `ingest` sets `note: "All N runs identical"`, and the UI must show it instead of implying variance.
7. `Placeholder` is the only allowed rendering for a claim or asset marked `pending: true`.

A `tests/data.test.mjs` (run with `node --test`) contains one fixture per rule that must fail. Rules without a failing test tend to get weakened.

### Why not Astro content collections for this

`file()` loader + zod validates **per entry** (confirmed in the Astro docs via Context7), but the honesty rules are cross-field and cross-array. A plain `data.ts` that parses one object with `superRefine` is simpler and fails the build the same way. Content collections are worth it only if the claims grow into many MD files, which they won't in 2 days.

---

## Asset Pipeline

| Asset class | Location | Processing | Delivery | Tag |
|-------------|----------|------------|----------|-----|
| Repo plots (MATLAB PNGs) | `src/assets/repo/<path-mirroring-repo>.png` | Astro `<Picture>`: AVIF + WebP + PNG fallback, `widths` for 390/768/1440, intrinsic width/height (no CLS) | Pages static | SIMULATED + source path in the caption |
| Dashboard screenshots (pending) | `src/assets/repo/dashboard/` | same | same | BUILT or PROTOTYPE, whichever the user confirms |
| AI scene images | `src/assets/ai/*.webp` | `<Picture>`, `loading="lazy"` except the hero, `fetchpriority="high"` on the LCP image only | Pages static | AI-GENERATED badge on the image, plus `alt` naming it as an illustration |
| Diagrams, charts, radar | inline SVG in `viz/` | none (code) | inline HTML | status of the thing drawn |
| Demo video | Cloudflare **R2** bucket on a custom domain (e.g. `media.<domain>`), or a Pages static file if it is under 25 MiB (the Pages per-file limit, MEDIUM confidence) | H.264 MP4 at 1080p/720p, `-movflags +faststart`, poster JPG in `src/assets` | `<video preload="none" poster>`; R2 serves range requests | Chapters file: `public/video/chapters.vtt` (also parsed at build into the chapter list) |
| Logo | `src/components/ui/Logo.astro` from a cleaned `logo.svg` | one-off cleanup script | inline SVG | — |

Rules:
- **Mirror repo paths** under `src/assets/repo/`, so the caption's source path equals the file path. One helper, `figure(id)`, returns image, alt, caption, status and source together.
- An **asset manifest** (`data/assets.json`: id, ratio, alt, status, `pending`) lets sections reference assets by id. A pending asset renders `Placeholder` with the same `ratio`. When the real file arrives, drop it in, flip `pending`, and the layout does not change.
- Do **not** use the R2 `r2.dev` public URL in production. Cloudflare documents it as rate-limited and meant for development (MEDIUM, verify when setting up). Bind a custom domain on the Cloudflare zone.
- R2 needs no CORS for plain `<video src>` playback. It does if you ever `fetch()` the file or use `crossorigin` for captions from another origin. Serve the VTT from Pages (same origin) to avoid that.

---

## Motion Layer

### Structure

```
src/scripts/main.ts         // the ONLY <script> on the page
  ├─ document.documentElement.classList.add('js')
  ├─ widgets: import './widgets/*'  → init every [data-widget] (always, no motion needed)
  └─ motion:  const mm = gsap.matchMedia();
       mm.add({ full: '(prefers-reduced-motion: no-preference) and (min-width: 768px)',
                small: '(prefers-reduced-motion: no-preference) and (max-width: 767px)',
                reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
         const { full, small, reduce } = ctx.conditions;
         if (reduce) return;                       // DOM is already in its final state
         hero(ctx); howItWorks(ctx, { pin: full }); built(ctx); demo(ctx); roadmap(ctx);
       });                                          // matchMedia reverts everything on change
src/scripts/motion/<section>.ts   // export function init(ctx, opts) { … return cleanup }
```

### Rules

- **One entry script.** Sections do not ship their own `<script>`s, which avoids duplicate GSAP registration and ordering bugs. Motion modules can use dynamic `import()` for heavy parts (e.g. MorphSVG) behind the `full` condition.
- **Animate from the final state.** Write `gsap.from()` or `fromTo()` against server-rendered markup. With JS off, when reduced motion is on, or if an error is thrown, the page is still complete.
- **Per-section timelines**, each owned by one module and triggered by its own ScrollTrigger. No global master timeline, because that couples every section to every other.
- **Mobile branch:** no pinning, no scrubbed storyboards, and at most simple one-shot reveals tied to signal activity.
- **Offscreen pause:** loops (radar sweep, beam) use `ScrollTrigger.create({ trigger, onToggle: s => s.isActive ? tl.play() : tl.pause() })`, or an IntersectionObserver if GSAP isn't on that element. Also pause on `document.visibilitychange`. The hero radar gets a visible pause button (WCAG 2.2.2).
- **The scan → detect → process → lock story** is split across Hero (scan), 02 (process loop) and 03/05 (detect/lock). Each piece stands alone, so a section can be reordered or cut without breaking another's motion.
- Only transform, opacity and SVG stroke properties. Glow is a pre-blurred duplicate path whose opacity animates.

### Interactive widgets (separate from motion)

Tabs, BeforeAfter, Carousel, VideoPlayer chapters, MobileMenu and LoopExplainer are **widgets**, not motion. They run under reduced motion too (only their transitions are removed), and they do not import GSAP. That way a GSAP failure or a reduced-motion user never loses functionality.

`LoopExplainer` (the in-browser smart-scan loop, in 05) steps through the seven stages using the same `LoopDiagram` SVG as section 02, with Prev/Next/Play buttons and an `aria-live` stage description. Without JS, all seven stage descriptions render as an ordered list.

---

## Progressive Enhancement Contract

| Feature | JS off / reduced motion | JS on |
|---------|------------------------|-------|
| Nav | Anchor links; `<details>` mobile menu (native disclosure) | Scroll-spy active state, focus trap in the menu, close on Esc |
| Tabs | All panels stacked with headings | ARIA tabs |
| Carousel | Scroll-snap row | + buttons and counter |
| Before/after | Side-by-side images | Range-input slider |
| Video | Native controls + static chapter timestamps | Clickable chapters, active chapter highlight |
| Charts | Final SVG + `<details>` "View as table" | Draw-on animation |
| Metrics | Real value | Optional count-up from the real value |
| Loop explainer | Ordered list of stages | Stepper |

Test: run a Playwright project with `javaScriptEnabled: false` and one with `reducedMotion: 'reduce'`, and assert that every section heading, table and status tag is visible.

---

## Recommended Project Structure

```
data/
├── raw/                     # CSVs copied verbatim from AVOLITE repo (mirrors repo paths)
├── claims.json              # statuses, requirements, AI arch blocks, roadmap, citations, illustrative values
└── assets.json              # asset manifest: id, ratio, alt, status, pending
scripts/
├── ingest.mjs               # raw CSV -> src/data/results.json (+ sha256, notes)
├── verify-raw.mjs           # prebuild: hashes match results.json
└── clean-logo.mjs           # one-off
src/
├── data/results.json        # GENERATED; committed so the build does not need MATLAB
├── lib/
│   ├── site.ts              # SECTIONS[] (id, n, title, subtitle), repo URLs, team facts
│   ├── data.ts              # zod schema + honesty rules + derived values + getters
│   └── scale.ts             # linear scale + path helpers for SVG charts
├── assets/
│   ├── repo/…               # MATLAB PNGs, mirrored paths
│   └── ai/…                 # AI scene images
├── components/
│   ├── ui/                  # StatusTag, SectionHeader, Metric, Figure, Placeholder, ResultTable,
│   │                        # VideoPlayer, Tabs, Carousel, BeforeAfter, CitationCard, Logo,
│   │                        # Header, Footer, SectionNav
│   ├── viz/                 # RadarScene, LoopDiagram, FlowDiagram, RequirementMap, Timeline, ErrorChart
│   └── sections/            # Hero, Problem, HowItWorks, WhatWeBuilt, WhatsNew, Demo, Security, Roadmap, WhyAvolite
├── scripts/
│   ├── main.ts              # single entry
│   ├── motion/              # hero.ts, how-it-works.ts, built.ts, demo.ts, roadmap.ts
│   └── widgets/             # tabs.ts, carousel.ts, before-after.ts, video.ts, menu.ts, loop-explainer.ts, scrollspy.ts
├── styles/
│   ├── tokens.css           # colors, type, spacing, status colors
│   └── global.css           # reset, layout grid, .btn, utilities
├── layouts/Base.astro
└── pages/index.astro        # imports sections in order; nothing else
public/
├── video/chapters.vtt
├── favicon.svg
└── _headers                 # Cloudflare Pages cache headers (immutable for /_astro/*)
tests/
├── data.test.mjs            # honesty rules, one failing fixture each
└── smoke.spec.ts            # Playwright: 3 widths, JS off, reduced motion, axe
```

### Structure Rationale

- **`data/` outside `src/`:** inputs a human edits or copies. **`src/data/` holds generated output only.** That split makes "never hand-edit results.json" obvious.
- **`ui/` vs `viz/` vs `sections/`:** ui = no data, generic; viz = SVG that takes typed data via props; sections = the only layer that calls `lib/data.ts`. Keeping data access in sections makes primitives trivially reusable and easy to review for honesty.
- **`scripts/motion` vs `scripts/widgets`:** decoration vs function. Reduced-motion branches only touch `motion/`.
- **`pages/index.astro` only composes:** each section is an independent file, so parallel work never collides in one big page file.

---

## Architectural Patterns

### Pattern 1: Value carries its tag

**What:** Numbers never travel alone. The getter returns `{value, unit, status, source}`, and `Metric`/`ResultTable` require `status`.
**When:** Every displayed number.
**Trade-offs:** Slightly more verbose props, but an untagged or mis-tagged number becomes a type or build error instead of a review catch.

```astro
---
import { metric } from '../lib/data';
const m = metric('cfar-a.maxRangeError');   // { value: 0.5, unit: 'm', status: 'SIMULATED', source }
---
<Metric {...m} label="Max range error, scenario A" />
```

### Pattern 2: Final state first, motion from it

**What:** The server renders every visual complete. GSAP only uses `from()`, inside `matchMedia`.
**When:** All motion.
**Trade-offs:** You must design the end frame first, which is also the reduced-motion and no-JS frame. That is the point.

### Pattern 3: Same box for placeholder and asset

**What:** `Figure`/`VideoPlayer` take either a real asset or `pending`, and both render in a fixed-`aspect-ratio` box.
**When:** Every asset still pending from the user (video, dashboard screenshots).
**Trade-offs:** You need to know the ratio up front (16:9 for video and screenshots; MATLAB PNGs have their own intrinsic ratio, read at build).

### Pattern 4: Hook attributes, not class selectors, for JS

**What:** JS finds elements by `data-widget="tabs"` and `data-motion="radar-sweep"`, never by styling classes.
**Trade-offs:** None worth mentioning. CSS refactors can't break JS.

---

## Data Flow

### Key Data Flows

1. **Results:** AVOLITE repo CSV → copy to `data/raw/` (mirrored path) → `npm run ingest` → `src/data/results.json` (with sha256 + notes) → `prebuild: verify-raw` → `lib/data.ts` zod + rules → section picks dataset → `ResultTable`/`Metric`/`ErrorChart` → static HTML.
2. **Claims and status:** `data/claims.json` (hand-edited) → `lib/data.ts` → StatusTag on every component, requirement, roadmap phase and AI block.
3. **Assets:** file dropped in `src/assets/…` + `assets.json` entry (`pending: false`) → `figure(id)` → `<Picture>` → optimized files in `dist/_astro/`.
4. **Video:** MP4 uploaded to R2 (outside the build) → URL in `claims.video.src` → `VideoPlayer` → the browser streams from R2 with range requests. Chapters come from the VTT, which is parsed at build into buttons and also attached as `<track>`.
5. **Runtime:** HTML → `main.ts` → widgets (always) + motion (matchMedia branch) → DOM transforms only. No runtime data fetches.

### State Management

None beyond per-widget DOM state (active tab, slider position, current chapter). No framework, no store. The only shared runtime state is the scroll-spy's active section, which updates `aria-current` on the nav links.

---

## Build Order and Parallelism

```
W0  Shell  ──────────────────────────────────────────────┐ (sequential, blocks everything)
    tokens.css, global.css, Base layout, site.ts SECTIONS,
    Header/Footer/SectionNav/MobileMenu (no-JS), index.astro with 9 empty
    section stubs + anchors, Logo cleanup, Cloudflare-ready build

W1  (parallel, all depend only on W0)
    ├─ A  Data layer: ingest.mjs, results.json, data.ts schema + rules, data.test.mjs, claims.json skeleton
    ├─ B  UI primitives: StatusTag, SectionHeader, Metric, Figure, Placeholder, ResultTable,
    │     CitationCard (static), plus Tabs/Carousel/BeforeAfter/VideoPlayer in their no-JS form
    └─ C  Asset intake: copy PNGs into mirrored paths, assets.json, AI image slots (pending)

    B's Metric/ResultTable can build against a hand-typed prop fixture while A lands.
    The contract between them is the Dataset type; agree on it first (30 min).

W2  Sections (parallel, one owner each; need W1 A+B merged)
    ├─ Hero + RadarScene                ├─ 04 WhatsNew  (Tabs, FlowDiagram; claims only)
    ├─ 01 Problem (RequirementMap)      ├─ 06 Security  (claims only)
    ├─ 02 HowItWorks (LoopDiagram)      ├─ 07 Roadmap   (Timeline; claims only)
    ├─ 03 WhatWeBuilt (datasets, figures, BeforeAfter, Carousel)
    ├─ 05 Demo (VideoPlayer placeholder, LoopExplainer static, ResultTable)   ← reuses LoopDiagram from 02
    └─ 08 WhyAvolite (citations)
    => SHIP POINT: complete, honest static site. Deploy a preview here.

W3  Enhancement (parallel after W2; each touches its own module)
    ├─ widgets/*: tabs, carousel, before-after, video chapters, menu, scrollspy, loop-explainer
    └─ motion/*:  main.ts + matchMedia skeleton first (sequential, ~1 h), then hero / howItWorks / built / demo / roadmap in parallel

W4  Asset swap-in (whenever the user delivers: video → R2, dashboard screenshots, team ID). Flip `pending` only; no layout work.

W5  QA: Playwright at 390/768/1440, JS off, reduced motion, axe, Lighthouse, budget check → production deploy only when the user asks.
```

Critical dependencies:
- **05 Demo depends on 02's `LoopDiagram`.** Build LoopDiagram in `viz/` as part of 02 first, or split it out as a W1 viz task if 02 and 05 have different owners.
- **03 and 05 depend on the data layer (A).** 04, 06 and 07 only need `claims.json`, so they can start on the claim skeleton immediately.
- **The motion skeleton (`main.ts` + matchMedia) must exist before any per-section motion module**, or each section invents its own boot code.
- **With a 2-day timeline**, W2 is the real deliverable. W3 motion is the first thing to cut (the widgets' no-JS forms are already usable), and the hero radar plus the loop explainer are the only motion worth keeping if time runs out.

---

## Scaling Considerations

The audience is SIH judges, so traffic is irrelevant. The static site on Cloudflare's CDN handles any realistic load. What actually breaks first:

1. **Page weight:** 8 sections of MATLAB PNGs plus AI scenes plus GSAP on one page. Fix with `<Picture>` + lazy loading below the fold, `preload="none"` video, and GSAP plugins loaded only under `full`.
2. **Section overflow:** if 03 or 04 grows past about 2 screens, split it into `/deep-dive/<topic>` (PROJECT.md allows this). The architecture supports it because sections are already standalone components.

---

## Anti-Patterns

### Anti-Pattern 1: Merging results across runs or scenarios
**What people do:** Show "range error ±0.5 m" next to a five-target table from a different run (scenario A 25–145 m vs scenario B 75–375 m, where errors reach 1.76 m).
**Why it's wrong:** A judge who opens the repo finds numbers that don't match, and trust collapses.
**Do this instead:** Every table, metric and figure names its scenario and source file. Derived values are computed within one dataset.

### Anti-Pattern 2: Presenting identical Monte Carlo runs as a distribution
**What people do:** Say "100 Monte Carlo runs, Pd = 100%" or draw error bars.
**Why it's wrong:** All 100 rows in `MonteCarlo_PerformanceTable_20260914_011821.csv` are identical, which suggests the noise was not re-seeded. Implying statistical spread is inaccurate.
**Do this instead:** Show the auto-generated note "All 100 runs produced identical results" and prefer the SNR sweep, which does vary. Flag it to the team.

### Anti-Pattern 3: Numbers typed into components
**What people do:** Write `<span>0.91</span>` in copy.
**Do this instead:** Every number comes through `lib/data.ts`. A grep check in CI (`/\d+\.\d+\s?(m|dB|%|GHz)/` in `components/`) fails the build on literal results.

### Anti-Pattern 4: Motion that hides content until JS runs
**What people do:** Set `opacity: 0` in CSS and let GSAP reveal it.
**Why it's wrong:** With JS off, a JS error or a slow load, the content is invisible, and SEO/a11y fail.
**Do this instead:** Initial hidden states are set only by `gsap.from()` inside `matchMedia`.

### Anti-Pattern 5: A tabs/carousel/slider library
**Do this instead:** Native `scroll-snap`, `<input type=range>`, `<details>`, `<video>`, each with about 30–60 lines of TS. No dependency needed.

### Anti-Pattern 6: Parsing MAT files in JS
**Do this instead:** Export CSV from MATLAB (the repo already has `Result/exportSARRSResults.m`). Only CSVs cross the boundary.

---

## Integration Points

### External Services

| Service | Integration | Notes |
|---------|-------------|-------|
| Cloudflare Pages | Git integration or `wrangler pages deploy dist` | Static output. Deploy only when the user asks. Use `public/_headers` for long cache on `/_astro/*`. |
| Cloudflare R2 | Public bucket on a custom domain; `<video src>` | Not `r2.dev` in production. Upload the MP4 with `wrangler r2 object put` and `--content-type video/mp4`. |
| GitHub (AVOLITE repo) | Links only, plus pinned `commit` in source metadata | Link to exact file paths at the pinned commit so judges can verify. |
| Fonts | Self-hosted at build (Astro Fonts API, or files in `public/`) | No runtime third-party requests. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| raw CSV ↔ results.json | `ingest.mjs` (one-way), sha256-verified | Re-run it when the team exports new results |
| results.json/claims.json ↔ components | Only through `lib/data.ts` getters | The honesty choke point |
| sections ↔ ui/viz | Props | Primitives never import data |
| HTML ↔ JS | `data-widget` / `data-motion` attributes | JS never generates content |
| motion ↔ widgets | None | Independent; motion may be absent |

## Sources

- AVOLITE repo exports, inspected directly: `04_MATLAB/DSP/SARRS_Results/*.csv`, `04_MATLAB/SARRS_Results/*.csv`, `04_MATLAB/Result/exportSARRSResults.m` (HIGH, primary data)
- Astro content collections, `file()` loader + zod per-entry schema: Context7 `/withastro/docs`, https://docs.astro.build/en/guides/content-collections/ (HIGH)
- npm registry: `astro@7.3.5`, `gsap@3.15.0` (HIGH, queried 2026-09-30)
- GSAP `matchMedia()` / ScrollTrigger `onToggle` patterns: https://gsap.com/docs/v3/GSAPObject/matchMedia/ (HIGH per prior CLAUDE.md usage; re-check in the motion phase)
- Cloudflare R2 public buckets and custom domains; r2.dev rate-limited, for dev only: https://developers.cloudflare.com/r2/buckets/public-buckets/ (MEDIUM, not re-fetched)
- Cloudflare Pages 25 MiB per-file limit: https://developers.cloudflare.com/pages/platform/limits/ (MEDIUM, not re-fetched)
- Reference layouts: https://avoflare-web.pages.dev/, https://aquasol-web.pages.dev/ (per PROJECT.md)
- Earlier project CLAUDE.md (data-honesty zod rules, final-state rendering, matchMedia branches): reused where it fits

---
*Architecture research for: static single-page engineering storytelling site (AVOLITE, SIH 2026)*
*Researched: 2026-09-30*
