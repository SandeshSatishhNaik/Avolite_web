let viewer:HTMLDialogElement|undefined;
let openFigure:(link:HTMLAnchorElement)=>void;

export function inspectFigure(link:HTMLAnchorElement){
 if(!viewer){
  const figures=[...new Map([...document.querySelectorAll<HTMLAnchorElement>('a[data-figure-title]')].map(a=>[a.href,a])).values()];
  const dialog=document.createElement('dialog');viewer=dialog;dialog.className='figure-viewer';dialog.setAttribute('aria-labelledby','inspection-title');
  const header=document.createElement('header'),title=document.createElement('h2');title.id='inspection-title';
  const controls=document.createElement('div');controls.className='inspection-controls';
  const viewport=document.createElement('div');viewport.className='inspection-viewport';viewport.tabIndex=0;viewport.setAttribute('aria-label','Figure canvas. Zoom to inspect; scroll or drag to pan.');
  const canvas=document.createElement('div');canvas.className='inspection-canvas';const image=document.createElement('img');canvas.append(image);viewport.append(canvas);
  const footer=document.createElement('footer'),status=document.createElement('p'),source=document.createElement('a');status.className='small';status.setAttribute('aria-live','polite');source.textContent='Inspect pinned source';
  const hint=document.createElement('p');hint.className='small muted';hint.textContent='Original simulation export. Zoom to inspect; drag or scroll to pan. Arrow keys change figures. Escape closes.';
  let index=0,zoom=1,opener:HTMLAnchorElement;
  const resetView=()=>{zoom=1;canvas.style.setProperty('--inspection-zoom','1');image.style.transform='scale(1)';viewport.scrollTo(0,0);sync()};
  const sync=()=>{status.textContent=`SIMULATED. Figure ${index+1} of ${figures.length}. Zoom ${Math.round(zoom*100)}%.`;previous.disabled=index===0;next.disabled=index===figures.length-1;minus.disabled=zoom<=1;plus.disabled=zoom>=3};
  const show=(i:number)=>{index=i;const figure=figures[index],original=figure.querySelector('img');title.textContent=figure.dataset.figureTitle??'Original figure';image.src=figure.href;image.alt=original?.alt??'';viewport.style.setProperty('--figure-ratio',String(Number(original?.getAttribute('width'))/Number(original?.getAttribute('height'))||2));source.href=figure.closest('figure')?.querySelector<HTMLAnchorElement>('figcaption a')?.href??figure.href;resetView()};
  image.addEventListener('error',()=>{status.textContent='Figure could not load. Inspect the pinned source or try the next figure.'});
  const button=(label:string,action:()=>void)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',action);controls.append(b);return b};
  const previous=button('Previous figure',()=>show(index-1)),next=button('Next figure',()=>show(index+1));
  const changeZoom=(amount:number)=>{zoom=Math.max(1,Math.min(3,zoom+amount));canvas.style.setProperty('--inspection-zoom',String(zoom));image.style.transform=`scale(${zoom})`;sync()};
  const minus=button('Zoom out',()=>changeZoom(-.5)),plus=button('Zoom in',()=>changeZoom(.5));button('Reset view',resetView);const close=button('Close figure',()=>dialog.close());close.autofocus=true;
  header.append(title,controls);footer.append(status,source,hint);dialog.append(header,viewport,footer);document.body.append(dialog);
  dialog.addEventListener('close',()=>{document.documentElement.classList.remove('inspecting-figure');opener?.focus()});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'&&index<figures.length-1){e.preventDefault();show(index+1)}if(e.key==='ArrowLeft'&&index>0){e.preventDefault();show(index-1)}});
  let drag:{x:number;y:number;left:number;top:number}|undefined;
  viewport.addEventListener('pointerdown',e=>{if(zoom<=1||e.pointerType==='touch')return;drag={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(e.pointerId);viewport.classList.add('dragging')});
  viewport.addEventListener('pointermove',e=>{if(drag){viewport.scrollLeft=drag.left+drag.x-e.clientX;viewport.scrollTop=drag.top+drag.y-e.clientY}});
  const endDrag=()=>{drag=undefined;viewport.classList.remove('dragging')};viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);image.draggable=false;
  openFigure=figure=>{opener=figure;show(figures.findIndex(a=>a.href===figure.href));document.documentElement.classList.add('inspecting-figure');dialog.showModal()};
 }
 if(!viewer.open)openFigure(link);
}
