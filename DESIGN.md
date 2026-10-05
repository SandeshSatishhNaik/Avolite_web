---
name: AVOLITE
description: Exhibition Cutaway engineering storytelling system
colors:
  bg-0: "#F4F2F7"
  bg-1: "#FFFFFF"
  bg-2: "#E9E5EE"
  line: "#D4CDDE"
  line-strong: "#80748F"
  text-1: "#171322"
  text-2: "#554D63"
  text-3: "#655B73"
  signal: "#344C83"
  signal-dim: "#586FA0"
  khaki: "#715828"
  action-ink: "#FFFFFF"
  st-built: "#176442"
  st-simulated: "#285691"
  st-prototype: "#785010"
  st-designed: "#654195"
  st-planned: "#5D526C"
  st-illustrative: "#715828"
  plate: "#FFFFFF"
  brand-khaki: "#BCAC87"
  brand-green: "#2D4639"
  plum-bg-0: "#191525"
  plum-bg-1: "#211C30"
  plum-bg-2: "#232035"
  plum-line: "#443B55"
  plum-line-strong: "#706581"
  plum-text-1: "#EEEAF3"
  plum-text-2: "#C4BDD0"
  plum-text-3: "#ACA3BA"
  plum-signal: "#B8C9ED"
  plum-signal-dim: "#839BCB"
  plum-khaki: "#CFB99A"
  plum-action-ink: "#191525"
  plum-st-built: "#3DDC97"
  plum-st-simulated: "#6FB3FF"
  plum-st-prototype: "#F2B84B"
  plum-st-designed: "#B99CFF"
  plum-st-planned: "#9AA8BA"
  plum-st-illustrative: "#CFB99A"
