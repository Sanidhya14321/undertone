import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/seo';
import { featureSlugs } from '../lib/features';
import { guideSlugs, guideUpdated } from '../lib/guides';
export default function sitemap():MetadataRoute.Sitemap {
  return ['/',...featureSlugs.map(s=>`/features/${s}`),'/extension','/privacy','/guides','/help',...guideSlugs.map(s=>`/guides/${s}`)].map(path=>({url:new URL(path,siteUrl).href,lastModified:guideUpdated,changeFrequency:'monthly',priority:path==='/'?1:path==='/privacy'?.3:.8}));
}
