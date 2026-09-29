/* ==========================================================
   Interception simulator engine (plain canvas, framework-free).
   Positions are stored in "R units" relative to the protected
   asset at (0, 0), with negative y pointing up the screen, so
   the scene survives canvas resizes.
   ========================================================== */

export const SIM_LAYERS = [
  { id: 'long', name: 'Long range & BMD', sub: 'S-400 · PAD/AAD', r: 0.95, color: '#ff9933', pk: 0.85, cooldown: 1.3, speed: 0.8, shots: 2, targets: ['ballistic', 'aircraft', 'cruise'] },
  { id: 'medium', name: 'Medium range', sub: 'MRSAM · Akash-NG', r: 0.68, color: '#facc15', pk: 0.8, cooldown: 0.9, speed: 0.65, shots: 1, targets: ['aircraft', 'cruise'] },
  { id: 'short', name: 'Short range', sub: 'Akash · QRSAM', r: 0.44, color: '#38bdf8', pk: 0.75, cooldown: 0.7, speed: 0.55, shots: 1, targets: ['aircraft', 'cruise', 'drone'] },
  { id: 'vshort', name: 'Very short / C-UAS', sub: 'Guns · VSHORADS · laser', r: 0.22, color: '#22c55e', pk: 0.7, cooldown: 0.3, beam: 0.35, shots: 2, targets: ['drone', 'cruise'] }
];

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

/**
 * Starts the simulation on a canvas.
 * onStats receives a copy of the scoreboard whenever it changes;
 * onLog receives { msg, cls } engagement events.
 */
export function createSimulation(canvas, { onStats, onLog }) {
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layers = SIM_LAYERS.map(l => ({ ...l, on: true, cool: 0 }));

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

  let lastStats = '';
  function updateStats() {
    const s = sim.stats;
    const key = `${s.threats}|${s.kills}|${s.leaks}|${s.fired}`;
    if (key === lastStats) return;
    lastStats = key;
    onStats({ ...s });
  }

  const log = (msg, cls) => onLog({ msg, cls });

  function launchWave(kind) {
    const spread = WAVE_SPREAD[kind];
    WAVES[kind].forEach(([type, count]) => {
      for (let i = 0; i < count; i++) {
        sim.queue.push({ at: sim.time + Math.random() * spread, type });
      }
    });
    wake();
  }

  function reset() {
    sim.threats.length = 0;
    sim.interceptors.length = 0;
    sim.beams.length = 0;
    sim.blasts.length = 0;
    sim.queue.length = 0;
    Object.keys(sim.stats).forEach(k => { sim.stats[k] = 0; });
    layers.forEach(l => { l.cool = 0; });
    updateStats();
    draw();
  }

  function setLayerOn(id, on) {
    const layer = layers.find(l => l.id === id);
    if (layer) layer.on = on;
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
    for (const layer of layers) {
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
    for (const l of layers) {
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

  const visibility = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) wake();
  });
  visibility.observe(canvas);

  const resizer = new ResizeObserver(resizeCanvas);
  resizer.observe(canvas);
  resizeCanvas();

  return {
    launchWave,
    reset,
    setLayerOn,
    destroy() {
      visibility.disconnect();
      resizer.disconnect();
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
}
