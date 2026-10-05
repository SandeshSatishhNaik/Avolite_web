# Supplied demo assets — verification, 5 October 2026

Scope: integrate the user-supplied recording and browser dashboard into the existing React design. The user authorized arbitrary demonstration credentials and material selection. No push or deployment.

## Sources and truth

- Drive folder: https://drive.google.com/drive/folders/1425VEBKi62fiwWE3uAeuUvp-6D4p_FDf. One public recording, `Avolite_Dashboard_vids.mp4`, displayed 287 MB; verified player duration 316.302 seconds / 5:16.
- Recording: https://drive.google.com/file/d/1Zvi3vxh7ekWwGCZ82BJpV-mZNKCBcU5w/view. Sampled bookmarks at 30, 90, 150, 210 and 270 seconds show surveillance, RF processing, unknown signals, history/memory and signal intelligence. They are sampled moments rather than chapter boundaries.
- Dashboard: https://avolite-dashboard.vercel.app/. Inspected using arbitrary demo credentials. Source states RESEARCH PROTOTYPE, SIMULATION and SIMULATED DATA / NOT OPERATIONALLY VALIDATED. Paused simulation before capturing Smart Scan, Surveillance and Unknown Signals. No admission/authorization action was taken.
- Original screenshots and a clean recording frame are retained in `src/assets/dashboard`. Responsive WebPs retain original colors and separate dashboard provenance sidecars. Interface values stay inside illustrative prototype images; none are issued as numerical engineering results. Original MATLAB evidence is unchanged.

## Implementation and playback

Demo includes a click-to-load, stable-aspect recording player, native Drive fallback, scene links, native capture disclosures and dashboard action. Built, Evidence and Preview now point to supplied prototype material; separate MATLAB walkthrough/captures and scheduler/AoA/hardware validation remain pending.

Actual local Drive embed playback was verified: readyState 4, paused false, duration 316.302 seconds and time advancing from 1.396 to 38.856 seconds. The iframe delegates autoplay permission for Drive's internal controller after the visitor requests it; the site does not start media automatically. Close removed the actual iframe and returned focus. Source Drive loading can be slow, and its auxiliary account frame emits a 401 plus preload warnings. These are not asserted to be application-console-clean. Captions are disabled in the supplied player; no transcript was supplied.

The browser suite uses controlled external-player substitutes/aborts for deterministic lifecycle, unavailable-media recovery and accessibility. Those checks do not establish real Drive playback. Native links work without JavaScript. Hidden-page/offscreen unmount and keyboard handoff are covered; a Chromium smooth focus-scroll race was fixed by completing the nearest scroll before mounting the offscreen observer and focusing Close.

## Checks

- TypeScript and production build pass; 65 node/data/build checks pass (`demo-node-final.txt`). The original MATLAB source checks remain intact.
- New media suite: 8 Chromium/Firefox checks pass (`demo-media-fixed.json`).
- Latest expanded full suite: 81 expected passes and one failure in an existing figure-dialog test's immediate close-event assertion (`demo-browser-final.json`). The assertion now polls for the asynchronous native close event. All 10 targeted media and figure-dialog correction checks pass (`demo-correction-checks.json`); this is a targeted correction run, not a second clean full-suite run.
- Twelve default section/recording captures across Pearl/Plum and 1440/768/390 widths: no overflow or page errors (`demo-captures.json`). Open secondary captures and unavailable-player controls are captured across all six theme/viewport combinations (`demo-state-captures.json`), with focus returned and no overflow. `demo-live-player.png` records actual playing source video plus Close and fallback controls.
- Final production assets: 70,558 bytes gzip JavaScript including the optional inspection chunk; 8,276 bytes gzip CSS. Within the 70 KiB JS / 25 KiB CSS limits. No video payload loads initially; no 287 MB recording is bundled.
- Component hook checks reported no deterministic issue. No new suppression. Historical accepted visual-gate exceptions remain separate.

WebKit remains unavailable on this Windows host because runtime DLLs are missing. Lighthouse/field LCP, CLS, INP and continuous frame-rate measurement remain unverified. Source recording and dashboard prototype do not establish hardware or learned scheduling validation.

Independent scoped review and documentation are recorded in `.impeccable/review/demo-final-verdict.json`, `DESIGN.md` and `.impeccable/design.json`. The initial review requested rendered secondary/player-state evidence; those captures were added. The reviewer scored that sole finding resolved and returned ship for the correction scope. This audit does not reopen or certify historical whole-site image-match gates.
