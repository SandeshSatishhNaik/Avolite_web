// Output-wording lint over built HTML (DATA-07, DATA-02 second layer). Pure functions so tests can feed fixtures.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BLOCK = /<\/?(?:p|li|tr|td|th|dd|dt|figcaption|caption|h[1-6]|div|section|article|header|footer|figure|ul|ol|table|summary|details)\b[^>]*>/gi;

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
    .replace(/&nbsp;|&#160;/g, ' ');

const RULES = [
  [/\blive\b/i, '"Live"'],
  [/\breal[\s-]?time\b/i, '"real-time"'],
  [/\b(?:TODO|TBD|FIXME|XXX)\b|\blorem\b/i, 'placeholder text'],
];
const AI_WORD = /\b(?:AI|ML)\b/;
const AI_PHRASE = /\b(?:machine learning|neural|trained|learns?)\b/i;

export function lintHtml(html, file = 'html') {
  const hits = [];
  const all = text(html);
  for (const [re, name] of RULES) if (re.test(all)) hits.push(`${file}: banned wording ${name}`);
  const start = html.indexOf('<body');
  const body = html.slice(start === -1 ? 0 : start);
  // ponytail: AI/ML scope is the inline run between block tags; claim-scoped checks arrive with Phase 3 claims.
  for (const seg of body.split(BLOCK)) {
    if (!/data-status="(?:BUILT|SIMULATED)"/.test(seg)) continue;
    const t = text(seg);
    if (AI_WORD.test(t) || AI_PHRASE.test(t)) hits.push(`${file}: AI/ML next to BUILT/SIMULATED: ${t.replace(/\s+/g, ' ').trim().slice(0, 80)}`);
  }
  for (const m of body.matchAll(/<data(?=[\s>])[^>]*>/gi)) if (!/data-status\s*=/.test(m[0])) hits.push(`${file}: number without status: ${m[0].slice(0, 60)}`);
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
