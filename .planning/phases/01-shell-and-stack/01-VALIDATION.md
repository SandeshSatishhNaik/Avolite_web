---
phase: 1
slug: shell-and-stack
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-09-30
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Source: `01-RESEARCH.md` → Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `node --test` (build-output and lint checks) + Playwright 1.63 Chromium (interaction, axe) + `astro check` |
| **Config file** | `playwright.config.ts` (none yet — Wave 0 installs; webServer `npm run build && npm run preview -- --port 4321`) |
| **Quick run command** | `npm run check && npm test` |
| **Full suite command** | `npm run build && npm test && npm run test:e2e` |
| **Estimated runtime** | ~60 seconds (full), ~10 seconds (quick) |

---

## Sampling Rate

- **After every task commit:** Run `npm run check && npm test` (run `npm run build` first in any task that changes build output)
- **After every plan wave:** Run `npm run build && npm test && npm run test:e2e`
- **Before `/gsd:verify-work`:** Full suite green plus clean-clone `npm ci && npm run build`
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

Task IDs are filled by the planner; each row maps a requirement/success criterion to its automated check.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | 01 | 1 | FND-01 / SC1 | T-1-supply | Lockfile committed, exact astro pin, `npm ci` | smoke | `rm -rf node_modules dist && npm ci && npm run build && test -f dist/index.html` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | FND-01 | — | N/A | unit | `node --test tests/build.test.mjs` (`.node-version`=24, TS ^6, astro exact) | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | FND-01 | — | N/A | static | `npm run check` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | FND-03 / SC5 | T-1-fontcdn | No googleapis/gstatic in `dist` | unit | `node --test tests/build.test.mjs` (3 families, size-adjust fallbacks, 2 preloads, woff2 total ≤ 130,000 B) | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | FND-02 / SC5 | — | N/A | lint | `node --test tests/tokens.test.mjs` (no hex/rgb/hsl/raw font-family outside `tokens.css`) | ❌ W0 | ⬜ pending |
| TBD | 02 | 1–2 | FND-05 | — | N/A | unit + e2e | `node --test tests/logo.test.mjs` ; `npx playwright test -g "logo"` | ❌ W0 | ⬜ pending |
| TBD | 03 | 2 | SC1 | — | N/A | unit | `node --test tests/build.test.mjs` (8 `<section id>` in order, h2 numbered 01–08) | ❌ W0 | ⬜ pending |
| TBD | 03 | 2 | SHELL-01 / SC2 | — | N/A | e2e | `npx playwright test -g "scroll-spy"` ; `npx playwright test -g "anchor"` | ❌ W0 | ⬜ pending |
| TBD | 03 | 2 | SHELL-02 / SC3 | — | N/A | e2e | `npx playwright test -g "mobile menu"` ; `npx playwright test -g "JS off"` | ❌ W0 | ⬜ pending |
| TBD | 03 | 2 | SHELL-03 / SC4 | — | N/A | e2e | `npx playwright test -g "skip link"` | ❌ W0 | ⬜ pending |
| TBD | 03 | 2 | SC5 | — | N/A | e2e | `npx playwright test -g "layout shift"` | ❌ W0 | ⬜ pending |
| TBD | 03 | 2 | All | — | N/A | e2e | `npx playwright test axe` (wcag2a/2aa/22aa, 0 violations at 1440 and 390) | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json`, lockfile, `astro.config.mjs`, `tsconfig.json`
- [ ] `playwright.config.ts` with webServer; `npx playwright install chromium`
- [ ] `tests/build.test.mjs`, `tests/tokens.test.mjs`, `tests/logo.test.mjs`, `tests/shell.spec.ts`, `tests/axe.spec.ts`
- [ ] Framework install: `npm install -D @playwright/test @axe-core/playwright @astrojs/check typescript@^6`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Header fits at 1024 px with logo + 8 labelled links | SHELL-01 | Visual fit judgement (A4) | Screenshot at 1024×768; if links wrap, fall back to numbers-only between 1024–1279 px |
| Perceived font-swap reflow on headings | FND-03 | Perception; CLS test covers measurable shift (A3) | Throttled "Slow 4G" reload; note any visible heading reflow |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
