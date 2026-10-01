// The only path for numbers onto the site. Erasable TS only (node --test imports this file):
// explicit .ts extensions, JSON via import attributes, no TS-only runtime syntax, no image or virtual-module imports.
import { z } from 'astro/zod';
import { STATUS_IDS } from './status.ts';
import type { Status } from './status.ts';
import results from '../data/results.json' with { type: 'json' };
import claims from '../../data/claims.json' with { type: 'json' };

const Source = z
  .object({ repo: z.string(), commit: z.string().length(40), path: z.string(), sha256: z.string().length(64) })
  .strict();

// DATA-03: repo data is SIMULATED or BUILT, never ILLUSTRATIVE. DATA-05: one source object (an array fails).
// DATA-04: strict, so a typed `maxRangeError` or any other derived key is rejected.
const Dataset = z
  .object({
    id: z.string().min(1),
    title: z.string(),
    scenario: z.string().min(1),
    status: z.enum(['SIMULATED', 'BUILT']),
    source: Source,
    columns: z.array(z.object({ key: z.string(), unit: z.string().nullable(), precision: z.number().int() }).strict()),
    rows: z.array(z.record(z.string(), z.number().nullable())).min(1),
    note: z.string().optional(),
  })
  .strict();

// DATA-03: the illustrative list can only hold ILLUSTRATIVE entries. `note` is internal traceability, never rendered.
const Illustrative = z
  .object({
    id: z.string().min(1),
    label: z.string(),
    value: z.number(),
    unit: z.string().min(1),
    status: z.literal('ILLUSTRATIVE'),
    from: z.string().min(1),
    note: z.string().optional(),
  })
  .strict();

type Row = Record<string, number | null>;
const allIdentical = (rows: Row[]) => rows.length > 1 && rows.every((r) => JSON.stringify(r) === JSON.stringify(rows[0]));

const PAIRS = [
  ['ExpectedRange_m', 'DetectedRange_m', 'RangeError_m'],
  ['ExpectedVelocity_mps', 'DetectedVelocity_mps', 'VelocityError_mps'],
] as const;

// CR-01: results.json (machine-ingested, pinned) and claims.json (hand-written) get separate strict schemas.
// A key in the wrong file fails parsing, so claims can never define or override `datasets` or `repo`.
const Results = z
  .object({
    repo: z.object({ slug: z.string(), commit: z.string() }).strict(),
    datasets: z.array(Dataset).min(1),
  })
  .strict();
const Claims = z
  .object({
    definitions: z.object({ snr: z.string().nullable() }).strict(),
    illustrative: z.array(Illustrative),
  })
  .strict();

