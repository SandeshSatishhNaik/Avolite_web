// Pinned-hash CSV ingest. `node scripts/ingest.mjs` (npm run data:ingest) writes src/data/results.json.
// Never store derived values here: data.ts computes them (DATA-04).
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DEFAULT_RAW = join(ROOT, 'data', 'raw');
const DEFAULT_RESULTS = join(ROOT, 'src', 'data', 'results.json');

export const REPO = { slug: 'abhishekpj0902-apj/AVOLITE', commit: '9b985ca7f8ef99000724f8ce870918a40d0d95c8' };

// The sha256 is the pin: sha256 of the upstream file with LF endings. It is the only place a pin changes.
export const MANIFEST = [
  {
    id: 'cfar-a',
    path: '04_MATLAB/DSP/SARRS_Results/CFAR_Performance/CFAR_Performance_Table.csv',
    sha256: '3cccc3c2361ddee56be163798cd461e02c0653a5d2901097d82d32e32ab51d6b',
    status: 'SIMULATED',
    title: 'CFAR five-target detection',
    scenario: 'Five synthetic targets at 25–145 m, SARRS radar-echo testbed',
    columns: {
      Target: [null, 0],
      ExpectedRange_m: ['m', 1],
      DetectedRange_m: ['m', 1],
      RangeError_m: ['m', 1],
      ExpectedVelocity_mps: ['m/s', 3],
      DetectedVelocity_mps: ['m/s', 3],
      VelocityError_mps: ['m/s', 3],
    },
  },
];

export function ingest(rawDir = DEFAULT_RAW, manifest = MANIFEST) {
  return {
    repo: REPO,
    datasets: manifest.map((m) => {
      // Normalise CRLF before hashing: Windows checkouts differ from the LF upstream bytes.
      const text = readFileSync(join(rawDir, m.path), 'utf8').replace(/\r\n/g, '\n');
      const sha = createHash('sha256').update(text).digest('hex');
      if (sha !== m.sha256) throw new Error(`${m.path}: sha256 ${sha} != pinned ${m.sha256} (CSV edited?)`);
      const [head, ...lines] = text.trim().split('\n');
      const keys = head.split(',');
      const rows = lines.map((l) =>
        Object.fromEntries(
          l.split(',').map((v, i) => {
            const n = v === '' ? null : Number(v);
            if (n !== null && !Number.isFinite(n)) throw new Error(`${m.path}: non-numeric cell "${v}"`);
            return [keys[i], n];
          }),
        ),
      );
      const identical = rows.length > 1 && rows.every((r) => JSON.stringify(r) === JSON.stringify(rows[0]));
      return {
        id: m.id,
        title: m.title,
        status: m.status,
        scenario: m.scenario,
        source: { repo: REPO.slug, commit: REPO.commit, path: m.path, sha256: sha },
        columns: keys.map((k) => ({ key: k, unit: m.columns[k]?.[0] ?? null, precision: m.columns[k]?.[1] ?? 3 })),
        rows,
        ...(identical ? { note: `All ${rows.length} rows are identical` } : {}),
      };
    }),
  };
}

const serialise = (obj) => JSON.stringify(obj, null, 2) + '\n';

export function verifyRaw(rawDir = DEFAULT_RAW, resultsPath = DEFAULT_RESULTS) {
  const committed = readFileSync(resultsPath, 'utf8').replace(/\r\n/g, '\n');
  if (serialise(ingest(rawDir)) !== committed) {
    throw new Error('src/data/results.json is stale or hand-edited: run npm run data:ingest');
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  mkdirSync(dirname(DEFAULT_RESULTS), { recursive: true });
  writeFileSync(DEFAULT_RESULTS, serialise(ingest()));
}
