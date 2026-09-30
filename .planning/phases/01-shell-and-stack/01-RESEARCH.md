# Phase 1: Shell and stack - Research

**Researched:** 2026-09-30
**Domain:** Astro 7 static scaffold, design tokens, self-hosted fonts, SVG logo cleanup, sticky nav + native-dialog mobile menu, scroll-spy
**Confidence:** HIGH (every load-bearing claim below was executed in a throwaway spike project in `%TEMP%\spike`: real `astro build`, `astro check`, Playwright Chromium tests, axe, font byte counts, logo render screenshots)

<user_constraints>
## User Constraints (from CONTEXT.md)

No `01-CONTEXT.md` exists for this phase (phase dir was empty; `/gsd:discuss-phase` was not run). Constraints come from the orchestrator brief, `ROADMAP.md`, `research/SUMMARY.md` (authoritative) and `research/DESIGN.md`. There are no locked decisions, discretion areas or deferred ideas from CONTEXT.md.

Binding inputs treated as locked:
- Stack: Astro 7 static, TypeScript **6** (not 7), plain CSS custom properties, no Tailwind, no UI framework, no GSAP in Phase 1, Astro Fonts API (no Fontsource), `.node-version` = 24.
- 8 numbered sections + unnumbered hero + footer (NOT 9 sections). Header nav `01`-`08`. Mobile menu is a native `<dialog>`/popover with one-line subtitles.
- DESIGN.md tokens win over the old CLAUDE.md tokens (CLAUDE.md is out of date and not binding for stack/tokens; its accessibility/no-shadow/SVG-color/Logo-component/never-hand-edit-path-data rules are honored).
- Deadline 2026-10-02; keep Phase 1 small.

Deferred (OUT OF SCOPE for Phase 1): hero content (SHELL-04), footer (SHELL-05), status tags/legend, data layer, any section copy, GSAP/motion, Lighthouse/cross-browser QA, deploy.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FND-01 | Static Astro 7 + TS + plain CSS; `npm run build` produces `dist/` for Cloudflare Pages (`.node-version` = 24) | Stack table, scaffold files, Cloudflare section; spike built clean with astro 7.3.5 + TS 6.0.3 |
| FND-02 | Tokens (color, type, spacing, radii, motion) in one file, used everywhere | `tokens.css` contents + grep-based enforcement test |
| FND-03 | Fonts self-hosted via Astro Fonts API, metric-matched fallbacks, within 130 KB | Verified font config: 109,256 B total only with the `glyphs` subset on Archivo (140,388 B without) |
| FND-05 | Cleaned logo (bg path removed, `viewBox` added), one Logo component, reversed variant | Verified `clean-logo.mjs` + `Logo.astro` + sprite; rendered and inspected |
| SHELL-01 | Sticky header, logo, numbered links 01-08, highlight section in view | `site.ts` SECTIONS[], IntersectionObserver active-set pattern (tested) |
| SHELL-02 | Mobile menu (native dialog/popover), 8 sections with subtitles, traps focus | `<dialog>` + `showModal()` via Invoker Commands; popover does NOT trap focus (MDN) |
| SHELL-03 | Skip link to main content | Skip link + `<main id="main" tabindex="-1">` (tested) |
</phase_requirements>

## Summary

Phase 1 is small and low-risk because every moving part was proven in a spike. The scaffold is hand-written (no `create-astro`): `package.json` + `astro.config.mjs` + `tsconfig.json` + 3 layout/page files builds in about 7 s with Astro `7.3.5` and TypeScript `6.0.3`; `astro check` reports 0 errors with `@astrojs/check@0.9.10`. The Fonts API works with the Google provider, generates metric-matched Arial/Courier fallbacks with `size-adjust`/`ascent-override`, preloads via `<Font preload />`, and self-hosts files into `dist/_astro/fonts/` (no googleapis/gstatic reference in output).

Three findings change what earlier research assumed. (1) **The 130 KB font budget is only met with a glyph subset on Archivo.** Google serves the full Archivo file (~90 KB) whenever the `wdth` axis is requested, regardless of the range asked. Total fonts were 140,388 B unsubsetted and 109,256 B with `options.experimental.glyphs` limited to Basic Latin plus a few punctuation marks. (2) **The supplied logo's lockup is unreadable at header height.** The wordmark letters are about 9 px tall at 44 px lockup height. Split the clean output into `mark` and `wordmark` groups and set them side by side in the header (mark 36 px, wordmark 14 px tall, verified legible). The white `#FBFCFC` path is the counter of the letter "O", not a second background: deleting it fills the O solid, so it must be merged into the O as an `evenodd` hole. (3) **Native `<dialog>` + `showModal()` is the right mobile menu** (focus containment, Esc, inert page, focus return are all built in; `popover` explicitly does not trap focus). With Invoker Commands (`command="show-modal" commandfor="menu"`, Baseline "newly available" since Dec 2025) it even opens with JS disabled. Tested in Chromium only; Firefox/WebKit are Phase 6.

**Primary recommendation:** Build Phase 1 as three small plans: (01) scaffold + tokens + fonts + Base layout + Cloudflare files; (02) logo cleanup script + Logo component; (03) header/nav/mobile menu/skip link/scroll-spy + 8 section stubs + Playwright shell spec. Use the verified code in this document as the starting point.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Static page, 8 section anchors, nav markup | Build time (Astro SSG) | - | `SECTIONS[]` in `site.ts` drives nav, menu and section ids at build; ships as plain HTML |
| Design tokens | CDN / Static (CSS) | - | One `tokens.css` imported by the layout; no JS |
| Font files + preload + fallbacks | Build time (Fonts API) | CDN / Static | Downloaded at build, emitted to `/_astro/fonts/`, long-cache via `_headers` |
| Logo SVG | Build time (generated JSON -> inline SVG) | - | One-off script; sprite emitted once per page; colors via CSS vars |
| Mobile menu open/close, focus containment, Esc | Browser (native `<dialog>`) | Browser JS (fallback, link-close, resize-close) | Platform does the hard parts; JS is about 10 lines |
| Scroll-spy (`aria-current`) | Browser JS (IntersectionObserver) | - | Needs viewport geometry; progressive enhancement over working anchor links |
| Skip link, anchor jumping, sticky header | Browser (HTML/CSS) | - | No JS needed |
| Cloudflare Node version, headers, site URL | Hosting config (`.node-version`, `public/_headers`, env) | - | Pages build image defaults to Node 22.16 |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | **7.3.5** (exact pin, no caret) | SSG, Fonts API, `<Font />` | Project decision. Exact pin because `fonts[].options.experimental.*` is used and experimental options can change in minors. `[VERIFIED: npm registry, published 2026-09-24]` |
| `typescript` | **^6.0.3** | Types, `astro check` | `npm i typescript` now installs 7.0.2, which violates `@astrojs/check`'s `^5 \|\| ^6` peer range. `[VERIFIED: npm view @astrojs/check peerDependencies]` |
| `@astrojs/check` | ^0.9.10 | `astro check` | Needs TS 5/6. Spike: 0 errors on TS 6.0.3. `[VERIFIED: npm + spike run]` |

