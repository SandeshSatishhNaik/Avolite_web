# AVOLITE codebase and GSD continuation audit

Date: 2026-10-01. Scope: the current local checkout, its implemented source, tests, planning records, and installed GSD entry points. This was an audit, not a Phase 3 execution. No application source, project configuration, prior planning state, or Git commits were changed. Two audit reports were added.

## Verdict

The existing project is worth continuing. It has a working Astro foundation, a carefully constrained data pipeline, reusable presentation primitives, and substantial automated verification. It is not a finished website: the home page is still a hero stub and eight empty section bodies.

Continue the existing `.planning/` project rather than creating a new GSD project. First repair the stale Phase 3 plan, reconcile the project instructions, and resolve GSD runtime/state inconsistencies. Blindly executing the current `03-01-PLAN.md` would fail its own unchanged-data-layer requirement.

## What exists now

| Area | Implemented contents |
|---|---|
| Runtime | Node 24 locally; `.node-version` is 24; package engine requires Node >=22.18.0 |
| Framework | Astro 7.3.5 static output, TypeScript 6, plain CSS; Astro is the only production dependency |
| Pages | `/` is the shell; `/preview/` is an unlinked, noindex component/data gallery |
| Layout | `src/layouts/Base.astro`: metadata, canonical, favicon, self-hosted fonts, logo sprite, header, skip link, main, shell script |
| Navigation | Eight shared section definitions; sticky header; scroll-spy; mobile dialog; keyboard and focus handling |
| UI primitives | Logo/LogoSprite, Header/MobileMenu/SkipLink, StatusTag/StatusLegend, SectionHeader, Metric, Figure, Placeholder, ResultTable, TableDisclosure |
| Data code | `src/lib/data.ts`: strict schemas, immutable parsed data, provenance-tagged values, origin registry, derived statistics, formatting, chartability checks |
| Intake | `scripts/ingest.mjs`: one pinned CSV, normalized line endings, SHA-256 check, deterministic JSON, re-ingest equality check |
| Build checks | `scripts/honesty.mjs`: prohibited wording, claim/status checks, untagged `<data>` detection, unused PNG pruning |
| Assets | Ten MATLAB PNG exports, figure registry, AVIF/WebP output for rendered figures, generated logo data, favicon |
| Design system | `tokens.css`, `global.css`, `logo.css`; blue-black surfaces, cyan signal, khaki brand accent, six status colors/glyphs; Archivo, IBM Plex Sans/Mono |
| Hosting preparation | Static `dist/`, Cloudflare `_headers`, immutable asset caching, noindex preview, environment-driven site URL |
| Project history | Five completed GSD plans, two phase verification reports, prior reviews and subsequent fixes, Phase 3 research and one draft plan |

No backend, database, authentication flow, live telemetry, MDX docs, GSAP motion layer, MATLAB model, or Python AI implementation is installed in this website. Those absent features are not all defects: several belong to the old abandoned plan, another repository, or later phases.

The current planned sections are: The problem, How it works, What we built, What's new, Demo, Security, Roadmap, and Why AVOLITE. Hero and footer surround those sections. The current PROJECT.md explicitly excludes a multi-page docs site and live dashboard.

## Data and engineering boundaries

The real website dataset is a five-target CFAR simulation export from `abhishekpj0902-apj/AVOLITE`, pinned at commit `9b985ca7f8ef99000724f8ce870918a40d0d95c8`. It is a radar DSP testbed result, not evidence that the proposed electronic-support smart-scan scheduler works.

The current flow is:

1. `data/raw/.../CFAR_Performance_Table.csv` is verified against its pin.
2. `scripts/ingest.mjs` produces `src/data/results.json`.
3. `src/lib/data.ts` validates the result separately from hand-authored `data/claims.json`.
4. `metric()`, `cell()`, and `illustrative()` issue frozen tagged values.
5. Metric and ResultTable require those issued values before rendering.
6. Astro runs source verification, schema loading, and output checks during build.

Observed derived values: five table targets, max absolute range error 0.5 m, mean absolute range error 0.4 m, max absolute velocity error about 0.165381 m/s, and mean absolute velocity error about 0.099594 m/s. These describe only the imported simulated scenario; they establish no general detection rate or hardware performance.

The six current labels are BUILT, SIMULATED, PROTOTYPE, DESIGNED, PLANNED, and ILLUSTRATIVE. The only illustrative scalar currently in claims is a -92 dBm example. SNR definition remains null. AoA and ML scheduler claims remain evidence-dependent. The website does not execute the engineering model.

