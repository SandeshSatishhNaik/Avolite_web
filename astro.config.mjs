import { defineConfig, fontProviders } from 'astro/config';

// Archivo is display/readout only: Basic Latin + a few marks is enough.
// Without this subset the file is ~90 KB and total fonts are ~140 KB (> 130 KB budget).
const DISPLAY_GLYPHS = [...' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz·—–’“”°±×'];

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL ?? process.env.CF_PAGES_URL ?? 'https://avolite.example',
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
