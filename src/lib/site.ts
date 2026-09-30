// Single source for nav, mobile menu and section ids. Ids are linked from later phases; do not rename casually.
export const SECTIONS = [
  { id: 'problem', n: '01', title: 'The problem', short: 'Problem', subtitle: 'What PS 26055 asks for' },
  { id: 'how', n: '02', title: 'How it works', short: 'How', subtitle: 'The closed loop, stage by stage' },
  { id: 'built', n: '03', title: 'What we built', short: 'Built', subtitle: 'The simulated radar testbed' },
  { id: 'new', n: '04', title: "What's new", short: 'New', subtitle: 'Two decisions, designed' },
  { id: 'demo', n: '05', title: 'Demo', short: 'Demo', subtitle: 'Watch and explore' },
  { id: 'security', n: '06', title: 'Security', short: 'Security', subtitle: 'Layered safeguards, by design' },
  { id: 'roadmap', n: '07', title: 'Roadmap', short: 'Roadmap', subtitle: 'From simulation to hardware' },
  { id: 'why', n: '08', title: 'Why AVOLITE', short: 'Why', subtitle: 'The case for adaptive scanning' },
] as const;

export type Section = (typeof SECTIONS)[number];
