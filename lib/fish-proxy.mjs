/** A narrow Fish Audio proxy. Credentials are request-scoped and never stored. */
const API_ORIGIN = 'https://api.fish.audio';
const ROUTES = new Map([
  ['v1/tts', ['POST']],
  ['v1/asr', ['POST']],
  ['v1/voice-design', ['POST']],
  ['model', ['GET', 'POST']],
  ['wallet/self/api-credit', ['GET']],
]);
const MODELS = {
  'v1/tts': new Set(['drama-3', 's2.1-pro', 's2.1-pro-free', 's2-pro']),
  'v1/asr': new Set(['transcribe-1-pro']),
  'v1/voice-design': new Set(['voice-design-1']),
};
const MAX_UPLOAD = 25 * 1024 * 1024;
function jsonError(message, status) {
  return Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });
}
async function readLimited(request) {
  if (Number(request.headers.get('content-length')) > MAX_UPLOAD) throw new Error('size');
  if (!request.body) return null;
  const reader = request.body.getReader();
  const parts = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > MAX_UPLOAD) { await reader.cancel(); throw new Error('size'); }
    parts.push(value);
  }
  const output = new Uint8Array(size); let offset = 0;
  for (const part of parts) { output.set(part, offset); offset += part.length; }
  return output;
}
export async function proxyFish(request, path, fetcher = fetch) {
  const methods = ROUTES.get(path);
  if (!methods || !methods.includes(request.method)) return jsonError('This operation is not supported.', 404);
  const key = request.headers.get('x-fish-key')?.trim();
  if (!key || key.length > 4096 || /[\r\n]/.test(key)) return jsonError('Connect your Fish Audio API key to continue.', 401);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return jsonError('Cross-origin requests are not allowed.', 403);
  const model = request.headers.get('model');
  if (MODELS[path] && !MODELS[path].has(model)) return jsonError('Choose a supported model for this operation.', 400);
  const target = new URL('/' + path, API_ORIGIN);
  // Only documented, read-only voice search parameters can be forwarded.
  if (path === 'model' && request.method === 'GET') {
    const source = new URL(request.url);
    for (const name of ['page_size','page_number','title','language','self','sort_by']) {
      const value = source.searchParams.get(name); if (value) target.searchParams.set(name, value);
    }
  }
  const headers = new Headers({ Authorization: `Bearer ${key}` });
  if (model) headers.set('model', model);
  if (request.headers.has('content-type')) headers.set('Content-Type', request.headers.get('content-type'));
  try {
    const body = request.method === 'GET' ? undefined : await readLimited(request);
    const response = await fetcher(target, {
      method: request.method, headers, body,
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(path === 'v1/asr' ? 900000 : 180000)]),
      redirect: 'error',
    });
    if (!response.ok) {
      let detail = '';
      try { const data = await response.json(); detail = data.message || data.detail || data.reason || ''; } catch { /* Use safe, actionable defaults. */ }
      if (typeof detail !== 'string') detail = '';
      const defaults = {401:'The API key was not accepted. Check it in Connection settings.',402:'Your Fish Audio account needs API credit for this request.',403:'This key does not have access to the requested model.',429:'Fish Audio is busy or your rate limit was reached. Wait a moment and try again.'};
      return jsonError(defaults[response.status] || detail.replaceAll(key,'[redacted]').slice(0,400) || 'Fish Audio could not complete this request.', response.status);
    }
    const outputHeaders = new Headers({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    outputHeaders.set('Content-Type',response.headers.get('content-type') || (path==='v1/tts'?'audio/mpeg':'application/json'));
    return new Response(response.body,{status:response.status,headers:outputHeaders});
  } catch (error) {
    if (error.message === 'size') return jsonError('Keep audio uploads under 25 MB.', 413);
    if (error.name === 'AbortError' || error.name === 'TimeoutError') return jsonError('The request was cancelled or took too long. You can try again.', 504);
    return jsonError('Could not reach Fish Audio. Check your connection and try again.', 502);
  }
}
