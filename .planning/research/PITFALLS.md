# Pitfalls Research

**Domain:** Animation-heavy single-page engineering storytelling site for a hackathon entry (SIH 2026, PS 26055 "Smart Scan strategy for Electronic Warfare"), static, Cloudflare Pages, 1–2 day deadline
**Researched:** 2026-09-30
**Confidence:** HIGH for credibility pitfalls (checked against the actual AVOLITE repo source), HIGH for Cloudflare and GSAP facts (official docs), MEDIUM for browser quirks and judge behaviour (known patterns, not re-verified this session)

---

## Key finding first: the repo does not match the pitch

I checked the AVOLITE repo (`abhishekpj0902-apj/AVOLITE`, tree via GitHub API, source read raw). These facts drive most of the critical pitfalls below:

| What the site will want to say | What the repo actually contains | Honest label |
|---|---|---|
| "AI modules" (ThreatClassifier, DecisionEngine, and others under `04_MATLAB/AI/`) | **Hand-written rule-based scoring.** For example, `ThreatClassifier.m` adds points for range < 30 km, velocity > 500 and confidence > 0.9, then thresholds the score into HIGH/MEDIUM/LOW. Nothing is trained and no model is learned. | PROTOTYPE, described as "rule-based decision logic". Never "AI" or "ML". |
| "Smart scan scheduler" | `Radar/ScanScheduler.m` is labelled "Radar Resource Management". It maps threat level to a fixed revisit and dwell time (20/100/500 ms) and sorts by priority. That is a monostatic radar beam scheduler, not the ES intercept scheduler PS 26055 asks for. | PROTOTYPE (rule-based RRM). The ML ES scheduler is DESIGNED. |
| "AoA estimation" | No AoA, DoA, MUSIC or ESPRIT file in the tree. | DESIGNED or PLANNED, unless the user shows otherwise. |
| "Signal detection, DSP" | Real: CFAR (CA, 2D, adaptive), range-Doppler, MTI/MTD, pulse compression, Kalman, five-target Monte Carlo, SNR sweep, 8 CSVs, 18 PNGs, 15 `.mat` files | SIMULATED (the strongest real evidence) |
| GNN / SSM / ST-GNN / RL / JEV architecture | Only in the AI Architecture Report. The report's own §17 says JEV's maths is "to be finalized" and that "End-to-end claims should be backed by latency and accuracy measurements rather than architecture diagrams alone." | DESIGNED |
| Internal name | Code says "SARRS" / "SARRS STUDIO" in headers, folders (`SARRS_Results/`) and PNG filenames | Explain it once (see Pitfall 3) |

Other repo facts: one commit (29 Sep 2026), result files dated 14–15 Sep, **no README and no LICENSE**, and `.asv` autosave files committed. PNGs are small (≤ 163 KB each), so "large repo PNGs" is not a real risk. The `.mat` files (up to 6.6 MB) are, if anyone copies them into `public/`.

---

## Critical Pitfalls

### Pitfall 1: Calling rule-based code "AI" in front of judges

**What goes wrong:**
The "What we built" section lists ThreatClassifier, DecisionEngine and CognitiveReceiver under an "AI" heading. A judge opens the repo link the site gives them, sees `if Range < 30000, Score = Score + 3`, and from then on doubts every claim on the site, including the true ones.

**Why it happens:**
The folder is literally named `AI/` and the files have AI-sounding names. The PS asks for an ML scheduler, so the team wants to look as if it already has one.

**How to avoid:**
- Split the story into two blocks that never share a heading: **"What runs today"** (DSP + rule-based decision logic, SIMULATED/PROTOTYPE) and **"What we designed next"** (the ML architecture, DESIGNED).
- Describe the `AI/` modules as "rule-based threat scoring and scan prioritisation. This is the baseline the ML scheduler will be measured against." That turns a weakness into a strength: the master doc §49 lists "having no baseline" as a mistake, and here the rule-based code *is* the baseline.
- Rule of thumb: the words "AI", "ML", "learns", "trained", "predicts" and "intelligent" may only appear next to a DESIGNED or PLANNED tag.

