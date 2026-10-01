# Roadmap: AVOLITE Website

## Overview

Breadth-first build of a static, honesty-first single-page site for AVOLITE (SIH 2026, PS 26055). Each phase leaves a shippable site. The order is: shell and stack, then the data and status system that every number flows through, then all 8 sections as static pages (the ship point, deadline 2026-10-02), then interactives and motion (motion is the first cut), then late team assets, then QA and a user-requested deploy.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Shell and stack** - Astro 7 static scaffold, tokens, fonts, cleaned logo, header/nav/mobile menu and 8 anchored section stubs (completed 2026-09-30)
- [x] **Phase 2: Data and honesty system** - CSV ingest, zod honesty rules, build checks and the UI primitives every number and tag must pass through (completed 2026-10-01)
- [ ] **Phase 3: All sections, static (ship point)** - Hero, sections 01-08 and footer with final copy, real results or honest placeholders, complete with JS off
- [ ] **Phase 4: Interactives and motion** - Widgets and explainers first, then progressive-enhancement motion (first to be cut)
- [ ] **Phase 5: Asset swap-in** - Labelled AI mood images and any team assets that arrive before the cutoff, swapped into fixed boxes
- [ ] **Phase 6: QA and launch** - Cross-browser, accessibility, performance and honesty audit; deploy to Cloudflare Pages only when the user asks

## Phase Details

### Phase 1: Shell and stack
**Goal**: A visitor can load a fast static page with the AVOLITE brand, a working numbered navigation and all 8 section anchors
**Depends on**: Nothing (first phase)
**Requirements**: FND-01, FND-02, FND-03, FND-05, SHELL-01, SHELL-02, SHELL-03
**Success Criteria** (what must be TRUE):
  1. A clean clone runs `npm ci && npm run build` and produces `dist/`, and `npm run preview` serves the page with 8 empty, anchored sections in order 01-08
  2. Visitor sees the cleaned, reversed AVOLITE logo in a sticky header with links 01-08; clicking a link jumps to its section and the link for the section in view is highlighted
  3. On a phone-width screen, visitor opens a mobile menu listing all 8 sections with subtitles, focus stays inside it, and it closes with Escape
  4. Keyboard user's first Tab reveals a skip link that moves focus to main content
  5. Text renders in self-hosted Archivo / IBM Plex with no visible font swap shift, and all colors, spacing and type come from one tokens file
**Plans**: 3 plans
- [x] 01-01-PLAN.md — Astro 7 scaffold, tokens, self-hosted fonts, Base layout, SECTIONS[], Logo contract stub, test infrastructure (wave 1)
- [x] 01-02-PLAN.md — Logo cleanup script, generated JSON, sprite, Logo component, favicon (wave 2)
- [x] 01-03-PLAN.md — 8 anchored sections, sticky header with scroll-spy, dialog mobile menu, skip link, Playwright and axe specs (wave 3, runs after 02; same working tree)
**UI hint**: yes

### Phase 2: Data and honesty system
**Goal**: Every number and status tag on the site can only come from one validated data path, and the building blocks to show them exist
**Depends on**: Phase 1
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06, DATA-07, UI-01, UI-02, UI-03, UI-04, UI-05, UI-06, UI-07, IMG-03
**Success Criteria** (what must be TRUE):
  1. The CFAR five-target CSV is ingested into typed JSON with computed max/mean errors and detection count; editing the CSV by hand, rendering a number without a status, tagging repo data ILLUSTRATIVE, or merging datasets fails the build (each rule has a failing test fixture under `npm test`)
  2. The build fails when output contains "Live", "real-time", AI/ML next to BUILT, or TODO/TBD/lorem outside a placeholder
  3. A preview page shows all six status tags, each distinguishable by glyph and border without color, plus the legend
  4. A preview page shows a metric readout (ILLUSTRATIVE variant hatched, no count-up), a MATLAB figure on a light plate with caption/status/source, a fixed-ratio placeholder naming its pending asset, and a result table that becomes cards under 768 px with a "View as table" disclosure
  5. Raster images are served as AVIF/WebP with explicit width and height
**Plans**: 2 plans
- [x] 02-01-PLAN.md — Pinned CSV ingest, results.json, data.ts zod honesty rules and derived values, requireTagged, dist wording lint wired into astro build, node fixture tests (wave 1)
- [x] 02-02-PLAN.md — StatusTag/legend/SectionHeader/Metric/Figure/Placeholder/ResultTable/TableDisclosure, PNG intake as AVIF/WebP, unlinked noindex /preview/, dist and Playwright/axe tests (wave 2, runs after 01; same working tree)
**UI hint**: yes

