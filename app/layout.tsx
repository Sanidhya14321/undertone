import type { Metadata } from 'next';
import { siteUrl, siteDescription } from '../lib/seo';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {default:'Undertone — AI Voice Studio & Browser Extension',template:'%s | Undertone'},
  description: siteDescription,
  applicationName:'Undertone',
  category:'productivity',
  robots:{index:true,follow:true},
  icons:{icon:'/favicon.svg'},
  openGraph:{type:'website',siteName:'Undertone',locale:'en_US',title:'Undertone — AI Voice Studio & Browser Extension',description:siteDescription,url:siteUrl,images:[{url:'/opengraph-image',width:1200,height:630,alt:'Undertone — give your words a voice'}]},
  twitter:{card:'summary_large_image',title:'Undertone — AI Voice Studio & Browser Extension',description:siteDescription,images:['/opengraph-image']},
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;550;600;650;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/></head><body>{children}</body></html>;
}
