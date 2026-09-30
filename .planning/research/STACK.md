# Stack Research

**Domain:** Static, single-page engineering scrollytelling site (SIH 2026 PS 26055 entry "AVOLITE"), animation-rich, hosted on Cloudflare Pages, 1–2 day build
**Researched:** 2026-09-30
**Confidence:** HIGH (versions checked against the npm registry today; core APIs checked in Context7 and official docs). Where a claim rests on search results only, the row says so.

## Verdict (one paragraph)

Use **Astro 7 (static output) + TypeScript 6 + plain CSS custom properties + GSAP 3.15 (core + ScrollTrigger, plus DrawSVG/SplitText only where needed)**. Build charts and diagrams as SVG inside Astro components, rendered at build time. Write the interactive panels in vanilla TS `<script>` blocks, with no UI framework island. Show media with native `<video>` / `<picture>`. Self-host fonts through Astro's built-in Fonts API. Test with Playwright plus axe. Deploy the `dist/` folder to Cloudflare Pages with Git integration. Every section is in the HTML without JS, so the site works when JS is off or fails. The JS bundle for `/` stays around 55–65 KB gzip, about 40% of what the AVOFLARE reference ships.

## What the reference site (avoflare-web.pages.dev) actually uses

I inspected the deployed HTML and bundles today (HIGH confidence, measured directly):