### Phase 3: All sections, static (ship point)
**Goal**: A judge can scroll the whole page once, with JavaScript off, and understand the problem, see the real MATLAB work and tell what is built, designed and illustrative
**Depends on**: Phase 2
**Requirements**: FND-04, SHELL-04, SHELL-05, PROB-01, PROB-02, PROB-03, PROB-04, HOW-01, HOW-02, HOW-04, HOW-05, BUILT-01, BUILT-02, BUILT-03, BUILT-04, BUILT-06, BUILT-07, NEW-01, NEW-02, NEW-05, DEMO-01, DEMO-02, DEMO-05, SECU-01, ROAD-01, ROAD-02, WHY-01, WHY-02, WHY-03, WHY-04, IMG-01
**Success Criteria** (what must be TRUE):
  1. With JS disabled, a full-page screenshot shows the hero (no numbers), all 8 sections with final copy or honest placeholders, and the footer with legend, honesty note and "Created by Sandesh Naik"
  2. Judge reads the PS 26055 framing, "Today vs Asked for", emitter chips and a requirement map A-H with statuses and tally; each row links to the section holding its evidence
  3. Judge sees the closed-loop flowchart with a status tag on every node (compact 7-step ring on phones), the SARRS framing banner, the "What runs today" list, the SIMULATED CFAR table with source path, real MATLAB plots on figure plates, the rule-based baseline tagged PROTOTYPE, and the dashboard placeholder
  4. Judge sees the DESIGNED AI pipeline with the "two decisions" idea and PLANNED ablation ladder, the demo box (video placeholder with chapter list, result tabs, repo link), the DESIGNED security layers with "not yet implemented" note, the roadmap with "WE ARE HERE" at P1, and the Why section with cited sources marked "not an AVOLITE result"
  5. No number appears anywhere without a status tag, and every data visual is SVG/code or an unrecolored MATLAB export
**Plans**: TBD
**UI hint**: yes

### Phase 4: Interactives and motion
**Goal**: Judges can explore the smart-scan idea hands-on, and the scan-to-lock story moves, without any function depending on motion
**Depends on**: Phase 3
**Requirements**: HOW-03, BUILT-05, BUILT-08, NEW-03, NEW-04, DEMO-03, DEMO-04, SECU-02, SECU-03, MOT-01, MOT-02, MOT-03, MOT-04, MOT-05
**Success Criteria** (what must be TRUE):
  1. Judge can open an explainer on any flowchart node, drag the range-Doppler vs CFAR before/after slider, and see the expected-vs-detected dumbbell chart drawn from the JSON
  2. Judge can run the in-browser scan simulator (play/pause, speed, reseed) comparing fixed sweep and adaptive scan, see hit/miss timelines including a periodic sweep locking into step with a periodic emitter, and the ILLUSTRATIVE toy tag is visible inside the frame with no derived percentages
  3. Judge can step through the JEV worked example (every value ILLUSTRATIVE) with a fast-path/escalation toggle, tick skills to see which models the router activates, pick a failure mode to see the catching layer and fallback, and try the Approve/Modify/Reject cluster panel
  4. Hero radar sweeps with a pause toggle and stops offscreen; each loop stage plays one time-based motion on entering view; with reduced motion every widget still works and shows final states; under 768 px there is no sticky stepper or looping pulse
  5. Only transform, opacity and SVG stroke properties animate; removing the motion layer leaves every widget working
**Plans**: TBD
**UI hint**: yes

### Phase 5: Asset swap-in
**Goal**: Late team assets and mood imagery appear in their reserved boxes without layout change and with honest labels
**Depends on**: Phase 3 (runs alongside Phase 4 as assets arrive; cutoff about 12 hours before deadline)
**Requirements**: IMG-02
**Success Criteria** (what must be TRUE):
  1. AI-generated mood scenes appear only in sections 01, 07 and 08, each captioned "AI-generated · mood only, not AVOLITE hardware"
  2. Any asset delivered before the cutoff (demo video, dashboard screenshots, team ID) replaces its placeholder with no layout shift; anything later still shows the honest placeholder
  3. No status tag is upgraded (e.g. AoA or ML scheduler from DESIGNED) without evidence in hand
**Plans**: TBD
**UI hint**: yes

### Phase 6: QA and launch
**Goal**: The site is verified accessible, fast and honest across browsers and screen sizes, and goes live on Cloudflare Pages when the user asks
**Depends on**: Phase 3 (Phases 4 and 5 included if done)
**Requirements**: QA-01, QA-02, QA-03, QA-04, QA-05, QA-06
**Success Criteria** (what must be TRUE):
  1. At 1440, 768 and 390 px there is no horizontal scroll and the layout holds; on a 1280x720 dimmed screen body text and essential lines stay readable
  2. Playwright smoke passes in Chromium, Firefox and WebKit, including JS-off and reduced-motion runs, and axe reports no violations; every control works by keyboard with a visible focus ring
  3. Lighthouse mobile scores at least 90 performance, 100 accessibility, 100 SEO, and page JS is at most 70 KB gzip
  4. After the user asks, the site is live on Cloudflare Pages and the production URL serves the same page as `npm run preview`
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6. Phase 3 is the ship point; if time runs short, cut Phase 4 motion first, then Phase 4 interactives, and go from Phase 3 straight to Phase 6.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Shell and stack | 3/3 | Complete    | 2026-09-30 |
| 2. Data and honesty system | 2/2 | Complete    | 2026-10-01 |
| 3. All sections, static (ship point) | 0/TBD | Not started | - |
| 4. Interactives and motion | 0/TBD | Not started | - |
| 5. Asset swap-in | 0/TBD | Not started | - |
| 6. QA and launch | 0/TBD | Not started | - |
