---
phase: 01-shell-and-stack
plan: 03
subsystem: ui
tags: [astro, header, scroll-spy, dialog, invoker-commands, skip-link, playwright, axe]

requires:
  - phase: 01-01
    provides: SECTIONS[], tokens.css, global.css, Base layout, test infrastructure
  - phase: 01-02
    provides: real Logo art (mark, wordmark) via sprite
provides:
  - Hero stub (only h1) plus 8 anchored data-section stubs with numbered h2
  - Sticky 64px header with mark + wordmark brand link and numbered nav 01-08
  - Native dialog mobile menu with subtitles (opens with JS off via Invoker Commands)
  - shell.ts (menu fallback, link-close, resize-close, IntersectionObserver scroll-spy)
  - Skip link as first Tab stop
  - tests/shell.spec.ts (11 tests incl. per-width header fit) and tests/axe.spec.ts (3 tests)
affects: [phase 2 status tags, phase 3 hero/sections/footer, phase 6 cross-browser QA]

tech-stack:
  added: []
  patterns:
    - "Nav, menu and section markup all generated from SECTIONS[] (single source)"
    - "Scroll-spy uses an active set over main section[data-section]; hero has no data-section so it clears the highlight"
    - "Dialog gets no display rule while closed; only dialog#menu[open] sets display"
    - "Header fit: numbers-only links 1024-1279 px (aria-label keeps the name), labelled from 1280 px"

key-files:
  created:
    - src/components/ui/SkipLink.astro
    - src/components/ui/Header.astro
    - src/components/ui/MobileMenu.astro
    - src/scripts/shell.ts
    - tests/shell.spec.ts
    - tests/axe.spec.ts
  modified:
    - src/pages/index.astro
    - src/layouts/Base.astro
    - src/styles/global.css
    - tests/build.test.mjs

key-decisions:
  - "Menu Close button reuses .menu-btn styling; the desktop hide rule targets [data-menu-open] only, so Close is never hidden"
  - "Hero and section headings sit inside .wrap so they share the page margins"

patterns-established:
  - "Astro compressHTML jsx: keep `{s.n}</span> {s.title}` on one line; build test regexes use [ ]* instead of backslash-s"

requirements-completed: [SHELL-01, SHELL-02, SHELL-03]

duration: 25min
completed: 2026-09-30
---

# Phase 1 Plan 03: Header, menu, skip link and section stubs Summary

**SECTIONS-driven sticky header with numbered nav and IntersectionObserver scroll-spy, a native-dialog mobile menu that works without JS, a skip link, and 8 anchored section stubs, all pinned by 14 build tests, 14 new Playwright specs and axe (zero violations).**

## Performance

- **Duration:** about 25 min
- **Tasks:** 3
- **Files created:** 6, modified: 4

## Accomplishments

- Structure: one h1 in `#top` (no `data-section`), 8 `section[data-section]` in SECTIONS order with h2 numbers 01-08.
- Header: sticky, `--header-h` 64px, brand link `AVOLITE home` holding mark (36px) and wordmark (14px), nav with 8 links. Real logo art paints in the header (pixel check for `#e8eef6` and `#bcac87` passes).
- Scroll-spy: `aria-current="true"` follows the section in the 40-45% viewport band, clears over the hero, last section `#why` reaches the band (70vh min-height).
- Mobile menu (under 1024px): native `<dialog>` opened by `command="show-modal" commandfor="menu"`; Tab never reaches page content, Escape closes and returns focus to Menu, link click closes and lands on the section, resize to 1280 closes it, opens with JS disabled.
- Budgets: CSS about 3.0 KB gzip total (file 1.9 KB + inline 1.1 KB) against 25 KB; shell script is inline in the HTML, 827 B raw / 467 B gzip (no separate .js file emitted); fonts unchanged at 109,256 B.
- Layout shift sum at most 0.01 at 390 and 1440 px with Archivo at the default `swap` (A3 default kept; no `display: 'optional'` fallback needed).

## Task Commits

