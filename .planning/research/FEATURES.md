# Feature Research

**Domain:** Single-page engineering storytelling site for a hackathon RF / electronic-warfare project (SIH 2026, PS 26055 "Smart Scan strategy for Electronic Warfare"), judged by evaluators who skim fast and punish overclaiming
**Researched:** 2026-09-30
**Confidence:** HIGH for repo contents and reference-site patterns (read directly); MEDIUM for "what judges reward" (inferred from the AVOFLARE/AquaSol pattern and the PS text, no judge feedback available)

---

## 0. Findings that shape every section (read first)

These come from reading the real AVOLITE repo (`abhishekpj0902-apj/AVOLITE`, local clone), not from the docs. The roadmap and requirements have to account for them.

1. **The repo is an active-radar simulator, not an ES interception simulator.** The internal name is SARRS, "Self-Adaptive Reconfigurable Radar Receiver System" (`DSP/Run_Final_SARRS_Demo.m`). Logs show a ground radar at 10 GHz, 10 kW, PRF 1 kHz, 20 MHz bandwidth. The results are range-Doppler echo detections (range in m, velocity in m/s) of five simulated targets. PS 26055 asks for a passive ES receiver scheduler judged on intercept rate and intercept time. **Framing:** the repo shows the *detection and DSP foundation* (CFAR, range-Doppler, tracking, multi-PRF) that the smart-scan loop sits on. It is not evidence that the scheduler works. The site has to say this plainly, or a judge with RF background will catch it.
2. **81 of 179 `.m` files are empty (0 bytes).** That includes the whole `Receiver/` chain (LNA, mixer, ADC, DDC, AGC…), all `Radar/*Generator.m`, `RadarEquation`, `PropagationChannel`, every `Tests/Test_*.m` except `Test_Config`, every `Scripts/Demo_*.m`, all `Managers/`, and `AI/DecisionEngine.m`, `JammingDetector.m`, `EnvironmentClassifier.m`, `InterferenceDetector.m`. **Never show a file count ("277 files") as a metric, and never list the empty modules as BUILT.** Around 20 real modules have substance (300–1,400 lines each): `CFAR_FiveTargetRadar`, `RangeDopplerCFAR`, `CFARDetector2D`, `MTD`, `MultiPRFAmbiguityResolver`, `KalmanTracker`, `TrackManager`, `TrackAssociation`, `TargetAssociation`, `FiveTargetRadarEchoSimulator`, `MonteCarloFiveTargetRadar`, `SNR_Sweep_MonteCarloFiveTargetRadar`, `SARRS_Telemetry`, `PPIDisplay`, `TrajectoryPlot`, `SARRS_STUDIO_Main_FIXED_Target_Motion`, `CognitiveReceiver` (290 lines).
3. **The AI in the repo is rule-based, not ML.** `ThreatClassifier.m` adds points by range, speed and confidence thresholds (HIGH if the score is at least 7). `TargetPriority`, `ResourceAllocator`, `MissionPlanner`, `ReceiverOptimizer` and `ScanScheduler` (radar resource management: beam priority, revisit, dwell) are 40–90-line heuristics. Label them **PROTOTYPE, rule-based**. The JEV / GNN / SSM / ST-GNN / RL architecture exists only in the AI report, so label it **DESIGNED**.
4. **The Monte Carlo table is 100 identical rows.** `MonteCarlo_PerformanceTable_20260914_011821.csv` gives Pd = 1, 0 false alarms, and range RMSE 1.2601 m in every run, which points to a fixed seed or a deterministic scenario. Do not present it as "100 Monte Carlo runs, 100% detection". Either leave it out or caption it honestly ("100 runs of one fixed scenario gave the same output").
5. **The SNR sweep shows 100% detection from −10 dB to +20 dB.** This is plausible only if "SNR" means per-sample SNR before coherent processing gain. The CSV does not define it. If you chart it, caption it "SNR per sample before range-Doppler integration (as defined in the script; to be confirmed by the team)", and treat the flat line as a sign the scenario is too easy, not as a sensitivity result. Average false alarms per run are 0–0.05, which is a real and showable number.
6. **The repo has no AoA results, no fixed-sweep vs adaptive baseline, and no intercept-rate or intercept-time metrics.** So the spatial-response/AoA chart, the scan-strategy simulation and every smart-scanning metric are **ILLUSTRATIVE** or **PLANNED**, and the site must show them that way.
7. **There are two separate five-target scenarios, so don't mix their numbers.**
   - `DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv`: targets at 25/50/75/110/145 m. Range error is at most ±0.5 m; velocity error is at most 0.165 m/s. **This is the headline table.**
   - `SARRS_Results/FiveTarget_PerformanceTable_20260914_011431.csv`: targets at 75–375 m, range error up to −1.76 m, velocity error ±0.031 m/s. Use it only as a second, labelled run, or skip it.
8. **Real CFAR parameters are in code** (`DSP/CFAR_FiveTargetRadar.m`): 2-D CA-CFAR, guard cells 2 (Doppler) × 2 (range), training cells 6 × 8, Pfa = 1e-4, α = N·(Pfa^(−1/N) − 1). These can drive the CFAR explainer as "parameters from the repo".
9. **All 18 PNGs are MATLAB exports on white backgrounds** (parula colormap, ~3200 px wide). On a dark navy site they need a light "figure plate" frame with a caption and source path. Don't recolour them, because that would falsify the colour scale.
10. **`AppDesigner/Dashboard.mlapp` exists, but there are no screenshots.** It needs a placeholder until the user supplies captures.

---

## 1. What the reference sites do (catalogued from their shipped bundles)

**AVOFLARE (primary model, same author, same 8 sections).** The patterns worth adapting, not copying:

