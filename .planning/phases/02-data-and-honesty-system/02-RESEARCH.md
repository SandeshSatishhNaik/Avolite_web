# Phase 2: Data and honesty system - Research

**Researched:** 2026-10-01
**Domain:** Build-time data validation (CSV → typed JSON + zod), output-wording lint, Astro 7 UI primitives, `astro:assets` image pipeline
**Confidence:** HIGH. The key mechanics were checked by running them in a scratch Astro 7.3.5 project that links to this repo's `node_modules`. The upstream CSV hashes were checked against the pinned GitHub commit.

## Summary

Phase 2 adds one choke point that every number must pass through, plus the primitives that display numbers. Everything it needs is already installed: Astro 7.3.5 ships zod 4.6.5 (`astro/zod` re-exports `zod/v4`) and sharp 0.35.5. The lockfile already lists the Linux sharp binaries for Cloudflare. **No new packages.**

Seven findings shape the plan. Each was verified in this session.
1. **Imports.** `import { z } from 'astro/zod'` and `import raw from '../data/results.json' with { type: 'json' }` work in three places: `astro build`, `astro check` (0 errors), and plain `node --test` (Node 24.21 type-stripping). So the same `src/lib/data.ts` can hold the rules and also be imported by the tests.
2. **Build failure.** A zod `parse` that throws in component frontmatter fails `astro build` with exit 1. So does an error thrown inside an inline integration hook (`astro:build:start` / `astro:build:done`). That gives both honesty gates a clean home in `astro.config.mjs`, with no npm pre/post scripts.
3. **Images.** `<Picture src={png} formats={['avif','webp']} fallbackFormat="webp" widths=[…]>` emits AVIF and WebP sources, a WebP `<img>` with the intrinsic `width`/`height`, `loading="lazy"` and `decoding="async"`, and **no PNG in `dist/`**. That covers IMG-03.
4. **Line endings will break a hash-pinned CSV unless you plan for them.** Upstream stores the CSVs with LF: the git index shows `i/lf`, and the sha256 of the LF bytes matches raw.githubusercontent at commit `9b985ca…`. A Windows clone with `core.autocrlf=true` checks them out as CRLF, and this repo's `.gitattributes` has `* text=auto eol=lf`. Two rules follow: hash the LF-normalised bytes, and pin the expected hash to the upstream value in the ingest manifest.
5. **The pin is what makes "hand-edited CSV fails" real.** A hash that is only recorded at ingest can be refreshed by re-running ingest. A pin cannot.
6. **Scenario and plot shapes.** All usable PNGs are scenario A (targets at 25/50/75/110/145 m), about 3200×1460 px, which is a **~2.23:1 ratio, not the 4:3 DESIGN.md guessed**.
7. **Existing constraints to respect.** Phase 1 tests fix the `index.html` h2 markup and cap page JS. The preview page must be a separate route, and `SectionHeader` must not replace the index h2s until Phase 3.

**Primary recommendation:** Build in 2 sequential plans.
- **02-01 (TDD):** raw CSV, `scripts/ingest.mjs` with pinned hashes, `results.json`, `status.ts`, `data.ts` (zod rules, derived values, getters), `data/claims.json` holding `illustrative[]`, `scripts/honesty.mjs` (verify and output lint) wired as an inline Astro integration, plus node fixture tests.
- **02-02:** the UI primitives, PNG intake with `figures.ts`, a `/preview/` noindex page, build assertions, Playwright and axe specs.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| CSV → JSON ingest, hash pinning | Build-time Node script (`scripts/ingest.mjs`) | Git (committed raw + generated JSON) | Runs once, when the team exports new data. The browser never sees CSV or JSON. |
| Raw-file verification, output-wording lint | Astro integration hooks (build time) | `node --test` (same functions + fixtures) | Must fail `npm run build` on Cloudflare too, so it cannot live only in tests. |
| Schema, honesty rules, derived values | `src/lib/data.ts` (SSG, runs at build) | — | The single import point for numbers; zod `parse` at module load. |
| Status vocabulary (labels, definitions, glyphs) | `src/lib/status.ts` | — | Shared by `data.ts` (enum) and the UI (tags, legend). |
| Tags, metrics, figures, tables, placeholders | Astro components, server-rendered (`src/components/ui/`) | CSS only (no JS) | Final state in HTML; works with JS off. |
| Raster optimisation (AVIF/WebP, width/height) | `astro:assets` `<Picture>` + sharp at build | CDN static | No runtime image service; static output. |
| Card layout < 768 px, disclosure | CSS media query + native `<details>` | — | No JS needed. |

## Project Constraints (from CLAUDE.md)

`CLAUDE.md` predates the current plan. PROJECT.md says its stack and token pins are **not binding**, but its honesty, accessibility and motion rules are kept. Directives that still apply to this phase:
- Every number comes from one results JSON through one lib module. Never hard-code a result value in a component. Derived values are computed, never typed. The build enforces this with zod, and the rules must not be weakened.
- One tier per results file. Pass/fail colours only for simulated or measured data.
- Every chart has a "View as table" `<details>`. Informative SVGs get `role="img"` plus `<title>`; decorative ones get `aria-hidden`.
- The word "Live" is banned until real streaming exists.
- Server-render every visual in its final state. Count-up animations keep the real value in the DOM.
- SVG colours use tokens or `currentColor`, never raw hex (enforced by `tests/tokens.test.mjs`: hex, `rgb(`/`hsl(` and literal font-family are banned outside `tokens.css`).
- No chart library, no icon package, no Tailwind. Buttons are CSS classes. Scoped styles do not reach child SVGs (use `:global`).
- Copy: sentence case, no "→" on buttons, uppercase only for tags, stage names and eyebrows.
- Budgets: CSS ≤ 25 KB gzip; `tests/build.test.mjs` caps page JS at 10 KB (Phase 1 sanity cap). This phase adds **no client JS**.
- Never push or deploy without the user asking.
- Stale bits to ignore, because PROJECT.md and SUMMARY.md override them: the `results.ts`/`ProvenanceBadge`/conceptual-tier naming, the old `#07101F` tokens, and the 9-section layout. **Use `src/lib/data.ts` and the six-tier StatusTag (ARCHITECTURE.md / SUMMARY.md).**

## Scope Constraints (no CONTEXT.md; from orchestrator + PROJECT.md "User answers")

