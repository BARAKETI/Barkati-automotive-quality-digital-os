const test=require('node:test'),assert=require('node:assert/strict'),http=require('node:http');
const {createServer}=require('../server.cjs');let server,port;
test.before(async()=>{server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));port=server.address().port;});
test.after(async()=>{await new Promise(resolve=>server.close(resolve));});
function req(url,method='GET'){return new Promise((resolve,reject)=>{const q=http.request({hostname:'127.0.0.1',port,path:url,method},r=>{const chunks=[];r.on('data',c=>chunks.push(c));r.on('end',()=>resolve({status:r.statusCode,headers:r.headers,body:Buffer.concat(chunks)}));});q.on('error',reject);q.end();});}
test('Health exposes service scope, not case records',async()=>{const r=await req('/api/health');assert.equal(r.status,200);assert.equal(JSON.parse(r.body).caseStorage,'browser-local');});
test('Frontend root served',async()=>{const r=await req('/');assert.equal(r.status,200);assert.match(r.body.toString(),/Barkati/i);});
test('JavaScript asset served with correct MIME',async()=>{const r=await req('/engine.js');assert.equal(r.status,200);assert.match(r.headers['content-type'],/javascript/);});
test('Workbook download served',async()=>{const r=await req('/downloads/Quality_OS_Verification_Workbook.xlsx');assert.equal(r.status,200);assert.equal(r.body.subarray(0,2).toString(),'PK');});
test('Standalone offline app served',async()=>{const r=await req('/downloads/Barkati_Quality_OS_Offline.html');assert.equal(r.status,200);assert.match(r.body.toString(),/window.OFFLINE_FILES=/);});
test('HEAD returns headers without body',async()=>{const r=await req('/','HEAD');assert.equal(r.status,200);assert.equal(r.body.length,0);assert.ok(Number(r.headers['content-length'])>0);});
test('Write methods rejected',async()=>{const r=await req('/api/health','POST');assert.equal(r.status,405);assert.equal(r.headers.allow,'GET, HEAD');});
test('Encoded traversal blocked',async()=>{assert.equal((await req('/%2e%2e/package.json')).status,403);});
test('Malformed encoding rejected',async()=>{assert.equal((await req('/%ZZ')).status,400);});
test('Dotfiles and source paths not exposed',async()=>{assert.equal((await req('/.env')).status,403);assert.equal((await req('/backend/server.cjs')).status,404);});
test('Unknown APIs and assets return 404',async()=>{assert.equal((await req('/api/cases')).status,404);assert.equal((await req('/missing')).status,404);});
test('Security and cache headers present',async()=>{const r=await req('/');assert.equal(r.headers['x-content-type-options'],'nosniff');assert.match(r.headers['content-security-policy'],/connect-src 'none'/);assert.equal(r.headers['cache-control'],'no-store');});

test('Encoded null and backslash paths blocked',async()=>{assert.equal((await req('/%00')).status,403);assert.equal((await req('/%5c..%5cpackage.json')).status,403);});
