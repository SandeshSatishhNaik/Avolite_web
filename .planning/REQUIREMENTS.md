# Requirements: AVOLITE Website

**Defined:** 2026-09-30
**Core Value:** A judge who scrolls the page once understands the problem, sees the real MATLAB work, and can tell exactly what is built, what is designed and what is illustrative.

Sources: `.planning/PROJECT.md`, `.planning/research/` (FEATURES, DESIGN, ARCHITECTURE, STACK, PITFALLS). Section numbers like D1 refer to FEATURES.md differentiators.

## v1 Requirements

### Foundation (FND)

- [x] **FND-01**: Site builds as a static Astro 7 project with TypeScript and plain CSS custom properties, and `npm run build` produces `dist/` ready for Cloudflare Pages (`.node-version` = 24)
- [x] **FND-02**: Design tokens (colors, type scale, spacing, radii, motion durations/easings) from DESIGN.md live in one tokens file and every component uses them
- [x] **FND-03**: Fonts (Archivo, IBM Plex Sans, IBM Plex Mono) are self-hosted through the Astro Fonts API with metric-matched fallbacks, within 130 KB
- [ ] **FND-04**: The page renders every section in its final, complete state with JavaScript disabled
- [x] **FND-05**: The supplied logo is cleaned (white background path removed, `viewBox` added) and rendered through one Logo component with a reversed variant legible on the dark background

### Data honesty (DATA)

- [ ] **DATA-01**: Real results come from repo CSVs copied into the site repo and converted at build time to a typed JSON file; a hand-edited CSV (hash mismatch) fails the build
- [ ] **DATA-02**: Every displayed number carries a status tier, unit and source; a component asked to render a number without a status fails the build
- [ ] **DATA-03**: Repo-derived values can only be SIMULATED or BUILT; illustrative values live in a separate list that can only be ILLUSTRATIVE
- [ ] **DATA-04**: Derived values (max/mean range and velocity error, detection counts) are computed from the data, never typed
- [ ] **DATA-05**: The headline dataset is `CFAR_Performance_Table.csv`; results from different runs are never merged, and each dataset shows its scenario and source file
- [ ] **DATA-06**: The Monte Carlo table (100 identical rows) is never shown as a distribution, and the SNR sweep is not shown as a result while its SNR definition is PENDING
- [ ] **DATA-07**: A build check fails on banned wording in output: "Live", "real-time", "AI"/"ML" next to BUILT, and leftover TODO/TBD/lorem outside marked placeholders

### UI primitives (UI)

- [ ] **UI-01**: Status tag component with six tiers (BUILT, SIMULATED, PROTOTYPE, DESIGNED, PLANNED, ILLUSTRATIVE), each with its own color, glyph and border style, never color alone, plus an optional provenance suffix
- [ ] **UI-02**: Status legend shown in section 01 and in the footer
- [ ] **UI-03**: Section header with numbered eyebrow ("01 · THE PROBLEM"), heading and lede
- [ ] **UI-04**: Metric readout with tabular numbers, unit and status tag; ILLUSTRATIVE metrics use a distinct style and never count up
- [ ] **UI-05**: Figure plate that shows MATLAB exports unrecolored on a light plate with caption, status and source path
- [ ] **UI-06**: Placeholder panel with fixed aspect ratio that names the pending asset and its status, so the real asset swaps in without layout change
- [ ] **UI-07**: Result table that stacks into cards under 768 px, and every chart offers a "View as table" disclosure

### Header, hero and footer (SHELL)

- [x] **SHELL-01**: Sticky header with the AVOLITE logo and numbered links 01–08 that highlight the section in view
- [x] **SHELL-02**: Mobile menu (native dialog/popover) lists all 8 sections with one-line subtitles and traps focus
- [x] **SHELL-03**: Skip link to main content
- [ ] **SHELL-04**: Hero shows the SIH 2026 · PS 26055 eyebrow, AVOLITE headline, one-line explanation, "Begin" and "See how it works" calls to action, a radar-scope SVG, and a status strip; the hero contains no numbers
- [ ] **SHELL-05**: Footer shows SIH 2026, PS 26055, Team Avoflare (team ID row hidden until supplied), links to the AVOLITE MATLAB repo, the status legend, the data-honesty note, and "Created by Sandesh Naik" linking to github.com/SandeshSatishhNaik

### 01 The problem (PROB)