1. **Task 1: hero stub, eight anchored sections, skip link, structure tests** - `1838c1f` (feat)
2. **Task 2: sticky header, numbered nav, dialog menu, scroll-spy, markup and budget tests** - `dd66765` (feat)
3. **Task 3: shell specs and axe specs** - `8e6a58b` (test)

**Plan metadata:** committed with this summary (docs).

## Phase Gate Results

- Full suite `npm run build && npm test && npm run test:e2e`: exit 0. `npm test` 34 passing, 0 failing; `npm run test:e2e` 23 passed (chromium: 4 logo, 1 smoke, 3 axe, 15 shell). `npm run check` 0 errors.
- Each required `-g` selector runs and passes: `skip link` (1), `scroll-spy` (2), `anchor` (1), `mobile menu` (1), `JS off` (1), `layout shift` (2).
- Clean-install gate `rm -rf node_modules dist .astro && npm ci && npm run build && test -f dist/index.html && npm test`: exit 0, 274 packages installed, build OK, 34 tests passing. This also confirms `logo.svg` is now committed (logo test no longer depends on an untracked file).
- Manual-only item: `test-results/header-1024.png` inspected; logo at left, numbers 01-08 at right, no overlap or wrapping. Throttled font-swap perception check not performed (measurable shift is covered by the test).

## Decisions Made

See frontmatter key-decisions. Everything else follows the plan and 01-RESEARCH.md.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Regex escapes mangled by my shell tooling in tests/build.test.mjs**
- **Found during:** Task 1 and Task 2 (build tests failed on valid markup)
- **Issue:** Backslash sequences written through the shell (`\s`, `\b`) were collapsed or turned into control characters, so `attr()` and the h2 matcher never matched.
- **Fix:** Rewrote those patterns without backslash-s (`[ ]`, explicit `RegExp` strings) and removed a stray backspace character; spec files were written with the Write tool.
- **Files modified:** `tests/build.test.mjs`
- **Commit:** `1838c1f`, `dd66765`

**2. [Minor] Menu Close button and `.menu-btn`**
- The plan hides `.menu-btn` at 1024px and up, but the dialog Close button shares that style; the hide rule was scoped to `[data-menu-open]` so Close keeps its styling wherever the dialog is open.
- **Commit:** `dd66765`

**3. [Minor] TDD commit shape**
- Task 2 tests were written and confirmed failing (7 failing) before the header existed, then committed together with the implementation (one commit per task), matching plans 01 and 02.

**Total deviations:** 1 auto-fixed bug (test authoring only), 2 minor. **Impact:** none on scope.

## TDD Gate Compliance

Task 2 (`tdd="true"`) ran RED (7 failing build tests before any header markup) then GREEN, committed as one `feat` commit; no separate `test(...)` commit exists for it.

## Issues Encountered

- Git prints LF/CRLF warnings for edited `.astro` files on Windows; `.gitattributes` normalizes them.
- `astro check` reports one pre-existing hint (0 errors, 0 warnings).

## Known Stubs

- `src/pages/index.astro`: hero is a one-line `<h1>AVOLITE</h1>` and the 8 sections contain only their numbered h2. Intentional; hero and section content arrive in Phase 3 (SHELL-04 and section requirements).

## Threat Flags

None. Surface matches T-03-01 to T-03-05: shell.ts uses only fixed selectors with `setAttribute`/`removeAttribute`, no `innerHTML`, `eval`, third-party script or network call; no packages were installed.

## Next Phase Readiness

Phase 1 is complete from a build and test standpoint (34 node tests, 23 Playwright tests, clean-install gate green). Phase 2 can consume the status tokens already in `tokens.css`; Phase 3 replaces the hero and section stubs and adds the footer (full lockup). Firefox and WebKit remain untested (Phase 6, assumption A7).

## Self-Check: PASSED

Files exist: SkipLink.astro, Header.astro, MobileMenu.astro, shell.ts, shell.spec.ts, axe.spec.ts. Commits `1838c1f`, `dd66765`, `8e6a58b` exist.