### Supporting (dev)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@playwright/test` | ^1.63.0 | Shell interaction tests (skip link, scroll-spy, menu focus trap) | Phase 1: Chromium only. Phase 6 adds Firefox/WebKit. `[VERIFIED: npm registry]` |
| `@axe-core/playwright` | ^4.13.0 | a11y smoke (0 violations in spike) | One test, tags `wcag2a, wcag2aa, wcag22aa`. `[VERIFIED: npm registry]` |

No runtime dependencies beyond `astro`. `astro/zod` exists (`astro@7.3.5` exports `./zod` -> `./dist/zod.js`, bundles zod 4.6.5) but **Phase 1 does not need it**; it is for Phase 2. `[VERIFIED: spike import]`

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-written scaffold | `npm create astro@latest` | Interactive prompts and template drift; the spike proves 6 files suffice |
| `<dialog>` menu | `popover` attribute | Popover does not trap focus or make the page inert (MDN). Requirement says "traps focus". Reject |
| Archivo with `wdth` + glyph subset | Drop `wdth` axis (wght 600..700 only, ~35 KB) | Safe fallback if the experimental `glyphs` option breaks; loses the expanded-heading look that DESIGN.md makes central |

**Installation:**
```bash
npm init -y   # then edit package.json: "type":"module", scripts, engines
npm install astro@7.3.5 --save-exact
npm install -D typescript@^6.0.3 @astrojs/check@^0.9.10 @playwright/test@^1.63.0 @axe-core/playwright@^4.13.0
npx playwright install chromium
echo 24 > .node-version
```

**Version verification (2026-09-30):** astro 7.3.5, typescript 7.0.2 (do not use) / 6.0.3, @astrojs/check 0.9.10, @playwright/test 1.63.0, @axe-core/playwright 4.13.0. `astro` engines `node >=22.12.0`. Local Node 24.21.0, npm 11.19.0.

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| astro | npm | long-established (framework named in Context7 `/withastro/docs`) | not measured | github.com/withastro/astro | [OK] | Approved |
| typescript | npm | long-established | not measured | github.com/microsoft/TypeScript | [OK] | Approved (pin ^6) |
| @astrojs/check | npm | official Astro package | not measured | github.com/withastro/astro | [OK] | Approved |
| @playwright/test | npm | long-established | not measured | github.com/microsoft/playwright | [OK] | Approved |
| @axe-core/playwright | npm | long-established | not measured | github.com/dequelabs/axe-core-npm | [OK] | Approved |

slopcheck 0.6.1 (`python -m slopcheck scan`) reported 5 OK. `npm view <pkg> scripts.postinstall` is empty for all five. A transitive `esbuild@0.28.2` has a postinstall; npm 11.19 prints an `install-scripts ... not yet covered by allowScripts` warning but install and build succeed (binary comes from optional deps). Age/download counts were not measured this session; the names come from the project's own STACK.md research and official Astro/Playwright docs, not from search results.

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```
 BUILD (node 24, Cloudflare or local)                              BROWSER
 logo.svg (VTracer) --scripts/clean-logo.mjs (one-off, committed output)--> src/lib/logo.generated.json
 astro.config.mjs fonts[] --Google provider (network at build, cached in node_modules/.astro/fonts)--> dist/_astro/fonts/*.woff2
                                                                    |
 src/lib/site.ts SECTIONS[] -----------+----------------------------+-----------------------------+
   (id, n, title, short, subtitle)     |                            |                             |
                                       v                            v                             v
 styles/tokens.css + global.css --> layouts/Base.astro --> <Header> nav (short labels)     pages/index.astro
 <Font preload> x3 -> @font-face +       <LogoSprite/> once       <dialog#menu> (full titles      hero stub (h1) +
 size-adjust fallbacks                   skip link, <main>         + subtitles)                   8 x <section id=...>
                                                   \__________ one hoisted module script ________/
                                                    scripts/shell.ts: menu fallback + link-close + resize-close,
                                                    IntersectionObserver -> aria-current on nav links
 Output: dist/index.html + dist/_astro/{fonts,*.css,*.js} + _headers
   no JS: anchors, skip link, dialog (Invoker Commands) still work; JS on: scroll-spy highlight
```

### Recommended Project Structure
```
.node-version                  # 24
.gitignore                     # node_modules dist .astro graphify-out test-results playwright-report
package.json / package-lock.json (commit lockfile: CI uses npm ci)
astro.config.mjs  tsconfig.json  playwright.config.ts
public/
  _headers                     # /_astro/* immutable cache
  favicon.svg                  # generated by clean-logo.mjs (mark, baked colors, on --bg-0)
scripts/clean-logo.mjs         # logo.svg -> src/lib/logo.generated.json (+ public/favicon.svg)
src/
  lib/site.ts                  # SECTIONS[], REPO_URL
  lib/logo.generated.json      # GENERATED, never hand-edit
  styles/tokens.css global.css
  layouts/Base.astro
  components/ui/ Logo.astro LogoSprite.astro Header.astro MobileMenu.astro SkipLink.astro
  scripts/shell.ts             # must end with `export {}` or be a module (see Pitfall 4)
  pages/index.astro
tests/ build.test.mjs (node --test) shell.spec.ts (Playwright) axe.spec.ts
```
Header/MobileMenu/SkipLink may be one file; split only if it reads better. Keep `Logo.astro` as the sole entry point for the logo.

