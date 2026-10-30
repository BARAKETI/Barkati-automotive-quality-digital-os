// Optional hosting backend. No case database, identity service or AI endpoint.
'use strict';
const http=require('node:http'),fs=require('node:fs'),fsp=fs.promises,path=require('node:path');
const DEFAULT_PUBLIC=path.resolve(__dirname,'../frontend/dist');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.pdf':'application/pdf','.csv':'text/csv; charset=utf-8','.txt':'text/plain; charset=utf-8','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','.zip':'application/zip'};
const headers={'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",'Cache-Control':'no-store'};
function createServer(publicDir=DEFAULT_PUBLIC){
 const base=path.resolve(publicDir);
 return http.createServer(async(req,res)=>{
  for(const [k,v] of Object.entries(headers))res.setHeader(k,v);
  const reply=(status,data,type='application/json; charset=utf-8')=>{const bytes=Buffer.from(typeof data==='string'?data:JSON.stringify(data));res.writeHead(status,{'Content-Type':type,'Content-Length':bytes.length});res.end(req.method==='HEAD'?undefined:bytes);};
  if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');reply(405,{error:'Method not allowed'});return;}
  let pathname;try{pathname=decodeURIComponent((req.url||'/').split('?')[0]);}catch{reply(400,{error:'Invalid URL encoding'});return;}
  if(!pathname.startsWith('/')||[...pathname].some(c=>c.charCodeAt(0)===0||c.charCodeAt(0)===92)||pathname.split('/').some(x=>x==='..'||x.startsWith('.'))){reply(403,{error:'Path is not allowed'});return;}
  if(pathname==='/api/health'){reply(200,{status:'ok',service:'Barkati Quality OS static host',version:'1.0.0',caseStorage:'browser-local',ai:'rules-only'});return;}
  if(pathname.startsWith('/api/')){reply(404,{error:'API endpoint not implemented'});return;}
  let file=path.resolve(base,'.'+pathname);if(file!==base&&!file.startsWith(base+path.sep)){reply(403,{error:'Path is not allowed'});return;}
  try{
   let stat=await fsp.stat(file);if(stat.isDirectory()){file=path.join(file,'index.html');stat=await fsp.stat(file);}
   const real=await fsp.realpath(file),realBase=await fsp.realpath(base);
   if(!real.startsWith(realBase+path.sep)||!stat.isFile()){reply(403,{error:'Path is not allowed'});return;}
   const ext=path.extname(file).toLowerCase();
   res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream','Content-Length':stat.size});
   if(req.method==='HEAD'){res.end();return;}
   const stream=fs.createReadStream(file);stream.on('error',()=>res.destroy());stream.pipe(res);
  }catch(error){if(!res.headersSent)reply(['ENOENT','ENOTDIR'].includes(error.code)?404:500,{error:['ENOENT','ENOTDIR'].includes(error.code)?'File not found':'Unable to serve file'});else res.destroy();}
 });
}
if(require.main===module){
 if(!fs.existsSync(path.join(DEFAULT_PUBLIC,'index.html'))){console.error('Missing frontend/dist/index.html. Run npm run build first.');process.exit(1);}
 const port=Number(process.env.PORT||8080),host=process.env.HOST||'0.0.0.0';
 if(!Number.isInteger(port)||port<0||port>65535)throw Error('PORT must be a valid numeric port.');
 const server=createServer();server.requestTimeout=30000;server.headersTimeout=15000;server.keepAliveTimeout=5000;
 server.listen(port,host,()=>console.log('Quality OS host listening on port '+server.address().port));
 for(const signal of ['SIGTERM','SIGINT'])process.once(signal,()=>{server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),10000).unref();});
}
module.exports={createServer};
