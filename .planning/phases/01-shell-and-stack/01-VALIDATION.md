---
phase: 1
slug: shell-and-stack
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-09-30
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Source: `01-RESEARCH.md` → Validation Architecture. Task IDs filled by the planner.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `node --test` (build-output and lint checks) + Playwright 1.63 Chromium (interaction, axe) + `astro check` |
| **Config file** | `playwright.config.ts` (created in plan 01 task 1; webServer `npm run build && npm run preview -- --port $E2E_PORT`, default 4321, `reuseExistingServer: false`; `E2E_PORT` is an optional override only; plans run sequentially in one working tree) |
| **Quick run command** | `npm run check && npm test` |
| **Full suite command** | `npm run build && npm test && npm run test:e2e` |
| **Estimated runtime** | ~60 seconds (full), ~10 seconds (quick) |

---

## Sampling Rate

- **After every task commit:** Run `npm run check && npm test` (run `npm run build` first in any task that changes build output)
- **After every plan wave:** Run `npm run build && npm test && npm run test:e2e`
- **Before `/gsd:verify-work`:** Full suite green plus clean-install `rm -rf node_modules dist .astro && npm ci && npm run build && test -f dist/index.html`
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-T1 | 01 | 1 | FND-01 / SC1 | T-01-01, T-01-SC | Lockfile committed, exact astro pin, TS ^6, `.node-version` 24 | unit | `npm ls astro typescript --depth=0 && node --test tests/config.test.mjs` | ❌ W0 | ⬜ pending |
| 01-01-T2 | 01 | 1 | FND-02 / SC5 | — | No hex/rgb/hsl/raw font-family outside `tokens.css` | lint | `node --test tests/tokens.test.mjs` | ❌ W0 | ⬜ pending |
| 01-01-T3 | 01 | 1 | FND-01, FND-03 / SC1, SC5 | T-01-02, T-01-05 | No googleapis/gstatic in `dist`; 3 families, size-adjust fallbacks, 2 preloads, woff2 total ≤ 130,000 B | static + unit + e2e | `npm run check && npm run build && npm test && npm run test:e2e` | ❌ W0 | ⬜ pending |
| 01-01-gate | 01 | 1 | FND-01 / SC1 | T-01-01 | Clean install builds | smoke | `rm -rf node_modules dist .astro && npm ci && npm run build && test -f dist/index.html && npm test` | ❌ W0 | ⬜ pending |
| 01-02-T1 | 02 | 2 | FND-05 | T-02-01 | Generated logo equals a fresh script run; O counter kept | unit | `node --test tests/logo.test.mjs` | ❌ W0 | ⬜ pending |
| 01-02-T2 | 02 | 2 | FND-05 | T-02-02 | Sprite emitted once; reversed/color tokens resolve; art paints (pixel check) | unit + e2e | `npm run check && npm run build && npm test && npx playwright test -g "logo"` | ❌ W0 | ⬜ pending |
| 01-03-T1 | 03 | 3 | SC1, SHELL-03 | — | 8 `<section data-section>` in order, h2 numbered 01-08, skip link first | unit | `npm run check && npm run build && npm test` | ❌ W0 | ⬜ pending |
| 01-03-T2 | 03 | 3 | SHELL-01, SHELL-02 | T-03-01, T-03-03, T-03-04 | Nav/dialog markup from SECTIONS; JS ≤ 70 KB, CSS ≤ 25 KB gzip | unit | `npm run check && npm run build && npm test` | ❌ W0 | ⬜ pending |
| 01-03-T3 | 03 | 3 | SHELL-01/02/03, SC2-SC5 | T-03-03 | scroll-spy, anchor, mobile menu, JS off, skip link, layout shift, header fit, axe | e2e | `npm run check && npm run build && npm test && npm run test:e2e` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

Sampling continuity: every task has an automated command; no two consecutive tasks lack one.

---

## Wave 0 Requirements

Created inside plan 01 (wave 1), before any dependent task:

- [ ] `.gitattributes` (`* text=auto eol=lf`, plan 01 task 1)
- [ ] `package.json`, lockfile, `astro.config.mjs`, `tsconfig.json` (plan 01 task 1)
- [ ] `playwright.config.ts` with webServer; `npx playwright install chromium` (plan 01 task 1)
- [ ] `tests/config.test.mjs` (task 1), `tests/tokens.test.mjs` (task 2), `tests/build.test.mjs` and `tests/smoke.spec.ts` (task 3)
- [ ] `tests/logo.test.mjs`, `tests/logo.spec.ts` (plan 02); `tests/shell.spec.ts`, `tests/axe.spec.ts` (plan 03, wave 3)
- [ ] Framework install: `npm install -D @playwright/test @axe-core/playwright @astrojs/check typescript@^6` (plan 01 task 1)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Header fits at 1024 px with logo + 8 labelled links | SHELL-01 | Visual fit judgement (A4); the automated header-fit test gates overflow, the screenshot is for the eye | Open `test-results/header-1024.png`; numbers-only labels between 1024–1279 px are applied up front (plan 03 task 2 step 7) |
| Perceived font-swap reflow on headings | FND-03 | Perception; the layout shift test covers measurable shift (A3) | Throttled "Slow 4G" reload; note any visible heading reflow |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending plan check