### Pattern 1: Astro Fonts API, three families (VERIFIED by build)
```js
// astro.config.mjs  Source: docs.astro.build Fonts API + spike build (109,256 B total)
import { defineConfig, fontProviders } from 'astro/config';
// Archivo is display/readout only: Basic Latin + a few marks is enough. Without this the file is ~90 KB and total is 140 KB (> 130 KB).
const DISPLAY_GLYPHS = [...' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz·—–’“”°±×'];
export default defineConfig({
  site: process.env.SITE_URL ?? process.env.CF_PAGES_URL ?? 'https://avolite.example',
  fonts: [
    { provider: fontProviders.google(), name: 'Archivo', cssVariable: '--font-display',
      weights: ['500 700'], styles: ['normal'], subsets: ['latin'], fallbacks: ['sans-serif'],
      options: { experimental: { variableAxis: { wdth: [['100', '125']] }, glyphs: DISPLAY_GLYPHS } } },
    { provider: fontProviders.google(), name: 'IBM Plex Sans', cssVariable: '--font-body',
      weights: ['400 700'], styles: ['normal'], subsets: ['latin'], fallbacks: ['sans-serif'] },
    { provider: fontProviders.google(), name: 'IBM Plex Mono', cssVariable: '--font-mono',
      weights: [400], styles: ['normal'], subsets: ['latin'], fallbacks: ['monospace'] },
  ],
});
```
Measured output: Archivo 58,964 B (emits `font-weight:500 700; font-stretch:100% 125%`), Plex Sans 40,240 B, Plex Mono 10,052 B. Generated fallbacks: `size-adjust:102.2878%` etc. on Arial; Courier New for mono. Layout usage:
```astro
---
import { Font } from 'astro:assets';
---
<head>
  <Font cssVariable="--font-display" preload />
  <Font cssVariable="--font-body" preload />
  <Font cssVariable="--font-mono" />
</head>
```
CSS: `h1{font-family:var(--font-display);font-stretch:118%;font-weight:620}` (`font-stretch` percentage works because Astro emits the `100% 125%` range in `@font-face`). Readouts use `font-stretch:100%`.

### Pattern 2: SECTIONS[] single source of truth
```ts
// src/lib/site.ts
export const SECTIONS = [
  { id: 'problem',  n: '01', title: 'The problem',   short: 'Problem',  subtitle: 'What PS 26055 asks for' },
  { id: 'how',      n: '02', title: 'How it works',  short: 'How',      subtitle: 'The closed loop, stage by stage' },
  { id: 'built',    n: '03', title: 'What we built', short: 'Built',    subtitle: 'The simulated radar testbed' },
  { id: 'new',      n: '04', title: "What's new",    short: 'New',      subtitle: 'Two decisions, designed' },
  { id: 'demo',     n: '05', title: 'Demo',          short: 'Demo',     subtitle: 'Watch and explore' },
  { id: 'security', n: '06', title: 'Security',      short: 'Security', subtitle: 'Layered safeguards, by design' },
  { id: 'roadmap',  n: '07', title: 'Roadmap',       short: 'Roadmap',  subtitle: 'From simulation to hardware' },
  { id: 'why',      n: '08', title: 'Why AVOLITE',   short: 'Why',      subtitle: 'The case for adaptive scanning' },
] as const;
```
Titles follow REQUIREMENTS/DESIGN section names; the `subtitle` strings other than 02 are drafts `[ASSUMED]` (02 is DESIGN.md's example). Keep subtitles method-agnostic and free of numbers/claims.

### Pattern 3: Mobile menu = `<dialog>` + Invoker Commands + tiny JS (VERIFIED, Chromium)
```astro
<button class="menu-btn" type="button" command="show-modal" commandfor="menu">Menu</button>
<dialog id="menu" aria-label="Sections">
  <button type="button" command="close" commandfor="menu" autofocus>Close</button>
  <nav aria-label="Sections menu"><ol>{SECTIONS.map((s) => (
    <li><a href={`#${s.id}`}><span class="mono">{s.n}</span> {s.title}<small>{s.subtitle}</small></a></li>))}</ol></nav>
</dialog>
```
`showModal()` semantics (MDN): rest of page inert, Esc closes, focus moves into dialog (use `autofocus`), focus returns to the invoker on close, `::backdrop` available. Invoker Commands: MDN Baseline "Newly available" Dec 2025 `[CITED: developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API]`. In spike, `'command' in HTMLButtonElement.prototype` was true and the dialog opened with JS disabled. `astro check` accepts `command`/`commandfor` on `<button>`.
```ts
// src/scripts/shell.ts
export {};   // makes it a module: a top-level `const opener` otherwise collides with window.opener (TS2451)
const menu = document.querySelector<HTMLDialogElement>('#menu');
const menuBtn = document.querySelector<HTMLButtonElement>('.menu-btn');
if (menu && menuBtn) {
  if (!('command' in HTMLButtonElement.prototype)) menuBtn.addEventListener('click', () => menu.showModal()); // older browsers
  menu.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) menu.close(); });      // link -> close, then hash jump
  matchMedia('(min-width:1024px)').addEventListener('change', (e) => { if (e.matches) menu.close(); });      // rotated/resized while open
}
```
CSS essentials: `dialog#menu{inset:0;width:100%;max-width:none;height:100%;max-height:none;margin:0;border:0;background:var(--bg-0);color:var(--text-1)}` (the UA default `max-width/height: calc(100% - 6px - 2em)` and `margin:auto` must be overridden for a full-height sheet) and `body:has(dialog[open]){overflow:hidden}` (modal dialogs do not lock body scroll).

