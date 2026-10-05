# AVOLITE

React engineering storytelling site for SIH judges. The approved Exhibition Cutaway opens in Pearl, with a persistent Plum option in the header (inside Menu on phones). Original MATLAB figure exports retain their colors in both themes.

## Run locally

Node 22.18 or newer is required (verified with Node 24).

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4321/`. Production preview:

```sh
npm run check
npm run build
npm test
npm run preview
```

`npm test` reads `dist`, so build first. `npm run test:e2e` runs Playwright Chromium, Firefox and WebKit; install their runtimes if needed with `npx playwright install`. Set `E2E_PORT` when the default port is occupied.

## Routes and source

- `/`: introduction and eight chapters — problem, how it works, what we built, what's new, demo, security, roadmap, why AVOLITE.
- `/system/`: architecture and boundaries.
- `/evidence/`: run context, tables, original figure plates and pending evidence.
- `/preview/`: internal component gallery, noindex.
- `404.html`: static fallback.

`src/App.tsx` renders routes. `src/server.tsx` prerenders React HTML; `src/client.tsx` loads navigation and selectively hydrates widgets from `src/components/Widgets.tsx`. Static content stays readable without JavaScript. `src/styles/` owns tokens, layout and responsive styling. Native details, buttons and selects provide keyboard access.

The build validates pinned source data, generates responsive WebP exports and source sidecars, builds Vite assets, then emits static React HTML into `dist`. `src/lib/data.ts` issues validated metric values; components never invent measurements. Original radar DSP simulation evidence is separate from the designed integrated smart-scan loop. Browser walkthroughs are illustrative.

## Hosting

Cloudflare Pages project **avolite**: build `npm run build`, output `dist`, `NODE_VERSION=24`. Production uses `SITE_URL=https://avolite.pages.dev`; previews use `CF_PAGES_URL`. The Git integration targets `SandeshSatishhNaik/Avolite_web`, production branch `claude/dazzling-rubin-69x39p`. The user authorized replacing and pushing the dummy site on 5 October 2026. Future publication still requires a user request.

Production image exports use the user's Cloudflare R2 bucket **avolite** at `https://pub-96bddf2fe30d456a9831b0b2675e65a5.r2.dev`. The committed `src/lib/storage.json` identifies a content-addressed release. Local development uses `/media`; local exports also remain in production output. Fonts, CSS and scripts stay on Pages; the recording stays in Drive.

After changing source images, authenticate Wrangler and run `npm run assets:r2`, then build and commit the updated storage manifest. The uploader checks every image and provenance sidecar through its public URL before updating the manifest. A production build rejects media that changed after the last upload. `WRANGLER_CLI` can point to an existing Wrangler JavaScript CLI instead of npm exec. No credentials are stored in source.

## Verification and open inputs

Build, TypeScript and 66 node checks pass. The R2-backed Chromium/Firefox suite records 80 passes and two image-loading assertion failures; both corrected checks pass in the focused two-case run. This is not a clean full-suite rerun. See `.planning/audits/R2-PUBLISH-VERIFICATION.md` for publication checks and `.planning/audits/DEMO-ASSETS-VERIFICATION.md` for real Drive playback evidence. Theme, scroll and temporal evidence remain in `.planning/audits/LIGHT-MOTION-VERIFICATION.md`. WebKit cannot launch on this Windows host because ICU, zlib and EGL DLLs are missing. Browser evidence and final screenshots are local in `.impeccable/review/`. Lighthouse and field LCP/CLS/INP are not yet measured.

The supplied 5:16 browser-dashboard recording, sampled scene bookmarks and three original dashboard captures now appear in `/#demo`. Video loads after a visitor requests it, with a native Drive fallback. Captures carry PROTOTYPE/illustrative/source labels; they do not replace pinned MATLAB evidence. Separate MATLAB walkthrough/captures, AoA/scheduler evidence, SNR definition and team/contact details remain pending. Graphify refresh is blocked by Windows Application Control; do not treat an existing graph as current. See `.planning/redesign/EXPERIENCE-SPEC.md` and `DESIGN.md` for the design handoff.

The baseline independent visual correction verdict was **fix**: six findings resolved, two partial (the strict image-match workflow gate and retained labels from the selected mockup). The user accepted that design with findings disclosed. The later motion extension adds selectable signal stages, animated feedback, page transitions and an original-figure inspection dialog. Its final browser run passes 52 Chromium/Firefox checks. See `.planning/audits/REACT-BUILD-VERIFICATION.md` and `.planning/audits/MOTION-VERIFICATION.md` for evidence and limits.

The cutaway introduces its seven stages once when mostly in view, with a moving signal, traced planes and a final return traversal. Manual controls interrupt playback; reduced motion retains a static diagram and stage selection. See `.planning/audits/ONBOARDING-VERIFICATION.md` for that extension's checks and recordings.

Pearl/Plum adds chapter entrances, scroll-driven scan and system traces, figure-frame accents and a roadmap reading rail. Reduced motion skips these effects; evidence images and issued values remain unchanged. Theme choice survives navigation and reloads, and works for the current page when storage is unavailable. See `.planning/redesign/LIGHT-MOTION-SPEC.md` and `.planning/audits/LIGHT-MOTION-VERIFICATION.md` for the current scope and verification.
