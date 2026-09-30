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
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintHtml, scanDist, lintOutput } from '../scripts/honesty.mjs';

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

test('lintHtml flags a <data> number without data-status', () => {
  assert.equal(hits('<p><data value="1">1</data></p>').length, 1);
  assert.deepEqual(hits('<p><data value="1" data-status="SIMULATED">1</data></p>'), []);
});

test('scanDist on the real dist is clean', (t) => {
  const dist = fileURLToPath(new URL('../dist/', import.meta.url));
  if (!existsSync(dist)) return t.skip('dist/ absent: run npm run build first');
  assert.deepEqual(scanDist(dist), []);
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