- Headline dataset = `04_MATLAB/DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv`, tagged SIMULATED. Datasets are never merged. The second five-target run (75–375 m) is not ingested in v1.
- The Monte Carlo CSV (100 identical rows) is never shown as a distribution. The SNR sweep is not shown while its SNR definition is PENDING.
- Repo data can only be SIMULATED or BUILT. Illustrative values live in a separate list that can only be ILLUSTRATIVE.
- Keep dependencies minimal: zod ships with Astro, no chart libraries, hand-written CSV parsing.
- Deadline: live by 2026-10-02. Keep this phase to 2–3 plans.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DATA-01 | Repo CSVs copied in and converted at build time to typed JSON; a hand-edited CSV (hash mismatch) fails the build | Pattern 1 (pinned upstream sha256 of LF bytes, re-ingest equality), Pitfall 1 (CRLF), integration hook verified to fail the build |
| DATA-02 | Every displayed number carries status, unit and source; rendering a number without a status fails the build | Pattern 3 (`metric()` getter returns a `Tagged` object; `requireTagged()` throws at render; dist rule: every `data-value` has `data-status`) |
| DATA-03 | Repo values only SIMULATED/BUILT; illustrative values in a separate ILLUSTRATIVE-only list | Pattern 2 schema: `Dataset.status: enum(['SIMULATED','BUILT'])`, `Illustrative.status: literal('ILLUSTRATIVE')` |
| DATA-04 | Derived values (max/mean range and velocity error, detection counts) computed, never typed | `derive()` in data.ts; `.strict()` rejects extra keys in results.json; values checked below |
| DATA-05 | Headline = CFAR_Performance_Table.csv; runs never merged; each dataset shows scenario + source file | Single `source` object per dataset, row count must equal re-ingest, unique ids and paths, `scenario` required |
| DATA-06 | Monte Carlo never a distribution; SNR sweep not shown while SNR definition PENDING | Rules: identical rows → `note` required + `distributionAllowed:false`; source path `/SNR_Sweep/` requires `definitions.snr !== null` |
| DATA-07 | Build fails on "Live", "real-time", AI/ML next to BUILT, TODO/TBD/lorem outside placeholders | Pattern 4 (`lintOutput(dist)` in `astro:build:done`, text-only scan, block-segment scope for AI/ML) |
| UI-01 | Six-tier StatusTag: colour + glyph + border, never colour alone, optional provenance suffix | Glyph and border table below; inline-SVG glyphs (no font dependency) |
| UI-02 | Status legend (section 01 and footer) | `StatusLegend.astro` built from `STATUS`; placed on `/preview/` now, in 01 and the footer in Phase 3 |
| UI-03 | Section header with numbered eyebrow, heading, lede | `SectionHeader.astro`; used on preview only (Pitfall 4) |
| UI-04 | Metric readout: tabular nums, unit, tag; ILLUSTRATIVE distinct, never counts up | `Metric.astro` takes a `Tagged` value; ILLUSTRATIVE = text-2 + hatch plate + no `data-countup` |
| UI-05 | Figure plate: MATLAB export unrecoloured on light plate with caption, status, source path | `Figure.astro` + `--plate` token, `<Picture>`, no filter or blend |
| UI-06 | Placeholder with fixed aspect ratio naming the pending asset and its status | `Placeholder.astro` with `ratio` prop → `aspect-ratio` |
| UI-07 | Result table → cards < 768 px; every chart has "View as table" | `ResultTable.astro` (CSS stack + ARIA role restore) + `TableDisclosure.astro` |
| IMG-03 | Raster images as AVIF/WebP with explicit width and height | `<Picture formats={['avif','webp']} fallbackFormat="webp">` output verified |
</phase_requirements>

## Standard Stack

### Core (all already installed; nothing to add)
| Library | Version (installed) | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 7.3.5 (pinned) | SSG, components, `astro:assets`, integration hooks | Already the stack [VERIFIED: node_modules/astro/package.json] |
| zod (via `astro/zod`) | 4.6.5 (`astro/zod` → `zod/v4`) | Schema + `superRefine` honesty rules | Ships with Astro; `astro/dist/zod.js` re-exports `zod/v4` as `z` [VERIFIED: node_modules/astro/dist/zod.js] |
| sharp | 0.35.5 (Astro optionalDependency) | AVIF/WebP encoding at build | Default Astro image service; `@img/sharp-linux-*` entries already in package-lock.json for Cloudflare's Linux build [VERIFIED: package-lock.json] |
| node:test / node:crypto / node:fs | Node 24.21.0 | Fixture tests, sha256, file walk | Existing test convention (`npm test` = `node --test "tests/*.test.mjs"`) [VERIFIED: package.json] |
| @playwright/test + @axe-core/playwright | 1.63.0 / 4.13 | Preview page e2e + axe | Existing convention; Chromium installed [VERIFIED: npx playwright --version, ms-playwright dir] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain `data.ts` + `superRefine` | Astro content collections (`file()` loader) | Collections validate per entry, but the rules here are cross-field and cross-array. Rejected (ARCHITECTURE.md). |
| Hand-written CSV split | papaparse / csv-parse | These files have no quoting, 5 rows each. A dependency is not justified. |
| Inline integration in `astro.config.mjs` | `prebuild`/`postbuild` npm scripts | npm scripts don't run when someone calls `astro build` directly. The hook always runs, and it was verified to fail the build. |
| DOM parser (linkedom/cheerio) for the output lint | Regex over tag-stripped text | A new dependency, not needed for this markup. The regex ceiling is noted in Pattern 4. |

**Installation:** none.

## Package Legitimacy Audit

No external packages are installed in this phase: zod and sharp come in through `astro`, which is already audited in Phase 1. slopcheck was not run because there is nothing new to check.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| (none new) | — | — | — | — | — | — |

**Packages removed:** none. **Packages flagged:** none.

## Architecture Patterns

### System Architecture Diagram

```
 AVOLITE repo @9b985ca (GitHub)
        │  curl raw.githubusercontent (LF bytes)   ← or copy from a clone, then LF-normalise
        ▼
 data/raw/04_MATLAB/DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv
        │
        │  npm run data:ingest  (scripts/ingest.mjs)
        │    MANIFEST[] = {id, path, scenario, title, status, columns+units+precision, sha256 PIN}
        │    hash(LF bytes) === PIN ? parse : throw
        ▼
 src/data/results.json (generated, committed)     data/claims.json (hand-written: illustrative[], definitions)
        │                                                 │
        └──────────────┬──────────────────────────────────┘
                       ▼
   astro build ──► integration 'astro:config:setup' → verifyRaw(): re-ingest in memory, deepEqual results.json ──✗ FAIL
                       │
                       ▼
   src/lib/data.ts  (import JSON with {type:'json'}; z.parse + superRefine rules) ──✗ ZodError = FAIL
     exports: datasets, dataset(id), derive(id), metric(id,key), illustrative(id), fmt()
                       │ typed Tagged {value, unit, status, source, label}
                       ▼
   pages/preview.astro ─► ui/StatusTag, StatusLegend, SectionHeader, Metric, Figure(<Picture>),
                          Placeholder, ResultTable, TableDisclosure   (requireTagged() throws if status missing)
                       │ static HTML + CSS (no JS)
                       ▼
   dist/  ──► integration 'astro:build:done' → lintOutput(dist): banned words, AI/ML-near-BUILT,
              TODO/TBD/lorem, every [data-value] has [data-status] ──✗ FAIL
                       │
                       ▼
   node --test (same verifyRaw / validate / lintOutput + failing fixtures)   Playwright /preview/ + axe
```