## Findings, ordered for continuation

### P1: Phase 3 plan contradicts the current strict data schema

`03-01-PLAN.md:99` and `:141` say the data schema strips unknown keys and must remain unchanged. Task 1 then adds `sections`, `requirements`, and many other keys to the same `data/claims.json`.

Current `src/lib/data.ts:57` defines a strict Claims schema; `:91` parses the complete claims object through it. A read-only probe using the actual `validate()` with added `sections` and `requirements` returns `unrecognized_keys`. This strictness was deliberately added by the earlier security/honesty review fix.

Before execution, revise the plan around the current contract. A separate narrative-content JSON file is one small option; an explicit composed schema is another. Preserve the protection preventing hand-authored claims from overriding machine-ingested datasets. Do not solve this by removing strictness indiscriminately.

### P1: Repository instructions describe a different project

`AGENTS.md` and `CLAUDE.md` still prescribe nine sections, `/docs`, a conceptual AoA dataset, three provenance tiers, different tokens, and missing files such as `DESIGN_PLAN.md`, the old creation spec, and `src/lib/results.ts`.

The actual code and `.planning/PROJECT.md` use eight sections, a SIMULATED CFAR dataset, six status labels, `src/lib/data.ts`, and `.planning/research/DESIGN.md`. PROJECT.md records that the earlier design was dropped. The conflict must be reconciled before a new implementation run so an agent is not directed back to obsolete architecture. This audit did not rewrite those instructions.

### P2: Four implementation warnings remain

The separate [code review](2026-10-01-code-review.md) contains exact reproductions and file locations:

- `scripts/honesty.mjs:77` checks that a `<data>` has a status attribute but accepts invalid or empty status values. Plain-text measurement coverage is also absent, but that limitation was explicitly documented and deferred to Phase 3, whose draft includes `numbers.test.mjs`.
- Wording checks accept numeric HTML references spelling prohibited text and lowercase AI/ML abbreviations beside BUILT/SIMULATED claims.
- Header/mobile links on `/preview/` point to fragments absent from that page instead of navigating to the home page.
- With JavaScript disabled at phone width, selecting a mobile-menu section changes the fragment but leaves the full-screen modal open. Close/Escape still work, but the selected content remains covered until the user closes the menu.

No fabricated current CFAR result or exploitable security vulnerability was established. These findings are narrower than a claim that the entire data pipeline is broken.

### P2: GSD commands are not fully portable yet

Codex has GSD skills and agent definitions, but their references point to `C:/Users/Sandesh_Naik/.Codex/get-shit-done/`, which is absent. `gsd-sdk` was not found on PATH. Claude's `C:/Users/Sandesh_Naik/.claude/get-shit-done/` exists at version 1.42.3.

I successfully used that existing runtime with Node to run `init progress`, `roadmap analyze`, and `state-snapshot`. Thus the project is recoverable and inspectable without starting over. Codex also successfully ran the GSD code-reviewer agent for this audit.

Correction to the earlier import summary: installed skill/agent files do not prove the full GSD workflow runtime was imported. For routine continuation, install or map one verified GSD runtime consistently and smoke-test its read-only commands. Do not blindly copy Claude-only hooks: several depend on Claude tool payloads, transcript conventions, or status-line metrics.

### P2: State and progress records need reconciliation

- STATE frontmatter says 33% and two of six phases complete, while its body says 100%.
- STATE says the current plan has not started; one unexecuted Phase 3 plan actually exists.
- The continuity footer says `Completed 01-02-PLAN.md`, despite Phase 2 completion.
- GSD `roadmap analyze` reports five summaries out of six currently written plans, or 83%. That is not 83% completion of the whole website: most later-phase plans do not exist yet.
- GSD `state-snapshot` returns null current-phase/current-plan fields and empty decisions/blockers despite the prose containing them. Do not rely on this snapshot to automate state changes until its format/runtime mismatch is addressed.
- Phase 1 validation remains draft; both completed phase validation files still say `wave_0_complete: false`. Phase 2 is otherwise marked approved. These are documentation inconsistencies, not failed tests.

### P2: A clean clone will miss important local context

The master Markdown documentation, AI architecture DOCX, AGENTS.md, CLAUDE.md, local hook configuration, and Phase 3 draft plan are untracked. The earlier concern that `logo.svg` is untracked is now stale: Git does track it.

Decide which project documents/configuration belong in version control before relying on a fresh checkout or another machine. Review local config for credentials before tracking it. No staging, commits, or pushes were performed here.

