import { useState } from 'react';
import { LAYERS, LAYER_BY_ID } from '../data.js';
import Reveal from './Reveal.jsx';

const RING_RADII = { bmd: 190, long: 158, medium: 126, short: 94, vshort: 62, c2: 30 };

// A full circle, drawn as two arcs so it can be combined into a ring path
const circlePath = r => `M${200 - r},200a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;

// Each tier is its own band (outer circle minus the next tier in), so
// highlighting one never tints the tiers inside it
const RINGS = LAYERS.map((layer, i) => {
  const r = RING_RADII[layer.id];
  const next = LAYERS[i + 1];
  const inner = next ? RING_RADII[next.id] : 0;
  return {
    layer,
    r,
    band: circlePath(r) + (inner ? circlePath(inner) : ''),
    labelY: 200 - (next ? (r + inner) / 2 : 0) + 4
  };
});

export default function Layers() {
  const [selected, setSelected] = useState('long');
  const layer = LAYER_BY_ID[selected];
  const isActive = id => (id === selected ? ' active' : '');

  return (
    <section id="layers" className="section section-alt">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Defence in depth</p>
          <h2>Five tiers and a brain</h2>
          <p>Click a ring or a tab to see what each tier does. The outer tiers hit threats early and far away. The inner tiers catch whatever gets through, and do it cheaply.</p>
        </Reveal>

        <div className="layers-grid">
          <Reveal className="layer-visual">
            <svg id="layer-rings" className="layer-svg" viewBox="0 0 400 400" role="img" aria-label="Concentric rings showing India's air defence layers">
              {RINGS.map(({ layer: l, band }) => (
                <path
                  key={l.id}
                  className={`ring${isActive(l.id)}`}
                  d={band}
                  fillRule="evenodd"
                  fill={l.color}
                  onClick={() => setSelected(l.id)}
                >
                  <title>{l.name}</title>
                </path>
              ))}
              {/* Outlines and labels sit above every band so they are never covered */}
              {RINGS.map(({ layer: l, r }) => (
                <circle key={l.id} className={`ring-outline${isActive(l.id)}`} cx="200" cy="200" r={r} stroke={l.color} />
              ))}
              {RINGS.map(({ layer: l, labelY }) => (
                <text key={l.id} className="ring-label" x="200" y={labelY} textAnchor="middle">{l.label}</text>
              ))}
            </svg>
          </Reveal>

          <Reveal className="layer-info">
            <div id="layer-tabs" className="layer-tabs" role="group" aria-label="Choose a defence layer">
              {LAYERS.map(l => (
                <button
                  key={l.id}
                  type="button"
                  className="layer-tab"
                  data-id={l.id}
                  style={{ '--c': l.color }}
                  aria-pressed={l.id === selected}
                  onClick={() => setSelected(l.id)}
                >
                  <span className="dot" />{l.tab}
                </button>
              ))}
            </div>
            <article id="layer-detail" className="layer-detail" aria-live="polite" style={{ '--c': layer.color }}>
              <h3>{layer.name}</h3>
              <dl className="meta">
                <dt>Coverage</dt><dd>{layer.range}</dd>
                <dt>Defeats</dt><dd>{layer.threats.join(', ')}</dd>
              </dl>
              <p className="desc">{layer.desc}</p>
              <div className="chips">
                {layer.systems.map(s => <span key={s} className="chip">{s}</span>)}
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
