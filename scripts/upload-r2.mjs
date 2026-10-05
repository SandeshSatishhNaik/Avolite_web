import {existsSync} from 'node:fs';
import {readFile,writeFile} from 'node:fs/promises';
import {delimiter,resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mediaManifest} from './r2-manifest.mjs';

await import('./media.mjs');
const bucket='avolite',origin='https://pub-96bddf2fe30d456a9831b0b2675e65a5.r2.dev';
const cli=process.env.WRANGLER_CLI??(process.env.PATH??'').split(delimiter).map(dir=>resolve(dir,'../wrangler/bin/wrangler.js')).find(file=>existsSync(file));
if(!cli||!existsSync(cli))throw new Error('Run npm run assets:r2 through npm exec with Wrangler, or set WRANGLER_CLI to its JavaScript CLI path.');
const {files,release,sourceHash}=await mediaManifest(),prefix=`avolite/media/${release}`;
for(const [index,file] of files.entries()){
 const type=file.endsWith('.json')?'application/json':'image/webp',key=`${prefix}/${file}`,url=`${origin}/${key}`;
 const localHash=createHash('sha256').update(await readFile(`public/media/${file}`)).digest('hex');
 const existing=await fetch(url,{signal:AbortSignal.timeout(20000)});
 if(existing.ok&&existing.headers.get('content-type')?.split(';')[0]===type&&createHash('sha256').update(Buffer.from(await existing.arrayBuffer())).digest('hex')===localHash){console.log(`Verified ${index+1}/${files.length}: ${file}`);continue;}
 await new Promise((done,fail)=>{
  const child=spawn(process.execPath,[cli,'r2','object','put',`${bucket}/${key}`,'--remote','--file',`public/media/${file}`,'--content-type',type,'--cache-control','public, max-age=31536000, immutable','--force'],{stdio:['ignore','pipe','pipe']});
  let output='';child.stdout.on('data',data=>output+=data);child.stderr.on('data',data=>output+=data);child.on('error',fail);child.on('close',code=>code===0?done():fail(new Error(`R2 upload failed for ${file}: ${output}`)));
 });
 const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
 if(!response.ok||response.headers.get('content-type')?.split(';')[0]!==type||createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex')!==localHash)throw new Error(`Public verification failed: ${file}`);
 console.log(`Uploaded and verified ${index+1}/${files.length}: ${file}`);
}
await writeFile('src/lib/storage.json',JSON.stringify({bucket,origin,release,sourceHash,mediaBase:`${origin}/${prefix}`},null,2)+'\n');
console.log(`R2 media ready: ${files.length} verified objects at ${origin}/${prefix}`);
