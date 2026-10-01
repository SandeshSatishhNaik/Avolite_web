---
phase: 02-data-and-honesty-system
reviewed: 2026-10-01T00:00:00Z
depth: standard
files_reviewed: 24
files_reviewed_list:
  - astro.config.mjs
  - data/claims.json
  - public/_headers
  - scripts/honesty.mjs
  - scripts/ingest.mjs
  - src/components/ui/Figure.astro
  - src/components/ui/Metric.astro
  - src/components/ui/Placeholder.astro
  - src/components/ui/ResultTable.astro
  - src/components/ui/SectionHeader.astro
  - src/components/ui/StatusLegend.astro
  - src/components/ui/StatusTag.astro
  - src/components/ui/TableDisclosure.astro
  - src/layouts/Base.astro
  - src/lib/data.ts
  - src/lib/figures.ts
  - src/lib/site.ts
  - src/lib/status.ts
  - src/pages/preview.astro
  - src/styles/tokens.css
  - tests/data.test.mjs
  - tests/honesty.test.mjs
  - tests/preview.spec.ts
  - tests/preview.test.mjs
findings:
  critical: 2
  warning: 7
  info: 5
  total: 14
status: issues_found
---

# Phase 2: Code Review Report

**Reviewed:** 2026-10-01
**Depth:** standard
**Files Reviewed:** 24 (binary PNGs, `package.json`, and generated `results.json` content excluded; the generator was reviewed)
**Status:** issues_found

## Summary

The pinned CSV ingest, `verifyRaw` re-ingest equality, the zod tier rules and the `requireIssued` WeakSet are sound for the paths they cover. The weak points are the seams between them. Two claims in the summaries do not hold:

- A hand-edited `data/claims.json` can replace the whole dataset and pass every gate, and the ingest pin and `verifyRaw` do not cover that file (CR-01).
- The AI/ML wording rule cannot fire on the markup the real components emit (CR-02).

Several smaller holes are latent: `null` cells count as zero error, rendered numbers are mutable after issue, PNGs are not hash-pinned, and bare numbers outside `<data>` are never linted.

Verified by running code: CR-01, CR-02, WR-01 (null cell), WR-04 (non-hex sha, empty snr), and the `>`-in-attribute behaviour in IN-01.

## Critical Issues

### CR-01: `claims.json` can override `datasets` and bypass every ingest gate

**File:** `src/lib/data.ts:82` (also `astro.config.mjs:21`, `scripts/ingest.mjs:71`)
**Issue:** `validate({ ...results, ...claims })` lets any top-level key in `data/claims.json` silently replace the same key from `results.json`. `claims.json` is hand-written and is neither pinned nor compared by `verifyRaw`, which only checks `results.json` against the CSV. I confirmed it by running `validate`: I merged in a `datasets` array with `DetectedRange_m = ExpectedRange_m` and all errors 0. It passed zod. The `data` export then serves those fabricated SIMULATED numbers with the real `source.path` and `sha256`. The same applies to `repo`.

This defeats DATA-01 ("hand-edited CSV/JSON fails the build") and DATA-03/05. The only rules still applied to the injected data are the cross-field ones.

**Fix:** Parse the two files with separate schemas and never spread them.
```ts
const Claims = z.object({
  definitions: z.object({ snr: z.string().min(1).nullable() }),
  illustrative: z.array(Illustrative),
}).strict();
const Results = z.object({
  repo: z.object({ slug: z.string(), commit: z.string() }),
  datasets: z.array(Dataset).min(1),
}).strict();
export const validate = (r: unknown, c: unknown) => ({ ...Results.parse(r), ...Claims.parse(c) });
```
Also add a test that `{...results, ...claims, datasets: []}`-style overlap is rejected. Make `Root` `.strict()` as well, since top-level extras are currently stripped silently.

### CR-02: AI/ML-next-to-BUILT/SIMULATED lint never fires on real component markup

**File:** `scripts/honesty.mjs:6,37-41`
**Issue:** `lintHtml` splits the body on block tags and only checks a segment that contains a `data-status="BUILT|SIMULATED"` attribute. `BLOCK` includes `div`, `p`, `figcaption` and so on, so the split discards the `data-status` on block-level wrappers (the `.metric` div). In every real component, claim text and the `StatusTag` span sit in different blocks:

- `Metric`: label `<p>` and tag span are separate segments.
- `Figure`: title `<p>` and `<p class="figure__src">` holding the tag.
- `ResultTable`: caption, then `<p class="rt__src">`.

I ran two fixtures shaped like the real output (`<p>AI detection accuracy</p>` followed by the tag span, and a `figcaption` with "Machine learning classifier output"). Both return `[]`. The unit tests only pass because their fixtures put the text and tag in one `<p>`. DATA-07's AI/ML check is therefore effectively decorative. In addition, `data-status='BUILT'` with single quotes (line 38) is not matched.

