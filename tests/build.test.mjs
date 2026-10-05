import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {gzipSync} from 'node:zlib';
import {SECTIONS,REPO} from '../src/lib/site.ts';
import {derive,fmt,columnLabel,dataset} from '../src/lib/data.ts';
import {mediaManifest} from '../scripts/r2-manifest.mjs';
const read=p=>readFileSync(p,'utf8');
const files=readdirSync('dist',{recursive:true}).map(p=>join('dist',p)).filter(p=>statSync(p).isFile());
const home=read('dist/index.html'),preview=read('dist/preview/index.html');
const all=files.filter(p=>p.endsWith('.html')).map(read);
test('React/Vite replaces Astro in dependencies and source',()=>{
 const pkg=JSON.parse(read('package.json'));
 assert.ok(pkg.dependencies.react&&pkg.dependencies['react-dom']&&pkg.devDependencies.vite);
 assert.ok(!pkg.dependencies.astro&&!existsSync('astro.config.mjs'));
 assert.ok(!readdirSync('src',{recursive:true}).some(p=>p.endsWith('.astro')));
 for(const script of ['dev','build','preview','check','test','test:e2e'])assert.ok(pkg.scripts[script]);
});
test('all requested pages are prerendered with a single h1 and metadata',()=>{
 for(const html of all){assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.match(html,/<html lang="en">/);assert.match(html,/name="viewport"/);assert.match(html,/rel="canonical"/);assert.match(html,/<main id="main" tabindex="-1"/);}
 for(const path of ['dist/system/index.html','dist/evidence/index.html','dist/404.html'])assert.ok(existsSync(path));
 assert.match(preview,/name="robots" content="noindex"/);assert.ok(!home.includes('name="robots"'));
});
test('homepage preserves eight chapters, approved headline and working home links',()=>{
 const tags=[...home.matchAll(/<section\b[^>]*data-section[^>]*>/g)].map(m=>m[0]);
 assert.deepEqual(tags.map(s=>s.match(/id="([^"]+)"/)[1]),SECTIONS.map(s=>s.id));
 for(const s of SECTIONS){assert.ok(home.includes(`id="${s.id}-h"`));assert.ok(home.includes(`href="/#${s.id}"`));}
 assert.match(home,/From signal to<br\/>scanning decision\./);
 assert.match(home,/<details class="mobile-nav" id="menu"/);assert.ok(!home.includes('<dialog'));
 const firstA=home.slice(home.indexOf('<body')).match(/<a\b[^>]+>/)[0];assert.ok(firstA.includes('class="skip"'));
});
test('every local page and fragment link resolves against the emitted pages',()=>{
 for(const html of all)for(const [,href]of html.matchAll(/href="(\/(?:[^"#]*)(?:#[^"]*)?|#[^"]+)"/g)){
  if(/\.(?:svg|webp|woff2|css|js)$/.test(href))continue;
  const [path,fragment]=href.split('#');const target=path?`dist${path.endsWith('/')?path:path+'/'}index.html`:null;
  if(target)assert.ok(existsSync(target),href);
  if(fragment)assert.ok((target?read(target):html).includes(`id="${fragment}"`),href);
 }
});
test('self-hosted fonts, CSS and React scripts respect budgets',()=>{
 const fonts=files.filter(p=>p.endsWith('.woff2'));assert.equal(fonts.length,3);
 assert.ok(fonts.reduce((n,p)=>n+statSync(p).size,0)<=130000);
 const gzip=ext=>files.filter(p=>p.endsWith(ext)).reduce((n,p)=>n+gzipSync(readFileSync(p)).length,0);
 assert.ok(gzip('.css')<=25*1024);
 assert.ok(gzip('.js')<=70*1024,`JS gzip: ${gzip('.js')} bytes`);
 assert.equal((home.match(/as="font"/g)||[]).length,2);
 for(const html of all)assert.ok(!/googleapis|gstatic|_astro/.test(html));
 assert.ok(read('dist/_headers').includes('/assets/*'));
});
test('numeric output remains issued and source-tagged, with stable text',()=>{
 assert.ok(read('src/components/Primitives.tsx').includes('requireIssued(tagged'));
 assert.ok(read('src/components/Primitives.tsx').includes("requireIssued(cell("));
 for(const html of all)for(const tag of html.match(/<data\b[^>]*>/g)||[])assert.match(tag,/data-status="(?:SIMULATED|BUILT|ILLUSTRATIVE)"/);
 assert.ok(preview.includes(`>${fmt(derive('cfar-a').maxAbsRangeError,1)}</data>`));
 assert.ok(!home.includes('data-countup'));
 const heads=[...preview.matchAll(/<th\b[^>]*scope="col"[^>]*>([^<]+)<\/th>/g)].map(m=>m[1]);
 assert.deepEqual(heads,dataset('cfar-a').columns.map(columnLabel));
 assert.ok(preview.includes(REPO.commit));
});
test('figures use responsive, unrecoloured WebP exports with dimensions and provenance',()=>{
 for(const html of all)for(const img of html.match(/<img\b[^>]*>/g)||[]){for(const attr of ['width=','height=','alt=','srcSet=','loading="lazy"','decoding="async"'])assert.ok(img.includes(attr),attr);}
 assert.ok(files.some(p=>p.endsWith('.webp')));assert.ok(!files.some(p=>p.endsWith('.png')));
 for(const path of files.filter(p=>p.endsWith('.webp'))){const provenance=JSON.parse(read(`${path}.json`));if(path.includes('dashboard-')){assert.equal(provenance.kind,'dashboard-capture');assert.equal(provenance.status,'PROTOTYPE');assert.ok(['https://avolite-dashboard.vercel.app/','https://drive.google.com/file/d/1Zvi3vxh7ekWwGCZ82BJpV-mZNKCBcU5w/view'].includes(provenance.source));assert.ok(provenance.prompt.includes('not MATLAB results'));}else{assert.ok(provenance.source.includes(REPO.commit));assert.ok(provenance.prompt.includes('original MATLAB export'));}}
 assert.match(preview,/<figcaption>.*data-status="SIMULATED"/);
 assert.ok(preview.includes('View as table'));
});

test('production figures use the verified R2 release while retaining local exports',async()=>{
 const storage=JSON.parse(read('src/lib/storage.json'));
 assert.equal(storage.origin,'https://pub-96bddf2fe30d456a9831b0b2675e65a5.r2.dev');
 assert.match(storage.release,/^[a-f0-9]{16}$/);
 assert.equal(storage.sourceHash,(await mediaManifest()).sourceHash);
 for(const html of all)for(const [,url] of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)){
  assert.ok(url.startsWith(storage.mediaBase+'/'));
  assert.ok(existsSync(join('dist/media',url.split('/').at(-1))));
 }
});
test('no unsafe HTML injection or untagged measurement literals in React source',()=>{
 const source=readdirSync('src',{recursive:true}).filter(p=>/\.tsx?$/.test(p)).map(p=>read(join('src',p))).join('\n');
 assert.ok(!/dangerouslySetInnerHTML|innerHTML/.test(source));
 const components=read('src/App.tsx')+read('src/components/Primitives.tsx');assert.ok(!/0\.165|0\.0995|0\.100/.test(components));
});
