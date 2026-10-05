---
phase: implemented-phases-01-and-02
reviewed: 2026-10-01T12:38:02Z
depth: standard
files_reviewed: 40
files_reviewed_list:
  - src/lib/data.ts
  - src/lib/figures.ts
  - src/lib/site.ts
  - src/lib/status.ts
  - src/scripts/shell.ts
  - scripts/clean-logo.mjs
  - scripts/honesty.mjs
  - scripts/ingest.mjs
  - src/components/ui/Figure.astro
  - src/components/ui/Header.astro
  - src/components/ui/Logo.astro
  - src/components/ui/LogoSprite.astro
  - src/components/ui/Metric.astro
  - src/components/ui/MobileMenu.astro
  - src/components/ui/Placeholder.astro
  - src/components/ui/ResultTable.astro
  - src/components/ui/SectionHeader.astro
  - src/components/ui/SkipLink.astro
  - src/components/ui/StatusLegend.astro
  - src/components/ui/StatusTag.astro
  - src/components/ui/TableDisclosure.astro
  - src/layouts/Base.astro
  - src/pages/index.astro
  - src/pages/preview.astro
  - tests/build.test.mjs
  - tests/config.test.mjs
  - tests/data.test.mjs
  - tests/honesty.test.mjs
  - tests/logo.test.mjs
  - tests/preview.test.mjs
  - tests/tokens.test.mjs
  - tests/axe.spec.ts
  - tests/logo.spec.ts
  - tests/preview.spec.ts
  - tests/shell.spec.ts
  - tests/smoke.spec.ts
  - astro.config.mjs
  - package.json
  - playwright.config.ts
  - public/_headers
findings:
  critical: 0
  warning: 4
  info: 0
  total: 4
status: issues_found
---

# Implemented code audit

## Narrative Findings (AI reviewer)

The current implementation covers the Astro shell and Phase 2 data/UI primitives. The home page still deliberately contains section stubs; missing Phase 3 content is pending work, not a regression in the completed scope. Review found four warnings concerning status validation, wording checks and navigation. Bare prose-number coverage is already documented Phase 3 debt, not a newly discovered Phase 2 regression. No release blocker or exploitable security vulnerability was established in this static implementation.

### WR-04 — WARNING: Output status validation is incomplete; prose-number coverage is accepted Phase 3 debt

**File:** `E:/Avolite_web/scripts/honesty.mjs:77`

**Issue:** The output check accepts any attribute named `data-status`, including an invalid or empty value. The newly observed gap is that raw `<data>` markup can carry `data-status=WRONG` and pass the output gate. `requireIssued()` and StatusTag already protect the current component path; this is a robustness warning for additional markup, not evidence of incorrect existing metrics.

**Accepted deferral:** `.planning/phases/02-data-and-honesty-system/02-VERIFICATION.md:92` explicitly records the bare plain-text-number ceiling as informational and assigns claim-scoped checks to Phase 3. `.planning/phases/03-all-sections-static-ship-point/03-01-PLAN.md:34` and `:47` schedule `tests/numbers.test.mjs` with an explicit identifier allowlist. The plain-text counterexample below confirms that known launch gap; it does not invalidate Phase 2 acceptance.

**Verified reproduction:** Calling the actual `lintHtml()` returns `[]` for both:

```html
<p>Detection accuracy 99.9%</p>
<data value=99.9 data-status=WRONG>99.9%</data>
```

**Impact boundary:** No fabricated result or invalid rendered status was found in the current built pages. The current issued-component data path works; broader output protection remains incomplete.

**Fix:** Validate `<data>` status values against `STATUS_IDS` and add invalid/empty-status fixtures. Continue the already-planned Phase 3 `numbers.test.mjs` work for prose coverage, with its explicit identifier allowlist, before launch. No new parallel numerical-validation subsystem is needed.

### WR-01 — WARNING: Wording checks do not normalize the text browsers display

**Files:** `E:/Avolite_web/scripts/honesty.mjs:47`, `E:/Avolite_web/scripts/honesty.mjs:63`

**Issue:** `text()` decodes only two nonbreaking-space forms, and the AI/ML abbreviation regex is case-sensitive. Visible forbidden wording therefore passes when it contains numeric HTML references or lowercase abbreviations. This weakens the completed DATA-07 gate without requiring JavaScript or raw HTML injection.

