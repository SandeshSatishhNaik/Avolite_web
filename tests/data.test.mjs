import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REPO as INGEST_REPO, MANIFEST, ingest, verifyRaw } from '../scripts/ingest.mjs';
import { STATUS, STATUS_IDS } from '../src/lib/status.ts';
import { REPO } from '../src/lib/site.ts';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const RAW = join(ROOT, 'data', 'raw');
const CSV = MANIFEST[0].path;

function tmpRaw() {
  const dir = mkdtempSync(join(tmpdir(), 'avl-raw-'));
  cpSync(RAW, dir, { recursive: true });
  return dir;
}

// ---- Task 1: pinned ingest (DATA-01, DATA-05) ----

test('pin literals are fixed in the test, not derived from the manifest', () => {
  assert.equal(MANIFEST[0].sha256, '3cccc3c2361ddee56be163798cd461e02c0653a5d2901097d82d32e32ab51d6b');
  assert.equal(INGEST_REPO.commit, '9b985ca7f8ef99000724f8ce870918a40d0d95c8');
});

test('ingest() real data gives dataset cfar-a', () => {
  const out = ingest();
  assert.equal(out.datasets.length, 1);
  const ds = out.datasets[0];
  assert.equal(ds.id, 'cfar-a');
  assert.equal(ds.status, 'SIMULATED');
  assert.equal(ds.rows.length, 5);
  assert.deepEqual(ds.columns.map((c) => c.key), ['Target', 'ExpectedRange_m', 'DetectedRange_m', 'RangeError_m', 'ExpectedVelocity_mps', 'DetectedVelocity_mps', 'VelocityError_mps']);
  assert.deepEqual(ds.columns.map((c) => c.unit), [null, 'm', 'm', 'm', 'm/s', 'm/s', 'm/s']);
  assert.deepEqual(ds.columns.map((c) => c.precision), [0, 1, 1, 1, 3, 3, 3]);
  assert.equal('note' in ds, false);
});

test('one edited byte in the CSV throws /pinned/', () => {
  const dir = tmpRaw();
  const f = join(dir, CSV);
  const txt = readFileSync(f, 'utf8');
  assert.ok(txt.includes('25.5'));
  writeFileSync(f, txt.replace('25.5', '25.6'));
  assert.throws(() => ingest(dir), /pinned/);
});

test('CRLF copy of the true CSV still ingests and equals the real output', () => {
  const dir = tmpRaw();
  const f = join(dir, CSV);
  writeFileSync(f, readFileSync(f, 'utf8').replace(/\r?\n/g, '\r\n'));
  assert.deepEqual(ingest(dir), ingest());
});

test('verifyRaw passes on the repo; stale or hand-edited results fail', () => {
  verifyRaw();
  const good = JSON.parse(readFileSync(join(ROOT, 'src/data/results.json'), 'utf8'));
  const dir = mkdtempSync(join(tmpdir(), 'avl-res-'));

  const extra = structuredClone(good);
  extra.datasets[0].rows.push({ ...extra.datasets[0].rows[0] });
  const p1 = join(dir, 'extra.json');
  writeFileSync(p1, JSON.stringify(extra, null, 2) + '\n');
  assert.throws(() => verifyRaw(RAW, p1), /stale|hand-edited/);

  const edited = structuredClone(good);
  edited.datasets[0].rows[0].DetectedRange_m = 26;
  const p2 = join(dir, 'edited.json');
  writeFileSync(p2, JSON.stringify(edited, null, 2) + '\n');
  assert.throws(() => verifyRaw(RAW, p2), /stale|hand-edited/);
});

test('site.ts REPO matches ingest REPO and builds blob urls', () => {
  assert.equal(REPO.slug, INGEST_REPO.slug);
  assert.equal(REPO.commit, INGEST_REPO.commit);
  assert.equal(REPO.blob('a/b.png'), 'https://github.com/abhishekpj0902-apj/AVOLITE/blob/9b985ca7f8ef99000724f8ce870918a40d0d95c8/a/b.png');
});

test('STATUS vocabulary: six tiers in order, distinct glyphs, dashed only for PLANNED/ILLUSTRATIVE', () => {
  assert.deepEqual([...STATUS_IDS], ['BUILT', 'SIMULATED', 'PROTOTYPE', 'DESIGNED', 'PLANNED', 'ILLUSTRATIVE']);
  const glyphs = new Set();
  for (const id of STATUS_IDS) {
    const s = STATUS[id];
    assert.ok(s.label && s.definition, id);
    assert.doesNotMatch(s.definition, /\blive\b/i);
    glyphs.add(s.glyph);
    assert.equal(s.border === 'dashed', id === 'PLANNED' || id === 'ILLUSTRATIVE', id);
    assert.equal(s.token, '--st-' + id.toLowerCase());
  }
  assert.equal(glyphs.size, 6);
});

// ---- Task 2: schema, honesty rules, derived values (DATA-02..06) ----
import results from '../src/data/results.json' with { type: 'json' };
import claims from '../data/claims.json' with { type: 'json' };
import { validate, derive, metric, illustrative, cell, chartRows, assertChartable, fmt, columnLabel, requireTagged, requireIssued, dataset } from '../src/lib/data.ts';

const fresh = () => structuredClone({ ...results, ...claims });
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test('validate accepts the real inputs', () => {
  assert.doesNotThrow(() => validate(fresh()));
});

test('DATA-03: tier rules', () => {
  const a = fresh();
  a.datasets[0].status = 'ILLUSTRATIVE';
  assert.throws(() => validate(a));
  const b = fresh();
  b.illustrative[0].status = 'SIMULATED';
  assert.throws(() => validate(b));
});