- [ ] **PROB-01**: Judge reads the PS 26055 framing and a "Today vs Asked for" contrast (open-loop sweep vs ML scheduler that minimizes intercept time)
- [ ] **PROB-02**: Judge sees emitter-class chips E1–E8 (persistent, periodic, intermittent, frequency-agile, staggered, communication-like, unknown)
- [ ] **PROB-03**: Judge sees a requirement map A–H derived from the PS figures of merit, each row with evidence, status and a tally ("n simulated, n prototype, n designed, n planned")
- [ ] **PROB-04**: Each requirement-map row links to the section holding its evidence and highlights it on arrival

### 02 How it works (HOW)

- [ ] **HOW-01**: Judge sees the closed-loop flowchart (RF environment → emitters → propagation → antenna/array → receiver → ADC → DDC → DSP/FFT → CFAR → PDW/features → AoA ‖ environment estimate → AI → prediction + uncertainty → scheduler → receiver control ↺) as accessible SVG with a prose description
- [ ] **HOW-02**: Each flowchart node carries its status tag inline (CFAR/range-Doppler/tracking SIMULATED; scheduler PROTOTYPE; receiver chain, AoA, environment estimator, AI DESIGNED)
- [ ] **HOW-03**: Judge can open a short explainer for any node
- [ ] **HOW-04**: A compact 7-step loop ring (Observe → Process → Detect → Estimate → Predict → Decide → Scan again) replaces the full chart on phones
- [ ] **HOW-05**: Callouts explain exploration vs exploitation and ground truth vs observation

### 03 What we built (BUILT)

- [ ] **BUILT-01**: A framing banner states that SARRS is the radar-side DSP/detection testbed and the ES smart-scan loop builds on it
- [ ] **BUILT-02**: Judge sees a "What runs today" list of the substantive modules (name, one-line purpose), never a file count
- [ ] **BUILT-03**: Judge sees the headline CFAR five-target results table (expected vs detected range and velocity, errors) tagged SIMULATED with source path
- [ ] **BUILT-04**: Judge sees 4–6 real MATLAB plots in figure plates (range-Doppler map, CFAR threshold/detection, expected vs detected, errors)
- [ ] **BUILT-05**: Judge can drag a before/after slider between the raw range-Doppler map and the CFAR detection map (D6)
- [ ] **BUILT-06**: Judge sees the rule-based decision logic (ThreatClassifier, TargetPriority, ScanScheduler, CognitiveReceiver) tagged PROTOTYPE · rule-based, framed as the baseline the ML scheduler will be measured against
- [ ] **BUILT-07**: Judge sees the MATLAB App Designer dashboard tagged PROTOTYPE (placeholder until screenshots arrive)
- [ ] **BUILT-08**: Judge sees an expected-vs-detected dumbbell chart drawn in SVG from the JSON data (D7)

### 04 What's new (NEW)