| Observation | Evidence | Lesson for AVOLITE |
|---|---|---|
| Vite + **React SPA**, client-rendered | `<div id="root"></div>` empty body; `createRoot`, `__reactFiber` in bundle | Content invisible until JS runs → worse LCP/SEO, nothing without JS. **Pre-render instead (Astro).** |
| Main JS **154 KB gzip** (503 KB raw), CSS 23 KB gzip | `main-*.js`, `main-*.css` | Keep the look, cut JS by ~60% by dropping React. |
| GSAP + ScrollTrigger + **Lenis** smooth scroll | `gsap`(46 hits), `ScrollTrigger`, `lenis.version` | Keep GSAP. Drop Lenis (see What NOT to use). |
| Media on **R2 via `pub-….r2.dev`** | WebP at 960/1920 widths, MP4 + `-720.mp4` via `<source media="(max-width: 820px)">`, WebP poster | Pattern is right, but `r2.dev` is rate-limited and "should only be used for development purposes" (Cloudflare docs). Use a custom domain or Pages static assets. |
| Chapters = custom button list driving `video.currentTime` | `chapters:[...document.querySelectorAll('#dpList button')]` | Reuse this pattern (native `<video>` + buttons). No player library. |
| Google Fonts via CDN `<link>` | `fonts.googleapis.com` css2 link | Self-host instead (one fewer origin, no render-blocking third-party CSS, privacy). |
| `startViewTransition`, `prefers-reduced-motion` handled | 1 and 19 hits | Keep reduced-motion discipline; view transitions are optional garnish. |

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Confidence |
|---|---|---|---|---|
| **Astro** | `7.3.5` (released 2026-06-22 as 7.0; 7.3.5 published 2026-09-24) | Static site generator, `.astro` components, image pipeline, fonts | Outputs plain HTML with zero JS by default. Sections are components, and data (CSV → JSON) is imported at build time, so numbers are in the HTML, not fetched. Astro 7 uses Vite 8/Rolldown and a Rust compiler (15–61% faster builds). The static build needs no Cloudflare adapter. The user already knows Astro from the earlier plan. | HIGH |
| **TypeScript** | `^6.0.3` (**not** 7.x) | Types for data, panels, and `astro check` | `@astrojs/check@0.9.10` peer-requires `typescript ^5.0.0 \|\| ^6.0.0`. `npm i typescript` now installs **7.0.2** (the Go port, released today), which breaks that peer range. Pin 6. | HIGH (npm peerDependencies checked) |
| **Plain CSS + custom properties** (Astro scoped `<style>`) | n/a (native) | Design tokens, layout, components | One page and roughly 15 components, and tokens are the whole design system. Scoped styles plus native nesting, `clamp()`, container queries, `:has()` and `color-mix()` cover everything. It is one less build dependency and one less set of conventions to decide in a 1–2 day window. The CSS budget of ≤25 KB is easy to hold. | HIGH |
| **GSAP** | `3.15.0` | Scroll-linked storyboards, the scan → detect → lock sequence, SVG stroke draws, timelines | Industry standard for scrollytelling. **100% free including all former Club plugins** (SplitText, MorphSVG, DrawSVG, etc.) under the "Standard no-charge license" (checked in the package README and `license` field). `ScrollTrigger` pinning/scrub works in every browser, unlike CSS scroll timelines (no Firefox). `gsap.matchMedia()` gives clean reduced-motion and mobile branches. Framework-agnostic, so it fits vanilla Astro scripts. | HIGH |
| **Cloudflare Pages** (Git integration) | build image v3 | Hosting, previews per branch | Hard project constraint, and it is the user's known path (AVOFLARE and AquaSol are both on Pages). Static assets are free and unlimited. Cloudflare now recommends **Workers Static Assets** for *new* projects, but Pages "remains fully supported". For a static site that ships in 2 days, Pages Git integration has less to configure. | HIGH (constraint) / MEDIUM (Workers note, from search plus CF docs index) |
| **Node.js** | `24.x` (local is 24.21.0; Astro 7 requires `>=22.12.0`) | Build runtime | Match local and Cloudflare. The Pages v3 image defaults to 22.16.0, so pin with a `.node-version` file containing `24`. | HIGH |

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---|---|---|---|---|
| `gsap/ScrollTrigger` | ships in gsap 3.15.0 | Pin/scrub the How-it-works loop and the AoA lock | Always (on `/`) | HIGH |
| `gsap/DrawSVGPlugin` | in gsap | Beam and signal-path stroke reveals | Radar/beam/loop diagrams. It is only 2.2 KB gzip. | HIGH |
| `gsap/SplitText` | in gsap | Hero headline line/char reveal | Optional, hero only (3.7 KB gzip). It has built-in `aria` handling, but keep the real text in the DOM. | HIGH |
| `gsap/MorphSVGPlugin`, `MotionPathPlugin` | in gsap | Shape morphs, dots travelling along the loop path | **Only if a specific scene needs it.** About 9.6 KB gzip each, so both would push the budget. | HIGH (sizes measured) |
| `astro:assets` `<Picture>` / `<Image>` (uses `sharp 0.35.x`, bundled) | with Astro 7 | AVIF + WebP + widths for screenshots, plots, AI mood images | Every raster image placed in `src/assets/`. `formats={['avif','webp']}` gives explicit `width`/`height` (CLS-safe) and lazy loading. | HIGH (Context7) |
| Astro **Fonts API** (`fonts: [...]` + `fontProviders.google()` / `.local()` in `astro.config.mjs`) | built into Astro 7 (stable) | Downloads and self-hosts font files at build, generates metric-matched fallbacks and preloads | Always. Replaces Fontsource packages and the Google CDN link. | HIGH (Context7) |
| `zod` via `astro/zod` (zod 4.x) | bundled with Astro | Validate the results JSON at build, enforcing status-tag and "real vs illustrative" rules | Always. The build fails if a number lacks a status tag. No extra dependency needed. | MEDIUM (import path per Astro 6/7 docs pattern; confirm in M0) |
| Tiny CSV → JSON node script (`scripts/import-results.mjs`) | n/a | Convert `SARRS_Results/*.csv` from the AVOLITE repo into `src/data/*.json` | When real repo exports arrive. About 20 lines of `fs` + `split`, so no CSV library is needed. | HIGH |

**Deliberately no chart library and no D3 on the client.** The charts are few, single-series, and static in their final state: CFAR table, range and velocity error, requirement map, roadmap. Render them as SVG in `.astro` components at build time with a 5-line linear scale helper. They then cost **0 KB of client JS**, work without JS, and GSAP can animate their strokes. If a curve needs smoothing, `d3-shape@3.2.0` can be imported **at build time only** (still 0 client KB). It is stable but unchanged since 2023, which is fine for a pure-math module.

### Development Tools

