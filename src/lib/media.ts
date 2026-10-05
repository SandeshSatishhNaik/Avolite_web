import storage from './storage.json';

export function mediaUrl(file:string){
 return `${import.meta.env.PROD?storage.mediaBase:'/media'}/${file}`;
}
