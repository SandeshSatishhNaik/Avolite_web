import {updateScrollMotion} from './scroll-motion';
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const menus = document.querySelectorAll<HTMLDetailsElement>('.chapter-menu, .mobile-nav');
menus.forEach(menu => {
 menu.addEventListener('click', e => { if ((e.target as Element).closest('a')) menu.open = false; });
 menu.addEventListener('keydown', e => { if (e.key === 'Escape') { menu.open = false; menu.querySelector('summary')?.focus(); } });
});
document.addEventListener('click', e => menus.forEach(menu => { if (!menu.contains(e.target as Node)) menu.open = false; }));
const sections = [...document.querySelectorAll<HTMLElement>('[data-section],.appendix section[id]')];
const links = document.querySelectorAll<HTMLAnchorElement>('[data-chapter-link],.local-contents a,.artifact-index a');
const progress = document.querySelector<HTMLElement>('.reading-progress');
let queued = false;
function update() {
 const active = sections.findLast(section => section.getBoundingClientRect().top <= innerHeight * .35);
 links.forEach(link => { if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
 if (progress && sections.length) progress.style.transform = `scaleX(${Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight-innerHeight))})`;
 if(!motionPreference.matches)sections.forEach(section=>{const bounds=section.getBoundingClientRect();if(bounds.top<innerHeight&&bounds.bottom>0)section.style.setProperty('--chapter-progress',String(Math.max(0,Math.min(1,(innerHeight*.65-bounds.top)/Math.min(bounds.height,innerHeight)))))});
 updateScrollMotion();
 queued = false;
}
window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, {passive:true});
window.addEventListener('resize', update);
update();

const themeButtons=document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
function applyTheme(theme:string){
 document.documentElement.dataset.theme=theme;
 themeButtons.forEach(button=>{button.disabled=false;button.setAttribute('aria-label',`Switch to ${theme==='plum'?'light':'plum'} theme`);button.querySelector('[data-theme-label]')!.textContent=theme==='plum'?'Light':'Plum'});
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content',getComputedStyle(document.documentElement).getPropertyValue('--bg-0').trim());
}
applyTheme(document.documentElement.dataset.theme==='plum'?'plum':'pearl');
themeButtons.forEach(button=>button.addEventListener('click',()=>{
 const theme=document.documentElement.dataset.theme==='plum'?'pearl':'plum';
 const change=()=>{applyTheme(theme);try{localStorage.setItem('avolite-theme',theme)}catch{/* Preference still works for this page when storage is unavailable. */}};
 if(document.startViewTransition&&!motionPreference.matches)document.startViewTransition(change);else change();
}));
document.addEventListener('toggle',event=>{
 const disclosure=event.target;
 if(!(disclosure instanceof HTMLDetailsElement)||!disclosure.open||motionPreference.matches)return;
 const content=disclosure.querySelector('.chapter-links')??disclosure.querySelector(':scope > :not(summary)');
 if(content){content.getAnimations().forEach(a=>a.cancel());content.animate([{opacity:.65,transform:'translateY(-4px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.16,1,.3,1)'})}
},true);
// Native source links remain usable without JS and with modified clicks.
document.addEventListener('click',async event=>{
 const link=(event.target as Element).closest<HTMLAnchorElement>('a[data-figure-title]');
 if(!link||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 event.preventDefault();
 try{const {inspectFigure}=await import('./inspect');inspectFigure(link)}catch{location.assign(link.href)}
});
