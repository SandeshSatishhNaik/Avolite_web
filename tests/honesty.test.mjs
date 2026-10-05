import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requireTagged } from '../src/lib/data.ts';

// ---- DATA-02: requireTagged shape check ----
const ok = { value: 1, unit: 'm', status: 'SIMULATED', label: 'x', source: 'y' };

test('requireTagged returns the same object for a complete value', () => {
  assert.equal(requireTagged(ok, 'w'), ok);
});

test('requireTagged throws for each missing field', () => {
  assert.throws(() => requireTagged({ value: 1, unit: 'm' }, 'w'), /status/);
  assert.throws(() => requireTagged({ ...ok, unit: '' }, 'w'), /unit/);
  const { unit, ...noUnit } = ok;
  assert.throws(() => requireTagged(noUnit, 'w'), /unit/);
  assert.throws(() => requireTagged({ ...ok, source: '' }, 'w'), /source/);
  assert.throws(() => requireTagged({ ...ok, label: '' }, 'w'), /label/);
  assert.throws(() => requireTagged({ ...ok, status: 'LIVE' }, 'w'), /unknown status/);
});

// ---- DATA-07 and DATA-02 (dist layer): output wording lint ----
import { existsSync, mkdirSync, readdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintHtml, scanDist, lintOutput, pruneUnusedPng } from '../scripts/honesty.mjs';