| Tool | Version | Purpose | Notes | Confidence |
|---|---|---|---|---|
| `@playwright/test` | `1.63.0` | Smoke tests, screenshots at 1440/768/390, reduced-motion emulation, console-error check | `page.emulateMedia({ reducedMotion: 'reduce' })`. Use the screenshots for **manual review**. Skip pixel-diff visual regression: brittle with animation and not worth it in 2 days. Chromium only by default; add WebKit before launch (Safari is common among judges on iPhone). | HIGH |
| `@axe-core/playwright` | `4.13.0` | Automated WCAG checks per section | One test: `new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag22aa']).analyze()` → expect no violations | HIGH |
| `@astrojs/check` | `0.9.10` | `astro check` type and template diagnostics | Needs TS 5 or 6 (see above) | HIGH |
| Lighthouse (`npx lighthouse <url> --preset=perf --form-factor=mobile`) or Chrome DevTools | current | Verify mobile ≥90, a11y 100 | Run against `npm run preview` and the Pages preview URL | HIGH |
| `wrangler` | `4.145.0` | **Optional**: `wrangler pages deploy dist` for manual deploys, R2 uploads (`wrangler r2 object put`) | Not needed if Git integration is used. `npx` it rather than installing it. | HIGH |
| `ffmpeg` (system) | any recent | Encode the demo video: H.264 MP4 1080p + 720p, plus a poster frame | See video section | HIGH |

## Installation

```bash
# Scaffold (empty template, TS strict)
npm create astro@latest . -- --template minimal --typescript strict --no-git --install

# Core runtime dep (only one)
npm install gsap@^3.15.0

# Dev
npm install -D typescript@^6.0.3 @astrojs/check@^0.9.10 @playwright/test@^1.63.0 @axe-core/playwright@^4.13.0
npx playwright install chromium webkit

# Pin Node for Cloudflare
echo 24 > .node-version
```

`astro.config.mjs` essentials:

```js
import { defineConfig, fontProviders } from 'astro/config';
export default defineConfig({
  site: process.env.SITE_URL ?? process.env.CF_PAGES_URL ?? 'https://avolite.pages.dev',
  output: 'static',            // default; stated for clarity
  fonts: [
    // 2 families max: 1 variable sans (display + body), 1 mono (labels/ticks). Latin subset only.
    { provider: fontProviders.google(), name: '<Display/Body Variable>', cssVariable: '--font-sans', weights: ['400 700'], subsets: ['latin'] },
    { provider: fontProviders.google(), name: '<Mono>', cssVariable: '--font-mono', weights: [400, 500], subsets: ['latin'] },
  ],
});
```

(The font families themselves are a design decision for the design phase. The stack constraint is at most 2 families, variable where possible, latin only, and ≤130 KB total.)

## Cloudflare Pages build config

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node | `.node-version` = `24` (or env `NODE_VERSION=24`). The v3 image supports any version. |
| Env (production) | `SITE_URL=https://<project>.pages.dev` (canonical/OG URLs). `CF_PAGES_URL` is injected automatically for previews. |
| Headers | `public/_headers`: `/_astro/*` → `Cache-Control: public, max-age=31536000, immutable`, since Astro's hashed assets are safe to cache forever. |
| Limits to respect | **25 MiB max per asset**, 20,000 files (free), 20-minute build (Cloudflare docs) |
| Deploy rule | Push to `main` deploys production. **Never push without the user asking.** |

## Media: video, images, large files

**Demo video → self-hosted MP4 with native `<video>` + chapter buttons. Not YouTube.** (HIGH)
- Why not YouTube: the iframe pulls roughly 0.5–1 MB of third-party JS and hurts Lighthouse. It shows recommendations and branding, and it can be blocked on campus or venue networks. Chapters would depend on YouTube's description parsing. If YouTube is ever needed as a backup link, use a click-to-load facade (thumbnail + link) and never an eager iframe.
- Encode: `ffmpeg -i demo.mov -c:v libx264 -crf 23 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k demo-1080.mp4`, plus a `-vf scale=-2:720` variant and a poster frame as AVIF/WebP. `+faststart` is required so playback starts before the full download. Skip WebM/AV1: H.264 plays everywhere, and a second codec doubles the encoding work.
- Markup: `<video controls playsinline preload="none" poster="…">` with `<source media="(max-width: 820px)" src="…-720.mp4">` and a 1080 source. Chapters are a `<ol>` of `<button data-t="42">` that set `video.currentTime` and highlight on `timeupdate`. Add a `<track kind="chapters" src="chapters.vtt">` and `kind="captions"` (a11y). This is the AVOFLARE pattern, cleaned up.
- **Where to host:**
  1. **If each rendition is under 25 MiB** (for example a 2–3 min 720p at about 1.2 Mbps, and a tighter 1080p), put it in `public/media/` on Pages. There is no second service to set up, and it gets the same CDN and free egress. **Default choice.**
  2. **If it is larger**, use an **R2 bucket with a custom domain** (for example `media.<domain>`), which gets Cloudflare cache. This needs a domain on Cloudflare. Do **not** ship on `pub-*.r2.dev`: Cloudflare documents it as rate-limited and dev-only, and it is what AVOFLARE currently does.

