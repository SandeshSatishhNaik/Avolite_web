<!-- impeccable:product-schema 1 -->
# AVOLITE

## Platform
web

## Product and audience
AVOLITE is an engineering storytelling website for Team Avoflare's Smart India Hackathon project. SIH judges are the primary audience. A first visit must explain the smart-scan problem, distinguish the proposed system from the implemented foundation, and make supporting evidence easy to inspect.

## Core mechanism
The proposed system closes an observe, process, detect, estimate, predict, decide, and scan-again loop. The available MATLAB SARRS outputs demonstrate a radar DSP/detection testbed; they do not validate the proposed ES scheduler or AoA system.

## Truth and evidence
- Reuse the existing hash-pinned ingestion, strict data schemas, issued metric values, figure registry, and status vocabulary.
- Statuses are BUILT, SIMULATED, PROTOTYPE, DESIGNED, PLANNED, and ILLUSTRATIVE. Evidence supports upgrades; appearance never implies one.
- Show results only from the relevant exported run. Do not blend scenarios, infer general performance from five targets, invent confidence/SNR definitions, or imply streaming data.
- Original plots remain unmodified on legible plates. Supplied browser-dashboard captures and recording carry PROTOTYPE labels. Separate MATLAB walkthrough/captures and scheduler/AoA evidence remain explicitly pending.
- The supplied AVOLITE logo remains the brand mark.

## Confirmed redesign brief — 1 October 2026
- Keep SIH judges as the primary audience.
- Prioritize redesign quality; replace the former 2 October launch deadline with acceptance-based milestones.
- Deliver visual mockups and a full redesign plan before implementation.
- Reconsider the entire visual identity, page structure, navigation, components, transitions, and motion language.
- Revision requested: include light colors and a more premium, refined visual treatment. Light supporting surfaces and mixed light/dark chapters are allowed.
- Final visual selection: the user explicitly selected the original **Exhibition Cutaway** by attaching its exact image. Preserve its dark plum hero, condensed display hierarchy, khaki action and layered diagram. Carry the earlier light-color request into supporting sections; do not substitute a light alternative for the selected hero.
- On 2 October 2026 the user delegated layout, spacing, placement, motion, transitions and UI component decisions. Preserve Avoflare's introduction and all eight main sections on the same AVOLITE homepage. The detailed decisions are recorded in .planning/redesign/EXPERIENCE-SPEC.md and implemented in React.
- The user explicitly replaced Astro with an entirely React site. React 19, Vite and TypeScript now provide prerendered static pages and selectively hydrated interaction widgets.

## Light theme and motion extension — 5 October 2026

The user requested a light or alternate theme and more motion throughout the page, including scroll animation. Pearl is the new default; a persistent switch retains the selected plum presentation. This supersedes the earlier dark-only hero and no-theme-switch constraints while preserving the cutaway composition, lettering and evidence. Scroll movement now includes chapter entrances, schematic scan position, the system spine, figure-frame accents and the roadmap reading rail. Reduced motion and readable static content remain required. See `.planning/redesign/LIGHT-MOTION-SPEC.md`.

## Delivery constraints
Continue useful GSD foundations and the existing validated data layer within React. Cloudflare Pages remains the hosting target. No public push or deployment without an explicit request. Preserve accessible reading without JavaScript, keyboard operation, reduced motion, responsive layouts, and clear data provenance. Avoid speculative backend features.

On 5 October 2026 the user explicitly authorized replacing the dummy code and pushing this full React site to `SandeshSatishhNaik/Avolite_web`. Its verified default/Pages production branch is `claude/dazzling-rubin-69x39p`; the connected Pages project is `avolite`. The user also supplied the public R2 origin for the `avolite` bucket. Production image exports now use a verified content-addressed R2 release; local development retains local media. This authorization covers the current replacement/publication, not future unsolicited pushes.

## Supplied demonstration assets — 5 October 2026

The user supplied a public Drive recording and browser dashboard, authorized arbitrary demo login, and delegated the selection. Demo now includes the 5:16 recording, sampled scene bookmarks, Smart Scan, Surveillance and Unknown Signals captures, and the source-dashboard link. These show a browser prototype with simulated interface values; they do not validate MATLAB results, the learned scheduler, AoA accuracy or hardware. The player loads only on request, with a native Drive fallback. See `.planning/redesign/DEMO-ASSETS.md`.

## Open inputs
Team ID, approved official problem wording, separate MATLAB walkthrough/captures, scheduler/AoA outputs, SNR definition, current engineering roadmap stage, and Cloudflare project URL remain unconfirmed. They do not block design planning.
