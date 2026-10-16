const $=id=>document.getElementById(id);
function page(details){$('details-panel').hidden=!details;$('play-panel').hidden=details;$('details-tab').setAttribute('aria-selected',String(details));$('play-tab').setAttribute('aria-selected',String(!details));}
$('play-tab').onclick=$('edition').onclick=()=>page(false);$('details-tab').onclick=()=>page(true);
$('about').onclick=()=>$('credits').showModal();$('close-credits').onclick=()=>$('credits').close();
let game=null;
$('play').onclick=()=>{
 if(game)return;
 game=document.createElement('iframe');game.title=selected.name;game.src=selected.url;game.allow='autoplay; fullscreen; gamepad';game.allowFullscreen=true;
 $('game-host').append(game);$('session').hidden=false;$('status').textContent='Game running. Worlds are managed by the game in this browser.';game.focus();
};
$('exit').onclick=()=>$('exit-dialog').showModal();$('cancel-exit').onclick=()=>$('exit-dialog').close();
$('confirm-exit').onclick=async()=>{if(document.fullscreenElement)await document.exitFullscreen();game?.remove();game=null;$('session').hidden=true;$('exit-dialog').close();$('status').textContent='Game closed.';$('play').focus();};
$('fullscreen').onclick=async()=>{try{await $('session').requestFullscreen();}catch{$('fullscreen').textContent='Use browser fullscreen';}};
window.addEventListener('beforeunload',e=>{if(game){e.preventDefault();e.returnValue='';}});
window.addEventListener('message',event=>{
 if(event.source!==parent||!['https://nebulahub-shinobiscripter.netlify.app','http://localhost:8000'].includes(event.origin)||event.data?.type!=='nebulacraft-pause')return;
 game?.contentWindow?.postMessage({type:'nebulacraft-pause'},location.origin);
});

let selected={id:'1.20.4',name:'Eaglercraft 1.20.4',url:'/game/',runtime:'JavaScript'};
$('play').disabled=true;
fetch('/versions.json').then(r=>{if(!r.ok)throw Error('Edition list unavailable');return r.json();}).then(versions=>{
 const picker=$('version-picker');
 for(const version of versions){const option=document.createElement('option');option.value=version.id;option.textContent=version.name;picker.append(option);}
 let saved;try{saved=localStorage.getItem('nebulacraft-edition');}catch{}
 if(versions.some(v=>v.id===saved))picker.value=saved;
 function select(){selected=versions.find(v=>v.id===picker.value);try{localStorage.setItem('nebulacraft-edition',selected.id);}catch{}
 document.querySelector('header span').textContent=selected.id;document.querySelector('.hero-copy h2').textContent=selected.id;
 document.querySelector('.launch-bar strong').textContent=selected.name;document.querySelector('.launch-bar span').textContent=selected.runtime;
 document.querySelector('#edition small').textContent=selected.id;
 document.querySelector('.session-bar strong').textContent=selected.name;document.querySelector('.session-bar a').href=selected.url;
 const details=document.querySelectorAll('#details-panel dd');details[0].textContent=selected.name;details[1].textContent=selected.runtime;
 document.querySelector('#details-panel p').textContent=selected.id==='1.20.4'?'This community build uses a legacy engine and modified resources; some textures may be missing.':'Community build supplied by the repository. Modern Chromium is recommended; WebAssembly GC editions need a compatible browser. Version labels are not a guarantee of official feature parity.';
 }picker.onchange=select;select();$('play').disabled=false;
}).catch(error=>{$('status').textContent=error.message;});
