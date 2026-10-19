import { proxyFish } from '../../../../lib/fish-proxy.mjs';
async function handle(request: Request) {
  const path = new URL(request.url).pathname.replace(/^\/api\/fish\//, '');
  return proxyFish(request, path);
}
export const POST = handle;
export const GET = handle;

export const runtime = 'nodejs';
export const maxDuration = 300;
export const dynamic = 'force-dynamic';