| Pattern | AVOFLARE implementation (quoted labels) | Adapt for AVOLITE |
|---|---|---|
| Skippable canvas intro | "Skip intro", "Replay intro" link in the status strip, `?intro` param | Short radar-sweep intro (max ~3 s), skippable, off under reduced motion |
| Numbered menu with subtitles | Menu items carry a one-line `d` subtitle, e.g. "Problem Statement 26054 and where we stand on A–F", "Watch the full loop, start to finish", "From simulation to the flight line", "The case for adopting it, and why now" | Same, with AVOLITE subtitles (see §3) |
| Section eyebrows | "03 · WHAT WE BUILT", "05 · DEMO", "08 · WHY AVOFLARE" | "01 · THE PROBLEM" … "08 · WHY AVOLITE" |
| Requirement ledger | "Requirements A–F", a tally with the aria-label "1 built, 4 partly built, 1 designed", rows with a letter, name, short evidence ("6 of 8 parameters on CAN", "52 fault types simulated") and a state | Requirement map built from the PS 26055 figures of merit (see §3.01) |
| Status strip | "Simulated data · status from the repository audit", "Simulated data · AI stages designed, not yet running" | "Simulation results · status from the repository audit (30 Sep 2026)" |
| Status tags with provenance | "SIMULATED · MATLAB RUN V46", "PROTOTYPE · MATLAB APP", "PROTOTYPE · DEMO DATA", "ILLUSTRATIVE · RULES FROM THE DESIGN SPEC" | "SIMULATED · CFAR_Performance_Table.csv", "PROTOTYPE · RULE-BASED", "DESIGNED · AI ARCHITECTURE REPORT §6", "ILLUSTRATIVE · TOY MODEL IN BROWSER" |
| Accessible SVG flowchart | `<desc>` holding the full prose of the flow; nodes with ids; prev/next scene navigation | The closed-loop flowchart, with the same `<desc>` treatment |
| Built-pieces carousel | "Five working pieces … All of it runs on simulated data." | The repo's real pieces (CFAR, range-Doppler, tracker, multi-PRF, telemetry/PPI, dashboard) |
| Before/after compare slider | "THEN · MATLAB APP" / "NOW · GCS DASHBOARD" | Raw range-Doppler map vs CFAR detection output (both real PNGs) |
| Threshold explainer copy | "A reading turns to warning when it crosses its limit and stays there…" | CFAR: "the threshold follows the local noise, so the false-alarm rate stays constant" |
| Interactive decision panel | "The system recommends; a person approves… Try it on the panel.", with outcomes "Approved by the engineer…" / "Deferred by the engineer…" | New-cluster approval panel (agent proposes, human approves/modifies/rejects) |
| Custom demo player | Chapter list with `data-t` seek points, keyboard `role="slider"` seek bar, "Chapter titles describe the recorded demo. The footage shown now is a placeholder…" | Same player; chapters follow the smart-scan loop; placeholder note until the video arrives |
| Layered security + threat picker | "Seven security layers, from the hardware up", with crypto chips per layer; "Pick a threat to see how the aircraft responds."; "Standards named here are design targets… not certifications." | Governance layers from AI report §15, plus a failure-mode picker using the report's 7 failure modes |
| Roadmap maturity marker | "MATURITY", "WE ARE HERE", "PHASE 01 · Completed · Prototype · It runs, in simulation." | Same marker, placed honestly at "DSP foundation simulated; AI designed" |
| Cited "why" | "Source · Piancastelli, Drones 2018 … industry research, not an AVOFLARE result"; "WHY NOW"; "Designed benefits, not yet measured in service." | Clarkson ES scheduling papers, cited and marked "not an AVOLITE result" |
| Footer honesty note | "Charts use simulated data from the team's MATLAB/Simulink runs. Steps marked designed or planned describe the architecture, not a running system. Figures from outside research are linked… Scenes are AI-generated illustrations." "© 2026 Team Avoflare · Created by Sandesh Naik" | Same structure, reworded |

**AquaSol (secondary).** Simpler. It uses problem bullet cards with a source line ("Figures from the AquaSol team's pitch deck."), an 8-card feature grid (icon, title, one sentence), a large annotated SVG control-loop diagram with zone labels ("THE EDGE · RUNS ON THE FARM, OFFLINE", "ONCE · PARTLY BUILT", "WHEN ONLINE"), a background-video pause toggle and "Skip to main content". The lesson for AVOLITE is inline status labels *inside* the diagram zones, which is cheaper than a separate legend.

---

## 2. Feature Landscape

Complexity assumes a 1–2 day build: LOW < 1 h, MEDIUM 1–3 h, HIGH > 3 h.

### Table Stakes (judges expect these; missing = feels unfinished or untrustworthy)

