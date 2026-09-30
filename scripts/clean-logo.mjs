// GENERATED OUTPUT: logo.svg (VTracer auto-trace) -> src/lib/logo.generated.json + public/favicon.svg. Never hand-edit the outputs; re-run this script.
// drops #FDFDFD bg; #FBFCFC (counter of "O") becomes an evenodd hole in its letter; ~50 fills -> green/khaki roles;
// translate() baked to absolute coords (1 decimal); split into mark (minY < 560) and wordmark
import { readFileSync, writeFileSync } from 'node:fs';
const [src = 'logo.svg', out = 'src/lib/logo.generated.json', fav = 'public/favicon.svg'] = process.argv.slice(2);
const re = /<path d="([^"]*)" fill="#([0-9a-fA-F]{6})" transform="translate\(([-\d.]+),([-\d.]+)\)"\/>/g;
const paths = [...readFileSync(src, 'utf8').matchAll(re)].map(([, d, hex, tx, ty]) => ({ d, hex: hex.toLowerCase(), tx: +tx, ty: +ty }));
if (paths.length < 40) throw new Error(`expected ~52 paths, got ${paths.length}`);
const rgb = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
const kind = ({ hex }) => { const [r, g, b] = rgb(hex);
  if (r > 240 && g > 240 && b > 240) return hex === 'fdfdfd' ? 'bg' : 'hole';
  return r > g && g > b && r > 150 ? 'khaki' : 'green'; };
const bake = ({ d, tx, ty }) => { let i = 0; return d.replace(/-?\d+\.?\d*/g, (n) => +(+n + (i++ % 2 ? ty : tx)).toFixed(1)).trim(); };
const box = (d) => { const n = d.match(/-?\d+\.?\d*/g).map(Number); const xs = n.filter((_, i) => !(i % 2)), ys = n.filter((_, i) => i % 2);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
const part = () => ({ green: [], khaki: [], holed: [], bb: [1e9, 1e9, -1e9, -1e9] });
const parts = { mark: part(), word: part() }; const holes = [];
for (const p of paths) {
  const k = kind(p); if (k === 'bg') continue;
  const d = bake(p); const b = box(d);
  if (k === 'hole') { holes.push(d); continue; }
  const t = parts[b[1] >= 560 ? 'word' : 'mark']; t[k].push(d);
  t.bb = [Math.min(t.bb[0], b[0]), Math.min(t.bb[1], b[1]), Math.max(t.bb[2], b[2]), Math.max(t.bb[3], b[3])];
}
for (const h of holes) { const [x0, y0, x1, y1] = box(h); let done = false;
  for (const t of Object.values(parts)) { const i = t.green.findIndex((g) => { const c = box(g); return c[0] <= x0 && c[1] <= y0 && c[2] >= x1 && c[3] >= y1; });
    if (i >= 0) { t.holed.push(t.green.splice(i, 1)[0] + ' ' + h); done = true; break; } }
  if (!done) throw new Error('counter path has no containing letter'); }
const pad = 4, vb = (b) => [b[0] - pad, b[1] - pad, b[2] - b[0] + 2 * pad, b[3] - b[1] + 2 * pad].map(Math.round).join(' ');
const all = [parts.mark.bb, parts.word.bb].reduce((a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])]);
const j = { viewBox: { lockup: vb(all), mark: vb(parts.mark.bb), wordmark: vb(parts.word.bb) },
  mark: { green: parts.mark.green.join(' '), khaki: parts.mark.khaki.join(' '), holed: parts.mark.holed.join(' ') },
  wordmark: { green: parts.word.green.join(' '), khaki: parts.word.khaki.join(' '), holed: parts.word.holed.join(' ') } };
writeFileSync(out, JSON.stringify(j));

// Favicon: mark on the page background, square, baked colours (public/ is exempt from the token lint; a favicon cannot read CSS vars).
const b = parts.mark.bb, w = b[2] - b[0], h = b[3] - b[1];
const side = Math.round(Math.max(w, h) * 1.12), cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;
const fx = Math.round(cx - side / 2), fy = Math.round(cy - side / 2);
const holed = j.mark.holed ? `<path fill="#E8EEF6" fill-rule="evenodd" d="${j.mark.holed}"/>` : '';
writeFileSync(fav, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fx} ${fy} ${side} ${side}"><rect x="${fx}" y="${fy}" width="${side}" height="${side}" fill="#050B16"/><path fill="#E8EEF6" d="${j.mark.green}"/><path fill="#BCAC87" d="${j.mark.khaki}"/>${holed}</svg>\n`);
console.log(j.viewBox);
