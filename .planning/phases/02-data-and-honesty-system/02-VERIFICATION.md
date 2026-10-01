---
phase: 02-data-and-honesty-system
verified: 2026-10-01T07:00:00Z
status: passed
score: 5/5 roadmap success criteria verified (7/7 plan-01 truths, 7/7 plan-02 truths)
overrides_applied: 0
re_verification: false
gaps: []
human_verification: []
---

# Phase 2: Data and honesty system Verification Report

**Phase Goal:** Every number and status tag on the site can only come from one validated data path, and the building blocks to show them exist
**Verified:** 2026-10-01
**Status:** passed
**Re-verification:** No, initial verification

## Commands run (real, in E:/Avolite_web unless noted)

| Command | Result |
| --- | --- |
| `npm run check` | exit 0, 39 files, 0 errors / 0 warnings / 0 hints |
| `npm run build` | exit 0, 2 pages (`/`, `/preview/`), honesty lint and verifyRaw ran inside the build |
| `npm test` | exit 0, 90/90 pass (incl. 38 data+honesty fixture tests, preview dist tests, Phase 1 tests) |
| `npm run test:e2e` | exit 0, 32/32 pass (Phase 1 specs + 8 preview specs incl. `axe preview 1440` and `axe preview 390`) |
| Clean clone: `git clone` of local repo (HEAD f03ce79) into scratchpad, `npm ci && npm run build && npm test` | build exit 0, tests 90/90 pass, no CRLF/Windows hash problem; clone deleted |

## Observable Truths (ROADMAP success criteria)

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | CFAR CSV ingested to typed JSON with computed max/mean errors and detection count; hand-edited CSV, number without status, ILLUSTRATIVE repo data, or merged datasets fail the build; each rule has a failing fixture in `npm test` | VERIFIED | CSV sha256 `3cccc3c2...1d6b`, 380 bytes, only file in `data/raw`. `results.json` has no derived keys (`grep -ci "maxabs\|maxrange\|derived"` = 0); `derive()`/`metric()` in `src/lib/data.ts` compute 5/5, 0.5, 0.4, 0.165..., 0.0995.... Mutation proofs in a throwaway clone: CSV byte edit gives build exit 1 with "sha256 ... != pinned"; hand-edited `results.json` gives exit 1 "stale or hand-edited"; CSV edit plus regenerated `results.json` still exit 1 (pin catches it); `claims.json` illustrative set to SIMULATED gives exit 1 (zod `invalid_value`); hand-built literal and no-status literal passed to `Metric` give exit 1 ("not issued by data.ts" / "without status"). Fixture tests exist per rule: DATA-03 tiers, DATA-04 computed/tampered/typed keys, DATA-05 merge/array/scenario, DATA-06 identical rows + SNR, requireTagged per missing field, requireIssued origin check, CRLF still passes |
| 2 | Build fails when output has "Live", "real-time", AI/ML next to BUILT, or TODO/TBD/lorem outside a placeholder | VERIFIED | `scripts/honesty.mjs` wired in `astro:build:done` (`astro.config.mjs`). Mutation builds in throwaway clone, each exit 1: "Live", "real-time", TODO, TBD, lorem, `AI` next to BUILT tag, `ML` next to SIMULATED tag, `<data>` without `data-status`, "Live" only in a `title` attribute. Control: AI next to DESIGNED exits 0. Lint is stricter than the roadmap (TODO/TBD/lorem banned everywhere; documented orchestrator default) |
| 3 | Preview page shows all six status tags distinguishable by glyph and border without color, plus the legend | VERIFIED | `dist/preview/index.html` has 6 distinct `data-glyph` values (square, circle, half-circle, ring, dashed-ring, hatched-square); dashed border only PLANNED and ILLUSTRATIVE; labels always in DOM; legend `dl` with 6 definitions. Playwright "preview status tags" and "preview legend" pass (computed border-style, gradient hatch only on ILLUSTRATIVE) |
| 4 | Preview shows metric readout (ILLUSTRATIVE hatched, no count-up), MATLAB figure on light plate with caption/status/source, fixed-ratio placeholder naming its pending asset, result table that becomes cards under 768 px with "View as table" | VERIFIED | dist: 3 `data-countup`, all on SIMULATED `<data>`; ILLUSTRATIVE `-92 dBm` `<data>` has none. Figure on `--plate` white, no filter/blend/opacity (source guard test + Playwright), figcaption has SIMULATED tag and GitHub blob link at pinned commit. Two `[data-placeholder]` boxes (16/10, 2.23/1) with "pending from the team"; Playwright checks box height at 1440 and 390. ResultTable is one `table[role=table]` with caption, `scope=col`, `data-label` on every td; Playwright "preview table" checks cards at 390, no horizontal scroll at 390/768/1440, `View as table` details opens, summary >= 44 px. axe preview 1440 and 390: 0 violations |
| 5 | Raster images served as AVIF/WebP with explicit width and height | VERIFIED | `dist/_astro` holds 3 `.avif` + 4 `.webp`, 0 `.png`; the only `<img>` has `width="3262" height="1453" loading="lazy" decoding="async"`; `<source type="image/avif">` and `image/webp` present; no other raster in `public/` or `src/` outside `src/assets/repo` (10 PNGs, sha256 byte-identical to upstream commit 9b985ca) |

**Score:** 5/5

## Required Artifacts

