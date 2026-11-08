import { Archivo, Geist, Geist_Mono, Noto_Sans_Gujarati } from 'next/font/google';
import '../styles/index.css';
import { ThemeProvider } from '../hooks/useTheme';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MotionObserver from '../components/layout/MotionObserver';

const archivo = Archivo({ subsets: ['latin'], weight: 'variable', axes: ['wdth'], variable: '--font-archivo', display: 'swap' });
const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });
const gujarati = Noto_Sans_Gujarati({ subsets: ['gujarati'], weight: '600', variable: '--font-gujarati', display: 'swap', preload: false });

const TITLE = 'SSG Premier League · Season 3 Coming Soon';
const DESCRIPTION =
  'SSG Premier League by Satva Shiv Gold Yuva Mandal, Ahmedabad. Season 3 is coming soon. Meet the players, the teams, the partners and relive every season.';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: TITLE, template: '%s · SSG Premier League' },
  description: DESCRIPTION,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'SSG Premier League',
    title: TITLE,
    description: 'Where business meets the boundary. Meet the players, teams and partners of SSGPL.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#040710',
  colorScheme: 'dark light',
};

/* Runs before first paint: applies the saved theme and turns on JS-only entrance states. */
const BOOT_SCRIPT = `(function(){var t='dark';try{var s=localStorage.getItem('ssgpl-theme');if(s==='light'||s==='dark')t=s}catch(e){}var r=document.documentElement;r.setAttribute('data-theme',t);r.style.colorScheme=t;r.classList.add('js')})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable} ${gujarati.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <a
            href="#main"
            className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <MotionObserver />
        </ThemeProvider>
      </body>
    </html>
  );
}