**Images** (HIGH): real MATLAB screenshots, plots and AI mood images go in `src/assets/` and through `<Picture formats={['avif','webp']} widths={[640, 960, 1440, 1920]} sizes="…">`. The hero or LCP image gets `loading="eager" fetchpriority="high"`. Placeholders are fixed-aspect boxes (`aspect-ratio`) with a PLACEHOLDER tag, so swapping in the real asset causes no layout shift. Diagrams, radar, beams and charts are inline SVG, not rasters. Put images in R2 only if the image set exceeds a few hundred MB; it will not for this site.

## Performance budgets (Lighthouse mobile ≥90)

| Budget | Target | How it's met |
|---|---|---|
| JS on `/` (gzip) | **≤ 70 KB** | gsap core 28.3 + ScrollTrigger 18.0 + DrawSVG 2.2 + SplitText 3.7 = **52.2 KB** (measured today, gzip -9) + ~8–12 KB of own code. Adding MorphSVG or MotionPath (+9.6 each) needs a reason. |
| CSS (gzip) | ≤ 25 KB | Plain CSS, scoped per component |
| Fonts | ≤ 130 KB total, ≤ 2 families, preload only the 1–2 above-the-fold files | Astro Fonts API, woff2, latin subset |
| LCP | ≤ 2.0 s (mobile, 4G) | Hero is text + inline SVG, not a video or big image. Fonts preloaded with metric-matched fallbacks. |
| CLS | ≤ 0.05 | Width and height on every image, aspect-ratio boxes for placeholders and video, fallback-font metrics |
| INP | ≤ 150 ms | No scroll hijacking, no framework hydration, lightweight handlers |
| Hero video/loops | none autoplaying above the fold on mobile | Radar loop is SVG + GSAP, paused offscreen, with a pause toggle |

GSAP loads from a `<script>` in the page (Astro bundles and defers it). It is dynamically imported after first paint, so the ~50 KB never blocks LCP: `requestIdleCallback`/`load` → `import('./motion')`.

## Interaction building blocks (native first, no deps)

