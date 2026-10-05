import {build} from 'vite';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {verifyRaw} from './ingest.mjs';
import {lintOutput} from './honesty.mjs';
import {verifyR2Media} from './r2-manifest.mjs';
verifyRaw();
await import('./media.mjs');
await verifyR2Media();
await build();
await build({build:{ssr:'src/server.tsx',outDir:'.react-build',emptyOutDir:true}});
const {render}=await import('../.react-build/server.js');
const template=await readFile('dist/index.html','utf8');
for(const route of ['/','/system/','/evidence/','/preview/','/404/']){
 const {head,body}=render(route);
 const path=route==='/404/'?'dist/404.html':`dist${route}index.html`;
 await mkdir(path.slice(0,path.lastIndexOf('/')),{recursive:true});
 await writeFile(path,template.replace('<!--page-head-->',head).replace('<!--page-body-->',body));
}
lintOutput(new URL('../dist/',import.meta.url));
console.log('React prerender complete: home, system, evidence, preview, 404. Honesty checks passed.');
