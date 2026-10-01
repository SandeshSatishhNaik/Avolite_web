---
phase: 02-data-and-honesty-system
plan: 02
subsystem: ui
tags: [astro, status-tag, metric, figure, astro-assets, avif, axe, playwright]
requires:
  - phase: 02-data-and-honesty-system
    provides: data.ts (requireIssued, metric, illustrative, cell, dataset, fmt, columnLabel), status.ts, site.ts REPO.blob, honesty lint
provides:
  - Eight UI primitives (StatusTag, StatusLegend, SectionHeader, Placeholder, Metric, ResultTable, TableDisclosure, Figure)
  - figures.ts registry of the 10 scenario-A MATLAB PNGs (lazy glob) served as AVIF + WebP
  - Unlinked noindex /preview/ page (meta robots + X-Robots-Tag) with no client JS
  - tests/preview.test.mjs (dist) and tests/preview.spec.ts (Playwright + axe)
affects: [03 all sections]
tech-stack:
  added: []
  patterns:
    - render-time origin check: components call requireIssued, so hand-built literals fail the build
    - lazy import.meta.glob for image registry plus post-build prune of unreferenced PNG originals
    - table to cards under 768 px with explicit ARIA roles, source line kept outside the caption
key-files:
  created:
    - src/components/ui/StatusTag.astro
    - src/components/ui/StatusLegend.astro
    - src/components/ui/SectionHeader.astro
    - src/components/ui/Placeholder.astro
    - src/components/ui/Metric.astro
    - src/components/ui/ResultTable.astro
    - src/components/ui/TableDisclosure.astro
    - src/components/ui/Figure.astro
    - src/lib/figures.ts
    - src/pages/preview.astro
    - src/assets/repo/04_MATLAB/ (10 PNGs, byte-identical to upstream 9b985ca)
    - tests/preview.test.mjs
    - tests/preview.spec.ts
  modified:
    - src/styles/tokens.css
    - src/layouts/Base.astro
    - public/_headers
    - astro.config.mjs
key-decisions:
  - "figures.ts uses a lazy import.meta.glob (loadImage) instead of 10 static imports"
  - "Prune unreferenced PNG originals from dist/_astro in the build:done hook so IMG-03 holds"
  - "ResultTable source line (tag + GitHub link) sits under the table, not in the caption"
  - "Cards break at max-width 767.98px; 768 px is a normal table"
requirements-completed: [UI-01, UI-02, UI-03, UI-04, UI-05, UI-06, UI-07, IMG-03, DATA-02]
duration: 40min
completed: 2026-10-01
---

# Phase 2 Plan 02: UI primitives, PNG intake and /preview/ Summary

**Eight status-aware UI primitives, AVIF/WebP MATLAB figures on an unrecoloured white plate, and an unlinked noindex /preview/ page proven by dist assertions plus Playwright and axe at 1440, 768 and 390 px.**

## Accomplishments

- Six distinct StatusTags (inline SVG glyphs, dashed border only for PLANNED and ILLUSTRATIVE, hatch on ILLUSTRATIVE, label always in the DOM) and a six-definition legend.
- `Metric` and `ResultTable` call `requireIssued`; every number renders as `<data data-status>`; `data-countup` only on SIMULATED/BUILT; ILLUSTRATIVE metric is hatched, `--text-2`, no count-up.
- `Figure`: `astro:assets` Picture (AVIF + WebP, width/height, lazy/async), white `--plate`, no filter/blend/opacity, caption with SIMULATED tag and GitHub link at the pinned commit.
- `Placeholder` with allow-listed ratios (16/9, 16/10, 2.23/1), holds its box at 390 and 1440 px.
- `ResultTable` stacks to cards under 768 px (clip-hidden thead, `td::before` labels, ARIA roles); `TableDisclosure` "View as table" (44 px summary).
- `/preview/`: meta robots noindex, two `X-Robots-Tag` blocks in `_headers`, no extra script (same count as home), `index.astro` untouched.

## Task Commits

1. Task 1: tags, legend, section header, placeholder, noindex plumbing - `2831dda`
2. Task 2: metric, table, disclosure, figure, PNG intake, registry - `c360a12`
3. Task 3: Playwright and axe specs (plus ResultTable axe fix) - `3ed3147`

## Verification

- `npm run build` exit 0; `npm test` 90/90; `npm run check` 0 errors, 0 warnings; `npm run test:e2e` 32/32 (Phase 1 specs plus 8 preview specs; axe preview 1440 and 390 clean).
- dist/_astro: 0 PNG, 3 AVIF, 4 WebP; `grep -o data-countup dist/preview/index.html | wc -l` = 3; `Master doc` count 0; `src/pages/index.astro` unchanged.

## Manual proof (not committed)

Temporarily edited `src/pages/preview.astro`, then restored it from a backup:
- (a) Metric given `{ value: 1, unit: 'm', label: 'x', source: 'y' }` (no status): `npm run build` exit **1**, `Metric: number rendered without status (DATA-02)`.
- (b) Complete literal with `status: 'SIMULATED'`: exit **1**, `Metric: value was not issued by data.ts (hand-built literal, DATA-02)`.
- (c) Reverted: exit **0**.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Unused PNG originals shipped in dist/_astro**
- **Found during:** Task 2 build
- **Issue:** Static imports in `figures.ts` (and then a lazy glob) emit all 10 PNGs; Astro deletes only the originals it optimises, so 9 stayed in `dist/_astro`, breaking the IMG-03 "no PNG" criterion.
- **Fix:** `figures.ts` now uses a lazy `import.meta.glob` plus `loadImage(id)`; `astro.config.mjs` `astro:build:done` runs `pruneUnusedPng`, removing `dist/_astro/*.png` that no built html/css/js references.
- **Files modified:** src/lib/figures.ts, src/components/ui/Figure.astro, astro.config.mjs (not in the plan file list)
- **Commit:** c360a12

**2. [Rule 1 - Bug] axe aria-required-children on ResultTable**
- **Found during:** Task 3
- **Issue:** the explicit `role="table"` plus a link inside `<caption>` failed axe (critical).
- **Fix:** the tag and source link moved to a `<p class="rt__src">` directly under the table; caption keeps title and scenario.
- **Files modified:** src/components/ui/ResultTable.astro
- **Commit:** 3ed3147

**3. [Plan inconsistency] 768 px table behaviour**
- The plan says cards under 768 px and a normal table from 768 px, but also asks the `tr` display at 768 to be not `table-row`. Implemented the first (breakpoint `max-width: 767.98px`); the 768 px spec asserts no horizontal scroll only.

**4. Alt text** carries no numbers or target-id labels ("target labels", "detection labels"), per the plan's no-numbers rule.

## Known Stubs

None. The placeholders on /preview/ are the deliverable (UI-06).

## Threat Flags

None beyond the plan's threat model (no `set:html`, links same-tab, ratio allow-list, no new client JS).

## Self-Check: PASSED

Files verified present; commits `2831dda`, `c360a12`, `3ed3147` exist in git log.
