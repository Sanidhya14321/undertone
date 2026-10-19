import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { resolveSiteUrl } from '../lib/site-url.mjs';

const start = process.argv.includes('--start');
const argument = process.argv.slice(2).find(arg => !arg.startsWith('--'));
const base = new URL(start ? 'http://127.0.0.1:3001' : argument || 'https://undertone.vercel.app');
const canonicalOrigin = start ? resolveSiteUrl() : base.origin;
const server = start ? spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3001'], { stdio: ['ignore', 'pipe', 'pipe'] }) : null;
let serverLog = '';
server?.stdout.on('data', data => { serverLog = (serverLog + data).slice(-5000); });
server?.stderr.on('data', data => { serverLog = (serverLog + data).slice(-5000); });
const request = (path, options = {}) => fetch(new URL(path, base), { ...options, signal: AbortSignal.timeout(30_000) });
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
const attribute = (tag, name) => decode(tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] || '');
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => match[0]);
const meta = (html, name) => tags(html, 'meta').find(tag => attribute(tag, 'name') === name || attribute(tag, 'property') === name);

try {
  if (server) {
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt++) {
      assert(server.exitCode === null, `Production server exited: ${serverLog}`);
      try { if ((await request('/')).ok) { ready = true; break; } } catch {}
      await delay(250);
    }
    assert(ready, `Production server did not become ready: ${serverLog}`);
  }

  const sitemapResponse = await request('/sitemap.xml');
  assert.equal(sitemapResponse.status, 200, 'Sitemap must be public');
  const sitemap = await sitemapResponse.text();
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decode(match[1]));
  assert(urls.length >= 6, 'Sitemap must contain public pages');
  assert.equal(new Set(urls).size, urls.length, 'Sitemap URLs must be unique');
  const pages = await Promise.all(urls.map(async url => {
    const expected = new URL(url);
    assert.equal(expected.origin, canonicalOrigin, `Unexpected sitemap origin: ${url}`);
    assert(!/^\/(studio|api|downloads)(\/|$)/.test(expected.pathname), 'User work and downloads must stay out of the sitemap');
    const response = await request(expected.pathname);
    assert.equal(response.status, 200, `${url} must load without authentication`);
    const html = await response.text();
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = attribute(meta(html, 'description') || '', 'content');
    const canonical = tags(html, 'link').find(tag => attribute(tag, 'rel') === 'canonical');
    assert(title && description, `${url} needs a title and description`);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${url} needs one H1`);
    assert.equal(new URL(attribute(canonical || '', 'href')).href, url, `${url} canonical must match sitemap`);
    assert(!attribute(meta(html, 'robots') || '', 'content').includes('noindex'), `${url} must be indexable`);
    assert(!response.headers.get('x-robots-tag')?.includes('noindex'), `${url} response must be indexable`);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert(attribute(meta(html, 'og:image') || '', 'content').startsWith(canonicalOrigin), `${url} needs a production share image`);
    assert(!/fonts\.(googleapis|gstatic)\.com/.test(html), `${url} must use self-hosted fonts`);
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
    if (expected.pathname === '/') assert(schemas.some(schema => schema['@type'] === 'WebSite'), 'Home needs site-name structured data');
    return { path: expected.pathname, title, description, html };
  }));
  assert.equal(new Set(pages.map(page => page.title)).size, pages.length, 'Public titles must be distinct');
  assert.equal(new Set(pages.map(page => page.description)).size, pages.length, 'Public descriptions must be distinct');

  const internalPaths = new Set();
  for (const page of pages) {
    for (const tag of tags(page.html, 'a')) {
      const href = attribute(tag, 'href');
      if (!href || href.startsWith('#')) continue;
      const target = new URL(href, base);
      if (target.origin === base.origin) internalPaths.add(target.pathname);
    }
  }
  await Promise.all([...internalPaths].filter(path => !pages.some(page => page.path === path)).map(async path => {
    assert.equal((await request(path)).status, 200, `Internal link is broken: ${path}`);
  }));

  const studio = await request('/studio');
  assert.equal(studio.status, 200);
  assert(studio.headers.get('x-robots-tag')?.includes('noindex'), 'Studio response must carry noindex');
  assert(attribute(meta(await studio.text(), 'robots') || '', 'content').includes('noindex'), 'Studio HTML must carry noindex');
  const robots = await (await request('/robots.txt')).text();
  assert(robots.includes(`${canonicalOrigin}/sitemap.xml`));
  assert(!/Disallow:\s*\/studio/.test(robots), 'Crawlers must be allowed to read studio noindex');
  for (const path of ['/not-a-page', '/guides/not-a-guide', '/features/not-a-feature', '/guides/toString', '/features/constructor']) assert.equal((await request(path)).status, 404, `Unknown pages must return a real 404: ${path}`);
  const redirect = await request('/home', { redirect: 'manual' });
  assert([301, 308].includes(redirect.status), 'Legacy homepage needs a permanent redirect');
  const image = await request('/opengraph-image');
  assert.equal(image.headers.get('content-type'), 'image/png');
  const png = new Uint8Array(await image.arrayBuffer());
  assert.deepEqual([...png.slice(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  const api = await request('/api/fish/v1/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(api.status, 401, 'API must require a user key');
  assert.match((await api.json()).message, /API key/);
  console.log(`Verified ${pages.length} public pages, ${internalPaths.size} internal paths, canonical URLs, metadata, JSON-LD, robots, studio noindex, share image, 404s, redirect, and API key boundary.`);
  console.log('No billable Fish Audio request was made.');
} catch (error) {
  console.error(error.message);
  if (serverLog && server?.exitCode !== null) console.error(serverLog);
  process.exitCode = 1;
} finally {
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await Promise.race([new Promise(resolve => server.once('exit', resolve)), delay(5000)]);
    if (server.exitCode === null) server.kill('SIGKILL');
  }
}
