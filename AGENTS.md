# AGENTS.md

## Current extension — 5 October 2026

The user requested a light theme and motion throughout the page, including scrolling. Pearl is the default, with a persistent Plum switch. `.planning/redesign/LIGHT-MOTION-SPEC.md` records the authorized theme and scroll extension. It supersedes older no-theme-switch and no-chapter-entrance rules. Preserve evidence, original plot pixels, accessibility, React and the no-push-without-request rule.

## Current override — 2 October 2026

The user explicitly requested the entire site in React. React 19 + Vite + TypeScript now replace Astro; do not restore Astro files, MDX or Astro APIs from historical guidance below. The selected Exhibition Cutaway and light supporting chapters replace the old navy-only design. Current design authority: `.planning/redesign/EXPERIENCE-SPEC.md` and the implemented `src/App.tsx`. Fonts are local WOFF2; motion uses native CSS and React state. All eight chapters remain on `/`, with `/system/` and `/evidence/` appendices. See `README.md` for current commands and source layout. Preserve data issuance, provenance, accessibility and the no-push-without-request rule. The older stack, routes, token values, deadline and folder paths below are historical.

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Communication mode

Invoke the `caveman` skill (via the Skill tool) at the start of every session and keep it active for every prompt: terse output, full technical accuracy.

On coding prompts only (writing, editing, fixing, refactoring or reviewing code), also invoke `ponytail:ponytail` (laziest solution that works, no over-engineering) and `andrej-karpathy-skills:karpathy-guidelines` (surface assumptions, make surgical changes, define verifiable success criteria). Invoke no other skills unless the prompt requires them.

On frontend prompts (building, styling, animating or reviewing the website UI), use exactly these pinned skills:

- `modern-web-guidance` — current HTML/CSS/JS APIs. Load first.
- `frontend-design:frontend-design` and `design-taste-frontend` — design direction and anti-template taste.
- `impeccable` — polish, responsive behavior, accessibility, motion.
- `dataviz` — spatial-response chart, metric readouts, validation charts, test matrix.
- `web-design-guidelines` — only when reviewing or auditing finished UI.

Pinned MCP servers:

- **Playwright** — visual QA: screenshots at 1440, 768 and 390 widths, reduced-motion emulation, console checks.
- **Firecrawl** — scraping and research (reference UIs, library docs, AoA/direction-finding papers). Cite sources for any technical claim taken from research; never present scraped or published numbers as AVOLITE results.
- **Figma** — only if a Figma file is supplied later (none exists now).
- **Cloudflare** — hosting is Cloudflare Pages (see Deployment). The Vercel MCP is not used for this site.
- **21st.dev, kexsio** — inspiration only; never copy React code (this is an Astro site).
- **Context7** — installed. Use it (or the `find-docs` skill) for GSAP, Astro and Cloudflare API details instead of training memory.

Knowledge graph (`graphify` skill):

- For any question about this codebase, its architecture, file relationships or project docs: if `graphify-out/graph.json` exists, run a graphify query first (`/graphify query "<question>"`) before grepping or reading files. Fall back to Grep/Read only for what the graph does not answer.
- Build the graph once code exists (after M0) with `/graphify .`. Refresh it with `/graphify . --update` at the end of every milestone and after large changes, so it never goes stale.
- Keep `graphify-out/` out of git (listed in `.gitignore`); it is a local artifact. Do not graph `node_modules/`, `dist/` or `.astro/`.

Do not use Unsplash (no stock imagery), Mobbin, UX Pilot, Mermaid, Supabase, Gamma, HyperFrames or Miro. Do not load other design skills (`minimalist-ui`, `high-end-visual-design`, `gpt-taste`, `ui-ux-pro-max`, etc.); their presets clash with this design system, which always wins. A `UserPromptSubmit` hook in `.Codex/settings.json` re-injects these rules on every prompt.

## Source documents

- `AVOLITE_Website_Creation_Comprehensive_Project_Details.md` — the spec (project, story, copy). Section numbers like §33 refer to it.
- `DESIGN_PLAN.md` — the approved plan: decisions, tokens, wireframes, motion specs, assets, data model, roadmap. Read the relevant section before building any part of the site.
- `logo.svg` — supplied logo, a VTracer auto-trace (white background path, no `viewBox`, near-duplicate fills). Clean it up once in M0 (DESIGN_PLAN Phase 5), then use it only via `src/components/ui/Logo.astro`.

## What this is

An engineering storytelling site (not a marketing page) for AVOLITE, an RF smart-scanning system that detects a signal, estimates its Angle of Arrival (AoA) and validates the estimate against a known reference direction. The MATLAB/Simulink model is not in this repo and is unfinished; the site visualizes its exported results.

