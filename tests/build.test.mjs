import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { SECTIONS } from '../src/lib/site.ts';

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

// ---- Page structure (plan 01-03 task 1) ----
const body = html.replace(/&#39;/g, "'");
const sectionTags = [...body.matchAll(/<section\b[^>]*>/g)].map((m) => m[0]);
const spySections = sectionTags.filter((t) => t.includes('data-section'));
const attr = (tag, name) => tag.match(new RegExp("[ ]" + name + "=\"([^\"]*)\""))?.[1];

test('exactly 8 data-section sections in SECTIONS order', () => {
  assert.equal(spySections.length, 8);
  assert.deepEqual(spySections.map((t) => attr(t, 'id')), SECTIONS.map((s) => s.id));
});

test('each section has an h2 numbered 01-08', () => {
  for (const s of SECTIONS) {
    const re = new RegExp(`<h2[^>]*id="${s.id}-h"[^>]*>[ ]*<span[^>]*>${s.n}</span>[ ]*${s.title}`);
    assert.match(body, re, `h2 for ${s.id}`);
  }
});

test('hero is #top with no data-section', () => {
  const hero = sectionTags.find((t) => attr(t, 'id') === 'top');
  assert.ok(hero, 'no #top section');
  assert.ok(!hero.includes('data-section'));
});

test('skip link is the first anchor and main is a focus target', () => {
  const firstA = body.slice(body.indexOf('<body')).match(/<a\b[^>]*>/)[0];
  assert.match(firstA, /class="skip"/);
  assert.match(firstA, /href="#main"/);
  assert.match(body, /<main id="main" tabindex="-1"/);
});

// ---- Header, menu, budgets (plan 01-03 task 2) ----
const navLinks = (navOpen) => {
  const i = body.indexOf(navOpen);
  assert.ok(i >= 0, `${navOpen} missing`);
  const block = body.slice(i, body.indexOf('</nav>', i));
  return [...block.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
};

test('header nav lists 8 section links in order', () => {
  const links = navLinks('<nav class="site-nav" aria-label="Sections"');
  assert.deepEqual(links.map((t) => attr(t, 'href')), SECTIONS.map((s) => `#${s.id}`));
});

test('mobile dialog lists 8 links with SECTIONS subtitles', () => {
  const d = body.indexOf('<dialog id="menu"');
  assert.ok(d >= 0, 'no dialog#menu');
  assert.match(body.slice(d, d + 200), /aria-label="[^"]+"/);
  const links = navLinks('<nav aria-label="Sections menu"');
  assert.deepEqual(links.map((t) => attr(t, 'href')), SECTIONS.map((s) => `#${s.id}`));
  const dialog = body.slice(d, body.indexOf('</dialog>', d));
  const smalls = [...dialog.matchAll(/<small>([^<]*)<\/small>/g)].map((m) => m[1]);
  assert.deepEqual(smalls, SECTIONS.map((s) => s.subtitle));
});

test('brand link and Menu button are wired', () => {
  const brand = body.match(/<a[^>]*class="brand"[^>]*>/)?.[0] ?? '';
  assert.equal(attr(brand, 'href'), '#top');
  assert.equal(attr(brand, 'aria-label'), 'AVOLITE home');
  const btn = body.match(/<button\b[^>]*data-menu-open[^>]*>/)?.[0] ?? '';
  assert.match(btn, /command="show-modal"/);
  assert.match(btn, /commandfor="menu"/);
});

test('a module script is emitted', () => {
  assert.match(body, /<script\b[^>]*type="module"/);
});

test('CSS gzip within 25 KB; JS gzip within 70 KB and Phase 1 cap 10 KB', () => {
  const gz = (list) => list.reduce((n, f) => n + gzipSync(readFileSync(f)).length, 0);
  const css = gz(files.filter((f) => f.endsWith('.css')));
  const inline = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce((n, m) => n + gzipSync(m[1]).length, 0);
  assert.ok(css + inline <= 25 * 1024, `css ${css + inline} B`);
  const js = gz(files.filter((f) => f.endsWith('.js')));
  assert.ok(js <= 70 * 1024, `js ${js} B`);
  assert.ok(js <= 10 * 1024, `js ${js} B exceeds Phase 1 sanity cap`);
});
