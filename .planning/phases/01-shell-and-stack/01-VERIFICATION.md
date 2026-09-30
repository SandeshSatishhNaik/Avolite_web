---
phase: 01-shell-and-stack
verified: 2026-10-01T05:00:00Z
status: passed
score: 5/5 roadmap success criteria verified (plus all plan must-haves)
overrides_applied: 0
---

# Phase 1: Shell and Stack Verification Report

**Phase Goal:** A visitor can load a fast static page with the AVOLITE brand, a working numbered navigation and all 8 section anchors
**Verified:** 2026-10-01
**Status:** passed
**Re-verification:** No, initial verification

## Commands run by the verifier (own process, not SUMMARY claims)

| Command | Result |
| ------- | ------ |
| `npm run check` | 0 errors, 0 warnings, 0 hints (21 files) |
| `npm run build` | exit 0, 1 page built, 3 font files copied |
| `npm test` | 34 tests, 34 pass, 0 fail |
| `npm run test:e2e` | 23 passed (Chromium): 3 logo + 1 sprite, 1 smoke, 3 axe, 15 shell |
| Fresh `git clone` into scratch dir, then `npm ci && npm run build && test -f dist/index.html && npm test` | exit 0, `dist/index.html` present, 34 pass (scratch clone deleted afterwards) |

## Goal Achievement: roadmap success criteria

| # | Truth | Status | Evidence |
| - | ----- | ------ | -------- |
| 1 | Clean clone runs `npm ci && npm run build`, produces `dist/`, preview serves 8 anchored sections 01-08 | VERIFIED | Clean-clone run above passes. Playwright webServer runs `npm run build && npm run preview` and all specs pass against it. `index.astro` renders `SECTIONS.map` into 8 `section[data-section]` (ids problem, how, built, new, demo, security, roadmap, why) plus hero `#top`. `tests/build.test.mjs` asserts order, numbered h2s 01-08 and a single h1 (pass). |
| 2 | Cleaned reversed logo in sticky header with links 01-08; click jumps; in-view link highlighted | VERIFIED | `Header.astro`: brand link (`aria-label="AVOLITE home"`, mark + wordmark via `Logo`), `nav[aria-label=Sections]` with 8 links from `SECTIONS`. `.site-header` is `position: sticky` (spec "sticky header stays at the top" passes). `shell.ts` IntersectionObserver (`-40% 0px -55% 0px`, `main section[data-section]`) sets `aria-current="true"`; specs "scroll-spy ..." and "anchor clicks land below the sticky header" pass (link active after click, cleared over hero, `#why` active at bottom, sections land at y >= 62 below the 64px header). Logo art: "header logo" spec confirms real pixels `#e8eef6` and `#bcac87` paint in the header; `tests/logo.test.mjs` confirms generated JSON equals a fresh `scripts/clean-logo.mjs` run (background path dropped, O counter kept). |
| 3 | Phone-width mobile menu lists 8 sections with subtitles, focus stays inside, Escape closes | VERIFIED | `MobileMenu.astro`: `<dialog id="menu">` with 8 links each carrying `<small>{subtitle}</small>` from `SECTIONS`; opened by `command="show-modal" commandfor="menu"` (works with JS off; fallback in `shell.ts`). Spec "mobile menu opens, contains focus, closes and navigates" (14 Tabs never reach page content, Escape closes and focus returns to Menu button, link click closes and lands, resize to 1280 closes) and "JS off: menu still opens and Escape closes it" pass. axe at 390 with menu open: 0 violations. |
| 4 | First Tab reveals skip link that moves focus to main | VERIFIED | `SkipLink.astro` (`a.skip href="#main"`) is first element in `<body>`; `<main id="main" tabindex="-1">`. Spec "skip link is the first Tab stop and moves focus to main" passes (in viewport, Enter focuses `#main`). |
| 5 | Self-hosted Archivo / IBM Plex, no visible swap shift, all colors/spacing/type from one tokens file | VERIFIED | `dist/_astro/fonts` has 3 woff2 files, 109,256 B total (limit 130,000); exactly 2 font preloads; 0 `googleapis`/`gstatic` hits in `dist/index.html` (build test scans all of `dist`); `@font-face` with `size-adjust` fallbacks asserted by build test. Layout shift spec: sum <= 0.01 at 390 and 1440 (pass). Token lint test (`tests/tokens.test.mjs`) passes: no hex / rgb / hsl / raw `font-family` outside `src/styles/tokens.css` (only `theme-color` meta exempt); lint has a self-check fixture. |

**Score:** 5/5

## Plan must-haves (spot confirmation)

| Truth | Status | Evidence |
| ----- | ------ | -------- |
| astro pinned exactly 7.3.5, TS ^6, `.node-version` = 24 | VERIFIED | `package.json`: `"astro": "7.3.5"`, `"typescript": "^6.0.3"`; `.node-version` = `24`; `tests/config.test.mjs` passes |
| Static output, Fonts API three families, Cloudflare `_headers` | VERIFIED | `public/_headers` tracked; build test asserts `immutable`; fonts config verified through build output |
| Logo sprite emitted once, favicon generated | VERIFIED | `tests/logo.test.mjs` dist group passes; `public/favicon.svg` tracked and linked in `<head>` |
| Budgets: CSS <= 25 KB gz, JS <= 70 KB gz | VERIFIED | Build test budgets pass; shell script is inlined (SUMMARY: ~0.5 KB gzip), CSS ~3 KB gzip |
| axe 0 violations (wcag2a/aa/21a/21aa/22aa) at 1440, 390, 390 menu open | VERIFIED | 3 axe specs pass |
| Header fits at 1024 / 1100 / 1279 / 1280 without overflow | VERIFIED | 4 "header fit" specs pass |