## GSD progress and safe continuation

| Phase | Evidence-backed state |
|---|---|
| 1. Shell and stack | Three plans with summaries; verification exists; current checks pass |
| 2. Data and honesty | Two plans with summaries; verification and follow-up fixes exist; current warnings above remain |
| 3. All sections static | Research exists; only `03-01-PLAN.md` exists; no summary, no implemented sections; draft needs schema repair |
| 4. Interactives and motion | Not started |
| 5. Asset swap-in | Not started |
| 6. QA and launch | Not started; some foundational tests already exist |

There are 22 checked and 52 unchecked v1 requirement entries. These counts describe checklist state, not implementation effort. Phase 3 research recommends five plans; only the first was written. An execute-phase run over that single plan must not be mistaken for completion of all Phase 3 success criteria.

Recommended order:

1. Reconcile instructions and GSD state; make the workflow runtime addressable from Codex.
2. Repair and validate the Phase 3 content/schema plan against the current code; finish the missing section/integration plans and their requirement coverage.
3. Fix the four bounded implementation warnings with focused regression checks.
4. Continue the same GSD project through the complete static site and its verification.
5. Add motion/interactives only after the static content works; then perform final browser, performance, metadata, and hosting checks.

Do not run `gsd-new-project`: the existing decisions, research, test contracts, completed summaries, and Git history are useful. The recorded deadline is 2026-10-02; motion is already designated the first scope cut. Deployment remains conditional on a user request.

## Verification performed now

| Check | Current result |
|---|---|
| Fresh production build | Pass; two pages generated |
| Astro check | 39 files, zero errors/warnings/hints |
| Node unit/build tests | 99 passed |
| Chromium Playwright suite | 32 passed, including axe, keyboard, navigation, responsive and reduced-motion checks |
| New targeted probes | Reproduced the four code warnings and the Phase 3 strict-schema conflict |
| GSD read-only CLI | Init and roadmap analysis work through Claude's runtime; snapshot parsing loses fields |

The browser suite required a permitted run outside the sandbox because process spawning initially returned EPERM. Astro telemetry was disabled for checks. No failed site assertion was concealed by that environment retry.

Current output is small: 12,244 bytes of CSS across two files (3,537 bytes gzip summed), 109,256 bytes of fonts across three files, and 911 bytes of inline JavaScript per page (488 bytes gzip). There are no separate emitted JS files. These are size measurements of the incomplete site, not Lighthouse or real-user performance scores.

## What remains unverified or externally blocked

- Firefox/WebKit: not configured or run; current Playwright config is Chromium-only.
- Final LCP/CLS/INP, Lighthouse, production canonical URL, social preview, deployed Cloudflare behavior: not measured in this audit.
- Full visual-design sign-off: not performed. This was source, workflow, and functional testing; finished Phase 3 content does not yet exist.
- Pinned tooling: `modern-web-guidance` was found in Claude's synced plugin folder but not in the active Codex skill list; no `dataviz` SKILL.md was found in the searched skill/plugin roots. Resolve those references before a full pinned design workflow.
- `graphify-out/graph.json` is absent. It is correctly ignored but provides no architecture index yet.
- External engineering claims and research citations were not independently re-verified online. This audit checked local evidence flow and recorded scope, not the underlying MATLAB/AI research implementation.
- Team dependencies recorded by GSD: team ID, demo video, dashboard screenshots, AoA/ML scheduler evidence, SNR definition, official problem-statement text, roadmap-marker confirmation, Cloudflare project name.
- This used installed dependencies and cached fonts, not a fresh network installation. Older phase reports record clean-clone checks; those are historical evidence rather than checks rerun today.

## Key files for the next session

- `.planning/PROJECT.md`, `ROADMAP.md`, `REQUIREMENTS.md`, `STATE.md`, `config.json`
- `.planning/research/DESIGN.md` and `ARCHITECTURE.md`
- `.planning/phases/03-all-sections-static-ship-point/03-RESEARCH.md` and `03-01-PLAN.md`
- `src/lib/data.ts`, `status.ts`, `site.ts`, `figures.ts`
- `scripts/ingest.mjs`, `honesty.mjs`, `clean-logo.mjs`
- `src/pages/index.astro`, `preview.astro`, `src/layouts/Base.astro`
- `tests/`, `playwright.config.ts`, `astro.config.mjs`, `public/_headers`
- This report and `2026-10-01-code-review.md`
