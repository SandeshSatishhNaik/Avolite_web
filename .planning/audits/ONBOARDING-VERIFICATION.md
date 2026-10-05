# Cutaway onboarding verification

Date: 5 October 2026. Scope: automatic introduction of the accepted React seven-plane diagram.

The diagram plays once after 400 ms with at least 75% of the diagram in view. The signal moves upward, traces each active plane and closes the return path. Six 900 ms stage advances and a 1600 ms final hold give seven seconds of playback. Pause, resume, replay, next, reset and keyboard selection retain control. Manual input cancels a pending introduction; interrupted playback does not automatically restart. Reduced motion skips autoplay and spatial effects while retaining manual selection. All labels and evidence boundaries stay visible without JavaScript.

No animation dependency or engineering result was added. The DSP evidence remains SIMULATED and the integrated smart-scan scheduler remains DESIGNED.

| Check | Result |
|---|---|
| TypeScript / production build | Pass |
| Node data, honesty and build checks | 65 passed |
| Chromium / Firefox browser suite | 58 passed; zero failures or flakes |
| New behavior checks | Finite arrival/replay, phone visibility, pending cancellation/reset, pause, runtime reduced motion, offscreen pause without restart |
| Visual inspection | 1440, 768 and 390 px, active / complete / reduced-motion states |
| Capture console errors / horizontal overflow | None at all three sizes |
| Production JavaScript | 68,438 bytes gzip (66.83 KiB), under 70 KiB |
| Production CSS | 7,511 bytes gzip (7.33 KiB) |

The first browser run caught a real phone issue: playback began while only the upper part of the diagram was visible. Raising the visibility threshold from 25% to 75% resolved both failing cases. The final report is `.impeccable/review/onboarding-browser-final.json`; earlier reports are retained as diagnostic evidence. Final node output: `onboarding-node-final.txt`. Captures: `onboarding-{desktop,tablet,mobile}-{active,complete,reduced}.png`; recordings and capture checks are listed in `onboarding-visual-checks.json`. Captures were opened and checked before review. Tablet/phone captures intentionally scroll to the diagram; they are interaction-state evidence, not whole-page composition comparisons.

The independent reviewer returned **ship** with no material fixes within the onboarding scope. It inspected all nine captures, source timing and final test reports; recordings were not played and a separate QUALITY BAR card was unavailable. This verdict preserves the user-accepted baseline image-match and FORM limits; it is not whole-site approval. Review record: `.impeccable/review/onboarding-final-verdict.json`. DESIGN.md and its v2 sidecar have been refreshed from implementation, preserving the accepted design and prior baseline limits. WebKit remains unavailable on this host because its runtime DLLs are missing. Field performance and Lighthouse remain unmeasured. No deployment or push.

Research references and motion thesis: `.planning/redesign/MOTION-ENHANCEMENT.md`. Native SVG stroke tracing follows [MDN pathLength](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/pathLength); the static alternative follows [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).