### Pattern 4: Scroll-spy with an active set (VERIFIED, Chromium)
```ts
const links = [...document.querySelectorAll<HTMLAnchorElement>('.site-nav a, #menu a')];
const secs = [...document.querySelectorAll<HTMLElement>('main section[id]')];  // the 8 sections only; hero stub is not observed
const inBand = new Set<string>();
const io = new IntersectionObserver((entries) => {
  for (const e of entries) e.isIntersecting ? inBand.add(e.target.id) : inBand.delete(e.target.id);
  const active = [...secs].reverse().find((s) => inBand.has(s.id))?.id;   // undefined over the hero -> clears all
  links.forEach((a) => a.getAttribute('href') === `#${active}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
}, { rootMargin: '-40% 0px -55% 0px' });   // 5% tall band at 40-45% of viewport (DESIGN.md)
secs.forEach((s) => io.observe(s));
```
Why an active set: setting only on `isIntersecting` (first spike version) never clears the highlight when scrolling back up over the hero. Update both desktop nav and menu links (`aria-current="true"` per DESIGN.md). CSS: `main>section{scroll-margin-top:var(--header-h)}`, `html{scroll-padding-top:var(--header-h)}`, `@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}`.

### Pattern 5: Logo cleanup and component (VERIFIED by render)

`scripts/clean-logo.mjs` (run once, commit output; never hand-edit `logo.generated.json`). Verified on the real `logo.svg` (52 paths: 1 background `#FDFDFD`, 1 near-white `#FBFCFC` = counter of "O", ~40 green shades, ~10 khaki shades):
```js
// logo.svg (VTracer auto-trace) -> src/lib/logo.generated.json
// drops #FDFDFD bg; #FBFCFC (counter of "O") becomes an evenodd hole in its letter; ~50 fills -> green/khaki roles;
// translate() baked to absolute coords (1 decimal); split into mark (minY < 560) and wordmark
import { readFileSync, writeFileSync } from 'node:fs';
const [src = 'logo.svg', out = 'src/lib/logo.generated.json'] = process.argv.slice(2);
const re = /<path d="([^"]*)" fill="#([0-9a-fA-F]{6})" transform="translate\(([-\d.]+),([-\d.]+)\)"\/>/g;
const paths = [...readFileSync(src, 'utf8').matchAll(re)].map(([, d, hex, tx, ty]) => ({ d, hex: hex.toLowerCase(), tx: +tx, ty: +ty }));
if (paths.length < 40) throw new Error(`expected ~52 paths, got ${paths.length}`);
const rgb = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
const kind = ({ hex }) => { const [r, g, b] = rgb(hex);
  if (r > 240 && g > 240 && b > 240) return hex === 'fdfdfd' ? 'bg' : 'hole';
  return r > g && g > b && r > 150 ? 'khaki' : 'green'; };
const bake = ({ d, tx, ty }) => { let i = 0; return d.replace(/-?\d+\.?\d*/g, (n) => +(+n + (i++ % 2 ? ty : tx)).toFixed(1)).trim(); };
const box = (d) => { const n = d.match(/-?\d+\.?\d*/g).map(Number); const xs = n.filter((_, i) => !(i % 2)), ys = n.filter((_, i) => i % 2);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
const part = () => ({ green: [], khaki: [], holed: [], bb: [1e9, 1e9, -1e9, -1e9] });
const parts = { mark: part(), word: part() }; const holes = [];
for (const p of paths) {
  const k = kind(p); if (k === 'bg') continue;
  const d = bake(p); const b = box(d);
  if (k === 'hole') { holes.push(d); continue; }
  const t = parts[b[1] >= 560 ? 'word' : 'mark']; t[k].push(d);
  t.bb = [Math.min(t.bb[0], b[0]), Math.min(t.bb[1], b[1]), Math.max(t.bb[2], b[2]), Math.max(t.bb[3], b[3])];
}
for (const h of holes) { const [x0, y0, x1, y1] = box(h); let done = false;
  for (const t of Object.values(parts)) { const i = t.green.findIndex((g) => { const c = box(g); return c[0] <= x0 && c[1] <= y0 && c[2] >= x1 && c[3] >= y1; });
    if (i >= 0) { t.holed.push(t.green.splice(i, 1)[0] + ' ' + h); done = true; break; } }
  if (!done) throw new Error('counter path has no containing letter'); }
const pad = 4, vb = (b) => [b[0] - pad, b[1] - pad, b[2] - b[0] + 2 * pad, b[3] - b[1] + 2 * pad].map(Math.round).join(' ');
const all = [parts.mark.bb, parts.word.bb].reduce((a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])]);
const j = { viewBox: { lockup: vb(all), mark: vb(parts.mark.bb), wordmark: vb(parts.word.bb) },
  mark: { green: parts.mark.green.join(' '), khaki: parts.mark.khaki.join(' '), holed: parts.mark.holed.join(' ') },
  wordmark: { green: parts.word.green.join(' '), khaki: parts.word.khaki.join(' '), holed: parts.word.holed.join(' ') } };
writeFileSync(out, JSON.stringify(j));
console.log(j.viewBox);   // spike output: lockup '256 50 1471 671', mark '443 50 1081 492', wordmark '256 571 1471 150' (~37 KB JSON)
```
Sprite (emitted once in `Base.astro`) and component. Do NOT put `viewBox` on both a `<symbol>` and the outer `<svg>` (double mapping clips the art; hit and fixed in spike); use `<g>` defs plus a per-use `<svg viewBox>`:
```astro
---
// LogoSprite.astro
import L from '../../lib/logo.generated.json';
---
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <g id="lg-mark"><path class="lg-g" d={L.mark.green} /><path class="lg-k" d={L.mark.khaki} /></g>
  <g id="lg-word"><path class="lg-g" d={L.wordmark.green} /><path class="lg-g" fill-rule="evenodd" d={L.wordmark.holed} /><path class="lg-k" d={L.wordmark.khaki} /></g>
</defs></svg>
---
// Logo.astro
import L from '../../lib/logo.generated.json';
interface Props { variant?: 'lockup' | 'mark' | 'wordmark'; tone?: 'reversed' | 'color'; label?: string | null }
const { variant = 'lockup', tone = 'reversed', label = 'AVOLITE' } = Astro.props;
const uses = variant === 'lockup' ? ['lg-mark', 'lg-word'] : [variant === 'mark' ? 'lg-mark' : 'lg-word'];
---
<svg class={`logo logo--${variant} logo--${tone}`} viewBox={L.viewBox[variant]} role={label ? 'img' : undefined}
  aria-label={label ?? undefined} aria-hidden={label ? undefined : 'true'}>{uses.map((id) => <use href={`#${id}`} />)}</svg>
```
```css
/* global.css. Selectors inside <use> shadow trees match against the ORIGINAL element's context, so `.logo .lg-g` does NOT work. Use a bare class and let the custom property inherit through <use>. */
.logo{width:auto;display:block;--logo-green:var(--text-1);--logo-khaki:var(--brand-khaki)}  /* reversed default */
.logo--color{--logo-green:var(--brand-green)}
.lg-g{fill:var(--logo-green)} .lg-k{fill:var(--logo-khaki)}
.logo--mark{height:36px} .logo--wordmark{height:14px}
```
Header uses `mark` + `wordmark` side by side (`gap:12px`), one link `aria-label="AVOLITE home"` with both `<Logo label={null}>` (decorative). Full `lockup` is for footer/large areas (Phase 3; at least about 64 px tall to keep the wordmark readable). Token values: `--brand-khaki:#BCAC87` (logo's own, 8.81:1 on bg-0), `--brand-green:#2D4639` (light surfaces only).
`public/favicon.svg`: generate from the same data (mark, baked `#E8EEF6` + `#BCAC87`, square padded, bg `#050B16`) in the same script; hex literals are allowed in `public/` (see enforcement test).

