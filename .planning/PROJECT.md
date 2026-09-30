# AVOLITE Website

## What This Is

A single-page storytelling website for AVOLITE, Team Avoflare's Smart India Hackathon 2026 entry for Problem Statement 26055, "Smart Scan strategy for Electronic Warfare". It explains to evaluators and judges what problem AVOLITE solves, how the closed-loop smart-scan system works, what the team has actually built in MATLAB/Simulink, what is new in the AI architecture, and where the project goes next. Every claim on the site is tagged with its true status, so the judges can trust what they read.

## Core Value

A judge who scrolls the page once understands the problem, sees the real MATLAB work, and can tell exactly what is built, what is designed and what is illustrative.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] One long single page with 8 anchored sections, in this order: 01 The problem, 02 How it works, 03 What we built, 04 What's new, 05 Demo, 06 Security, 07 Roadmap, 08 Why AVOLITE (structure modelled on https://avoflare-web.pages.dev/)
- [ ] Hero with the AVOLITE name, tagline, one-line explanation and two calls to action (begin / see how it works)
- [ ] Header with numbered section navigation and a mobile menu that lists all 8 sections with one-line subtitles
- [ ] The problem: frames SIH 26055 (open-loop sweeps lose time on non-threatening emitters; no prior intelligence), "today vs asked for" contrast, and the requirement map with per-requirement status
- [ ] How it works: the closed loop Observe → Process → Detect → Estimate → Predict → Decide → Scan again, from RF environment through DSP, CFAR, PDW/features, AoA, environment estimate, AI, scheduler and receiver control
- [ ] What we built: the real MATLAB/Simulink work from the AVOLITE repo (DSP chain, CFAR, range-Doppler, five-target simulation, AI modules, MATLAB App Designer dashboard) with screenshots, plots and real result tables
- [ ] What's new: the AI architecture from the AI Architecture Report — two-stage JEV + Event/Evidence (cluster selection, then skill selection), adaptive model router (GNN / SSM / ST-GNN), conditional ensemble, RL decision layer, human-in-the-loop, fast path vs escalation
- [ ] Demo: demo video with chapters, plus an interactive in-browser explainer of the smart-scan loop, plus a view of exported MATLAB results, plus links to the repo
- [ ] Security: AVOLITE's own security and reliability design (provenance, model/version audit trail, ground truth separated from AI inputs, human approval for new clusters, confidence thresholds and fallbacks, cluster-profile protection, sandboxed simulation before hardware, failure modes and their mitigations)
- [ ] Roadmap: phased path from simulation prototype to hardware and closed loop, with a "we are here" marker
- [ ] Why AVOLITE: the case for adaptive scanning against a fixed sequential sweep, with cited outside sources kept clearly separate from AVOLITE results
- [ ] Status labelling everywhere: every component and number carries one tag — BUILT, SIMULATED, PROTOTYPE, DESIGNED, PLANNED or ILLUSTRATIVE (merges master doc §50 with the AVOFLARE convention)
- [ ] Real results come only from repo exports (CSV/MAT converted to JSON); illustrative numbers are always labelled ILLUSTRATIVE and never styled as measured
- [ ] Footer with project facts (SIH 2026, PS 26055, team), code links, a data-honesty note, and "Created by Sandesh Naik"
- [ ] Visual direction: dark navy, cyan signal highlights, radar rings, directional beams, spectrum/waveform graphics, engineering labels, large numeric metrics; SVG/code visuals for data and diagrams, AI-generated scene images for mood (labelled AI-generated)
- [ ] Motion: scan → detect → process → AoA lock story, with reduced-motion support
- [ ] Responsive at desktop, tablet and phone widths; accessible (keyboard, focus, contrast, alt text)
- [ ] Deployed to Cloudflare Pages at the end

### Out of Scope

- Reusing AVOFLARE site source code — user chose to build fresh; AVOFLARE is a layout and tone reference only
- Building the MATLAB/Simulink model, the Python AI or the dashboard — they live in the AVOLITE repo; the site only presents them
- A live, streaming dashboard — no real-time data source exists; the word "Live" is not used for simulated data
- Multi-page docs site — single page like AVOFLARE; a separate deep-dive page is allowed only if a section overflows
- Contact form and backend — static site only
- Presenting example numbers (e.g. -92 dBm noise floor, 0.91 confidence, 9.3 GHz prediction) as results — these are illustrative in the source documents

## Context

- **Event:** Smart India Hackathon 2026, Problem Statement 26055, "Smart Scan strategy for Electronic Warfare". The expected solution is ML-based Electronic Support receiver scheduler software. Figures of merit named in the PS: probability of detection, probability of false alarm, sensitivity, average intercept rate, average reward/cost, percentage of correct predictions, average intercept time error. The primary objective is a robust ML scheduler that minimizes intercept time and keeps the interception rate high against spatially scanning and frequency-agile emitters, trained on hits and misses. The PS also asks how to intercept a periodic scan receiver optimally.
- **Team:** same as AVOFLARE (Team Avoflare; the SIH team ID for AVOLITE is still to be confirmed). The site author is Sandesh Naik (github.com/SandeshSatishhNaik), who also built the AVOFLARE and AquaSol sites.
- **Audience:** SIH evaluators and judges. They skim fast and value honesty about what really runs.
- **Source documents in this repo:**
  - `AVOLITE_Master_Project_Documentation.md` — full system concept, architecture, test cases, validation metrics, baseline comparison, status rules (§50), common mistakes (§49), website sections and visual style (§42–43).
  - `AVOLITE_Complete_AI_Architecture_Report.docx` — AI/software architecture (JEV + Evidence cluster and skill selection, model router, GNN/SSM/ST-GNN, ensemble, RL, human/agentic layer, fast path and escalation, security and governance §15, ablation plan). This is the main source for "What's new" and "Security".
  - `logo.svg` — supplied logo (VTracer auto-trace; needs cleanup before use).
