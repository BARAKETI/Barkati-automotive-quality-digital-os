const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),src=path.join(root,'src'),dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});
for(const f of ['index.html','style.css','engine.js','model.js','content.js','app.js'])fs.copyFileSync(path.join(src,f),path.join(dist,f));
const resources={};
for(const [rel,file,mime] of [
 ['documents/Delivery_Guide.html','docs/Delivery_Guide.html','text/html'],
 ['documents/Source_Audit.html','docs/Source_Audit.html','text/html'],
 ['downloads/Quality_OS_Verification_Workbook.xlsx','workbooks/Quality_OS_Verification_Workbook.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
])resources[rel]={name:path.basename(file),mime,base64:fs.readFileSync(path.join(root,file)).toString('base64')};
let html=fs.readFileSync(path.join(src,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+fs.readFileSync(path.join(src,'style.css'),'utf8')+'</style>');
html=html.replace('<script src="engine.js"></script>',()=>'<script>window.OFFLINE_FILES='+JSON.stringify(resources)+'</script><script src="engine.js"></script>');
for(const f of ['engine.js','model.js','content.js','app.js'])html=html.replace('<script src="'+f+'"></script>',()=>'<script>'+fs.readFileSync(path.join(src,f),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
fs.mkdirSync(path.join(dist,'downloads'),{recursive:true});
fs.writeFileSync(path.join(dist,'downloads','Barkati_Quality_OS_Offline.html'),html);
fs.writeFileSync(path.join(root,'Barkati_Quality_OS_Offline.html'),html);
fs.cpSync(path.join(root,'docs'),path.join(dist,'documents'),{recursive:true});
for(const f of fs.readdirSync(path.join(root,'workbooks')))if(f.endsWith('.xlsx'))fs.copyFileSync(path.join(root,'workbooks',f),path.join(dist,'downloads',f));
console.log('Build complete: static web + self-contained offline HTML with embedded guides and workbook.');

fs.copyFileSync(path.join(root,'staticwebapp.config.json'),path.join(dist,'staticwebapp.config.json'));
