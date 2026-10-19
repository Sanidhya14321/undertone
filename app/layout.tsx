import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { siteUrl, siteDescription } from '../lib/seo';
import './globals.css';
const dmSans = localFont({src:'./fonts/dm-sans-latin.woff2',weight:'400 700',style:'normal',display:'swap',variable:'--font-dm-sans'});
const plexMono = localFont({src:[{path:'./fonts/ibm-plex-mono-400-latin.woff2',weight:'400',style:'normal'},{path:'./fonts/ibm-plex-mono-500-latin.woff2',weight:'500',style:'normal'}],display:'swap',preload:false,variable:'--font-plex-mono'});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {default:'Undertone — AI Voice Studio & Browser Extension',template:'%s | Undertone'},
  description: siteDescription,
  applicationName:'Undertone',
  category:'productivity',
  verification:{google:process.env.GOOGLE_SITE_VERIFICATION || undefined,other:process.env.BING_SITE_VERIFICATION ? {'msvalidate.01':process.env.BING_SITE_VERIFICATION} : {}},
  robots:{index:true,follow:true},
  icons:{icon:'/favicon.svg'},
  openGraph:{type:'website',siteName:'Undertone',locale:'en_US',title:'Undertone — AI Voice Studio & Browser Extension',description:siteDescription,url:siteUrl,images:[{url:'/opengraph-image',width:1200,height:630,alt:'Undertone — give your words a voice'}]},
  twitter:{card:'summary_large_image',title:'Undertone — AI Voice Studio & Browser Extension',description:siteDescription,images:['/opengraph-image']},
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en" className={`${dmSans.variable} ${plexMono.variable}`}><body>{children}</body></html>;
}
