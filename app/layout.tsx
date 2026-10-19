import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Undertone — Your voice workspace',
  description: 'Direct, create, and capture with Fish Audio. A voice studio with a browser extension companion.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;550;600;650;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/></head><body>{children}</body></html>;
}
