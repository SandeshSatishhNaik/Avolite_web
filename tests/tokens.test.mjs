import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const tokensPath = join(root, 'src', 'styles', 'tokens.css');

const REQUIRED = [
  '--bg-0', '--bg-1', '--bg-2', '--bg-3', '--line', '--line-strong',
  '--text-1', '--text-2', '--text-3', '--signal', '--signal-dim', '--khaki', '--error',
  '--st-built', '--st-simulated', '--st-prototype', '--st-designed', '--st-planned', '--st-illustrative',
  '--brand-khaki', '--brand-green',
  '--ff-display', '--ff-body', '--ff-mono',
  '--fs-display', '--fs-h2', '--fs-h3', '--fs-lead', '--fs-body', '--fs-small', '--fs-label',
  '--fs-readout-xl', '--fs-readout-m',
  '--lh-display', '--lh-h2', '--lh-h3', '--lh-lead', '--lh-body', '--lh-small', '--lh-label', '--lh-readout',
  '--tracking-label',
  ...Array.from({ length: 11 }, (_, i) => `--sp-${i + 1}`),
  '--r-panel', '--r-chip', '--header-h', '--frame', '--margin',
  '--dur-instant', '--dur-fast', '--dur-base', '--dur-slow', '--dur-stage',
  '--ease-out', '--ease-inout', '--ease-linear', '--sweep-period', '--ping',
];

// Returns offending snippets in `text` (comments stripped, theme-color line exempt).
function scan(text) {
  const clean = text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1')
    .replace(/href\s*=\s*(["'])#[^"']*\1/g, '') // in-page anchors and sprite refs
    .replace(/url\(\s*["']?#[^)]*\)/g, '') // url(#id) paint references
    .split(/\r?\n/)
    .filter((l) => !l.includes('name="theme-color"'))
    .join('\n');
  const hits = [];
  for (const m of clean.matchAll(/(?<=[:(,\s"'])#([0-9a-fA-F]+)(?![\w-])/g)) {
    if ([3, 4, 6, 8].includes(m[1].length)) hits.push(m[0]);
  }
  for (const m of clean.matchAll(/\b(?:rgba?|hsla?)\(/g)) hits.push(m[0]);
  for (const m of clean.matchAll(/font-family\s*:\s*(?!\s|var\()[^;}\n]*/g)) hits.push(m[0]);
  return hits;
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(astro|css|ts)$/.test(name)) out.push(p);
  }
  return out;
}

test('tokens.css defines every required token', () => {
  assert.ok(existsSync(tokensPath), 'src/styles/tokens.css missing');
  const css = readFileSync(tokensPath, 'utf8');
  for (const name of REQUIRED) {
    assert.ok(new RegExp(`${name}\\s*:`).test(css), `tokens.css missing ${name}`);
  }
  assert.ok(css.includes('color-scheme: dark'));
});

test('no color or font-family literals outside tokens.css', () => {
  const bad = [];
  for (const f of walk(join(root, 'src'))) {
    if (f === tokensPath) continue;
    const hits = scan(readFileSync(f, 'utf8'));
    if (hits.length) bad.push(`${relative(root, f).split(sep).join('/')}: ${hits.join(', ')}`);
  }
  assert.deepEqual(bad, []);
});

test('lint self-check: scanner flags literals and ignores exemptions', () => {
  assert.ok(scan('a { color: #ff00aa; }').length > 0);
  assert.ok(scan('a { color: rgb(1,2,3); }').length > 0);
  assert.ok(scan('a { font-family: Arial, sans-serif; }').length > 0);
  assert.equal(scan('a { font-family: var(--ff-body); color: var(--text-1); }').length, 0);
  assert.equal(scan('<meta name="theme-color" content="#050B16" />').length, 0);
  assert.ok(scan('<path fill="#ff0000"/>').length > 0);
  assert.ok(scan("<path stroke='#abc'/>").length > 0);
  assert.equal(scan('<a href="#dead">x</a> <path fill="url(#beef)" filter="url(#fade)"/>').length, 0);
  assert.equal(scan('<a href="#built">x</a> <use href="#lg-mark" /> /* #ff0000 */').length, 0);
});
