import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
assert.ok(existsSync(join(dist, 'index.html')), 'dist/index.html missing: run npm run build first');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(dist);
const textFiles = files.filter((f) => /\.(html|css|js|svg|json)$/.test(f));
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const htmlAndCss = textFiles
  .filter((f) => /\.(html|css)$/.test(f))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');

test('index.html has lang, viewport and canonical', () => {
  assert.ok(html.includes('<html lang="en">'));
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<link rel="canonical"/);
});

test('exactly one h1', () => {
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
});

test('exactly two font preloads', () => {
  const links = html.match(/<link\b[^>]*>/g) ?? [];
  const preloads = links.filter((l) => /rel="preload"/.test(l) && /as="font"/.test(l));
  assert.equal(preloads.length, 2);
});

test('three font families with metric-matched fallbacks', () => {
  const faces = htmlAndCss.match(/@font-face\s*\{[^}]*\}/g) ?? [];
  for (const fam of ['Archivo', 'IBM Plex Sans', 'IBM Plex Mono']) {
    assert.ok(faces.some((f) => f.includes(fam)), `no @font-face for ${fam}`);
  }
  assert.ok(faces.filter((f) => f.includes('size-adjust')).length >= 2, 'fewer than 2 size-adjust fallbacks');
});

test('no Google CDN reference in dist', () => {
  for (const f of textFiles) {
    const t = readFileSync(f, 'utf8');
    assert.ok(!t.includes('googleapis') && !t.includes('gstatic'), `CDN reference in ${f}`);
  }
});

test('self-hosted woff2 total within 130000 bytes', () => {
  const woff = files.filter((f) => f.replace(/\\/g, '/').includes('/_astro/fonts/') && f.endsWith('.woff2'));
  assert.ok(woff.length >= 3, `expected >= 3 woff2 files, got ${woff.length}`);
  const total = woff.reduce((n, f) => n + statSync(f).size, 0);
  assert.ok(total <= 130000, `woff2 total ${total} B exceeds 130000`);
});

test('_headers ships with immutable cache rule', () => {
  const p = join(dist, '_headers');
  assert.ok(existsSync(p));
  assert.ok(readFileSync(p, 'utf8').includes('immutable'));
});
