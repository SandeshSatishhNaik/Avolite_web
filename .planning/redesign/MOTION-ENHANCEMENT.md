# Motion enhancement — 3 October 2026

Preserve the accepted Exhibition Cutaway, plum/pearl palette, source-backed numbers and eight chapters. User requested a more interactive, animated and premium React site.

- Focal moment: trace the cutaway connection once; selecting or playing stages moves a signal head through the diagram. No inferred RF performance or ambient animation.
- Continuity: native same-origin page transitions keep the header stable; route/role/review results acknowledge user input. Native disclosures reveal their contents smoothly.
- Exploration: figure links become an accessible native inspection dialog with zoom, pan, previous/next, reset and source context. Original links and all reading content work without JavaScript.
- Feedback: restrained arrow movement, press response, diagram selection and source-artifact emphasis. No generic chapter entrances or parallax.
- Budget: native CSS and browser APIs; no animation dependencies. Keep homepage scripts below 70 KB gzip, static content visible, and stop activity when hidden/offscreen. Reduced motion removes spatial movement and timed playback, retaining manual controls and clear state.

Browser API references: [View transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition) and [Web Animations](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate). Unsupported page-transition browsers use ordinary navigation.

## Cutaway onboarding — 5 October 2026

User requested an animated introduction for the selected seven-plane diagram. Preserve its geometry, labels and evidence boundaries.

- Focal moment: once the diagram enters view, pause briefly, then carry a signal from Observe to Scan again. Trace each active plane and close the dashed return path with a single traveling marker. Six readable 900 ms advances, then a 1600 ms final hold lets the signal arrive before the 800 ms return traversal. No repeating introduction.
- Continuity: keep every plane and label visible throughout; the active outline and moving head show the relationship between successive stages.
- Feedback: pause, resume, replay, next, reset and keyboard stage selection take control immediately. Manual input cancels a pending introduction. Offscreen/hidden playback stops without automatic resumption.
- Budget: native CSS transforms and SVG stroke properties, React state, no dependency. Reduced motion skips automatic playback and spatial effects while retaining stage selection. Automatic status updates do not repeatedly interrupt screen readers.

Research: MDN documents [normalized SVG path length](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/pathLength) for stroke tracing and [reduced-motion media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) for the static alternative.
