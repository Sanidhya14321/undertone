import type { Metadata } from 'next';
import { resolveSiteUrl } from './site-url.mjs';
export const siteUrl = resolveSiteUrl();
export const productName = 'Undertone';
export const siteDescription = 'Create expressive speech, direct multi-speaker dialogue, clone voices, and transcribe audio with your Fish Audio key. Includes a Chrome and Edge extension.';
export function pageMetadata(title:string,description:string,path:string):Metadata {
  return {title,description,alternates:{canonical:path},openGraph:{title:`${title} | Undertone`,description,url:path,type:'website',siteName:'Undertone',images:[{url:'/opengraph-image',width:1200,height:630,alt:'Undertone — a voice workspace powered by Fish Audio'}]},twitter:{card:'summary_large_image',title:`${title} | Undertone`,description,images:['/opengraph-image']}};
}
export function jsonLd(data:unknown){return JSON.stringify(data).replace(/</g,'\\u003c');}
