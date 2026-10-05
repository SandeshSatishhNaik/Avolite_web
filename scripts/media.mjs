import sharp from 'sharp';
import {mkdir,stat,writeFile} from 'node:fs/promises';
import {FIGURES} from '../src/lib/figures.ts';
import {REPO} from '../src/lib/site.ts';
await mkdir('public/media',{recursive:true});
const sizes={};
for(const [id,figure] of Object.entries(FIGURES)){
 const source='src/assets/repo/'+figure.path;
 const metadata=await sharp(source).metadata();
 sizes[id]={width:metadata.width,height:metadata.height};
 for(const width of [640,1280,1920]){
  const target=`public/media/${id}-${width}.webp`;
  // Impeccable uses a JSON sidecar for WebP provenance; regenerate it with every build.
  await writeFile(`${target}.json`,JSON.stringify({prompt:`Source: original MATLAB export, ${REPO.blob(figure.path)}. Responsive WebP, original plot labels and colors retained. Not AI-generated.`,source:REPO.blob(figure.path)},null,2));
  try{if((await stat(target)).mtimeMs>(await stat(source)).mtimeMs)continue;}catch{}
  await sharp(source).resize({width,withoutEnlargement:true}).webp({quality:90}).toFile(target);
 }
}
await writeFile('src/lib/media.generated.json',JSON.stringify(sizes));

const dashboardSizes={};
for(const id of ['smart-scan','surveillance','unknown-signals','recording-poster']){
 const source=`src/assets/dashboard/${id}.png`,metadata=await sharp(source).metadata();
 dashboardSizes[id]={width:metadata.width,height:metadata.height};
 for(const width of [640,1280,1920]){
  const target=`public/media/dashboard-${id}-${width}.webp`;
  await sharp(source).resize({width,withoutEnlargement:true}).webp({quality:90}).toFile(target);
  await writeFile(`${target}.json`,JSON.stringify({kind:'dashboard-capture',status:'PROTOTYPE',source:id==='recording-poster'?'https://drive.google.com/file/d/1Zvi3vxh7ekWwGCZ82BJpV-mZNKCBcU5w/view':'https://avolite-dashboard.vercel.app/',capturedOn:'2026-10-05',view:id,prompt:'Original browser capture from the user-supplied AVOLITE dashboard or its recording. Simulated interface data; not MATLAB results or operational validation. Responsive resize only; no recoloring. Not AI-generated.'},null,2));
 }
}
await writeFile('src/lib/dashboard.generated.json',JSON.stringify(dashboardSizes));
