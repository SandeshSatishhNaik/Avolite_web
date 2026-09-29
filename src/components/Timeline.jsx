import { TIMELINE } from '../data.js';
import Reveal from './Reveal.jsx';

export default function Timeline() {
  return (
    <section id="timeline" className="section">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">How we got here</p>
          <h2>Timeline</h2>
        </Reveal>

        <ol className="timeline">
          {TIMELINE.map(item => (
            <Reveal as="li" key={item.date} className={item.future ? 'tl-future' : ''}>
              <span className="tl-date">{item.date}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
