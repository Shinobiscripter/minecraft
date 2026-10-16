import { mkdir, readFile, writeFile, copyFile, readdir, cp } from 'node:fs/promises';
import {createHash} from 'node:crypto';
await mkdir('dist/game',{recursive:true});
for(const file of await readdir('site')) await copyFile(`site/${file}`,`dist/${file}`);
const manifest=[];
for(const file of ['classes.js','assets.epk','favicon.png']) {
 const data=await readFile(`1.20.4/${file}`);
 if(data.length>50*1024*1024)throw Error(`${file} exceeds the deployment file budget`);
 await copyFile(`1.20.4/${file}`,`dist/game/${file}`);
 manifest.push({file,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});
}
let html=await readFile('1.20.4/index.html','utf8');
html=html.replace(/<base\b[^>]*>/i,'')
 .replace(/assetsURI:\s*"[^"]*"/,'assetsURI: "assets.epk"')
 .replace(/servers:\s*\[[\s\S]*?\],\s*relays:/,'servers: [], relays:');
html=html.replace('</head>','<script src="/game-bridge.js" defer></script></head>');
if(/<base\b|assetsURI:\s*"https:/.test(html))throw Error('External game asset dependency remains');
await writeFile('dist/game/index.html',html);
await writeFile('dist/build-manifest.json',JSON.stringify({source:'Shinobiscripter/minecraft',version:'1.20.4',assets:manifest},null,2));
await copyFile('site/launcher.svg','dist/favicon.svg');
console.log('Built standalone launcher and all four 1.20.4 files. Runtime binaries copied unchanged.');

const versions=[{id:'1.20.4',name:'Eaglercraft 1.20.4',url:'/game/',runtime:'JavaScript'},...['1.20.6','26.2','1.12.2','1.8.8','1.5.2','alpha-1.2.6','beta-1.3','beta-1.7.3','indev','pocket-edition'].map(id=>({id,name:id==='pocket-edition'?'Pocket Edition':'Eaglercraft '+id,url:'/versions/'+id+'/',runtime:['1.20.6','26.2'].includes(id)?'WebAssembly GC':id==='pocket-edition'?'WebAssembly':'JavaScript'}))];
await cp('shared','dist/shared',{recursive:true});
let loader=await readFile('dist/shared/loader.js','utf8');
loader=loader.replace(/const oglog = console.log;[\s\S]*?(?=const IPFS_GATEWAYS)/,'');
await writeFile('dist/shared/loader.js',loader);
for(const version of versions.slice(1)){
 await cp(version.id,'dist/versions/'+version.id,{recursive:true});
 let entry=await readFile(version.id+'/index.html','utf8');
 entry=entry.replace(/<base\b[^>]*>/ig,'').replace(/https:\/\/[^"'\s]*jsdelivr.net\/gh\/[^/]+\/minecraft@main\/shared\//ig,'/shared/').replace(/https:\/\/[^"'\s]*jsdelivr.net\/gh\/[^/]+\/minecraft@main\//ig,'/versions/');
 entry=entry.replace('const res = await fetch(u);','document.body.dataset.loading = "Loading game files…"; const res = await fetch(u); if (!res.ok) throw new Error("Game download failed: " + res.status);');
 entry=entry.replace('loadAndRun();','loadAndRun().catch(error => { document.body.textContent = "Unable to start this edition. " + error.message + ". Reload to retry."; });');
 entry=entry.replace('</head>','<script src="/game-bridge.js" defer></script><style>body[data-loading]:before{content:attr(data-loading);position:fixed;top:20px;left:20px;color:#eee;background:#171c30;padding:16px;font:16px system-ui}</style></head>');
 await writeFile('dist/versions/'+version.id+'/index.html',entry);
 for(const file of await readdir(version.id)){
 const data=await readFile(version.id+'/'+file);if(data.length>50*1024*1024)throw Error(file+' exceeds 50 MiB');
 manifest.push({file:version.id+'/'+file,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});
 }
}
await writeFile('dist/versions.json',JSON.stringify(versions,null,2));
await writeFile('dist/build-manifest.json',JSON.stringify({source:'Shinobiscripter/minecraft',versions:versions.map(v=>v.id),assets:manifest},null,2));
console.log('Built '+versions.length+' editions with same-origin assets; split archives remain split.');

let pocketWorker=await readFile('dist/versions/pocket-edition/sw.js','utf8');pocketWorker=pocketWorker.replace("'minecraft-web-v1'","'nebulacraft-pocket-v1'").replace('cacheName !== CACHE_NAME','cacheName.startsWith("nebulacraft-pocket-") && cacheName !== CACHE_NAME');await writeFile('dist/versions/pocket-edition/sw.js',pocketWorker);