**Warning signs:**
The copy says "AI" in the "What we built" section. A status tag of BUILT or SIMULATED sits on anything under `04_MATLAB/AI/`. A screenshot caption says "AI decision".

**Phase to address:** Content/copy phase (before any visual build). Check again in the final honesty pass.

---

### Pitfall 2: Illustrative numbers that look like results

**What goes wrong:**
Source documents contain example values (−92 dBm noise floor, 0.91 confidence, 9.3 GHz prediction, plus the old site's 38.0° / 37.4° / 0.6° / 94.2%). They end up in big animated metric counters, the most "result-looking" style there is. A judge who asks "where is 94.2% from?" gets no answer.

**Why it happens:**
Large numeric metrics are part of the visual direction. Real numbers arrive late, and placeholder values get styled like final ones "for now".

**How to avoid:**
- One data file. Every number renders from it, and each entry has a `status` field. The build fails if a number has no status (a small zod or plain-JS check is enough).
- ILLUSTRATIVE numbers get a *different visual treatment*, not just a tag: no count-up animation, muted colour, and a hatched or outlined chip. The large cyan counter style is reserved for SIMULATED values from repo CSVs.
- Use the real numbers that exist now: the five-target CFAR run (range error within ±0.5 m, velocity error about ±0.17 m/s, from `CFAR_Performance_Table.csv`) and the Monte Carlo and SNR sweep tables. Give every one a source line: file name, run date and "simulation, 5 synthetic targets".
- Put numbers into the hero and the OG image only if they are SIMULATED and carry their context. Safer: no numbers there at all.

**Warning signs:**
A number typed directly into a component. A counter animation on a value that has no CSV behind it. The team can't name the file a number came from.

**Phase to address:** Data layer phase (before sections are built). Enforce in the build. Final honesty pass.

---

### Pitfall 3: Site–repo mismatch ("SARRS" radar DSP vs a PS 26055 ES scheduler)

**What goes wrong:**
The site says "AVOLITE, a smart ES scan scheduler". The repo says "SARRS STUDIO", range-Doppler, monostatic radar with five targets. The judge concludes the team either reused an unrelated project or doesn't understand the PS. ES receivers are passive: they intercept emitters and have no range-Doppler returns of their own, so the difference is obvious to an EW-literate judge.

**Why it happens:**
The team built what they could in time, and the DSP is a real, reusable foundation. The pitch was written from the PS, not from the code.

**How to avoid (the honest framing):**
- Say it out loud, once, in "What we built": *"Our simulation code is named SARRS internally. It currently models a monostatic radar DSP chain (range-Doppler, CFAR, tracking) on five synthetic targets. We use it as the signal-processing and detection testbed. The ES-specific parts (passive intercept, PDW extraction, AoA, the ML scan scheduler) are designed and are next on the roadmap."*
- Map every repo artefact to the closed loop and give each stage its status. The requirement map in "The problem" should show the true state per PS figure of merit: Pd and Pfa can be shown today from CFAR (SIMULATED), while average intercept time/rate, reward/cost and prediction accuracy are PLANNED.
- The roadmap's "we are here" marker sits at "DSP/detection testbed simulated", not further along.
- Don't rename things in screenshots. Show "SARRS" in plot titles and explain it, rather than cropping it out; cropping looks like hiding.

**Warning signs:**
The site never uses the word "SARRS". "How it works" shows ES stages (PDW, AoA, scheduler) with no status tags. The requirement map is all green.

**Phase to address:** Content/copy phase (framing decision, needs user sign-off). "What we built" and "Roadmap" sections.

---

### Pitfall 4: Over-claiming defence/EW capability

**What goes wrong:**
Copy like "detects and neutralises hostile radars", "battlefield-ready", "real-time threat intelligence", "live spectrum", "jamming". EW judges (possibly DRDO/defence reviewers) recognise marketing at once. "Jamming" also implies EA (electronic attack), which is outside an ES scheduler PS.

**Why it happens:**
The EW theme invites dramatic language. AI-written copy defaults to it.

**How to avoid:**
- Use the PS's own vocabulary: Electronic Support, intercept, scan schedule, frequency-agile, spatially scanning emitters, Pd, Pfa, intercept time.
- Words to avoid: "Live", "real-time" (unless latency is measured), "deployed", "battle-tested", "military-grade", "neutralise", "defeat", "guaranteed".
- Say "simulation" wherever the claim would otherwise be read as about hardware. Hardware (SDR, multichannel receiver) belongs in the roadmap only.
- Stay clear of operationally sensitive content: no real emitter parameters, named platforms or real radar databases. Synthetic scenarios only, and say so.

**Warning signs:** You find any of the words to avoid in the copy. A hero image showing a fighter jet or missile. "Security" section wording suggests the product is secure in the field rather than *designed* with safeguards.

**Phase to address:** Content/copy phase. Final copy audit (grep for the banned list).

---

### Pitfall 5: Uncited or misattributed outside statistics in "Why AVOLITE"

**What goes wrong:**
"Adaptive scanning improves intercept probability by 40%" with no source, or with a source that says something else. Worse still, the figure sits next to AVOLITE numbers in the same style, so it reads as the team's result.

**How to avoid:**
- Every outside claim gets an inline citation (author/org, year, link) and a visible "Not an AVOLITE result" note.
- Style outside figures differently from AVOLITE figures, for example as a quote block rather than a metric tile.
- Only cite sources you have opened and read. If a firecrawl or search summary gave you the number, check it on the source page itself. Prefer qualitative claims ("sequential sweeps waste dwell on non-threatening emitters") over numbers when no solid source exists.
- If no solid source turns up by the deadline, cut the statistic. An empty cited section is better than a fake one.

**Warning signs:** A percentage with no link. A link to a blog or aggregator instead of the paper. The same style used for cited and own numbers.

**Phase to address:** "Why AVOLITE" section build. Research subtask (flag: needs targeted literature lookup).

---

### Pitfall 6: Interactive "demo" mistaken for the real system

**What goes wrong:**
The in-browser smart-scan explainer shows a beam finding emitters and a scheduler "learning". A judge assumes it is the model running. When asked, the team admits it is scripted JavaScript, and it now feels like a trick. The AVOFLARE-style "trust engine" interactive in Security has the same risk.

**How to avoid:**
- Put a permanent tag *inside* the interactive frame, not in a caption below: "ILLUSTRATIVE, scripted explainer, not the AVOLITE model".
- Keep its visuals clearly schematic (abstract emitters, no fake dB axes or fake accuracy readouts).
- Put the real evidence right beside it: repo PNGs and CSV tables tagged SIMULATED, and the demo video once it exists.
- The demo video must be an actual screen recording of MATLAB/App Designer. If it contains any motion graphics, label them.

**Warning signs:** The explainer shows numeric metrics. The tag is only visible on hover. The video includes website animations passed off as the dashboard.

**Phase to address:** Demo section phase.

---

### Pitfall 7: Placeholders that ship as final, or sections left empty

**What goes wrong:**
The demo video, dashboard screenshots and team ID arrive late or never. On deadline day the site has "Lorem", grey boxes, "TODO", a broken `<video>`, or a "Demo" section with nothing in it, and judges notice empty sections before anything else.

**Why it happens:**
The team polishes the hero radar animation for hours while five sections are still unwritten. The asset handoff has no cutoff time.

**How to avoid:**
- **Build breadth first.** Every one of the 8 sections gets final copy and a real-or-honest-placeholder visual before *any* animation work starts. The site must be shippable at the end of each phase.
- Design the placeholder component so it is honest on its own ("Demo video: recording in progress. Meanwhile, see the MATLAB results below and the repo"). Give it the final aspect ratio so swapping in the asset causes no layout shift.
- Add a build-time or CI grep that fails on `TODO|lorem|placeholder.png|XXX|TBD` in the output, except for the named honest-pending component.
- Set an asset cutoff time (for example 12 hours before the deadline). Anything later ships as the honest placeholder.
- Keep the team ID in one constant, with "Team ID pending" as the rendered fallback.

**Warning signs:** The hero has three animation revisions while sections 06–08 have no copy. No section shows a working placeholder. The e2e screenshot of the full page shows grey boxes.

**Phase to address:** Roadmap structure: phase order must be skeleton + copy for all sections → real assets/data → motion → polish. The final QA phase greps for leftovers.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Typing numbers directly into components | Fast | Illustrative values leak as results; no single place to swap in real data | Never |
| Copying repo PNGs as-is into `public/` | Zero effort | 18 unoptimised plots, white MATLAB backgrounds on a dark site, no width/height set so the layout shifts | Acceptable for the first pass *if* width/height are set. Convert to WebP/AVIF and add a dark frame or padding later. |
| Copying `.mat` files for "download data" | Looks thorough | Up to 6.6 MB each, useless in a browser | Never. Link to the repo instead. Convert only the needed values to JSON. |
| One giant GSAP timeline for the whole page | Quick to choreograph | Every edit breaks the offsets; refresh bugs | Never. Use one ScrollTrigger per section, created top to bottom. |
| Autoplaying the background video in the hero | "Wow" factor | Mobile data, LCP, iOS autoplay rules, reduced motion | Never on this site. Use an SVG radar instead. The video belongs in the Demo section with a poster and click-to-play. |
| Skipping the no-JS/reduced-motion state | Saves hours | Judges on locked-down laptops or projectors see blank sections | Never. Render every visual in its final state server-side and let the animation start from it. |
| Using AI-generated mood images without labels | Looks polished | Judges may read them as the team's hardware or field tests | Only with a visible "AI-generated illustration" label, and never showing hardware that does not exist |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Cloudflare Pages build | Assuming the local Node version is used. The v3 build image defaults to **Node 22.16.0** unless you set `NODE_VERSION` or add `.nvmrc`/`.node-version` (official docs). A framework that needs a newer Node fails only in the cloud. | Commit `.node-version` that matches local `node -v`. Run `npm ci && npm run build` from a clean clone before the first deploy. |
| Cloudflare Pages limits | Committing big media | Each asset may be at most 25 MiB, with 20,000 files on the free plan and a 20-minute build timeout (official docs). Host the demo video on YouTube (unlisted) or Cloudflare Stream if it goes over 25 MiB; never commit it to git. |
| Cloudflare Pages URL / `site` config | Canonical/OG URLs pointing at a placeholder domain | Decide the project name early (`<name>.pages.dev`). Set `SITE_URL` in the production env. Preview deploys use `CF_PAGES_URL`. |
| Cloudflare Git integration | Pushing to `main` for a test, which deploys publicly | Work on branches (preview URLs). Push to `main` only when the user asks (project rule). |
| AVOLITE repo links | Linking to a repo with no README; judges land on a bare folder tree full of `.asv` files | Ask the repo owner to add a short README ("SARRS = AVOLITE simulation testbed; how to run; where results are"). Deep-link to specific result files and folders, not only the root. |
| Repo result CSVs → site JSON | Hand-copying values, which introduces typos | A tiny Node script turns the CSV into JSON with source filename + date. The site shows the source file name next to each table. |
| Demo video embed | YouTube iframe loaded eagerly (≈500 KB+ of JS, hurts LCP) | Show a lite poster image + a click-to-load iframe, or a native `<video preload="none" poster=...>` |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Animating CSS `filter` (blur/glow) on SVG | Jank, dropped frames, hot laptop fan, worst in Safari | Glow = a pre-blurred duplicate stroke; animate only its `opacity`. Animate only transform, opacity and stroke-dashoffset. | Immediately on mid-range laptops and any iPhone |
| Late web fonts swapping in | CLS as headings reflow; pinned sections calculated at the wrong heights | Self-host fonts, preload the one heading font, use metric-matched fallbacks (`size-adjust`), and call `ScrollTrigger.refresh()` after `document.fonts.ready` | On the first visit over a slow network (hackathon venue Wi-Fi) |
| Images without width/height | Layout shift; ScrollTrigger start/end positions go stale because images load after triggers are calculated | Always set `width`/`height` or `aspect-ratio`. Refresh ScrollTrigger after `load`. | Any page with lazy images below pinned sections |
| ScrollTriggers created out of page order | Triggers below a pinned section fire early or late, by exactly the pin distance | Create triggers top to bottom. Otherwise set `refreshPriority` (GSAP docs: "ScrollTriggers further down on the page could be affected by pins further up") | As soon as there are 2+ pins |
| Mobile address-bar resize causing refresh jumps | Page jumps while scrolling on iOS/Android | `ScrollTrigger.config({ ignoreMobileResize: true })` (GSAP docs). Use `svh`/`dvh` instead of `100vh` for full-height sections. | On every phone |
| Hero video / Lottie / heavy canvas | LCP > 4 s on mobile; Lighthouse score in the 50s | SVG + a small amount of JS. The only video is in the Demo section, click-to-play. | Phones on 4G, and venue Wi-Fi |
| Continuous radar loop running offscreen | Battery drain, INP lag while the page scrolls | Pause loops with IntersectionObserver or ScrollTrigger `toggleActions`. Provide a pause button (WCAG 2.2.2 for motion > 5 s). | Long visits, low-end laptops |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Publishing real or realistic emitter parameters, named platforms, or anything resembling an operational threat library | Defence sensitivity; a judge flags it; possible disqualification concerns | Synthetic scenarios only, stated explicitly. Show no real frequencies or PRIs tied to named systems. |
| The "Security" section implying the product *is* secure or certified | Over-claim (Pitfall 4) | Frame it as "security and reliability *design*" and tag each control DESIGNED/PLANNED. The AI report §15 lists controls as "should", not as implemented. |
| Leaking personal data (phone numbers, college emails, SIH login details) in the footer or in commits | Spam, impersonation | Contact details stay commented out until the team supplies them (existing project rule). No emails in the source. |
| Third-party embeds with trackers (YouTube, analytics) | Privacy, performance | Click-to-load embeds. Cloudflare Web Analytics (cookieless) if analytics is wanted at all. |
| Adding no security headers on Pages | Minor, but reviewers sometimes check | A `_headers` file with a basic CSP, `X-Content-Type-Options`, `Referrer-Policy`. Cheap, static. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Scroll-jacking / long pinned storyboards | Judges skim with a trackpad or keyboard, get "stuck" in a pin for 3 screens, and give up before sections 05–08 | Pin at most one section ("How it works"), keep it short (≤ 150vh of scroll), and don't pin on mobile. Never override native scroll (no ScrollSmoother or scroll snapping on the whole page). |
| Key content only appearing after an animation | A judge who scrolls fast, or has reduced motion on, sees empty frames | Everything is visible in its final state by default. Animation only enhances. Test with JS off and with `prefers-reduced-motion`. |
| Low contrast on dark navy under a projector | Projectors wash out dark themes. Grey-blue body text (#7B91B0-ish) becomes unreadable from the back of a room. | Body text ≥ 7:1 where possible (AA minimum 4.5:1). Captions no dimmer than AA. Test the page with the screen brightness at 50%. Keep cyan for accents, not paragraphs. |
| Small text for judges on 1366×768 laptops or 1280×720 projectors | Sections don't fit; text is tiny; labels overlap on charts | Test at 1280×720 and 1366×768, not just 1440. Body ≥ 17px. Keep each section's key message above the fold at 720p. |
| Motion sickness from large parallax, rotating beams or zooms | Nausea, discomfort; fails WCAG 2.3.3 intent | No parallax. Keep the radar sweep small and give it a pause toggle. Under reduced motion, show static end states and no auto-looping at all. |
| Nav that hides sections (hamburger only on desktop; auto-hiding header; unnumbered anchors) | Judges can't jump to "What we built" or "Demo", the sections they care most about | Always-visible numbered nav 01–08 on desktop. The mobile menu lists all 8 sections with subtitles (already a requirement). Active-section highlight. Anchor offsets account for the sticky header (`scroll-margin-top`). |
| Status tags that are too subtle | The honesty system, the site's core value, goes unnoticed | Put a status legend near the top (in The problem or the hero). Tags use text + shape, not colour alone. Keep them readable at projector distance. |
| Jargon without definition (CFAR, PDW, JEV, SSM, ST-GNN) | Non-EW judges get lost; EW judges spot vague use | Define each on first use in one line (tooltip or `<abbr>` + inline gloss). JEV in particular: the report itself says its maths is not finalised, so describe what it does, not formulas. |
| Info overload in "What's new" (7+ model names) | It reads as buzzword stacking — the AI report §17 itself warns "the architecture can become over-engineered" | Show the *idea* (fast path for known emitters, escalation for novel ones) as one diagram. List the model names in secondary detail, all tagged DESIGNED. Mention the ablation plan as the way it will be proven. |

## "Looks Done But Isn't" Checklist

- [ ] **Status tags:** every number, chart, screenshot and component carries exactly one tag. Verify with grep and a visual pass of the full-page screenshot.
- [ ] **"AI" wording:** no "AI/ML/learned/trained" next to BUILT or SIMULATED. Verify: `grep -riE "\b(AI|ML|machine learning|trained|learns)\b"` over the content and check each hit.
- [ ] **SARRS explained:** the word appears on the site with a one-line explanation. Verify by searching the page for "SARRS".
- [ ] **Real results have provenance:** each SIMULATED table or plot names its source file + run date + scenario (5 synthetic targets).
- [ ] **Outside stats cited:** every outside number has a working link + a "Not an AVOLITE result" note. Click every link.
- [ ] **No "Live":** grep for `\blive\b|real-time|realtime` in the copy.
- [ ] **Reduced motion:** turn on OS reduced motion and reload. Every section must be fully visible and static, with no looping animation.
- [ ] **JS disabled:** every section renders its content and final visual state.
- [ ] **Placeholders:** grep the build output for `TODO|lorem|TBD|XXX`. Every pending asset uses the honest pending component with a final aspect ratio.
- [ ] **Nav:** every anchor lands with its heading visible below the sticky header. The mobile menu opens, closes, traps focus and closes on Esc.
- [ ] **Projector test:** view at 1280×720 with brightness reduced. All body text and tags are readable.
- [ ] **iOS Safari:** test on a real iPhone or a WebKit Playwright run. Check for no horizontal scroll, pinned sections not jumping, video with `playsinline` + poster, and `100vh` not cut off by the toolbar.
- [ ] **Cloudflare:** a clean clone builds with the committed `.node-version`. A preview deploy works before production. OG/canonical URLs use the real `pages.dev` domain, not a placeholder.
- [ ] **Repo link:** the link target has a README, or the site deep-links to result folders.
- [ ] **Footer:** team ID shows the real value or "pending", never a made-up number.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Illustrative number shipped as a result | LOW | Change its status in the data file to ILLUSTRATIVE (the style switches automatically) or delete it. Redeploy. |
| "AI" claim on rule-based code already live | LOW | Rename the heading to "Rule-based decision logic (baseline)", retag it PROTOTYPE, and redeploy. Don't argue for the claim if a judge asks; agree and point to the DESIGNED ML architecture. |
| Scroll/pin bugs found hours before the deadline | MEDIUM | Disable the pin (remove the ScrollTrigger and let the section scroll normally). Because the visuals are server-rendered in their final state, nothing is lost. |
| Cloudflare build fails on deploy day | LOW–MEDIUM | Set `NODE_VERSION` in project settings. Or build locally and use direct upload (`wrangler pages deploy dist`) as a fallback. Rehearse this once in advance. |
| Demo video never arrives | LOW | The honest pending component stays, and the section leans on repo plots, tables and the interactive explainer (tagged ILLUSTRATIVE). |
| Out of time with sections still bare | HIGH if building depth-first; LOW if breadth-first | Cut motion entirely and ship the static site. That only works if the phases were ordered breadth-first. |

## Pitfall-to-Phase Mapping

Suggested phases (coarse, 1–2 days): **P1 Skeleton + stack + deploy pipeline → P2 Content, status system, data layer → P3 Sections with real assets / honest placeholders → P4 Motion + interactive explainer → P5 QA, honesty audit, launch.**

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Rule-based code called "AI" (1) | P2 | AI-word grep; every `04_MATLAB/AI/` item tagged PROTOTYPE with "rule-based" wording |
| Illustrative numbers as results (2) | P2 (data file + status field + build check) | Build fails on a number without a status; ILLUSTRATIVE style has no count-up |
| Site–repo / SARRS mismatch (3) | P2 (framing sign-off with the user), P3 ("What we built", roadmap marker) | "SARRS" appears with an explanation; requirement map shows mixed statuses; "we are here" is at the DSP testbed |
| Defence over-claim (4) | P2 | Banned-word grep in P5 |
| Uncited stats (5) | P3 ("Why AVOLITE") | Every outside figure links to a primary source + "not an AVOLITE result" |
| Demo read as the real system (6) | P4 | Tag visible inside the interactive frame without hover |
| Placeholders never replaced / empty sections (7) | Phase order itself (breadth first); P3 honest-pending component; P5 grep | Full-page screenshot at the end of P3 shows all 8 sections with content |
| Cloudflare Node version / limits | P1 (deploy a hello-world preview on day 1) | Preview URL builds from a clean clone |
| Late fonts / images → CLS + stale pins | P1 (font setup), P3 (image dimensions), P4 (refresh after fonts/load) | Lighthouse CLS ≤ 0.05; pins correct after a hard reload on slow 3G emulation |
| ScrollTrigger order / pin bugs / iOS resize | P4 | Test with WebKit + a real iPhone; `ignoreMobileResize`; no pin under 768px |
| SVG filter jank | P4 | Performance panel: no long frames during the radar loop; no `filter` in animated properties |
| Heavy video on mobile | P3 (Demo embed pattern) | No video bytes loaded before a click; LCP ≤ 2.5 s mobile |
| Scroll-jacking, motion sickness | P4 | ≤ 1 pinned section; reduced-motion run shows static page; pause toggle works |
| Dark-theme contrast on projectors | P1 (tokens), P5 (projector test) | axe 0 contrast violations; manual 1280×720 dim-screen pass |
| Nav hiding sections | P3 | All 8 anchors reachable by keyboard and in the mobile menu; `scroll-margin-top` correct |
| Scope creep / polishing one section | Roadmap: motion only after P3 is done | P3 exit criterion: all 8 sections shippable statically |

## Sources

- AVOLITE repo tree and source, read 2026-09-30 via GitHub API/raw: `04_MATLAB/AI/ThreatClassifier.m`, `04_MATLAB/Radar/ScanScheduler.m`, the file list (no AoA/ML files, no README/LICENSE, PNG ≤ 163 KB, `.mat` up to 6.6 MB) — HIGH
- `AVOLITE_Master_Project_Documentation.md` §49 (common mistakes: "showing example numbers as measured results", "having no baseline") and §50 (status rules) — HIGH
- AVOLITE AI Architecture Report §15 (security controls written as "should"), §17 (JEV maths not finalised; over-engineering risk; "claims should be backed by latency and accuracy measurements rather than architecture diagrams alone") — HIGH
- `.planning/PROJECT.md` (PS 26055 figures of merit, constraints, out-of-scope items) — HIGH
- Cloudflare Pages build image docs, https://developers.cloudflare.com/pages/configuration/build-image/ (v3 default Node 22.16.0; `NODE_VERSION`, `.nvmrc`, `.node-version`) — HIGH
- Cloudflare Pages limits, https://developers.cloudflare.com/pages/platform/limits/ (25 MiB per asset, 20,000 files free, 20-min build timeout, 500 builds/month free) — HIGH
- GSAP docs via Context7 (`/websites/gsap_v3`): `ScrollTrigger.refresh()`, `sort()`/`refreshPriority` (create triggers in page order, pins shift later triggers), `config({ ignoreMobileResize })` — HIGH
- iOS Safari autoplay (`muted` + `playsinline`), `100vh` vs `svh`/`dvh`, projector wash-out of dark themes, judge skim behaviour — MEDIUM (established practice, not re-verified this session)

---
*Pitfalls research for: AVOLITE hackathon storytelling website (SIH 2026, PS 26055)*
*Researched: 2026-09-30*
