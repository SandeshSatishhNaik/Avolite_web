---
phase: 02-data-and-honesty-system
plan: 01
subsystem: data
tags: [zod, astro-integration, sha256-pin, csv-ingest, honesty-lint]
requires:
  - phase: 01-foundation
    provides: Astro shell, node test harness, tokens.css status tokens
provides:
  - Pinned-hash CSV ingest to src/data/results.json (dataset cfar-a, SIMULATED)
  - src/lib/data.ts (zod honesty rules, derive, metric, illustrative, cell, requireTagged, requireIssued, fmt, columnLabel)
  - src/lib/status.ts six-tier STATUS vocabulary
  - scripts/honesty.mjs dist wording lint, wired into astro build
affects: [02-02 UI primitives, 03 all sections]
tech-stack:
  added: []
  patterns:
    - upstream sha256 pin on LF-normalised bytes plus re-ingest equality (verifyRaw)
    - WeakSet origin registry so only data.ts can issue renderable numbers
    - inline Astro integration hooks throw to fail the build
key-files:
  created:
    - scripts/ingest.mjs
    - scripts/honesty.mjs
    - src/lib/data.ts
    - src/lib/status.ts
    - src/data/results.json
    - data/claims.json
    - data/raw/04_MATLAB/DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv
    - tests/data.test.mjs
    - tests/honesty.test.mjs
  modified:
    - src/lib/site.ts
    - astro.config.mjs
    - package.json
key-decisions:
  - "Only the CFAR five-target CSV is copied; other CSVs proven by fixtures (orchestrator default)"
  - "Illustrative provenance text carries no internal doc section; the section lives in a never-rendered note field"
  - "SNR-sweep rule matches /\\/SNR_Sweep\\//i on source.path"
requirements-completed: [DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06, DATA-07]
duration: 25min
completed: 2026-10-01
---

# Phase 2 Plan 01: Data and honesty gates Summary

**Pinned-hash CSV ingest, zod honesty rules with computed derived values, origin-checked tagged numbers, and a dist wording lint that fails `astro build`.**

## Performance

- **Duration:** ~25 min
- **Tasks:** 3 (all TDD, RED confirmed before each implementation)
- **Files:** 12 created or modified

## Accomplishments

- CFAR CSV (380 bytes, sha256 `3cccc3c2...1d6b`, upstream commit `9b985ca`) ingested to `results.json`; one changed byte throws `/pinned/`, a CRLF copy still passes, and a stale or hand-edited results file fails `verifyRaw`.
- `data.ts` validates at module load: repo data SIMULATED/BUILT only, ILLUSTRATIVE-only list, no merging (duplicate id/path, source array), strict schema (no typed derived keys), error = detected - expected, identical rows need a note and cannot be charted, SNR sweep blocked while `definitions.snr` is null.
- `derive('cfar-a')` = 5/5 detected, max/mean range error 0.5/0.4 m, max/mean velocity error 0.1654/0.0996 m/s, all computed.
- `requireTagged` (shape) and `requireIssued` (WeakSet origin) reject untagged numbers and hand-built or spread-copied literals.
- `honesty.mjs` lint runs in `astro:build:done`; `verifyRaw` runs in `astro:config:setup`; `data.ts` is imported in `astro:build:start`.

## Task Commits

1. Task 1: status vocabulary, pinned CSV, ingest, results.json - `fcd7351`
2. Task 2: data.ts schema, rules, getters, requireTagged/requireIssued - `1d7a2c4`
3. Task 3: honesty lint and Astro integration - `1effa9d`

## Manual proof: stale results.json fails the build

1. Changed `"DetectedRange_m": 25.5` to `25.6` in `src/data/results.json`; `npm run build` exited **1** with `src/data/results.json is stale or hand-edited: run npm run data:ingest`.
2. Restored with `node scripts/ingest.mjs` (git diff empty afterwards); `npm run build` exited **0**.
3. Extra proof that the `astro:build:start` data.ts import works from the config process: set the `claims.json` illustrative status to `SIMULATED`; `npm run build` exited **1** with a zod `invalid_value` error naming `ILLUSTRATIVE`. File restored, build exited 0.

## Verification

- `node --test tests/data.test.mjs tests/honesty.test.mjs`: 38 tests (20 data, 18 honesty) pass.
- `npm test`: 70/70 pass (Phase 1 tests untouched); `npm run check`: 0 errors, 0 warnings, 0 hints; `npm run build` exits 0; `dist` scan returns no hits.
- `package.json` dependencies unchanged (only the `data:ingest` script added).

## Deviations from Plan

None. The optional fallback (dropping the `astro:build:start` hook) was not needed: Node imports `src/lib/data.ts` from the config process.

## Known Stubs

None.

## Threat Flags

None beyond the plan's threat model.

## Self-Check: PASSED

Files verified present; commits `fcd7351`, `1d7a2c4`, `1effa9d` exist in git log.