- `/` — one scrollytelling page, 9 sections: Hero, Challenge, How it works (sticky storyboard), Signal pipeline, Angle of Arrival, Validation, Implementation stack, Documentation, Final CTA. A header progress rail tracks `Scan > Detect > Process > Estimate > Validate > Lock`; LOCK fires at the end of Validation.
- `/docs` — index plus `system-design`, `simulink-model`, `aoa-method`, `results` (MDX). Sections without model output render `PendingPanel`, never filler text.

## Data honesty (non-negotiable)

- Every number on the site comes from `src/data/results.json` through `src/lib/results.ts`. Never hard-code a result value in a component.
- Every displayed number and chart carries a `ProvenanceBadge` for its tier: `conceptual` (ILLUSTRATIVE), `simulation` (SIMULATION), `hardware` (MEASURED). One tier per results file.
- The current file is conceptual (generated by `scripts/make-conceptual-data.mjs`). The values 38.0° / 37.4° / 0.6° / 94.2% are illustrative.
- The build enforces these rules via zod in `results.ts`; do not weaken them:
  1. Conceptual tier: test-case `estimatedAngle` and `absoluteError` must be `null`, so the matrix shows "—  Awaiting simulation".
  2. `absoluteError` must equal `|referenceAngle − estimatedAngle|` (±0.05°).
  3. `scanAngles` ascending, within ±90°, same length as `spatialResponse`; responses in [0, 1].
  4. Non-conceptual tiers require `source.modelVersion`.
  5. Derived values (peak angle, mean/max error) are computed, never typed.
- Pass/fail colors appear only for simulation or hardware data. The confidence definition is open: show "Definition pending" while `confidenceDefinition` is null.
- Do not invent engineering details the spec leaves open: array geometry, element count, the AoA algorithm, the confidence formula, dB values. Keep copy method-agnostic ("phase/time difference", "spatial response").
- Hardware (SDR, multi-channel receiver, real-world AoA) is a future path only. The word "Live" is not used until real streaming exists.
- The OG image contains no numbers.

## Stack and commands

Astro 7 (static) + TypeScript + plain CSS custom properties; MDX for docs (added in M2); GSAP (ScrollTrigger, MorphSVG, DrawSVG, MotionPath; all free; added in M3) on `/` only. No Tailwind, no chart library, no icon package. Fonts come from the built-in Astro Fonts API (`fonts` in `astro.config.mjs`, Google provider): files are downloaded at build and self-hosted, with metric-matched fallbacks. No Fontsource packages.

Scripts (`dev`, `build`, `preview`, `check` since M0; `test`, `data:conceptual` since M1; `test:e2e` arrives in M2, so verify in `package.json` first):

```
npm run dev              # dev server
npm run build            # static build; also runs results.json validation
npm run preview          # serve the build
npm run check            # astro check (types)
npm test                 # node --test tests/results.test.mjs (data and honesty rules)
npm run test:e2e         # Playwright smoke + axe, Chromium/Firefox/WebKit
npx playwright test -g "<name>"   # single e2e test
npm run data:conceptual  # regenerate the illustrative dataset
```

## Deployment

- Repo: https://github.com/SandeshSatishhNaik/Avolite_web (remote `origin`, default branch `main`).
- Hosting: Cloudflare Pages with Git integration. Every push to `main` auto-deploys production; other branches get preview URLs. No GitHub Action is needed.
- Cloudflare build settings: preset Astro, build command `npm run build`, output `dist`, env `NODE_VERSION` = the local Node major version.
- `site` in `astro.config.mjs` resolves in this order:
  1. `SITE_URL`, set in the Cloudflare production environment to `https://<project>.pages.dev`.
  2. `CF_PAGES_URL`, the per-deployment URL Cloudflare injects (right for previews).
  3. The placeholder `https://avolite.example`, which prints a build warning.
- Pushing deploys publicly: never push without the user asking.

## Folder structure

```
src/data/results.json        only source of numbers
src/lib/site.ts              site constants (REPO_URL)
src/lib/results.ts           zod schema, honesty rules, derived values
src/lib/chart.ts             scaleLinear + linePath for SVG charts
src/lib/motion.ts            GSAP setup, EASE/DUR constants, matchMedia
src/scripts/home.ts          GSAP entry for "/" only
src/styles/tokens.css        design tokens; global.css
src/icons/*.svg              Lucide copies + 6 stack glyphs
src/components/ui/           Logo, ProvenanceBadge, MetricReadout, StageChip, StageRail, PendingPanel, Header, Footer
src/components/viz/          RadarStage, AoADial, SpatialResponseChart, PipelineDiagram, PipelineNode, TestMatrix, HardwarePath, ChallengeSpectrum, ChallengeArray
src/components/sections/     one component per home-page section
src/layouts/                 BaseLayout, DocsLayout
src/pages/                   index.astro, docs/*.mdx
scripts/clean-logo.mjs          logo.svg → Logo.astro (one-off)
scripts/make-conceptual-data.mjs
tools/matlab/export_results.m   MATLAB → results.json (same schema)
tests/results.test.mjs, tests/smoke.spec.ts
```

