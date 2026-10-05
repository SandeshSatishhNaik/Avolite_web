import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {RECORDING} from '../lib/demo';
import {CaptureImage} from './DashboardImage';

export function RecordingPlayer(){
 const [open,setOpen]=useState(false),ref=useRef<HTMLDivElement>(null),launch=useRef<HTMLAnchorElement>(null),close=useRef<HTMLButtonElement>(null);
 useLayoutEffect(()=>{
  if(!open)return;
  // Complete a keyboard focus scroll before the offscreen observer starts.
  ref.current?.scrollIntoView({block:'nearest',behavior:'instant'});
  close.current?.focus({preventScroll:true});
 },[open]);
 useEffect(()=>{
  if(!open)return;
  const stop=()=>{if(document.hidden)setOpen(false)};
  const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)setOpen(false)});
  if(ref.current)observer.observe(ref.current);
  document.addEventListener('visibilitychange',stop);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',stop)};
 },[open]);
 return <div className="recording-player" ref={ref}><div className="recording-frame">{open?<iframe title="AVOLITE dashboard prototype recording" src={RECORDING.preview} allow="autoplay; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<a className="recording-launch" ref={launch} href={RECORDING.view} target="_blank" rel="noopener noreferrer" onClick={e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();setOpen(true)}}><CaptureImage id="recording-poster"/><span className="recording-action"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m10 6 12 8-12 8Z"/></svg>Watch the walkthrough</span></a>}</div><div className="recording-meta"><span className="small">Dashboard recording · 5:16</span>{open&&<button ref={close} type="button" onClick={()=>{setOpen(false);requestAnimationFrame(()=>launch.current?.focus())}}>Close recording</button>}</div><p className="small"><a href={RECORDING.view} target="_blank" rel="noopener noreferrer">Open recording in Drive</a> if the embedded player is unavailable.</p></div>;
}