## Required artifacts and key links

| Artifact / link | Status | Details |
| --------------- | ------ | ------- |
| `package.json`, `package-lock.json`, `.node-version`, `.gitattributes`, `public/_headers`, `astro.config.mjs`, `playwright.config.ts` | VERIFIED | Present, tracked in git (lockfile and `logo.svg` committed, so a clean clone works, confirmed) |
| `src/styles/tokens.css`, `global.css`, `logo.css`, `src/lib/site.ts` | VERIFIED | Substantive; consumed by Base layout, Header, pages |
| `Header.astro`, `MobileMenu.astro`, `SkipLink.astro`, `Logo.astro`, `LogoSprite.astro`, `src/scripts/shell.ts` | VERIFIED | Real implementations (no stubs); all wired through `Base.astro` |
| Header/MobileMenu/index.astro -> `SECTIONS` | WIRED | `SECTIONS.map` in all three |
| `Base.astro` -> `shell.ts` | WIRED | `<script src="../scripts/shell.ts">`, hoisted and inlined in build |
| Header button -> `dialog#menu` | WIRED | `command="show-modal" commandfor="menu"` |
| `Base.astro` -> Fonts API | WIRED | `<Font cssVariable=... preload />` x2 preload, mono without |

Data-flow (Level 4): static content generated at build from `SECTIONS`; no dynamic data sources in this phase. Not applicable beyond the wiring above.

## Requirements Coverage

| Requirement | Source Plan | Status | Evidence |
| ----------- | ----------- | ------ | -------- |
| FND-01 | 01-01 | SATISFIED | Static Astro 7 + TS + CSS vars; `npm run build` produces `dist/`; `.node-version` 24; clean-clone build passes |
| FND-02 | 01-01 | SATISFIED | `tokens.css` single source; lint test enforces no literals elsewhere |
| FND-03 | 01-01 | SATISFIED | 3 families self-hosted, 109,256 B <= 130 KB, size-adjust fallbacks, no CDN refs |
| FND-05 | 01-02 | SATISFIED | `clean-logo.mjs` output reproducible; one `Logo` component; reversed tone verified by computed-style and pixel checks |
| SHELL-01 | 01-03 | SATISFIED | Sticky header, logo, links 01-08, `aria-current` spy (specs pass) |
| SHELL-02 | 01-03 | SATISFIED | Native dialog menu, 8 subtitled links, focus contained, Escape closes (spec passes) |
| SHELL-03 | 01-03 | SATISFIED | Skip link first Tab stop, focuses `#main` (spec passes) |

Every ID declared in plan frontmatter (01-01: FND-01/02/03; 01-02: FND-05; 01-03: SHELL-01/02/03) exists in REQUIREMENTS.md and is marked complete there. Orphan check: REQUIREMENTS.md traceability maps exactly FND-01, FND-02, FND-03, FND-05, SHELL-01, SHELL-02, SHELL-03 to Phase 1; none unclaimed. (FND-04 is Phase 3, SHELL-04/05 Phase 3.)

## Anti-Patterns

| Check | Result |
| ----- | ------ |
| `TODO/FIXME/TBD/XXX` in `src`, `tests`, `scripts`, config, `public` | None found |
| Stubs | Hero is intentionally a one-line h1 and sections hold only numbered h2; this is the phase goal ("8 empty, anchored sections") and Phase 3 (SHELL-04 etc.) owns content. Not a gap. |
| Tracked files modified / untracked files touched | `git status` shows only the four pre-existing untracked items (`.claude/`, `AVOLITE_*`, `CLAUDE.md`); verifier changed no source files |

## Deferred Items

None needed. Hero content, footer and section bodies are explicitly Phase 3 (SHELL-04, SHELL-05, FND-04).

## Notes (non-blocking, automation covers them)

1. Perceived font-swap reflow on slow networks was not eyeballed (VALIDATION manual item). The measurable proxy (layout shift <= 0.01 at 390 and 1440) passes, so this is not treated as a human gate. Archivo stays on `swap`; revisit in Phase 6 if Lighthouse or a throttled reload shows a visible reflow.
2. `test-results/header-1024.png` visual fit: automated overflow and box-size assertions pass at 1024/1100/1279/1280; SUMMARY reports the screenshot was inspected.
3. Only Chromium is tested (Firefox and WebKit deferred to Phase 6 / QA-04). Native `<dialog>` focus is not a hard trap: Tab may move to browser chrome, but never to page content (spec asserts this).
4. `npm ci` prints an npm warning about esbuild postinstall (`install-scripts`); harmless today, matches accepted threat T-01-03.
5. Site goes live 2026-10-02; phase 1 shell has no blockers for that, but the page is still a shell until Phase 3 content lands. Deployment itself is governed by the QA-06 rule (only when the user asks).

## Gaps Summary

No gaps. All five roadmap success criteria, all plan truths and all seven requirement IDs are verified against the codebase with commands run by the verifier.

---

_Verified: 2026-10-01_
_Verifier: Claude (gsd-verifier)_
