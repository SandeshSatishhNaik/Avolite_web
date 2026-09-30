import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requireTagged } from '../src/lib/data.ts';

// ---- DATA-02: requireTagged shape check ----
const ok = { value: 1, unit: 'm', status: 'SIMULATED', label: 'x', source: 'y' };

test('requireTagged returns the same object for a complete value', () => {
  assert.equal(requireTagged(ok, 'w'), ok);
});

test('requireTagged throws for each missing field', () => {
  assert.throws(() => requireTagged({ value: 1, unit: 'm' }, 'w'), /status/);
  assert.throws(() => requireTagged({ ...ok, unit: '' }, 'w'), /unit/);
  const { unit, ...noUnit } = ok;
  assert.throws(() => requireTagged(noUnit, 'w'), /unit/);
  assert.throws(() => requireTagged({ ...ok, source: '' }, 'w'), /source/);
  assert.throws(() => requireTagged({ ...ok, label: '' }, 'w'), /label/);
  assert.throws(() => requireTagged({ ...ok, status: 'LIVE' }, 'w'), /unknown status/);
});