### Recommended Project Structure (new files only)
```
data/
├── raw/04_MATLAB/DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv   # upstream bytes, LF
└── claims.json            # { definitions: { snr: null }, illustrative: [ … ] }  (Phase 3 extends)
scripts/
├── ingest.mjs             # MANIFEST + parse + hash pin; `node scripts/ingest.mjs` writes results.json; exports ingest(), verifyRaw()
└── honesty.mjs            # exports lintOutput(distDir) and lintHtml(html) (pure, fixture-testable)
src/
├── data/results.json      # GENERATED; never hand-edit
├── lib/
│   ├── status.ts          # STATUS const: label, definition, glyph id, border style; Status type
│   ├── data.ts            # zod schema + rules + derive + getters + fmt (erasable TS only)
│   ├── figures.ts         # PNG imports + caption/status/source/ratio registry (NOT node-importable: .png imports)
│   └── site.ts            # + REPO = { slug, commit, blob(path) }
├── assets/repo/04_MATLAB/DSP/…/*.png   # mirrored repo paths
├── components/ui/
│   ├── StatusTag.astro  StatusLegend.astro  SectionHeader.astro
│   ├── Metric.astro  Figure.astro  Placeholder.astro
│   └── ResultTable.astro  TableDisclosure.astro
└── pages/preview.astro    # noindex, unlinked
tests/
├── data.test.mjs          # one failing fixture per data rule
├── honesty.test.mjs       # lintHtml fixtures + real dist scan
├── fixtures/raw-edited/…  # (or build fixtures in os.tmpdir() at test time)
└── preview.spec.ts        # Playwright + axe for /preview/
```

### Pattern 1: Pinned-hash ingest (DATA-01, DATA-05)
**What:** The manifest in `scripts/ingest.mjs` pins the sha256 of each upstream file (LF bytes) and the upstream commit. Ingest refuses a file whose hash differs. `verifyRaw()` re-runs ingest in memory and deep-compares with the committed `results.json`, the same pattern Phase 1 uses for `logo.generated.json`. Together these catch three edits: a changed CSV, a hand-edited results.json, and rows appended from another run.
**Pins (verified this session):**

| File | Bytes (LF) | sha256 (LF) | Commit |
|---|---|---|---|
| `04_MATLAB/DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv` | 380 | `3cccc3c2361ddee56be163798cd461e02c0653a5d2901097d82d32e32ab51d6b` | `9b985ca7f8ef99000724f8ce870918a40d0d95c8` |
| `…/CFAR_Threshold_Analysis/FINAL_DEMONSTRATION/SARRS_Final_Target_Table.csv` (not ingested in v1; pin kept for later) | 231 | `704e4c2d0e1613860201bea31911f176c4e9d174c23ed89ddf641ff4c04f3087` | same |

[VERIFIED: `git show HEAD:<path> | sha256sum` in the clone and `curl raw.githubusercontent.com/…/9b985ca…/<path> | sha256sum`, identical]

```js
// scripts/ingest.mjs (sketch)
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const REPO = { slug: 'abhishekpj0902-apj/AVOLITE', commit: '9b985ca7f8ef99000724f8ce870918a40d0d95c8' };
export const MANIFEST = [{
  id: 'cfar-a', path: '04_MATLAB/DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv',
  sha256: '3cccc3c2361ddee56be163798cd461e02c0653a5d2901097d82d32e32ab51d6b',
  status: 'SIMULATED', title: 'CFAR five-target detection',
  scenario: 'Five synthetic targets at 25–145 m, SARRS radar-echo testbed',
  columns: { Target: [null, 0], ExpectedRange_m: ['m', 1], DetectedRange_m: ['m', 1], RangeError_m: ['m', 1],
             ExpectedVelocity_mps: ['m/s', 3], DetectedVelocity_mps: ['m/s', 3], VelocityError_mps: ['m/s', 3] },
}];
const lf = (buf) => buf.toString('utf8').replace(/\r\n/g, '\n');
export function ingest(rawDir = `${ROOT}data/raw/`, manifest = MANIFEST) {
  return { repo: REPO, datasets: manifest.map((m) => {
    const text = lf(readFileSync(rawDir + m.path));
    const sha = createHash('sha256').update(text).digest('hex');
    if (sha !== m.sha256) throw new Error(`${m.path}: sha256 ${sha} != pinned ${m.sha256} (CSV edited?)`);
    const [head, ...lines] = text.trim().split('\n');
    const keys = head.split(',');
    const rows = lines.map((l) => Object.fromEntries(l.split(',').map((v, i) => {
      const n = v === '' ? null : Number(v);
      if (n !== null && !Number.isFinite(n)) throw new Error(`${m.path}: non-numeric ${v}`);
      return [keys[i], n];
    })));
    const identical = rows.length > 1 && rows.every((r) => JSON.stringify(r) === JSON.stringify(rows[0]));
    return { id: m.id, title: m.title, status: m.status, scenario: m.scenario,
      source: { repo: REPO.slug, commit: REPO.commit, path: m.path, sha256: sha },
      columns: keys.map((k) => ({ key: k, unit: m.columns[k]?.[0] ?? null, precision: m.columns[k]?.[1] ?? 3 })),
      rows, ...(identical ? { note: `All ${rows.length} rows are identical` } : {}) };
  }) };
}
export function verifyRaw() {
  const fresh = JSON.stringify(ingest(), null, 2) + '\n';
  const committed = readFileSync(`${ROOT}src/data/results.json`, 'utf8');
  if (fresh !== committed) throw new Error('src/data/results.json is stale or hand-edited: run npm run data:ingest');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(`${ROOT}src/data/results.json`, JSON.stringify(ingest(), null, 2) + '\n');
```
Add a `"data:ingest": "node scripts/ingest.mjs"` script. Keep the manifest in `ingest.mjs`: one file, and it is the only place a pin changes.

### Pattern 2: Schema + honesty rules in `data.ts` (DATA-02..06)
**What:** One `validate(raw)` export, used by the build (at module load) and by the tests (with fixtures). The code must be **erasable TS only** (no `enum`, no `namespace`, no parameter properties), because Node 24 imports it by stripping types. Import sibling TS with the explicit `.ts` extension, which `allowImportingTsExtensions` in Astro's base tsconfig allows. Import JSON with `with { type: 'json' }`. [VERIFIED: spike, via node --test, astro build and astro check (0 errors)]

