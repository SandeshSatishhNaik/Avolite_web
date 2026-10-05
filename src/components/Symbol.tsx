export function Symbol({kind='arrow'}:{kind?:'arrow'|'plus'|'match'|'miss'}){
 return <svg className={`symbol symbol--${kind}`} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{kind==='arrow'?<path d="M2 10h15m-6-6 6 6-6 6"/>:kind==='plus'?<path d="M10 3v14M3 10h14"/>:kind==='match'?<><circle cx="10" cy="10" r="6"/><path d="m6 10 3 3 5-6"/></>:<><circle cx="10" cy="10" r="6"/><path d="m7 7 6 6m0-6-6 6"/></>}</svg>;
}
