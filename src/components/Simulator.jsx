import { useEffect, useRef, useState } from 'react';
import { SIM_LAYERS, createSimulation } from '../sim/engine.js';
import Reveal from './Reveal.jsx';

const WAVE_BUTTONS = [
  ['mixed', 'Mixed raid', 'btn-primary'],
  ['missiles', 'Missile salvo', 'btn-ghost'],
  ['swarm', 'Drone swarm', 'btn-ghost']
];

const LEGEND = [
  ['ballistic', 'Ballistic missile'],
  ['cruise', 'Cruise missile'],
  ['aircraft', 'Aircraft'],
  ['drone', 'Drone'],
  ['interceptor', 'Interceptor']
];

const EMPTY_STATS = { threats: 0, kills: 0, leaks: 0, fired: 0 };
const ALL_ON = Object.fromEntries(SIM_LAYERS.map(l => [l.id, true]));

export default function Simulator() {
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const logId = useRef(0);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [log, setLog] = useState([]);
  const [layersOn, setLayersOn] = useState(ALL_ON);

  // The canvas engine runs outside React; it only reports scoreboard and log events back
  useEffect(() => {
    const sim = createSimulation(canvasRef.current, {
      onStats: setStats,
      onLog: entry => setLog(prev => [{ ...entry, id: ++logId.current }, ...prev].slice(0, 5))
    });
    simRef.current = sim;
    return () => {
      sim.destroy();
      simRef.current = null;
    };
  }, []);

  const toggleLayer = (id, on) => {
    setLayersOn(prev => ({ ...prev, [id]: on }));
    simRef.current?.setLayerOn(id, on);
  };

  const reset = () => {
    simRef.current?.reset();
    setLog([]);
  };

  const resolved = stats.kills + stats.leaks;
  const rate = resolved ? `${Math.round((stats.kills / resolved) * 100)}%` : '—';

  return (
    <section id="simulator" className="section section-alt">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Interactive</p>
          <h2>Interception simulator</h2>
          <p>Launch a raid and watch each layer engage. Turn layers off to see why depth matters. Expensive long-range missiles are never spent on cheap drones, so a big enough swarm can still saturate the inner tiers.</p>
        </Reveal>

        <div className="sim">
          <div className="sim-stage">
            <canvas ref={canvasRef} id="sim-canvas" aria-label="Air defence interception simulation" role="img" />
            <div className="sim-legend">
              {LEGEND.map(([kind, label]) => (
                <span key={kind}><i className={`lg lg-${kind}`} />{label}</span>
              ))}
            </div>
          </div>

          <aside className="sim-panel">
            <div className="panel-box">
              <h3 className="panel-title">Launch a raid</h3>
              <div className="sim-buttons">
                {WAVE_BUTTONS.map(([wave, label, style]) => (
                  <button
                    key={wave}
                    className={`btn ${style} btn-sm`}
                    data-wave={wave}
                    type="button"
                    onClick={() => simRef.current?.launchWave(wave)}
                  >
                    {label}
                  </button>
                ))}
                <button className="btn btn-ghost btn-sm" id="sim-reset" type="button" onClick={reset}>Reset</button>
              </div>
            </div>

            <div className="panel-box">
              <h3 className="panel-title">Active layers</h3>
              <div id="sim-toggles" className="sim-toggles">
                {SIM_LAYERS.map(l => (
                  <label key={l.id} className="sim-toggle" style={{ '--c': l.color }}>
                    <input
                      type="checkbox"
                      data-layer={l.id}
                      checked={layersOn[l.id]}
                      onChange={e => toggleLayer(l.id, e.target.checked)}
                    />
                    <span className="swatch" />
                    <span>{l.name}<small>{l.sub}</small></span>
                  </label>
                ))}
              </div>
            </div>

            <div className="panel-box">
              <h3 className="panel-title">Scoreboard</h3>
              <div className="sim-stats">
                <div className="sim-stat"><b id="st-threats">{stats.threats}</b>Threats</div>
                <div className="sim-stat"><b id="st-kills" className="c-ok">{stats.kills}</b>Intercepted</div>
                <div className="sim-stat"><b id="st-leaks" className="c-bad">{stats.leaks}</b>Leaked</div>
                <div className="sim-stat"><b id="st-rate">{rate}</b>Success rate</div>
              </div>
              <p className="sim-fired">Interceptors fired: <b id="st-fired">{stats.fired}</b></p>
              <ul id="sim-log" className="sim-log">
                {log.map(entry => <li key={entry.id} className={entry.cls}>{entry.msg}</li>)}
              </ul>
            </div>
          </aside>
        </div>
        <p className="note">A simplified teaching model. Kill probabilities, speeds and ranges are illustrative, not real performance data.</p>
      </div>
    </section>
  );
}
