# Design Research: AVOLITE storytelling site

**Dimension:** visual design, motion, UI and UX
**Researched:** 2026-09-30
**Overall confidence:** MEDIUM-HIGH. Tokens and contrast are computed (HIGH). Font availability and axes were checked against Google Fonts metadata (HIGH). Browser support comes from MDN and web-features (HIGH). Observations about defence-tech sites come from their live CSS (MEDIUM). Aesthetic judgements are opinion and are marked as such.

---

## Summary

**Preferred direction: "ES operator console".** The site should look like a calm, dark, instrument-grade Electronic Support console, not a sci-fi HUD. It uses a blue-black base (a sharper, less saturated take on the master doc's "dark navy") and one cyan signal accent, strictly rationed to "where the system is looking right now". Status tags form a separate six-colour vocabulary. A warm khaki neutral, taken from the supplied logo, breaks the cold-cyber cliché and ties the site to the brand. Type is Archivo (expanded) for headings, IBM Plex Sans for body text and IBM Plex Mono for engineering labels. Big numbers use Archivo with tabular figures.

**Structure:** take AVOFLARE's 8-section anatomy one for one: numbered sections, a two-line H2, status tags, the requirement map, the flowchart, the carousel, the before/after slider, the chaptered demo, the layered security explorer, the roadmap with a maturity marker, and a cited "Why" section. Change the skin completely. AVOFLARE is a light glass theme (`--haze #f3f7fb`, `--cer #4f8ccc`, Albert Sans + JetBrains Mono, 26px radius). AVOLITE goes dark, uses hairlines and a 4px radius, and a different type family, so the two entries do not look like reskins of each other.

**Motion language:** each loop stage gets exactly one motion primitive: Observe = sweep, Detect = ping, Process = travelling pulse, Estimate = beam narrowing, Predict = ghost marker, Decide = slot highlight, Scan again = sweep resumes with a new dwell pattern. Motion runs on a timer and starts when the element enters view. There is one sticky stepper (How it works, desktop only). Nothing depends on CSS scroll-timelines, because Firefox still does not ship them. Only transform, opacity and SVG stroke properties are animated. Under reduced motion, everything renders in its final state.

**No blocking preloader.** The hero itself does a 2.4 s "power-on", with the content readable from frame one and a "Replay scan" control. The honesty system (status tags, provenance captions, "not an AVOLITE result" source notes, pending-asset placeholders) is a first-class visual component, not an afterthought.

---

## 1. Visual style and theme

### What makes real defence and RF interfaces feel credible

| Source | Observation (from live CSS or known conventions) | Lesson for AVOLITE |
|---|---|---|
| **Epirus** (EW/HPM) | Live CSS: `Mono Spec` (15 uses) + `Inter`, neutral greys `#787878`, `#fafafa`, `#e2e2e2`; dark hero sections; press and contract facts do the persuading | Mono used as a *label voice*, sans for reading. Credibility comes from facts, not effects. |
| **CesiumAstro** (space RF/phased arrays) | Live CSS: `soleil` + `DM Mono`, near-black `#141414`, one warm accent (`#e7b050`) | One accent on a neutral base. Mono for technical metadata. |
| **Palantir** | Live CSS: `Alliance No.1/No.2`, near-black `#1e2124`, off-white `#f4f7f6`, deep green `#2b5945`, a single alert red `#ff4136` | Very restrained. Colour is semantic, not decorative. |
| **Anduril** | Live CSS: black `#000` base, Helvetica-class grotesk; photography of real hardware carries the page | Real artefacts beat illustrations. For us, the "hardware" is the MATLAB plots and dashboard. |
| **Spectrum analysers / SDR waterfalls** | Waterfalls map noise to black/dark blue and strong signals to bright/white; each sweep is a stacked row of a time map; persistence modes build a density map ([SDR-Radio](https://www.sdr-radio.com/SpectrumAndWaterfall), [Signal Hound](https://signalhound.com/news/what-you-need-to-know-about-real-time-spectrum-analysis/)) | A single-hue ramp, dark to cyan to white, is *authentic*. Rainbow/jet is the amateur tell. |
| **PPI radar scopes** | A rotating sweep with long-persistence phosphor: brightest where the antenna just passed, fading until the next pass; targets leave trails ([radartutorial.eu](https://www.radartutorial.eu/12.scopes/sc16.en.html), [ScienceDirect: radar video](https://www.sciencedirect.com/topics/engineering/radar-video)) | The afterglow decay is the one "effect" that is physically meaningful. Use it: blips fade over one rotation. |

**Common credibility cues:** a near-black neutral base, one accent, mono metadata, dense factual captions, real artefacts, hairline structure, no drop shadows, no gradients on text, no neon everywhere.

**Tells of an amateur "cyber" look to avoid:** glowing text, scanline overlays, glitch effects, hexagon grids, matrix rain, HUD corner brackets on every card, Orbitron or Chakra Petch fonts, green-on-black terminal cosplay, rainbow colormaps, fake "LIVE" indicators.

### Direction options (opinion, grounded in the cues above)

| Direction | Verdict |
|---|---|
| **A. ES operator console** (blue-black, cyan signal, khaki brand neutral) | **Preferred.** Matches the master doc's §42 brief (navy, cyan, radar rings, beams, spectrum, engineering labels, large metrics). Reads as "RF instrument" at a glance. Cyan on blue-black is also the most legible accent on washed-out projectors (12.7:1). |
| B. Phosphor (green-black, P7 green) | Rejected. It is a retro cliché, and phosphor green collides with the BUILT status green, which would break the honesty colour system. |
| C. Graphite + amber (tactical night display) | **Strong fallback.** Very distinctive and far from generic cyber templates. But amber collides with the PROTOTYPE status colour, and the master doc explicitly asks for navy + cyan. Keep it in reserve only if the user wants to move away from the brief. |
| D. Light glass (AVOFLARE skin) | Rejected. The two sites would look like siblings, and a light theme undercuts the RF/EW mood. |

**Is navy + cyan the best choice?** Yes, but sharpened:
1. Push navy toward blue-black (`#050B16`), so it reads as an instrument, not a crypto dashboard.
2. Keep cyan, but make it *semantic only*: the live signal, the beam, the current stage and focus.
3. Add khaki (from the logo) as a warm secondary neutral for eyebrow labels and the ILLUSTRATIVE tag.

---

## 2. Color

### 2.1 Preferred palette A: ES operator console (all ratios computed with the WCAG 2.x formula)

Surfaces:

| Token | Hex | Use |
|---|---|---|
| `--bg-0` | `#050B16` | page |
| `--bg-1` | `#0B1629` | panels, charts, figure frames |
| `--bg-2` | `#12213A` | raised surfaces, active tab, table header |
| `--bg-3` | `#1A2C4B` | hover and pressed states only (no small text on it except t1/t2) |
| `--line` | `#1D3050` | decorative hairlines, grid, rings (non-essential) |
| `--line-strong` | `#4D6D99` | essential borders: inputs, tab outlines, chart axes, slider track (≥3:1 on bg-0/1/2, as WCAG 1.4.11 requires) |

Text and accent contrast (against bg-0 / bg-1 / bg-2 / bg-3):

| Token | Hex | bg-0 | bg-1 | bg-2 | bg-3 | Use |
|---|---|---|---|---|---|---|
| `--text-1` | `#E8EEF6` | 16.88 | 15.50 | 13.79 | 11.95 | headings, readouts |
| `--text-2` | `#A3B3C9` | 9.24 | 8.48 | 7.55 | 6.54 | body |
| `--text-3` | `#8095B0` | 6.42 | 5.89 | 5.25 | 4.54 | captions, ticks, provenance |
| `--signal` | `#3BE4F2` | 12.73 | 11.68 | 10.40 | 9.01 | signal, beam, active stage, focus ring |
| `--signal-dim` | `#2A9DB0` | 6.14 | 5.64 | 5.02 | 4.35 | inactive paths, visited stages |
| `--khaki` | `#C9B98F` | 10.15 | 9.32 | 8.30 | 7.19 | eyebrow labels, ILLUSTRATIVE (logo keeps its own `#BCAC87`, 8.81:1) |
| `--error` | `#FF7A7A` | 7.80 | 7.16 | 6.38 | 5.52 | failure modes, always with icon + text |
| `--line-strong` | `#4D6D99` | 3.72 | 3.41 | 3.04 | 2.63 | non-text only; do not use on bg-3 |
| `--line` | `#1D3050` | 1.49 | 1.37 | 1.22 | 1.06 | decorative only; never the sole carrier of meaning |

All text tokens pass AA (4.5:1) on every surface. text-1, text-2, signal and khaki also pass AAA (7:1) on bg-0/1/2. Dark text on filled cyan (`#050B16` on `#3BE4F2`) is 12.73:1, so a primary button with dark text on a cyan fill is safe.

Surfaces step at bg-0/bg-1 1.09, bg-0/bg-2 1.22 and bg-0/bg-3 1.41. These steps are too subtle for a projector on their own, so **every panel also carries a 1px `--line` border**. Elevation comes from surface + border, never shadow.

### 2.2 Status tokens (six tags; colour + glyph + text, never colour alone)

| Tag | Colour | Hex | bg-0 / bg-1 / bg-2 | Glyph (shape carries meaning for colour-blind users) | Tag style |
|---|---|---|---|---|---|
| BUILT | green | `#3DDC97` | 11.15 / 10.23 / 9.11 | filled square ■ | solid 1px border, tinted fill 12% |
| SIMULATED | blue | `#6FB3FF` | 8.98 / 8.24 / 7.34 | filled circle ● | solid border, tint 12% |
| PROTOTYPE | amber | `#F2B84B` | 11.01 / 10.11 / 9.00 | half-filled circle ◐ | solid border, tint 12% |
| DESIGNED | violet | `#B99CFF` | 8.69 / 7.98 / 7.10 | ring ○ | solid border, no fill |
| PLANNED | grey | `#9AA8BA` | 8.15 / 7.48 / 6.66 | dashed ring ◌ | **dashed** border, no fill |
| ILLUSTRATIVE | khaki | `#C9B98F` | 10.15 / 9.32 / 8.30 | diagonal hatch ▨ | dashed border + 45° hatch background on any chart or figure it labels |

Rules:
- SIMULATED blue vs signal cyan is only 1.42:1 apart. That is intentional: they never sit in the same role. Cyan is *motion/attention*, blue is a *label*. Never draw a data series in the status blue.
- ILLUSTRATIVE numbers render in `--text-2`, **never** in `--text-1` at readout size alone. An ILLUSTRATIVE readout also gets the hatch plate. Measured-looking styling is reserved for SIMULATED and BUILT results.
- Pass/fail colouring (green/red) only appears on SIMULATED or BUILT result tables.
- Master doc §50 labels map onto these tags: IMPLEMENTED/INTEGRATED → BUILT; PROTOTYPE → PROTOTYPE; PLANNED → PLANNED or DESIGNED (DESIGNED = architecture documented; PLANNED = not yet designed in detail); EXAMPLE → ILLUSTRATIVE; VALIDATION REQUIRED → the tag plus a small "validation pending" note.

### 2.3 Accent coverage rules
- Cyan covers **≤5% of any viewport**. It marks only the live signal, the beam, the current stage, focus and the primary button. It is never used for headings, icons or decoration.
- Khaki covers ≤3%: eyebrow labels, the ILLUSTRATIVE tag and the logo.
- Status colours appear only inside tags, legends and result cells.
- Glow is allowed only on signal SVG strokes, drawn as a pre-blurred duplicate path with animated `opacity`. Never animate `filter`, and never put `text-shadow` glow on text.
- Colormap for waterfalls and heatmaps drawn by the site: a single-hue ramp `--bg-1 → --signal-dim → --signal → --text-1`. No rainbow/jet.
- **Real MATLAB figures are shown as exported** (usually white/parula). They sit on a "figure plate": a `--bg-1` frame, 16px padding, the image on its native background, and a provenance caption below. Do not recolour real outputs. Optional improvement (LOW confidence, verify in MATLAB): recent MATLAB releases support a dark figure theme. If the team re-exports plots dark, they blend better, but that is a nice-to-have.
- Logo: the green fills (`#2A4335`/`#304B3C`) measure **1.83:1** on bg-0, so they are invisible. On dark, use a reversed variant: green paths render as `--text-1`, khaki stays. The supplied SVG also has a `#FDFDFD` full-bleed background path and no `viewBox`; both must be removed or added during cleanup.

### 2.4 Candidate palette B: Phosphor (rejected; documented for completeness)
bg `#07100C` / `#0C1812` / `#13231B`; text `#E6EDE4` (16.17), `#A7B5A6` (9.01), `#83947F` (5.98); signal `#7CFFB2` (15.44); line-strong `#3E5A48` (2.54, fails 3:1 and would need brightening). The signal colour equals BUILT green, which breaks the status system.

### 2.5 Candidate palette C: Graphite amber (fallback)
bg `#0B0C0E` / `#131518` / `#1B1E22`; text `#ECEDEE` (16.69), `#AEB2B8` (9.19), `#8A9098` (6.08); signal `#FFB547` (11.14); BUILT `#4FD99A`, SIMULATED `#78B4FF`, DESIGNED `#BFA2FF`, PLANNED `#A3A8AF`, ILLUSTRATIVE `#D2C29A`. PROTOTYPE would need to move off amber, for example to coral `#FF9A6B`. line-strong would need to go to about `#5A616B` to reach 3:1.

### 2.6 Projector readability rules
Projectors crush dark-grey steps and thin lines.
- Body text at least 18px on projector-likely layouts (desktop ≥1280). Body text uses `--text-2` (≥7.5:1), never `--text-3`.
- Essential lines are ≥1.5px and use `--line-strong`. Decorative 1px `--line` may disappear, and that must be acceptable.
- Readouts ≥48px. Tags ≥12px mono with 0.06em tracking.
- QA step: view each section at 50% screen brightness and at 1280×720 (a typical projector resolution).

---

## 3. Typography

All three families are on Google Fonts (axes checked against fonts.google.com metadata). Self-host woff2, subset to Latin, and preload only the display and body regular files.

| Role | Family | Settings | Why |
|---|---|---|---|
| Display / H1–H3 | **Archivo** (variable: `wdth` 62–125, `wght` 100–900) | `wdth` 118–125, `wght` 620–680, tracking −0.01em | An expanded grotesk reads "instrument panel" and "engineering drawing" without sci-fi kitsch. Clearly distinct from AVOFLARE's Albert Sans and AquaSol's Bricolage Grotesque. |
| Readouts (big numbers) | Archivo | `wdth` 100, `wght` 600, `font-variant-numeric: tabular-nums slashed-zero` | Numbers do not jitter during count-ups, and columns align. |
| Body / UI | **IBM Plex Sans** (variable: `wdth` 75–100, `wght` 100–700) | 400 / 500; `wdth` 100 | A technical humanist sans that stays legible at small sizes on projectors. The condensed `wdth` 85 works for dense table cells. |
| Labels, units, IDs, ticks, tags, stage names | **IBM Plex Mono** (static) | 400 / 500, uppercase only for tags and stage names, +0.06em tracking | Mono label voice, as on Epirus and CesiumAstro. |

Rejected: Space Grotesk, Inter (template-default), JetBrains Mono (AVOFLARE's), Orbitron and Chakra Petch (sci-fi cliché), Geist (reads Vercel/SaaS).

**Type scale** (fluid, 1.25 ratio, rem at a 16px base):

| Step | Size | Line-height | Use |
|---|---|---|---|
| Display | `clamp(3rem, 1.6rem + 4.4vw, 6rem)` | 0.98 | hero name |
| H2 | `clamp(2.125rem, 1.4rem + 2.4vw, 3.5rem)` | 1.04 | section titles (two-line pattern) |
| H3 | `clamp(1.375rem, 1.1rem + 0.9vw, 1.75rem)` | 1.2 | panel titles |
| Lead | `clamp(1.125rem, 1rem + 0.45vw, 1.3125rem)` | 1.5 | section intro |
| Body | `1.0625rem` (17px), 18px at ≥1280 | 1.6 | measure ≤ 66ch |
| Small | `0.875rem` | 1.5 | captions (Plex Sans) |
| Label | `0.75rem` mono, +0.06em | 1.3 | tags, ticks, eyebrows |
| Readout XL | `clamp(3rem, 2rem + 3vw, 4.5rem)` | 1 | key metrics |
| Readout M | `2rem` | 1 | tables, panels |

- Sentence case everywhere except tags, stage names and the eyebrow numbers ("01 / THE PROBLEM").
- Units are set in mono at 0.5× readout size, baseline-aligned, in `--text-3`: **±0.5** `m`.
- Budget: fonts ≤130 KB total (Archivo variable subset ~45–55 KB, Plex Sans variable subset ~40 KB, Plex Mono 400 ~20 KB). This is an estimate; measure after subsetting.

---

## 4. Layout and structure

### 4.1 Grid and rhythm
- Desktop ≥1280: 12 columns, 1440 max frame, 80px margins, 24px gutters. Tablet 768–1279: 8 columns, 40px margins. Mobile <768: 4 columns, 16px margins. No horizontal page scroll.
- 4px spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.
- Section padding: `clamp(96px, 12vh, 160px)` top and bottom. Sections are separated by a full-bleed 1px `--line` rule carrying a mono coordinate label at the left margin (`01 / 08`) instead of alternating background bands. This is quieter and projector-safe.
- Radius: 4px panels and buttons, 2px tags. No shadows.
- Text is left-aligned. Centre only the final CTA line in section 08.

### 4.2 Section anatomy (every section)
```
[eyebrow]  01 / THE PROBLEM              (mono, khaki)
[H2]       Open-loop sweeps,             (Archivo, text-1)
           and what they miss.           (line 2 in text-2: AVOFLARE's two-line pattern)
[lead]     one to two sentences, ≤60ch
[status line] one mono caption with the section's honesty scope, e.g. "Simulated data · AI stages designed, not yet running"
[body]     section-specific layout
```

### 4.3 Hero composition
- Desktop: text in columns 1–6, a **PPI scope** in columns 7–12 (a square SVG ~560px at 1440).
- Text stack: eyebrow `SIH 2026 · PS 26055 · SMART SCAN FOR ELECTRONIC WARFARE` (mono) → `AVOLITE` display → tagline (H2 size, text-2) → one-line explanation (lead) → two buttons: primary "Begin" (scrolls to 01) and secondary "See how it works" (to 02) → a provenance line: "Simulated data · Imagery: AI-generated where marked".
- Scope contents: 4 range rings (`--line`), 12 bearing ticks every 30° with mono labels, a rotating sweep wedge, 3–5 ILLUSTRATIVE emitter blips with afterglow, a dashed bearing line with a lock reticle, and a small ILLUSTRATIVE tag inside the scope's corner.
- Below the scope, a thin **stage rail**: `OBSERVE · PROCESS · DETECT · ESTIMATE · PREDICT · DECIDE · RESCAN`. The current stage is cyan and the rest `--text-3`. In the hero it auto-cycles in sync with the scope. In the header it becomes the progress indicator.
- Tablet: the scope shrinks to about 360px beside the text. Mobile: the scope goes below the text at 100% width (max 360), and the buttons stack full width.
- No stock photo and no AI image in the hero. The scope is the hero image, which also helps LCP because it is inline SVG.

**Intro/preloader decision: no.** A blocking intro costs LCP and a judge's patience. AVOFLARE's intro (canvas, once per session via `sessionStorage`, `?intro` to replay) is fine for a sibling, but AVOLITE gets a *non-blocking power-on* instead. All text is visible at frame 0. Rings draw in over 600 ms, ticks over 400 ms, and the sweep starts at 1.0 s; the stage rail begins at 1.4 s. A "Replay scan" text button sits under the scope. Because nothing blocks, no "Skip intro" is needed.

### 4.4 Per-section layouts (components in §6)

| # | Section | Layout (desktop) | Mobile |
|---|---|---|---|
| 01 | **The problem** | (a) A split "Today vs Asked for" table in 2 columns: left "Fixed sequential sweep" (text-2), right "Adaptive, learned scan" (text-1), 4 rows. (b) A **Sweep vs Adaptive** interactive panel, full width: two time-frequency strips showing where dwell time goes, with the fixed-sweep strip spending most cells on non-threatening emitters, tagged ILLUSTRATIVE. (c) A **Requirement map**: PS 26055's asks as rows (ML scheduler, minimise intercept time, high intercept rate, spatially scanning and frequency-agile emitters, learning from hits/misses, periodic-scan receiver question, the figures of merit) with a status tag and a one-line "where on this site" anchor link per row. Optional AI mood image (dense RF environment), columns 7–12, captioned. | Stack a → c; the table becomes stacked cards; the panel strips stack vertically. |
| 02 | **How it works** | A **sticky stepper** at ≥1024: left columns 1–5 hold the stage text (7 steps: Observe → Process → Detect → Estimate → Predict → Decide → Scan again), right columns 6–12 a sticky loop diagram (RF environment → antenna/receiver → DSP → CFAR → PDW/features → AoA → environment estimate → AI → scheduler → receiver control, looping back). The active step lights its nodes. Below it, a full **flowchart** figure with a "View as table" details element. | No sticky: each step is a card with its own small inline diagram crop; the full flowchart scrolls horizontally *inside its own figure* (the page does not scroll sideways), with a "View as table" fallback. |
| 03 | **What we built** | A tabbed **Built-pieces carousel**, one slide per real artefact: DSP chain, CFAR, range-Doppler, five-target simulation, AI modules, App Designer dashboard. Each slide is a figure plate (real PNG) + status tag + 2–3 metric readouts from the JSON + source file path in mono (`04_MATLAB/SARRS_Results/CFAR_Performance_Table.csv`). Below: the **CFAR results table** (real, SIMULATED) and a **Before/After slider** (e.g. raw range-Doppler vs after CFAR). | Tabs become a horizontally scrollable tab strip; slides full width; slider handle is 44px. |
| 04 | **What's new** | Three stacked "idea panels", each with the text in columns 1–5 and an interactive diagram in columns 6–12: (1) **Two-stage JEV + Evidence**: candidate clusters fan out, evidence narrows them to one, then skills fan out and one is selected, with a novel-signal branch going to human approval. (2) **Adaptive model router**: an input-type toggle ("graph of emitters" / "long sequence" / "space-time") routes to GNN / SSM / ST-GNN, and a conditional ensemble joins when the router's confidence is low. (3) **Fast path vs escalation**: two lanes with RL decision layer and human-in-the-loop nodes. Every panel is tagged DESIGNED. | Diagrams go below the text, and toggles become a segmented control. |
| 05 | **Demo** | A **chaptered video player** (16:9, columns 1–8) with a chapter list (columns 9–12). Below it, an **interactive loop explainer** ("Step" / "Play" through one scan cycle on the PPI + waterfall, ILLUSTRATIVE) and an **exported-results viewer** (tabs of real JSON-backed charts). Then repo links. | Chapters below the video as a list; the explainer is stacked. |
| 06 | **Security** | A **layered security explorer**: concentric or stacked layers (data provenance → ground truth separated from AI inputs → model/version audit trail → confidence thresholds and fallbacks → human approval for new clusters → cluster-profile protection → sandboxed simulation before hardware). Clicking a layer opens its detail panel on the right. Below it, a **failure-modes table** (failure → detection → mitigation) using `--error` icons. A disclaimer line: "Design targets, not certifications." | Layers become an accordion. |
| 07 | **Roadmap** | A horizontal **phase timeline** with 4 phases (Simulation prototype → AI integration → Hardware-in-the-loop/SDR → Closed loop in the field), a "WE ARE HERE" marker and a maturity bar filled to the current phase. Each phase is a column with a status tag and 3–5 bullets. | Vertical timeline; the marker becomes a left-edge badge. |
| 08 | **Why AVOLITE** | (a) A **comparison table**: fixed sequential sweep vs AVOLITE adaptive scan, across the PS figures of merit. AVOLITE cells are DESIGNED/ILLUSTRATIVE until measured. (b) Cited stat cards, each with a mono "Source · … · not an AVOLITE result" line. (c) "Why it fits" cards (4–6). (d) The final CTA, centred: one line + "Watch the demo" / "See the roadmap". | Table becomes per-metric cards. |
| — | **Footer** | 4 columns: project facts (SIH 2026, PS 26055, Team Avoflare, team ID "to be confirmed" until known), code links (AVOLITE repo ↗), a data-honesty note (what each tag means), explore links (8 anchors). Bottom row: "© 2026 Team Avoflare · Created by Sandesh Naik", "Back to the start ↑". | Stacked. |

---

## 5. Motion and animation

### 5.1 Motion language (one primitive per loop stage)

| Stage | Primitive | Visual | Properties |
|---|---|---|---|
| Observe | **Sweep** | wedge rotates on the PPI; cursor scans across the spectrum strip | `transform: rotate` / `translateX`, linear |
| Process | **Travelling pulse** | a short dash runs along a connector | `stroke-dashoffset` |
| Detect | **Ping** | blip appears, a ring expands and fades; CFAR threshold line and the peak crossing it flash once | `transform: scale` + `opacity` |
| Estimate | **Beam narrowing → lock** | a wide wedge narrows to a thin bearing; reticle brackets close in; the readout settles | `transform: scaleX/rotate`, `opacity`; readout count-up (real value always in the DOM) |
| Predict | **Ghost marker** | dashed, low-opacity marker at the predicted next bearing/frequency | `opacity`, `stroke-dashoffset` |
| Decide | **Slot highlight** | one cell in the scheduler dwell timeline fills | `opacity` of a fill layer |
| Scan again | **Sweep resumes** | sweep restarts with a visibly different dwell pattern (it lingers on the chosen sector) | `rotate` with a changed timeline |

Only the **lock** gets a stronger highlight (glow duplicate at opacity 0.6), echoing master doc §43: "subtle glow on detection, stronger highlight at AoA lock".

### 5.2 Tokens
```css
--dur-instant: 120ms;  /* hover, press */
--dur-fast:    200ms;  /* tag/tooltip, tab underline */
--dur-base:    320ms;  /* panel swaps, accordion */
--dur-slow:    600ms;  /* draw-ins, beam narrowing */
--dur-stage:  1500ms;  /* one loop stage (master doc §43) */
--sweep-period: 6s;    /* hero PPI rotation; 8s under 768px */
--ping:        1200ms;
--ease-out:    cubic-bezier(.16, 1, .3, 1);   /* entrances, lock settle */
--ease-inout:  cubic-bezier(.65, 0, .35, 1);  /* stage-to-stage transitions */
--ease-linear: linear;                        /* sweep rotation only */
```
Stagger: 60ms between siblings, 6 items at most (no long cascades).

### 5.3 Specific animations
- **Hero PPI sweep.** The wedge is a static SVG path with a linear-gradient fill (cyan → transparent) inside a `<g>` rotated via CSS `@keyframes` `transform: rotate()`. Blips are SVG circles whose opacity is reset to 1 when the sweep passes their bearing and decays to 0.15 over one period (afterglow). This is driven by one small rAF loop reading the sweep angle, or pre-computed `animation-delay` per blip, which is simpler and preferred. The loop pauses offscreen (IntersectionObserver) and when `document.hidden`. A visible pause toggle (WCAG 2.2.2) sits next to "Replay scan".
- **Spectrum + waterfall** (Demo explainer, optional in the hero strip). A `<canvas>` at low internal resolution (e.g. 256×128), CSS-scaled with `image-rendering: pixelated` off (smooth). Each tick shifts the image down one row with `drawImage` onto itself and paints the new row using the single-hue ramp. Throttle to 20 fps. The data is an ILLUSTRATIVE synthetic generator with seeded noise, tagged as such. When reduced motion is on, or the canvas is offscreen, draw one static frame.
- **Beam lock.** Wide wedge (±30°) → thin bearing (±2°) over `--dur-slow` `--ease-out`, then reticle brackets translate inward over 200ms and the readout settles. Played once per view entry, with replay available in the explainer.
- **Pipeline pulse (02, 04).** A dash (length 12, gap 1000) animates `stroke-dashoffset` along the active path only, one pulse per `--dur-stage`. Inactive paths are `--signal-dim` with no motion.
- **JEV two-stage reveal (04).** Step 1: 5 candidate cluster nodes fade in (stagger 60ms). Step 2: evidence chips slide in (translateX 8px → 0) and non-matching clusters dim to 0.3. Step 3: the chosen cluster locks (ring + short glow). Step 4: skill nodes fan out and one is selected. The novel-signal branch pulses toward a "Human approval" node. It runs on user "Next"/"Play" by default and auto-plays once on first view (≤6 s total).
- **Model router (04).** A toggle change re-routes the highlighted path in `--dur-base` (the old path fades to dim, the new pulse runs). The ensemble node appears only when the "low confidence" condition is selected.
- **Sticky stepper (02).** Step activation comes from IntersectionObserver on the text steps (rootMargin `-45% 0px -45% 0px`). Diagram node states cross-fade in `--dur-base`. This is *state-switching*, not scrubbing, so it is robust and needs no scroll math.

### 5.4 Scroll-driven vs time-based
- **Time-based, triggered on view.** IntersectionObserver at threshold 0.35 fires once, and the element is then static. Scrubbed, scroll-linked animation is not used.
- CSS scroll-driven animations (`animation-timeline`) ship in Chromium 115+ and Safari 26, but **not in Firefox** (Baseline blocked; see MDN and web-features). Allowed only as progressive enhancement for the header progress bar, with a JS fallback.
- If the stack includes GSAP, use `gsap.matchMedia()` with `{ desktop, mobile, reduceMotion }` conditions so everything auto-reverts (confirmed in the GSAP v3 docs via Context7). GSAP is not required: every animation above is achievable with CSS keyframes + ~2 KB of IntersectionObserver JS. Opinion: skip GSAP for a 1–2 day build unless the stack researcher recommends it.

### 5.5 Do not animate
- Generic section fade-up-on-scroll, card lifts, parallax, smooth-scroll hijacking, cursor followers, tilt cards, marquee logos, typing effects, glitch/scanline effects, animated gradients or backgrounds.
- `filter`, `box-shadow`, `width/height/top/left`, `background-position` on large areas.
- Real result numbers "counting up" from zero to imply live measurement. Count-ups are allowed only on SIMULATED readouts and must be ≤600ms, with the final value in the DOM from the start (`aria-live` off).
- Anything suggesting "LIVE": no pulsing red dots and no "RUNNING ●" badges (the master doc's §41 dashboard mock-up shows one; do not import it).

### 5.6 Reduced motion (`prefers-reduced-motion: reduce`)
- Every component server-renders in its **final state** (lock achieved, pipeline fully drawn, JEV final selection shown). The JS only animates *from* that state.
- PPI: static sweep wedge at 38° with blips at their decayed opacities and the reticle locked. No rotation.
- Waterfall: one static frame. Stepper: plain state swaps with no crossfade. Pulses: off, with active paths shown solid cyan.
- Interactive controls (Step/Play/toggles) still work, with instant state changes.
- Test with Playwright `reducedMotion: 'reduce'` emulation.

### 5.7 Mobile (<768px)
- No sticky stepper and no pipeline pulse loops. Sweep period 8 s. Waterfall at 12 fps or static.
- JEV/router sequences run only on tap ("Play"), never auto-play.
- Total animation JS stays under the budget (target ≤15 KB gzip without GSAP).

### 5.8 Performance rules
- Animate only `transform`, `opacity`, `stroke-dashoffset`/`stroke-dasharray`.
- Use `will-change` only while an animation is running.
- One rAF loop for the whole page, dispatching to visible components only.
- Pause loops offscreen and when the tab is hidden.
- Canvas only for the waterfall; everything else is inline SVG.
- Targets: LCP ≤2.0 s, CLS ≤0.05 (all media boxes get fixed `aspect-ratio`), INP ≤150 ms.

---

## 6. UI components (behaviour specs)

| Component | Spec |
|---|---|
| **StatusTag** | `<span class="tag tag--simulated">` with glyph + uppercase mono label (12px, 2px radius, 1px border, 12% tint). Hover or focus shows a tooltip with the tag's definition ("SIMULATED: produced by the MATLAB model on synthetic signals"). The definitions are also listed in the footer honesty note. Not interactive on its own, so the tooltip is triggered by a wrapping `<abbr>`-style button only where space allows; otherwise the footer legend covers it. |
| **SectionHeader** | Eyebrow `NN / NAME` (mono, khaki) + two-line H2 + lead + status line. `id` matches the nav anchor, with `scroll-margin-top` equal to the header height. |
| **MetricReadout** | Value (Archivo tabular, text-1) + unit (mono, text-3) + label (Plex, text-2) + StatusTag. **Reads values only from the results JSON**, never hard-coded. An ILLUSTRATIVE readout renders in text-2 on a hatch plate. |
| **Figure + ProvenanceCaption** | `<figure>`: plate frame, image or SVG with a fixed `aspect-ratio`, `<figcaption>` with a title, then a mono provenance line: `SIMULATED · 04_MATLAB/SARRS_Results/…png · exported 2026-09-29`. Every chart has a "View as table" `<details>`. |
| **PendingAsset** | Same box and aspect-ratio as the future asset (so swapping it in causes no layout change). Hatched `--line` background, a centred mono label "Dashboard screenshot · arriving from the team", tag PLANNED. Never lorem ipsum, never a fake screenshot. |
| **Tabs** | WAI-ARIA tabs pattern: roving tabindex, arrow keys, Home/End, cyan 2px underline on the active tab (transition `--dur-fast`). Deep-linkable via `#built-cfar`. |
| **Carousel (Built pieces)** | Tabs + panels; *not* auto-advancing. Prev/next buttons (44px) + tab list; counter "02 / 06" in mono. Swipe on touch via CSS scroll-snap (`scroll-snap-type: x mandatory`), which is native with no library. |
| **Before/After slider** | A native `<input type="range">` over two stacked images, clip via `clip-path: inset()` driven by a CSS variable. Keyboard arrows move 5%, and the labels ("Raw", "After CFAR") stay visible. The handle is 44px and focusable, with its value announced as a percentage. |
| **Chaptered video player** | A native `<video controls preload="metadata" poster>` + a WebVTT captions track + a chapter list of `<button>`s that set `currentTime`. The active chapter is highlighted on `timeupdate`. Until the video arrives, it renders a PendingAsset with the chapter list still visible (as AVOFLARE did). |
| **Sweep vs Adaptive panel** | A segmented control ("Fixed sweep" / "Adaptive scan") + two identical time-frequency grids. Cells show dwell allocation; emitters marked E1–E8 by type (master doc §6). A readout of "dwell spent on non-threat emitters" is tagged ILLUSTRATIVE. Both states are server-rendered; the toggle swaps `data-mode`. |
| **Loop explainer** | PPI + spectrum + stage rail + Step / Play / Reset buttons. Step advances one stage (1.5 s animation), Play runs the loop and becomes Pause. `aria-live="polite"` announces the stage name. Tagged ILLUSTRATIVE. |
| **Security layer explorer** | A list of layer buttons (`aria-expanded`/`aria-controls`) + a detail panel. On desktop it is a two-pane layout, on mobile an accordion. The selected layer gets a cyan left border. Failure-mode rows use an `--error` icon + text. |
| **Roadmap timeline** | An ordered list of phases; the current phase has `aria-current="step"` and a "WE ARE HERE" badge. The maturity bar is a static `<meter>`-styled element (not an animated progress bar). |
| **Requirement map** | A table: Requirement (PS wording) · What AVOLITE does · Status tag · "See section" anchor. Sortable is not needed. |
| **Comparison table** | A real `<table>` with a sticky first column on mobile and `scope` attributes. Cells hold values + tags; the AVOLITE column is tinted `--bg-2`. |
| **Source citation / stat card** | Big number (text-1) + claim + mono line "Source · Author, Venue, Year · not an AVOLITE result" linked ↗. Visually separated from AVOLITE readouts by a khaki left rule and no status tag. |
| **Buttons** | `.btn` (cyan fill, `#050B16` text, 12.73:1), `.btn--secondary` (1px `--line-strong` border, text-1), `.btn--text`. 44px min height, 4px radius, no arrows appended. Hover: surface to bg-3 or cyan at 90% opacity, `--dur-instant`. |
| **Header** | Logo (reversed) left, numbered nav centre/right (`01 Problem … 08 Why`), progress rail beneath. 64px tall, `--bg-0` at 92% opacity with a 1px bottom `--line`. `backdrop-filter` is optional; skip it for performance. |
| **Footer** | See §4.4. |

---

## 7. UX components and behaviours

- **Navigation.** Numbered anchors in the header (desktop ≥1280 shows all 8 as `01 Problem`; 1024–1279 shows numbers + short names; below that a Menu button). A "Skip to content" link comes first in the tab order.
- **Scroll-spy.** IntersectionObserver on sections (rootMargin `-40% 0px -55% 0px`). The active link gets `aria-current="true"` + a cyan underline. It also updates the stage rail.
- **Mobile menu.** A full-height sheet (a `<dialog>` element, so focus trapping and Esc come free) listing all 8 sections, each with a number, name and one-line subtitle (reuse the AVOFLARE pattern, e.g. "02 How it works: The closed loop, stage by stage"). Selecting one closes the sheet and scrolls.
- **Progress indicator.** A 2px bar under the header (scaleX transform from scroll progress via one passive scroll listener with rAF, or CSS `animation-timeline: scroll()` as an enhancement) + the stage rail, which maps the 8 sections onto 7 loop stages loosely, only in the hero/02. Keep it simple: the bar shows page progress and the nav shows the section.
- **Skip intro:** not needed (non-blocking power-on). "Replay scan" and a pause control live under the hero scope.
- **Keyboard and focus.** A visible 2px `--signal` outline with 2px offset on everything focusable; never removed. All interactive panels are operable by keyboard. Tab order follows reading order. `scroll-behavior: smooth` only when motion is allowed.
- **Hover and tap states.** Hover never hides information. Touch targets are ≥44px. Tooltips also open on focus and close on Esc. There are no hover-only reveals on cards.
- **"View as table".** Every SVG chart and diagram (flowchart, CFAR plot, comparison bars) has a `<details><summary>View as table</summary><table>…` directly under it.
- **Empty and pending states.** A PendingAsset for any missing media. A "Definition pending" string for undefined metrics (for example, a confidence formula). Sections never collapse while assets are missing.
- **Links.** External links get ↗ and `rel="noopener"`. Repo links show the path in mono.
- **Projector mode.** No special toggle; the defaults already follow §2.6. Opinion: skip a toggle, since it is YAGNI for 1–2 days.
- **Deep links.** Every section and every tab or panel state that matters has a hash.
- **Informative SVGs** get `role="img"` + `<title>`/`<desc>`; decorative ones get `aria-hidden="true"`.
- **Motion controls.** Any loop longer than 5 s has a pause (WCAG 2.2.2).

---

## 8. Imagery: AI-generated mood vs SVG/code visuals

**Rule:** data, diagrams, charts, UI and results are **always** SVG/canvas/code or real MATLAB exports. AI images are allowed **only** as mood scenes and never depict data, UI, screenshots or hardware the team has not built.

| Where | Use |
|---|---|
| Hero | **No AI image.** The PPI scope is the hero. |
| 01 The problem | One wide mood scene: a crowded electromagnetic environment (a coastal radar mast and a ship at dusk; faint aircraft contrails). |
| 07 Roadmap | Optional: a future field receiver (antenna array on a mast), captioned as a concept, not hardware. |
| 08 Why | Optional: a quiet operator-console-room mood, with no readable screens. |

**Style direction:**
- Cinematic photographic realism, blue hour or night, low-key lighting, a desaturated navy-teal grade matching `--bg-0`/`--signal-dim`, a single cold light source, lots of negative space on the left for text.
- No legible text, no flags or insignia, no weapons firing, no real identifiable platforms or classified-looking kit, no faces in focus, no fake UI overlays, no sci-fi holograms.

**Prompt skeleton:**
> "Cinematic wide photograph, blue hour, coastal radar mast and distant naval vessel silhouette, faint atmospheric haze, deep navy and teal colour grade, low saturation, single cool light source, large negative space on the left, no text, no logos, no insignia, no people in focus, 35mm, realistic, subtle film grain"

**Delivery and labelling:**
- Export AVIF + WebP at 1600w (and 800w), ≤180 KB each, with `width`/`height` attributes and `loading="lazy"` (not for the first viewport).
- A CSS duotone overlay (`mix-blend-mode: multiply` with a `--bg-0` gradient) keeps images inside the palette.
- Caption in mono under every image: `Imagery: AI-generated · mood only, not AVOLITE hardware`.
- `alt` text describes the scene factually.
- No stock-photo services. The project bans Unsplash.

---

## What NOT to do (consolidated)
- Do not style illustrative numbers like results, show a number without a tag, show pass/fail colours on illustrative data, or use "LIVE"/"RUNNING".
- Do not use glow text, scanlines, glitch effects, hex grids, HUD corner brackets everywhere, sci-fi fonts, rainbow colormaps or neon on more than 5% of a viewport.
- Do not add a blocking preloader, scroll hijacking, parallax, fade-up-on-every-section, auto-advancing carousels or auto-playing video with sound.
- Do not animate `filter`, shadows or layout properties.
- Do not recolour or retouch real MATLAB figures.
- Do not use AI images for anything factual.
- Do not use the logo's green on dark surfaces.
- Do not reuse AVOFLARE's skin (light glass, Albert Sans, JetBrains Mono, 26px radii). Reuse its *structure* only.

---

## Confidence assessment

| Area | Confidence | Notes |
|---|---|---|
| Colour tokens and contrast | HIGH | All ratios computed with the WCAG relative-luminance formula. |
| Typography availability and axes | HIGH | Checked against the Google Fonts metadata API. Font byte sizes are estimates. |
| Defence-site observations | MEDIUM | Taken from the live HTML/CSS of each site. HawkEye 360 and Shield AI blocked scraping. Visual impressions are partly inferred. |
| RF display conventions | MEDIUM | Multiple sources agree (waterfall colour mapping, PPI persistence). |
| Motion platform support | HIGH | MDN and web-features: scroll-driven animations are not in Firefox. GSAP `matchMedia` confirmed via Context7. |
| Aesthetic direction choice | Opinion | Reasoned from the cues above and the master doc brief. |
| MATLAB dark figure theme | LOW | Not verified; treat as optional. |

## Gaps
- Real assets (screenshots, video, which result tables) are still unknown. Layouts assume fixed aspect ratios: 16:10 for the dashboard, 4:3 for MATLAB plots and 16:9 for the video. Confirm when the assets arrive.
- The exact PS 26055 requirement wording for the requirement map must come from the official PS text, not paraphrase.
- The team ID is unconfirmed; the footer shows "to be confirmed".
- The roadmap phase names above are proposals. Align them with the team's plan.

## Sources
- AVOFLARE reference site, scraped bundle and CSS: https://avoflare-web.pages.dev/ (structure, copy patterns, tag vocabulary, light glass tokens, intro with `sessionStorage`, reduced-motion handling)
- AquaSol reference site: https://aquasol-web.pages.dev/ (Bricolage Grotesque + Inter Tight; simpler card structure)
- Epirus live CSS (Mono Spec + Inter): https://www.epirusinc.com/
- CesiumAstro live CSS (soleil + DM Mono, `#141414`, `#e7b050`): https://www.cesiumastro.com/
- Palantir live CSS (Alliance, `#1e2124`, `#f4f7f6`, `#ff4136`): https://www.palantir.com/
- Anduril live HTML (`#000` base): https://www.anduril.com/
- SDR-Radio, spectrum and waterfall: https://www.sdr-radio.com/SpectrumAndWaterfall
- Signal Hound, real-time spectrum analysis and persistence: https://signalhound.com/news/what-you-need-to-know-about-real-time-spectrum-analysis/
- Radartutorial, PPI scope: https://www.radartutorial.eu/12.scopes/sc16.en.html
- ScienceDirect, radar video and phosphor persistence: https://www.sciencedirect.com/topics/engineering/radar-video
- MDN, CSS scroll-driven animations: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- web-features explorer, scroll-driven animations support: https://web-platform-dx.github.io/web-features-explorer/features/scroll-driven-animations/
- GSAP docs, `gsap.matchMedia()` (via Context7 `/websites/gsap_v3`): https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
- Google Fonts metadata (axes for Archivo, IBM Plex Sans/Mono and the others compared): https://fonts.google.com/metadata/fonts
- Project sources: `.planning/PROJECT.md`, `AVOLITE_Master_Project_Documentation.md` §6, §41–43, §50; `AVOLITE_Complete_AI_Architecture_Report.docx` §4–10, §15; `logo.svg` fills.
