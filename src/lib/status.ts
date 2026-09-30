// Six-tier status vocabulary. Erasable TS only: node --test imports this file directly.
export const STATUS_IDS = ['BUILT', 'SIMULATED', 'PROTOTYPE', 'DESIGNED', 'PLANNED', 'ILLUSTRATIVE'] as const;
export type Status = (typeof STATUS_IDS)[number];

type Glyph = 'square' | 'circle' | 'half-circle' | 'ring' | 'dashed-ring' | 'hatched-square';
type Entry = { label: string; definition: string; glyph: Glyph; border: 'solid' | 'dashed'; token: string };

export const STATUS: Record<Status, Entry> = {
  BUILT: { label: 'BUILT', definition: 'Runs in the repository today.', glyph: 'square', border: 'solid', token: '--st-built' },
  SIMULATED: { label: 'SIMULATED', definition: 'Produced by the MATLAB model on synthetic signals.', glyph: 'circle', border: 'solid', token: '--st-simulated' },
  PROTOTYPE: { label: 'PROTOTYPE', definition: 'Runs, but rule-based or on demo data.', glyph: 'half-circle', border: 'solid', token: '--st-prototype' },
  DESIGNED: { label: 'DESIGNED', definition: 'Architecture documented; not yet implemented.', glyph: 'ring', border: 'solid', token: '--st-designed' },
  PLANNED: { label: 'PLANNED', definition: 'On the roadmap; not yet designed in detail.', glyph: 'dashed-ring', border: 'dashed', token: '--st-planned' },
  ILLUSTRATIVE: { label: 'ILLUSTRATIVE', definition: 'An example to explain an idea; not a result.', glyph: 'hatched-square', border: 'dashed', token: '--st-illustrative' },
};
