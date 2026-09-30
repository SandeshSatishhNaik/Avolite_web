---
phase: 01-shell-and-stack
reviewed: 2026-10-01T00:00:00Z
depth: standard
files_reviewed: 30
files_reviewed_list:
  - .gitattributes
  - .gitignore
  - .node-version
  - astro.config.mjs
  - package.json
  - playwright.config.ts
  - public/_headers
  - public/favicon.svg
  - scripts/clean-logo.mjs
  - src/components/ui/Header.astro
  - src/components/ui/Logo.astro
  - src/components/ui/LogoSprite.astro
  - src/components/ui/MobileMenu.astro
  - src/components/ui/SkipLink.astro
  - src/layouts/Base.astro
  - src/lib/site.ts
  - src/pages/index.astro
  - src/scripts/shell.ts
  - src/styles/global.css
  - src/styles/logo.css
  - src/styles/tokens.css
  - tests/axe.spec.ts
  - tests/build.test.mjs
  - tests/config.test.mjs
  - tests/logo.spec.ts
  - tests/logo.test.mjs
  - tests/shell.spec.ts
  - tests/smoke.spec.ts
  - tests/tokens.test.mjs
  - tsconfig.json
findings:
  critical: 0
  warning: 7
  info: 8
  total: 15
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-10-01
**Depth:** standard
**Files Reviewed:** 30
**Status:** issues_found

## Summary

The shell is small and mostly sound. There is no runtime third-party request, no `innerHTML` or `eval`, and the fonts are self-hosted. The scroll-spy logic is correct, and the native-dialog menu and skip link are well built. No critical (security or data-loss) defects were found.

The main problems are these:
- The hand-written fallback for browsers without Invoker Commands is incomplete. It leaves the menu's Close button dead.
- `public/_headers` ships no CSP or framing protection.
- `site` and the canonical URL can silently ship the placeholder domain.
- Some test and engines settings contradict each other.
- The token lint has a gap that lets raw hex in SVG attributes through, which is a stated project rule.

This review adds no structural-findings section because no fallow block was provided.

## Warnings

### WR-01: Menu Close button is dead in browsers without Invoker Commands

**File:** `src/scripts/shell.ts:7` (markup at `src/components/ui/MobileMenu.astro:7`)
**Issue:**
- The fallback only wires the *open* path: `if (!('command' in HTMLButtonElement.prototype)) menuBtn.addEventListener('click', () => menu.showModal())`.
- The Close button uses `command="close" commandfor="menu"` and has no fallback handler.
- On Safari before 26.2 and Firefox before 144, JS opens the sheet but Close does nothing.
- The sheet is full-screen with an opaque backdrop. Touch users have no Escape key, so the only exit is tapping a nav link.
- The e2e suite cannot catch this. It runs Chromium only, and the "JS off" test closes with Escape, not with Close.

**Fix:**
```ts
if (!('command' in HTMLButtonElement.prototype)) {
  menuBtn.addEventListener('click', () => menu.showModal());
  menu.querySelector('[command="close"]')?.addEventListener('click', () => menu.close());
}
```
Alternatively, drop the fallback and accept the Invoker Commands baseline. Then document it, because without the fallback the nav is unreachable below 1024px in those browsers.

### WR-02: `_headers` has no CSP, framing protection or Permissions-Policy

**File:** `public/_headers:1-3`
**Issue:**
- Only `nosniff` and `Referrer-Policy` are set.
- Nothing prevents clickjacking (`frame-ancestors` or `X-Frame-Options`), and there is no CSP.
- For a fully static, self-hosted site, a strict policy is cheap: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'`.
- Two things make a strict CSP hard today:
  - The bundled shell script is currently inlined into the HTML, per the 01-03 summary.
  - `LogoSprite.astro:8` uses an inline `style` attribute.
- Decide this now rather than after Phase 4 adds more scripts.

**Fix:**
- Add `Content-Security-Policy`, `X-Frame-Options: DENY` (or `frame-ancestors`) and `Permissions-Policy: camera=(), microphone=(), geolocation=()` under `/*`.
- Use `vite.build.assetsInlineLimit: 0` (Astro `vite` config) so scripts are emitted as files.
- Move the sprite's `position:absolute` into a CSS class.
- Add a config test that asserts these headers.

### WR-03: Production canonical can silently point at the placeholder or a per-deployment URL