**Verified reproduction:** Both inputs return `[]` from `lintHtml()`:

```html
<p>Li&#118;e radar</p>
<div data-claim><p>ai detector</p><span data-status=BUILT>BUILT</span></div>
```

The first renders as “Live radar”; the second labels an AI detector BUILT.

**Fix:** Decode HTML character references before checking visible text and use case-insensitive abbreviation matching. Add encoded text/attribute and lowercase abbreviation fixtures alongside the existing positive fixtures.

### WR-02 — WARNING: Shared header navigation breaks on the component preview

**Files:** `E:/Avolite_web/src/components/ui/Header.astro:9`, `E:/Avolite_web/src/components/ui/Header.astro:17`, `E:/Avolite_web/src/components/ui/MobileMenu.astro:13`

**Issue:** Base renders the same header on `/` and `/preview/`, but its brand and section links are fragment-only. The preview contains none of `top`, `problem`, `how`, `built`, `new`, `demo`, `security`, `roadmap`, or `why`. Clicking its home logo or section navigation changes the preview fragment instead of going home or reaching a section.

**Evidence:** `src/layouts/Base.astro` unconditionally renders Header. `src/pages/preview.astro` uses Base and only supplies preview-specific section IDs. Existing preview tests check primitives and axe, not header destinations.

**Fix:** On non-home routes use `/#top` and `/#<section>` (or make the header accept a home prefix). Preserve `#<section>` on home if desired. Add one preview-to-home navigation assertion covering the shared link generation.

### WR-03 — WARNING: JS-off menu links leave the full-screen modal open

**Files:** `E:/Avolite_web/src/components/ui/MobileMenu.astro:13`, `E:/Avolite_web/src/scripts/shell.ts:12`

**Issue:** Native commands let the mobile dialog open without JavaScript, but its links depend on the shell click handler to close it. With JavaScript disabled, selecting a section changes the fragment while the full-screen dialog stays open and the main document remains inert. The user must discover and use Close or Escape after every selection. The JS-off test checks only opening and Escape, so it misses this navigation path.

**Verified reproduction:** Chromium, JavaScript disabled, 390×800 viewport, current built HTML: open Menu, click Built. Result: URL ends in `#built`, `dialog[open]` still exists and the dialog remains visible. Reproduction used an ephemeral route serving the built HTML, without changing source.

**Fix:** Provide a functional JS-off navigation path, such as a visible `<noscript>` section list and hiding the modal opener in that mode. Keep the enhanced dialog for JavaScript-enabled users. Extend the JS-off check to select a section and verify that its content is accessible afterward.

## Validation performed

- Fresh `npm run build`: passed; generated `/` and `/preview/`.
- `npm run check`: 39 files, zero errors, warnings or hints.
- `npm test` after fresh build: 99 passed, zero skipped.
- Existing `npm run test:e2e -- --workers=2 --max-failures=3`: 32/32 Chromium tests passed, including axe, skip link, dialog, scroll-spy, responsive header, reduced motion and JS-off open/Escape checks.
- Four minimal linter counterexamples above reproduced against the real exported function.
- JS-off link-selection counterexample reproduced separately in Chromium.
- Initial sandbox run could not spawn Chromium (`EPERM`); the authorized unsandboxed rerun passed. Astro telemetry was disabled for checks to avoid writing to the protected user configuration directory.

## Limits and pending scope

- Firefox and WebKit were not run; current Playwright configuration defines Chromium only. Cross-browser completion belongs to the outstanding QA phase.
- No completed Phase 3 content exists to audit. No redesign, source fixes, configuration changes, deployment or commits were performed.
- Build uses the documented placeholder canonical URL when `SITE_URL` and `CF_PAGES_URL` are absent; production configuration remains a launch check.
- Existing dependency installations and cached fonts were used; this was not a clean-clone/network dependency audit.
- No structural/fallow findings were supplied. `graphify-out/graph.json` was absent. No project-local skills directories were present.
- The saved artifact uses the available patch tool because no dedicated Write tool is exposed in this session.

_Reviewer: Codex (gsd-code-reviewer); standard review with targeted cross-file tracing._
