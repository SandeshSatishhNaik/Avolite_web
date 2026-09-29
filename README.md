# Iron Dome of India

A single-page explainer on India's multi-layered air and missile defence shield, **Mission Sudarshan Chakra**, built with React and Vite.

## What's inside

- **Overview**: why India's shield isn't an "Iron Dome" and how it differs.
- **Layer explorer**: clickable concentric rings for BMD, long, medium, short, very-short/counter-drone, and the command & control network.
- **Systems grid**: S-400, Project Kusha, PAD/AAD, AD-1/AD-2, MRSAM, Akash, QRSAM, IADWS, VSHORADS, lasers, D4, guns, IACCS and Akashteer, filterable by layer.
- **Interception simulator**: a canvas simulation where you launch raids and switch layers on or off to see how defence-in-depth works.
- **Timeline** from the first BMD test (2006) to the 2035 target.
- **Comparison table**: Israel's Iron Dome vs India's shield.

## Run it

You need Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the built dist/ locally
```

The build uses relative asset paths, so you can host `dist/` from any sub-path (for example, GitHub Pages).

## Structure

```
index.html                 Vite entry
public/favicon.svg
src/
  main.jsx                 React root
  App.jsx                  page layout
  index.css                styles (dark theme, responsive)
  data.js                  layers, systems, timeline and comparison content
  hooks/useInView.js       scroll-in-view + reduced-motion helpers
  sim/engine.js            framework-free canvas simulator engine
  components/              Header, Hero, Overview, Layers, Systems,
                           Simulator, Timeline, Compare, Footer, ...
```

## Disclaimer

This is an independent educational project based on publicly reported information. Ranges and figures are approximate, and the simulator is a simplified teaching model, not real performance data. It is not affiliated with the Government of India, the Ministry of Defence, DRDO or the Indian Armed Forces.