```ts
// src/lib/data.ts (sketch)
import { z } from 'astro/zod';
import { STATUS_IDS } from './status.ts';
import results from '../data/results.json' with { type: 'json' };
import claims from '../../data/claims.json' with { type: 'json' };

const Source = z.object({ repo: z.string(), commit: z.string().length(40), path: z.string(), sha256: z.string().length(64) }).strict();
const Dataset = z.object({
  id: z.string(), title: z.string(), scenario: z.string().min(1),
  status: z.enum(['SIMULATED', 'BUILT']),                    // DATA-03: repo data never ILLUSTRATIVE
  source: Source,                                           // DATA-05: exactly one file (array fails)
  columns: z.array(z.object({ key: z.string(), unit: z.string().nullable(), precision: z.number().int() }).strict()),
  rows: z.array(z.record(z.string(), z.number().nullable())).min(1),
  note: z.string().optional(),
}).strict();                                                // DATA-04: no typed `derived`/`max…` keys
const Illustrative = z.object({
  id: z.string(), label: z.string(), value: z.number(), unit: z.string().min(1),
  status: z.literal('ILLUSTRATIVE'),                        // DATA-03
  from: z.string().min(1),                                  // e.g. "Master doc §23 (illustrative UI values)"
}).strict();
const Root = z.object({
  repo: z.object({ slug: z.string(), commit: z.string() }),
  datasets: z.array(Dataset).min(1),
  definitions: z.object({ snr: z.string().nullable() }),
  illustrative: z.array(Illustrative),
}).superRefine((d, ctx) => {
  const ids = new Set(), paths = new Set();
  for (const ds of d.datasets) {
    if (ids.has(ds.id) || paths.has(ds.source.path)) ctx.addIssue({ code: 'custom', message: `duplicate/merged dataset ${ds.id}` });
    ids.add(ds.id); paths.add(ds.source.path);
    // error = detected − expected (verified on the CSV: residual ≤ 5e-14)
    for (const [e, det, err] of [['ExpectedRange_m','DetectedRange_m','RangeError_m'], ['ExpectedVelocity_mps','DetectedVelocity_mps','VelocityError_mps']])
      for (const r of ds.rows) if (r[e] != null && r[det] != null && r[err] != null && Math.abs(r[det] - r[e] - r[err]) > 1e-9)
        ctx.addIssue({ code: 'custom', message: `${ds.id}: ${err} != ${det} − ${e}` });
    const same = ds.rows.length > 1 && ds.rows.every((r) => JSON.stringify(r) === JSON.stringify(ds.rows[0]));
    if (same && !ds.note) ctx.addIssue({ code: 'custom', message: `${ds.id}: identical rows need a note (DATA-06)` });
    if (/SNR_Sweep/i.test(ds.source.path) && d.definitions.snr === null) ctx.addIssue({ code: 'custom', message: 'SNR sweep needs definitions.snr (DATA-06)' });
  }
});
export function validate(raw: unknown) { return Root.parse(raw); }
export const data = validate({ ...results, ...claims });   // throws => astro build exits 1
```
Also export:
- `derive(id)`, which returns `{ maxAbsRangeError, meanAbsRangeError, maxAbsVelocityError, meanAbsVelocityError, detected, total }`. Refuse (throw) when the dataset has a `note` about identical rows and `rows()` is requested for a chart. That is DATA-06's "never a distribution".
- `metric(id, key)`, which returns a `Tagged` value.
- `fmt(value, precision)`, which uses U+2212 for negatives.

**Expected derived values for `cfar-a`** (computed from the CSV this session; the tests should assert these):
- detected **5** of total **5** (rows with finite `DetectedRange_m` and `DetectedVelocity_mps`; the CSV has no explicit Detected column)
- max |range error| **0.5 m**, mean |range error| **0.4 m**
- max |velocity error| **0.165381493506491 m/s** (display 0.165), mean |velocity error| **0.0995941558441563 m/s** (display 0.100)

### Pattern 3: The value carries its tag (DATA-02)
```ts
export type Tagged = { value: number; unit: string; status: Status; label: string; source: string }; // source = repo path or "Master doc §23"
export function requireTagged(t: Partial<Tagged>, where: string): Tagged {
  for (const k of ['value', 'unit', 'status', 'label', 'source'] as const)
    if (t[k] === undefined || t[k] === null || t[k] === '') throw new Error(`${where}: number rendered without ${k} (DATA-02)`);
  if (!STATUS_IDS.includes(t.status as Status)) throw new Error(`${where}: unknown status`);
  return t as Tagged;
}
```
- `Metric.astro` and `ResultTable.astro` call `requireTagged(Astro.props, 'Metric')` in frontmatter. `astro build` does not type-check, so the runtime throw is what actually fails the build; `astro check` catches the missing prop earlier as a type error.
- Every rendered number is wrapped as `<data value="0.5" data-status="SIMULATED">0.5</data>`. `lintOutput` also asserts that every `data-value`/`<data value>` in dist has a `data-status` (on itself or on the metric wrapper). That gives DATA-02 two layers.
- Node fixture: `assert.throws(() => requireTagged({ value: 1, unit: 'm' }, 'x'), /status/)`.

### Pattern 4: Output-wording lint over `dist/` (DATA-07)
```js
// scripts/honesty.mjs (sketch)
const BLOCK = /<\/?(?:p|li|tr|td|th|dd|dt|figcaption|caption|h[1-6]|div|section|article|header|footer|figure|ul|ol|table|summary|details)\b[^>]*>/gi;
const text = (html) => html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]*\b(?:alt|title|aria-label)="([^"]*)"[^>]*>/gi, ' $1 ')   // keep user-visible attribute text
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ');
const RULES = [
  [/\blive\b/i, '"Live"'],
  [/\breal[\s-]?time\b/i, '"real-time"'],
  [/\b(?:TODO|TBD|FIXME|XXX)\b|lorem ipsum|\blorem\b/i, 'placeholder text'],
];
const AI = /\b(?:AI|ML|machine learning|neural|trained|learns?)\b/;
export function lintHtml(html, file = 'html') {
  const hits = [];
  const body = html.slice(html.indexOf('<body'));
  for (const [re, name] of RULES) if (re.test(text(body))) hits.push(`${file}: ${name}`);
  for (const seg of body.split(BLOCK))       // one inline run = one block's text
    if (/data-status="(?:BUILT|SIMULATED)"/.test(seg) && AI.test(text(seg))) hits.push(`${file}: AI/ML next to BUILT/SIMULATED: ${text(seg).trim().slice(0, 80)}`);
  for (const m of body.matchAll(/<data\b[^>]*>/g)) if (!/data-status="/.test(m[0])) hits.push(`${file}: number without status`);
  return hits;
}
export function lintOutput(distUrl) { /* walk *.html under dist, collect lintHtml hits, throw if any */ }
```
Wire both gates in `astro.config.mjs`:
```js
import { verifyRaw } from './scripts/ingest.mjs';
import { lintOutput } from './scripts/honesty.mjs';
// integrations: [{ name: 'honesty', hooks: {
//   'astro:config:setup': () => verifyRaw(),
//   'astro:build:done': ({ dir }) => lintOutput(dir) } }]
```
- Tag text is stripped before matching, so `aria-live="polite"` does not trigger the "Live" rule (fixture this).
- `\blive\b` does not match "delivered" or "alive". Fixture both.
- **Ceiling:** the AI/ML rule is scoped to the inline run between block tags, so a BUILT tag and "AI" in one `<p>` fail, while in sibling `<li>`s they don't. `ponytail:` upgrade to claim-scoped checks, via zod on `claims.json` text fields, in Phase 3 when claims exist.
- Scope: the requirement bans AI/ML next to BUILT. SIMULATED is added per PITFALLS.md line 228. PROTOTYPE is left out on purpose, because source paths like `04_MATLAB/AI/ThreatClassifier.m` sit beside PROTOTYPE tags in Phase 3.

