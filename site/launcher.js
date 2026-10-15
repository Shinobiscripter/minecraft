const $=id=>document.getElementById(id);
function page(details){$('details-panel').hidden=!details;$('play-panel').hidden=details;$('details-tab').setAttribute('aria-selected',String(details));$('play-tab').setAttribute('aria-selected',String(!details));}
$('play-tab').onclick=$('edition').onclick=()=>page(false);$('details-tab').onclick=()=>page(true);
$('about').onclick=()=>$('credits').showModal();$('close-credits').onclick=()=>$('credits').close();
let game=null;
$('play').onclick=()=>{
 if(game)return;
 game=document.createElement('iframe');game.title='Eaglercraft 1.20.4';game.src='/game/';game.allow='autoplay; fullscreen; gamepad';game.allowFullscreen=true;
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
