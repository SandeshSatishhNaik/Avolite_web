# AVOLITE — page, interaction and motion specification
Date: 2 October 2026

Status: React implementation verified; user accepted the current design with the final correction verdict disclosed (six findings resolved, two partial).

Visual authority: selected Exhibition Cutaway mockup, .impeccable/mocks/decision/exhibition.png.

**Theme and scroll extension — 5 October 2026:** The user's later request authorizes a Pearl default theme, a persistent Plum switch and motion throughout the page, including scroll-linked scenes and chapter entrances. `.planning/redesign/LIGHT-MOTION-SPEC.md` supersedes the historical no-theme-switch, dark-hero-only and restricted entrance-motion rules below. The selected composition, evidence boundaries and native React architecture remain authoritative.

**Implementation reconciliation — 2 October 2026:** The later explicit React request supersedes Astro throughout this plan. The shipped stack is React 19/Vite/TypeScript with static prerendering and selective widget hydration. Anton is the self-hosted display face matched to the approved condensed lettering; IBM Plex Sans and Mono remain supporting fonts. Native React state, finite user-started playback and CSS stroke transitions implement motion without GSAP. Auxiliary pages retain server-rendered reading content. See README.md for commands and verification limits. Historical proposed font/stack choices below do not override these implemented decisions.

**Motion extension — 3 October 2026:** The user requested more interaction, animation and premium polish within this direction. `.planning/redesign/MOTION-ENHANCEMENT.md` records the implemented native signal-path motion, stage selection, user-input feedback, navigation continuity and original-figure inspection. The full final browser run passes 52 Chromium/Firefox checks; source issuance and original export colors remain unchanged.

This specification resolves the remaining layout and interaction decisions. It takes precedence over conflicting proposal details in REDESIGN-PLAN.md and obsolete requirements listed in section 10 below. It does not change the approved hero identity, data safeguards, or application source.

## 1. Scope and reference coverage
**Decision: one complete scrolling main page, with introduction plus the same eight subjects as Avoflare.** None moves exclusively to another route. Two auxiliary pages provide depth without interrupting the main story.