**Fix:** Scope by component, not by inline run. Either emit a wrapper that carries both text and tag (`<article data-claim data-status="BUILT">`) and lint that element's full text, or enforce it where claim text is data (zod on `claims.json` text fields, as the research file already planned for Phase 3). Short term, make the wrapper div of Metric, Figure and ResultTable a non-split element and test against the actual `dist/preview/index.html` with an injected "AI" label. Make the attribute regex quote-agnostic: `/data-status\s*=\s*["']?(?:BUILT|SIMULATED)/`.

## Warnings

### WR-01: `null` cells count as zero error in `derive()`

**File:** `src/lib/data.ts:129-133`
**Issue:** The schema allows `null` cells (`z.number().nullable()`), and the error-consistency rule skips any row with a null (`ev != null && dv != null && rv != null`). `derive` then does `Math.abs(num(r, 'RangeError_m'))`, where `num` is just a cast. `Math.abs(null)` is `0`, so a missing error silently lowers the mean and max. I confirmed that a row with null `RangeError_m` and null `DetectedRange_m` validates. The CSV today has no nulls, but the gate exists to stop exactly this class of silent misstatement, and `detected` and `total` would also disagree with the error stats.

**Fix:** Filter to rows where the column is finite before computing stats, and throw if a column has no finite values:
```ts
const vals = (k: string) => rows.map((r) => r[k]).filter((v): v is number => Number.isFinite(v));
```
Alternatively, reject null in the four required columns inside `superRefine`.

### WR-02: Issued tagged values are mutable and caller can override precision

**File:** `src/lib/data.ts:109-113`, `src/components/ui/Metric.astro:15`
**Issue:**
- `issue()` registers the object in the WeakSet but does not freeze it. A page can do `const m = metric(...); m.value = 38.0;` and `requireIssued` still passes, because the identity is the same.
- `Metric` accepts a free `precision` prop that overrides the dataset's own precision (e.g. `precision={0}` displays 0.165 m/s as `0`).
- `data.data.datasets[].rows` is also mutable. The "single choke point" holds for literals but not for mutation.

**Fix:** `Object.freeze` the issued object in `issue()` (and the parsed `data`, shallowly or deeply). Drop the `precision` prop from `Metric`, or clamp it to be at least `t.precision`.

### WR-03: Numbers outside `<data>` and in raster figures are not gated; PNGs are not hash-pinned

**File:** `scripts/honesty.mjs:42`, `src/lib/figures.ts:7-76`
**Issue:**
- DATA-02's dist layer only checks `<data>` elements. Any page author can type "94.2%" or "0.6°" into a `<p>`, a lede, an `alt`, or a `Placeholder` `asset` prop, and no gate notices. The static source-guard test only greps for three specific literals.
- The MATLAB PNGs, which carry baked-in numbers and axes, are only "byte-identical to upstream" by hand. Nothing pins their sha256 the way the CSV is pinned. A swapped or edited PNG ships untouched, and the figure caption still says SIMULATED with a link to the pinned commit.
- `figures.ts` hard-codes `status: 'SIMULATED'` per figure instead of deriving it from a dataset.

**Fix:**
- Add a lint rule that flags a digit-plus-unit pattern (`\d+(\.\d+)?\s*(m|m/s|°|%|dB|dBm|ms|GHz|MHz)\b`) in dist text outside `<data>`, with an explicit allow-list for dates and part numbers. If that is too strict now, add it as a warning that is reported and not fatal.
- Add the PNGs to the ingest manifest with sha256 pins and verify them in `verifyRaw`.

### WR-04: Weak schema checks on pin material and the SNR definition

**File:** `src/lib/data.ts:10,53,73`
**Issue:**
- `sha256: z.string().length(64)` and `commit: z.string().length(40)` accept any 64-character or 40-character string (I confirmed `'z'.repeat(64)` passes).
- `definitions.snr: z.string().nullable()` accepts `''`, which is `!== null`, so it unlocks the SNR-sweep rule while still being a non-definition.
- The SNR rule matches only `/\/SNR_Sweep\//i` on `source.path`. A path like `SNR_Sweep.csv`, `snr-sweep/`, or a backslash path slips through.
- `Root.repo.commit` is never compared with `datasets[].source.commit`.

**Fix:** Use `.regex(/^[0-9a-f]{64}$/)` and `.regex(/^[0-9a-f]{40}$/)`, `snr: z.string().min(1).nullable()`, and test `/snr[_\s-]?sweep/i` against the whole path. Add a `superRefine` equality check between the repo commit and each source commit.

### WR-05: `pruneUnusedPng` deletes originals that only non-scanned file types reference

**File:** `astro.config.mjs:36-44`
**Issue:** The prune only searches `.html`, `.css` and `.js` for the PNG filename. A PNG referenced from a `.json`, `.xml`, `.webmanifest`, `.svg`, `.mjs` or `.txt` file in `dist` (an og image in a sitemap or manifest, a future JSON search index, an SVG `<image>`) is deleted and leaves a dead reference. It also hardcodes `dist/_astro/`, which breaks if `build.assets` is ever changed (the function then returns early and the PNGs ship, so IMG-03 silently regresses). Every file is read into one concatenated string, which is fragile on a larger site. Within this repo's current output I could not find a case that deletes a needed asset, so the risk is latent, not live.