const page = (body, head = '') => `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;
const hits = (body, head) => lintHtml(page(body, head), 'f.html');

for (const w of ['Live', 'live', 'Real-time', 'realtime', 'real time', 'TODO', 'TBD', 'lorem ipsum']) {
  test(`lintHtml flags "${w}" once`, () => {
    assert.equal(hits(`<p>A ${w} view</p>`).length, 1);
  });
}

test('lintHtml reports one hit per rule', () => {
  assert.equal(hits('<p>live and real-time</p>').length, 2);
});

test('lintHtml uses word boundaries', () => {
  assert.deepEqual(hits('<p>dolorem Todos delivered alive</p>'), []);
});

test('lintHtml ignores aria-live, scripts, styles and class names', () => {
  assert.deepEqual(
    hits('<div aria-live="polite" class="live-region"><p>ok</p></div><script>var live = 1;</script><style>.live{}</style>'),
    [],
  );
});

test('lintHtml reads alt, title, aria-label, <title> and meta description', () => {
  assert.equal(hits('<img alt="Live feed" src="a.png">').length, 1);
  assert.equal(hits('<a title="real-time" href="#">x</a>').length, 1);
  assert.equal(hits('<button aria-label="TODO">x</button>').length, 1);
  assert.equal(hits('<p>ok</p>', '<title>Live radar</title>').length, 1);
  assert.equal(hits('<p>ok</p>', '<meta name="description" content="Real-time scanning">').length, 1);
  assert.deepEqual(hits('<p>ok</p>', '<meta name="viewport" content="width=device-width, initial-scale=1">'), []);
});

test('lintHtml flags AI/ML in the same block as a BUILT or SIMULATED tag only', () => {
  assert.equal(hits('<p>AI <span data-status="BUILT">BUILT</span></p>').length, 1);
  assert.equal(hits('<p>Our ML model <span data-status="SIMULATED">SIMULATED</span></p>').length, 1);
  assert.equal(hits('<p>machine learning <span data-status="BUILT">BUILT</span></p>').length, 1);
  assert.deepEqual(hits('<p>AI <span data-status="DESIGNED">DESIGNED</span></p>'), []);
  assert.deepEqual(hits('<p>AI <span data-status="PROTOTYPE">PROTOTYPE</span></p>'), []);
  assert.deepEqual(hits('<ul><li>AI</li><li><span data-status="BUILT">BUILT</span></li></ul>'), []);
  assert.deepEqual(hits('<p>said <span data-status="BUILT">BUILT</span></p>'), []);
});

// CR-02: fixtures shaped like the real Metric / Figure / ResultTable output (claim text and tag in different blocks).
const tag = (st) => '<span class="tag tag--x" data-status="' + st + '" data-astro-cid-a><svg aria-hidden="true"></svg>' + st + '</span>';
const metric = (label, st) =>
  '<div class="metric" data-status="' + st + '" data-claim><p class="metric__figure"><data value="1" data-status="' + st + '">1</data><span>m</span></p><p class="metric__label">' + label + '</p>' + tag(st) + '</div>';
const figure = (cap, alt, st) =>
  '<figure class="figure" data-claim><div class="plate"><picture><img alt="' + alt + '" src="a.webp"></picture></div><figcaption><p class="figure__title">' + cap + '</p><p class="figure__src">' + tag(st) + '<a href="#">x.png</a></p></figcaption></figure>';
const table = (title, st) =>
  '<div data-claim><table><caption><strong>' + title + '</strong><span>scenario</span></caption><tbody><tr><td><data value="1" data-status="' + st + '">1</data></td></tr></tbody></table><p class="rt__src">' + tag(st) + '</p></div>';

test('CR-02: AI/ML wording flagged in real Metric, Figure and ResultTable shapes', () => {
  assert.equal(hits(metric('AI detection accuracy', 'SIMULATED')).length, 1);
  assert.equal(hits(metric('Mean error', 'BUILT').replace('Mean error', 'ML classifier score')).length, 1);
  assert.equal(hits(figure('Machine learning classifier output', 'A plot', 'SIMULATED')).length, 1);
  assert.equal(hits(figure('Range error', 'A neural network output plot', 'SIMULATED')).length, 1);
  assert.equal(hits(table('Trained detector results', 'BUILT')).length, 1);
});

test('CR-02: the same shapes pass when wording is clean or the tag is DESIGNED', () => {
  assert.deepEqual(hits(metric('Max range error', 'SIMULATED')), []);
  assert.deepEqual(hits(figure('Range and velocity error', 'A bar chart', 'SIMULATED')), []);
  assert.deepEqual(hits(table('CFAR five-target detection', 'BUILT')), []);
  assert.deepEqual(hits('<div class="metric" data-status="DESIGNED" data-claim><p>AI detection</p>' + tag('DESIGNED') + '</div>'), []);
});

test('CR-02: a status tag with no data-claim wrapper is scoped to its nearest block, and quoting is irrelevant', () => {
  assert.equal(hits('<div><p>AI detection accuracy</p><span data-status="BUILT">BUILT</span></div>').length, 1);
  assert.equal(hits("<div><p>AI detection accuracy</p><span data-status='BUILT'>BUILT</span></div>").length, 1);
  assert.equal(hits('<div><p>AI detection accuracy</p><span data-status=SIMULATED>SIMULATED</span></div>').length, 1);
  assert.equal(hits('<p>AI <span data-status=\'BUILT\'>BUILT</span></p>').length, 1);
  // claim scope does not leak to sibling claims
  assert.deepEqual(hits(metric('AI sketch', 'DESIGNED') + metric('Max range error', 'SIMULATED')), []);
});

test('lintHtml flags a <data> number without data-status', () => {
  assert.equal(hits('<p><data value="1">1</data></p>').length, 1);
  assert.deepEqual(hits('<p><data value="1" data-status="SIMULATED">1</data></p>'), []);
});

test('honesty guards reject invalid status, entity-encoded claims and lowercase model claims', () => {
  for (const status of ['', 'UNKNOWN', 'SIMULATED-fake']) assert.equal(hits(`<data value="1" data-status="${status}">1</data>`).length, 1);
  assert.equal(hits('<p>l&#x69;ve feed</p>').length, 1);
  assert.equal(hits('<p>real&Tab;time</p>').length, 1);
  assert.equal(hits('<p>ml output <span data-status="SIMULATED">SIMULATED</span></p>').length, 1);
});

test('scanDist on the real dist is clean', (t) => {
  const dist = fileURLToPath(new URL('../dist/', import.meta.url));
  if (!existsSync(dist)) return t.skip('dist/ absent: run npm run build first');
  assert.deepEqual(scanDist(dist), []);
});

test('CR-02: an AI label injected into the real built preview page is flagged', (t) => {
  const f = fileURLToPath(new URL('../dist/preview/index.html', import.meta.url));
  if (!existsSync(f)) return t.skip('dist/preview absent: run npm run build first');
  const html = readFileSync(f, 'utf8');
  assert.deepEqual(lintHtml(html, 'p'), []);
  for (const needle of ['class="metric__label"', 'class="figure__title"', '<caption']) {
    const i = html.indexOf(needle);
    assert.ok(i > -1, needle);
    const j = html.indexOf('>', i) + 1;
    assert.ok(lintHtml(html.slice(0, j) + 'AI ' + html.slice(j), 'p').length >= 1, needle);
  }
});

test('scanDist and lintOutput fail on a bad file, naming it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'avl-dist-'));
  writeFileSync(join(dir, 'bad.html'), page('<p>Live now</p>'));
  const found = scanDist(dir);
  assert.ok(found.length >= 1);
  assert.match(found[0], /bad\.html/);
  assert.throws(() => lintOutput(dir), /bad\.html/);
  const good = mkdtempSync(join(tmpdir(), 'avl-dist-'));
  writeFileSync(join(good, 'ok.html'), page('<p>Fine</p>'));
  assert.doesNotThrow(() => lintOutput(good));
});

test('WR-05: pruneUnusedPng keeps PNGs referenced by any text file, drops the rest, honours the assets dir', () => {
  for (const assets of ['_astro', 'assets']) {
    const dir = mkdtempSync(join(tmpdir(), 'avl-prune-'));
    mkdirSync(join(dir, assets));
    mkdirSync(join(dir, 'sub'));
    for (const n of ['a', 'b', 'c', 'd', 'e']) writeFileSync(join(dir, assets, n + '.abc123.png'), 'x');
    writeFileSync(join(dir, 'index.html'), '<img src="/' + assets + '/a.abc123.png">');
    writeFileSync(join(dir, 'sub', 'site.webmanifest'), '{"icons":[{"src":"/' + assets + '/b.abc123.png"}]}');
    writeFileSync(join(dir, 'icon.svg'), '<svg><image href="/' + assets + '/c.abc123.png"/></svg>');
    writeFileSync(join(dir, 'search.json'), '["/' + assets + '/d.abc123.png"]');
    pruneUnusedPng(dir, assets);
    const left = readdirSync(join(dir, assets)).sort();
    assert.deepEqual(left, ['a.abc123.png', 'b.abc123.png', 'c.abc123.png', 'd.abc123.png']);
  }
  pruneUnusedPng(mkdtempSync(join(tmpdir(), 'avl-prune-')), 'missing');
});
