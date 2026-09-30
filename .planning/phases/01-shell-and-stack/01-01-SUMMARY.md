---
phase: 01-shell-and-stack
plan: 01
subsystem: infra
tags: [astro, typescript, css-tokens, fonts-api, playwright, node-test, cloudflare-pages]

requires: []
provides:
  - Astro 7.3.5 static scaffold that builds to dist/ for Cloudflare Pages
  - tokens.css as the single source of design values, guarded by a lint test
  - Self-hosted Archivo, IBM Plex Sans and IBM Plex Mono (109,256 B woff2, two preloads)
  - SECTIONS[] constant (8 ids, titles, subtitles)
  - Logo props contract stub (variant, tone, label) and logo.css classes
  - node:test suites (config, tokens, build) and a Playwright chromium smoke spec
affects: [01-02 logo art, 01-03 header and shell, phase 2 status tags, phase 3 sections]

tech-stack:
  added: [astro@7.3.5, typescript@^6.0.3, "@astrojs/check@^0.9.10", "@playwright/test@^1.63.0", "@axe-core/playwright@^4.13.0"]
  patterns:
    - "Tokens only in src/styles/tokens.css; everything else uses var()"
    - "Astro Fonts API with Archivo glyph subset to meet the 130 KB font budget"
    - "Logo CSS uses bare .lg-g/.lg-k classes (shadow-tree safe) with inherited custom properties"
    - "Build-output assertions via node:test reading dist/"

key-files:
  created:
    - package.json
    - package-lock.json
    - .node-version
    - .gitignore
    - .gitattributes
    - astro.config.mjs
    - tsconfig.json
    - playwright.config.ts
    - public/_headers
    - src/styles/tokens.css
    - src/styles/global.css
    - src/styles/logo.css
    - src/lib/site.ts
    - src/layouts/Base.astro
    - src/pages/index.astro
    - src/components/ui/Logo.astro
    - src/components/ui/LogoSprite.astro
    - tests/config.test.mjs
    - tests/tokens.test.mjs
    - tests/build.test.mjs
    - tests/smoke.spec.ts
  modified: []

key-decisions:
  - "astro pinned exactly 7.3.5 (experimental font options); typescript ^6.0.3 because npm latest is 7.x, outside @astrojs/check peer range"
  - "Archivo keeps Astro default display swap; revisit in Phase 6 only if layout shift fails"
  - "No @types/node (not in audited package set); playwright.config.ts declares its one global locally"
  - "Token lint flags hex, rgb/hsl and non-var() font-family in src/**/*.{astro,css,ts}, with a fixture self-check"

patterns-established:
  - "Logo contract: <Logo variant tone label /> renders svg.logo.logo--{variant}.logo--{tone}; LogoSprite imports logo.css"
  - "Sections are defined only in src/lib/site.ts"
  - "Playwright webServer always builds then previews, reuseExistingServer false"

requirements-completed: [FND-01, FND-02, FND-03]

duration: 12min
completed: 2026-09-30
---

# Phase 1 Plan 01: Scaffold, tokens and fonts Summary

**Astro 7.3.5 static scaffold with a single tokens file (lint-enforced), three self-hosted font families at 109,256 B, a fixed Logo props contract stub, and green node:test plus Playwright infrastructure.**

## Performance

- **Duration:** about 12 min
- **Started:** 2026-09-30T17:01Z
- **Completed:** 2026-09-30T17:13Z
- **Tasks:** 3
- **Files created:** 21

## Accomplishments

- `npm ci && npm run build` from a clean tree exits 0 and writes `dist/index.html`; `npm run check` 0 errors; `npm test` 17 passing; `npm run test:e2e` 1 passing (chromium).
- Fonts: 3 woff2 files, 109,256 B total (budget 130,000), two `<link rel=preload as=font>`, size-adjust fallbacks, no googleapis/gstatic anywhere in dist.
- `tokens.css` holds all color, type, space, radius, layout and motion values; `tests/tokens.test.mjs` fails on literals elsewhere and proves itself with a fixture.
- Logo contract (props, viewBox map, `.logo--*` sizes) fixed so plans 02 and 03 build against a stable interface.

