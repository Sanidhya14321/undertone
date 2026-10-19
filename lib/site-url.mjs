export function resolveSiteUrl(env = process.env) {
  const explicit = env.NEXT_PUBLIC_SITE_URL;
  const domain = env.VERCEL_PROJECT_PRODUCTION_URL;
  const raw = explicit || (domain ? `https://${domain}` : 'http://localhost:3000');
  const url = new URL(raw);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Site URL must use HTTP or HTTPS.');
  return url.origin;
}
