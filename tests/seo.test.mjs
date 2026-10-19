import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {resolveSiteUrl} from '../lib/site-url.mjs';
test('canonical origin prefers explicit configuration and uses stable Vercel production domain',()=>{
 assert.equal(resolveSiteUrl({NEXT_PUBLIC_SITE_URL:'https://example.com/some/path'}),'https://example.com');
 assert.equal(resolveSiteUrl({VERCEL_PROJECT_PRODUCTION_URL:'undertone.vercel.app',VERCEL_URL:'random-preview.vercel.app'}),'https://undertone.vercel.app');
 assert.equal(resolveSiteUrl({}),'http://localhost:3000');
 assert.throws(()=>resolveSiteUrl({NEXT_PUBLIC_SITE_URL:'javascript:alert(1)'}));
});
test('private studio and API routes stay out of search results',()=>{
 const robots=fs.readFileSync('app/robots.ts','utf8');assert.match(robots,/\/api\//);assert.match(robots,/\/studio/);
 const studio=fs.readFileSync('app/studio/page.tsx','utf8');assert.match(studio,/index:false/);
 const sitemap=fs.readFileSync('app/sitemap.ts','utf8');assert(!sitemap.includes("'/studio'"));assert(!sitemap.includes("'/api'"));
});
test('Vercel upload and execution limits are declared before deployment',()=>{
 const proxy=fs.readFileSync('lib/fish-proxy.mjs','utf8');assert.match(proxy,/MAX_UPLOAD = 4\.25 \* 1024 \* 1024/);
 const route=fs.readFileSync('app/api/fish/[...path]/route.ts','utf8');assert.match(route,/maxDuration = 300/);
 const studio=fs.readFileSync('components/studio/Studio.tsx','utf8');assert(!studio.includes('24 MB'));
});