### Anti-Patterns to Avoid
- **`popover` for the menu:** no focus trap, page not inert (MDN). Use `<dialog>`.
- **Setting `aria-current` only when a section enters the band:** never clears over the hero. Use the active set.
- **Observing the hero or footer as sections:** not in `SECTIONS`; keep the observed set to `main section[id]`.
- **Inlining the 37 KB logo path data per use:** emit the sprite once.
- **Hex/rgb literals in components:** all colors via tokens. Use `color-mix(in srgb, var(--bg-0) 92%, transparent)` for the translucent header.
- **A top-level script file with no import/export that declares `opener`, `name`, `status`, `event`, `top`, etc.:** collides with window globals in `astro check`. Add `export {}`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trap, Esc-to-close, inert background, focus return | JS trap loops / `inert` toggling | `<dialog>.showModal()` (via `command="show-modal"`) | Built in; tested: Tab never reaches page content, Esc closes, focus returns to Menu button |
| Font self-hosting, preload, metric-matched fallbacks | Fontsource, manual `@font-face`, manual `size-adjust` math | Astro Fonts API | Generates all three; output verified |
| Skip-link focus target | JS `focus()` on click | `<a href="#main">` + `<main id="main" tabindex="-1">` | Enter moves focus natively (tested) |
| Smooth anchor scrolling | Scroll library (Lenis etc.) | `scroll-behavior:smooth` inside `prefers-reduced-motion: no-preference` + `scroll-margin-top` | Project bans scroll hijacking |
| Logo cleanup by hand | Editing SVG in a GUI | `scripts/clean-logo.mjs` | Repeatable if an original vector arrives; CLAUDE.md forbids hand-editing path data |
| Icons | Icon package | Inline a few SVGs later | Project rule |

**Key insight:** Phase 1 has almost no custom logic. The only code worth testing is the scroll-spy active-set and the logo partition; everything else is platform or framework behavior.

## Runtime State Inventory
Not applicable: greenfield phase (no rename/refactor/migration). Existing repo files (`AVOLITE_*.md/.docx`, `CLAUDE.md`, `logo.svg`, `.planning/`, `.claude/`) must not be deleted; `.gitignore` must not ignore them.

## Common Pitfalls

### Pitfall 1: Fonts blow the 130 KB budget
**What goes wrong:** Archivo with the `wdth` axis is ~90 KB no matter the requested `wght`/`wdth` ranges (Google serves the whole file: 90,104 B for three different range requests). Total 140,388 B.
**Why:** The variable file carries all axes. **Avoid:** `experimental.glyphs` subset (total 109,256 B) and Plex Mono 400 only. **Warning sign:** `dist/_astro/fonts` sum > 133,120 B (130 KiB) or > 130,000 B. Add the byte check to `tests/build.test.mjs`. If `glyphs` ever breaks on an Astro bump, fallback is dropping `wdth` (Archivo wght 600..700 is about 35 KB).

### Pitfall 2: Font swap still shifts headings
**What goes wrong:** The generated Arial fallback is metric-matched for width-100 text, but headings use `font-stretch` 112-125%. The expanded Archivo is wider than any fallback, so a swap can reflow headline lines even with `size-adjust`.
**How to avoid:** Preload the display and body files (`<Font preload />`, same-origin, high priority) so the swap almost never happens visibly; Plex Sans/Mono fallbacks are well matched. Optionally set Archivo `display: 'block'` (no swap, brief invisible heading) or `'optional'` (never swaps). Astro default is `swap`, `display` accepts `auto|block|swap|fallback|optional` `[CITED: Astro configuration-reference font.display]`. `[ASSUMED]` which display value gives the best perceived result; measure with a layout-shift observer under throttling in Phase 6. Phase 1 acceptance: preloads present, fallbacks present, zero layout-shift entries on a normal load.

### Pitfall 3: Google Fonts needs network at build
First `astro build` downloads from Google and caches in `node_modules/.astro/fonts` (dev cache `.astro/fonts`) `[CITED: docs.astro.build/en/guides/fonts]`. `npm ci && npm run build` on a clean clone offline will fail or fall back. Cloudflare's build has network. Note it in the verification step; do not commit font files.

### Pitfall 4: `astro check` TS2451 on script globals
`const opener = ...` at the top level of `src/scripts/shell.ts` failed `astro check` ("Cannot redeclare block-scoped variable 'opener'"). Put `export {}` first. `[VERIFIED: spike]`

### Pitfall 5: `<use>` fill styling does not work with descendant selectors
See Pattern 5: `.logo .lg-g{}` painted the logo black. Use bare `.lg-g{fill:var(--logo-green)}` and set the variable on `.logo`. `[VERIFIED: spike screenshot before/after]`

### Pitfall 6: White counter in the O
Dropping every near-white path makes the O solid. Merge `#FBFCFC` into the containing letter as `fill-rule="evenodd"`. Apply `evenodd` only to that path: applying it to the whole green compound punches holes where small anti-alias edge layers overlap bigger shapes (visible ragged specks in an early spike render). `[VERIFIED: spike renders]`

### Pitfall 7: Lockup unreadable in the header
Lockup at 44 px tall gives ~9 px wordmark letters. Use mark + wordmark horizontally (36 px / 14 px). Check the header at 1024 px: logo about 236 px + eight `01 Problem`-style links must not wrap or overflow; if tight, show numbers only between 1024 and 1279 (`title`/`aria-label` keep the names) or raise the Menu breakpoint. `[ASSUMED]` fit at 1024; measure.

### Pitfall 8: Native dialog focus is not a hard trap
Tabbing past the last control can move focus to browser chrome (document `activeElement` becomes `body`). A naive test "activeElement is inside dialog on every Tab" fails in Chromium. Assert instead that focus is inside the dialog OR on `body`, never on inert page content. `[VERIFIED: spike failed then passed]`

### Pitfall 9: Last section cannot reach the scroll-spy band
Band is 40-45% of viewport height. If the last section is short and nothing follows it, its top can never reach that band and "08" never highlights. Give stubs `min-height: 60vh` or more (Phase 3 adds the footer). Also the highlight flickers through intermediate sections during smooth scroll after a click; acceptable, do not add code for it.

### Pitfall 10: `compressHTML: 'jsx'` whitespace
Astro 7 default strips whitespace like JSX: adjacent inline elements on separate lines lose the space. `{s.n} {s.title}` on one line keeps its space (verified in screenshot); otherwise use CSS `gap` or `{' '}`. `[CITED: docs.astro.build/en/reference/configuration-reference#compresshtml]`. Astro 7's Rust compiler also errors on unclosed non-void tags and no longer repairs invalid nesting (`<div>` inside `<p>`).

