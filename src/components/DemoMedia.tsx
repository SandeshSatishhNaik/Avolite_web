import {DASHBOARD_URL,DASHBOARD_CAPTURES} from '../lib/demo';
import sizes from '../lib/dashboard.generated.json';
import {Tag} from './Primitives';
import {Symbol} from './Symbol';

import {CaptureImage} from './DashboardImage';
import {mediaUrl} from '../lib/media';

export function DashboardCapture({id='smart-scan'}:{id?:keyof typeof sizes}){
 const capture=DASHBOARD_CAPTURES.find(c=>c.id===id)!;
 return <figure className="dashboard-capture"><a className="dashboard-plate" href={mediaUrl(`dashboard-${id}-1920.webp`)} aria-label={`Open full ${capture.title} capture`}><CaptureImage id={id}/><span className="plate-action">Inspect capture <Symbol/></span></a><figcaption><Tag status="PROTOTYPE"/><strong>{capture.title}</strong><p>{capture.description}</p><p className="small">Interface values are illustrative. <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer">Open source dashboard</a></p></figcaption></figure>;
}

export function DashboardGallery(){return <div className="dashboard-gallery"><DashboardCapture/>{DASHBOARD_CAPTURES.slice(1).map(c=><details className="disclosure" key={c.id}><summary>Inspect {c.title.toLowerCase()}</summary><DashboardCapture id={c.id as keyof typeof sizes}/></details>)}</div>}
