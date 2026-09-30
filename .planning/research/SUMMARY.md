# Project Research Summary

**Project:** AVOLITE website (Team Avoflare, SIH 2026, PS 26055 "Smart Scan strategy for Electronic Warfare")
**Domain:** Static single-page engineering storytelling site, judged by skimming evaluators who punish overclaiming
**Researched:** 2026-09-30
**Confidence:** MEDIUM-HIGH (stack, repo audit and contrast numbers are verified; judge behaviour and aesthetic direction are inference)

Detail lives in `STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md` and `DESIGN.md` in this folder. This file resolves their disagreements and gives the roadmapper one set of decisions.

## Executive Summary

AVOLITE is a one-page, honesty-first pitch site with 8 numbered sections plus a hero. Its core value is that a judge can see what is built, what is designed and what is illustrative. The user's own AVOFLARE site is the structural model: numbered sections, status tags, a requirement map, a flowchart, a chaptered demo, layered security, a roadmap with "we are here", and a cited "why". AVOLITE keeps that anatomy and changes the skin completely, to a dark "ES operator console" with Archivo and IBM Plex, a 4 px radius and hairlines. Experts build this kind of site as pre-rendered HTML with every visual in its final state, SVG drawn at build time, small vanilla-TS widgets, and motion as an optional layer on top.

**Recommended approach:** Astro 7 static output, TypeScript 6 and plain CSS tokens. One typed data layer (`data.ts` + zod) is the only path for every number and every status tag. No chart library and no UI framework. Build breadth-first:
1. Shell.
2. Data layer and UI primitives.
3. All 8 sections, static. This is the real ship point.
4. Interactives and motion.
5. Asset swap-in.
6. QA and deploy.

Motion is the first thing cut under deadline pressure. Deploy to Cloudflare Pages only when the user asks.

**The dominant risk is credibility, not technology.** The repo audit shows SARRS is an active-radar DSP testbed (range-Doppler, CFAR, tracking), not an ES intercept simulator:
- Its "AI" is rule-based.
- 81 of 179 `.m` files are empty.
- There are no AoA results, no baseline and no intercept metrics.
- The Monte Carlo CSV is 100 identical rows.
- There are two different five-target runs.

The site must state this framing once and plainly, tag every stage truthfully, and show only one headline result: the CFAR five-target table, tagged SIMULATED. The user approved this framing (see PROJECT.md, "User answers").

## Key Findings

### Recommended stack (STACK.md)