### Pitfall 11: Cloudflare Node version
Pages v3 default is Node 22.16.0; `.node-version` (or `NODE_VERSION`) overrides and "any version" is supported `[CITED: developers.cloudflare.com/pages/configuration/build-image/]`. Node 24 is not named in the docs; `[ASSUMED]` works (docs say any version). Astro needs `>=22.12.0`, so even the default would build.

### Pitfall 12: Pushing deploys publicly
Git integration auto-deploys on push to `main`. Phase 1 verifies with `npm run preview` only. Do not push unless the user asks (CLAUDE.md).

## Code Examples

### Base layout skeleton
```astro
---
// src/layouts/Base.astro
import { Font } from 'astro:assets';
import '../styles/tokens.css';
import '../styles/global.css';
import LogoSprite from '../components/ui/LogoSprite.astro';
import Header from '../components/ui/Header.astro';
const { title = 'AVOLITE', description = 'Adaptive smart-scan for electronic support (SIH 2026, PS 26055).' } = Astro.props;
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{title}</title><meta name="description" content={description} />
  <meta name="theme-color" content="#050B16" /><meta name="color-scheme" content="dark" />
  <link rel="canonical" href={new URL('/', Astro.site)} /><link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <Font cssVariable="--font-display" preload /><Font cssVariable="--font-body" preload /><Font cssVariable="--font-mono" />
</head>
<body>
  <LogoSprite />
  <a class="skip" href="#main">Skip to content</a>
  <Header />
  <main id="main" tabindex="-1"><slot /></main>
  <script src="../scripts/shell.ts"></script>
</body>
</html>
```
(`theme-color` hex literal in a meta tag is unavoidable; allow it in the token-lint exemptions or read it from a constant.) Skip link CSS: `.skip{position:absolute;left:8px;top:-100px}` `.skip:focus{top:8px}` with `:focus-visible{outline:2px solid var(--signal);outline-offset:2px}` never removed.

### Page stub
```astro
---
import Base from '../layouts/Base.astro';
import { SECTIONS } from '../lib/site';
---
<Base>
  <section id="top" class="hero-stub"><h1>AVOLITE</h1></section>{/* replaced in Phase 3 (SHELL-04) */}
  {SECTIONS.map((s) => (
    <section id={s.id} aria-labelledby={`${s.id}-h`}><h2 id={`${s.id}-h`}><span class="mono">{s.n}</span> {s.title}</h2></section>
  ))}
</Base>
```
Keep one `<h1>` (axe `page-has-heading-one`) in the hero stub. The hero stub is not in `SECTIONS`, so nothing is highlighted while it is in view.

### tokens.css contents (DESIGN.md values; one file, only place hex literals may live)
Colors: `--bg-0 #050B16`, `--bg-1 #0B1629`, `--bg-2 #12213A`, `--bg-3 #1A2C4B`, `--line #1D3050`, `--line-strong #4D6D99`, `--text-1 #E8EEF6`, `--text-2 #A3B3C9`, `--text-3 #8095B0`, `--signal #3BE4F2`, `--signal-dim #2A9DB0`, `--khaki #C9B98F`, `--error #FF7A7A`, status `--st-built #3DDC97`, `--st-simulated #6FB3FF`, `--st-prototype #F2B84B`, `--st-designed #B99CFF`, `--st-planned #9AA8BA`, `--st-illustrative #C9B98F` (define status tokens now so Phase 2 only consumes them), `--brand-khaki #BCAC87`, `--brand-green #2D4639`.
Type: families `--ff-display/--ff-body/--ff-mono` aliasing the Astro vars; the DESIGN.md scale (`--fs-display clamp(3rem,1.6rem + 4.4vw,6rem)`, h2, h3, lead, body `1.0625rem` with `1.125rem` at >=1280px (QA-03 needs 18 px), small, label, readout XL/M), line-heights, `--tracking-label: .06em`.
Space: 4px scale `--sp-1 .. --sp-12` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192. Radii `--r-panel 4px`, `--r-chip 2px`. Layout `--header-h 64px`, `--frame 1440px`, `--margin 80px / 40px / 16px` by breakpoint.
Motion (defined now, unused until Phase 4): `--dur-instant 120ms`, `--dur-fast 200ms`, `--dur-base 320ms`, `--dur-slow 600ms`, `--dur-stage 1500ms`, `--ease-out cubic-bezier(.16,1,.3,1)`, `--ease-inout cubic-bezier(.65,0,.35,1)`.
`:root{color-scheme:dark}`. No shadows anywhere (elevation = surface + 1px border).

### Cloudflare files
`.node-version`: `24`. `public/_headers` (static responses only; max 100 rules, 2000 chars/line `[CITED: developers.cloudflare.com/pages/configuration/headers/]`):
```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```
Astro preset on Pages: build command `npm run build`, output `dist`; `CF_PAGES_URL` is injected per deployment `[CITED: developers.cloudflare.com/pages/configuration/build-configuration/]`. Do not add a CSP in Phase 1 (Astro inlines small scripts/styles).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Fontsource packages / Google `<link>` | Astro built-in Fonts API (`fonts` in config, `<Font />`) | Stable since Astro 6.0 | Self-hosted, preload, metric-matched fallbacks for free |
| `z` from `astro:content` / `astro:schema` | `import { z } from 'astro/zod'` | Astro 6 | Import path confirmed working in 7.3.5 (Phase 2) |
| `compressHTML: true` | default `'jsx'` | Astro 7.0 | Whitespace between inline elements is stripped |
| Go compiler, tolerant HTML | Rust compiler, strict HTML | Astro 7.0 | Unclosed tags error; invalid nesting not repaired |
| JS focus-trap / `popover` hacks | `<dialog>.showModal()` + Invoker Commands | Baseline newly available Dec 2025 | Menu opens without JS |
| `npm i typescript` | Now installs 7.0.2 | 2026-09 | Pin `^6.0.3` |

**Deprecated/outdated:** `experimental.fonts` (now top-level `fonts`); old CLAUDE.md tokens and 9-section plan.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Menu subtitles for sections 01 and 03-08 (copy drafts) | Pattern 2 | Wording only; user/team may reword. Keep claim-free |
| A2 | Section anchor ids (`problem, how, built, new, demo, security, roadmap, why`) | Pattern 2 | Later phases link to them (PROB-04); changing later breaks links. Decide now |
| A3 | Best Archivo `display` value (`swap` default vs `block`/`optional`) | Pitfall 2 | Some visible heading reflow on slow first load |
| A4 | Header fits at 1024 px with mark + wordmark + 8 `NN Name` links | Pitfall 7 | Overflow; fall back to numbers-only at 1024-1279 |
| A5 | Cloudflare Pages honors `.node-version` `24` | Pitfall 11 | Build falls back to 22.16 (still >= 22.12, still builds) |
| A6 | `experimental.glyphs` stays stable across Astro patch updates | Pattern 1 | Budget check fails; fall back to dropping `wdth` |
| A7 | Menu behavior identical in Firefox and WebKit | Pattern 3 | Only Chromium tested; Phase 6 covers it |
| A8 | Hero `<h1>` stub text "AVOLITE" acceptable until Phase 3 | Code Examples | None; replaced in Phase 3 |

