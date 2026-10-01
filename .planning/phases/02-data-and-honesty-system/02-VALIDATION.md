---
phase: 2
slug: data-and-honesty-system
status: approved
nyquist_compliant: true
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

Task IDs: `{phase}-{plan}-{task}`.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | DATA-01, DATA-05 | T-2-01, T-2-02, T-2-04 | Hand-edited CSV fails the LF-normalised pinned hash; stale results.json fails verifyRaw | unit | `node --test tests/data.test.mjs` | ❌ W0 (created in task) | ⬜ pending |
| 02-01-02 | 01 | 1 | DATA-02, DATA-03, DATA-04, DATA-05, DATA-06 | T-2-03 | Tier rules, computed derived values, identical-row and SNR rules, requireTagged shape check, requireIssued origin check | unit | `node --test tests/data.test.mjs tests/honesty.test.mjs` | ❌ W0 (created in task) | ⬜ pending |
| 02-01-03 | 01 | 1 | DATA-07, DATA-02 (dist layer) | T-2-03, T-2-05 | Build fails on banned wording, untagged `<data>`, AI/ML beside BUILT/SIMULATED | unit + dist | `node --test tests/data.test.mjs tests/honesty.test.mjs && npm run build && npm test && npm run check` | ❌ W0 (created in task) | ⬜ pending |
| 02-02-01 | 02 | 2 | UI-01, UI-02, UI-03, UI-06 | T-2-06, T-2-07, T-2-10 | Six tags, legend, header, fixed-ratio placeholder; noindex; no set:html | dist | `npm run build && node --test tests/preview.test.mjs tests/tokens.test.mjs tests/build.test.mjs` | ❌ W0 (created in task) | ⬜ pending |
| 02-02-02 | 02 | 2 | UI-04, UI-05, UI-07, IMG-03, DATA-02 | T-2-06, T-2-08, T-2-09, T-2-11 | Tagged numbers only, unrecoloured plate, AVIF/WebP with width and height | dist | `npm run build && node --test tests/preview.test.mjs tests/tokens.test.mjs tests/build.test.mjs && npm run check` | ❌ W0 (created in task) | ⬜ pending |
| 02-02-03 | 02 | 2 | UI-01, UI-04 to UI-07, all UI (axe), Phase 1 guard | T-2-09 | Browser-level proof at 1440/768/390, axe clean, full regression | e2e + regression | `npx playwright test tests/preview.spec.ts` then `npm run build && npm test && npm run check && npm run test:e2e` | ❌ W0 (created in task) | ⬜ pending |

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
| Build fails on a stale results.json via the Astro integration hook | DATA-01 | Spawning `astro build` in a test is slow; covered by `verifyRaw` unit test and research spike. Executor performs it once in 02-01-03 and records it in the SUMMARY | Temporarily edit `src/data/results.json`, run `npm run build`, expect exit 1, then run `node scripts/ingest.mjs` to restore |
| Rendering a number without a status fails the build | DATA-02 | Needs a throwaway component edit; covered by `requireTagged`/`requireIssued` unit tests, the dist `<data>` lint and a source guard that Metric/ResultTable call `requireIssued(`. Executor performs it once in 02-02-02 and records it in the SUMMARY | Temporarily pass (a) an object without `status` and (b) a complete hand-built literal to `Metric` in preview.astro, run `npm run build`, expect exit 1 both times, then revert |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies (test files are created inside the tasks that own them, tests first for the TDD tasks)
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [ ] Feedback latency < 90s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-10-01 (phase verified)
