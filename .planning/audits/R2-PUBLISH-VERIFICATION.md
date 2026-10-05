# R2 and repository publication verification

Date: 5 October 2026.

The user explicitly requested replacing the dummy React site and pushing the entire completed site to `https://github.com/SandeshSatishhNaik/Avolite_web`. They supplied the public R2 origin. Publication is authorized for this task; future pushes still require a user request.

## Publication configuration

- Origin matches the supplied repository. Existing Git default and Cloudflare production branch: `claude/dazzling-rubin-69x39p`.
- Replacement uses the validated React snapshot and an ours-strategy merge of the fetched remote history. No force push or history deletion is needed.
- Cloudflare Pages project `avolite`, build `npm run build`, output `dist`; production `NODE_VERSION=24`, `SITE_URL=https://avolite.pages.dev`; previews use Node 24 and `CF_PAGES_URL`.
- Source, original image assets, local fonts, tests and project/design documents are included. Generated build files, caches, logs, local credentials and temporary browser captures are excluded.
- This committed audit records validation before publication. The final user-facing report records the resulting push and deployment.

## R2 media

Bucket `avolite` uses the user-supplied public origin `https://pub-96bddf2fe30d456a9831b0b2675e65a5.r2.dev`.

Release `avolite/media/54ed0a7745596657` contains 42 responsive WebP images and 42 provenance sidecars. All 84 public objects were verified by SHA256 and MIME type after uploading. Image bytes total 2,356,552.

`src/lib/storage.json` pins the release and a hash of source image bytes, normalized media-generation script and provenance. The build rejects source changes not accompanied by a verified upload. Generated WebP bytes are not compared across operating systems because native encoder output may vary; production uses the already verified uploaded release. No credentials are committed.

Production image URLs use R2; local development uses `/media`. Generated local exports also remain in `dist`. Fonts, CSS and scripts stay on Pages; the 5:16 dashboard recording remains in Drive and loads only on request. MATLAB evidence colors, data issuance and prototype labels remain unchanged.

## Checks

- TypeScript and production build passed.
- 66 Node checks passed, including source-manifest freshness and prerendered R2 image URL validation.
- Full Chromium/Firefox run: 80 passed, two image-loading assertions failed because they read lazy-loaded remote images immediately.
- Both corrected checks passed in the focused run: two expected, zero unexpected, zero flaky. This is not a clean 82-case full-suite rerun.
- Final build: 70,750 gzip bytes for all JS assets; 8,276 for CSS. Both remain within the recorded budgets.
- Scoped demo correction reviewer returned ship; retained baseline exceptions are still disclosed in `DESIGN.md`.

Local records: `.impeccable/review/r2-upload.txt`, `r2-node-final.txt`, `r2-browser.json`, `r2-correction.json`. Browser artifacts are excluded from publication.

WebKit is unavailable on this host due to missing Windows DLLs. Lighthouse and field performance are unmeasured. Graphify refresh remains blocked by Windows Application Control.