| Choice | Decision | Why |
|---|---|---|
| Astro `7.3.5`, `output: 'static'` | Use | HTML with no JS by default, build-time data imports, Fonts API, `<Picture>`, no Cloudflare adapter needed |
| TypeScript `^6.0.3` | Use. **Pin 6, not 7** | The `@astrojs/check` peer range is `^5 \|\| ^6`, and `npm i typescript` now installs 7.0.2 |
| Plain CSS custom properties, scoped styles | Use | About 15 components; the tokens are the design system. Tailwind 4 only if chosen on day 1 (recommended: don't) |
| Fonts via the Astro Fonts API (Google provider, self-hosted) | Use | Archivo variable, IBM Plex Sans variable, IBM Plex Mono; latin subset; 130 KB budget |
| SVG charts drawn at build time with a small scale helper | Use | No client JS, accessible, animatable. No Chart.js, D3 or Three.js |
| Vanilla TS widgets (`popover`/`<dialog>`, `<input type=range>`, scroll-snap, `<details>`) | Use | 30–60 lines each; no framework islands |
| GSAP `3.15.0` (all plugins free) | **Optional enhancement** (see "Resolved conflicts") | Only if time remains after the static ship point |
| Native `<video>` with chapter buttons | Use | Not YouTube. Encode with ffmpeg as H.264 at 1080p and 720p, `+faststart`, with a poster |
| `@playwright/test` 1.63 + `@axe-core/playwright` 4.13 | Use | Checks at 390/768/1440, JS off, reduced motion, axe. No pixel-diff suite |
| Cloudflare Pages Git integration, `.node-version` = `24`, `public/_headers` | Use | The v3 build image defaults to Node 22.16; 25 MiB per-asset limit |
| Lenis, ScrollSmoother, `@astrojs/cloudflare`, `ClientRouter`, icon packages, `pub-*.r2.dev` URLs | **Do not use** | They hijack scrolling, aren't needed, or are dev-only |

Astro 7 gotchas:
- The compiler is strict about HTML, so nesting must be valid.
- `compressHTML: 'jsx'` strips inline whitespace, so watch the spacing around status tags.
- Confirm the `astro/zod` import path in Phase 1 (MEDIUM confidence).

### Expected features (FEATURES.md, DESIGN.md)

**Must have (table stakes, all complete as static pages by the ship point):**
- Status tag system (BUILT / SIMULATED / PROTOTYPE / DESIGNED / PLANNED / ILLUSTRATIVE) with a legend, and a provenance line (file path, run date, scenario) on every number, table and plot.
- Page frame:
  - Hero: name, tagline, one-liner, "Begin" and "See how it works", a static PPI scope SVG, and no numbers.
  - Numbered header nav, a mobile menu with subtitles, and a skip link.
- Sections:
  - 01: "today vs asked for" and the requirement map with tally.
  - 02: closed-loop SVG flowchart with inline status tags.
  - 03: CFAR five-target table, real MATLAB plots in figure plates, a "what runs today" list, and the compare slider.
  - 04: diagram of JEV, router, ensemble, RL, human and scheduler, all DESIGNED.
  - 05: video slot with chapters, reused results, and a repo link.
  - 06: layered security list and failure modes.
  - 07: roadmap with "WE ARE HERE".
  - 08: argument cards, cited sources and a qualitative comparison.
- Footer honesty note; reduced motion, keyboard access, AA contrast, responsive at 1440/768/390; placeholders that hold the same box as the pending asset.

**Should have (differentiators, built in this order after the ship point):**
1. D1 scan-strategy simulator, fixed sweep vs adaptive. An ILLUSTRATIVE toy that shows the periodic-sweep synchronisation failure, which answers the PS question about periodic scanning.
2. D3 JEV stepper with a fast-path/escalation toggle, using the report's §11 worked example with every value ILLUSTRATIVE.
3. D5 CFAR explainer using the real repo parameters (guard 2×2, training 6×8, Pfa 1e-4), and D7 SVG dumbbell chart drawn from the CSV.
4. D4 routing matrix, D9 failure-mode picker, D10 human-approval panel (each under an hour), and D12 ablation ladder.
5. Hero sweep animation with a pause toggle.

**Defer or never build:**
- A skippable or blocking intro. FEATURES (D14) and DESIGN agree: no.
- Blocked on the team: an AoA chart with real data, real fixed-vs-adaptive baseline results, the real demo video and dashboard screenshots.
- Never: anything called "Live", headline percentages from the toy, Monte Carlo shown as a distribution, the SNR sweep shown as a result, file or module counts, recoloured MATLAB plots, MathWorks logos, AI imagery of hardware.

### Architecture approach (ARCHITECTURE.md)

Data flows one way:
1. Repo CSV.
2. `scripts/ingest.mjs` adds a sha256 and notes.
3. `src/data/results.json`.
4. `src/lib/data.ts` applies zod and the honesty rules, and fails the build on a violation.
5. Sections render HTML, which JS only enhances.

Boundaries:
- Only sections call `data.ts`.
- `ui/` primitives take props and import no data.
- `viz/` renders SVG in its final state.
- `data/claims.json` holds hand-written statuses, requirements, roadmap, citations and ILLUSTRATIVE values.
- `data/assets.json` is the asset manifest with a `pending` flag, so swapping in an asset changes no layout.
- Widgets and motion are kept separate. `scripts/widgets/*` are functional, use no GSAP, and run under reduced motion. `scripts/motion/*` are decoration with one `matchMedia` entry.

**Major components:**
1. `lib/data.ts` and `claims.json`: the honesty choke point. A number cannot exist without `{value, unit, status, source}`.
2. UI primitives: StatusTag, SectionHeader, Metric, Figure, Placeholder, ResultTable, VideoPlayer, Tabs, Carousel, BeforeAfter, CitationCard.
3. `viz/` SVGs: RadarScene (PPI), LoopDiagram (reused by 02 and 05), FlowDiagram, RequirementMap, Timeline, ErrorChart.
4. `sections/*`: one file per section. `pages/index.astro` only composes them, and `SECTIONS[]` in `site.ts` drives the nav, the menu and the anchors.
5. `main.ts`: the single script entry. Widgets always run; motion runs inside `gsap.matchMedia()`, returns early under reduced motion, and never pins under 768 px.

Honesty rules enforced at build time:
- A dataset's status is SIMULATED or BUILT only; ILLUSTRATIVE values live in a separate array.
- Derived values are computed, never typed.
- `RangeError ≈ Detected − Expected`.
- Datasets with identical rows get an automatic note.
- Datasets are keyed by scenario plus source file and never averaged across files.
- A grep check bans numeric literals in `components/`.
- An output grep bans `TODO|lorem|TBD|XXX` outside the pending component.
- Each rule has one failing test fixture (`node --test`).

### Design direction (DESIGN.md)

"ES operator console" palette:
- Surfaces: `--bg-0 #050B16`, `--bg-1 #0B1629`, `--bg-2 #12213A`.
- Text: `#E8EEF6`, `#A3B3C9`, `#8095B0`. All three pass AA on every surface.
- `--signal #3BE4F2`: covers under 5% of a viewport and is used only for meaning.
- Khaki `#C9B98F`: eyebrows and the ILLUSTRATIVE tag.

Status colours. Each tag always shows colour, glyph and text together:

| Tag | Colour | Glyph |
|---|---|---|
| BUILT | green `#3DDC97` | square |
| SIMULATED | blue `#6FB3FF` | circle |
| PROTOTYPE | amber `#F2B84B` | half circle |
| DESIGNED | violet `#B99CFF` | ring |
| PLANNED | grey `#9AA8BA` | dashed ring |
| ILLUSTRATIVE | khaki | hatch |

Visual rules:
- ILLUSTRATIVE numbers render in text-2 on a hatch plate and never count up.
- The hero image is the inline-SVG PPI scope: no AI image and no video.
- AI mood images appear only in 01 (optionally 07 and 08), labelled "AI-generated · mood only".
- No shadows, glowing text or scanlines. Glow is a pre-blurred duplicate stroke with animated opacity.
- Real MATLAB plots sit on a white "figure plate" and are never recoloured.
- Logo: use the reversed variant on dark (the green parts render as text-1). The supplied SVG needs its background path removed and a `viewBox` added.
- Body text is at least 17–18 px so it reads on a projector.

### Critical pitfalls (PITFALLS.md)

1. **Calling rule-based code "AI".** Use two blocks that never share a heading: "What runs today" (DSP plus rule-based logic, SIMULATED/PROTOTYPE) and "What we designed next" (ML, DESIGNED). The words AI, ML, learns, trained and predicts appear only beside DESIGNED or PLANNED. Present the rule-based code as the baseline the ML scheduler will be measured against.
2. **Illustrative numbers that look like results.** Use one data path, fail the build on untagged numbers, and give ILLUSTRATIVE its own visual treatment. The hero and OG image carry no numbers.
3. **Mismatch between site and repo (SARRS).** Say once, in section 03: SARRS is the radar DSP/detection testbed and foundation, and the ES smart-scan scheduler is the designed layer on top. Keep "SARRS" visible in plot titles. The roadmap marker sits at "DSP testbed simulated".
4. **Defence over-claiming.** Banned words: live, real-time, deployed, battle-tested, military-grade, neutralise, jamming. Use synthetic scenarios only. The security section is a design, tagged DESIGNED, and marked "not certifications".
5. **Three linked failures:** uncited outside statistics, the demo toy read as the real system, and empty sections on deadline day.
   - Every outside figure links to a primary source and says "not an AVOLITE result".
   - The toy carries a permanent tag inside its frame.
   - Breadth-first order makes "cut motion, ship static" a safe fallback.

Technical cautions:
- ScrollTrigger and fonts: call `ScrollTrigger.refresh()` after `document.fonts.ready`, give images width and height, create triggers in page order, and set `ignoreMobileResize`.
- Never animate `filter`.
- Set the Node version for Cloudflare, and respect the 25 MiB asset limit.
- Keep `.mat` files out of `public/`.

## Resolved Conflicts Between Research Files

| Topic | Disagreement | Resolution (use this) |
|---|---|---|
| GSAP | STACK: GSAP 3.15, dynamically imported after first paint. DESIGN: optional; CSS plus about 2 KB of IntersectionObserver is enough | **Progressive enhancement only.** The static final-state render and all widgets work without GSAP. Phase 4 builds widgets first, then CSS/IntersectionObserver motion for the hero sweep and stage states. Add GSAP (ScrollTrigger/DrawSVG, dynamic import) only if the static site is done and time remains. Motion is the first cut. |
| Sticky storyboard | DESIGN: one sticky stepper in 02 at 1024 px and wider. FEATURES and PITFALLS: avoid scroll-jacking, at most one pin | Allow **one** sticky stepper, in 02, desktop only: at most 150vh, state switches via IntersectionObserver, no scrubbing, none under 1024 px. Drop it first if it misbehaves; the content already reads as an ordered list. |
| Video hosting | STACK: Pages `public/` if under 25 MiB, else R2 on a custom domain. ARCHITECTURE: R2 by default. PITFALLS: YouTube unlisted or Stream if large | **Default to Pages `public/media/`**, keeping each rendition under 25 MiB (720p at about 1.2 Mbps). Fallback: R2 on a custom domain. Last resort: a YouTube facade that loads on click. Never `r2.dev`, never an eager iframe. |
| Toy simulator metrics | FEATURES D1: live hit counters. PITFALLS: no numeric readouts in the explainer. DESIGN: a "dwell on non-threat" readout | **No derived percentages or "X% faster" anywhere.** Show hit and miss marks only. Any counter that stays sits inside the ILLUSTRATIVE frame and is hatched. Cut counters first. |
| Palette | Old `CLAUDE.md` tokens (`#07101F`) vs DESIGN (`#050B16`) | The old `CLAUDE.md` is not binding (PROJECT.md). Use the DESIGN tokens and update `CLAUDE.md` later to match. |
| Intro | AVOFLARE has a canvas intro | No intro. Use a hero "power-on" that never blocks reading (rings at 600 ms, sweep at 1.0 s), with "Replay scan" and a pause control. |
| Section count | PROJECT: 8 sections. ARCHITECTURE: "9 stubs" | 8 numbered sections, plus an unnumbered hero, plus the footer. |
| Requirement map rows | FEATURES rows A–H vs DESIGN's generic rows | Use the FEATURES rows with the statuses below. Replace the paraphrase with the official PS 26055 wording (open question). |

## How Each Section Tags Status (applying the user's answers)

| Item | Tag | Note |
|---|---|---|
| CFAR, range-Doppler, tracking. Headline: `CFAR_Performance_Table.csv` (5/5 targets, range error within ±0.5 m, velocity error at most 0.165 m/s) | SIMULATED | Scenario: 5 synthetic targets at 25–145 m in the radar-echo testbed. Max and mean errors are computed from the rows. |
| Second five-target run (75–375 m, range error up to −1.76 m) | Omit in v1 (recommended) | If shown, it is a separate dataset with its own caption, never merged or averaged. |
| Monte Carlo CSV (100 identical rows) | Not shown as a distribution | Omit it, or add one honest caption. |
| SNR sweep | Not shown as a result | The SNR definition is pending from the team. The sensitivity row reads "Sweep exists; SNR definition pending", with no numbers. |
| ES receiver chain, propagation, emitter manager | DESIGNED | The files are empty stubs; never BUILT. |
| AoA estimation | DESIGNED | AoA code exists outside the repo but has not been shared. Upgrade to PROTOTYPE or SIMULATED only with evidence. Any spatial-response chart is ILLUSTRATIVE or a pending panel. |
| ML scheduler (JEV, router, GNN/SSM/ST-GNN, ensemble, RL) | DESIGNED | The code exists outside the repo but has not been shared; the same upgrade rule applies. |
| Rule-based `AI/` modules, `ScanScheduler`, `CognitiveReceiver` | PROTOTYPE, "rule-based" | Presented as the baseline; never called AI or ML. |
| MATLAB App Designer dashboard | PROTOTYPE on simulated data | Screenshot placeholder until captures confirm what runs. |
| Fixed-sweep baseline, intercept rate and time, reward, prediction accuracy | PLANNED | No ES interception simulation exists yet. |
| Browser scan simulator, JEV worked example, routing demo | ILLUSTRATIVE | The tag sits inside the frame and is visible without hovering. |
| Security controls (report §15) | DESIGNED | "Design controls, not certifications, not implemented". |

Roadmap statuses, with the "we are here" marker at P1. The team must confirm the order and the marker:

| Phase | Tag |
|---|---|
| P1 DSP testbed | SIMULATED |
| P2–P4 | PLANNED |
| P5–P6 | DESIGNED |
| P7 | PLANNED |

Requirement map (A–H). The team must confirm it:

| Row | Requirement | Tag |
|---|---|---|
| A | Pd/Pfa | SIMULATED |
| B | Sensitivity | PLANNED (SNR definition pending) |
| C | Scheduler | PROTOTYPE (rule-based) |
| D | ML scheduler | DESIGNED |
| E | Frequency-agile and scanning emitters | DESIGNED |
| F | Intercept rate and time | PLANNED |
| G | Reward/cost and % correct predictions | PLANNED |
| H | Intercepting a periodic-scan receiver | DESIGNED (plus an ILLUSTRATIVE explainer) |

## Implications for the Roadmap

Suggested structure: **6 phases, breadth-first**, each leaving a shippable site. The timeline is 1–2 days (live by 2 Oct 2026), so the phases are coarse.

### Phase 1: Shell, stack and deploy pipeline

**Rationale:** It blocks everything, and Cloudflare and Node-version problems only show up in the cloud.

**Delivers:**
- Astro 7 scaffold: TypeScript 6, `.node-version` 24, `_headers`, `SITE_URL`/`CF_PAGES_URL`.
- Styles and layout: `tokens.css`, `global.css`, the Fonts API, `Base.astro`, `SECTIONS[]`.
- Navigation and page: Header, Footer, SectionNav and MobileMenu working without JS; `index.astro` with the hero, 8 stub sections and anchors.
- Logo cleanup: `viewBox` added, background path removed, reversed variant.
- A clean-clone `npm ci && npm run build` check.

**Uses:** Astro, plain CSS, the Fonts API.

**Avoids:** a Node-version surprise, layout shift from late fonts, and dark-theme contrast problems (the tokens are fixed now).

**Note:** deploy a preview only if the user asks; otherwise verify with `npm run preview`.

### Phase 2: Data layer, honesty system, UI primitives, asset intake

**Rationale:** Every number and tag flows through these, so the sections cannot be honest without them. The sub-tracks run in parallel once the `Dataset` type is agreed.

**Delivers:**
- `ingest.mjs` and `results.json` holding the CFAR headline dataset (SIMULATED).
- `data.ts` zod rules and `data.test.mjs`.
- A `claims.json` skeleton: requirements, components, roadmap, security and citations, with the statuses from the table above.
- StatusTag and legend, SectionHeader, Metric, Figure with figure plate, Placeholder/PendingAsset, ResultTable.
- Tabs, Carousel, BeforeAfter and VideoPlayer in their no-JS form.
- `assets.json`, with the PNGs copied into paths that mirror the repo and served through `<Picture>`.

**Avoids:** pitfalls 1–3, because status and wording are encoded in data; numbers typed directly into components.

### Phase 3: Hero and all 8 sections, static (the ship point)

**Rationale:** Breadth first. Every section gets final copy and either real content or an honest placeholder before any animation work. A full-page screenshot at the end must show all 8 sections with content.

**Delivers:**
- Hero: static PPI SVG and status strip.
- 01: contrast and requirement map.
- 02: LoopDiagram with inline tags.
- 03: SARRS framing, the "what runs today" list, the CFAR table, the plots, the compare slider (raw range-Doppler map vs CFAR detection map) and a pending panel for the dashboard.
- 04: static JEV/router/ensemble/RL diagram ("two decisions").
- 05: video pending panel with chapter list, reused results, repo link.
- 06: layered list and failure modes.
- 07: roadmap with the marker.
- 08: argument cards, cited sources, qualitative table.
- Footer honesty note.

**Exit:** shippable as a static site; passes the JS-off and reduced-motion checks.

**Avoids:** pitfalls 1, 3, 4, 5 and 7.

### Phase 4: Interactives and motion

**Rationale:** Only after Phase 3. Widgets come first (function, no GSAP) and motion second (decoration, the first thing cut).

**Delivers, in this order:**
1. Widgets: mobile menu, scroll-spy, tabs, carousel, before/after slider, video chapters, loop explainer.
2. D1 scan simulator and timeline, with an ILLUSTRATIVE tag inside the frame.
3. D3 JEV stepper.
4. D5 CFAR explainer and D7 dumbbell chart.
5. D4, D9, D10 and D12.
6. Hero sweep with a pause toggle that also pauses offscreen.
7. Optional sticky stepper in 02.
8. GSAP, only if time remains.

**Avoids:** pitfall 6 and scroll-jacking. No `filter` animation; reduced motion shows end states.

### Phase 5: Asset swap-in and content confirmation

**Rationale:** Team deliverables arrive late, and placeholders that hold the same box turn each swap into a flag change. Set a cutoff about 12 hours before the deadline; anything later ships as the honest placeholder.

**Delivers:**
- Demo video (Pages `public/` or R2) and chapter timestamps with VTT.
- Dashboard and PPI screenshots.
- Team ID.
- Confirmed requirement rows and roadmap marker.
- AI-generated mood images, labelled.
- AoA and ML status upgrades, only with evidence.

### Phase 6: QA, honesty audit and deploy

**Delivers:**
- Playwright at 390/768/1440, plus a pass at 1280×720 on a dimmed screen.
- JS-off and reduced-motion runs, axe, and a WebKit run.
- Lighthouse mobile at least 90 and accessibility 100.
- Budget check: JS at most 70 KB gzip, CSS at most 25 KB, fonts at most 130 KB, LCP at most 2.0 s, CLS at most 0.05.
- Greps: AI words next to BUILT or SIMULATED, banned defence words, `live|real-time`, TODO and lorem.
- Every outside link clicked.
- A request to the repo owner for a README.

Production deploy happens **only when the user asks**.

### Why this order

- The data layer and primitives come before the sections because numbers and tags must never exist outside the choke point.
- Breadth before depth keeps "cut motion, ship static" a valid recovery. PITFALLS rates recovery as costly if the build goes depth-first.
- Widgets do not import GSAP, so a GSAP failure or reduced motion never removes any function.
- Section dependencies:
  - 05 reuses 02's LoopDiagram.
  - 03 and 05 need the data layer.
  - 01, 04, 06, 07 and 08 need only `claims.json` and can start on the skeleton.

### Research flags

Phases likely to need deeper research during planning:
- **Phase 3 (section 08 and the requirement map):**
  - Open the Clarkson papers and confirm every quoted claim (currently MEDIUM, from abstracts only).
  - Replace the paraphrased PS rows with the official PS 26055 text.
  - Decide whether a "why now" line has any citable source. None was found, so skip it.
- **Phase 4 (D1 scan simulator):** a small design spike to define the emitter model and the adaptive heuristic, so it stays a schematic toy with no numbers.
- **Phase 4 (only if GSAP is added):** re-check `matchMedia` and ScrollTrigger refresh behaviour with pins and fonts.

Phases with standard patterns (skip the research step):
- **Phase 1:** scaffold, fonts and Cloudflare Pages config are documented. Only confirm the `astro/zod` import path.
- **Phase 2:** the zod rules and CSV ingest are straightforward, and the architecture is specified.
- **Phases 5 and 6:** mechanical.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Versions checked against npm today; APIs via Context7 and official docs. The `astro/zod` import path and the Workers-vs-Pages note are MEDIUM. |
| Features | HIGH for repo facts, MEDIUM for what judges reward | Repo files read directly; reference bundles inspected; no judge feedback exists. |
| Architecture | HIGH for structure, MEDIUM for R2 details | Standard static-site patterns checked against the real CSV exports; R2 details and the 25 MiB limit were not re-fetched. |
| Pitfalls | HIGH for credibility and for Cloudflare/GSAP, MEDIUM for browser quirks | Checked against the repo source; iOS and projector behaviour is established practice. |
| Design | MEDIUM-HIGH | Contrast and fonts computed or checked; the aesthetic direction is opinion; a MATLAB dark figure theme is LOW. |

**Overall confidence:** MEDIUM-HIGH. The technical choices are solid. The remaining uncertainty is content (what the team can back with evidence), not engineering.

### Gaps to address

Open questions. The owner is the team or the user unless noted.
1. **Team ID** for AVOLITE in SIH. Render "Team ID pending" from one constant, and hide the row if it is still unknown at launch.
2. **SNR definition** in the sweep script: per-sample before processing gain, or after? Until it is answered, the SNR sweep is not shown as a result.
3. **Dashboard screenshots** and PPI/A-scope/trajectory exports: what actually runs in `Dashboard.mlapp`? Until then it is PROTOTYPE on simulated data, with a pending panel.
4. **Demo video** and chapter timestamps. The file size decides between Pages and R2.
5. **AoA and ML scheduler code or results** (outside the AVOLITE repo). Until shared, both stay DESIGNED.
6. **Official PS 26055 text** for the requirement map, and confirmation of rows A–H and their tags.
7. **Roadmap:** phase order and the "we are here" position.
8. **Second five-target run:** omit it (recommended) or show it separately with its own caption. Also decide whether the Monte Carlo result gets a one-line caption or is omitted.
9. **Cloudflare project name** for `SITE_URL` (canonical URL and OG). Until then the build warns about the placeholder.
10. **Repo README:** ask the AVOLITE repo owner for a short one ("SARRS = simulation testbed; how to run; where the results are"). Otherwise, link directly to the result folders. Judges can see the 81 empty `.m` files and the committed `.asv` autosave files.
11. **AI mood images:** who generates them, and approval of the prompt direction. Section 01 alone is enough.
12. **Contact details:** stay commented out until supplied.
13. **`CLAUDE.md` refresh:** it still describes the dropped 9-section Astro plan and the old tokens. Update it after the roadmap is approved (not a research blocker).

## Sources

### Primary (HIGH confidence)
- npm registry (2026-09-30): astro 7.3.5, gsap 3.15.0, typescript 6.0.3 / 7.0.2, `@astrojs/check` peer ranges, playwright 1.63, axe 4.13.
- Context7: `/withastro/docs` (Fonts API, `<Picture>`, content collections), `/websites/gsap_v3` (`matchMedia`, ScrollTrigger refresh and priority), `/darkroomengineering/lenis`.
- Cloudflare docs: Pages build image (Node 22.16 default), Pages limits (25 MiB, 20k files, 20-minute build), R2 public buckets (`r2.dev` is dev-only).
- Astro 7 blog and v7 upgrade guide; web-features explorer (scroll-driven animations not supported in Firefox).
- AVOLITE repo (`abhishekpj0902-apj/AVOLITE`), read directly: result CSVs, `CFAR_FiveTargetRadar.m`, `ThreatClassifier.m`, `ScanScheduler.m`, the empty-file audit.
- `AVOLITE_Master_Project_Documentation.md` (§4–6, §20, §26–30, §41–43, §47–50), the AI Architecture Report (§6–11, §14–17), `.planning/PROJECT.md`.
- Reference sites `avoflare-web.pages.dev` and `aquasol-web.pages.dev` (shipped bundles and CSS).

### Secondary (MEDIUM confidence)
- Clarkson, "Optimisation of Periodic Search Strategies for Electronic Support" (UQ), and related IET RSN papers. Abstracts and summaries only; full papers not reviewed.
- Live CSS of Epirus, CesiumAstro, Palantir and Anduril; SDR-Radio, Signal Hound, radartutorial.eu and ScienceDirect (RF display conventions).
- Cloudflare's recommendation of Workers Static Assets (mecanik.dev, barnabas.me, Cloudflare migration guide).

### Tertiary (LOW confidence, needs validation)
- YouTube embed weight (about 0.5–1 MB), from training knowledge.
- Whether a MATLAB dark figure theme is available for re-exported plots.
- Font byte sizes after subsetting (estimates; measure them).

---
*Research completed: 2026-09-30*
*Ready for roadmap: yes*
