// Pause a running game when its Nebula window is minimized or hidden.
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='nebulacraft-pause')return;
 window.dispatchEvent(new Event('blur'));
});