- **Code repo:** https://github.com/abhishekpj0902-apj/AVOLITE (1 commit, 29 Sep 2026, 277 files under `04_MATLAB/`; 81 of 179 `.m` files are empty — never cite a file count on the site). "SARRS" = Self-Adaptive Reconfigurable Radar Receiver System, an active-radar DSP testbed (10 GHz, range-Doppler, CFAR), not an ES intercept simulator; its "AI" modules are rule-based. Contents include DSP (CFAR, CA-CFAR 2D, adaptive CFAR, range-Doppler, MTI/MTD, multi-PRF Doppler, Kalman tracker, pulse compression), AI modules (DecisionEngine, ThreatClassifier, JammingDetector, TargetPriority, ReceiverOptimizer, CognitiveReceiver and others), `AppDesigner/Dashboard.mlapp`, visualization (PPI, A-scope, B-scope, spectrum viewer), tests, and `SARRS_Results/` with real outputs (CFAR performance tables, five-target detection tables, range-Doppler and CFAR PNGs). Internal name in code is "SARRS". The user will give more repo details later.
- **Real results available now:** e.g. five-target CFAR run — range error within ±0.5 m and velocity error within about ±0.17 m/s against expected targets (from `CFAR_Performance_Table.csv`). These can be shown as SIMULATED.
- **Reference sites:** https://avoflare-web.pages.dev/ (primary model: 8 sections, intro, status tags, requirement map, flowchart, built-pieces carousel, before/after slider, fault timeline, interactive panels, demo with chapters, layered security with interactive "trust engine", roadmap with maturity marker, cited "why" section) and https://aquasol-web.pages.dev/ (simpler feature cards, comparison table, tech stack columns).
- **User answers (2026-09-30):**
  - AoA and ML scheduler code exist outside the AVOLITE repo (not yet shared). Until that code or its results arrive, AoA and the ML scheduler are tagged DESIGNED; upgrade to PROTOTYPE/SIMULATED only with evidence.
  - SARRS framing approved: SARRS is the radar DSP/detection testbed and foundation; the ES smart-scan scheduler is the designed layer on top.
  - Headline result: `04_MATLAB/DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv` (5/5 targets detected, range error within ±0.5 m, velocity error at most 0.165 m/s), tagged SIMULATED. The second five-target run (75–375 m) is shown separately or not at all, never merged.
  - A dashboard exists (MATLAB App Designer). Tag PROTOTYPE on simulated data until screenshots confirm what runs.
  - SNR definition in the sweep script: PENDING from the team; the SNR sweep is not shown as a result until defined.
  - Monte Carlo CSV (100 identical rows) is not shown as a distribution.
- **Pending from user:** team ID; demo video; dashboard screenshots and other assets; AoA/ML scheduler code or results; SNR definition; more repo details.
- **Existing `CLAUDE.md`** describes an earlier Astro 9-section plan and files that no longer exist (DESIGN_PLAN.md, the old spec, `src/`). The user chose to start fresh and re-decide stack and design, so its stack/token pins are not binding. It still carries useful rules (data honesty, accessibility, motion restraint), which are kept where they fit.

## Constraints

- **Timeline:** live within 1–2 days (by 2 Oct 2026) — forces coarse phases, reuse of proven patterns, and no speculative features
- **Honesty:** no number appears without a status tag; illustrative values never look like measured results; outside research is cited and marked "not an AVOLITE result"
- **Hosting:** Cloudflare Pages, static output; deployment happens in the final step only, and never without the user asking
- **Assets:** real screenshots, plots and the demo video arrive later — sections must ship with clearly marked placeholders and swap in assets without layout changes
- **Stack:** to be decided by research/planning (user asked to re-decide stack and design from scratch); must produce a fast static site
- **Performance/accessibility:** mobile-friendly, reduced-motion respected, WCAG AA contrast, keyboard navigable

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Website only in this repo | MATLAB/AI/dashboard live in the AVOLITE repo | — Pending |
| Start fresh; old DESIGN_PLAN/spec/src dropped | User confirmed; master doc + AI report are the new source of truth | — Pending |
| Re-decide stack and design | User choice; CLAUDE.md pins not binding | — Pending |
| AVOFLARE 8-section single-page structure | User's own proven template for SIH judges | — Pending |
| Build fresh, no AVOFLARE code reuse | User choice | — Pending |
| Status tags: BUILT / SIMULATED / PROTOTYPE / DESIGNED / PLANNED / ILLUSTRATIVE | Merges master doc §50 with AVOFLARE's convention; judges see truth at a glance | — Pending |
| Imagery: SVG/code for data and diagrams, AI scenes for mood | User chose "mix" | — Pending |
| Team = Team Avoflare | User said same as AVOFLARE | — Pending |
| Deploy to Cloudflare Pages at the end | User instruction | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-09-30 after initialization*