## Open Questions (RESOLVED)

All three resolved by user-approved defaults on 2026-09-30 (see PROJECT.md Key Decisions).

1. **Section ids and subtitles: confirm with user?**
   - RESOLVED: drafts accepted; ids `problem, how, built, new, demo, security, roadmap, why` in one `SECTIONS[]` constant.
   - Known: REQUIREMENTS names the 8 sections; DESIGN gives only the 02 subtitle.
   - Unclear: final wording.
   - Recommendation: ship the drafts in Pattern 2; they live in one array and are cheap to change. Ids are the only thing that is costly to change later.
2. **Logo in the header: mark + wordmark horizontal arrangement**
   - RESOLVED: mark + wordmark side by side in the header; full lockup in the footer (Phase 3).
   - Known: lockup is illegible at header height; the horizontal arrangement is a re-composition of the supplied art (no redrawing).
   - Unclear: whether the team accepts re-arranging the lockup.
   - Recommendation: use it; footer (Phase 3) shows the real lockup at >= 64 px. An original vector from the team would improve edge quality (auto-trace roughness is visible only when zoomed).
3. **Archivo `display` strategy** (see Pitfall 2): decide after a throttled layout-shift measurement; default `swap` with preload is acceptable for Phase 1.
   - RESOLVED: keep `swap` with preloads; switch Archivo to `optional` only if the layout-shift test fails.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | build, tests | yes | 24.21.0 | - |
| npm | install | yes | 11.19.0 | - |
| Git (Git Bash) | repo | yes | - | - |
| Internet to fonts.googleapis.com / gstatic | first `astro build` (font download) | yes (spike built) | - | commit nothing; cache in `node_modules/.astro/fonts` |
| Playwright Chromium | `npm run test:e2e` | yes (installed in spike; shared `%LOCALAPPDATA%\ms-playwright` cache) | Playwright 1.63 | Firefox/WebKit not installed; Phase 6 |
| Python + slopcheck | package audit only | yes | slopcheck 0.6.1 | - |
| Cloudflare account/project | deploy | not needed in Phase 1 | - | local `npm run preview` |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** Firefox and WebKit browsers (Phase 6, `npx playwright install firefox webkit`).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `node --test` (build-output and lint checks, Node 24 imports `.ts` natively without a warning) + Playwright 1.63 Chromium (interaction, axe) + `astro check` |
| Config file | `playwright.config.ts` (Wave 0: webServer `npm run build && npm run preview -- --port 4321`, `baseURL`) |
| Quick run command | `npm run check && npm test` |
| Full suite command | `npm run build && npm test && npm run test:e2e` |

Scripts to add: `"check":"astro check"`, `"test":"node --test tests/*.test.mjs"`, `"test:e2e":"playwright test"`, `"build":"astro build"`, `"dev"`, `"preview"`.

### Phase Requirements -> Test Map