// Cross-field rules over the two parsed halves (disjoint keys, so the merge cannot override anything).
const Root = z
  .object({ ...Results.shape, ...Claims.shape })
  .strict()
  .superRefine((d, ctx) => {
    const bad = (message: string) => ctx.addIssue({ code: 'custom', message });
    const ids = new Set<string>();
    const paths = new Set<string>();
    for (const ds of d.datasets) {
      if (ids.has(ds.id) || paths.has(ds.source.path)) bad(`duplicate or merged dataset ${ds.id} (DATA-05)`);
      ids.add(ds.id);
      paths.add(ds.source.path);
      // DATA-04: error must equal detected minus expected (verified on the CSV, residual under 5e-14).
      for (const [e, det, err] of PAIRS)
        for (const r of ds.rows) {
          const ev = r[e];
          const dv = r[det];
          const rv = r[err];
          if (ev != null && dv != null && rv != null && Math.abs(dv - ev - rv) > 1e-9) bad(`${ds.id}: ${err} != ${det} - ${e} (DATA-04)`);
        }
      if (allIdentical(ds.rows) && !ds.note) bad(`${ds.id}: identical rows need a note (DATA-06)`);
      if (/\/SNR_Sweep\//i.test(ds.source.path) && d.definitions.snr === null) bad(`${ds.id}: SNR sweep needs definitions.snr (DATA-06)`);
    }
  });

export function validate(rawResults: unknown, rawClaims: unknown) {
  return Root.parse({ ...Results.parse(rawResults), ...Claims.parse(rawClaims) });
}

// Module load throws on any rule violation, which fails `astro build` for any page that imports this.
export const data = validate(results, claims);

export type Dataset = (typeof data)['datasets'][number];
type Column = Dataset['columns'][number];

export function dataset(id: string): Dataset {
  const ds = data.datasets.find((d) => d.id === id);
  if (!ds) throw new Error(`unknown dataset: ${id}`);
  return ds;
}

// ---- DATA-02: a number carries value, unit, status, label and source ----
export type Tagged = { value: number; unit: string; status: Status; label: string; source: string; precision?: number };

export function requireTagged(t: Partial<Tagged>, where: string): Tagged {
  for (const k of ['value', 'unit', 'status', 'label', 'source'] as const) {
    const v = t[k] as unknown;
    if (v === undefined || v === null || v === '') throw new Error(`${where}: number rendered without ${k} (DATA-02)`);
  }
  if (typeof t.value !== 'number' || !Number.isFinite(t.value)) throw new Error(`${where}: value is not a finite number (DATA-02)`);
  if (!STATUS_IDS.includes(t.status as Status)) throw new Error(`${where}: unknown status ${String(t.status)}`);
  return t as Tagged;
}

// Origin registry: only metric(), illustrative() and cell() add to it, so a hand-built literal
// (or a spread copy) cannot be rendered.
const ISSUED = new WeakSet<object>();
const issue = (t: Tagged, where: string): Tagged => {
  requireTagged(t, where);
  ISSUED.add(t);
  return t;
};

export function requireIssued(t: Tagged | undefined, where: string): Tagged {
  const ok = requireTagged((t ?? {}) as Partial<Tagged>, where);
  if (!ISSUED.has(ok)) throw new Error(`${where}: value was not issued by data.ts (hand-built literal, DATA-02)`);
  return ok;
}

// ---- DATA-04: derived values are computed, never typed ----
const stats = (xs: number[]) => ({ max: Math.max(...xs), mean: xs.reduce((a, b) => a + b, 0) / xs.length });

export function derive(id: string) {
  const ds = dataset(id);
  const keys = new Set(ds.columns.map((c) => c.key));
  for (const k of ['DetectedRange_m', 'DetectedVelocity_mps', 'RangeError_m', 'VelocityError_mps'])
    if (!keys.has(k)) throw new Error(`${id}: column ${k} missing, cannot derive`);
  const num = (r: Row, k: string) => r[k] as number;
  const rows = ds.rows;
  const detectedRows = rows.filter((r) => Number.isFinite(r.DetectedRange_m) && Number.isFinite(r.DetectedVelocity_mps));
  const range = stats(rows.map((r) => Math.abs(num(r, 'RangeError_m'))));
  const vel = stats(rows.map((r) => Math.abs(num(r, 'VelocityError_mps'))));
  return {
    maxAbsRangeError: range.max,
    meanAbsRangeError: range.mean,
    maxAbsVelocityError: vel.max,
    meanAbsVelocityError: vel.mean,
    detected: detectedRows.length,
    total: rows.length,
  };
}

type DerivedKey = keyof ReturnType<typeof derive>;
const METRICS: Record<DerivedKey, { label: string; col: string | null }> = {
  maxAbsRangeError: { label: 'Max range error', col: 'RangeError_m' },
  meanAbsRangeError: { label: 'Mean range error', col: 'RangeError_m' },
  maxAbsVelocityError: { label: 'Max velocity error', col: 'VelocityError_mps' },
  meanAbsVelocityError: { label: 'Mean velocity error', col: 'VelocityError_mps' },
  detected: { label: 'Targets detected', col: null },
  total: { label: 'Targets in scenario', col: null },
};

export function metric(id: string, key: DerivedKey): Tagged {
  const ds = dataset(id);
  const spec = METRICS[key];
  if (!spec) throw new Error(`unknown metric: ${String(key)}`);
  const col = spec.col ? ds.columns.find((c) => c.key === spec.col) : undefined;
  if (spec.col && !col) throw new Error(`${id}: column ${spec.col} missing`);
  return issue(
    {
      value: derive(id)[key],
      unit: col ? (col.unit ?? '') : 'targets',
      status: ds.status,
      label: spec.label,
      source: ds.source.path,
      precision: col ? col.precision : 0,
    },
    `metric(${id}, ${key})`,
  );
}

export function illustrative(id: string): Tagged {
  const it = data.illustrative.find((i) => i.id === id);
  if (!it) throw new Error(`unknown illustrative value: ${id}`);
  return issue({ value: it.value, unit: it.unit, status: it.status, label: it.label, source: it.from, precision: 0 }, `illustrative(${id})`);
}

// Columns with unit null are row identifiers (e.g. Target), not measurements. ResultTable (plan 02-02) renders them
// as text labels and exempts them from requireTagged/requireIssued: they are labels, not numbers.
export function cell(datasetId: string, rowIndex: number, columnKey: string): Tagged {
  const ds = dataset(datasetId);
  const col = ds.columns.find((c) => c.key === columnKey);
  if (!col) throw new Error(`${datasetId}: unknown column ${columnKey}`);
  if (col.unit === null) throw new Error(`${datasetId}: ${columnKey} is an identifier column, not a measurement`);
  const row = ds.rows[rowIndex];
  if (!row) throw new Error(`${datasetId}: no row ${rowIndex}`);
  const value = row[columnKey];
  if (value === null || value === undefined) throw new Error(`${datasetId}: row ${rowIndex} has no ${columnKey}`);
  return issue(
    { value, unit: col.unit, status: ds.status, label: columnLabel(col), source: ds.source.path, precision: col.precision },
    `cell(${datasetId}, ${rowIndex}, ${columnKey})`,
  );
}

// ---- DATA-06: identical rows (Monte Carlo style) are never a distribution ----
export function assertChartable(ds: { id?: string; rows: Row[] }): void {
  if (allIdentical(ds.rows)) throw new Error(`${ds.id ?? 'dataset'}: identical rows cannot be charted as a distribution (DATA-06)`);
}

export function chartRows(id: string): Row[] {
  const ds = dataset(id);
  assertChartable(ds);
  return ds.rows;
}

// ---- display helpers ----
export function fmt(value: number, precision: number): string {
  const s = value.toFixed(precision);
  if (Number(s) === 0) return s.replace('-', '');
  return s.replace(/^-/, '−');
}

export function columnLabel(col: Pick<Column, 'key' | 'unit'>): string {
  const words = col.key
    .replace(/_(?:m|mps)$/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((w, i) => (i === 0 ? w : w.toLowerCase()));
  const base = words.join(' ');
  return col.unit === null ? base : `${base} (${col.unit})`;
}