**File:** `astro.config.mjs:9`, `src/layouts/Base.astro:29`
**Issue:**
- `site` falls back to `https://avolite.example`. The build prints no warning, although CLAUDE.md claims it does.
- The canonical is hard-wired to `new URL('/', Astro.site)`.
- If `SITE_URL` is unset in the Cloudflare production environment, the live site declares a canonical on a non-existent domain. That risks de-indexing.
- In the same case, `CF_PAGES_URL` produces a hash URL such as `abc123.project.pages.dev`.
- Using `??` also means an empty `SITE_URL=""` (a common Cloudflare UI state) bypasses the fallbacks and fails `site` URL validation.
- The canonical ignores `Astro.url.pathname`, so it will be wrong for every page added after `/`.

**Fix:**
```js
const site = process.env.SITE_URL || process.env.CF_PAGES_URL || 'https://avolite.example';
if (site === 'https://avolite.example') console.warn('[astro.config] SITE_URL not set: canonical uses the placeholder');
```
In `Base.astro` use `new URL(Astro.url.pathname, Astro.site)`. Consider failing the build when `CF_PAGES_BRANCH === 'main'` and `SITE_URL` is absent.

### WR-04: `npm test` breaks on Node versions that `engines` permits

**File:** `package.json:7`, `tests/build.test.mjs:7`, `tests/config.test.mjs:15`
**Issue:**
- `engines.node` is `>=22.12.0`, and `config.test.mjs` pins that exact string.
- `build.test.mjs` imports `../src/lib/site.ts` directly, which needs Node's native TypeScript stripping. That is unflagged only from Node 22.18 (22.6 to 22.17 need `--experimental-strip-types`).
- On 22.12 to 22.17, `npm test` fails with `ERR_UNKNOWN_FILE_EXTENSION`.
- `.node-version` is 24, so CI and Cloudflare never hit this, but the declared contract is wrong.

**Fix:** Raise `engines.node` to `>=22.18.0` (and update `config.test.mjs`). Alternatively make `site.ts` a plain `.js` module with JSDoc types so that tests and Astro both import it without stripping.

### WR-05: Token lint misses raw hex in SVG and HTML attributes

**File:** `tests/tokens.test.mjs:41`
**Issue:**
- The hex regex requires the `#` to be preceded by `[:(,\s]`.
- `fill="#ff0000"`, `stroke="#abc"` and `stop-color="#..."` are preceded by `"` or `'`, so they are never flagged.
- CLAUDE.md states "SVG colors use tokens or currentColor, never raw hex". Phase 3+ adds many SVG components, and this is exactly where the lint is needed.
- The self-check at lines 66-67 tests only `#built` and `#lg-mark` href values and never asserts that an attribute hex is caught.
- Named colors (`color: red`) and `hwb()`, `lab()`, `oklch()` literals are also unchecked.

**Fix:** Allow `"` and `'` in the lookbehind: `(?<=[:(,\s"'])#([0-9a-fA-F]+)(?![\w-])`. Then skip a match only when it is an in-page anchor, such as `href="#…"` or a `url(#…)` reference. Add a self-check fixture: `assert.ok(scan('<path fill="#ff0000"/>').length > 0)`.

### WR-06: Smoke test permanently ignores favicon errors behind a stale comment

**File:** `tests/smoke.spec.ts:7`
**Issue:**
- `if (msg.location().url.endsWith('/favicon.svg')) return; // favicon arrives in plan 02`.
- The favicon exists now, so the filter only masks a real regression. A broken favicon would never fail the test.
- The other assertion, `toHaveTitle('AVOLITE')`, is fine.

**Fix:** Delete the filter and the comment. The smoke test should fail on any console error.

### WR-07: CLS test is flaky under `fullyParallel` and uses a fixed sleep

**File:** `tests/shell.spec.ts:~137` (the `layoutShift` helper, `waitForTimeout(1000)`), `playwright.config.ts:12`
**Issue:**
- With `fullyParallel: true` and several heavy specs (screenshots, pixel scans, CLS) on one preview server, font load timing varies.
- A fixed 1 s sleep plus a 0.01 threshold can produce false passes (the shift lands after 1 s) and false failures.
- `page.addInitScript` is also registered after `setViewportSize`, which works but depends on call order.

**Fix:** Wait for a deterministic signal (`document.fonts.ready` plus `requestAnimationFrame`). Or run the CLS specs in a serial `test.describe.configure({ mode: 'serial' })` block. Set `retries` and `forbidOnly: !!process.env.CI` in the config.

