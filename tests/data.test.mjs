import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
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