| Req / Success criterion | Behavior | Test Type | Automated Command | File Exists? |
|---|---|---|---|---|
| SC1 / FND-01 | clean clone: `npm ci && npm run build` exits 0, `dist/index.html` exists | smoke (shell) | `rm -rf node_modules dist && npm ci && npm run build && test -f dist/index.html` | Wave 0 |
| SC1 | exactly 8 `<section id>` in SECTIONS order, each with `h2` numbered 01-08 | unit (parse dist) | `node --test tests/build.test.mjs` | Wave 0 |
| FND-01 | `.node-version` is `24`; `package.json` pins `typescript` to `^6`, `astro` exact | unit | `node --test tests/build.test.mjs` | Wave 0 |
| FND-01 | TS/template diagnostics clean | static | `npm run check` | Wave 0 |
| SC5 / FND-03 | 3 `@font-face` families with metric fallbacks (`size-adjust`), 2 `<link rel=preload as=font>`, no `googleapis`/`gstatic` in `dist`, sum of `dist/_astro/fonts/*.woff2` <= 130,000 B | unit (parse dist) | `node --test tests/build.test.mjs` | Wave 0 |
| SC5 / FND-02 | no hex / `rgb(` / `hsl(` literals and no raw `font-family` outside `src/styles/tokens.css` in `src/**/*.{astro,css,ts}` (exempt: `public/**`, the `theme-color` meta, generated logo JSON) | lint (grep) | `node --test tests/tokens.test.mjs` | Wave 0 |
| SC5 | no layout-shift entries on load at 390 and 1440 | e2e | `npx playwright test -g "layout shift"` | Wave 0 |
| FND-05 | `logo.generated.json` has no bg path; `Logo` renders `mark`/`wordmark`/`lockup`; reversed fills resolve to `rgb(232, 238, 246)` and khaki to `rgb(188, 172, 135)`; O counter present (wordmark has `holed` path) | unit + e2e | `node --test tests/logo.test.mjs` ; `npx playwright test -g "logo"` | Wave 0 |
| SC2 / SHELL-01 | header sticky (`position:sticky`), links 01-08 present, click `#built` sets `aria-current="true"` on exactly one link, scrolling to top clears it | e2e | `npx playwright test -g "scroll-spy"` | Wave 0 |
| SC2 | click jumps: target section in viewport and not hidden under header (`scroll-margin-top`) | e2e | `npx playwright test -g "anchor"` | Wave 0 |
| SC3 / SHELL-02 | at 390 px Menu opens dialog listing 8 links each with subtitle; Tab stays in dialog or body (never page content); Esc closes; focus returns to Menu; link click closes and lands on section | e2e | `npx playwright test -g "mobile menu"` | Wave 0 |
| SC3 | menu opens with JS disabled (Invoker Commands) | e2e | `npx playwright test -g "JS off"` | Wave 0 |
| SC4 / SHELL-03 | first Tab focuses `.skip` and it is in viewport; Enter moves focus to `#main` | e2e | `npx playwright test -g "skip link"` | Wave 0 |
| All | axe wcag2a/2aa/22aa: 0 violations at 1440 and 390 | e2e | `npx playwright test axe` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run check && npm test` (seconds; needs a current `dist/` for build tests, so run `npm run build` first in the task that changes build output)
- **Per wave merge:** `npm run build && npm test && npm run test:e2e`
- **Phase gate:** full suite green plus a clean-clone `npm ci && npm run build` before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `package.json`, lockfile, `astro.config.mjs`, `tsconfig.json` (extends `astro/tsconfigs/strict`, include `.astro/types.d.ts` and `**/*`, exclude `dist`)
- [ ] `playwright.config.ts` with webServer; `npx playwright install chromium`
- [ ] `tests/build.test.mjs`, `tests/tokens.test.mjs`, `tests/logo.test.mjs`, `tests/shell.spec.ts`, `tests/axe.spec.ts`
- [ ] Framework install: `npm install -D @playwright/test @axe-core/playwright @astrojs/check typescript@^6`

Reference e2e tests from the spike (all passing in Chromium 1.63): skip link (Tab -> `a.skip` focused and in viewport, Enter -> `#main` focused); desktop spy (order of `main > section` ids, click `#built` -> `aria-current`, scroll to 0 -> none); mobile menu (390x800, click `[data-menu-open]`, 8 links, 14 Tabs each in dialog or body, Escape hides and button regains focus, link click closes and target in viewport); JS-off (`test.use({javaScriptEnabled:false})`, menu still opens); axe (`new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag22aa']).analyze()` -> `[]`).

## Security Domain

Static site, no auth, no user input, no backend. `security_enforcement` is not disabled, so it is covered briefly.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | - |
| V3 Session Management | no | - |
| V4 Access Control | no | - |
| V5 Input Validation | no (no inputs) | - |
| V6 Cryptography | no | - |
| V14 Config / Supply chain | yes | Lockfile committed, `npm ci`, slopcheck-audited dependencies, exact astro pin, no `latest` tags, no third-party runtime requests (fonts self-hosted) |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Hallucinated/typosquatted npm package | Tampering | slopcheck scan passed (5 OK); only well-known packages added |
| Third-party font CDN leaking visitor IPs / render-blocking | Information disclosure | Astro Fonts API self-hosts; test asserts no googleapis/gstatic in `dist` |
| Transitive install scripts (esbuild postinstall) | Tampering | Known, expected; binaries via optional deps; review `npm install-scripts ls` if npm enforces `allowScripts` later |
| Unsafe external links | Tampering | Later phases: `rel="noopener"` on external links (none in Phase 1) |
| Missing security headers | - | Optional in Phase 1: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` in `_headers`; CSP deferred (inline scripts/styles from Astro) |

## Project Constraints (from CLAUDE.md)

Out of date in places (describes the dropped 9-section plan, old tokens, `results.ts`, GSAP in M3). Not binding for stack/tokens. Directives that still apply and are honored in this research:
- Plain CSS custom properties; no Tailwind, no chart lib, no icon package; fonts via Astro Fonts API, no Fontsource. Dark theme only, `color-scheme: dark`.
- Logo only through one `Logo.astro`; size from the parent via `:global(.logo)` because scoped styles do not reach the child SVG (this research uses global `.logo` classes in `global.css`); path data generated by `scripts/clean-logo.mjs`, never hand-edited; reversed tone on dark, green parts render as `--text-1`, khaki kept; `public/favicon.svg` is the mark on `--bg-0`.
- Accessibility: WCAG 2.2 AA, visible 2px `--signal` focus ring never removed, 44 px targets, informative SVGs `role="img"` + label, decorative `aria-hidden`.
- SVG colors via tokens/`currentColor`, never raw hex. No shadows; elevation from surface + border.
- Buttons are CSS classes (`.btn`), not a component. Sentence case; uppercase only for stage names, badges, hero label.
- The word "Live" is not used; no numbers in hero/OG (later phases).
- Budgets relevant now: fonts <= 130 KB; CSS <= 25 KB; JS on `/` <= 70 KB (Phase 1 ships about 1 KB).
- Never push without the user asking. Hosting is Cloudflare Pages. Use Context7 for docs (done). Keep `graphify-out/` out of git.
- Conflicts resolved in favor of `research/SUMMARY.md` + `DESIGN.md`: palette (`#050B16` not `#07101F`), 8 sections not 9, header progress rail deferred (not in Phase 1 scope), text-3/line-strong values from DESIGN.md.

## Sources

### Primary (HIGH confidence)
- Context7 `/withastro/docs`: Fonts API config (`fonts`, `fontProviders.google`, `cssVariable`, `weights`, `subsets`, `fallbacks`, `optimizedFallbacks`, `display`, `<Font cssVariable preload />`), `experimental.variableAxis` / `experimental.glyphs`, `astro/zod` import, `compressHTML` default `'jsx'`, v7 upgrade (Rust compiler, strictness)
- Spike project (`%TEMP%\spike`, astro 7.3.5 + TS 6.0.3 + Playwright 1.63 + axe 4.13): build output, font byte sizes and `@font-face` output, `astro check`, `astro/zod` import, 7 passing e2e tests, logo renders
- npm registry (2026-09-30): versions and peerDependencies for astro, typescript, @astrojs/check, @playwright/test, @axe-core/playwright
- MDN: Invoker Commands API (Baseline newly available Dec 2025), `<dialog>` (`showModal()` focus/Esc/inert/backdrop/`closedby`), Popover API using guide (no focus trap, page not inert)
- Cloudflare docs: Pages build image (Node 22.16.0 default, `.node-version`/`NODE_VERSION`, any version), build configuration (Astro preset, `CF_PAGES_URL`), `_headers` (format, limits, static only)
- `.planning/research/{SUMMARY,STACK,ARCHITECTURE,DESIGN}.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `logo.svg` (52 paths inspected and rendered)

### Secondary (MEDIUM confidence)
- Google Fonts CSS2 API responses fetched with curl (file sizes per axis request): Archivo 90,104 B for any `wdth` range; 34,928 B wght 600..700 only; Plex Sans 45,712 B raw (40,240 B via Astro)

### Tertiary (LOW confidence)
- None relied on.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - installed and built in the spike, versions from the registry.
- Architecture: HIGH - every pattern executed (build, check, e2e, axe, screenshots) in Chromium.
- Pitfalls: HIGH for items marked VERIFIED; MEDIUM for font-swap perception (A3), 1024 px header fit (A4), non-Chromium browsers (A7).

**Research date:** 2026-09-30
**Valid until:** 2026-10-07 (fast-moving: Astro experimental font options and TypeScript tag; deadline is 2026-10-02 anyway)
