# Iron Dome of India

A static, single-page explainer on India's multi-layered air and missile defence shield, **Mission Sudarshan Chakra**, built with plain HTML, CSS and JavaScript.

## What's inside

- **Overview**: why India's shield isn't an "Iron Dome" and how it differs.
- **Layer explorer**: clickable concentric rings for BMD, long, medium, short, very-short/counter-drone, and the command & control network.
- **Systems grid**: S-400, Project Kusha, PAD/AAD, AD-1/AD-2, MRSAM, Akash, QRSAM, IADWS, VSHORADS, lasers, D4, guns, IACCS and Akashteer, filterable by layer.
- **Interception simulator**: a canvas simulation where you launch raids and switch layers on or off to see how defence-in-depth works.
- **Timeline** from the first BMD test (2006) to the 2035 target.
- **Comparison table**: Israel's Iron Dome vs India's shield.

## Run it

There's no build step and no dependencies. You can either:

- open `index.html` in a browser, or
- serve the folder, e.g. `python3 -m http.server 8000`, then visit http://localhost:8000.

It also works as-is on GitHub Pages (Settings → Pages → deploy from branch, root folder).

## Structure

```
index.html        page markup
css/style.css     styles (dark theme, responsive)
js/main.js        nav, layer explorer, systems filter, simulator
assets/favicon.svg
```

## Disclaimer

This is an independent educational project based on publicly reported information. Ranges and figures are approximate, and the simulator is a simplified teaching model, not real performance data. It is not affiliated with the Government of India, the Ministry of Defence, DRDO or the Indian Armed Forces.
