import {useState,useEffect,useRef,type ReactNode} from 'react';
import {stages,failures} from '../lib/story';
import {Symbol} from './Symbol';

// Shared feedback for content that changes after an explicit selection.
function useFeedback<T extends HTMLElement=HTMLDivElement>(value:unknown){
 const ref=useRef<T>(null),initial=useRef(true);
 useEffect(()=>{if(initial.current){initial.current=false;return}if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;ref.current?.querySelectorAll<HTMLElement>('.motion-result:not([hidden])').forEach(node=>{node.getAnimations().forEach(a=>a.cancel());node.animate([{opacity:.6,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.16,1,.3,1)'})})},[value]);
 return ref;
}

// Each player owns its timer. Starting playback pauses the other visible explainer.
function usePlayer(length:number,interval:number,autoplay=false){
 const [step,setStep]=useState(-1),[playing,setPlaying]=useState(false),[ready,setReady]=useState(false),[reduced,setReduced]=useState(false);
 const ref=useRef<HTMLDivElement>(null),introPending=useRef(autoplay);
 useEffect(()=>{setReady(true);const media=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>{setReduced(media.matches);setPlaying(false)};change();media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);
 useEffect(()=>{
  let introTimer:ReturnType<typeof setTimeout>|undefined;
  const cancelTimer=()=>clearTimeout(introTimer);
  const pause=()=>{cancelTimer();introPending.current=false;setPlaying(false)};
  const hidden=()=>{if(document.hidden)pause()};
  document.addEventListener('avolite:play',pause);document.addEventListener('visibilitychange',hidden);
  const observer=new IntersectionObserver(entries=>{
   cancelTimer();
   if(entries[0].intersectionRatio<.75){setPlaying(false);return}
   if(!introPending.current||document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
   introTimer=setTimeout(()=>{
    if(!introPending.current||document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    introPending.current=false;document.dispatchEvent(new Event('avolite:play'));setStep(0);setPlaying(true)
   },400)
  },{threshold:[0,.75]});
  if(ref.current)observer.observe(ref.current);
  return()=>{cancelTimer();document.removeEventListener('avolite:play',pause);document.removeEventListener('visibilitychange',hidden);observer.disconnect()}
 },[]);
 useEffect(()=>{if(!playing)return;const timer=setTimeout(()=>{if(step>=length-1)setPlaying(false);else setStep(s=>s+1)},autoplay&&step===length-1?1600:interval);return()=>clearTimeout(timer)},[playing,step,length,interval,autoplay]);
 const stop=()=>{introPending.current=false;setPlaying(false)};
 const play=()=>{introPending.current=false;if(playing){setPlaying(false);return}document.dispatchEvent(new Event('avolite:play'));if(step>=length-1||step<0)setStep(0);setPlaying(true)};
 return {step,playing,ready,reduced,ref,play,select:(index:number)=>{stop();setStep(index)},next:()=>{stop();setStep(s=>Math.min(length-1,s+1))},reset:()=>{stop();setStep(-1)}};
}
export function Cutaway(){
 const p=usePlayer(7,900,true);
 return <div className="cutaway" ref={p.ref} data-playing={p.playing}>
  <p className="diagram-label">Conceptual system view<span/></p>
  <svg viewBox="0 24 570 450" role="group" aria-labelledby="cutaway-title cutaway-desc">
   <title id="cutaway-title">From observation to the next scan</title>
   <desc id="cutaway-desc">The diagram plays once when it enters view. Pause or select a stage to take control. Read from bottom to top: Observe, Process, Detect, Estimate, Predict, Decide, Scan again. A return path closes the proposed loop. Radar DSP exports support a separate testbed; the integrated scheduler is designed.</desc>
   <path className="feedback" d="M519 409H563V58H512M522 50 511 58 522 65"/>
   <path className="spine" d="M318 253V58"/><path className="foundation-spine" d="M318 443V253"/>
   {stages.map((s,i)=>{
    const y=438-i*63,outline=`M156 ${y} 310 ${y-44} 502 ${y-18} 340 ${y+31}Z`;
    return <g key={s.name} className={`plane ${p.step===i?'active':''}`} role="button" tabIndex={0} aria-label={`Select ${s.name} stage`} aria-pressed={p.step===i} onClick={()=>p.select(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();p.select(i)}}}>
     <path d={outline}/>
     {p.step===i&&<path className="plane-trace" d={outline} pathLength="1" aria-hidden="true"/>}
     <circle cx="318" cy={y-9} r="5"/><text x="347" y={y-3}>{s.name}</text>
     <rect className="plane-hit" x="150" y={y-35} width="360" height="63"/>
    </g>
   })}
   {p.step>=0&&<>
    <path className="signal-route" d={`M318 429V${429-p.step*63}`}/>
    <g className="signal-head" style={{transform:`translateY(${-p.step*63}px)`}} aria-hidden="true">
     <circle cx="318" cy="429" r="6"/><circle key={p.step} className="signal-ring" cx="318" cy="429" r="12"/>
    </g>
   </>}
   {p.step===6&&p.playing&&!p.reduced&&<circle className="return-signal" cx="0" cy="0" r="4" aria-hidden="true"/>}
   <path className="bracket" d="M140 269H126V453H140"/><path className="bracket bracket--designed" d="M140 65H126V243H140"/>
   <text className="scope-label" x="12" y="315"><tspan x="12">Radar DSP</tspan><tspan x="12" dy="21">evidence</tspan><tspan x="12" dy="23">SIMULATED</tspan></text>
   <text className="scope-label" x="12" y="129"><tspan x="12">Smart-scan</tspan><tspan x="12" dy="21">scheduler</tspan><tspan x="12" dy="23">DESIGNED</tspan></text>
  </svg>
  <p className="diagram-scope">Radar DSP testbed: <strong>SIMULATED</strong>. Integrated smart-scan loop: <strong>DESIGNED</strong>.</p>
  <div className="controls diagram-controls" style={{visibility:p.ready?'visible':'hidden'}}>
   <button onClick={p.play} disabled={p.reduced}>{p.playing?'Pause loop':p.step>=6?'Replay loop':p.step<0?'Play the loop':'Resume loop'}</button>
   <button onClick={p.next} disabled={p.step>=6}>Next stage</button><button onClick={p.reset}>Reset</button>
   <span className="small" aria-live={p.playing?'off':'polite'}>{p.step<0?'Select a stage or play the loop':stages[p.step].name}</span>
  </div>
 </div>
}

export function StageExplorer(){const [selected,setSelected]=useState<number|null>(null);const feedback=useFeedback(selected);return <div className="stage-explorer" ref={feedback}><div className="system-canvas"><svg viewBox="0 0 500 550" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="canvas-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 9 5 1 9"/></marker></defs><path className="canvas-forward scroll-spine" pathLength="1" d="M20 37V481"/>{stages.map((s,i)=><g key={s.name}><path className="canvas-forward" d={`M20 ${37+i*74}H32`}/><circle className={`canvas-port ${selected===i?'active':''}`} cx="20" cy={37+i*74} r="4"/>{i<6&&<path className="canvas-forward" d={`M16 ${70+i*74}l4 6 4-6`}/>}</g>)}<path className="canvas-flow" d="M20 481H485V37H20" markerEnd="url(#canvas-arrow)"/></svg><ol className="stage-index">{stages.map((s,i)=><li key={s.name}><button aria-pressed={selected===i} onClick={()=>setSelected(selected===i?null:i)}><span className="mono">0{i+1}</span>{s.name}<Symbol/></button><span className="canvas-annotation">{s.output}</span></li>)}</ol><p className="small canvas-caption">Receiver observations enter the designed loop. A fresh scan checks the prediction.</p></div><div className="stage-details">{selected===null&&<div className="stage-overview"><h3>Observe. Understand.<br/>Choose. Repeat.</h3><p>Every stage has a different job. Open a stage to inspect its inputs, outputs and evidence boundary.</p></div>}{stages.map((s,i)=><details key={s.name} className="disclosure" open={selected===i} onToggle={e=>{if(e.currentTarget.open&&selected!==i)setSelected(i)}}><summary>{s.name} <span className="small">DESIGNED loop</span></summary><div className="motion-result"><h3>{s.purpose}</h3><p>{s.detail}</p><dl className="io"><dt>Input</dt><dd>{s.input}</dd><dt>Output</dt><dd>{s.output}</dd></dl><a className="text-link" href={s.href}>Inspect stage context</a>{selected===i&&<div className="controls"><button disabled={i===0} onClick={()=>setSelected(i-1)}>Previous</button><span className="small">Stage {i+1} of {stages.length}</span><button disabled={i===stages.length-1} onClick={()=>setSelected(i+1)}>Next</button></div>}</div></details>)}</div></div>}

const routeSteps={fast:['Recognise the observation','Reuse the known cluster','Select temporal analysis','Route to the stored model','Predict, then choose a scan'],escalation:['Detect a disagreement','Revisit the cluster evidence','Add relational or spatial skills','Compare specialist model outputs','Request review for a high-impact change']};
export function RouterWalkthrough(){const [path,setPath]=useState<'fast'|'escalation'>('fast'),[step,setStep]=useState(0),[skill,setSkill]=useState('temporal');const feedback=useFeedback(`${path}-${step}-${skill}`);const models:Record<string,string>={temporal:'SSM: temporal evolution',relational:'GNN: relations among observations',spatial:'ST-GNN: space and time together'};return <div className="router-widget" ref={feedback}><div className="controls"><button aria-pressed={path==='fast'} onClick={()=>{setPath('fast');setStep(0)}}>Fast path</button><button aria-pressed={path==='escalation'} onClick={()=>{setPath('escalation');setStep(0)}}>Escalation</button></div><ol className="router-lane">{routeSteps[path].map((s,i)=><li key={s} className={i===step?'selected':i<step?'complete':''}><span className="mono">0{i+1}</span>{s}</li>)}</ol><div className="split"><div><label htmlFor="skill-choice">Inspect a designed skill route</label><select id="skill-choice" value={skill} onChange={e=>setSkill(e.target.value)}><option value="temporal">Temporal</option><option value="relational">Relational</option><option value="spatial">Spatial and temporal</option></select><p className="route-output motion-result">{models[skill]}</p></div><div className="motion-result"><h3 aria-live="polite">{routeSteps[path][step]}</h3><p className="small">ILLUSTRATIVE WALKTHROUGH</p><p>No model runs in this browser. This sequence explains the proposed routing decisions.</p><div className="controls"><button onClick={()=>setStep(s=>s-1)} disabled={step===0}>Previous</button><button onClick={()=>setStep(s=>s+1)} disabled={step===4}>Next step</button><button onClick={()=>setStep(0)}>Reset route</button></div></div></div></div>}

const scenarios={periodic:{signal:['A','B','A','B','A','B'],fixed:['A','B','C','A','B','C'],adaptive:['A','B','A','B','A','B']},intermittent:{signal:['A','—','C','—','B','C'],fixed:['A','B','C','A','B','C'],adaptive:['A','B','C','A','C','B']}};
export function ScanDemo(){const [scenario,setScenario]=useState<'periodic'|'intermittent'>('periodic');const p=usePlayer(6,600),d=scenarios[scenario];return <div className="scan-demo" ref={p.ref}><div className="demo-toolbar"><div><h3>Fixed sweep / adaptive concept</h3><p className="small">ILLUSTRATIVE</p></div><label>Scenario <select value={scenario} onChange={e=>{p.reset();setScenario(e.target.value as typeof scenario)}}><option value="periodic">Periodic</option><option value="intermittent">Intermittent</option></select></label></div><p>Browser explanation, not the AVOLITE scheduler. Both policies are authored examples; the adaptive concept can also miss an observation.</p><div className="timeline"><div className="timeline-row"><strong>Emitter</strong>{d.signal.map((v,i)=><span key={i} className={i===p.step?'now':''}>{v}</span>)}</div>{(['fixed','adaptive'] as const).map(policy=><div className="timeline-row" key={policy}><strong>{policy==='fixed'?'Fixed sweep':'Adaptive concept'}</strong>{d[policy].map((v,i)=><span key={i} className={i===p.step?'now':''}>{v}<small>{i<=p.step?<><Symbol kind={v===d.signal[i]?'match':'miss'}/>{v===d.signal[i]?'Match':'Miss'}</>:'Scan'}</small></span>)}</div>)}</div><div className="controls" style={{visibility:p.ready?'visible':'hidden'}}><button onClick={p.next} disabled={p.step===5}>Step</button><button onClick={p.play} disabled={p.reduced}>{p.playing?'Pause':p.step===5?'Replay':'Play'}</button><button onClick={p.reset}>Reset</button><span aria-live="polite" className="small">{p.step<0?'Ready. Read left to right.':`Step ${p.step+1}: fixed ${d.fixed[p.step]===d.signal[p.step]?'matches':'misses'}, adaptive ${d.adaptive[p.step]===d.signal[p.step]?'matches':'misses'}.`}</span></div><p className="small muted">Bands A, B and C are schematic labels. Timing and outcomes are not measured results.</p></div>}

export function FailureExplorer(){const [selected,setSelected]=useState<number|null>(null);const feedback=useFeedback(selected);return <div className="failure-explorer" ref={feedback}><label htmlFor="failure-choice">Inspect a failure scenario</label><select id="failure-choice" value={selected??''} onChange={e=>setSelected(e.target.value===''?null:Number(e.target.value))}><option value="">All designed responses</option>{failures.map((f,i)=><option key={f[0]} value={i}>{f[0]}</option>)}</select><div className="failure-responses">{failures.map((f,i)=><article key={f[0]} hidden={selected!==null&&selected!==i} className="failure-row motion-result"><h3>{f[0]}</h3><dl className="io"><dt>Check</dt><dd>{f[1]}</dd><dt>Fallback</dt><dd>{f[2]}</dd><dt>Proof needed</dt><dd>{f[3]}</dd></dl></article>)}</div></div>}
export function HumanReview(){const [state,setState]=useState('waiting'),[reason,setReason]=useState('');const feedback=useFeedback<HTMLFormElement>(state);return <form className="review-form" ref={feedback} onSubmit={e=>{e.preventDefault();if(reason.trim())setState('modified')}}><h3>A proposed cluster needs a person.</h3><p className="small">ILLUSTRATIVE REVIEW</p><p>Unknown observation. Proposed action: create a permanent cluster after reviewing its evidence.</p><div className="controls"><button type="button" onClick={()=>setState('approved')}>Approve</button><button type="button" onClick={()=>setState('editing')}>Modify</button><button type="button" onClick={()=>setState('rejected')}>Reject</button><button type="button" onClick={()=>{setState('waiting');setReason('')}}>Reset</button></div>{state==='editing'&&<><label htmlFor="review-reason">Reason for modification</label><textarea id="review-reason" required maxLength={500} value={reason} onChange={e=>setReason(e.target.value)}/><button type="submit">Apply illustrative change</button></>}<output className="motion-result" aria-live="polite">{state==='waiting'?'Awaiting illustrative review.':state==='editing'?'Enter a reason before applying the change.':`Illustrative review outcome: ${state}. ${state==='modified'?reason:''}`}</output><p className="small muted">Local example only. Nothing is stored, submitted or applied to a receiver.</p></form>}
const roles=[['Evaluator','Start with the exported run, inspect its source, then compare the current evidence with the roadmap.','/evidence/','Inspect the evidence'],['RF / DSP engineer','Trace the processing and detection artifacts. Check the original figures and target-level errors.','/#built','Inspect the DSP foundation'],['System integrator','Inspect observation boundaries, model routing, human review and the proposed receiver fallback.','/system/','Explore the full system']];
export function RoleSelector(){const [active,setActive]=useState<number|null>(null);const feedback=useFeedback(active);return <div ref={feedback}><div className="controls">{roles.map((r,i)=><button key={r[0]} aria-pressed={active===i} onClick={()=>setActive(active===i?null:i)}>{r[0]}</button>)}</div><div className="role-panels">{roles.map((r,i)=><article className="motion-result" key={r[0]} hidden={active!==null&&active!==i}><h3>{r[0]}</h3><p>{r[1]}</p><a className="text-link" href={r[2]}>{r[3]}</a></article>)}</div></div>}

export function Widget({name,children}:{name:string;children:ReactNode}){return <div data-widget={name}>{children}</div>}