## Task Commits

1. **Task 1 RED: failing config test** - `e8b16d1` (test)
2. **Task 1 GREEN: scaffold, pinned deps, Cloudflare files** - `08a017d` (feat)
3. **Task 2: tokens, global/logo CSS, SECTIONS, token lint test** - `e19bc47` (feat)
4. **Task 3: base layout, hero stub, Logo stub, build checks, smoke spec** - `b37f244` (feat)

**Plan metadata:** committed with this summary (docs).

## Files Created/Modified

- `package.json`, `package-lock.json`, `.node-version`, `.gitignore`, `.gitattributes`, `astro.config.mjs`, `tsconfig.json`, `playwright.config.ts`, `public/_headers` - tooling and Cloudflare config
- `src/styles/{tokens,global,logo}.css` - design tokens, base styles, logo classes
- `src/lib/site.ts` - `SECTIONS[]`
- `src/layouts/Base.astro`, `src/pages/index.astro` - shell and hero stub with the page h1
- `src/components/ui/{Logo,LogoSprite}.astro` - contract stubs for plan 02
- `tests/{config,tokens,build}.test.mjs`, `tests/smoke.spec.ts` - validation

## Decisions Made

See frontmatter key-decisions. All follow the plan and 01-RESEARCH.md; the only new one is the local `process` declaration (below).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `astro check` error TS2591 on `process` in playwright.config.ts**
- **Found during:** Task 3 (`npm run check`)
- **Issue:** `@types/node` is not installed, so `process.env` fails type checking.
- **Fix:** Added a one-line `declare const process: { env: Record<string, string | undefined> }` in `playwright.config.ts`. Did not install `@types/node`: it is outside the audited package list and the plan forbids adding packages.
- **Files modified:** `playwright.config.ts`
- **Commit:** `b37f244`

**2. [Rule 1 - Bug] Token lint self-check false positive**
- **Found during:** Task 2 (RED run)
- **Issue:** The `font-family` regex backtracked over whitespace, so `font-family: var(--x)` was flagged.
- **Fix:** Lookahead changed to `(?!\s|var\()` so backtracking cannot skip the `var(` guard.
- **Files modified:** `tests/tokens.test.mjs`
- **Commit:** `e19bc47`

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug). **Impact:** none on scope.

## TDD Gate Compliance

Task 1 has a `test(...)` RED commit (`e8b16d1`) followed by a `feat(...)` GREEN commit (`08a017d`). Task 2 was run RED (3 failing) before implementation, but the test file was committed together with the implementation in `e19bc47` (one commit per task).

## Issues Encountered

- npm prints an `install-scripts` warning for transitive `esbuild@0.28.2` postinstall (threat T-01-03, accepted); install and build succeed.
- Git prints LF/CRLF warnings on Windows for new files; `.gitattributes` `eol=lf` normalizes them.

## Known Stubs

- `src/components/ui/Logo.astro` renders an empty `<svg>` and `src/components/ui/LogoSprite.astro` has an empty `<defs>`: intentional contract stubs, replaced with real art by plan 01-02.
- `src/pages/index.astro` hero is a one-line `<h1>` stub: replaced in Phase 3 (SHELL-04).
- `/favicon.svg` is referenced in Base.astro but does not exist yet: generated by plan 01-02 (smoke spec ignores the favicon 404).

## Threat Flags

None. All surface matches the plan's threat model (T-01-01 pin and lockfile, T-01-02 no CDN refs asserted by test, T-01-04 `_headers`, T-01-05 font budget asserted by test).

## Next Phase Readiness

Ready for plan 01-02 (logo cleanup script, real Logo art, favicon) and 01-03 (header, menu, skip link, section stubs, shell specs). The contract and `SECTIONS[]` are fixed. Note for 01-03: `Base.astro` currently has no header, skip link or script; `main#main` exists.

## Self-Check: PASSED

All 21 created files exist; commits `e8b16d1`, `08a017d`, `e19bc47`, `b37f244` exist. Clean-install gate (`rm -rf node_modules dist .astro && npm ci && npm run build && npm test`) passed, 17 tests.
