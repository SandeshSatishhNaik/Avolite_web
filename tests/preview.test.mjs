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
