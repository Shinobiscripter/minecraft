import { mkdir, readFile, writeFile, copyFile, readdir } from 'node:fs/promises';
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