| Need (from PROJECT.md) | Build with | Confidence |
|---|---|---|
| Mobile menu listing 8 sections + subtitles | `popover` attribute + `<button popovertarget>` (Baseline since 2024), or `<details>` | HIGH |
| Anchored numbered nav + active section | Native `#anchors` + `scroll-margin-top`, `IntersectionObserver` for the active state, `scroll-behavior: smooth` inside `@media (prefers-reduced-motion: no-preference)` | HIGH |
| Before/after slider | `<input type="range">` driving a CSS custom property → `clip-path: inset(0 calc(100% - var(--pos)) 0 0)`. Keyboard accessible for free. | HIGH |
| Interactive smart-scan loop explainer | SVG + vanilla TS state machine (step buttons, prev/next, auto-advance pausable). GSAP timeline per step. | HIGH |
| Tabs/panels (requirement map, security layers) | Buttons with `aria-controls`/`aria-selected` in ~30 lines of TS. No library. | HIGH |
| Data tables behind charts | `<details><summary>View as table</summary><table>…` | HIGH |

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|---|---|---|
| Astro 7 static | **Vite 8 + vanilla TS** (no framework) | If the team refuses any framework. You then lose build-time data imports into markup, `<Picture>`, the Fonts API and components, and would rebuild them by hand. Not worth it in 2 days. |
| Astro 7 static | Vite + React SPA (the AVOFLARE approach) | Only to copy AVOFLARE code, which is out of scope. It costs ~100 KB more JS and renders an empty HTML shell. |
| Astro 7 static | Next.js static export | Never for this site. React runtime and hydration for a page that is almost all static content. |
| Plain CSS | **Tailwind CSS 4.3.3** (`@tailwindcss/vite`) | If whoever builds is much faster in Tailwind. v4 is CSS-first, has an `@theme` token block and integrates cleanly with Vite 8, so it is a legitimate choice. Pick one on day 1 and don't mix. |
| GSAP ScrollTrigger | **CSS scroll-driven animations** (`animation-timeline: view()`) | Fine for small progressive-enhancement touches such as the header progress bar, wrapped in `@supports (animation-timeline: view())`. **Not** for the core story: Firefox still has no support, and the feature is not Baseline (web-features explorer, checked today; Safari 26+ and Chrome 115+ do support it). |
| GSAP | **Motion 13.4.6** (`motion` vanilla `animate`/`scroll`) | Smaller for simple tweens and a good choice for React apps. It has no equivalent of ScrollTrigger pinning or timeline scrubbing, nor DrawSVG. Using both GSAP and Motion wastes budget. |
| Native `<video>` | YouTube / Vimeo embed | Only as a secondary "watch on YouTube" link, or as a click-to-load facade if file-size limits bite and no custom domain exists |
| Pages static assets for media | R2 + custom domain | Files over 25 MiB, or a large media library |
| Cloudflare Pages | **Workers Static Assets** (`wrangler.jsonc` with `assets.directory: "./dist"`) | Cloudflare's recommended target for new projects. Choose it if the team wants to be on the actively developed platform or may add server logic later. Migration later is a short hop, so it doesn't block launch. |
| Hand-rolled SVG charts | `d3-scale`/`d3-shape` at build time | Log scales, nice ticks, smooth curves. Import them in frontmatter only (0 client KB). |

## What NOT to Use

| Avoid | Why | Use Instead |
|---|---|---|
| **TypeScript 7.x** (current `latest`) | `@astrojs/check` peer range is `^5 \|\| ^6`, so the install conflicts and `astro check` may break | `typescript@^6.0.3` |
| **Lenis** smooth scroll (1.3.26) / GSAP ScrollSmoother | Scroll hijacking: extra ~5.4 KB, must be synced to the GSAP ticker, breaks anchors unless `anchors: true`, affects INP and assistive tech, and judges on trackpads or phones gain nothing. It is the one AVOFLARE dependency that adds risk without adding story. | Native scrolling + `scroll-behavior: smooth` (reduced-motion gated). If the user insists: `new Lenis({ anchors: true })`, with the default `respectReducedMotion` left on, and sync as `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)` (Lenis README via Context7). |
| React/Vue/Svelte islands | Hydration JS for widgets that are about 30 lines of vanilla TS | Astro `<script>` + DOM |
| Chart.js / ECharts / Recharts / Plotly | 60–300 KB, canvas output is not accessible, and default styling fights the design system | Build-time SVG components |
| Three.js / WebGL scenes | Heavy (150 KB+), GPU drain on judges' laptops, not needed for 2D radar/beam storytelling | SVG + GSAP; a canvas only for a dense particle or spectrum effect, if ever |
| Google Fonts `<link>` CDN / Fontsource packages | Third-party render-blocking CSS, an extra origin; Fontsource duplicates what Astro now does natively | Astro Fonts API |
| `pub-*.r2.dev` URLs in production | Rate-limited, and documented by Cloudflare as dev-only | Pages `public/` (<25 MiB) or an R2 custom domain |
| Autoplaying hero video | Destroys LCP and mobile data use; reduced-motion conflicts | SVG radar loop with pause toggle |
| Astro `<ClientRouter />` / view-transition page routing | Single page, nothing to route; its internals changed again in v7 | Nothing. Use `document.startViewTransition` only for an in-page panel swap if wanted, and feature-detect it. |
| `@astrojs/cloudflare` adapter | Only needed for SSR; this site is static | Plain `output: 'static'` |
| Pixel-diff visual regression suites | Flaky with animation, and slow to maintain on a 2-day clock | Playwright screenshots for manual review + axe + smoke assertions |
| Icon packages (lucide-react etc.) | A whole dependency for about 10 glyphs | Copy the SVGs you need into `src/icons/` |

## Stack Patterns by Variant

