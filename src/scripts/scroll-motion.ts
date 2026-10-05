// Reading motion is separate from engineering state and never changes evidence.
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const activeScenes=new Set<HTMLElement>();
const effects=new Set<Animation>();
const clamp=(value:number)=>Math.max(0,Math.min(1,value));

export function updateScrollMotion(){
 if(preference.matches||document.hidden)return;
 activeScenes.forEach(scene=>{
  const bounds=scene.getBoundingClientRect();
  const progress=clamp((innerHeight*.85-bounds.top)/(bounds.height+innerHeight*.35));
  scene.style.setProperty('--scene-progress',String(progress));
 });
}

const scenes=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{if(entry.isIntersecting)activeScenes.add(entry.target as HTMLElement);else activeScenes.delete(entry.target as HTMLElement)});
 updateScrollMotion();
});
document.querySelectorAll<HTMLElement>('.schedule-compare,[data-widget=stages],.figure,.milestones,.comparison').forEach(scene=>scenes.observe(scene));

function animate(node:Element,frames:Keyframe[],delay=0){
 const effect=node.animate(frames,{duration:650,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
 effects.add(effect);effect.onfinish=effect.oncancel=()=>effects.delete(effect);
}
const entrance=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(!entry.isIntersecting)return;
 entrance.unobserve(entry.target);
 if(preference.matches||document.hidden)return;
 const node=entry.target;
 if(node.matches('.section-heading,.hero-copy,.page-opening')){
  const heading=node.querySelector('h1,h2');
  if(heading)animate(heading,[{clipPath:'inset(0 0 100% 0)',transform:'translateY(12px)'},{clipPath:'inset(0)',transform:'translateY(0)'}]);
 }else if(node.matches('.schedule-compare,.chapter-outline')){
  node.querySelectorAll('.schedule span,li').forEach((item,i)=>animate(item,[{opacity:.55,transform:'translateX(-8px)'},{opacity:1,transform:'translateX(0)'}],Math.min(i*45,240)));
 }else if(node.matches('.decision-pair article')){
  animate(node,[{opacity:.65,transform:`translateX(${node.matches(':first-child')?-20:20}px)`},{opacity:1,transform:'translateX(0)'}]);
 }else if(node.matches('.final-cta')){
  const heading=node.querySelector('h2');if(heading)animate(heading,[{opacity:.65,transform:'scale(.97)'},{opacity:1,transform:'scale(1)'}]);
 }else{
  animate(node,[{opacity:.7,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}]);
 }
}),{threshold:.15});
document.querySelectorAll('.hero-copy,.shelf-grid>div,.section-heading,.page-opening,.schedule-compare,.decision-pair article,.figure figcaption,.chapter-outline,.failure-row,.milestones>li,.comparison,.final-cta').forEach(node=>entrance.observe(node));

const stop=()=>{effects.forEach(effect=>effect.cancel());effects.clear()};
preference.addEventListener('change',()=>{stop();if(preference.matches)activeScenes.forEach(scene=>scene.style.removeProperty('--scene-progress'));else updateScrollMotion()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else updateScrollMotion()});