- [ ] **NEW-01**: Judge reads the "two decisions" idea: cluster selection ("which signal is this?") then skill selection ("what needs analysing now?")
- [ ] **NEW-02**: Judge sees the AI pipeline diagram (JEV #1 → cluster → JEV #2 → skills → model router → GNN/SSM/ST-GNN → conditional ensemble → RL → human → scheduler) tagged DESIGNED
- [ ] **NEW-03**: Judge can step through the report's worked example (O1052 → C17 → skills → SSM + ST-GNN → ensemble → RL) with Prev/Next, every value tagged ILLUSTRATIVE, and toggle fast path vs escalation (D3)
- [ ] **NEW-04**: Judge can tick skills (temporal, relational, spatial) and see which models the router activates (D4)
- [ ] **NEW-05**: Judge sees the "prediction vs decision" split and the ablation ladder (7 steps, PLANNED, no values) (D12)

### 05 Demo (DEMO)

- [ ] **DEMO-01**: Judge can play the demo video in a native player with chapter buttons that seek; until the video arrives, a placeholder poster and a "footage pending" note show in the same fixed box
- [ ] **DEMO-02**: Judge can explore exported results in tabs (CFAR table, detection maps), reusing section 03 components
- [ ] **DEMO-03**: Judge can run an in-browser scan-strategy simulator comparing a fixed sweep with an adaptive scan on the same emitters and budget, with play/pause, speed and reseed, tagged "ILLUSTRATIVE · toy model in your browser · not the AVOLITE scheduler" (D1)
- [ ] **DEMO-04**: The simulator shows a hit/miss interception timeline for both strategies, including a periodic sweep falling into step with a periodic emitter (D2)
- [ ] **DEMO-05**: Judge can open the AVOLITE MATLAB repo from the demo section

### 06 Security (SECU)

- [ ] **SECU-01**: Judge sees AVOLITE's layered security and reliability design from AI report §15 (provenance/audit, ground-truth isolation, confidence thresholds and fallbacks, cluster-profile protection and versioning, human approval, sandboxed simulation before hardware, safe receiver state), tagged DESIGNED with a "design controls, not yet implemented" note
- [ ] **SECU-02**: Judge can pick one of the 7 failure modes and see which layer catches it and the fallback (D9)
- [ ] **SECU-03**: Judge can try the new-cluster approval panel (agent proposes; Approve / Modify / Reject) (D10)

### 07 Roadmap (ROAD)

- [ ] **ROAD-01**: Judge sees phases P1 DSP foundation → P2 ES emitter scene + receiver chain → P3 AoA validation → P4 fixed-sweep baseline + intercept metrics → P5 AI layer → P6 RL closed loop vs baseline → P7 SDR hardware, each with status and outcome
- [ ] **ROAD-02**: A maturity bar with a "WE ARE HERE" marker at the end of P1

### 08 Why AVOLITE (WHY)

- [ ] **WHY-01**: Judge reads 3–4 argument cards (fixed sweep wastes dwell; periodic sweep can synchronise with a periodic emitter; fast path spends compute only on change; the human stays in command)
- [ ] **WHY-02**: Judge sees a qualitative fixed-vs-adaptive comparison table with no invented numbers
- [ ] **WHY-03**: Outside research (Clarkson ES scheduling papers) is cited with links and marked "not an AVOLITE result"
- [ ] **WHY-04**: Closing calls to action: "Watch the demo" and "Back to the start"

### Motion (MOT)

- [ ] **MOT-01**: Motion is progressive enhancement over the server-rendered final state: widgets work without it, CSS + IntersectionObserver drives base motion, and GSAP 3.15 (dynamic import after first paint) is added only if time remains
- [ ] **MOT-02**: Hero radar sweep animates with a pause toggle and stops when offscreen
- [ ] **MOT-03**: The loop story plays one motion per stage (sweep, pulse, ping, beam lock, ghost marker, slot highlight) when sections enter view; motion is time-based, not scroll-scrubbed
- [ ] **MOT-04**: Reduced-motion users get final states with working controls; under 768 px there is no sticky stepper and no looping pulses
- [ ] **MOT-05**: Only transform, opacity and SVG stroke properties animate; no `filter` animation

### Imagery (IMG)

- [ ] **IMG-01**: Data, diagrams and results use SVG/code or real MATLAB exports only
- [ ] **IMG-02**: AI-generated mood scenes (sections 01, 07, 08 only) carry the caption "AI-generated · mood only, not AVOLITE hardware"
- [ ] **IMG-03**: Raster images ship as AVIF/WebP with explicit width and height

### Quality and launch (QA)

- [ ] **QA-01**: Layout works at 1440, 768 and 390 px with no horizontal scroll
- [ ] **QA-02**: WCAG 2.2 AA: contrast, visible focus ring, keyboard access to every control, alt text, informative SVGs with title/desc; axe reports no violations
- [ ] **QA-03**: Readable on a 1280×720 projector at reduced brightness (body ≥ 18 px, essential lines ≥ 1.5 px)
- [ ] **QA-04**: Playwright smoke run passes in Chromium, Firefox and WebKit, including JS-off and reduced-motion checks
- [ ] **QA-05**: Lighthouse mobile ≥ 90 performance, 100 accessibility, 100 SEO; JS on the page ≤ 70 KB gzip
- [ ] **QA-06**: Deployed to Cloudflare Pages in the final step, only when the user asks

## v2 Requirements

Deferred. Tracked but not in the current roadmap.

### Assets pending from the team

- **ASSET-01**: Real demo video and chapter timestamps replace the placeholder
- **ASSET-02**: Dashboard, PPI and tracker screenshots replace placeholders
- **ASSET-03**: Team ID added to the footer and problem section
- **ASSET-04**: AoA and ML scheduler code/results (exist outside the repo) upgrade DESIGNED tags to PROTOTYPE/SIMULATED with evidence
- **ASSET-05**: SNR definition confirmed; SNR sweep shown with its caveat

### Later enhancements

- **ENH-01**: CFAR threshold explainer driven by repo parameters (guard 2×2, training 6×8, Pfa 1e-4) (D5)
- **ENH-02**: Illustrative spatial-response / AoA chart at the AoA node (D11)
- **ENH-03**: Skippable radar intro (D14)
- **ENH-04**: Real fixed-vs-adaptive baseline results replace the illustrative simulator counters

## Out of Scope

| Feature | Reason |
|---------|--------|
| Reusing AVOFLARE source code | User chose to build fresh; AVOFLARE is a layout/tone reference |
| Building the MATLAB/Python/dashboard systems | They live in the AVOLITE repo; the site presents them |
| Live or streaming dashboard, "RUNNING ●" badge | No real-time source; "Live" is banned for simulated data |
| Example numbers from the docs shown as results | They are worked examples (master doc §49 mistake 3) |
| Headline percentages from the in-browser simulator | A toy model is not a result |
| File/module count statistics | 81 of 179 `.m` files are empty |
| Recolored or cropped MATLAB plots | Falsifies the color scale |
| Chart/animation libraries beyond GSAP (Chart.js, D3, Three.js, Lottie), Lenis smooth scroll | Weight, scroll hijacking, off-brand defaults |
| Contact form or backend | Static site only |
| MathWorks or defence-organisation logos, endorsement claims | Trademark and truth risk |
| Numbers in the OG image or hero | Numbers lose their status tags when shared |
| Scroll-jacked storyboards and parallax | Cost, INP and mobile risk; annoys fast skimmers |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 1 | Complete |
| FND-02 | Phase 1 | Complete |
| FND-03 | Phase 1 | Complete |
| FND-04 | Phase 3 | Pending |
| FND-05 | Phase 1 | Complete |
| DATA-01 | Phase 2 | Pending |
| DATA-02 | Phase 2 | Pending |
| DATA-03 | Phase 2 | Pending |
| DATA-04 | Phase 2 | Pending |
| DATA-05 | Phase 2 | Pending |
| DATA-06 | Phase 2 | Pending |
| DATA-07 | Phase 2 | Pending |
| UI-01 | Phase 2 | Pending |
| UI-02 | Phase 2 | Pending |
| UI-03 | Phase 2 | Pending |
| UI-04 | Phase 2 | Pending |
| UI-05 | Phase 2 | Pending |
| UI-06 | Phase 2 | Pending |
| UI-07 | Phase 2 | Pending |
| SHELL-01 | Phase 1 | Complete |
| SHELL-02 | Phase 1 | Complete |
| SHELL-03 | Phase 1 | Complete |
| SHELL-04 | Phase 3 | Pending |
| SHELL-05 | Phase 3 | Pending |
| PROB-01 | Phase 3 | Pending |
| PROB-02 | Phase 3 | Pending |
| PROB-03 | Phase 3 | Pending |
| PROB-04 | Phase 3 | Pending |
| HOW-01 | Phase 3 | Pending |
| HOW-02 | Phase 3 | Pending |
| HOW-03 | Phase 4 | Pending |
| HOW-04 | Phase 3 | Pending |
| HOW-05 | Phase 3 | Pending |
| BUILT-01 | Phase 3 | Pending |
| BUILT-02 | Phase 3 | Pending |
| BUILT-03 | Phase 3 | Pending |
| BUILT-04 | Phase 3 | Pending |
| BUILT-05 | Phase 4 | Pending |
| BUILT-06 | Phase 3 | Pending |
| BUILT-07 | Phase 3 | Pending |
| BUILT-08 | Phase 4 | Pending |
| NEW-01 | Phase 3 | Pending |
| NEW-02 | Phase 3 | Pending |
| NEW-03 | Phase 4 | Pending |
| NEW-04 | Phase 4 | Pending |
| NEW-05 | Phase 3 | Pending |
| DEMO-01 | Phase 3 | Pending |
| DEMO-02 | Phase 3 | Pending |
| DEMO-03 | Phase 4 | Pending |
| DEMO-04 | Phase 4 | Pending |
| DEMO-05 | Phase 3 | Pending |
| SECU-01 | Phase 3 | Pending |
| SECU-02 | Phase 4 | Pending |
| SECU-03 | Phase 4 | Pending |
| ROAD-01 | Phase 3 | Pending |
| ROAD-02 | Phase 3 | Pending |
| WHY-01 | Phase 3 | Pending |
| WHY-02 | Phase 3 | Pending |
| WHY-03 | Phase 3 | Pending |
| WHY-04 | Phase 3 | Pending |
| MOT-01 | Phase 4 | Pending |
| MOT-02 | Phase 4 | Pending |
| MOT-03 | Phase 4 | Pending |
| MOT-04 | Phase 4 | Pending |
| MOT-05 | Phase 4 | Pending |
| IMG-01 | Phase 3 | Pending |
| IMG-02 | Phase 5 | Pending |
| IMG-03 | Phase 2 | Pending |
| QA-01 | Phase 6 | Pending |
| QA-02 | Phase 6 | Pending |
| QA-03 | Phase 6 | Pending |
| QA-04 | Phase 6 | Pending |
| QA-05 | Phase 6 | Pending |
| QA-06 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 74 total
- Mapped to phases: 74
- Unmapped: 0 ✓

---
*Requirements defined: 2026-09-30*
*Last updated: 2026-09-30 after roadmap creation*
