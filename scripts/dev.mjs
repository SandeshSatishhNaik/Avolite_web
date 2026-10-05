import {createServer} from 'vite';
import {createServer as httpServer} from 'node:http';
import {readFile} from 'node:fs/promises';
await import('./media.mjs');
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
const server=httpServer((req,res)=>vite.middlewares(req,res,async()=>{
 try{
 const path=new URL(req.url,'http://localhost').pathname;
 const route=path==='/'?'/':path.replace(/\/?$/,'/');
 const known=['/','/system/','/evidence/','/preview/'].includes(route);
 const template=await vite.transformIndexHtml(path,await readFile('index.html','utf8'));
 const {render}=await vite.ssrLoadModule('/src/server.tsx');
 const {head,body}=render(known?route:'/404/');
 res.writeHead(known?200:404,{'Content-Type':'text/html'});
 res.end(template.replace('<!--page-head-->',head).replace('<!--page-body-->',body));
 }catch(error){vite.ssrFixStacktrace(error);console.error(error);res.writeHead(500);res.end('Page render failed. Check terminal diagnostics.');}
}));
server.listen(4321,'127.0.0.1',()=>console.log('React preview: http://127.0.0.1:4321'));
