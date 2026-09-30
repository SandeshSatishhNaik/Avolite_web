import { defineConfig, fontProviders } from 'astro/config';
import { verifyRaw } from './scripts/ingest.mjs';
import { lintOutput } from './scripts/honesty.mjs';

// Archivo is display/readout only: Basic Latin + a few marks is enough.
// Without this subset the file is ~90 KB and total fonts are ~140 KB (> 130 KB budget).
const DISPLAY_GLYPHS = [...' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz·—–’“”°±×'];

// `||` (not `??`) so an empty SITE_URL falls through to the next source.
const PLACEHOLDER_SITE = 'https://avolite.example';
const site = process.env.SITE_URL || process.env.CF_PAGES_URL || PLACEHOLDER_SITE;
if (site === PLACEHOLDER_SITE) console.warn('[astro.config] SITE_URL not set: canonical uses the placeholder ' + PLACEHOLDER_SITE);

// Honesty gates: each throw fails `astro build` (exit 1).
const honesty = {
  name: 'honesty',
  hooks: {
    // DATA-01: pinned CSV hash + results.json re-ingest equality.
    'astro:config:setup': () => verifyRaw(),
    // DATA-03..06: zod rules run even for pages that do not import data.ts.
    'astro:build:start': async () => {
      await import('./src/lib/data.ts');
    },
    // DATA-07 / DATA-02: banned wording and untagged <data> numbers in the built HTML.
    'astro:build:done': ({ dir }) => lintOutput(dir),
  },
};

export default defineConfig({
  output: 'static',
  site,
  integrations: [honesty],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Archivo',
      cssVariable: '--font-display',
      weights: ['500 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
      options: { experimental: { variableAxis: { wdth: [['100', '125']] }, glyphs: DISPLAY_GLYPHS } },
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-body',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],
});
