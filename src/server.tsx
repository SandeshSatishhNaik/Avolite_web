import {renderToString} from 'react-dom/server';
import App from './App';
const titles:Record<string,string>={'/':'AVOLITE','/system/':'System | AVOLITE','/evidence/':'Evidence | AVOLITE','/preview/':'Component preview','/404/':'Page not found | AVOLITE'};
const site=process.env.SITE_URL || process.env.CF_PAGES_URL || 'https://avolite.example';
export function render(route:string){
 const title=titles[route]??titles['/404/'];
 const noindex=['/preview/','/404/'].includes(route);
 const canonical=new URL(route,site).href.replaceAll('&','&amp;').replaceAll('"','&quot;');
 return {head:`<title>${title}</title><meta name="description" content="Explore AVOLITE’s designed smart-scan loop and inspect its radar DSP simulation evidence."/>${noindex?'<meta name="robots" content="noindex"/>':''}<link rel="canonical" href="${canonical}"/>`,body:renderToString(<App route={route}/>)};
}
