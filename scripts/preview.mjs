import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { links } from '../content/profile.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicFiles = new Set(['index.html', 'index.zh.html', 'cv.html', 'cv.zh.html', links.cvEn, links.cvZh]);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf'};
http.createServer((req,res)=>{
  try {
    const requested = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const rel = requested==='/'?'index.html':requested.slice(1);
    if (!publicFiles.has(rel) && !/^assets\/[\w/.-]+$/.test(rel)) {res.writeHead(404).end();return;}
    const file = path.join(root,rel);
    const stat = fs.statSync(file);
    if (!stat.isFile()) {res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    fs.createReadStream(file).pipe(res);
  } catch {res.writeHead(404).end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
