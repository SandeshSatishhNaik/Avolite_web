import {DASHBOARD_CAPTURES} from '../lib/demo';
import sizes from '../lib/dashboard.generated.json';
import {mediaUrl} from '../lib/media';

export function CaptureImage({id}:{id:keyof typeof sizes}){
 const size=sizes[id];
 return <img src={mediaUrl(`dashboard-${id}-1280.webp`)} srcSet={[640,1280,1920].map(width=>`${mediaUrl(`dashboard-${id}-${width}.webp`)} ${width}w`).join(', ')} sizes="(max-width:767px) calc(100vw - 32px), (max-width:1279px) calc(100vw - 80px), 900px" width={size.width} height={size.height} loading="lazy" decoding="async" alt={`${DASHBOARD_CAPTURES.find(c=>c.id===id)?.title??'RF processing in the dashboard recording'} prototype interface, with simulated data`}/>;
}
