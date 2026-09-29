import { COMPARISON } from '../data.js';
import Reveal from './Reveal.jsx';

export default function Compare() {
  return (
    <section id="compare" className="section section-alt">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Side by side</p>
          <h2>Iron Dome vs India's shield</h2>
        </Reveal>

        <Reveal className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">Israel's Iron Dome</th>
                <th scope="col">India's Sudarshan Chakra shield</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(([label, ironDome, india]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{ironDome}</td>
                  <td>{india}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
