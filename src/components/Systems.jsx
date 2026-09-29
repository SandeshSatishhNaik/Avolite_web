import { useState } from 'react';
import { FILTERS, LAYER_BY_ID, SYSTEMS } from '../data.js';
import Reveal from './Reveal.jsx';

export default function Systems() {
  const [filter, setFilter] = useState('all');
  const list = filter === 'all' ? SYSTEMS : SYSTEMS.filter(s => s.layers.includes(filter));

  return (
    <section id="systems" className="section">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Order of battle</p>
          <h2>The systems behind the shield</h2>
          <p>Most of it is indigenous (DRDO, BEL), with key partners Russia and Israel. Ranges are approximate public figures.</p>
        </Reveal>

        <div id="system-filters" className="filters" role="group" aria-label="Filter systems by layer">
          {FILTERS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="filter"
              data-filter={id}
              aria-pressed={id === filter}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Keyed by filter so the cards replay their entry animation on each change */}
        <div id="systems-grid" className="systems-grid" key={filter}>
          {list.map(s => (
            <article key={s.name} className="sys-card" style={{ '--c': LAYER_BY_ID[s.layers[0]].color }}>
              <span className={`status ${s.status[0]}`}>{s.status[1]}</span>
              <h3>{s.name}</h3>
              <p className="sys-origin">{s.origin}</p>
              <p className="sys-range">{s.range}</p>
              <p className="desc">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