## Design tokens

Colors (text tokens all pass WCAG AA on every surface):

```
--bg-0 #07101F  page          --text-1 #E6EEF8  headings, readouts
--bg-1 #0C1830  panels/charts --text-2 #9BAEC8  body
--bg-2 #13223F  raised        --text-3 #7B91B0  captions, ticks
--line #1E3358  decorative    --signal #3BE4F2  active signal, beam, focus, key data
--line-strong #3A5A8C borders --signal-dim #1D8FA3  inactive paths
--valid #3DDC97  --warn #F2B84B  --error #FF7A7A   (always with icon + text)
--brand-khaki #BAAA87  logo only    --brand-green #2D4639  full-color logo on light surfaces only
```

- Cyan covers under 5% of any viewport.
- Charts are single-series: the estimate is `--signal`; the reference is a dashed 1px `--text-1` annotation with a direct label.
- No light theme; declare `color-scheme: dark`.

Type:
- **Archivo** (variable): headings `wdth` 112–118, `wght` 600–650; readouts `wdth` 100, `wght` 600, `tabular-nums`.
- **IBM Plex Sans** 400/500: body 17px/1.6, measure at most 68ch.
- **IBM Plex Mono** 400: only ticks, units, IDs and AoA step numbers.
- Display is `clamp(3rem, 1.6rem + 4.4vw, 6rem)`; full scale in DESIGN_PLAN Phase 2.
- Uppercase only for stage names, the hero domain label and badges.

Layout:
- Spacing on a 4px scale (4 … 192).
- Grid: 1440 frame, 12 columns, 80px margins, 24px gutters. Tablet (768–1279) 8 columns / 40px margins. Mobile (under 768) 4 columns / 16px margins.
- No horizontal page scroll.
- Left-aligned text; center only for the final CTA and the dial readout.

Lines, shapes, effects:
- Lines: 1px hairlines, 1.5px connectors and rings, 2px data lines and beam, 4/4 dash for the reference.
- Radius: 4px panels and buttons, 2px chips.
- No shadows; elevation comes from a surface change plus a border.
- Glow only on signal SVG strokes, done as a pre-blurred duplicate with animated opacity; never animate `filter`.

## Conventions

- **Server-render every visual in its final state**; GSAP only animates from it. The site must be complete and honest with JS off.
- **Motion:**
  - Animate only signal activity or responses to user action.
  - No generic section fade-ins, card lifts or parallax.
  - Only transform, opacity and SVG stroke properties.
  - Wrap everything in `gsap.matchMedia()`: reduced motion sets end states, and under 768px there are no sticky storyboard or pipeline pulse.
  - Loops pause offscreen; the hero radar has a pause toggle.
  - ScrollSmoother is not used.
- **Accessibility:**
  - WCAG 2.2 AA; visible 2px `--signal` focus ring (never removed); 44px targets.
  - Informative SVGs get `role="img"` plus `<title>`/`<desc>`; decorative ones get `aria-hidden`.
  - Every chart has a "View as table" `<details>`.
  - Count-up animations keep the real value in the DOM.
- **SVG colors** use tokens or `currentColor`, never raw hex.
- **Copy:** use the spec's wording; sentence case; no "→" appended to buttons; no "A · B · C" meta strings.
- **Buttons** are CSS classes (`.btn`, `.btn--secondary`), not a component.
- **Logo:** `<Logo variant="lockup"|"mark" tone="reversed"|"color" />`. Reversed on dark (green parts render as `--text-1`, khaki kept). Lockup at least 40px tall; use the mark alone below that. Size it from the parent with `:global(.logo)`, because scoped styles do not reach the child SVG. Path data is generated by `node scripts/clean-logo.mjs` from `logo.svg`; never hand-edit it. `public/favicon.svg` is the mark on `--bg-0`.
- **Stack section:** MATLAB/Simulink names as text only; no MathWorks logos.
- **Budgets:**
  - JS on `/` ≤ 70 KB gzip; `/docs` ≤ 5 KB; CSS ≤ 25 KB; fonts ≤ 130 KB.
  - LCP ≤ 2.0 s, CLS ≤ 0.05, INP ≤ 150 ms.
  - Lighthouse mobile ≥ 90, a11y 100, SEO 100.

## Roadmap

M0 setup → M1 data layer → M2 static site (launch first) → M3 GSAP motion → M4 real MATLAB/Simulink data (blocked on the model) → M5 QA and launch checks. Details and done-criteria are in DESIGN_PLAN Phase 6.

Open items from the team: contact details (the `Contact` component ships commented out as `{/* <Contact /> */}` in `FinalCta` and `Footer`; uncomment once details exist, and add the "Contact the team" link then), the Cloudflare project name for `SITE_URL`, an optional original logo vector, and the engineering values listed in the data-honesty rules.
