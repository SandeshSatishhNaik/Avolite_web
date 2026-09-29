import ChakraIcon from './ChakraIcon.jsx';
import CountUp from './CountUp.jsx';

const BLIPS = [
  ['threat', '28%', '22%', '0s'],
  ['threat', '70%', '18%', '1.1s'],
  ['threat', '82%', '58%', '2.3s'],
  ['friendly', '40%', '62%', '.6s'],
  ['friendly', '58%', '40%', '1.7s']
];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">India's integrated air &amp; missile defence</p>
          <h1>The <span className="hl">Iron Dome</span> of India</h1>
          <p className="lead">
            India does not operate Israel's Iron Dome. It is building something far larger:{' '}
            <strong>Mission Sudarshan Chakra</strong>, a nationwide, multi-layered shield
            that links radars, missiles, guns and lasers into one network, with the goal of
            covering every vital site by <strong>2035</strong>.
          </p>
          <div className="btn-row">
            <a className="btn btn-primary" href="#layers">Explore the layers</a>
            <a className="btn btn-ghost" href="#simulator">Try the simulator</a>
          </div>
          <dl className="stats">
            <div className="stat">
              <dt className="stat-label">Defensive tiers</dt>
              <dd className="stat-num"><CountUp to={5} /></dd>
            </div>
            <div className="stat">
              <dt className="stat-label">Outer reach (S-400)</dt>
              <dd className="stat-num"><CountUp to={400} /><small> km</small></dd>
            </div>
            <div className="stat">
              <dt className="stat-label">Weapon systems</dt>
              <dd className="stat-num"><CountUp to={10} /><small>+</small></dd>
            </div>
            <div className="stat">
              <dt className="stat-label">Nationwide target</dt>
              <dd className="stat-num"><CountUp to={2035} from={2025} /></dd>
            </div>
          </dl>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="radar">
            <div className="radar-sweep" />
            {BLIPS.map(([kind, x, y, d]) => (
              <span key={x + y} className={`blip ${kind}`} style={{ '--x': x, '--y': y, '--d': d }} />
            ))}
            <div className="radar-core">
              <ChakraIcon />
            </div>
          </div>
          <p className="radar-caption">
            Illustrative radar picture: <span className="dot-red" /> hostile tracks &nbsp;{' '}
            <span className="dot-green" /> interceptors
          </p>
        </div>
      </div>
    </section>
  );
}
