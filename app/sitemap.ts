import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/seo';
import { featureSlugs } from '../lib/features';
export default function sitemap():MetadataRoute.Sitemap {
  return ['/',...featureSlugs.map(s=>`/features/${s}`),'/extension','/privacy'].map(path=>({url:new URL(path,siteUrl).href,changeFrequency:'monthly',priority:path==='/'?1:path==='/privacy'?.3:.8}));
}