**Fix:** Scan all text file types except images and fonts, using an extension deny-list instead of an allow-list. Better, drop the post-build hack: stop globbing every PNG in `figures.ts` and import only the images pages use (static import inside `Figure` through an explicit map), so there is nothing to prune. If the prune stays, also fail the build when any `.png` remains in `dist/_astro` and add a test that guards it.

### WR-06: `npm test` has inconsistent dist dependencies

**File:** `tests/preview.test.mjs:8-9`, `tests/honesty.test.mjs:310-314`
**Issue:** `preview.test.mjs` throws at import time if `dist/preview/index.html` is absent, so `npm test` on a fresh clone fails with an assertion and no hint. `honesty.test.mjs` skips the real-dist scan when `dist/` is absent. A stale `dist/` from a previous build is accepted by both, so these tests can pass against output that no longer matches the source. `package.json` `test` does not build first.

**Fix:** Make `test` run `astro build` first (`"test": "npm run build && node --test ..."`), or have the dist-dependent files skip with an explicit message rather than throw. Do not rely on a stale `dist/`.

### WR-07: Source-guard tests are brittle string greps and compare computed colours by identity

**File:** `tests/preview.test.mjs:130-136`, `tests/preview.spec.ts:44-48`
**Issue:**
- The "derived values never typed" test only greps for the three literals `0.165`, `0.0995` and `0.100`. Any other derived value (a mean of 0.4, the 5/5 count) is unchecked, and it fails if a component legitimately uses `0.100` in CSS.
- The metric spec asserts `illColor === bodyColor`, which couples the ILLUSTRATIVE metric colour to whatever the body colour happens to be. A global colour change fails an unrelated metric test.
- `Figure never filters` greps for the substring `filter`/`opacity`, so a comment containing either word fails it.

**Fix:** Assert the intended token (`getComputedStyle` equals the resolved `--text-2` value). Replace the literal grep with a check that no `<data>` is authored in `.astro` source outside `Metric` and `ResultTable`, which is the actual invariant.

## Info

### IN-01: `text()` strips tags with `[^>]+`, so `>` inside an attribute truncates the tag

**File:** `scripts/honesty.mjs:14`
**Issue:** `<p title="a > b live">x</p>` yields a hit, but only because the leaked tail `b live">` is read as text. The conservative direction here is a false positive, not a false negative: an attribute value containing `>` can make attribute text appear as visible text. Unquoted attribute values (`alt=Live`) are not matched by `ATTR`, so a hit in one is missed. Astro always quotes attributes today, so the practical risk is low.
**Fix:** Use a tag regex that skips quoted values: `/<(?:[^>"']|"[^"]*"|'[^']*')*>/g`.

### IN-02: `ingest.mjs` numeric parsing is looser than it looks

**File:** `scripts/ingest.mjs:48-50`
**Issue:** `v === '' ? null : Number(v)` treats `' '` as `0`, `'0x10'` as `16` and `'1e3'` as `1000`. The CSV is hash-pinned, so this is only reachable on a re-pin. A row with more cells than headers also writes a key literally named `undefined`.
**Fix:** Validate each cell with `/^-?\d+(\.\d+)?$/` and throw on a column-count mismatch.

### IN-03: `SectionHeader` uppercases with JS and duplicates the heading for screen readers

**File:** `src/components/ui/SectionHeader.astro:13`
**Issue:** `title.toUpperCase()` stores shouted text in the DOM, and some screen readers read all-caps as acronyms. The eyebrow `<p>` followed by the `<h2>` announces the title twice.
**Fix:** Keep sentence case in the DOM with `text-transform: uppercase` in CSS, and consider `aria-hidden="true"` on the eyebrow when it only repeats the heading.

### IN-04: Illustrative values hard-code `precision: 0`, and `Tnull` can render

**File:** `src/lib/data.ts:176`, `src/components/ui/ResultTable.astro:17`
**Issue:** `illustrative()` always uses `precision: 0`, so a future illustrative value such as `0.5` is shown rounded with no schema hook to change it. `ResultTable` builds an identifier cell as `` `T${v}` `` and renders `Tnull` if an identifier cell is null.
**Fix:** Add an optional `precision` to the `Illustrative` schema, and throw or render an em dash for a null identifier.

### IN-05: Preview page ships to production with a canonical link, and Figure alt text is very long

**File:** `src/layouts/Base.astro:32`, `src/lib/figures.ts:17-72`
**Issue:**
- A `noindex` page also emits a `rel=canonical` link, which sends mixed signals to crawlers. The page is public and carries the illustrative -92 dBm value. CLAUDE.md says not to invent dB values; the source is flagged as illustrative, but it is still a shipped number.
- Figure alt texts run 200-330 characters. They carry no numbers, as intended, but they exceed common guidance of about 150 characters, and the same description is not repeated in a long-description affordance. The tables via "View as table" cover the numbers, so this is not blocking.
**Fix:** Skip the canonical link when `noindex` is set. Consider excluding `/preview/` from production builds, for example behind an env flag. Shorten the alt text and keep the detail in the figure caption.

---

_Reviewed: 2026-10-01_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
