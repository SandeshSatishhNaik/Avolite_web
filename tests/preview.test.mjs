import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATUS, STATUS_IDS } from '../src/lib/status.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
assert.ok(existsSync(join(dist, 'preview', 'index.html')), 'dist/preview/index.html missing: run npm run build first');

const page = readFileSync(join(dist, 'preview', 'index.html'), 'utf8').replace(/&#39;/g, "'");
const home = readFileSync(join(dist, 'index.html'), 'utf8');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const legend = page.match(/<dl class="legend[^"]*"[\s\S]*?<\/dl>/)?.[0] ?? '';

// ---- Task 1: tags, legend, header, placeholders, noindex ----
test('preview is noindex by meta and by header rule; home is not', () => {
  assert.equal((page.match(/name="robots" content="noindex"/g) ?? []).length, 1);
  assert.equal((home.match(/name="robots"/g) ?? []).length, 0);
  const headers = readFileSync(join(dist, '_headers'), 'utf8');
  assert.match(headers, /^\/preview\n\s+X-Robots-Tag: noindex$/m);
  assert.match(headers, /^\/preview\/\*\n\s+X-Robots-Tag: noindex$/m);
  assert.ok(headers.includes('immutable'));
});

test('legend lists six tags with six distinct glyphs and every definition', () => {
  assert.ok(legend, 'legend missing');
  const statuses = [...legend.matchAll(/<span class="[^"]*tag [^"]*"[^>]*data-status="([A-Z]+)"/g)].map((m) => m[1]);
  assert.deepEqual(statuses, [...STATUS_IDS]);
  const glyphs = new Set([...legend.matchAll(/data-glyph="([a-z-]+)"/g)].map((m) => m[1]));
  assert.equal(glyphs.size, 6);
  for (const s of STATUS_IDS) assert.ok(legend.includes(STATUS[s].definition), `definition missing for ${s}`);
});

test('every tag keeps its label text in the DOM', () => {
  for (const s of STATUS_IDS) assert.match(page, new RegExp(`</svg>${s}(?:<|\\s)`));
});

test('section header renders the numbered eyebrow', () => {
  assert.ok(page.includes('01 · THE PROBLEM'));
});

test('two placeholders each carry an inline aspect-ratio', () => {
  const boxes = [...page.matchAll(/<div\b[^>]*data-placeholder[^>]*>/g)].map((m) => m[0]);
  assert.equal(boxes.length, 2);
  for (const b of boxes) assert.match(b, /style="aspect-ratio: [\d.]+ \/ \d+"/);
  assert.ok(page.includes('pending from the team'));
});

test('preview adds no script beyond the shared shell', () => {
  const n = (h) => (h.match(/<script\b/g) ?? []).length;
  assert.equal(n(page), n(home));
});

test('home page still has exactly 8 data-section sections', () => {
  assert.equal((home.match(/<section\b[^>]*data-section/g) ?? []).length, 8);
});

// ---- Source guards (T-2-06, T-2-08) ----
const srcFiles = walk(join(root, 'src')).filter((f) => /\.(astro|ts|css)$/.test(f));
const srcText = (f) => readFileSync(f, 'utf8');

test('no set:html or innerHTML under src', () => {
  const bad = srcFiles.filter((f) => /set:html|innerHTML/.test(srcText(f))).map((f) => relative(root, f));
  assert.deepEqual(bad, []);
});

test('target="_blank" always carries rel="noopener"', () => {
  const bad = srcFiles
    .flatMap((f) => [...srcText(f).matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((m) => [f, m[0]]))
    .filter(([, tag]) => !/rel="[^"]*noopener/.test(tag))
    .map(([f]) => relative(root, f));
  assert.deepEqual(bad, []);
});

// ---- Task 2: images, metrics, table, figure, wiring ----
import { derive, fmt, columnLabel, dataset, illustrative } from '../src/lib/data.ts';

const distFiles = walk(dist);

test('IMG-03: AVIF and WebP sources, img with size and lazy decoding, no PNG in dist', () => {
  assert.match(page, /<source[^>]*type="image\/avif"/);
  assert.match(page, /<source[^>]*type="image\/webp"/);
  const img = page.match(/<img\b[^>]*>/g)?.find((t) => t.includes('.webp'));
  assert.ok(img, 'no webp img');
  for (const a of ['width=', 'height=', 'loading="lazy"', 'decoding="async"']) assert.ok(img.includes(a), `img lacks ${a}`);
  const astroFiles = distFiles.filter((f) => f.replaceAll('\\', '/').includes('/_astro/'));
  assert.ok(astroFiles.some((f) => f.endsWith('.avif')));
  assert.ok(astroFiles.some((f) => f.endsWith('.webp')));
  assert.deepEqual(astroFiles.filter((f) => f.endsWith('.png')), []);
});

test('every img in every built html has width and height', () => {
  const bad = [];
  for (const f of distFiles.filter((f) => f.endsWith('.html')))
    for (const t of readFileSync(f, 'utf8').match(/<img\b[^>]*>/g) ?? []) if (!/\swidth="/.test(t) || !/\sheight="/.test(t)) bad.push(relative(root, f));
  assert.deepEqual(bad, []);
});

test('metrics: SIMULATED counts up, ILLUSTRATIVE never, value matches derive()', () => {
  const datas = [...page.matchAll(/<data\b[^>]*>[^<]*<\/data>/g)].map((m) => m[0]);
  assert.ok(datas.some((d) => /data-status="SIMULATED"/.test(d) && /data-countup/.test(d)));
  const ill = datas.filter((d) => /data-status="ILLUSTRATIVE"/.test(d));
  assert.ok(ill.length >= 1);
  for (const d of ill) assert.ok(!d.includes('data-countup'));
  const expected = fmt(derive('cfar-a').maxAbsRangeError, 1);
  assert.ok(datas.some((d) => d.includes('metric__value') && d.endsWith(`>${expected}</data>`)), `max range error ${expected} not rendered`);
});

test('every data element carries data-status', () => {
  for (const m of page.matchAll(/<data\b[^>]*>/g)) assert.match(m[0], /data-status="[A-Z]+"/);
});

test('illustrative metric shows its provenance text and no internal doc reference', () => {
  assert.ok(page.includes(illustrative('env-noise-floor-example').source));
  assert.ok(!page.includes('Master doc'));
});

const tableSection = page.match(/<section id="result-table"[\s\S]*?<\/section>/)?.[0] ?? '';

test('result table: one real table with caption, column headers and labelled cells', () => {
  assert.ok(tableSection, 'result-table section missing');
  assert.equal((tableSection.match(/<table\b[^>]*role="table"/g) ?? []).length, 1);
  assert.equal((tableSection.match(/<table\b/g) ?? []).length, 1);
  assert.match(tableSection, /<caption/);
  const heads = [...tableSection.matchAll(/<th\b[^>]*scope="col"[^>]*>([^<]*)<\/th>/g)].map((m) => m[1]);
  assert.deepEqual(heads, dataset('cfar-a').columns.map(columnLabel));
  for (const td of tableSection.match(/<td\b[^>]*>/g) ?? []) assert.match(td, /data-label="/);
});

test('view as table disclosure exists', () => {
  assert.match(page, /<details[^>]*>\s*<summary[^>]*>View as table<\/summary>/);
});

test('figure caption: SIMULATED tag and GitHub link at the pinned commit', () => {
  const cap = page.match(/<figcaption[\s\S]*?<\/figcaption>/)?.[0] ?? '';
  assert.match(cap, /data-status="SIMULATED"/);
  assert.match(cap, /href="https:\/\/github\.com\/abhishekpj0902-apj\/AVOLITE\/blob\/9b985ca7f8ef99000724f8ce870918a40d0d95c8\/04_MATLAB\//);
});

// ---- Wiring guards ----
const read = (p) => readFileSync(join(root, p), 'utf8');

test('Metric and ResultTable call requireIssued', () => {
  assert.ok(read('src/components/ui/Metric.astro').includes('requireIssued('));
  assert.ok(read('src/components/ui/ResultTable.astro').includes('requireIssued('));
});

test('derived values are never typed into components or pages', () => {
  const bad = srcFiles
    .filter((f) => /components|pages/.test(relative(root, f)))
    .filter((f) => /0\.165|0\.0995|0\.100/.test(srcText(f)))
    .map((f) => relative(root, f));
  assert.deepEqual(bad, []);
});

test('Figure never filters, blends or fades the image', () => {
  const t = read('src/components/ui/Figure.astro');
  for (const w of ['filter', 'mix-blend-mode', 'opacity']) assert.ok(!t.includes(w), `Figure.astro contains ${w}`);
});
