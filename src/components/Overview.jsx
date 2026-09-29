import Reveal from './Reveal.jsx';

export default function Overview() {
  return (
    <section id="overview" className="section">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Overview</p>
          <h2>Is there really an "Iron Dome of India"?</h2>
          <p>
            Not in name. "Iron Dome" is shorthand people use for any missile shield, but India's
            approach is closer to a <em>system of systems</em>: several weapons, each covering a
            different range and altitude, all fed by a shared radar picture.
          </p>
        </Reveal>

        <div className="cards-3">
          <Reveal as="article" className="card">
            <div className="card-icon" aria-hidden="true">🎯</div>
            <h3>Iron Dome is one system</h3>
            <p>Israel's Iron Dome intercepts short-range rockets, artillery and mortar shells at roughly 4–70 km. It is a single layer in Israel's own larger stack, which also includes David's Sling and Arrow.</p>
          </Reveal>
          <Reveal as="article" className="card">
            <div className="card-icon" aria-hidden="true">🌐</div>
            <h3>India's threats are broader</h3>
            <p>India has to defend about 3.3 million km², two contested land borders and a long coastline against ballistic and cruise missiles, fighter aircraft and cheap drone swarms, all at the same time.</p>
          </Reveal>
          <Reveal as="article" className="card">
            <div className="card-icon" aria-hidden="true">🛡️</div>
            <h3>So India builds layers</h3>
            <p>Mission Sudarshan Chakra, announced on 15 August 2025, aims to expand, network and modernise these layers into a single national shield. Officials describe it as both a <em>shield</em> and a <em>sword</em>.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
