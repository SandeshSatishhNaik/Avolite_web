// Output-wording lint over built HTML (DATA-07, DATA-02 second layer). Pure functions so tests can feed fixtures.
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BLOCK = new Set(['p', 'li', 'tr', 'td', 'th', 'dd', 'dt', 'figcaption', 'caption', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'section', 'article', 'header', 'footer', 'figure', 'ul', 'ol', 'table', 'summary', 'details']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
// A tag whose quoted attribute values may contain `>`.
const TAG = /<(\/?)([a-z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;
// Quote-agnostic: data-status="BUILT", data-status='BUILT' and data-status=BUILT.
const STATUS_ATTR = /(?<![\w-])data-status\s*=\s*["']?(?:BUILT|SIMULATED)(?![\w-])/i;
const CLAIM_ATTR = /(?<![\w-])data-claim(?![\w-])/;

// CR-02: the text a status tag makes a claim about is scoped by container, not by inline run.
// Components that put claim text and a tag in different blocks (Metric, Figure, ResultTable) wrap both in
// an element with `data-claim`. Any other BUILT/SIMULATED tag is scoped to its nearest block ancestor.
function claimScopes(body) {
  const clean = body.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ');
  const scopes = new Set();
  const stack = [];
  const done = (el, end) => {
    if (el.claim || el.scope) scopes.add(clean.slice(el.start, end));
  };
  for (const m of clean.matchAll(TAG)) {
    const name = m[2].toLowerCase();
    if (m[1]) {
      const i = stack.findLastIndex((e) => e.name === name);
      if (i === -1) continue;
      for (const el of stack.splice(i).reverse()) done(el, m.index + m[0].length);
      continue;
    }
    if (VOID.has(name) || m[3].trimEnd().endsWith('/')) continue;
    const el = { name, start: m.index, claim: CLAIM_ATTR.test(m[3]), scope: false };
    stack.push(el);
    if (STATUS_ATTR.test(m[3]) && !stack.some((e) => e.claim)) {
      const target = stack.findLast((e) => BLOCK.has(e.name)) ?? stack.at(-2) ?? el;
      target.scope = true;
    }
  }
  for (const el of stack) done(el, clean.length);
  return [...scopes];
}

// User-visible text: script/style removed; tags stripped except alt/title/aria-label values and the meta description.
const ATTR = /(?<![\w-])(?:alt|title|aria-label)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const META_DESC = /<meta\b(?=[^>]*\bname\s*=\s*["']description["'])[^>]*\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>/i;
const text = (html) =>
  html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, (tag) => {
      const desc = tag.match(META_DESC);
      if (desc) return ` ${desc[1] ?? desc[2]} `;
      const vals = [...tag.matchAll(ATTR)].map((m) => m[1] ?? m[2]);
      return ` ${vals.join(' ')} `;
    })
    .replace(/&#(x[0-9a-f]+|\d+);?/gi, (_, encoded) => {
      const value = encoded[0].toLowerCase() === 'x' ? parseInt(encoded.slice(1), 16) : Number(encoded);
      return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : '\uFFFD';
    })
    .replace(/&(nbsp|Tab|NewLine|amp|lt|gt|quot|apos);/g, (_, name) => ({nbsp:' ',Tab:'\t',NewLine:'\n',amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"})[name]);

const RULES = [
  [/\blive\b/i, '"Live"'],
  [/\breal[\s-]?time\b/i, '"real-time"'],
  [/\b(?:TODO|TBD|FIXME|XXX)\b|\blorem\b/i, 'placeholder text'],
];
const AI_WORD = /\b(?:AI|ML)\b/i;
const AI_PHRASE = /\b(?:machine learning|neural|trained|learns?)\b/i;

export function lintHtml(html, file = 'html') {
  const hits = [];
  const all = text(html);
  for (const [re, name] of RULES) if (re.test(all)) hits.push(`${file}: banned wording ${name}`);
  const start = html.indexOf('<body');
  const body = html.slice(start === -1 ? 0 : start);
  for (const scope of claimScopes(body)) {
    if (!STATUS_ATTR.test(scope)) continue;
    const t = text(scope);
    if (AI_WORD.test(t) || AI_PHRASE.test(t)) hits.push(`${file}: AI/ML next to BUILT/SIMULATED: ${t.replace(/\s+/g, ' ').trim().slice(0, 80)}`);
  }
  for (const m of body.matchAll(/<data(?=[\s>])[^>]*>/gi)) {
    const status = m[0].match(/\sdata-status\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    if (!status || !['BUILT','SIMULATED','PROTOTYPE','DESIGNED','PLANNED','ILLUSTRATIVE'].includes(status[1] ?? status[2] ?? status[3])) hits.push(`${file}: number without valid status: ${m[0].slice(0, 60)}`);
  }
  return hits;
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export function scanDist(dir) {
  const root = typeof dir === 'string' ? dir : fileURLToPath(dir);
  return walk(root).flatMap((f) => lintHtml(readFileSync(f, 'utf8'), f));
}

export function lintOutput(dir) {
  const hits = scanDist(dir);
  if (hits.length) throw new Error(`Honesty lint failed (${hits.length}):\n` + hits.map((h) => '  ' + h).join('\n'));
}

// IMG-03: Vite emits every PNG the image registry can reach, but Astro deletes an original only after optimising it,
// so originals no page renders would stay in dist. Drop PNGs in the assets dir that no built text file references.
// Every file except binary media (images, fonts, video) counts as a reference: html, css, js, json, xml, svg, webmanifest, txt.
const BINARY = /\.(?:png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|eot|mp4|webm)$/i;
export function pruneUnusedPng(distDir, assetsDir = '_astro') {
  const assets = join(distDir, assetsDir);
  if (!existsSync(assets)) return;
  const pending = new Set(readdirSync(assets).filter((f) => f.toLowerCase().endsWith('.png')));
  for (const f of readdirSync(distDir, { recursive: true })) {
    if (!pending.size) break;
    const p = join(distDir, String(f));
    if (BINARY.test(p) || !statSync(p).isFile()) continue;
    const txt = readFileSync(p, 'utf8');
    for (const png of pending) if (txt.includes(png)) pending.delete(png);
  }
  for (const png of pending) rmSync(join(assets, png));
}
