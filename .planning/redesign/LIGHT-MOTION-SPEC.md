# Pearl theme and scroll motion — 5 October 2026

The user requests a light or alternate theme and more animation throughout the page, explicitly including scrolling. This authorizes a light variant, a theme switch, and chapter entrance/scroll effects beyond the earlier motion-only-on-signal constraint. Preserve React, content, evidence boundaries, original plots and the chosen cutaway composition.

## Direction

Make Pearl the default. Use the existing pearl palette at page scale: canvas #F4F2F7, white plates #FFFFFF, raised lilac #E9E5EE, ink #171322, signal blue #344C83 and a darker khaki action #715828. Anton and IBM Plex stay. Plum remains selectable, retaining its original light supporting chapters. Remap semantic roles rather than invert figures. The primary action needs an explicit foreground token so both themes pass contrast.

The header offers a compact theme switch; on phones it sits inside the existing Menu. Persist preference locally and apply it before paint. Without JavaScript the default light page and native menus remain readable. Theme changes may use the native view transition where available, with an immediate reduced-motion fallback.

## Motion thesis

- Focal moment: the seven-plane cutaway retains its authored onboarding. Scroll then carries the reader through the same system story.
- Continuity: each chapter heading has a short masked entrance and a reading rule; normal scrolling drives schematic scan position, the system spine, figure-frame emphasis and roadmap reading rail. Native scrolling and anchor history remain intact.
- Feedback: existing stage/router/demo/review/figure controls remain; source links, navigation and disclosures acknowledge interaction. The closing action gets one restrained entrance.
- Budget: native IntersectionObserver, Web Animations and the existing requestAnimationFrame scroll scheduler. No new dependency. Animate transforms, opacity, clipping and SVG strokes; keep original chart pixels and issued numbers intact. Only visible scenes update. Keep JavaScript below 70 KiB gzip and CSS below 25 KiB.

## Coverage

| Area | Authored behavior |
|---|---|
| Hero / evidence shelf | Existing seven-stage introduction; headline and shelf entrance |
| Problem | Scroll-linked schematic scan marker; bounded sequence reveal |
| How it works | Scroll traces the system spine; manual stage choice remains authoritative |
| What we built | Figure-frame reading accent and caption entrance; chart pixels remain unchanged |
| What's new | Two decision panels enter from opposite sides; existing routing feedback |
| Demo | Recording chapter entrance plus existing manual scan playback |
| Security | Safeguard entry and existing review/failure-selection feedback |
| Roadmap | Reading rail and milestone entrances, without implying milestone completion |
| Why / final CTA | Comparison reading emphasis, role-selection feedback, closing action entrance |
| Appendices | Heading/figure entrances and frame accents, existing inspection and disclosures |

Reduced motion skips timed entrances and all scroll-linked movement. Finite effects cancel on hidden documents or preference changes. Every element starts in its readable final state; animation is enhancement, never a prerequisite for content access.

## Verification

Check both themes at 1440/768/390, keyboard and theme persistence across routes, storage-denied fallback, reduced motion, JS-off content, source figure colors, no overflow/console errors, data honesty, budgets, and browser journeys. Review screenshots and actual scroll state, then independent scoped finish review and design documentation.

Platform references: [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [Web Animations](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate), [scroll animation timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline). Native CSS scroll timelines remain limited across browsers; the existing scroll scheduler supplies consistent behavior in the tested engines.

The pinned modern-web-guidance and dataviz skill files were unavailable in searched local skill roots. Current platform documentation provides the API guidance; no chart algorithm is being changed.