I checked [Avoflare's main page](https://avoflare-web.pages.dev/) with a fresh retrieval on 2 October 2026, plus its [expanded how-it-works view](https://avoflare-web.pages.dev/how-it-works.html). The reference supplies the section taxonomy and patterns: requirement map, system explanation, artifact gallery, decision interaction, chaptered video, safeguards, milestones and rationale. These are adapted to AVOLITE's available evidence. No Avoflare engine, flight, telemetry, security or performance claims transfer.

| Avoflare coverage | AVOLITE destination | Decision |
|---|---|---|
| Introduction | /#top | Selected Exhibition Cutaway hero; immediate access to content |
| The problem | /#problem | Scanning problem, qualitative contrast, requirement/evidence map |
| How it works | /#how | Conceptual scan loop and detailed system boundary |
| What we built | /#built | Actual radar DSP exports, source-backed metrics and artifacts |
| What's new | /#new | Proposed cluster/skill decisions, router and human oversight |
| Demo | /#demo | Walkthrough, illustrative scan comparison and pending video |
| Security | /#security | Designed provenance, failure response and human review |
| Roadmap | /#roadmap | Evidence-gated engineering milestones |
| Why Avoflare | /#why | Why AVOLITE should be evaluated; comparison and role-specific value |
| Expanded system view | /system/ | Full architecture and readable step-by-step explanation |
| Evidence appendix | /evidence/ | AVOLITE addition: full source context, tables and figure plates |

Retain /preview/ as a noindex internal gallery. Include a useful 404 page. No separate routes for each of the eight homepage chapters. Preserve all existing anchor IDs, including new; use /#new rather than copying Avoflare's whatsnew ID.

**Judge journeys**
- Quick scan: introduction → evidence shelf → What we built → roadmap.
- Full explanation: introduction → eight chapters in order.
- Verification: a claim → source/context on /evidence/ → return to the originating anchor.
- Technical scrutiny: /#how → /system/ → relevant evidence.

## 2. Overall layout, hierarchy and placement
### Global frame
- Desktop ≥1280px: 1440px maximum outer frame; 80px side padding; 12 columns; 24px gutters.
- Tablet 768–1279px: 40px side padding; 8 columns; 24px gutters.
- Phone <768px: 16px side padding; 4 columns; 16px gutters.
- At 1440px the content width is 1280px. A 6/6 split yields roughly 628px per column; 5/7 is roughly 519/737px. These are layout values, not project metrics.
- No fixed section heights. The hero is content-led and should resemble the approved composition; never force the title/diagram below a viewport-height clipping boundary.
- Section block padding: 112px desktop, 80px tablet, 64px phone. Evidence shelf: 40/32/24px.
- Header-to-content spacing: 64px desktop, 48px tablet, 32px phone. A section heading sits 40px above its principal content, 32px on phone.
- Use open rows and shared baselines; boxes are for actionable tools, plot plates and bounded evidence. Avoid a repeated card grid in every section.

### Placement rhythm
| Element relationship | Desktop | Phone |
|---|---:|---:|
| Section label to heading | 12px | 12px |
| Heading to lead paragraph | 20px | 16px |
| Lead to action group | 32px | 24px |
| Between related controls | 12px | 12px |
| Visual to caption | 12px | 12px |
| Caption to provenance | 8px | 8px |
| Between content groups | 48px | 32px |
| Panel internal padding | 32px | 20px |
| Between unrelated major blocks | 64px | 40px |

Keep captions, status and source adjacent to the visual they qualify. A separate footer disclaimer never replaces local scope information.

### Typography
- Display: Archivo, condensed to match the approved image; weight about 650–700 after font-axis inspection. Target 96px at the desktop reference and 48px phone, line-height 0.98–1.04. Allow 3–4 lines on a phone rather than shrinking text to preserve desktop wrapping.
- Section headings: Archivo 56/44/34px desktop/tablet/phone, line-height 1.08.
- Subheadings: 26/24/22px, line-height 1.2.
- Body: IBM Plex Sans, 18px desktop and 17px phone, line-height 1.6; maximum 64ch.
- Labels/captions: 14px minimum; essential chart labels 14px where practical. Mono only for IDs, units and compact technical annotations.
- Use ordinary sentence case. Stage names and provenance badges may be uppercase; paragraphs and buttons are not.
- The exact condensed hero must be tested against the installed Archivo font axes. If the available subset cannot reproduce it, resolve font delivery before implementation; do not silently substitute a broad headline.

### Color sequence
| Region | Surface | Why |
|---|---|---|
| Header, hero, evidence shelf | Plum #171322 / #282237 | Preserve the approved opening |
| Problem | Pearl #F4F2F7 | Clear reading and requirements |
| How it works | Plum #171322 | Give the signal diagram focus |
| What we built | Pearl #F4F2F7; white plots | Let actual exports remain legible |
| What's new | Raised plum #282237 | Separate proposed intelligence from existing proof |
| Demo | Deep plum #171322 | Bound the replay/explainer |
| Security | Pearl #F4F2F7 | Make controls and caveats easy to inspect |
| Roadmap | Pearl, separated by a structural rule | Keep adjacent planning chapters calm |
| Why AVOLITE and final CTA | Plum #171322 | Close in the selected identity |
| Footer | Raised plum #282237 | Quiet close |

Dark ink on light: #171322 heading, #554D63 body/caption. Dark surfaces: #EEEAF3 heading, #C4BDD0 body, #ACA3BA caption. Khaki #CFB99A is the primary action with dark text. Blue #B8C9ED carries signal emphasis on dark; use dark blue #344C83 on light. All six status palettes need surface-aware variants; label and glyph carry the meaning. Real plots remain white, unaltered.

No theme switch, background crossfade, gradients, glass panels, ambient grain animation, or decorative glowing text. Section color changes happen at normal scroll boundaries.

## 3. Header and navigation
Preserve the mockup's slim horizontal composition:
- Logo left, at least 40px lockup height or approved mark+wordmark variant.
- Right: **Story / System / Evidence / Repository**. Story opens a compact numbered chapter index; System and Evidence lead to auxiliary pages.
- Each of the eight chapter links includes its title and one-line purpose. This supplies Avoflare-equivalent navigation without crowding eight names into the hero header.
- Desktop sticky header: 72px; a 1px bottom rule. It keeps the same surface and does not shrink, morph or add a shadow.
- A 2px reading-progress line beneath the header is decorative, labelled only through the current chapter navigation. No percentage readout.
- Current anchor uses aria-current and a visible line/word treatment. Progress is reading position, not engineering completion.
- Anchors receive scroll margin equal to header height plus 24px. Native history and Back work normally.
- Under 768px the header is static: logo left, Menu right. Use a native disclosure in normal document flow with all chapter links plus System/Evidence/Repository. With JS, close it after selection and on Escape; without JS, the link still reaches content and the open menu remains above rather than covering it.
- The mobile disclosure is non-modal: no inappropriate focus trap. A skip link always precedes navigation.
- Desktop/tablet menus must stay within the viewport and remain operable at 200% zoom.

## 4. Section-by-section decisions

### Introduction — the selected hero
**Purpose:** state the project and its evidence boundary immediately.
**Desktop placement:** text left 7 columns, cutaway right 5, adjusted optically to the approved image's approximately 54/46 visual balance. Heading leads; copy below; khaki Explore the system button and secondary Inspect the evidence link below that. Diagram caption above, scope note below. No new sidebar in this viewport.
**Diagram:** seven countable SVG layers, Observe at the base through Scan again at the top. Explicit start marker and directional path. Labels stay horizontal. Annotate radar DSP evidence separately from proposed integrated ES behavior; do not mark a whole receiver-to-detection ES chain as validated.
**Destinations:** Explore the system → /#how; Inspect the evidence → /#built. Evidence-shelf links open /system/ and /evidence/ respectively. The homepage retains the complete first explanation before offering depth.
**Evidence shelf:** 5/3.5/3.5 visual balance: Evidence before claims introduction, MATLAB results link with SIMULATED, designed loop link with DESIGNED. On the 12-column implementation, use 5/3/4 unless content requires equal right columns.
**Motion:** final static layout first. Play the loop starts a 3.2s conceptual sequence: seven 400ms stage intervals plus 400ms hold. A small marker traces the connector, the active plane gains stroke emphasis; labels and metrics never count up. Pause/Resume and Replay are visible. No automatic preloader.
**Phone:** heading, copy, actions, simplified readable layer diagram, scope, stacked evidence shelf. Diagram max width 480px; captions outside the SVG where needed. Buttons wrap without forcing two narrow columns.

### 01 — The problem
**Suggested heading:** “The next scan is a decision.”
**Desktop placement:** 5 columns for problem statement and why timing matters; 7 for Today / Required comparison. Below: a full-width requirement ledger and compact status legend.
**Content:** fixed sequential scanning versus the designed need for adaptive choices; emitter behavior categories from the source specification. Do not invent a category count to fill a grid.
**Visual:** two static schematic schedules aligned to one qualitative time axis. Mark as ILLUSTRATIVE. They explain timing, not measured improvement.
**Interaction:** comparison selector emphasizes one schedule while both remain inspectable. Requirement rows link directly to the relevant artifact or pending evidence. Highlight arrival with a 400ms outline-opacity change, not a page jump animation.
**Ledger:** requirement / evidence available / status / inspect. Sensitivity stays pending while SNR is undefined. ML scheduling remains designed; no tally of simulated requirements is computed from unrelated radar outputs.
**Phone:** copy → comparison → ledger cards → legend. No horizontal chip carousel.

### 02 — How it works
**Suggested heading:** “One loop. Seven decisions in context.”
**Desktop placement:** 8-column annotated system canvas left; 4-column stage explanation right. Underneath, two concise callouts: observation versus ground truth, and exploration versus exploitation.
**Initial state:** complete static overview. Diagram button selection reveals the stage's purpose, input, output, implementation status and evidence link. Previous/Next are offered below the explanation, with a textual position indicator.
**Motion:** selected stage changes in 240ms; signal travel across its connector takes 450ms. Only the selected diagram state changes. First section entry may emphasize the whole feedback path once over 600ms; no repeating cycle.
**Scrolling:** a short desktop diagram may remain sticky within its own two-column block only when it fits beneath the header. No pinned scroll duration, artificial spacer or scroll-scrub dependency.
**Phone:** seven vertical stages, each with an inline native disclosure for detail. No scaled-down ring or pan/zoom canvas. All stage descriptions remain present with JS off.
**Deep link:** Open full system view → /system/. It adds full architecture detail, not missing homepage explanation.

### 03 — What we built
**Suggested heading:** “The foundation, with evidence.”
**First element:** plain SARRS scope banner: these are radar DSP/detection testbed outputs; they do not validate the proposed ES scheduler.
**Desktop placement:** a 3-column artifact index at left and a 9-column figure/evidence area at right. First artifact is the headline CFAR run. Below it: source-backed readouts, expected/detected comparison, full target table and limitations.
**Artifact groups:** detection and CFAR; range-Doppler; tracking/multi-PRF where matched evidence exists; rule-based decision baseline; dashboard pending capture. A name is not proof: list only substantive supported work.
**Interaction:** selecting an artifact changes its figure, caption, status and source together. Default content is server-rendered. A simple button selector is sufficient; no autoplay carousel.
**Charts:** two separate expected-versus-detected comparisons for range and velocity; never combine unlike units on one scale. Direct labels, reference hollow marker/dashed line, detected filled marker/solid line. Values flow through the existing issued-data helpers. Table stays available.
**Before/after:** default to complete side-by-side figures. Add a comparison slider only if two exports are genuinely registered to the same axes, dimensions, run and meaning. Otherwise it would obscure evidence. Labels and color bars are never cropped.
**Motion:** a selected-row connector can draw over 450ms after explicit selection. Metric text is immediate and stable. Switching figures uses at most a 160ms opacity change and stable frame dimensions.
**Phone:** artifact selector becomes vertical disclosures; figure first, caption/source second, readouts then cards/table. Large original figure can open in a plain expanded view, with keyboard return and no forced zoom.

### 04 — What's new
**Suggested heading:** “Choose the signal. Then choose the analysis.”
**Desktop placement:** short introduction across 7 columns; two large decision blocks below, arranged 6/6. Under them, a single router lane and a worked-example inspector.
**Decision one:** which cluster fits the observation? **Decision two:** which skills are needed? Prediction and scan decision remain separate outputs.
**Interaction:** one Prev/Next walkthrough with Fast path / Escalation controls. Selecting temporal, relational or spatial skills changes a declared illustrative route through the designed model family. It does not run GNN/SSM/ST-GNN/RL in the browser.
**State:** initial explanation, selected step, selected path, end, reset. Switching path resets the step and clearly announces the new mode. No confidence gauge or made-up prediction score.
**Copy:** architecture DESIGNED; the worked sequence ILLUSTRATIVE. If source example values are included, register and validate them rather than hard-code them in markup.
**Motion:** connector stroke 240ms, selected explanation opacity 160ms, no block fly-ins. An optional selected node shift is capped at 8px.
**Phone:** decision one → decision two → router → walkthrough; no horizontally overflowing flowchart.
**Below:** planned ablation ladder with names and required proof, no invented outcomes.

### 05 — Demo
**Suggested heading:** “Follow a scan, step by step.”
**Desktop placement:** a 16:9 video/poster region across 8 columns with a 4-column chapter list. Beneath it, the in-browser explanatory module in a separate full-width panel.
**Video:** native controls; chapters seek to verified timestamps only after real footage arrives. Until then, a fixed-ratio “Demo footage pending” panel and proposed chapter outline. Do not fabricate timestamps or use unrelated placeholder footage.
**Explanatory module:** Fixed sweep / Adaptive concept timelines displayed together, using the same schematic scenario. Controls: Step, Play/Pause, Reset; a scenario selector for periodic and intermittent examples. A deterministic toy sequence is sufficient; no random reseed or speed control in the first version.
**Truth:** persistent “ILLUSTRATIVE — browser explanation, not the AVOLITE scheduler” inside the panel. No generalization, comparison percentage, fake confidence, or backend/model request.
**Motion:** 600ms per explicit playback step, pause available, stop at the end; do not loop. Use hit/miss shapes plus words. Manual Step works under reduced motion.
**Results access:** one link to /#built or /evidence/ replaces a second duplicate gallery. This preserves content coverage without making judges read identical tables twice.
**Phone:** poster → chapter list → explainer. Both comparison rows remain visible; labels do not scroll away independently.

### 06 — Security
**Suggested heading:** “Every decision needs a traceable path.”
**Scope:** design controls, not yet implemented or certified.
**Desktop placement:** 4 columns of selectable failure scenarios; 8-column response panel. Below: a 6/6 split for provenance/versioning and human review.
**Failure response:** chosen failure → proposed check → proposed fallback → what evidence would validate it. Use the architecture report's actual scenarios; validate the list before freezing copy. No imported Avoflare cryptographic standards or invented thresholds.
**Human review:** compact proposed-cluster panel with Approve / Modify / Reject and Reset. Local illustrative state only. Modify exposes a small labelled reason field; no server submission, persistence or engineering action. Outcome explicitly says “Illustrative review outcome.”
**Motion:** selected response updates in 180ms, a single path highlight takes 320ms. Approval shows inline text, not a success celebration or toast stack.
**Phone:** failure selector becomes native select or stacked buttons; response follows immediately in DOM order; human review below. Static fallback lists all failure-response pairs.

### 07 — Roadmap
**Suggested heading:** “Each stage earns the next.”
**Desktop placement:** 4 columns of context and dependency note; 8-column vertical milestone list. Evidence labels align on one baseline.
**Milestones:** radar DSP foundation; ES scene/receiver integration; AoA validation; fixed-sweep baseline and intercept metrics; learned scheduler; closed-loop comparison; hardware path. These are planning stages, not a claim of completion.
**Current evidence note:** “Radar DSP exports available. Integrated ES scheduling evidence pending.” Do not place an arbitrary percentage or WE ARE HERE marker until the engineering team confirms the stage.
**Each row:** intended outcome, available evidence/status, proof needed next. Optional disclosure reveals acceptance criteria.
**Motion:** none on scroll. Disclosure changes directly; focus/selection gets 120ms feedback. The roadmap is a reading section.
**Phone:** the same vertical list; no horizontal timeline, rotated labels or animated progress fill.

### 08 — Why AVOLITE
**Suggested heading:** “Make the next scan worth choosing.”
**Desktop placement:** headline across 8 columns, followed by a 6/6 qualitative comparison and evaluation criteria. Below: a role-value selector, then final actions.
**Comparison:** fixed policy versus proposed adaptive approach across observation use, changing conditions, compute allocation, human control and evaluation burden. Advantages are design hypotheses until measured.
**Roles:** evaluator, RF/DSP engineer, system integrator. Each panel explains what that reader can inspect and links to it. No invented customer benefits or commercial outcomes.
**Research:** cite external scheduling papers only where directly relevant; separate outside findings from AVOLITE evidence. Do not transplant Avoflare's industry statistics.
**Motion:** role content changes in 160ms; no animated numbers. Final CTA is static.
**Actions:** Inspect the evidence primary, Explore the full system secondary. A Watch demo link appears only when footage exists; before that use Try the walkthrough.
**Footer:** full logo, compact section links, repo, project/team facts, status legend, honesty note, author. Team ID/contact omitted until supplied.

## 5. Auxiliary page composition
### /system/
Preserve header and selected typography. Small plum opening with title, short purpose and DESIGNED boundary. Main light reading area: 3-column local contents, 9-column prose/diagrams. Use subsections for overall loop, inputs/outputs, two decisions, model routing, human review and failure paths. One diagram per reading block; selected node details never cover the graphic. Dark diagram plates are allowed inside the light page. Chapter navigation is ordinary anchor navigation. On phone, contents is a native disclosure above content and every diagram becomes a vertical sequence.

### /evidence/
Light-first page with slim plum header, 8-column main evidence and 4-column source context on desktop. Run identity and limitations precede metrics. Original plots, range/velocity tables and prose stay together by scenario. Source context includes dataset path, pinned commit, run scope and derived-field explanation; it is not a floating tooltip. One principal figure per block, then a compact figure index. Add a visible pending-evidence section at the bottom. No autoplay or scroll reveal.

Both pages end with “Back to the story” linked to the relevant anchor. Their content supplements, never replaces, homepage chapters.

## 6. Motion system — fixed decisions
**Focal moment:** the seven-layer signal journey in the selected cutaway.
**Continuity:** stage selection and the resulting explanation.
**Feedback:** immediate, small, interruptible.
**Budget:** one playing explainer at a time. Starting another pauses the first.

| Motion | Duration | Easing | Rule |
|---|---:|---|---|
| Hover/press feedback | 120ms | ease-out | Surface/border state only; no button lift |
| Link underline opacity | 120ms | ease-out | Underline already identifiable at rest |
| Selected text/panel opacity | 160ms | ease-out | New text is available immediately to assistive tech |
| Menu opacity | 160ms | ease-out | No delayed access or staggered links |
| Diagram stage change | 240ms | cubic-bezier(0.16,1,0.3,1) | Transform ≤8px and SVG stroke emphasis |
| Failure-path highlight | 320ms | ease-out | One bounded path |
| Signal travel | 450ms | linear | One connector only |
| Conceptual demo step | 600ms | linear | User-started sequence; pause/step available |
| Hero full replay | 3200ms | stage schedule | Seven 400ms steps + 400ms hold; ends |
| Optional route crossfade | 160ms | ease-out | Progressive enhancement, plain links always work |

Animate transform, opacity and SVG stroke properties only. Do not animate layout sizes, filters or page-background colors. Small state color changes may be immediate. Motion does not reveal essential text or depend on the visitor scrolling at a particular speed.

**Interruptions:** repeated input cancels the outgoing sequence and moves to the requested state; no queued animations. Navigating away, offscreen exit or document hidden pauses playback and does not auto-resume. Reset returns to the initial explanation. Data labels and provenance stay visible during every frame.

**Reduced motion:** all spatial travel, scroll smoothing, route transitions and automatic playback disabled. Stage selection, disclosures, controls and manual steps work instantly. The complete diagram remains visible. No screen-reader announcements for each animation frame; announce only the resulting user-selected stage.

**No intro gate:** Avoflare's introduction is carried over as the hero, not a loading experience. No forced cinematic overlay. Replay is optional inside the hero. No cursor effects, magnetic buttons, ambient particles, generic fade-up sections, parallax or auto-rotating galleries.

## 7. Component inventory and behavioral contracts
### Reuse and restyle
Header, MobileMenu, SkipLink, Logo, StatusTag, StatusLegend, SectionHeader, Metric, Figure, Placeholder, ResultTable, TableDisclosure. Preserve their data issuance and validation boundaries. Status styles receive light/dark variants.

### Add only for actual content
| Component responsibility | Used in | Required states |
|---|---|---|
| Chapter index | Header, footer, side navigation | Closed/open/current/focus |
| Cutaway diagram | Hero; simplified reuse in How | Overview/selected/playing/paused/finished |
| Stage detail | How, System | Overview/selected/pending evidence |
| Requirement ledger | Problem | Evidence available/pending/source focus |
| Evidence explorer | Built, Evidence | Selected artifact/pending asset |
| Designed decision walkthrough | What's new | Path/step/end/reset |
| Scan comparison explainer | Demo | Initial/step/playing/paused/finished |
| Failure-response explorer | Security | Selected failure/response |
| Illustrative review panel | Security | Waiting/approved/editing/rejected/reset |
| Milestone list | Roadmap | Summary/expanded |
| Reader-role panel | Why | Selected role |
| Demo media block | Demo | Footage pending/ready/playing/paused/error |

Use native links, buttons, details/summary, select, range input and video before custom controls. No generic interaction framework or global state library. Components own small local state; only the playback coordinator is shared if more than one player is implemented.

### Empty/error/overflow rules
- Missing engineering evidence: name what is absent and what it would prove; no spinner.
- Missing video or dashboard: stable-ratio labelled panel.
- Missing mandatory validated dataset: fail build; do not silently display zeros.
- Image load error: alt text, caption/source and the table remain useful.
- No-source claim: keep DESIGNED/PLANNED with a clear scope or omit it.
- Long labels wrap; tables have readable alternatives; all buttons tolerate two lines.
- Keyboard focus remains on the triggering control unless opening a genuine dialog. A figure dialog, if used, has close, Escape, focus containment and focus return.
- Native focus ring: 2px, visible offset and surface-aware contrast; minimum targets 44px.
- Descriptive titles/desc for informative SVGs; decorative paths hidden from assistive tech.
- No loading skeletons for static content and no fabricated toast success states.

## 8. Implementation approach and performance
Keep Astro static, TypeScript and plain CSS. Complete all sections before adding animation. Default states and full textual alternatives render server-side.

Use CSS for feedback, small TypeScript for local state, and a lightweight SVG sequence for the cutaway. Start with no new dependencies. The chosen flat diagram does not require a 3D engine. Native cross-document transitions can be optional; no SPA router just to animate links. Validate exact APIs through Context7/modern-web-guidance during implementation.

If CSS sequencing cannot reliably pause/resume/cancel the authored sequence, use the native Web Animations API; add GSAP only after demonstrating the need and checking the bundle budget. No smooth-scroll replacement.

Retain budgets: homepage JS ≤70KB gzip, CSS ≤25KB, fonts ≤130KB. Evidence/System should use shared navigation plus their own small interaction only, rather than loading the homepage animation bundle. LCP ≤2s, CLS ≤0.05, INP ≤150ms are targets to measure, not promises. Do not preload all plots or download video before interaction. Keep explicit media dimensions.

## 9. Content/data boundaries
The following distinctions are mandatory in every chapter:
- Radar DSP simulation evidence is not integrated ES scheduler validation.
- Rule-based radar scheduling prototype is not the proposed learned scheduler.
- AoA and model-router claims require supplied evidence before status upgrades.
- Exact results come only from the validated exported run. Scenario counts are not generalized detection probabilities.
- No undefined confidence/SNR claim, no merged runs, no arbitrary chart curves that appear measured.
- Conceptual illustrations carry ILLUSTRATIVE; the architecture itself is DESIGNED.
- UI step numbers, chapter numbers and layout dimensions are navigation/design quantities, not experimental results; do not apply a scientific result badge to a “Step 2” label.
- Missing official problem wording, team ID, current engineering milestone, video and dashboard captures do not justify inventions.

The repository-pinned dataviz skill remains unavailable. This specification sets chart requirements using the existing validated data layer. Resolve the missing skill/tooling before chart implementation if it remains mandatory; do not claim it was used.

## 10. Reconcile older requirements
These are deliberate plan corrections, not silently dropped functionality.

| Existing requirement | New decision |
|---|---|
| SHELL-01 eight labels across header | Selected header composition plus full numbered chapter menu |
| SHELL-02 modal mobile menu | Non-modal native disclosure in a static mobile header; no-JS navigation stays usable |
| SHELL-04 radar hero and old CTA wording | Exact selected cutaway hero; Explore the system / Inspect the evidence |
| HOW-02 generic scheduler PROTOTYPE | Separate radar heuristic prototype from DESIGNED ES/ML scheduler |
| HOW-04 mobile loop ring | Vertical readable stages with inline explanations |
| BUILT-05 mandatory comparison slider | Slider only for genuinely registered images; otherwise full side-by-side plates |
| NEW-03 / NEW-04 | One accessible walkthrough preserves both decision and routing explanations |
| DEMO-02 duplicate result tabs | Link to the canonical results explorer, avoiding duplicate content |
| DEMO-03 speed/reseed simulator | Deterministic illustrative comparison with Step/Play/Pause/Reset and named scenarios |
| ROAD-02 assumed P1 maturity marker | Evidence note now; milestone marker only after team confirmation |
| MOT-01 pinned GSAP version | Native-first; verify actual need and current docs before adding dependency |
| MOT-02 continuous radar sweep | User-controlled finite cutaway sequence |
| IMG-02 mandatory AI mood scenes | Optional only if a concrete explanatory need exists; no scene needed for this design |
| QA-03 projector body size | Maintain ≥18px essential body on desktop/projector and ≥1.5px essential diagram lines |
| UI-03 separator-heavy uppercase labels | Number + sentence-case section title, consistent with copy rules |

All other content requirements remain covered by the section plan. Existing completed foundation/data work stays complete; redesigned presentation is not marked complete until implemented and verified.

## 11. Build order and acceptance
1. Reconcile planning/guidance and known audit findings; preserve the selected hero reference.
2. Restyle existing primitives, create light/dark variants, and implement reliable chapter navigation.
3. Build the whole static homepage: introduction, eight chapters, final CTA/footer. All evidence and pending states work without JS.
4. Build System and Evidence appendices with source context.
5. Add interactions in value order: system steps, evidence selection, decisions, failure response, illustrative scan comparison, media when supplied.
6. Add cutaway playback and subtle transitions after interaction semantics work.
7. Review at 1440, 768 and 390 widths; Chromium/Firefox/WebKit; keyboard, 200% zoom, JS off, reduced motion, print/readability and console.
8. Run existing data/build/type checks and targeted behavior regressions. Check every source/anchor and metric provenance.
9. Measure budgets and Lighthouse; compare the finished hero against its approved image; record finish review and shipped DESIGN.md.
10. Deploy only when the user asks.

**Done means:** every chapter is present; quick and deep judge journeys work; nothing requires animation to read; the distinction between simulated, designed and illustrative is local and clear; the layout survives phone width and keyboard use; the chosen visual identity persists from first screen to evidence detail.

This turn delivers planning only. It does not implement, deploy, or claim visual/browser QA of the future site.