### Pattern 5: StatusTag glyph, border and colour spec (UI-01)
Use **inline SVG glyphs, 12×12, `currentColor`** rather than the Unicode ■●◐○◌▨. IBM Plex Mono and the subset Archivo don't contain those glyphs, so they would fall back to system fonts, and `◌` is a combining placeholder. [ASSUMED: glyph coverage of Plex Mono, not measured]

| Status | Token | Glyph (SVG) | Border | Fill |
|---|---|---|---|---|
| BUILT | `--st-built` | filled square | 1px solid | `color-mix(in srgb, var(--st-built) 12%, transparent)` |
| SIMULATED | `--st-simulated` | filled circle | 1px solid | 12% tint |
| PROTOTYPE | `--st-prototype` | half-filled circle | 1px solid | 12% tint |
| DESIGNED | `--st-designed` | ring (stroke 1.5) | 1px solid | none |
| PLANNED | `--st-planned` | dashed ring | 1px **dashed** | none |
| ILLUSTRATIVE | `--st-illustrative` | hatched square | 1px **dashed** | 45° hatch `repeating-linear-gradient` |

Markup: `<span class="tag tag--simulated" data-status="SIMULATED"><svg aria-hidden="true" data-glyph="circle">…</svg>SIMULATED<span class="tag__prov"> · CFAR_Performance_Table.csv</span></span>`. The label text is always present, so the tag never relies on colour. The mono label is 12 px, the radius 2 px, tracking 0.06em, uppercase. The optional `provenance` prop renders the suffix. The legend lists all six with `STATUS[s].definition`. Glyph plus text is the non-colour channel; border and fill are a secondary one (three borders × fill/no-fill/hatch).

Definitions, for `status.ts`. These are wording proposals: sentence case, and none of them uses "Live".
- BUILT: "Runs in the repository today."
- SIMULATED: "Produced by the MATLAB model on synthetic signals."
- PROTOTYPE: "Runs, but rule-based or on demo data."
- DESIGNED: "Architecture documented; not yet implemented."
- PLANNED: "On the roadmap; not yet designed in detail."
- ILLUSTRATIVE: "An example to explain an idea; not a result."

