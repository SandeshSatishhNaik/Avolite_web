---
phase: 2
slug: data-and-honesty-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-10-01
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Source: `02-RESEARCH.md` → Validation Architecture (full requirement → test map lives there).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node:test (Node 24) + Playwright 1.63 + @axe-core/playwright 4.13 + `astro check` |
| **Config file** | `package.json` scripts; `playwright.config.ts` (existing) |
| **Quick run command** | `node --test tests/data.test.mjs tests/honesty.test.mjs` |
| **Full suite command** | `npm run build && npm test && npm run check && npm run test:e2e` |
| **Estimated runtime** | ~15 s quick, ~90 s full |

---

## Sampling Rate

- **After every task commit:** plan 02-01 → `node --test tests/data.test.mjs tests/honesty.test.mjs`; plan 02-02 → `npm run build && node --test tests/preview.test.mjs`
- **After every plan wave:** `npm run build && npm test && npm run check`
- **Before `/gsd:verify-work`:** full suite green including `npm run test:e2e`, plus clean-clone `rm -rf node_modules dist .astro && npm ci && npm run build && npm test`
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

Task IDs are filled by the planner.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | 01 | 1 | DATA-01 | T-2-tamper | Hand-edited CSV fails LF-normalised pinned hash | unit | `node --test tests/data.test.mjs` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | DATA-02, DATA-07 | — | N/A | unit + dist | `node --test tests/honesty.test.mjs` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | DATA-03, DATA-04, DATA-05, DATA-06 | — | N/A | unit | `node --test tests/data.test.mjs` | ❌ W0 | ⬜ pending |
| TBD | 02 | 2 | UI-01, UI-04, UI-05, UI-06, UI-07 | — | N/A | e2e | `npx playwright test tests/preview.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | 02 | 2 | UI-02, UI-03, IMG-03 | — | N/A | dist | `node --test tests/preview.test.mjs` | ❌ W0 | ⬜ pending |
| TBD | 02 | 2 | All UI | — | N/A | e2e | `npx playwright test -g "axe preview"` | ❌ W0 | ⬜ pending |
| TBD | 02 | 2 | Phase 1 guard | — | N/A | regression | full suite | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/data.test.mjs` — fixtures for DATA-01, 03, 04, 05, 06
- [ ] `tests/honesty.test.mjs` — `lintHtml` fixtures (DATA-02, DATA-07) + real-dist scan
- [ ] `tests/preview.test.mjs` — dist assertions for `/preview/index.html` (IMG-03, UI-02, UI-03, noindex)
- [ ] `tests/preview.spec.ts` — Playwright UI-01, UI-04..07 + axe
- No framework install needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Build fails on a stale results.json via the Astro integration hook | DATA-01 | Spawning `astro build` in a test is slow; covered by `verifyRaw` unit test and research spike | Temporarily edit `src/data/results.json`, run `npm run build`, expect exit 1 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
