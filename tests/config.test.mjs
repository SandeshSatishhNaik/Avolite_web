import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const pkg = () => JSON.parse(read('package.json'));

test('.node-version is 24', () => {
  assert.equal(read('.node-version').trim(), '24');
});

test('astro pinned exactly, typescript ^6', () => {
  const p = pkg();
  assert.equal(p.dependencies.astro, '7.3.5');
  assert.ok(p.devDependencies.typescript.startsWith('^6'));
});

test('package.json type, engines, scripts', () => {
  const p = pkg();
  assert.equal(p.type, 'module');
  assert.equal(p.engines.node, '>=22.18.0');
  for (const s of ['dev', 'build', 'preview', 'check', 'test', 'test:e2e']) {
    assert.ok(p.scripts[s], `missing script ${s}`);
  }
});

test('no banned dependencies', () => {
  const p = pkg();
  const names = Object.keys({ ...p.dependencies, ...p.devDependencies });
  for (const n of names) assert.ok(!/fontsource|tailwind|gsap|lenis/.test(n), `banned dep ${n}`);
});

test('lockfile, .gitattributes, .gitignore', () => {
  assert.ok(existsSync(new URL('package-lock.json', root)));
  assert.ok(read('.gitattributes').includes('eol=lf'));
  const lines = read('.gitignore').split(/\r?\n/).map((l) => l.trim());
  for (const n of ['node_modules', 'dist', '.astro', 'test-results', 'playwright-report', 'graphify-out']) {
    assert.ok(lines.includes(n), `.gitignore missing ${n}`);
  }
  for (const n of ['logo.svg', 'CLAUDE.md', '.planning', '.claude']) {
    assert.ok(!lines.some((l) => l === n || l === `/${n}` || l === `${n}/`), `.gitignore must not list ${n}`);
  }
});

test('astro.config.mjs fonts and output', () => {
  const c = read('astro.config.mjs');
  for (const s of [
    'fontProviders.google', 'Archivo', 'IBM Plex Sans', 'IBM Plex Mono',
    '--font-display', '--font-body', '--font-mono', 'glyphs', "output: 'static'",
  ]) {
    assert.ok(c.includes(s), `astro.config.mjs missing ${s}`);
  }
});

test('public/_headers caches /_astro immutable', () => {
  const h = read('public/_headers');
  assert.ok(h.includes('/_astro/*'));
  assert.ok(h.includes('immutable'));
});
