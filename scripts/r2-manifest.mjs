import {createHash} from 'node:crypto';
import {readdir,readFile} from 'node:fs/promises';

export async function mediaManifest(){
 const files=(await readdir('public/media')).filter(name=>/\.webp(?:\.json)?$/.test(name)).sort();
 if(!files.length)throw new Error('Generate media before uploading to R2.');
 const hash=createHash('sha256'),source=createHash('sha256');
 for(const file of files){hash.update(file);hash.update(await readFile(`public/media/${file}`));}
 // Verify raw sources across OSes; native image encoders can emit different bytes.
 source.update((await readFile('scripts/media.mjs','utf8')).replaceAll('\r\n','\n'));
 const originals=(await readdir('src/assets',{recursive:true})).filter(file=>file.endsWith('.png')).map(file=>file.replaceAll('\\','/')).sort();
 for(const file of originals){source.update(file);source.update(await readFile(`src/assets/${file}`));}
 for(const file of files.filter(file=>file.endsWith('.json'))){source.update(file);source.update(await readFile(`public/media/${file}`));}
 return {files,release:hash.digest('hex').slice(0,16),sourceHash:source.digest('hex')};
}

export async function verifyR2Media(){
 const stored=JSON.parse(await readFile('src/lib/storage.json','utf8'));
 const {sourceHash}=await mediaManifest();
 if(stored.sourceHash!==sourceHash)throw new Error('Media changed since the last R2 upload. Run npm run assets:r2 before building.');
}