| Feature | Why Expected | Complexity | Notes |
|---|---|---|---|
| Hero: name, tagline, one-line explanation, 2 CTAs ("Begin" → #problem, "See how it works" → #how) | First 5 seconds decide whether a judge keeps reading | LOW | Tagline candidate from master doc §52: "Turn a fixed RF sweep into an adaptive, closed-loop scan." Add an SIH chip "SIH 2026 · PS 26055". **No numbers in the hero.** |
| Sticky header with numbered section nav plus active-section highlight | 8 sections on one page need a map | LOW | IntersectionObserver for the active state |
| Mobile menu: 8 items, each with a one-line subtitle | Phone judges; AVOFLARE precedent | LOW | Native `<dialog>` or `popover`; focus trap comes free with `<dialog>` |
| Status tag system (BUILT / SIMULATED / PROTOTYPE / DESIGNED / PLANNED / ILLUSTRATIVE) plus a legend | Core value: judges can tell real from designed | LOW | One component; tag = colour + text (never colour alone); legend in the problem section and footer |
| Provenance line on every number and plot (source file path + run date) | Honesty rule; judges can verify in the repo | LOW | e.g. "SIMULATED · DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv · run 15 Sep 2026" |
| 01 Problem: PS 26055 framing plus a "today vs asked for" contrast | Judges check you understood the PS | LOW | Two columns: Today = open-loop sequential sweep, equal dwell everywhere, no prior intelligence, time lost on non-threatening emitters. Asked for = an ML scheduler that minimises intercept time and keeps intercept rate high against scanning and frequency-agile emitters, trained on hits and misses |
| 01 Requirement map with per-requirement status and tally | AVOFLARE's strongest trust device; maps directly to the PS figures of merit | MEDIUM | See §3.01 for rows. Static list plus tally; each row links to the section that evidences it |
| 02 Closed-loop flowchart (SVG): Observe → Process → Detect → Estimate → Predict → Decide → Scan again | The whole idea of AVOLITE is the loop | MEDIUM | Nodes carry status tags inline (AquaSol style). `role="img"` + `<title>` + full-prose `<desc>` |
| 03 Real results table (CFAR five-target: expected vs detected range and velocity, errors) | Proof of real work | LOW | Data from the CSV converted to JSON at build. Derived max/mean errors are computed, not typed |
| 03 Real MATLAB plots in figure plates with captions | Judges want to see the MATLAB | LOW | 4–6 PNGs converted to AVIF/WebP with explicit width/height; white plate; caption plus source path |
| 04 What's new: two-stage JEV + Evidence → model router → ensemble → RL → human → scheduler | The innovation claim | MEDIUM | All DESIGNED. Static diagram is the minimum; interactive walkthrough is a differentiator |
| 05 Demo: video slot with chapters, plus repo link | PS evaluators expect a demo | MEDIUM | Ships with a placeholder poster and the "footage pending" note; swap the file later with no layout change (fixed aspect-ratio box) |
| 06 Security: governance and reliability layers from AI report §15 | Defence PS; judges ask "can it be trusted / fail safe?" | LOW | Static layered list is the minimum |
| 07 Roadmap: phases plus a "WE ARE HERE" maturity marker | Shows a realistic path | LOW | See §3.07 |
| 08 Why AVOLITE: case vs fixed sweep, cited outside sources marked "not an AVOLITE result" | Closes the pitch | LOW | Clarkson ES scheduling literature (sources below) |
| Footer: SIH 2026, PS 26055, Team Avoflare (team ID TBC), repo links, data-honesty note, "Created by Sandesh Naik" | Required by PROJECT.md | LOW | Team ID as a visible TODO only in the dev build; hide the row if still unknown at launch |
| Reduced-motion support, keyboard nav, visible focus, skip link, AA contrast, alt text | Stated constraint; accessibility is checkable | LOW–MEDIUM | `prefers-reduced-motion` sets end states; every interactive has a static fallback |
| Responsive 1440 / 768 / 390 | Judges open links on phones | MEDIUM | Tables become stacked cards under 768 px; charts get a "View as table" `<details>` |
| Asset placeholders that match final dimensions | Assets arrive later | LOW | Striped plate: "Dashboard screenshot pending · PROTOTYPE · AppDesigner/Dashboard.mlapp" |

### Differentiators (wow factor, tied to the core value)

Ranked by value-to-cost for a judge. The first three are the ones worth the time.

| Feature | Value Proposition | Complexity | Notes |
|---|---|---|---|
| **D1. Scan-strategy simulator: fixed sweep vs adaptive scan** (section 02 or 08) | Makes the whole PS legible in 10 seconds: the same emitters, the same budget, two receivers. It also shows the textbook failure where a periodic sweep **synchronises** with a periodic emitter and never intercepts it (Clarkson). That answers the PS question "how to intercept a periodic scan receiver optimally" | HIGH (≈3–4 h) | Canvas or SVG. Frequency bands on the y-axis, time on the x-axis. 4–6 emitters of master-doc classes E1 persistent, E2 periodic, E3 intermittent, E4 frequency-agile. Fixed sweep = a sawtooth dwell pattern; adaptive = a simple revisit-priority heuristic (revisit bands with recent hits, explore the rest). Hits = cyan ticks, misses = hollow. Live counters: intercepts, mean time-to-first-intercept. Seeded PRNG with a "Reseed" button. **Badge: "ILLUSTRATIVE · toy model running in your browser · not the AVOLITE scheduler, not a result".** Controls: play/pause, speed, reseed; static end-state SVG for no-JS and reduced motion |
| **D2. Interception timeline (hits/misses strip)** | Shows "trained on hits and misses" visually; pairs with D1 | LOW if built on D1 (it is D1's output lane) | Two rows (fixed / adaptive) of hit/miss marks per emitter over time; the same ILLUSTRATIVE badge |
| **D3. JEV walkthrough: observation → cluster → skills → model router → prediction → RL → human → scheduler** (section 04) | Turns the densest part of the AI report into a 6-step story. Judges remember "two decisions: which signal is this, then what to analyse" | MEDIUM (≈2 h) | Stepper with Prev/Next buttons (no scroll-jacking). It uses the report's own worked example (§11: O1052 = 8.4 GHz, 2 µs, 1 ms, −63 dBm, 18 dB, 37° → C17 → Frequency/Temporal/Spatial/Prediction → SSM + ST-GNN → ensemble → RL). **Every value is shown as "ILLUSTRATIVE · worked example from the AI Architecture Report §11".** Toggle "Known signal (fast path)" vs "Deviation (escalation)" changes which models light up (report §10) |
| D4. Skill → model routing matrix (interactive) | Shows that computation is conditional: the report's core claim | LOW (≈45 min) | Checkboxes Temporal / Relational / Spatial; highlights SSM / GNN / ST-GNN / Ensemble per the report §6 mapping table. DESIGNED tag |
| D5. CFAR threshold explainer | Shows real DSP understanding. It is the one interactive that can use **real repo parameters** | MEDIUM (≈2 h) | 1-D cut through a range profile: the test cell, guard cells, training cells and the adaptive threshold line α·noise. Slider for Pfa (1e-2…1e-6) moves the threshold; toggle "fixed threshold" vs "CFAR" over a noise step to show false alarms appearing with the fixed threshold. Parameters default to the repo (guard 2, training 8, Pfa 1e-4, α formula), labelled "parameters from DSP/CFAR_FiveTargetRadar.m". The signal trace is synthetic, so it is **ILLUSTRATIVE**. Pair it with the real 3-panel PNG `04_CFAR_Complete_Analysis.png` (SIMULATED) |
| D6. Before/after compare slider: raw range-Doppler map vs CFAR detection map | Real assets, instant "the detector works" visual | LOW (≈45 min) | `01_Original_Range_Doppler_Map.png` vs `03_CFAR_Detection_Map.png`, which share axes. Native `<input type="range">` over two stacked images; keyboard works by default. SIMULATED |
| D7. Expected-vs-detected chart drawn from the CSV (SVG) | Crisper and on-brand, unlike the white PNG; data stays live from JSON | MEDIUM (≈1.5 h) | Dumbbell chart per target (expected ○ vs detected ●) for range and velocity. Pairs with the table |
| D8. Requirement map rows that deep-link and flash the evidence | The map becomes navigation; judges jump straight to proof | LOW | Anchor plus `:target` highlight |
| D9. Failure-mode picker (section 06) | Mirrors AVOFLARE's "pick a threat". Makes governance concrete | LOW–MEDIUM (≈1 h) | The 7 failure modes from report §15.1 (wrong cluster, wrong skill, model drift, novel signal, prediction error, RL uncertainty, interface failure). Picking one highlights the layer that catches it and shows the fallback text. DESIGNED |
| D10. Human-approval panel (new-cluster workflow) | "The human is the authority": a strong trust point for defence judges | LOW (≈45 min) | Agent-proposed cluster card with Approve / Modify / Reject; the outcome text explains what gets written to the knowledge store. DESIGNED · ILLUSTRATIVE data |
| D11. Spatial-response / AoA chart | Makes AoA decidable at a glance (master doc §20) | MEDIUM | **No AoA results exist in the repo**, so it must be ILLUSTRATIVE (a synthetic beam-scan curve with its peak marked) or a PendingPanel "AoA validation (−60°…+60° test set, master doc §40) pending simulation". Recommend a small ILLUSTRATIVE version in section 02 only |
| D12. Ablation plan ladder (section 04 or 07) | Shows scientific honesty: "each addition must earn its place" | LOW | The 7-step list from report §14.3, all PLANNED; metrics named, no values |
| D13. Scan → detect → process → lock motion motif in the hero | Visual identity; master doc §43 | MEDIUM | CSS/SVG radar sweep; pause toggle; stops offscreen; static under reduced motion |
| D14. Skippable intro | AVOFLARE signature | MEDIUM | **Defer.** Costs time, adds LCP risk, and judges skip it anyway |

### Anti-Features (deliberately NOT built)

| Feature | Why Requested | Why Problematic | Alternative |
|---|---|---|---|
| "Live" dashboard, streaming counters, a "RUNNING ●" badge | Looks impressive; master doc §41 mock has it | No real-time source exists; judges spot fake liveness instantly; PROJECT.md bans "Live" | Replay of exported results with "SIMULATED · run date"; the in-browser toy is called "simulator", not "live" |
| Report example numbers shown as results (9.3 GHz, 0.91/0.92 confidence, −63 dBm, 37°, master doc 2435 MHz / 0.82) | They are vivid and sit right in the source docs | They are worked examples; presenting them as outputs is the #1 mistake in master doc §49 | Show them only inside the D3 walkthrough with an ILLUSTRATIVE tag on every value |
| "100 Monte Carlo runs · 100% Pd" hero stat | The CSV literally says it | 100 identical rows means a fixed scenario; calling it statistical validation is misleading | Show the single-scenario CFAR table; caption the MC result honestly, or omit it |
| "Detects at −10 dB SNR" claim | The SNR sweep CSV shows 100% at −10 dB | SNR definition unconfirmed (probably before processing gain); an easy scenario, not a sensitivity result | Show the false-alarm column (0–0.05 per run) with the caveat, or omit it |
| Big file / module count stat ("277 files", "179 modules") | Quick volume signal | 81 `.m` files are empty stubs; anyone who opens the repo sees it | List about 15 substantive modules by name with line counts, in a "What runs today" list |
| Calling the repo AI modules "ML" or "AI models" | The folder is named `AI/` | They are rule-based threshold scorers | "PROTOTYPE · rule-based decision logic (ThreatClassifier, TargetPriority, ResourceAllocator, CognitiveReceiver)"; ML = DESIGNED |
| Presenting range/velocity accuracy as ES intercept performance | They are the only real numbers | Different problem (active radar echoes vs passive intercept); PS figures of merit are intercept rate and time | Frame as "detection foundation: CFAR and range-Doppler processing validated in simulation"; the intercept metrics row in the requirement map stays PLANNED |
| Adaptive-vs-fixed "X% faster" claim from the in-browser simulator | The toy will produce a number | A toy heuristic is not a result; it invites the question "where is this from?" | The counters stay inside the ILLUSTRATIVE simulator; no headline percentage anywhere |
| Recoloured or cropped MATLAB plots | Match the dark theme | Changes the meaning of the colour scale; looks doctored | White figure plate, original colours, caption and source |
| Scroll-jacked sticky storyboards everywhere, parallax, generic fade-ins | "Premium" feel | Costs hours, hurts INP and mobile, annoys fast skimmers | Motion only for signal activity; steppers use buttons |
| Chart/animation libraries (Chart.js, D3 full, Lottie, Three.js) | Speed of building | Bundle weight, learning cost, off-brand defaults | Hand-drawn SVG from JSON; small canvas for D1 |
| Contact form / backend | "Complete site" | Static only; no data to collect | Repo links; contact block commented out until details exist |
| MathWorks / defence-org logos, fake partner logos, "DRDO-approved" style claims | Credibility | Trademark and truth risk | Tool names as text; citations as links |
| AI-generated imagery of weapons, specific aircraft, or radars presented as real hardware | Mood | Implies hardware that does not exist | AI scenes limited to abstract RF/antenna mood, captioned "AI-generated illustration" |
| Numbers in the OG image / hero | Punchy share card | Numbers lose their tags when shared | OG = logo + tagline only |

---

## 3. Per-section feature spec and content inventory

Legend for the inventory: **NOW** = a real asset or data exists in the repo/docs; **PH** = placeholder needed pending user assets; **GEN** = generated by us (SVG/code), status-tagged.

### Hero
- **Features:** AVOLITE wordmark (cleaned `logo.svg`), eyebrow "SIH 2026 · PS 26055 · Smart Scan strategy for Electronic Warfare", headline plus one-line explanation, CTAs "Begin" / "See how it works", radar-sweep SVG motif with pause toggle, status strip under the fold ("Simulation results · status from the repository audit, 30 Sep 2026 · AI stages designed, not yet running").
- **Inventory:** logo NOW (needs cleanup). Copy NOW (master doc §1, §52). Radar motif GEN. Optional AI mood scene PH/GEN (labelled).

### Header / nav
- **Features:** numbered links 01–08, active-section indicator, scroll progress hairline (optional), mobile menu with subtitles, skip link.
- **Menu subtitles (proposed):**
  - 01 "PS 26055 and where we stand on each requirement"
  - 02 "The closed loop, from RF energy to the next scan"
  - 03 "CFAR, range-Doppler and tracking in MATLAB"
  - 04 "Pick the cluster, pick the skills, run only what's needed"
  - 05 "Watch the loop, then explore the results"
  - 06 "Provenance, fallbacks, the human decides"
  - 07 "From simulation to receiver hardware"
  - 08 "Why adaptive beats a fixed sweep"

### 01 The problem
- **Features:** PS framing paragraph; "Today vs asked for" two-column contrast; emitter-class chips (E1 persistent … E8 unknown, master doc §6); **requirement map** with tally; status legend.
- **Requirement map rows** (derived from PS 26055 text in PROJECT.md; statuses from the repo audit):

| # | Requirement (PS) | Evidence now | Status |
|---|---|---|---|
| A | Signal detection: probability of detection / false alarm | 2-D CA-CFAR, Pfa design 1e-4, 5/5 targets detected, 0–0.05 false alarms per run (radar-echo scenario) | SIMULATED |
| B | Sensitivity | SNR sweep −10…+20 dB exists; SNR definition to confirm | SIMULATED (caveated) |
| C | Receiver scheduler that decides what to scan next | `ScanScheduler.m`, `CognitiveReceiver.m` rule-based radar resource management | PROTOTYPE |
| D | ML-based scheduler trained on hits and misses | JEV + router + RL architecture | DESIGNED |
| E | Spatially scanning and frequency-agile emitters | Emitter classes E2/E4 and the AoA pipeline in the master doc; not in code | DESIGNED |
| F | Average intercept rate / intercept time (error) | No ES interception sim yet | PLANNED |
| G | Average reward/cost, % correct predictions | RL reward and ablation plan (report §14) | PLANNED |
| H | Optimal interception of a periodic-scan receiver | Scan-strategy explainer (D1) illustrates it; no result | DESIGNED (+ ILLUSTRATIVE explainer) |

  The tally reads e.g. "2 simulated, 1 prototype, 3 designed, 2 planned". **The team must confirm the rows before launch.**
- **Inventory:** PS text NOW (PROJECT.md). Emitter classes NOW. All GEN. No PH.

### 02 How it works
- **Features:** closed-loop SVG flowchart covering the master doc §4 chain (RF environment → emitter manager → propagation → antenna/array → receiver → ADC → DDC → DSP → FFT → CFAR → PDW/features → AoA ‖ environment estimate → AI → prediction + uncertainty → smart scheduler → receiver control ↺), each node status-tagged; click or tap a node for a 2-line explainer drawer; a 7-verb loop ring (Observe…Scan again) as a compact mobile version; **D1 scan-strategy simulator + D2 timeline** (recommended home, since it explains *why the loop exists*); small ILLUSTRATIVE spatial-response chart (D11) at the AoA node; "exploration vs exploitation" callout (master doc §28); ground-truth vs observation callout (master doc §26).
- **Node statuses:**
  - CFAR, FFT/range-Doppler, tracking: SIMULATED.
  - Receiver chain, propagation, emitter manager: DESIGNED. The files are empty stubs.
  - AoA, environment estimator: DESIGNED.
  - AI: DESIGNED. The rule-based prototype stays in section 03.
  - Scheduler: PROTOTYPE.
- **Inventory:** architecture text NOW (master doc §4, §27–30). Diagram, simulator and AoA chart GEN. No PH.

### 03 What we built
- **Features:** "What runs today" module list (name, line count, one-line purpose); built-pieces carousel or grid (CFAR detection, range-Doppler + MTD, multi-PRF ambiguity resolution, Kalman tracker + track manager, PPI/telemetry visualisation, App Designer dashboard); **D6 compare slider**; **results table** (CFAR five-target) + **D7 dumbbell chart**; **D5 CFAR explainer** (or place it in section 02 at the CFAR node, whichever is less crowded); honest framing banner: "SARRS is our radar-side detection testbed. The ES smart-scan loop builds on these blocks."; rule-based AI prototype card.
- **Inventory:**

| Item | Source | Status |
|---|---|---|
| Five-target results table | `DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv` (±0.5 m range, ≤0.165 m/s velocity) | NOW · SIMULATED |
| Final target table with power | `DSP/SARRS_Results/CFAR_Threshold_Analysis/FINAL_DEMONSTRATION/SARRS_Final_Target_Table.csv` (power 0 to −5.5 dB) | NOW · SIMULATED |
| Range-Doppler → threshold → detection 3-panel | `…/CFAR_Threshold_Analysis/04_CFAR_Complete_Analysis.png` (+ 01/02/03 separately) | NOW · SIMULATED |
| Annotated five-target range-Doppler map | `DSP/FiveTarget_RangeDoppler_Map_Annotated.png` | NOW · SIMULATED |
| Expected vs detected range/velocity, error plots | `…/CFAR_Performance/Expected_vs_Detected_Range.png`, `…Velocity.png`, `Range_Velocity_Errors.png`, `CFAR_Detection_Map.png` | NOW · SIMULATED |
| Final demo figure | `…/FINAL_DEMONSTRATION/SARRS_Final_Radar_CA_CFAR_Result.png` | NOW · SIMULATED (check visually before use) |
| Timestamped visualisation sets (two runs) | `DSP/SARRS_Results/CFAR_Visualization/*_145537.png` and `*_145619.png` | NOW · spare |
| SNR sweep / false-alarm data | `SNR_Sweep_PerformanceTable_20260915_175606.csv` (latest; identical to 013137) | NOW · SIMULATED, caveated |
| CFAR parameters | `DSP/CFAR_FiveTargetRadar.m` lines 151–177 | NOW |
| Simulation logs (mission/radar config) | `Logs/Simulation_*.txt` (48 files) | NOW · for a "config card" (10 GHz, PRF 1 kHz, 20 MHz BW, marked "simulated radar configuration") |
| App Designer dashboard screenshots | `AppDesigner/Dashboard.mlapp`, no captures | **PH** |
| PPI / A-scope / trajectory screenshots | `Visualization/PPIDisplay.m`, `TrajectoryPlot.m`, but no PNGs exported | **PH** (ask the team to export) |
| Kalman / multi-PRF result plots | code exists, no exported results | **PH** or text-only card |

### 04 What's new
- **Features:** "two decisions" hero statement (Cluster: "which signal is this?" / Skills: "what needs analysing now?"); **D3 JEV walkthrough** with a fast-path/escalation toggle; **D4 routing matrix**; conditional-ensemble explainer; "prediction vs decision" split (specialist AI + ensemble = "what is likely to happen?", RL = "what should the system do next?"); human/agent layer card; **D12 ablation ladder** as "how we will prove each piece earns its place".
- **Inventory:** all text NOW (AI report §2–11, §14.3). Everything is DESIGNED; worked-example values are ILLUSTRATIVE. No PH.

### 05 Demo
- **Features:** video player (native `<video>` with custom chapter list, or native controls plus a chapter `<ol>` of seek buttons, which is the cheaper choice); poster frame; chapter titles following the loop (proposed: "RF scene set-up", "Range-Doppler processing", "CFAR detection", "Tracking five targets", "Dashboard walkthrough", "What the smart-scan loop adds"); "footage pending" note; **results explorer** (tabs: CFAR table / SNR sweep / detection maps), reusing section 03 components; repo CTA "Open the MATLAB code" → GitHub; optional link to run instructions (`Run_Final_SARRS_Demo.m`).
- **Inventory:** video **PH** (user); chapter timestamps **PH**; poster can be GEN from `04_CFAR_Complete_Analysis.png` until then; results NOW; repo URL NOW.

### 06 Security
- **Features:** layered stack (AI report §15), e.g.:
  1. Provenance and audit trail (every prediction/decision, model version and skill config).
  2. Evaluation isolation (simulator ground truth never visible to the AI; master doc §26).
  3. Confidence thresholds and fallback paths.
  4. Cluster-profile protection (one anomalous observation cannot rewrite a profile) plus versioned knowledge graph/model registry.
  5. Human approval for new clusters and high-impact changes, with the audit of agent recommendations.
  6. Sandboxed simulation before any policy touches hardware.
  7. Safe receiver state on interface failure.

  Then add the **D9 failure-mode picker**, the **D10 human-approval panel**, and a "model outputs are estimates, not truth" principle line. Footnote: "Design controls from the AI Architecture Report §15; not certifications and not yet implemented."
- **Inventory:** text NOW (report §9, §12.2, §15, §15.1, §17). Everything is DESIGNED. No PH.

### 07 Roadmap
- **Features:** horizontal phase track (vertical on mobile) with a MATURITY bar and a "WE ARE HERE" marker; each phase has a status, one-line outcome and exit criterion. Proposed phases, from master doc §47–48, §56 and report §17:
  - **P1 DSP foundation**: CFAR, range-Doppler, tracking in MATLAB. SIMULATED, completed, with the **WE ARE HERE** marker at its end.
  - **P2 ES emitter scene + receiver chain**: E1–E8 emitters, fill in the stubbed receiver modules. PLANNED.
  - **P3 AoA + reference-vs-estimate validation** (−60°…+60°). PLANNED.
  - **P4 Fixed-sweep baseline + intercept metrics** (intercept rate, time to intercept). PLANNED.
  - **P5 AI layer**: JEV cluster/skill selection, SSM → +GNN → +ST-GNN ablations. DESIGNED.
  - **P6 RL scheduler closed loop in simulation vs baseline.** DESIGNED.
  - **P7 SDR / multi-channel hardware, human-supervised.** PLANNED.
- **Inventory:** all NOW (docs). The team must confirm phase order and the marker position. No PH.

### 08 Why AVOLITE
- **Features:** 3–4 argument cards:
  1. A fixed sweep wastes dwell on empty or non-threatening bands.
  2. A periodic sweep can lock into step with a periodic emitter and miss it for good. Cite Clarkson.
  3. Recurring known signals take a cheap fast path; compute is spent only on change (AI report §10).
  4. The human stays in command.

  Add a mini fixed-vs-adaptive comparison table using *qualitative* rows (dwell allocation, reaction to new emitters, use of history, frequency-agile handling, explainability), with no invented numbers; a "why now" line only if a citable source exists (none found yet; skip rather than invent); closing CTAs "Watch the demo" / "Back to the start".
- **Inventory:** text NOW (master doc §3, §39; report §10, §16). Citations NOW (see Sources). No PH.

### Footer
- **Features:** project facts (SIH 2026 · PS 26055 · Smart Scan strategy for Electronic Warfare · Team Avoflare · Team ID TBC); links (AVOLITE MATLAB repo, website repo); status legend repeated; data-honesty note ("Results come from the team's MATLAB simulation exports and carry their source file. Steps marked designed or planned describe the architecture, not a running system. Interactive explainers are illustrative toy models. Outside research is linked and is not an AVOLITE result. Scenes are AI-generated illustrations."); "© 2026 Team Avoflare · Created by Sandesh Naik" linking github.com/SandeshSatishhNaik; contact block commented out.
- **Inventory:** NOW except the team ID (**PH**).

---

## 4. Feature Dependencies

```
Status tag + provenance component
    └──required by──> every section (requirement map, tables, plots, explainers)

Build-time CSV → JSON export (results data layer)
    ├──required by──> 03 results table ──> D7 dumbbell chart
    ├──required by──> 01 requirement map evidence text (A, B)
    └──required by──> 05 results explorer (reuses 03 components)

Image pipeline (PNG → AVIF/WebP, fixed dimensions, white figure plate)
    ├──required by──> 03 plots, D6 compare slider
    └──required by──> 05 poster (until video)

Section shell + anchors + header nav
    └──required by──> D8 requirement-row deep links, menu subtitles, active-section highlight

Placeholder component (fixed aspect ratio)
    └──required by──> 05 video, 03 dashboard screenshots (swap later, no layout shift)

D1 scan simulator (seeded PRNG, emitter model)
    └──enables──> D2 interception timeline (same run, extra lane)
    └──enhances──> 08 Why AVOLITE (link "see it in section 02")

02 flowchart ──enhances──> D11 AoA chart, D5 CFAR explainer (anchored at their nodes)
D3 JEV walkthrough ──shares data with──> D4 routing matrix (same skill→model table)
06 layered stack ──required by──> D9 failure-mode picker (highlights a layer)

Reduced-motion / no-JS end states ──required by──> D1, D3, D5, D13 (static SVG fallback first, then animate)

Scroll-jacked storyboards ──conflicts──> 1–2 day deadline + INP/mobile budgets
Headline numbers in hero/OG ──conflicts──> provenance rule
```

### Dependency Notes
- **The tag/provenance component and the data layer come first.** Every real number flows through them, and the honesty checks live there. Build them before any section content.
- **D2 is nearly free once D1 exists.** Build them together, or skip both.
- **D5, D6 and D7 all depend on the image and data pipeline.** D6 is the cheapest visual win, so build it before D5 and D7.
- **Static fallbacks before interactivity.** Every explainer ships as a correct static SVG first; JS enhances it. That ordering de-risks the deadline, because a phase can stop at "static" and still be complete.

---

## 5. MVP Definition

### Launch With (v1, by 2 Oct)
- [ ] Status tag + provenance component, legend: the core value
- [ ] Header nav + mobile menu with subtitles, skip link
- [ ] Hero (static radar motif, CTAs, status strip)
- [ ] 01 Today-vs-asked contrast + requirement map with tally
- [ ] 02 Static closed-loop flowchart with inline status tags
- [ ] 03 CFAR results table (from JSON) + 4–6 real plots in figure plates + "what runs today" list + D6 compare slider
- [ ] 04 Static JEV → router → ensemble → RL → human → scheduler diagram with "two decisions" framing (DESIGNED)
- [ ] 05 Video placeholder with chapter list + repo CTA + results reuse
- [ ] 06 Layered security list + failure-mode list (static)
- [ ] 07 Roadmap with WE ARE HERE marker
- [ ] 08 Argument cards + cited Clarkson sources + qualitative comparison
- [ ] Footer with honesty note
- [ ] Reduced motion, keyboard, AA, responsive at 1440/768/390

### Add After Core Is Up (same 2 days, in this order)
- [ ] D1 + D2 scan simulator and timeline: biggest judge impact; add once all 8 sections render
- [ ] D3 JEV stepper with fast-path/escalation toggle
- [ ] D5 CFAR explainer with repo parameters
- [ ] D7 SVG dumbbell chart
- [ ] D9 failure-mode picker, D10 approval panel, D4 routing matrix (each under an hour)
- [ ] D13 hero sweep animation

### Future Consideration (after SIH submission / when assets arrive)
- [ ] Real demo video + chapter timestamps: blocked on the user
- [ ] Dashboard / PPI screenshots: blocked on team exports
- [ ] AoA validation chart with real data: blocked on the model (repo has no AoA yet)
- [ ] Real fixed-vs-adaptive baseline results replacing the ILLUSTRATIVE simulator counters: blocked on the P4 simulation
- [ ] D14 skippable intro: low value per hour

---

## 6. Feature Prioritization Matrix

| Feature | Judge Value | Cost | Priority |
|---|---|---|---|
| Status tags + provenance | HIGH | LOW | P1 |
| Requirement map | HIGH | MEDIUM | P1 |
| Real CFAR table + plots | HIGH | LOW | P1 |
| Closed-loop flowchart | HIGH | MEDIUM | P1 |
| JEV architecture (static) | HIGH | MEDIUM | P1 |
| Roadmap + WE ARE HERE | MEDIUM | LOW | P1 |
| Security layers (static) | MEDIUM | LOW | P1 |
| Demo slot + chapters (placeholder) | MEDIUM | MEDIUM | P1 |
| Cited Why section | MEDIUM | LOW | P1 |
| D6 compare slider | MEDIUM | LOW | P1 |
| D1+D2 scan simulator + timeline | HIGH | HIGH | P2 (first) |
| D3 JEV stepper | HIGH | MEDIUM | P2 |
| D5 CFAR explainer | MEDIUM | MEDIUM | P2 |
| D7 dumbbell chart | MEDIUM | MEDIUM | P2 |
| D4 / D9 / D10 small interactives | MEDIUM | LOW | P2 |
| D11 AoA chart (illustrative) | LOW–MEDIUM | MEDIUM | P3 |
| D13 hero sweep | LOW–MEDIUM | MEDIUM | P3 |
| D12 ablation ladder | MEDIUM | LOW | P2 |
| D14 intro | LOW | MEDIUM | P3 / skip |

---

## 7. Competitor / Reference Feature Analysis

| Feature | AVOFLARE | AquaSol | AVOLITE approach |
|---|---|---|---|
| Section structure | 8 numbered sections, eyebrow "0N · NAME", menu subtitles | Hero + problem cards + feature grid + control-loop SVG | AVOFLARE's 8-section structure with AquaSol's inline diagram-zone labels |
| Honesty system | BUILT/SIMULATED/PROTOTYPE/DESIGNED/PLANNED/ILLUSTRATIVE + provenance suffix ("· MATLAB RUN V46") | Single source line ("Figures from the … pitch deck") | AVOFLARE system + file-path provenance + ILLUSTRATIVE for in-browser toys |
| Requirement map | Ledger A–F with tally aria-label | None | Ledger A–H from PS 26055 figures of merit |
| Signature interactive | Fault timeline, trust-engine threat picker, compare slider | Background-video toggle | Scan-strategy simulator (fixed vs adaptive, synchronisation failure) |
| Demo | Custom player with 6 chapters, placeholder note | None | Same pattern, loop-based chapters |
| Security | 7 layers with crypto chips, threat picker, "design targets, not certifications" | None | 7 governance layers from report §15, failure-mode picker, "design controls, not yet implemented" |
| Roadmap | MATURITY + WE ARE HERE + phase status | None | Same; marker at the end of the DSP foundation phase |
| Why | Cited industry stats with "not an AVOFLARE result"; WHY NOW | Pitch-deck figures | Cited ES-scheduling literature; no stat invented; skip WHY NOW unless a source exists |

---

## Sources

- AVOLITE repo, local clone of https://github.com/abhishekpj0902-apj/AVOLITE. Read directly: result CSVs, `CFAR_FiveTargetRadar.m` parameters, `ThreatClassifier.m`, AI/Radar/Core headers, empty-file audit (`find -empty`), `Logs/Simulation_2026_09_13_15_01_09.txt`, PNG previews. HIGH
- `E:/Avolite_web/AVOLITE_Master_Project_Documentation.md` §1–6, §15, §20, §26–30, §37–43, §47–50, §56. HIGH
- AVOLITE Complete AI Architecture Report (text export) §1–17. HIGH
- `E:/Avolite_web/.planning/PROJECT.md` (PS 26055 figures of merit and objectives). HIGH
- AVOFLARE site, https://avoflare-web.pages.dev/. Content extracted from the shipped JS bundle (`/assets/main-_p1jGdv2.js`), since the page is client-rendered and WebFetch saw only the title. HIGH for labels quoted
- AquaSol site, https://aquasol-web.pages.dev/. Content extracted from `/assets/LandingBelow-DEiGucVA.js`. HIGH for labels quoted
- Outside research for 08 Why AVOLITE (cite as "not an AVOLITE result"). MEDIUM (abstracts and search summaries read; full papers not reviewed):
  - I. V. L. Clarkson, "Optimisation of Periodic Search Strategies for Electronic Support", https://staff.itee.uq.edu.au/vaughan/Publications/optsearch.pdf. Joint optimisation of sweep and dwell times to minimise intercept time, with reported improvements of more than 10% over other periodic and jittered strategies.
  - I. V. L. Clarkson, "Optimal Periodic Sensor Scheduling in Electronic Support", https://staff.itee.uq.edu.au/vaughan/Publications/dasp-04a.pdf
  - "Optimisation and evaluation of receiver search strategies for electronic support", IET Radar, Sonar & Navigation, https://digital-library.theiet.org/doi/10.1049/iet-rsn.2010.0377
  - Clarkson et al., "Sensor scheduling for electronic support to intercept beam-agile radar", IET RSN 2019, https://ietresearch.onlinelibrary.wiley.com/doi/full/10.1049/iet-rsn.2018.5668. Covers periodic and Markov-chain models of beam-agile radar.
  - "Sensor scheduling in electronic support using Markov chains", IEE Proc. Radar, Sonar & Navigation, https://digital-library.theiet.org/doi/10.1049/ip-rsn%3A20050055
  - "The arithmetic of receiver scheduling for electronic support", https://www.researchgate.net/publication/4035953_The_arithmetic_of_receiver_scheduling_for_electronic_support. The source for "a periodic sweep can synchronise with the radar it seeks".

---
*Feature research for: AVOLITE SIH 2026 storytelling website*
*Researched: 2026-09-30*