## Info

### IN-01: No scroll-padding for focus under the sticky header (WCAG 2.4.11)

**File:** `src/styles/global.css:108-119`
**Issue:**
- `scroll-margin-top: var(--header-h)` is set only on sections and the hero.
- Focusable controls in future section content (Phase 3+) will scroll under the 64px sticky header when tabbed to.
- That violates Focus Not Obscured (WCAG 2.2 AA).

**Fix:** Add `html { scroll-padding-top: var(--header-h); }`. It then covers anchors and focus scrolling, and the per-section margins become redundant.

### IN-02: Nav list semantics lost in Safari

**File:** `src/styles/global.css:155-160`, `Header.astro:14`, `MobileMenu.astro:10`
**Issue:** `list-style: none` on `<ol>` makes VoiceOver/Safari drop the list role, so the "8 items" announcement is lost.
**Fix:** Add `role="list"` to both `<ol>` elements.

### IN-03: `aria-current="true"` for in-page section nav

**File:** `src/scripts/shell.ts:30`
**Issue:** The spec-appropriate token for a same-page location indicator is `aria-current="location"`. `true` works but conveys less. Tests and CSS selectors (`[aria-current="true"]`, `global.css:184,269`) pin the value.
**Fix:** Switch to `"location"` and update the CSS and tests together.

### IN-04: Archivo glyph subset is silent on missing characters

**File:** `astro.config.mjs:5`
**Issue:** Headings use Archivo limited to the `DISPLAY_GLYPHS` list. This is a site about angles and signal, and likely heading characters (θ, ≈, ≤, →, é, …) fall back to the system sans. That produces mismatched glyphs in display type with no build signal.
**Fix:**
- Add a test or build-time check that every character in `h1`/`h2`/`h3`/readout text in `dist/*.html` is in `DISPLAY_GLYPHS`.
- Or widen the subset if the budget allows (109 KB of 130 KB is used).

### IN-05: Hard-coded 1024px breakpoint duplicated in CSS and JS

**File:** `src/scripts/shell.ts:13`, `src/styles/global.css:200,211`
**Issue:** The `(min-width:1024px)` query appears in the JS and in two CSS media queries. Changing one without the others breaks the menu-close-on-resize behaviour. CSS custom properties cannot be used in media queries.
**Fix:** Keep the literal but add a comment at each site that names the other locations.

### IN-06: Body scroll-lock removes the scrollbar, causing layout shift

**File:** `src/styles/global.css:275-277`
**Issue:** `body:has(dialog[open]) { overflow: hidden }` makes the scrollbar disappear on desktop browsers with classic scrollbars (narrow window under 1024px). The page behind shifts by about 15px. The mobile touch case is unaffected.
**Fix:** Add `html { scrollbar-gutter: stable; }`.

### IN-07: `.gitignore` lacks env and tool artifacts

**File:** `.gitignore:1-6`
**Issue:**
- `SITE_URL` and `CF_PAGES_URL` are environment-driven and `.env` is not ignored.
- `.wrangler/`, `.DS_Store` and `*.log` are also missing.
- An accidentally committed `.env` is the most likely secret leak for this repo.

**Fix:** Add `.env`, `.env.*`, `.wrangler`, `.DS_Store` and `*.log`. `config.test.mjs` only checks for required lines, so nothing breaks.

### IN-08: Inconsistent `dist` dependency and blind spots in budget tests

**File:** `tests/build.test.mjs:10,~205`, `tests/logo.test.mjs:88`
**Issue:**
- `build.test.mjs` throws at import if `dist/` is missing, but the `logo.test.mjs` dist group silently skips. So `npm test` on a fresh clone has one file failing and one quietly passing.
- The JS budget test sums only emitted `*.js` files. While `shell.ts` is inlined into the HTML, the script is not counted, and the test only begins to cover it once Astro stops inlining it (above 4 KB).
- Smaller points:
  - `playwright.config.ts:6` has a formatting slip (`PORT =process.env`).
  - `Logo.astro` renders nothing visible unless `LogoSprite` is on the same page. That is an implicit coupling the layout currently satisfies.

**Fix:**
- Add `"pretest": "npm run build"` (or make both files skip or fail consistently).
- Also sum `<script type="module">` bodies in the JS budget.
- Document the `Logo` and `LogoSprite` coupling in `Logo.astro`'s header comment.

---

_Reviewed: 2026-10-01_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
