/* ==========================================================
   Iron Dome of India — interactions
   ========================================================== */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------------------------------------------------------
     Data
     --------------------------------------------------------- */
  const LAYERS = [
    {
      id: 'bmd', tab: 'BMD', label: 'BMD', name: 'Ballistic Missile Defence', color: '#f97316',
      range: 'Exo- & endo-atmospheric',
      threats: ['Ballistic missiles'],
      systems: ['PAD / AAD (Phase I)', 'AD-1 / AD-2 (Phase II)', 'Swordfish long-range tracking radar'],
      desc: 'The outermost and highest tier. Phase I interceptors were built against ballistic missiles of roughly 2,000 km range, hitting them either above the atmosphere (PAD) or inside it (AAD). Phase II is aimed at longer-range, ~5,000 km-class missiles.'
    },
    {
      id: 'long', tab: 'Long range', label: 'LONG', name: 'Long-range air defence', color: '#ff9933',
      range: '~100–400 km',
      threats: ['Fighter aircraft', 'AWACS & tankers', 'Cruise missiles', 'Some ballistic missiles'],
      systems: ['S-400 Triumf ("Sudarshan Chakra")', 'Project Kusha (in development)'],
      desc: 'Pushes the engagement zone deep into hostile airspace, so enemy fighters and support aircraft have to stay far back. The Air Force credited the S-400 with long-range kills during Operation Sindoor in May 2025.'
    },
    {
      id: 'medium', tab: 'Medium', label: 'MEDIUM', name: 'Medium-range air defence', color: '#facc15',
      range: '~30–100 km',
      threats: ['Fighters', 'Helicopters', 'Cruise missiles', 'Large drones'],
      systems: ['MRSAM / Barak-8', 'Akash-NG (in trials)'],
      desc: 'Area defence for air bases, cities and naval fleets. MRSAM was co-developed by DRDO and Israel Aerospace Industries and is used by all three services.'
    },
    {
      id: 'short', tab: 'Short', label: 'SHORT', name: 'Short-range air defence', color: '#38bdf8',
      range: '~8–30 km',
      threats: ['Aircraft', 'Helicopters', 'Cruise missiles', 'Drones'],
      systems: ['Akash / Akash Prime', 'QRSAM', 'SPYDER'],
      desc: 'Mobile batteries that move with army formations and guard vital points. The indigenous Akash saw heavy use against incoming drones and missiles in May 2025.'
    },
    {
      id: 'vshort', tab: 'Very short', label: 'V-SHORT', name: 'Very short range & counter-drone', color: '#22c55e',
      range: '0–8 km',
      threats: ['Drones & swarms', 'Loitering munitions', 'Low-flying helicopters'],
      systems: ['VSHORADS', 'L70 / ZU-23 / Shilka guns', 'Igla-S', 'D4 anti-drone system', 'High-power laser (DEW)'],
      desc: 'The last line of defence. Cheap, fast-firing guns, shoulder-fired missiles, jammers and lasers can kill cheap drones without spending expensive missiles on them.'
    },
    {
      id: 'c2', tab: 'Command &amp; control', label: 'C2', name: 'Command & control: the brain', color: '#818cf8',
      range: 'Nationwide network',
      threats: ['Coordinates every tier'],
      systems: ['IACCS (Air Force)', 'Akashteer (Army)', 'Arudhra & Rohini radars'],
      desc: 'Sensors and shooters are only as good as the network linking them. IACCS and Akashteer fuse radar tracks into one air picture and hand each threat to the best-suited weapon.'
    }
  ];
  const LAYER_BY_ID = Object.fromEntries(LAYERS.map(l => [l.id, l]));

  const SYSTEMS = [
    { name: 'S-400 Triumf', layers: ['long', 'bmd'], origin: 'Russia · Indian Air Force', range: 'Up to ~400 km', status: ['op', 'Operational'],
      desc: 'India\'s most capable long-range SAM, deployed as "Sudarshan Chakra". Five squadrons were ordered in 2018 and deliveries began in December 2021. Several interceptor types let one battery engage aircraft, cruise and ballistic missiles.' },
    { name: 'Project Kusha', layers: ['long'], origin: 'India · DRDO', range: '~150–350 km (planned)', status: ['dev', 'In development'],
      desc: 'An indigenous long-range SAM with three interceptor sizes planned. It would give India a home-built S-400-class layer that it can mass-produce and upgrade itself.' },
    { name: 'PAD / AAD (BMD Phase I)', layers: ['bmd'], origin: 'India · DRDO', range: 'Exo- & endo-atmospheric', status: ['test', 'Flight-tested'],
      desc: 'A two-tier shield against ~2,000 km-class ballistic missiles. Prithvi Air Defence intercepts above the atmosphere and Advanced Air Defence intercepts lower down, both cued by the Swordfish radar.' },
    { name: 'AD-1 / AD-2 (BMD Phase II)', layers: ['bmd'], origin: 'India · DRDO', range: '~5,000 km-class threats', status: ['test', 'In trials'],
      desc: 'Next-generation interceptors for intermediate-range ballistic missiles. AD-1 made its maiden flight test in November 2022.' },
    { name: 'MRSAM (Barak-8)', layers: ['medium'], origin: 'India–Israel · DRDO & IAI', range: '~70 km', status: ['op', 'Operational'],
      desc: 'An all-weather medium-range SAM used by the Army, Navy and Air Force. Its active radar seeker allows several simultaneous engagements against fighters, helicopters, cruise missiles and drones.' },
    { name: 'Akash-NG', layers: ['medium'], origin: 'India · DRDO', range: '~70 km', status: ['test', 'In trials'],
      desc: 'The next-generation Akash, with a lighter canister launcher, an active RF seeker and roughly double the reach of the original.' },
    { name: 'Akash / Akash Prime', layers: ['short'], origin: 'India · DRDO & BEL', range: '~25–30 km', status: ['op', 'Operational'],
      desc: 'An indigenous mobile SAM in Army and Air Force service. It was widely credited with intercepts during Operation Sindoor in May 2025.' },
    { name: 'QRSAM', layers: ['short'], origin: 'India · DRDO', range: '~25–30 km', status: ['test', 'In trials'],
      desc: 'Quick Reaction SAM, built to travel with armoured columns, search and track on the move, and fire within seconds. One of the three weapons in IADWS.' },
    { name: 'IADWS', layers: ['short', 'vshort'], origin: 'India · DRDO', range: 'Layered, up to ~30 km', status: ['test', 'Flight-tested'],
      desc: 'Integrated Air Defence Weapon System: QRSAM, VSHORADS and a high-power laser under one centralised command. First flight-tested in August 2025, it is seen as an early building block of Sudarshan Chakra.' },
    { name: 'VSHORADS', layers: ['vshort'], origin: 'India · DRDO', range: '~6 km', status: ['test', 'In trials'],
      desc: 'A shoulder-fired missile with an imaging infrared seeker, used against low-flying aircraft, helicopters and drones.' },
    { name: 'Laser DEW', layers: ['vshort'], origin: 'India · DRDO', range: 'A few km', status: ['test', 'Demonstrated'],
      desc: 'A 30 kW-class high-energy laser that DRDO demonstrated in 2025 by burning down fixed-wing drones and a swarm. Each shot costs almost nothing compared with a missile.' },
    { name: 'D4 anti-drone system', layers: ['vshort'], origin: 'India · DRDO', range: 'Detect, jam & destroy', status: ['op', 'Deployed'],
      desc: 'Drone Detect, Deter & Destroy: radar, RF sensors and electro-optics combined with jamming and a laser kill option to deal with hostile drones.' },
    { name: 'Air-defence guns', layers: ['vshort'], origin: 'Upgraded legacy systems', range: '~2–4 km', status: ['op', 'Operational'],
      desc: 'Upgraded L70 40 mm guns, ZU-23 twin cannons and Shilka self-propelled guns. Old, but very cheap per shot, which matters against large numbers of small drones.' },
    { name: 'IACCS', layers: ['c2'], origin: 'India · IAF & BEL', range: 'Nationwide network', status: ['op', 'Operational'],
      desc: 'The Integrated Air Command and Control System links military and civil radars with shooters to give one automated air picture and faster decisions.' },
    { name: 'Akashteer', layers: ['c2'], origin: 'India · Army & BEL', range: 'Army-wide network', status: ['op', 'Operational'],
      desc: 'The Indian Army\'s automated air-defence control and reporting system. It fuses sensor data and cues the right gun or missile unit, and was widely praised after Operation Sindoor.' }
  ];

  const FILTERS = [
    ['all', 'All'],
    ['bmd', 'BMD'],
    ['long', 'Long range'],
    ['medium', 'Medium'],
    ['short', 'Short'],
    ['vshort', 'Very short & C-UAS'],
    ['c2', 'Command & control']
  ];

  /* ---------------------------------------------------------
     Header, nav, back-to-top
     --------------------------------------------------------- */
  const header = $('.site-header');
  const nav = $('#site-nav');
  const navToggle = $('.nav-toggle');
  const toTop = $('.to-top');

  const closeNav = () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  $$('a', nav).forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 8);
    toTop.classList.toggle('show', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  // Highlight the nav link for the section in view
  const navLinks = new Map($$('a', nav).map(a => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.remove('active'));
      const link = navLinks.get(entry.target.id);
      if (link) link.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  $('#year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Reveal on scroll + animated counters
     --------------------------------------------------------- */
  const revealer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => revealer.observe(el));

  const animateCount = el => {
    const target = Number(el.dataset.count);
    const from = Number(el.dataset.from || 0);
    if (reduceMotion) { el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (target - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counter = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => counter.observe(el));

  /* ---------------------------------------------------------
     Layer explorer
     --------------------------------------------------------- */
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const RING_RADII = { bmd: 190, long: 158, medium: 126, short: 94, vshort: 62, c2: 30 };
  const ringSvg = $('#layer-rings');
  const layerTabs = $('#layer-tabs');
  const layerDetail = $('#layer-detail');

  // A full circle, drawn as two arcs so it can be combined into a ring path
  const circlePath = r => `M${200 - r},200a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;

  LAYERS.forEach((layer, i) => {
    const r = RING_RADII[layer.id];
    const next = LAYERS[i + 1];
    const inner = next ? RING_RADII[next.id] : 0;

    // Each tier is its own band, so highlighting one never tints the tiers inside it
    const band = document.createElementNS(SVG_NS, 'path');
    band.setAttribute('d', circlePath(r) + (inner ? circlePath(inner) : ''));
    band.setAttribute('fill-rule', 'evenodd');
    band.setAttribute('fill', layer.color);
    band.classList.add('ring');
    band.dataset.id = layer.id;
    const title = document.createElementNS(SVG_NS, 'title');
    title.textContent = layer.name;
    band.appendChild(title);
    band.addEventListener('click', () => selectLayer(layer.id));
    ringSvg.appendChild(band);

    const outline = document.createElementNS(SVG_NS, 'circle');
    outline.setAttribute('cx', 200);
    outline.setAttribute('cy', 200);
    outline.setAttribute('r', r);
    outline.setAttribute('stroke', layer.color);
    outline.classList.add('ring-outline');
    outline.dataset.id = layer.id;
    ringSvg.appendChild(outline);

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'layer-tab';
    tab.dataset.id = layer.id;
    tab.style.setProperty('--c', layer.color);
    tab.setAttribute('aria-pressed', 'false');
    tab.innerHTML = `<span class="dot"></span>${layer.tab}`;
    tab.addEventListener('click', () => selectLayer(layer.id));
    layerTabs.appendChild(tab);

    // Label each ring in the middle of its band (the C2 label sits in the centre)
    const mid = next ? (r + inner) / 2 : 0;
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', 200);
    text.setAttribute('y', 200 - mid + 4);
    text.setAttribute('text-anchor', 'middle');
    text.classList.add('ring-label');
    text.textContent = layer.label;
    text.dataset.label = layer.id;
    ringSvg.appendChild(text);
  });
  // Keep outlines and labels above every band so they are never covered
  $$('.ring-outline, .ring-label', ringSvg).forEach(el => ringSvg.appendChild(el));

  function selectLayer(id) {
    const layer = LAYER_BY_ID[id];
    $$('.ring, .ring-outline', ringSvg).forEach(el => el.classList.toggle('active', el.dataset.id === id));
    $$('.layer-tab', layerTabs).forEach(t => t.setAttribute('aria-pressed', String(t.dataset.id === id)));
    layerDetail.style.setProperty('--c', layer.color);
    layerDetail.innerHTML = `
      <h3>${layer.name}</h3>
      <dl class="meta">
        <dt>Coverage</dt><dd>${layer.range}</dd>
        <dt>Defeats</dt><dd>${layer.threats.join(', ')}</dd>
      </dl>
      <p class="desc">${layer.desc}</p>
      <div class="chips">${layer.systems.map(s => `<span class="chip">${s}</span>`).join('')}</div>
    `;
  }
  selectLayer('long');

  /* ---------------------------------------------------------
     Systems grid + filters
     --------------------------------------------------------- */
  const filterBar = $('#system-filters');
  const systemsGrid = $('#systems-grid');

  FILTERS.forEach(([id, label]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter';
    btn.dataset.filter = id;
    btn.textContent = label;
    btn.setAttribute('aria-pressed', String(id === 'all'));
    btn.addEventListener('click', () => renderSystems(id));
    filterBar.appendChild(btn);
  });

  function renderSystems(filter) {
    $$('.filter', filterBar).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    const list = filter === 'all' ? SYSTEMS : SYSTEMS.filter(s => s.layers.includes(filter));
    systemsGrid.innerHTML = list.map(s => {
      const color = LAYER_BY_ID[s.layers[0]].color;
      return `
        <article class="sys-card" style="--c:${color}">
          <span class="status ${s.status[0]}">${s.status[1]}</span>
          <h3>${s.name}</h3>
          <p class="sys-origin">${s.origin}</p>
          <p class="sys-range">${s.range}</p>
          <p class="desc">${s.desc}</p>
        </article>`;
    }).join('');
  }
  renderSystems('all');

  /* ---------------------------------------------------------
     Interception simulator
     Positions are stored in "R units" relative to the protected
     asset at (0, 0), with negative y pointing up the screen, so
     the scene survives canvas resizes.
     --------------------------------------------------------- */
  const canvas = $('#sim-canvas');
  const ctx = canvas.getContext('2d');

  const SIM_LAYERS = [
    { id: 'long', name: 'Long range & BMD', sub: 'S-400 · PAD/AAD', r: 0.95, color: '#ff9933', pk: 0.85, cooldown: 1.3, speed: 0.8, shots: 2, targets: ['ballistic', 'aircraft', 'cruise'] },
    { id: 'medium', name: 'Medium range', sub: 'MRSAM · Akash-NG', r: 0.68, color: '#facc15', pk: 0.8, cooldown: 0.9, speed: 0.65, shots: 1, targets: ['aircraft', 'cruise'] },
    { id: 'short', name: 'Short range', sub: 'Akash · QRSAM', r: 0.44, color: '#38bdf8', pk: 0.75, cooldown: 0.7, speed: 0.55, shots: 1, targets: ['aircraft', 'cruise', 'drone'] },
    { id: 'vshort', name: 'Very short / C-UAS', sub: 'Guns · VSHORADS · laser', r: 0.22, color: '#22c55e', pk: 0.7, cooldown: 0.3, beam: 0.35, shots: 2, targets: ['drone', 'cruise'] }
  ].map(l => ({ ...l, on: true, cool: 0 }));

  const THREATS = {
    ballistic: { label: 'Ballistic missile', speed: 0.24, color: '#f87171', trail: 16, spread: [1.3, 1.7] },
    cruise:    { label: 'Cruise missile',    speed: 0.11, color: '#fb923c', trail: 10, spread: [1.08, 1.92] },
    aircraft:  { label: 'Hostile aircraft',  speed: 0.13, color: '#e879f9', trail: 6,  spread: [1.1, 1.9] },
    drone:     { label: 'Drone',             speed: 0.06, color: '#fde047', trail: 4,  spread: [1.05, 1.95] }
  };

  const WAVES = {
    mixed: [['ballistic', 2], ['cruise', 3], ['aircraft', 2], ['drone', 6]],
    missiles: [['ballistic', 4], ['cruise', 5]],
    swarm: [['drone', 18]]
  };
  const WAVE_SPREAD = { mixed: 6, missiles: 4, swarm: 3 };

  const sim = {
    threats: [], interceptors: [], beams: [], blasts: [], queue: [],
    time: 0, sweep: 0,
    stats: { threats: 0, kills: 0, leaks: 0, fired: 0 }
  };

  let W = 0, H = 0, R = 1, cx = 0, cy = 0;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2;
    cy = H - 30;
    R = Math.max(40, Math.min(H - 50, W / 2 - 14));
    draw();
  }

  const px = (x, y) => [cx + x * R, cy + y * R];
  const rand = (a, b) => a + Math.random() * (b - a);
  const dist = (x, y) => Math.hypot(x, y);

  // Layer toggles
  const toggleBox = $('#sim-toggles');
  SIM_LAYERS.forEach(layer => {
    const label = document.createElement('label');
    label.className = 'sim-toggle';
    label.style.setProperty('--c', layer.color);
    label.innerHTML = `
      <input type="checkbox" checked data-layer="${layer.id}">
      <span class="swatch"></span>
      <span>${layer.name}<small>${layer.sub}</small></span>`;
    label.querySelector('input').addEventListener('change', e => {
      layer.on = e.target.checked;
      draw();
    });
    toggleBox.appendChild(label);
  });

  // Controls
  $$('[data-wave]').forEach(btn => btn.addEventListener('click', () => launchWave(btn.dataset.wave)));
  $('#sim-reset').addEventListener('click', resetSim);

  const logEl = $('#sim-log');
  function log(msg, cls) {
    const li = document.createElement('li');
    li.className = cls;
    li.textContent = msg;
    logEl.prepend(li);
    while (logEl.children.length > 5) logEl.lastChild.remove();
  }

  function updateStats() {
    const s = sim.stats;
    $('#st-threats').textContent = s.threats;
    $('#st-kills').textContent = s.kills;
    $('#st-leaks').textContent = s.leaks;
    $('#st-fired').textContent = s.fired;
    const resolved = s.kills + s.leaks;
    $('#st-rate').textContent = resolved ? Math.round((s.kills / resolved) * 100) + '%' : '—';
  }

  function launchWave(kind) {
    const spread = WAVE_SPREAD[kind];
    WAVES[kind].forEach(([type, count]) => {
      for (let i = 0; i < count; i++) {
        sim.queue.push({ at: sim.time + Math.random() * spread, type });
      }
    });
    wake();
  }

  function resetSim() {
    sim.threats.length = 0;
    sim.interceptors.length = 0;
    sim.beams.length = 0;
    sim.blasts.length = 0;
    sim.queue.length = 0;
    Object.keys(sim.stats).forEach(k => { sim.stats[k] = 0; });
    SIM_LAYERS.forEach(l => { l.cool = 0; });
    logEl.innerHTML = '';
    updateStats();
    draw();
  }

  function spawn(type) {
    const def = THREATS[type];
    const angle = Math.PI * rand(def.spread[0], def.spread[1]);
    const d = 1.15;
    sim.threats.push({
      type, def,
      x: Math.cos(angle) * d,
      y: Math.sin(angle) * d,
      wobble: Math.random() * Math.PI * 2,
      trail: [],
      alive: true,
      targeted: false,
      shotsBy: {}
    });
    sim.stats.threats++;
  }

  function blast(x, y, color, size = 1) {
    sim.blasts.push({ x, y, color, t: 0, size });
  }

  function resolveShot(layer, threat) {
    if (!threat.alive) return;
    threat.targeted = false;
    if (Math.random() < layer.pk) {
      threat.alive = false;
      sim.stats.kills++;
      blast(threat.x, threat.y, layer.color, 1);
      log(`${layer.name} ✓ ${threat.def.label} destroyed`, 'hit');
    } else {
      blast(threat.x, threat.y, '#94a3b8', 0.4);
      log(`${layer.name} ✗ missed ${threat.def.label.toLowerCase()}`, 'miss');
    }
  }

  function engage(layer) {
    let best = null;
    let bestD = Infinity;
    for (const t of sim.threats) {
      if (!t.alive || t.targeted) continue;
      if (!layer.targets.includes(t.type)) continue;
      if ((t.shotsBy[layer.id] || 0) >= layer.shots) continue;
      const d = dist(t.x, t.y);
      if (d <= layer.r && d < bestD) { best = t; bestD = d; }
    }
    if (!best) return;

    best.targeted = true;
    best.shotsBy[layer.id] = (best.shotsBy[layer.id] || 0) + 1;
    layer.cool = layer.cooldown;
    sim.stats.fired++;

    if (layer.beam) {
      sim.beams.push({ layer, target: best, t: layer.beam });
    } else {
      sim.interceptors.push({ layer, target: best, x: 0, y: -0.02, trail: [] });
    }
  }

  function step(dt) {
    sim.time += dt;
    sim.sweep = (sim.sweep + dt * 1.4) % (Math.PI * 2);

    // Release queued threats
    for (let i = sim.queue.length - 1; i >= 0; i--) {
      if (sim.queue[i].at <= sim.time) {
        spawn(sim.queue[i].type);
        sim.queue.splice(i, 1);
      }
    }

    // Move threats toward the protected asset
    for (const t of sim.threats) {
      if (!t.alive) continue;
      const d = dist(t.x, t.y);
      let vx = (-t.x / d) * t.def.speed;
      let vy = (-t.y / d) * t.def.speed;
      if (t.type === 'drone') {
        t.wobble += dt * 3;
        const w = Math.sin(t.wobble) * 0.03;
        vx += (-t.y / d) * w;
        vy += (t.x / d) * w;
      }
      t.x += vx * dt;
      t.y += vy * dt;
      t.trail.push([t.x, t.y]);
      if (t.trail.length > t.def.trail) t.trail.shift();

      if (dist(t.x, t.y) < 0.035) {
        t.alive = false;
        sim.stats.leaks++;
        blast(0, 0, '#f87171', 1.6);
        log(`⚠ ${t.def.label} reached the target`, 'leak');
      }
    }

    // Layers fire when ready
    for (const layer of SIM_LAYERS) {
      layer.cool = Math.max(0, layer.cool - dt);
      if (layer.on && layer.cool === 0) engage(layer);
    }

    // Interceptors home on their targets
    for (let i = sim.interceptors.length - 1; i >= 0; i--) {
      const m = sim.interceptors[i];
      const t = m.target;
      if (!t.alive) { sim.interceptors.splice(i, 1); continue; }
      const dx = t.x - m.x;
      const dy = t.y - m.y;
      const d = Math.hypot(dx, dy);
      const move = m.layer.speed * dt;
      m.trail.push([m.x, m.y]);
      if (m.trail.length > 8) m.trail.shift();
      if (d <= move + 0.02) {
        resolveShot(m.layer, t);
        sim.interceptors.splice(i, 1);
      } else {
        m.x += (dx / d) * move;
        m.y += (dy / d) * move;
      }
    }

    // Laser / gun beams
    for (let i = sim.beams.length - 1; i >= 0; i--) {
      const b = sim.beams[i];
      b.t -= dt;
      if (!b.target.alive) { sim.beams.splice(i, 1); continue; }
      if (b.t <= 0) {
        resolveShot(b.layer, b.target);
        sim.beams.splice(i, 1);
      }
    }

    // Explosions
    for (let i = sim.blasts.length - 1; i >= 0; i--) {
      sim.blasts[i].t += dt;
      if (sim.blasts[i].t > 0.7) sim.blasts.splice(i, 1);
    }

    sim.threats = sim.threats.filter(t => t.alive);
    updateStats();
  }

  /* ----- Drawing ----- */
  function drawAsset() {
    ctx.fillStyle = 'rgba(148, 163, 184, .25)';
    ctx.fillRect(0, cy + 2, W, 1);

    ctx.fillStyle = '#cbd5e1';
    const blocks = [[-18, 10], [-12, 16], [-6, 22], [0, 14], [6, 19], [12, 11]];
    blocks.forEach(([dx, h]) => ctx.fillRect(cx + dx, cy + 2 - h, 5, h));

    ctx.font = '600 10px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('PROTECTED ASSET', cx, cy + 18);
  }

  function drawLayers() {
    for (const l of SIM_LAYERS) {
      const rr = l.r * R;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, Math.PI, Math.PI * 2);
      ctx.setLineDash(l.on ? [] : [4, 6]);
      ctx.strokeStyle = l.on ? l.color : 'rgba(148, 163, 184, .35)';
      ctx.globalAlpha = l.on ? 0.7 : 1;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.globalAlpha = 1;
      if (l.on) {
        ctx.fillStyle = l.color + '0d';
        ctx.lineTo(cx, cy);
        ctx.fill();
      }
      ctx.setLineDash([]);

      ctx.font = '600 10px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = l.on ? l.color : 'rgba(148, 163, 184, .6)';
      ctx.fillText(l.name.toUpperCase() + (l.on ? '' : ' (OFF)'), cx + 6, cy - rr + 13);
    }
  }

  function drawSweep() {
    const a = Math.PI + (sim.sweep % Math.PI);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, cy + 2); // keep the sweep above the ground line
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R * 1.02, a - 0.45, a);
    ctx.closePath();
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, 'rgba(34, 197, 94, .18)');
    g.addColorStop(1, 'rgba(34, 197, 94, .02)');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }

  function drawTrail(points, color, width) {
    if (points.length < 2) return;
    ctx.beginPath();
    points.forEach(([x, y], i) => {
      const [X, Y] = px(x, y);
      if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    });
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawThreat(t) {
    drawTrail(t.trail, t.def.color, t.type === 'ballistic' ? 2 : 1.5);
    const [X, Y] = px(t.x, t.y);
    ctx.fillStyle = t.def.color;
    ctx.beginPath();
    if (t.type === 'aircraft') {
      const ang = Math.atan2(-t.y, -t.x);
      ctx.save();
      ctx.translate(X, Y);
      ctx.rotate(ang);
      ctx.moveTo(7, 0);
      ctx.lineTo(-5, -5);
      ctx.lineTo(-2, 0);
      ctx.lineTo(-5, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      return;
    }
    if (t.type === 'drone') {
      ctx.moveTo(X, Y - 4);
      ctx.lineTo(X + 4, Y);
      ctx.lineTo(X, Y + 4);
      ctx.lineTo(X - 4, Y);
      ctx.closePath();
    } else {
      ctx.arc(X, Y, t.type === 'ballistic' ? 4 : 3.2, 0, Math.PI * 2);
    }
    ctx.fill();
    if (t.targeted) {
      ctx.strokeStyle = 'rgba(255,255,255,.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(X, Y, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawInterceptor(m) {
    drawTrail(m.trail, m.layer.color, 1.5);
    const [X, Y] = px(m.x, m.y);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(X, Y, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBeam(b) {
    const [X, Y] = px(b.target.x, b.target.y);
    ctx.strokeStyle = b.layer.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = b.layer.color;
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.5 + Math.random() * 0.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(X, Y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  function drawBlast(b) {
    const [X, Y] = px(b.x, b.y);
    const p = b.t / 0.7;
    ctx.globalAlpha = 1 - p;
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(X, Y, 4 + p * 18 * b.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(X, Y, Math.max(0, 5 * b.size * (1 - p)), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawIdleHint() {
    if (sim.threats.length || sim.queue.length || sim.stats.threats) return;
    ctx.font = '500 13px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(230, 237, 247, .7)';
    ctx.fillText('Pick a raid to start the simulation', cx, Math.max(24, cy - R - 4));
  }

  function draw() {
    if (!W || !H) return;
    ctx.clearRect(0, 0, W, H);
    drawSweep();
    drawLayers();
    drawAsset();
    sim.beams.forEach(drawBeam);
    sim.interceptors.forEach(drawInterceptor);
    sim.threats.forEach(drawThreat);
    sim.blasts.forEach(drawBlast);
    drawIdleHint();
  }

  /* ----- Loop: only runs while the canvas is on screen ----- */
  let visible = false;
  let rafId = 0;
  let last = 0;

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    step(dt);
    draw();
    // With reduced motion, stop the idle radar sweep once the scene is quiet
    const busy = sim.threats.length || sim.queue.length || sim.interceptors.length || sim.beams.length || sim.blasts.length;
    rafId = visible && (busy || !reduceMotion) ? requestAnimationFrame(frame) : 0;
  }

  function wake() {
    if (rafId || !visible) return;
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) wake();
  }).observe(canvas);

  new ResizeObserver(resizeCanvas).observe(canvas);
  resizeCanvas();
  updateStats();
})();