test('DATA-04: derived values are computed and cannot be typed or tampered', () => {
  const d = derive('cfar-a');
  assert.equal(d.detected, 5);
  assert.equal(d.total, 5);
  close(d.maxAbsRangeError, 0.5);
  close(d.meanAbsRangeError, 0.4);
  close(d.maxAbsVelocityError, 0.165381493506491);
  close(d.meanAbsVelocityError, 0.0995941558441563);
  const a = fresh();
  a.datasets[0].maxRangeError = 0.5;
  assert.throws(() => validate(a));
  const b = fresh();
  b.datasets[0].rows[0].RangeError_m = 0.9;
  assert.throws(() => validate(b), /RangeError_m/);
});

test('DATA-05: no merging, single source, scenario required', () => {
  const a = fresh();
  a.datasets[0].source = [a.datasets[0].source, a.datasets[0].source];
  assert.throws(() => validate(a));
  const b = fresh();
  b.datasets.push(structuredClone(b.datasets[0]));
  assert.throws(() => validate(b), /duplicate/);
  const c = fresh();
  const second = structuredClone(c.datasets[0]);
  second.id = 'other';
  c.datasets.push(second);
  assert.throws(() => validate(c), /duplicate/);
  const d = fresh();
  d.datasets[0].scenario = '';
  assert.throws(() => validate(d));
});

test('DATA-06: identical rows and SNR sweep', () => {
  const a = fresh();
  const row = a.datasets[0].rows[0];
  a.datasets[0].rows = [row, { ...row }, { ...row }];
  assert.throws(() => validate(a), /identical/);
  a.datasets[0].note = 'All 3 rows are identical';
  assert.doesNotThrow(() => validate(a));
  // a noted identical-row dataset cannot be charted
  assert.throws(() => assertChartable(a.datasets[0]), /identical|distribution/);
  assert.equal(chartRows('cfar-a').length, 5);

  const s = fresh();
  s.datasets[0].source.path = '04_MATLAB/DSP/SNR_Sweep/x.csv';
  assert.throws(() => validate(s), /SNR/);
  s.definitions.snr = 'SNR is defined as ...';
  assert.doesNotThrow(() => validate(s));
});

test('metric() returns fully tagged values', () => {
  const m = metric('cfar-a', 'maxAbsRangeError');
  assert.equal(m.value, derive('cfar-a').maxAbsRangeError);
  assert.equal(m.unit, 'm');
  assert.equal(m.status, 'SIMULATED');
  assert.ok(m.label);
  assert.equal(m.source, CSV);
  assert.equal(m.precision, 1);
  for (const k of ['maxAbsVelocityError', 'meanAbsVelocityError']) {
    const v = metric('cfar-a', k);
    assert.equal(v.unit, 'm/s');
    assert.equal(v.precision, 3);
  }
  for (const k of ['detected', 'total']) {
    const v = metric('cfar-a', k);
    assert.equal(v.unit, 'targets');
    assert.equal(v.precision, 0);
  }
});

test('illustrative() returns an ILLUSTRATIVE value', () => {
  const i = illustrative('env-noise-floor-example');
  assert.deepEqual(
    { value: i.value, unit: i.unit, status: i.status, precision: i.precision },
    { value: -92, unit: 'dBm', status: 'ILLUSTRATIVE', precision: 0 },
  );
  assert.equal(i.source, 'Example value from the AVOLITE design documentation — not a measurement');
  assert.doesNotMatch(i.source, /§|section/i);
  assert.throws(() => illustrative('nope'));
});

test('cell() issues a tagged measurement cell', () => {
  const c = cell('cfar-a', 0, 'DetectedRange_m');
  assert.deepEqual(
    { value: c.value, unit: c.unit, status: c.status, label: c.label, source: c.source, precision: c.precision },
    { value: 25.5, unit: 'm', status: 'SIMULATED', label: 'Detected range (m)', source: CSV, precision: 1 },
  );
  assert.throws(() => cell('cfar-a', 0, 'Target'));
  assert.throws(() => cell('cfar-a', 0, 'Nope'));
  assert.throws(() => cell('nope', 0, 'DetectedRange_m'));
  assert.equal(dataset('cfar-a').rows.length, 5);
  assert.throws(() => dataset('nope'));
});

test('origin check: requireIssued rejects hand-built literals and copies', () => {
  const lit = { value: 1, unit: 'm', status: 'SIMULATED', label: 'x', source: 'y' };
  assert.doesNotThrow(() => requireTagged(lit, 'w'));
  assert.throws(() => requireIssued(lit, 'w'), /not issued/);
  for (const t of [metric('cfar-a', 'detected'), illustrative('env-noise-floor-example'), cell('cfar-a', 1, 'RangeError_m')]) {
    assert.equal(requireIssued(t, 'w'), t);
    assert.throws(() => requireIssued({ ...t }, 'w'), /not issued/);
  }
});

test('fmt(): precision, U+2212, no negative zero', () => {
  assert.equal(fmt(-0.5, 1), '−0.5');
  assert.equal(fmt(0, 1), '0.0');
  assert.equal(fmt(-0.00001, 1), '0.0');
  assert.equal(fmt(0.0995941558441563, 3), '0.100');
  assert.equal(fmt(0.165381493506491, 3), '0.165');
});

test('columnLabel()', () => {
  assert.equal(columnLabel({ key: 'ExpectedRange_m', unit: 'm' }), 'Expected range (m)');
  assert.equal(columnLabel({ key: 'DetectedVelocity_mps', unit: 'm/s' }), 'Detected velocity (m/s)');
  assert.equal(columnLabel({ key: 'Target', unit: null }), 'Target');
});