typography:
  display:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "clamp(96px, 7.3vw, 112px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "clamp(2.125rem, 1.4rem + 2.4vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.08
  title:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "clamp(1.375rem, 1.1rem + 0.9vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.08
  body:
    fontFamily: "IBM Plex Sans, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.875rem"
  status:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "12px"
    lineHeight: 1.4
  metric:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "48px"
    lineHeight: 1.1
rounded:
  panel: "4px"
  chip: "2px"
  hero-action: "8px"
spacing:
  sp-1: "4px"
  sp-2: "8px"
  sp-3: "12px"
  sp-4: "16px"
  sp-5: "24px"
  sp-6: "32px"
  sp-7: "48px"
  sp-8: "64px"
  sp-9: "96px"
components:
  button-primary:
    backgroundColor: "{colors.khaki}"
    textColor: "{colors.action-ink}"
    rounded: "{rounded.panel}"
    padding: "14px 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.signal}"
    rounded: "{rounded.panel}"
    padding: "14px 28px"
  field:
    backgroundColor: "{colors.bg-1}"
    textColor: "{colors.text-1}"
    rounded: "{rounded.panel}"
    padding: "8px 16px"
  panel:
    backgroundColor: "{colors.bg-1}"
    textColor: "{colors.text-2}"
    rounded: "{rounded.panel}"
    padding: "32px"
  status-simulated:
    textColor: "{colors.st-simulated}"
    rounded: "{rounded.chip}"
    padding: "3px 8px"
  figure-plate:
    backgroundColor: "{colors.plate}"
    rounded: "{rounded.panel}"
    padding: "12px"
---

# Design System: AVOLITE

## Overview

**Creative North Star: "Exhibition Cutaway"**

Exhibition Cutaway presents AVOLITE as an engineering exhibit. Condensed headings establish scale, labelled linework explains relationships, and source artifacts remain inspectable. Pearl is now the default page-scale presentation; selectable Plum retains its dark opening, raised shelf and light supporting chapters. The cutaway composition and typography remain shared. The supplied logo remains the identity asset.

The system is flat, deliberate and evidence-conscious. Written statuses distinguish implemented, simulated, prototype, designed, planned and illustrative material. Local fonts, native disclosures and complete static diagrams support reading before interaction.

**Key Characteristics:**

- Condensed display with open technical prose.
- Default Pearl and persistent Plum with matching annotations, action ink and status colors.
- Hairline dividers and unmodified white figure plates.
- Finite explanations with a one-time cutaway introduction and reader controls.

Recorded from src/styles/tokens.css, global.css, site.css, src/App.tsx, components/Primitives.tsx and Widgets.tsx on 2 October 2026; sampled against desktop and mobile review captures. The user selected the Exhibition Cutaway image and accepted the current React build with disclosed review limits. This is not whole-surface reviewer approval: build finish disposition remains fix and the hero gate remains open. FORM seed 9ce5bfbd is recorded in the brief; a separate originating roll log is unavailable, so lineage is unproven.

## Colors

Pearl neutrals surround blue annotations and dark khaki actions by default. Frontmatter semantic keys describe the default Pearl palette; plum-prefixed entries record the selectable dark overrides. Shared plate and brand colors do not change. In source, root without data-theme="plum" and explicit light chapters use the Pearl mapping; the Plum root uses its original palette.

### Primary

- **Annotation blue** (signal / plum-signal): links, diagram strokes, focus and selected states.
- **Quiet annotation blue** (signal-dim / plum-signal-dim): secondary diagram connections.

### Secondary

- **Khaki action** (khaki / plum-khaki): dark khaki in Pearl and pale khaki in Plum. Explicit action-ink / plum-action-ink pairs white ink with the dark fill and plum ink with the pale fill; primary action text never derives from the page background.
- **Brand khaki and green** (brand-khaki / brand-green): supplied logo palette; Pearl uses brand green; Plum retains the reversed logo treatment.

### Tertiary

- **Evidence categories** (st-built, st-simulated, st-prototype, st-designed, st-planned, st-illustrative): green, blue, amber, violet, slate and khaki evidence labels; unprefixed entries supply darker ink on Pearl and plum-prefixed entries restore the original dark-context status colors. These are categories, not decorative success indicators.

### Neutral

- **Plum ground, panel and shelf** (plum-bg-0 / plum-bg-1 / plum-bg-2): page, inset controls and raised chapter/footer surfaces.
- **Pearl ground, white panel and pearl shelf** (bg-0 / bg-1 / bg-2): default page, panels and raised surfaces. Existing light supporting chapters become white within the Pearl page and retain their Pearl palette within Plum.
- **Primary, body and quiet text** (text-1 through text-3 and plum counterparts): headings/readouts, prose and captions.
- **Hairline and strong boundary** (line / line-strong and plum counterparts): rules, tables and field borders.
- **Original figure white** (plate): unmodified MATLAB exports in either context.

### Named Rules

**The Context Pair Rule.** Switch surface, text, line, annotation, action-ink and status palettes together when changing theme or entering an explicit light chapter.

**The Evidence Label Rule.** Color accompanies a written status; appearance never upgrades evidence.

## Typography

**Display Font:** Anton; Impact and sans-serif are emergency fallbacks, not approved alternate identities.

**Body Font:** IBM Plex Sans, with Arial and sans-serif fallbacks.

**Label/Mono Font:** IBM Plex Mono, with monospace fallback.

**Character:** Dense display contrasts with open prose. The shipped site overrides historical heading weights to regular (400) and normal stretch.

### Hierarchy

- **Display:** frontmatter describes the desktop hero. At 1280px and above its horizontal scale is (0.92). At 1024–1279px the size is (8vw); at 768–1023px it is clamp(70px, 10vw, 96px); below 768px it is clamp(44px, 11.9vw, 82px), normal wrapping and line-height (1.06). The transform is specific to this hero.
- **Headline / title:** frontmatter ramps govern ordinary headings. Shelf, stage and final-action headings have local overrides.
- **Body:** frontmatter size below 1280px, then (1.125rem); prose measure at most (64ch).
- **Lead:** ordinary leads use clamp(1.125rem, 1rem + .65vw, 1.5rem) at line-height (1.5). Hero prose is (24px), (21px) below 1280px, (20px) on mobile and (26px) above 1440px.
- **Label / status:** mono units and identifiers use the label role; tags use the status role. Quiet prose captions remain Plex Sans.
- **Metric:** frontmatter role, reduced to (34px) on mobile; units remain separate mono text.

### Named Rules

**The Reading Voice Rule.** Use Anton for hierarchy, Plex Sans for prose and native controls, and Plex Mono for units, identifiers and status tags.

## Layout

A centered container has maximum width (1440px), with horizontal padding (16px), (40px) from 768px and (80px) from 1280px. Hero and shelf expand to (1536px) with (68px) padding above 1440px. Reused spacing follows the recorded four-pixel rhythm; component-specific values remain local adjustments.

Chapters use vertical padding (112px), reduced to (80px) below 1280px and (64px) under 768px. Split layouts use equal, 1.5:1 or 1:2 columns with gaps (48px), then (32px), then one column on mobile.

The desktop hero pairs 1.25:1 columns with a (40px) gap and stacks below 1024px. The shelf moves from three columns to two at 768–1023px, with its introduction spanning both, then one on mobile. Evidence navigation narrows from (230px) to (180px), then becomes a nonsticky two-column list. Mobile uses native stage disclosures instead of the duplicate stage canvas. Target tables become labelled row stacks; metric summaries retain three compact columns.

These are observed responsive patterns, not a universal requirement to repeat the home hero composition. All eight home subjects remain on one route, with system and evidence appendices.

## Elevation & Depth

No box shadows are present. Depth comes from tonal surface changes, thin borders and stacked outlined diagram planes. White export plates preserve artifacts rather than tinting them.

### Named Rules

**The Flat Exhibit Rule.** Use tonal surfaces, borders and linework for depth; the shipped system has no box-shadow.

## Shapes

Panels, fields and ordinary buttons use rounded.panel; status tags use rounded.chip. The desktop hero action uses rounded.hero-action. Stage rows and navigation panels remain square.

Ordinary borders and diagram planes are hairlines (1px); structural paths are (1.5px). Active planes increase to (2.5px), fill with the raised surface and expand node radius from (5px) to (7px). Dashed cutaway paths use (7 7); stage return paths use (5 5). SVG symbols inherit color. These are native exhibit geometry.

## Components

### Buttons

Direct, restrained actions. Primary links use the frontmatter token, minimum height (56px) and weight (600); secondary links use transparent fill with a strong border. Hover opacity is (0.9). Native controls have minimum height (44px), panel fill and strong border; pressed controls use raised fill and annotation-colored text/border. Disabled opacity is (0.5).

Desktop hero actions use Plex Sans (25px, weight 500), minimum width (307px), minimum height (64px), padding (14px 20px) and the hero corner. Their label span compresses horizontally (0.86). Mobile hero actions currently use Anton (23px), a local variant rather than a general control replacement.

Interactive components retain an annotation outline (2px), offset (4px). Opacity and border-color transitions use (120ms ease-out) only without reduced-motion preference. Inline arrows move horizontally (4px) over (180ms); buttons and action links compress to scale (0.98) while pressed. These movement responses also require no reduced-motion preference.

### Chips

Compact mono evidence outlines use status color, shape and padding from frontmatter. SIMULATED has a filled circle; DESIGNED a ring; PLANNED and ILLUSTRATIVE use dashed borders with a dashed ring or hatch. Written statuses remain explicit. Tags do not represent selection.

### Cards / Containers

Panels use the frontmatter panel token, hairline border and mobile padding (20px). Scope banners and source context use raised surfaces. Pending media remains an explicit bordered placeholder. No hover lift is implemented.

### Inputs / Fields

Native selects and text inputs use the field token and minimum height (44px). Textareas use full width and padding (12px). Human-review modification presents a labelled required textarea and a live outcome. No separate visual error variant is implemented.

### Navigation

Desktop header: sticky opaque ground surface, bottom hairline, height (72px). Plex Sans links and Story's native disclosure have minimum height (44px), with gaps (40px), reduced to (24px). Current chapter links use an annotation-colored border.

Below 768px the header becomes relative and a native Menu disclosure expands in flow. The progress line hides. Footer links wrap and stack with the logo on mobile. Supporting appendix links underline the current location. Native same-origin cross-document view transitions preserve the header as a separate navigation element: the outgoing root fades over (160ms), while the incoming root fades and moves from (6px) over (260ms). The transition group uses (260ms) and the source ease-out token. Unsupported browsers retain ordinary navigation; reduced motion disables page transitions.

### Disclosures and figure plates

Native details provide source, stage and table access. Summaries use minimum height (44px), a top hairline and plus/minus state markers. Open disclosure content receives a native (220ms) opacity/vertical reveal from (-4px); reduced motion removes it. White figure plates carry source badges and pinned links beneath; relevant figures offer tabular access. A ground-colored inspection overlay inside the plate provides a (44px) target, with annotation-colored border emphasis on hover/focus. Table rows use raised tonal feedback on hover.

### Figure inspection

Original figure links progressively open a native modal dialog. Previous/next controls and Left/Right keys navigate unique figure exports; zoom changes in (0.5) steps from (1x) to (3x). Reset restores (1x) and the scroll origin. The focusable white canvas supports scrolling and non-touch pointer dragging when zoomed; touch retains native scrolling. Escape, Close and clicking outside the dialog close it, release background scroll lock and restore focus to the opener. Native modal focus containment, visible focus, a labelled title, image alt text, pinned source link and live figure/zoom status remain available. Failed loading reports a source/next-figure fallback. Modified clicks and no-JavaScript links continue to open the original export.

The viewer uses the existing ground/text/strong-line palette and panel corner, maximum width (1320px), viewport margins (24px), padding (24px) and a (0.9) ground backdrop. Its canvas is white; mobile margins/padding reduce to (8px)/(16px) and canvas height follows the export ratio. Opening fades/scales over (220ms) only without reduced-motion preference. This inspection surface preserves original figure colors and axes.

### Cutaway and walkthroughs

Seven labelled planes, a return path and separate SIMULATED foundation / DESIGNED scheduler boundaries remain complete before and throughout playback. At least (75%) of the cutaway must remain visible through a (400ms) delay before its first eligible introduction plays once through seven stages: six advances at (900ms), then a final Scan again hold of (1600ms). Playback lasts (7000ms), following the (400ms) entry delay. This is a scoped onboarding exception, not ambient animation or a site-wide autoplay pattern. Pause, resume, replay, next, reset and pointer/Enter/Space stage selection give the reader control. Manual interaction cancels the pending introduction. Leaving the visibility threshold or hiding the document pauses playback; an interrupted sequence does not automatically resume. Starting another player pauses this one. ScanDemo remains manually started, with six steps at (600ms).

The active plane has a normalized outline trace lasting (600ms); its underlying outline remains visible at reduced emphasis. A signal route joins stages and the signal head moves over (600ms), with a (500ms) arrival ring. At the final stage during playback, one return marker waits (600ms) for the head arrival, then travels the feedback path over (800ms). Dashed flow runs at (900ms linear) only while playing and stops with playback. The prior standalone initial return-connection trace is no longer implemented. Existing plane stroke/opacity transitions remain (240ms ease-out). Stage buttons expose pressed state and stroke-based focus feedback; stage-canvas ports fill with annotation blue for selection. Router progress lines reveal selected/completed steps over (280ms).

Reduced motion skips automatic introduction, timed playback and spatial/trace effects. All labels, evidence boundaries, manual selection, stepping and reset remain available. Stage status live announcements are off during playback and polite for manual changes. The earlier signal-only scope is superseded by the authorized chapter and scroll extension below.

### Selection feedback

Stage, route, skill, failure, human-review and role results use shared native feedback after an explicit selection: opacity (0.6) and vertical offset (4px) settle to the final state over (220ms), using cubic-bezier(.16, 1, .3, 1). The initial render does not animate. New feedback cancels previous animations; reduced motion retains final content and manual controls without movement.

### Themes and reading motion

The header provides a native theme button with a circular annotation swatch, minimum height (44px), minimum width (88px), font size (14px) and horizontal padding (12px). It names the destination: Plum in Pearl, Light in Plum. At 768–1100px the control narrows to (76px), size (13px) and padding (10px); on phones it sits inside Menu with a (48px) left inset. Disabled controls remain hidden until initialized.

The startup preference script applies stored Plum before paint; other or absent values use Pearl. Theme choice is stored under avolite-theme; denied storage still permits a change for the current page. Without JavaScript, Pearl and native menus stay readable and the inactive switch hides. Theme changes use native view transitions where supported, otherwise immediate replacement; reduced motion always switches immediately. The browser theme-color metadata follows the selected ground.

Finite entrance observers trigger once at (15%) visibility, using native animations of (650ms), cubic-bezier(.16, 1, .3, 1), and backwards fill. Hero/chapter/appendix headings reveal through an inset mask and settle vertically from (12px). Shelf items, captions, safeguard rows, milestones and comparison content settle from opacity (0.7) and (12px). Schedule cells and recording scene bookmarks settle from opacity (0.55) and horizontal offset (-8px), staggered by (45ms) up to (240ms). The paired decisions enter from opposing offsets (-20px / 20px), opacity (0.65). The closing heading settles from scale (0.97), opacity (0.65). Every element starts in its readable final state; no perpetual entrance or parallax loop is introduced.

Only visible schedule, system, figure, roadmap and comparison scenes receive scroll-progress updates through the existing requestAnimationFrame scheduler. A schematic six-position schedule marker moves across the row; its adaptive variant uses (180ms steps(5, end)). A normalized pathLength (1) system spine traces through stroke-dashoffset; stage selection remains separate and authoritative. Figure frames and the comparison underline extend a (2px) annotation rule. The roadmap rail grows along the reading position without indicating milestone completion; section-heading rules track chapter reading. Only accents move: original plot pixels, issued metrics, engineering states and anchor history remain intact.

Hidden documents cancel active entrances; preference changes cancel them and reduced motion bypasses entrances and scroll updates. Native finite effects use transforms, opacity, clipping and SVG strokes with no animation dependency. Static content, existing manual controls and prior cutaway onboarding timings remain available.

### Documentary recording and dashboard captures

The supplied browser recording extends the existing exhibit system without new palette or type roles. A bordered panel-color frame reserves a stable (16:9) aspect ratio. Its original poster remains visible until the visitor requests the player; a khaki action with explicit action ink overlays it at (20px) from the left/bottom, minimum height (56px), padding (12px 20px) and panel corner. On phones those offsets reduce to (12px), minimum height to (44px), padding to (8px 12px), type to (14px) and the inline play symbol to (20px). The recording metadata row reserves at least (64px).

A native source link works without JavaScript or with modified clicks. An ordinary request mounts the titled Drive iframe with fullscreen and autoplay permission delegated to the provider controller; there is no autoplay query, initial video payload or automatic playback. The visitor then uses Drive Play. Close unmounts it and returns focus to the launch link; hidden documents and offscreen players unmount it. Layout/focus scrolling completes before the offscreen observer starts. A native Drive fallback stays visible while the embed is mounted or unavailable; remote loading and auxiliary provider errors remain external limitations. The supplied player has no available captions and no transcript was supplied.

Recording bookmarks identify sampled moments at 00:30, 01:30, 02:30, 03:30 and 04:30, rather than inferred chapter starts. They use native source links, mono time labels, minimum height (56px), a bottom hairline and an inline directional symbol. No demo credentials are embedded in source.

Smart Scan is the default capture; Surveillance and Unknown signals appear inside native disclosures. Documentary plates retain original raster colors and aspect ratios on the existing white plate, with a strong hairline and inspection affordance. On phones the inspection action moves into document flow below the image. Captions pair a written PROTOTYPE tag with a Plex Sans title, illustrative-interface explanation and source-dashboard link. Browser prototype media remains visually and semantically distinct from SIMULATED MATLAB artifacts; it never upgrades scheduler, AoA or hardware claims. Original PNGs carry embedded origin metadata; responsive WebPs carry dashboard provenance sidecars and are resized without recoloring. Separate MATLAB recording/captures and engineering validation remain pending.

### Selected-comp labels

The AVOLITE hero label and EVIDENCE shelf label are scoped exceptions inherited from the explicitly selected composition. Their presence does not establish an eyebrow pattern for other surfaces or components.

## Do's and Don'ts

### Do:

- **Do** preserve the supplied logo and local font pairing.
- **Do** switch complete theme palettes together.
- **Do** retain written evidence labels, source links and original figure plates.
- **Do** keep native disclosures, visible focus and complete static diagrams.
- **Do** keep playback finite and paused when hidden or offscreen; reserve automatic playback for the one-time cutaway introduction and retain immediate manual control.

### Don't:

- **Don't** infer engineering success from color or illustrative animation.
- **Don't** recolor original MATLAB figures to fit the interface.
- **Don't** carry historical navy, Archivo, Astro or GSAP prescriptions into this React system.
- **Don't** extend the selected hero/shelf label exceptions into a general eyebrow style.

Not canonized or repaired: other illustrative uppercase kickers, mobile metric tags at 9px with glyphs hidden, the prototype badge's missing half-circle distinction, and system display fallbacks. These are craft/accessibility drift rather than reusable rules; documentation does not repair them. Unused historical surface, error, motion and readout declarations are excluded. User acceptance does not close the separate reviewer gate. Motion-extension documentation was refreshed on 3 October 2026 from src/styles/motion.css, src/scripts/inspect.ts, src/scripts/shell.ts and Widgets.tsx, with .planning/redesign/MOTION-ENHANCEMENT.md as the authorized extension brief. The independent reviewer returned ship with no material fixes for this motion extension; this does not assert whole-surface approval or close the historical gate.

Cutaway onboarding record refreshed on 5 October 2026 from Widgets.tsx and motion.css against the scoped MOTION-ENHANCEMENT.md extension. The 3 October extension review remains historical; the 5 October scoped onboarding reviewer returned ship with no material fixes (.impeccable/review/onboarding-final-verdict.json). Recordings were not played; temporal behavior was assessed from source timings and supplied browser checks. A separate QUALITY BAR card was unavailable; WebKit and field performance remain unverified. This does not certify the whole design or close historical image-match and FORM-lineage limits.

Pearl/theme and page-wide scroll extension recorded on 5 October 2026 from tokens.css, global.css, motion.css, scroll-motion.ts, shell.ts, Header and index.html against LIGHT-MOTION-SPEC.md and the current PRODUCT/AGENTS overrides. This authorizes a default light opening, persistent alternate theme and chapter/scroll effects beyond the historical constraints. Final source renders the system SVG at (550px), matching its viewBox and (74px) stage-row geometry; the positioned stage index at z-index (1) keeps return linework behind labels. The completed scoped reviewer returned ship for the authorized Pearl/Plum theme and page-wide scroll-motion extension, including the resolved spine alignment, with no open material fixes (.impeccable/review/light-motion-final-verdict.json). All 16 required same-path replacement captures were reopened and valid; only the authoritative system detail and viewport/full-page captures support this verdict, not supplemental system-fixed captures. This is not whole-surface certification.

TypeScript, production build and 65 node/data/build checks pass. The final isolated Chromium/Firefox full suite records 74 expected passes, zero unexpected failures and zero flaky checks (light-motion-clean-suite.json). The focused correction run retains 16 passing theme, scroll, alignment and accessibility checks, including the previously timed-out case. The earlier expanded run of 73 passes and one Firefox navigation timeout during concurrent capture, 70-check full suite and four normal-transition passes remain separate historical audit evidence. Production totals are (69,433 bytes gzip JavaScript) and (7,961 bytes gzip CSS). See .planning/audits/LIGHT-MOTION-VERIFICATION.md for test evidence.

Previously blocked craft-floor, EXPERIENCE, stage-source and validation-report reads are now complete for the extension review. A separate QUALITY BAR remains unavailable. Real-time sampled frames and state logs at 1440 and 390 widths show partial heading masks settle to complete readable text with no active animation/transform; runtime reduced motion cancels a new heading effect and restores final clip/transform states. Offscreen cutaway playback remains paused at the same stage over the sampled 1050ms interval. Theme transitions are active in the early samples and complete by the final approximately 400ms sample; both widths record no page errors (light-motion-temporal.json and light-motion-timing-1440/390.png). This is bounded temporal sampling, not continuous-video or frame-rate evidence: recorded video remains unplayed and continuous smoothness is unverified. WebKit and Lighthouse/field performance remain unverified. Prior image-match, FORM-lineage and user-acceptance limits remain historical. No deployment or push is authorized.

Supplied recording/gallery extension documented on 5 October 2026 from RecordingPlayer.tsx, DemoMedia.tsx, DashboardImage.tsx, demo.ts, App.tsx, site.css and scripts/media.mjs against PRODUCT.md and DEMO-ASSETS.md. The media slots are fulfilled by browser-prototype assets, not by separate MATLAB recording or engineering validation. Actual embedded Drive playback reached readyState (4), paused (false), duration (316.302 seconds), and currentTime advanced from (1.396) to (38.856 seconds); demo-live-player.png records the bounded playing state. Provenance inspection covered 46 shipping rasters with zero missing records.

The media verification audit records type/build and 65 node checks passing, eight focused media checks passing, and ten corrected media/figure-dialog checks passing in Chromium/Firefox. Its expanded full suite records 81 passes and one prior native close-event assertion race; expect.poll corrects that asynchronous assertion and the focused rerun passes, but no clean 82-check full rerun is claimed. This build totals (70,558 bytes gzip JavaScript) and (8,276 bytes gzip CSS). The fresh reviewer returned ship for the sole resolved media-state-evidence finding only: secondary galleries, mounted/unavailable player, close/fallback and actual playback evidence were reopened across both palettes and three widths. This is not whole-site approval; no new QUALITY BAR or composition comp was supplied. See .planning/audits/DEMO-ASSETS-VERIFICATION.md and .impeccable/review/demo-final-verdict.json.

Historical image-match/FORM, WebKit, continuous smoothness and field-performance limits remain. The user subsequently authorized replacing and pushing the site; Git/R2 publication is handled separately. R2 media integration is now implemented and verified; Git push and Pages deployment are not yet completed.

Media storage boundary: production image URLs use release 54ed0a7745596657 in Cloudflare R2 bucket avolite at https://pub-96bddf2fe30d456a9831b0b2675e65a5.r2.dev. All 84 public objects (42 WebPs and 42 provenance JSON sidecars) were verified by SHA-256 and content type. Development uses local /media; local image exports remain in dist. Fonts, CSS and JavaScript remain on Pages; the recording remains on Drive. storage.json pins the raw-source hash rather than native encoder output, avoiding Windows/Linux encoding differences; changed source media requires assets:r2 upload before build acceptance. No palette or visual-system change accompanies storage routing.

R2 integration verification records type/build and 66 node checks passing. The full browser run records 80 passes and two immediate lazy-image assertion failures; those assertions now await decoded/loading state, with both focused correction checks passing and zero unexpected failures/flaky checks (r2-correction.json). No clean 82-check run is claimed. Cloudflare Pages avolite is connected to SandeshSatishhNaik/Avolite_web on claude/dazzling-rubin-69x39p with npm run build, dist output, Node 24 and SITE_URL=https://avolite.pages.dev; configuration does not establish a completed push or deployment. Earlier scoped design-review limits remain.
