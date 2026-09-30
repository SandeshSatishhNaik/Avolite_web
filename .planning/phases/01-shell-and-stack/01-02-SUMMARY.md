---
phase: 01-shell-and-stack
plan: 02
subsystem: ui
tags: [svg, logo, sprite, favicon, node-test, playwright]

requires:
  - phase: 01-01
    provides: Logo props contract stub, logo.css classes (.lg-g/.lg-k, --logo-green/--logo-khaki), LogoSprite rendered once in Base.astro
provides:
  - scripts/clean-logo.mjs (logo.svg -> logo.generated.json + favicon.svg, deterministic)
  - src/lib/logo.generated.json (viewBoxes plus green/khaki/holed path data for mark and wordmark)
  - public/favicon.svg (mark on #050B16, baked brand colours)
  - Real Logo.astro and LogoSprite.astro (lg-mark, lg-word as <g> defs, emitted once)
  - tests/logo.test.mjs (8 tests incl. dist group) and tests/logo.spec.ts (4 e2e tests)
affects: [01-03 header (mark + wordmark, decorative), phase 3 footer lockup]

tech-stack:
  added: []
  patterns:
    - "Generated data is never hand-edited: a test re-runs the script and compares bytes"
    - "Sprite uses <g> defs with viewBox only on the per-use outer svg (no <symbol> double mapping)"
    - "evenodd applied only to the holed wordmark path (the O counter)"

key-files:
  created:
    - scripts/clean-logo.mjs
    - src/lib/logo.generated.json
    - public/favicon.svg
    - tests/logo.test.mjs
    - tests/logo.spec.ts
  modified:
    - src/components/ui/Logo.astro
    - src/components/ui/LogoSprite.astro

key-decisions:
  - "Script body taken verbatim from 01-RESEARCH Pattern 5; only argument handling and favicon generation added"
  - "logo.svg left untracked as the plan's files list does not include it (see Issues)"

patterns-established:
  - "Logo svgs have width:auto in logo.css: inside a stretching flex column they stretch to container width; place them in a row flex or use align-items:flex-start"

requirements-completed: [FND-05]

duration: 8min
completed: 2026-09-30
---

# Phase 1 Plan 02: Logo cleanup, sprite and favicon Summary

**Repeatable clean-logo script turns the VTracer trace into green/khaki/holed path data (37 KB JSON), rendered through a once-per-page sprite by the existing Logo contract, plus a generated favicon.**

## Performance

- **Duration:** about 8 min
- **Tasks:** 2
- **Files created:** 5, modified: 2

## Accomplishments

- `node scripts/clean-logo.mjs` prints viewBoxes lockup `256 50 1471 671`, mark `443 50 1081 492`, wordmark `256 571 1471 150` (identical to the research spike); output is byte-identical across runs and to the committed files.
- Background path dropped; the O counter kept as an `evenodd` hole (visually confirmed in a lockup render: O shows its counter, khaki E bar and arcs correct).
- Sprite defs `lg-mark` and `lg-word` appear once in `dist/index.html`; holed path data appears once; `dist/favicon.svg` built and linked.
- Reversed tone resolves `--logo-green` `#e8eef6`, `--logo-khaki` `#bcac87`; color tone `#2d4639`. Heights 36 / 14 / 64 px. Pixel check passes (light and khaki pixels each over 1 percent).
- Gates: `npm run check` 0 errors, `npm test` 25 passing, `npm run test:e2e` 5 passing (chromium).

## Task Commits

1. **Task 1: clean-logo script, generated JSON, favicon, pinning tests** - `dae5c9a` (feat)
2. **Task 2: real Logo and LogoSprite, dist and e2e logo tests** - `6fc62d3` (feat)

## Decisions Made

None beyond the plan; the script and components follow 01-RESEARCH Pattern 5.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Test harness stretched injected svgs**
- **Found during:** Task 2 (first e2e run)
- **Issue:** The injected container was a flex column with default `align-items: stretch`; `width:auto` svgs stretched to page width, breaking the aspect-ratio and khaki-percentage checks. Not a Logo bug.
- **Fix:** Added `align-items:flex-start` to the test container in `tests/logo.spec.ts`.
- **Commit:** `6fc62d3`

**2. [Minor] TDD commit shape**
- RED was confirmed (suite failed before the script/outputs existed) but tests and implementation were committed together per task, matching plan 01.

**Total deviations:** 1 auto-fixed (test harness only). **Impact:** none on scope.

## TDD Gate Compliance

Task 1 ran RED (logo.test.mjs failed on missing generated files) then GREEN, committed as one `feat` commit. No separate `test(...)` commit exists.

## Issues Encountered

- **`logo.svg` is untracked and not committed** (plan files list excludes it; run instructions said commit only if listed). The "committed output equals a fresh run" test and `scripts/clean-logo.mjs` read `logo.svg`, so a clean clone will fail `tests/logo.test.mjs` until `logo.svg` is committed. The orchestrator or user should decide to add it (it is a brand asset and the script input).
- Dist group of logo.test.mjs is skipped (with message "run npm run build first") when `dist/index.html` is absent rather than failing.

## Known Stubs

None. Plan 01's Logo/LogoSprite stubs are now real. `Base.astro` header is still plan 03.

## Threat Flags

None. Surface matches T-02-01..04 (script throws on under 40 paths or orphan counter; no `#` in JSON asserted; no packages installed).

## Next Phase Readiness

Plan 01-03 can place `<Logo variant="mark" label={null} />` and `<Logo variant="wordmark" label={null} />` in a row-flex header link. Note `.logo` uses `width:auto`; in a stretching flex column the svg widens, so keep logos in row or `align-items:flex-start` containers.

## Self-Check: PASSED

Files exist: scripts/clean-logo.mjs, src/lib/logo.generated.json, public/favicon.svg, tests/logo.test.mjs, tests/logo.spec.ts, Logo.astro, LogoSprite.astro. Commits `dae5c9a` and `6fc62d3` exist. `Base.astro`, `global.css`, `logo.css`, `tokens.css` unmodified.