| Artifact | Status | Details |
| --- | --- | --- |
| `scripts/ingest.mjs` (REPO, MANIFEST, ingest, verifyRaw) | VERIFIED | Pin literal test-guarded; wired to `astro:config:setup` |
| `scripts/honesty.mjs` (lintHtml, scanDist, lintOutput) | VERIFIED | Wired to `astro:build:done`; real dist scan clean |
| `src/lib/data.ts` | VERIFIED | zod strict schema, superRefine rules, `ISSUED` WeakSet; imported by Metric/ResultTable/preview and by the `astro:build:start` hook; erasable TS (no enum/namespace/.png/astro: imports) |
| `src/lib/status.ts` | VERIFIED | Six tiers, distinct glyphs |
| `src/data/results.json`, `data/claims.json` | VERIFIED | Generated deterministic; `definitions.snr: null`; one ILLUSTRATIVE entry |
| 8 UI components, `src/lib/figures.ts`, `src/pages/preview.astro` | VERIFIED | Substantive, wired, rendering real data in dist |
| `tests/data.test.mjs`, `honesty.test.mjs`, `preview.test.mjs`, `preview.spec.ts` | VERIFIED | All run and pass |

## Key Link Verification

| From | To | Status |
| --- | --- | --- |
| `astro.config.mjs` | `verifyRaw` (config:setup) | WIRED (stale-results mutation exits 1) |
| `astro.config.mjs` | `lintOutput` (build:done) | WIRED (wording mutations exit 1) |
| `astro.config.mjs` | `src/lib/data.ts` (build:start) | WIRED (claims.json mutation fails build) |
| `Metric.astro` / `ResultTable.astro` | `requireIssued` | WIRED (literal mutations exit 1) |
| `Figure.astro` | `Picture` avif+webp, `REPO.blob` | WIRED (dist output confirms) |
| `preview.astro` | `Base` noindex + `_headers` X-Robots-Tag | WIRED (meta robots in preview only, 0 in index; 2 header blocks) |

## Requirements Coverage

All 15 IDs from plan frontmatter (02-01: DATA-01..07; 02-02: UI-01..07, IMG-03, DATA-02) are present in REQUIREMENTS.md, marked `[x]` and "Complete" in the Phase 2 traceability rows. No orphaned Phase 2 requirement: REQUIREMENTS.md maps exactly DATA-01..07, UI-01..07, IMG-03 to Phase 2, all claimed by a plan.

| Requirement | Status | Evidence |
| --- | --- | --- |
| DATA-01 | SATISFIED | Pinned hash + verifyRaw; CSV and results edits fail build |
| DATA-02 | SATISFIED | requireTagged/requireIssued at render, `<data data-status>` dist lint; mutation builds exit 1 |
| DATA-03 | SATISFIED | zod enum SIMULATED/BUILT, literal ILLUSTRATIVE list; fixtures + mutation |
| DATA-04 | SATISFIED | derive() computed, strict schema rejects typed keys, error-equals-difference rule; source guard against typed 0.165/0.0995 |
| DATA-05 | SATISFIED | single `source` object, duplicate id/path rejected, scenario required, ResultTable shows scenario + source |
| DATA-06 | SATISFIED | identical rows need note, `assertChartable` throws, SNR path blocked while `definitions.snr` null (fixtures; the Monte Carlo and SNR CSVs are intentionally not ingested) |
| DATA-07 | SATISFIED | lint in build:done, mutation proofs |
| UI-01 | SATISFIED | six tags, glyph + border + color, optional provenance |
| UI-02 | SATISFIED (component) | StatusLegend built and shown on /preview/; mounting in section 01 and footer is Phase 3 scope per the plan |
| UI-03 | SATISFIED | SectionHeader renders "01 · THE PROBLEM" (dist test) |
| UI-04 | SATISFIED | tabular-nums, unit, tag; ILLUSTRATIVE hatched, no count-up |
| UI-05 | SATISFIED | white plate, unrecoloured, caption/status/source link |
| UI-06 | SATISFIED | allow-listed fixed ratio, names asset, StatusTag |
| UI-07 | SATISFIED | cards under 768 px, "View as table" TableDisclosure |
| IMG-03 | SATISFIED | AVIF/WebP, width and height, no PNG in dist |

## Anti-Patterns Found

None blocking. Grep of `src`, `scripts`, `astro.config.mjs`, `public` for TODO/TBD/FIXME/XXX, `set:html`, `innerHTML`, `target="_blank"` returned only a binary PNG false positive. `package.json` dependency blocks unchanged (only the `data:ingest` script added). `git status` shows only the untracked items the caller listed; no source modified by this verification (all mutation tests ran in a throwaway clone, since deleted).

## Informational notes (not gaps)

- The wording lint cannot detect a bare number typed as plain text outside `<data>` (inherent ceiling; the plan documents it and Phase 3 claim-scoped checks address it). The AI/ML rule is block-scoped (documented `ponytail:` ceiling).
- `ResultTable` card/table breakpoint is `max-width: 767.98px` (768 px is a normal table); the plan was self-inconsistent here and the SUMMARY records the choice. Not a goal issue.
- 02-VALIDATION.md still has `status: draft`, `wave_0_complete: false`, "Approval: pending"; the underlying work is done and all Wave 0 test files exist. Housekeeping only.
- `scripts/` and `astro.config.mjs` were modified beyond the plan file list (`pruneUnusedPng`, lazy glob in `figures.ts`); deviation recorded in 02-02-SUMMARY and it is what makes IMG-03 hold.

## Human Verification Required

None. Every success criterion has automated proof (tests, mutation builds, Playwright + axe). Aesthetic judgement of the tags is out of scope for the phase contract.

## Gaps Summary

No gaps. The phase goal is achieved: one validated data path (pinned CSV, regenerated JSON, zod rules, issued-only tagged numbers) and two build-failing gates exist and fail when violated, and the eight building blocks plus `/preview/` render real data with passing axe/Playwright checks.

---

_Verified: 2026-10-01_
_Verifier: Claude (gsd-verifier)_