**If the demo video is not ready at launch:**
- Ship the `<video>` block with a poster placeholder tagged PLACEHOLDER, a fixed 16:9 box and the chapter list disabled
- Because asset swaps must not change layout (PROJECT constraint)

**If JS fails or is disabled:**
- Every visual is server-rendered in its **final** state, and GSAP only animates *from* it (`gsap.from`, or `fromTo` on elements that are already correct)
- Because judges must see all content and status tags regardless

**If `prefers-reduced-motion: reduce` or viewport < 768px:**
- `gsap.matchMedia()` branch: no pinning, no scrub; set end states instantly; loops off
- Because pinned storyboards are the most common mobile and a11y failure in scrollytelling

## Version Compatibility

| Package A | Compatible With | Notes |
|---|---|---|
| `astro@7.3.5` | Node `>=22.12.0` | Use Node 24 locally and on Cloudflare (`.node-version`) |
| `astro@7.x` | Vite 8 (bundled) | Don't install Vite separately |
| `@astrojs/check@0.9.10` | `typescript ^5 \|\| ^6` | **Not TS 7.0.2** |
| `astro@7` Rust compiler | Strict HTML | Requires matching closing tags for non-void elements; invalid nesting is no longer auto-fixed (v7 upgrade guide). Write valid HTML or builds fail. |
| `astro@7` | `compressHTML` default `'jsx'` | Whitespace between inline elements is stripped. Watch inline spacing around status tags and inline `<abbr>`s. |
| `astro@7` Markdown | Sätteri (Rust) default | Only matters if MDX or remark plugins are added. None planned for a single page. |
| `gsap@3.15.0` | all plugins bundled in the same package | Import from `gsap/ScrollTrigger` etc. and `gsap.registerPlugin(...)`. No private registry or token any more. |
| `@playwright/test@1.63.0` | `@axe-core/playwright@4.13.0` | Standard pairing |

## Sources

- npm registry (queried 2026-09-30): versions of astro 7.3.5, gsap 3.15.0, lenis 1.3.26, motion 13.4.6, @playwright/test 1.63.0, @axe-core/playwright 4.13.0, typescript 7.0.2 / 6.0.3, tailwindcss 4.3.3, wrangler 4.145.0, zod 4.6.5, sharp 0.35.5, d3-shape 3.2.0; `astro` engines; `@astrojs/check` peerDependencies (HIGH)
- gsap 3.15.0 package README and `license`: "100% FREE including ALL of the bonus plugins… even for commercial use" (HIGH). Gzip sizes measured locally from `node_modules/gsap/dist/*.min.js` and `lenis.min.js` (HIGH)
- Context7 `/withastro/docs`: Fonts API (`fonts`, `fontProviders.google/local/fontsource`), `<Picture formats>` (HIGH)
- Context7 `/darkroomengineering/lenis`: ScrollTrigger sync, `anchors`, `respectReducedMotion` (HIGH)
- https://astro.build/blog/astro-7/: Rust compiler, Vite 8, 15–61% faster builds, release 2026-06-22 (HIGH)
- https://docs.astro.build/en/guides/upgrade-to/v7/: strict compiler, `compressHTML: 'jsx'`, Sätteri, transitions internals removed (HIGH)
- https://web-platform-dx.github.io/web-features-explorer/features/scroll-driven-animations/: not Baseline, Firefox unsupported, Safari 26+, Chrome 115+ (HIGH)
- https://developers.cloudflare.com/r2/buckets/public-buckets/: r2.dev "rate-limited and should only be used for development purposes" (HIGH)
- https://developers.cloudflare.com/pages/configuration/build-image/: v3 image, default Node 22.16.0, `NODE_VERSION` / `.node-version` (HIGH)
- https://developers.cloudflare.com/pages/platform/limits/: 25 MiB per asset, 20k files, 20-min build (HIGH)
- https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/ plus search results (mecanik.dev, barnabas.me 2026-07): Workers Static Assets recommended for new projects, Pages still supported (MEDIUM)
- Direct inspection of https://avoflare-web.pages.dev/ HTML and `/assets/main-*.js|css` (HIGH)
- YouTube embed weight (~0.5–1 MB third-party JS): training knowledge, not re-measured today (MEDIUM)

---
*Stack research for: static engineering scrollytelling site (AVOLITE, SIH 2026)*
*Researched: 2026-09-30*