### Pattern 6: Figure, Placeholder, Metric, tables (UI-04..07, IMG-03)
- **Figure:**
  - Props: `{ image: ImageMetadata, alt, caption, status, source (repo path), table? }`.
  - Markup: `<figure>`, then `.plate` (background `var(--plate)`, a new token `--plate: #FFFFFF` in `tokens.css` so it matches MATLAB's white; padding `--sp-4`; radius `--r-panel`), then `<Picture src formats={['avif','webp']} fallbackFormat="webp" widths={[640, 1280, 1920]} sizes="(min-width: 1440px) 1280px, 100vw" alt>`.
  - `<figcaption>` holds the title plus a mono provenance line: StatusTag, then the source path linked to `https://github.com/<slug>/blob/<commit>/<path>`.
  - Never apply `filter`, `mix-blend-mode` or `opacity` to the img.
  - If `table` is given, render `<TableDisclosure>` ("View as table") under it.
- **`<Picture>` output (verified):** `<source type="image/avif" srcset="…640w, …1280w, …2000w">`, a WebP source, then `<img src="….webp" width="3262" height="1453" loading="lazy" decoding="async">`. `dist/_astro` contained only `.avif` and `.webp`. [VERIFIED: spike build]
- **Placeholder:** props `{ asset: string, status: Status, ratio: '16/9' | '16/10' | '2.23/1' }`. It renders `<div class="placeholder" style={`aspect-ratio:${ratio}`} data-placeholder>` with a hatched `--line` background, a centred mono label "{asset} · pending from the team" and a StatusTag. Because the box has a fixed ratio, the real asset swaps in with no layout change. The copy never says TODO/TBD.
- **Metric:**
  - Props: a `Tagged` value plus `precision` and `size`.
  - Layout: value in Archivo (`font-variant-numeric: tabular-nums slashed-zero`, text-1), unit in mono text-3, label in Plex text-2, then the StatusTag.
  - `data-countup` appears only when status is SIMULATED or BUILT; ILLUSTRATIVE never gets it. The value is final in the DOM from the start.
  - ILLUSTRATIVE variant: `.metric--illustrative` (value in `--text-2`, dashed `--st-illustrative` border, hatch plate).
- **ResultTable:**
  - One real `<table>` with `<caption>` (title, scenario, StatusTag, source path), `<th scope="col">` with units in the header, and `<td data-label="Detected range (m)">`.
  - Under 768 px: `tr { display: grid }`, `thead` visually hidden, and `td::before { content: attr(data-label) }`.
  - **Add explicit roles** (`role="table|rowgroup|row|columnheader|cell"`), because changing `display` on table elements strips their semantics in some browsers. [CITED: adrianroselli.com "Tables, CSS Display Properties, and ARIA"; ASSUMED still current]
  - Pass/fail colour: none in Phase 2. Show plain numbers; pass/fail needs a threshold the team hasn't given.
- **TableDisclosure:** `<details><summary>View as table</summary><table>…</table></details>`. The summary is at least 44 px tall.

### Anti-Patterns to Avoid
- **Hashing CRLF bytes, or recording the hash only at ingest time.** Either the Cloudflare checkout fails, or a CSV edit passes after re-ingest. Use the upstream pin on LF-normalised bytes.
- **Importing `figures.ts` (PNG imports) from `data.ts`.** Node cannot import `.png`, so the tests break. Keep images out of the node-importable module.
- **Putting SectionHeader into `index.astro` in Phase 2.** `tests/build.test.mjs` regex-matches `<h2 id="{id}-h"><span…>{n}</span> {title}`. Swap it in Phase 3 together with the test update.
- **Emitting a `<script>` on the preview page.** Everything in this phase is CSS-only.
- **Recolouring or cropping MATLAB PNGs** to fit the dark theme. That falsifies the colour scale.
- **Unicode status glyphs.** They depend on the font.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| AVIF/WebP generation, srcset, intrinsic size | sharp scripts, manual `<source>` lists | `astro:assets` `<Picture>` | Verified output; hashing, caching and width/height are handled |
| Schema validation | Hand-written `typeof` checks | `astro/zod` + `superRefine` | Precise error paths in the build log; already installed |
| Disclosure widget | JS accordion | `<details>/<summary>` | Keyboard and screen-reader support built in; works with JS off |
| Hashing | — | `node:crypto` `createHash('sha256')` | stdlib |

**Key insight:** the honesty rules themselves *are* the custom code worth writing. The pin, the re-ingest equality and the dist lint are about 150 lines total. Everything around them is platform.

## Runtime State Inventory

Not a rename or migration phase. Skipped.

## Common Pitfalls

### Pitfall 1: CRLF vs LF breaks hash verification in the cloud
**What goes wrong:** Someone copies the CSV from a Windows clone (`core.autocrlf=true` gives CRLF), hashes it and commits. Git normalises the file to LF (`* text=auto eol=lf`), the Cloudflare checkout is LF, the hash mismatches, and the production build fails.
**How to avoid:** Replace `\r\n` with `\n` before hashing and parsing. Fetch the raw file from `raw.githubusercontent.com/…/<commit>/<path>` (LF). Pin the LF hash.
**Warning signs:** The build passes locally but fails right after a fresh clone.

### Pitfall 2: `npm test` imports `data.ts` in plain Node
**What goes wrong:** Using `enum`, extensionless TS imports, JSON imported without `with { type: 'json' }`, or a `.png`/`astro:*` import in `data.ts` or `status.ts` crashes `node --test`.
**How to avoid:** Keep these modules to erasable TS with explicit `.ts` extensions. `site.ts` is already imported by `build.test.mjs` this way.

### Pitfall 3: The output lint trips on attributes or on its own fixtures
**What goes wrong:** `aria-live`, class names like `live-region`, or minified CSS/JS text trigger false hits. A preview page that *demonstrates* banned words fails the build.
**How to avoid:**
- Strip `<script>`/`<style>` and tags before matching, keeping only alt/title/aria-label values.
- Scan `*.html` only.
- Negative fixtures live in `tests/`, never in `src/pages`.
- **Scan `dist/` HTML only**, so Phase 1 tests are untouched.

### Pitfall 4: Breaking Phase 1 build tests
- `tests/build.test.mjs` asserts exactly one h1, 8 `data-section` sections, the h2 regex and two font preloads **in `dist/index.html` only**. It also caps the total `.js` in dist at 10 KB gzip.
- A `/preview/` page with its own h1 is fine, as long as it adds no JS.
- Leave `index.astro` untouched in Phase 2, except possibly a legend mount (not needed).

### Pitfall 5: Header anchors on `/preview/`
- Base renders the Header with `href="#problem"` and so on, so on `/preview/` those links point to nothing. Acceptable for an unlinked dev page.
- Don't change the hrefs to `/#problem`, because `build.test.mjs` asserts `#id`.
- `shell.ts` is null-safe when there are no sections.

### Pitfall 6: Build time from AVIF encoding
Around 10 PNGs × 2 formats × 3 widths comes to about 60 encodes at ~0.1–0.4 s each (spike: 7 images in 1.1 s). Only images actually rendered are processed, so registering all PNGs in `figures.ts` costs nothing until a page uses them. Keep `widths` to 3.

### Pitfall 7: Before/after pair geometry (a Phase 4 note, recorded now)
`01_Original_Range_Doppler_Map.png` is 3284×1463 and `03_CFAR_Detection_Map.png` is 3261×1463. Their colourbars differ, so the axes won't line up exactly in a clip slider. `SARRS_Final_Radar_CA_CFAR_Result.png` already shows the RD map and the detection map side by side.

## Code Examples

The patterns above are the examples: ingest (Pattern 1), schema (Pattern 2), `requireTagged` (Pattern 3), lint (Pattern 4). Picture call, verified in the spike:
```astro
---
import { Picture } from 'astro:assets';
import img from '../../assets/repo/04_MATLAB/DSP/SARRS_Results/CFAR_Performance/Range_Velocity_Errors.png';
---
<Picture src={img} alt="Bar charts of range error (±0.5 m) and velocity error per target"
  formats={['avif', 'webp']} fallbackFormat="webp" widths={[640, 1280, 1920]}
  sizes="(min-width: 1440px) 1280px, 100vw" />
```
Alt text that mentions values must match the data. Better still, keep numbers out of alt and let the "View as table" disclosure carry them, so no untagged number exists.

## PNGs to import (scenario A only; all verified visually or by dimensions)

Copy each file to `src/assets/repo/<same path>`:

| Repo path (`04_MATLAB/…`) | Size px | Use (Phase 3/4) |
|---|---|---|
| `DSP/SARRS_Results/CFAR_Performance/CFAR_Detection_Map.png` | 3261×1463 | detection map |
| `DSP/SARRS_Results/CFAR_Performance/Expected_vs_Detected_Range.png` | 3265×1463 | expected vs detected |
| `DSP/SARRS_Results/CFAR_Performance/Expected_vs_Detected_Velocity.png` | 3256×1463 | expected vs detected |
| `DSP/SARRS_Results/CFAR_Performance/Range_Velocity_Errors.png` | 3262×1453 | error bars (preview figure) |
| `DSP/SARRS_Results/CFAR_Threshold_Analysis/01_Original_Range_Doppler_Map.png` | 3284×1463 | before (slider) |
| `DSP/SARRS_Results/CFAR_Threshold_Analysis/02_CFAR_Threshold_Map.png` | 3284×1463 | threshold |
| `DSP/SARRS_Results/CFAR_Threshold_Analysis/03_CFAR_Detection_Map.png` | 3261×1463 | after (slider) |
| `DSP/SARRS_Results/CFAR_Threshold_Analysis/04_CFAR_Complete_Analysis.png` | 3228×1444 | 3-panel RD → threshold → detection |
| `DSP/SARRS_Results/CFAR_Threshold_Analysis/FINAL_DEMONSTRATION/SARRS_Final_Radar_CA_CFAR_Result.png` | 3237×1882 | RD map vs CA-CFAR detection (checked visually: clean) |
| `DSP/FiveTarget_RangeDoppler_Map_Annotated.png` | 3284×1462 | annotated RD map (targets T1–T5 at 25–145 m) |

Skip `CFAR_Visualization/*_145537.png` and `*_145619.png`: two timestamped runs with pairwise identical sizes, spares. PNG ratio is about **2.23:1**, so placeholders for plots should use that ratio, not 4:3.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import { z } from 'astro:content'` | `import { z } from 'astro/zod'` (zod v4) | Astro 5→6+ | Use `astro/zod`; zod v4 API (`z.record(key, value)` needs two args; `ctx.addIssue({ code: 'custom' })`) [VERIFIED: node_modules] |
| ts-node / tsx to run TS tests | Node 24 native type stripping | Node 23.6+ | `node --test` imports `.ts` directly; erasable syntax only [VERIFIED: spike + existing build.test.mjs] |
| JSON import `assert { type }` | `with { type: 'json' }` | ES2025 import attributes | Works in Vite, TS 6 and Node [VERIFIED: spike] |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | IBM Plex Mono lacks ■●◐○◌▨ glyphs (reason for inline SVG) | Pattern 5 | None: SVG glyphs work either way |
| A2 | Changing `display` on table elements drops table semantics in some browsers, so explicit ARIA roles are needed | Pattern 6 | Extra roles are harmless if browsers have fixed it |
| A3 | Status definitions wording | Pattern 5 | Copy tweak only; the team may reword |
| A4 | `--plate: #FFFFFF` matches the MATLAB export background | Pattern 6 | Visible seam if exports are off-white (they look pure white) |

## Open Questions (RESOLVED)

All resolved with defaults so planning can proceed (user asleep; defaults logged for review).

1. **Preview page: dev-only or built? (RESOLVED)** Default: build `src/pages/preview.astro` → `/preview/`. It is unlinked and carries `<meta name="robots" content="noindex">` (add a `noindex?: boolean` prop to `Base.astro`), plus a `public/_headers` block `/preview/*` with `X-Robots-Tag: noindex`. Why not `_preview.astro`: underscore pages are excluded from routing entirely, even in dev, and Playwright e2e runs against `build && preview`, so the page must exist in `dist/`. It contains only real, tagged data plus the one ILLUSTRATIVE example, so it passes the lint and is harmless if found. Phase 6 may delete it.
2. **TODO/TBD/lorem "outside marked placeholders". (RESOLVED)** Default: ban them **everywhere** in HTML text. Placeholder copy uses "pending from the team", so no exemption parser is needed. This is stricter than the requirement, and it still satisfies it.
3. **AI/ML scope: BUILT only, or also SIMULATED/PROTOTYPE? (RESOLVED)** Default: BUILT and SIMULATED, block-scoped. PROTOTYPE is excluded because of `04_MATLAB/AI/…` paths. Phase 3 adds a claims-level zod rule so that PROTOTYPE items include "rule-based".
4. **Ingest the FINAL_DEMONSTRATION target table (Power_dB)? (RESOLVED)** Default: no in Phase 2. Its pin is recorded above, so adding it later is one manifest entry. The Monte Carlo, SNR and scenario-B CSVs are **not copied at all**. DATA-06 is proven by fixtures, not by shipping those files.
5. **Illustrative example for the ILLUSTRATIVE metric. (RESOLVED)** Default: `{ id: 'env-noise-floor-example', label: 'Noise floor (example dashboard field)', value: -92, unit: 'dBm', status: 'ILLUSTRATIVE', from: 'Master doc §23, "illustrative UI values only"' }`. The master doc explicitly labels it illustrative (line ~620). [VERIFIED: AVOLITE_Master_Project_Documentation.md §23]
6. **Pass/fail colouring on the CFAR table? (RESOLVED)** Default: none. No acceptance threshold has been given, and inventing one would be a claim.
7. **Number display precision. (RESOLVED)** Default: range 1 decimal (the data is on a 0.5 m grid), velocity 3 decimals, negatives with U+2212. Precision lives in the ingest manifest columns, not in components.
8. **Where the lib lives: `data.ts` (ARCHITECTURE) or `results.ts` (old CLAUDE.md)? (RESOLVED)** Default: `src/lib/data.ts`, per SUMMARY.md. Refreshing CLAUDE.md stays a backlog item.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node | build, tests, type stripping | ✓ | 24.21.0 | — |
| npm | scripts | ✓ | 11.19.0 | — |
| sharp (win32-x64; linux in lockfile) | `<Picture>` AVIF/WebP | ✓ | 0.35.5 | — |
| Playwright Chromium | preview e2e + axe | ✓ | 1.63.0 (chromium-1243) | — |
| git + curl | fetching pinned CSV/PNGs | ✓ | — | copy from the local clone `C:/Users/SANDES~1/AppData/Local/Temp/avl` at commit 9b985ca, then LF-normalise |
| AVOLITE clone | PNG source | ✓ | commit `9b985ca7f8ef…` | `curl` raw URLs at that commit |

**Missing dependencies:** none.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | node:test (Node 24) + Playwright 1.63 + @axe-core/playwright 4.13 + `astro check` |
| Config file | `package.json` scripts; `playwright.config.ts` (build + preview webServer, chromium) |
| Quick run command | `node --test tests/data.test.mjs tests/honesty.test.mjs` (no dist needed except the real-dist block) |
| Full suite command | `npm run build && npm test && npm run check && npm run test:e2e` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-01 | Edited CSV (one byte changed, in a tmp copy of `data/raw`) → `ingest(tmpDir)` throws `/pinned/`; a CRLF copy of the true file passes; `verifyRaw()` passes on the repo; a stale results.json fixture throws | unit | `node --test tests/data.test.mjs` | ❌ Wave 0 |
| DATA-01 | Build fails on a stale results.json (integration hook) | integration (manual-once, or a test that spawns `astro build` on a tmp copy; skip: too slow) | covered by `verifyRaw` unit test + hook verified in research | — |
| DATA-02 | `requireTagged` throws without status/unit/source; `lintHtml('<data value="1">1</data>')` flags "number without status" | unit | `node --test tests/honesty.test.mjs` | ❌ Wave 0 |
| DATA-03 | `validate` rejects a dataset with `status:'ILLUSTRATIVE'`; rejects an illustrative entry with `status:'SIMULATED'` | unit | `node --test tests/data.test.mjs` | ❌ Wave 0 |
| DATA-04 | `derive('cfar-a')` equals 5/5, 0.5, 0.4, 0.16538…, 0.09959…; `validate` rejects a dataset with an extra `maxRangeError` key; rejects a tampered `RangeError_m` | unit | same | ❌ Wave 0 |
| DATA-05 | Rejects `source: [a, b]`; rejects duplicate id or path; rejects rows appended (re-ingest inequality); every dataset has `scenario` + `source.path` | unit | same | ❌ Wave 0 |
| DATA-06 | Rejects a 3-identical-row dataset without `note`; `rows()` for a chart throws on a noted identical dataset; rejects a `SNR_Sweep` path while `definitions.snr === null` | unit | same | ❌ Wave 0 |
| DATA-07 | `lintHtml` flags Live, live, real-time, realtime, TODO, TBD, lorem, and "AI" in the same `<p>` as `data-status="BUILT"`; passes `aria-live`, "delivered", "AI" next to DESIGNED, and AI in a sibling `<li>`; `lintOutput(dist)` on the real build returns 0 hits | unit + dist | `node --test tests/honesty.test.mjs` | ❌ Wave 0 |
| UI-01 | `/preview/` has 6 tags with 6 distinct `data-glyph` values; computed `border-style` dashed for PLANNED/ILLUSTRATIVE, solid otherwise; hatch `background-image` on ILLUSTRATIVE; each tag's text equals its label | e2e | `npx playwright test tests/preview.spec.ts -g "status tags"` | ❌ Wave 0 |
| UI-02 | Legend lists 6 statuses with definitions | e2e + dist | `-g "legend"` | ❌ Wave 0 |
| UI-03 | SectionHeader renders eyebrow "01 · THE PROBLEM", h2, lede on preview | dist | `node --test tests/preview.test.mjs` | ❌ Wave 0 |
| UI-04 | SIMULATED metric has `data-countup` and tabular-nums; ILLUSTRATIVE has no `data-countup`, colour = `--text-2`, hatch background | e2e | `-g "metric"` | ❌ Wave 0 |
| UI-05 | Figure: plate computed background is white; img `filter: none`, `mix-blend-mode: normal`; figcaption holds a StatusTag + source path link to github blob@commit | e2e + dist | `-g "figure"` | ❌ Wave 0 |
| UI-06 | Placeholder aspect ratio holds at 390/1440 (height ≈ width/ratio ±1 px), text names the asset, has a StatusTag | e2e | `-g "placeholder"` | ❌ Wave 0 |
| UI-07 | At 390: `tr` display ≠ `table-row`, `td::before` content = header label, no horizontal scroll; at 1440: table-row; `details > summary` "View as table" opens and shows a `<table>` | e2e | `-g "table"` | ❌ Wave 0 |
| IMG-03 | dist/preview has `<source type="image/avif">` + `type="image/webp"`, `<img width height>`; no `.png` under `dist/_astro` | dist | `node --test tests/preview.test.mjs` | ❌ Wave 0 |
| All UI | axe clean on `/preview/` at 1440 and 390 | e2e | `-g "axe preview"` | ❌ Wave 0 |
| Phase 1 guard | All 34 existing node tests + 23 e2e still pass | regression | full suite | ✅ |

### Sampling Rate
- **Per task commit:** `node --test tests/data.test.mjs tests/honesty.test.mjs` (plan 02-01); `npm run build && node --test tests/preview.test.mjs` (plan 02-02)
- **Per wave merge:** `npm run build && npm test && npm run check`
- **Phase gate:** the full suite green, including `npm run test:e2e`, plus a clean-clone check (`rm -rf node_modules dist .astro && npm ci && npm run build && npm test`). That check proves the LF hash survives git normalisation.

### Wave 0 Gaps
- [ ] `tests/data.test.mjs`: fixtures for DATA-01, 03, 04, 05, 06 (build fixtures in `os.tmpdir()` by copying `data/raw` and mutating one byte; build JSON fixtures inline by cloning the real results with `structuredClone`)
- [ ] `tests/honesty.test.mjs`: `lintHtml` fixtures (DATA-02, DATA-07) + real-dist scan
- [ ] `tests/preview.test.mjs`: dist assertions for `/preview/index.html` (IMG-03, UI-02, UI-03, noindex)
- [ ] `tests/preview.spec.ts`: Playwright UI-01, UI-04..07 + axe
- No framework install needed.

## Security Domain (ASVS L1, static site)

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | static site, no accounts |
| V3 Session Management | no | no sessions |
| V4 Access Control | no | public content; `/preview/` is noindex, not secret |
| V5 Input Validation / Output Encoding | yes | Inputs are committed CSVs: `Number.isFinite` on every cell, zod on the whole object. Astro escapes `{expr}` by default. **Never use `set:html`** for data or captions. |
| V6 Cryptography | minimal | sha256 via `node:crypto` for integrity pinning only (not a security control against a malicious committer) |
| V14 Configuration | yes | Existing `public/_headers` (`nosniff`, referrer policy, immutable `/_astro/*`); add `X-Robots-Tag: noindex` for `/preview/*`; no new dependencies (supply chain unchanged) |

### Known Threat Patterns
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Tampered result data (edited CSV or JSON) | Tampering | Upstream-pinned sha256 + re-ingest equality, both failing the build |
| Misleading claims (untagged or mis-tagged numbers) | Repudiation / integrity of claims | zod tier rules, `requireTagged`, dist lint |
| XSS via data strings | Tampering | Astro auto-escaping; no `set:html`; no client JS |
| External link reverse-tabnabbing | Tampering | GitHub source links open in the same tab (no `target=_blank`); if `_blank` is used, add `rel="noopener"` |

## Sources

### Primary (HIGH confidence)
- `node_modules/astro/package.json` (7.3.5; `./zod` export; zod ^4.5.4 dep; sharp optionalDependency), `node_modules/astro/dist/zod.js`, `node_modules/zod/package.json` (4.6.5)
- `node_modules/astro/components/Picture.astro` (formats, fallbackFormat, default png fallback, width/height from fallback image)
- Scratch spike (Astro 7.3.5, this repo's node_modules): Picture output and dist contents; zod parse failure → build exit 1; integration hook throw → build exit 1; `node --test` importing TS + JSON with attributes; `astro check` 0 errors
- AVOLITE repo clone @ `9b985ca7f8ef99000724f8ce870918a40d0d95c8`: CSV contents, `git ls-files --eol`, LF sha256; raw.githubusercontent hashes identical; PNG dimensions (`file`), visual check of 4 PNGs
- Project files: `tests/*.test.mjs`, `tests/*.spec.ts`, `src/**`, `astro.config.mjs`, `.gitattributes`, `public/_headers`, Phase 1 SUMMARYs, SUMMARY/ARCHITECTURE/DESIGN/FEATURES/PITFALLS research, `AVOLITE_Master_Project_Documentation.md` §23

### Secondary (MEDIUM confidence)
- Adrian Roselli, "Tables, CSS Display Properties, and ARIA": ARIA role restoration for responsive tables (from training knowledge; not re-fetched)

### Tertiary (LOW confidence)
- Plex Mono glyph coverage for geometric shapes (not measured; irrelevant once SVG glyphs are used)

Context7 was not used: every library behaviour was verified directly against the installed `node_modules` source and by running spikes, which is stronger evidence for these pinned versions.

## Plan Shape (for the planner)

| Plan | Wave | Contents | Parallel? |
|---|---|---|---|
| 02-01 Data + honesty gates (TDD) | 1 | `status.ts`, raw CSV (LF), `ingest.mjs` + manifest pins + `data:ingest` script, `results.json`, `data/claims.json`, `data.ts` (validate, derive, metric, fmt, requireTagged), `honesty.mjs`, inline integration in `astro.config.mjs`, `site.ts` REPO consts, `tests/data.test.mjs` + `tests/honesty.test.mjs` | — |
| 02-02 Primitives + images + preview | 2 (needs `status.ts`, `data.ts` types) | `--plate` token, 8 ui components, PNG copy to `src/assets/repo/…`, `figures.ts`, `Base` `noindex` prop, `pages/preview.astro`, `_headers` preview rule, `tests/preview.test.mjs`, `tests/preview.spec.ts` | Can start once 02-01 task 1 (`status.ts` + the `Tagged` type) lands. Same working tree, so run sequentially unless using worktrees. |

An optional third split, if the executor wants smaller units: move 02-02's Figure/PNG/IMG-03 work into its own plan 02-03. It shares only `preview.astro` with 02-02; give each plan its own section of the page to avoid conflicts.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH, read from installed packages; no new dependencies.
- Architecture: HIGH, the build-fail mechanics were exercised in a spike.
- Pitfalls: HIGH for CRLF and Phase 1 test interactions (observed); MEDIUM for the table ARIA note.

**Research date:** 2026-10-01
**Valid until:** 2026-10-31 (pinned versions; upstream commit pinned)
