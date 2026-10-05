# Pearl / Plum and scroll-motion verification — 5 October 2026

Scope: the user-requested light theme and motion throughout the existing React site. Pearl is the default; Plum remains available in the desktop header and phone Menu. The selected Exhibition Cutaway composition, eight chapters, appendices, evidence and data issuance stay intact. Authority: `../redesign/LIGHT-MOTION-SPEC.md`.

## Implemented behavior

- Theme tokens cover page, controls, status labels and logo. Choice applies before paint, persists across routes and reloads, and falls back safely when local storage is denied. Native view transitions enhance supported theme changes.
- Finite chapter/headline entrances complement the existing cutaway introduction. Scroll drives the problem schematic, system spine, figure-frame accents, comparison rule and roadmap reading rail. Only visible scenes update through the existing scroll scheduler.
- Reduced motion skips entrances and scroll movement. Hidden documents cancel finite entrance effects. Static content stays readable without JavaScript; original figure pixels and issued measurements are untouched.
- No new runtime dependency. No deployment or push.

## Verification evidence

TypeScript and production build pass. `light-motion-node-final.txt` records **65 passing node/data/build checks**. The latest full run, `light-motion-clean-suite.json`, records **74 passing Chromium/Firefox checks**, zero failures/flakes, without concurrent captures (137 seconds). The earlier expanded run recorded 73 passes and one Firefox initial-navigation timeout; its focused rerun passed all 16 theme/scroll/alignment checks. Those earlier reports remain diagnostic history. Reports are under `.impeccable/review/`.

Browser coverage includes persistence, denied storage, reduced motion, scroll transforms/strokes, unchanged values/figure pixels, keyboard/native menus, accessibility, source inspection and existing interactions. Firefox stroke calculation uses an explicit length unit. Logo tests verify light and reversed Plum palettes.

Final production asset totals: **69,433 bytes gzip JavaScript (67.81 KiB)** and **7,961 bytes gzip CSS (7.77 KiB)**, below 70/25 KiB budgets. The rebuilt budget test passes.

Two initial capture rounds covered both themes at **1440, 768 and 390 pixels**; the reviewer correction then replaced the same 16 authoritative capture paths. All 12 viewport/full-page captures and four focused captures were reopened by the reviewer. Two supplemental system-fixed captures were excluded from the final packet because of capture artifacts; the valid authoritative system-detail/full-page captures support the alignment review. The manifest records no overflow/browser errors and eight chapters. Chromium used `--disable-gpu` to avoid duplicated content in tall captures. The normal-motion recording is listed in that manifest; it was not played, so timing evidence comes from source and browser state checks.

Temporal follow-up: `light-motion-temporal.json` and `light-motion-timing-1440.png` / `light-motion-timing-390.png` sample actual running heading animations. Both frame sheets were opened: partial masks settle to full readable headings; after the 650ms effect, clip/transform return to none with zero active animations. On both widths the cutaway paused offscreen and its selected stage stayed unchanged after 1,050ms. Enabling reduced motion during a new entrance cancelled it, restoring the final readable state. Native theme-transition samples showed running effects near 50/200ms and none by the final sample around 400ms, with Plum applied and no page errors. These are frame/state samples, not a played video or frame-rate measurement.

## Independent review

The fresh review found one material issue: system ports drifted progressively above stage centers. Its initial disposition was **fix**. SVG height now matches its 550-unit viewBox; all seven port centers measure zero offset from their rows at 1440 and 768 widths. Stage labels paint above return linework, preventing the path from crossing text. The reviewer reopened all 16 authoritative replacement captures and confirmed the finding resolved, with no observed correction regression. On the final follow-up, the reviewer completed the previously interrupted contract/floor reads and examined temporal samples and the clean-suite report. Final disposition: **ship for the Pearl/Plum and scroll-motion extension**, no material fixes open, saved in `.impeccable/review/light-motion-final-verdict.json`. This approval covers the authorized extension and retains historical baseline exceptions; it is not a whole-site ceiling or field-performance certification.

## Limits retained

- WebKit runtime DLLs are unavailable. Lighthouse and field LCP/CLS/INP are unmeasured.
- The baseline strict image-match gate and selected-mockup labels were accepted by the user. This extension does not claim those historical findings passed. Separate QUALITY BAR card unavailable.
- The initial review's craft-floor/EXPERIENCE read block was resolved in the final follow-up. Continuous animation smoothness and frame rate remain unmeasured; temporal review used sampled frames/state rather than a played recording.
- Pinned modern-web-guidance and dataviz skill files were unavailable in searched roots. Platform references are linked in the scope specification. No chart algorithm changed.
- Graphify refresh remains blocked by Windows Application Control; no current graph is claimed.
- Existing narrow hook suppression for the historical stroke-width/width false positive is unchanged. No new suppression. The hook automatically stopped further motion.css hints after its edit threshold.
- Team video, dashboard captures, AoA/scheduler evidence, SNR definition, contact details and production URL remain pending.
