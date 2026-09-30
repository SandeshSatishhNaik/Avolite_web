import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const JSON_PATH = 'src/lib/logo.generated.json';
const FAV_PATH = 'public/favicon.svg';
const jsonText = readFileSync(JSON_PATH, 'utf8');
const L = JSON.parse(jsonText);

test('logo json: viewBox values are pinned', () => {
  assert.deepEqual(L.viewBox, {
    lockup: '256 50 1471 671',
    mark: '443 50 1081 492',
    wordmark: '256 571 1471 150',
  });
});

test('logo json: no background path, size under 60000 bytes', () => {
  assert.ok(!jsonText.includes('#'));
  assert.ok(!/fdfdfd/i.test(jsonText));
  assert.ok(Buffer.byteLength(jsonText) < 60000);
});

test('logo json: green and khaki roles are non-empty', () => {
  for (const part of ['mark', 'wordmark']) {
    for (const role of ['green', 'khaki']) {
      assert.equal(typeof L[part][role], 'string');
      assert.ok(L[part][role].length > 0, `${part}.${role} empty`);
    }
  }
});

test('logo json: O counter merged as a hole in the wordmark', () => {
  assert.ok(L.wordmark.holed.length > 0);
  assert.ok((L.wordmark.holed.match(/M/g) ?? []).length >= 2);
});

test('logo json: committed output equals a fresh script run and is deterministic', () => {
  const dir = mkdtempSync(join(tmpdir(), 'logo-'));
  const run = (n) => {
    const j = join(dir, `${n}.json`);
    const s = join(dir, `${n}.svg`);
    execFileSync('node', ['scripts/clean-logo.mjs', 'logo.svg', j, s], { stdio: 'pipe' });
    return [readFileSync(j), readFileSync(s)];
  };
  const [j1, s1] = run('a');
  const [j2, s2] = run('b');
  assert.ok(j1.equals(j2) && s1.equals(s2));
  assert.ok(j1.equals(readFileSync(JSON_PATH)), 'logo.generated.json is stale or hand-edited');
  assert.ok(s1.equals(readFileSync(FAV_PATH)), 'favicon.svg is stale or hand-edited');
});

test('favicon: viewBox, background and both brand fills', () => {
  const f = readFileSync(FAV_PATH, 'utf8').toLowerCase();
  assert.ok(f.includes('viewbox'));
  assert.ok(f.includes('#050b16'));
  assert.ok(f.includes('#e8eef6'));
  assert.ok(f.includes('#bcac87'));
});

test('logo source: logo.svg still has its background fill', () => {
  assert.ok(readFileSync('logo.svg', 'utf8').includes('#FDFDFD'));
});
