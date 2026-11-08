import { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

/** Top-level section of the URL ("/players/x" → "players"). Sub-routes don't re-animate or re-scroll. */
const sectionOf = (pathname) => pathname.split('/')[1] || 'home';

function useScrollOnNavigate(section, hash) {
  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    // Lazy pages may mount a moment later — retry briefly for #anchor links.
    let tries = 0;
    let frame;
    const seek = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) target.scrollIntoView({ block: 'start' });
      else if (tries++ < 30) frame = requestAnimationFrame(seek);
    };
    seek();
    return () => cancelAnimationFrame(frame);
  }, [section, hash]);
}

function PageFallback() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center" role="status" aria-label="Loading">
      <span className="size-10 animate-spin rounded-full border-2 border-line border-t-brand" />
    </div>
  );
}

export default function SiteLayout() {
  const { pathname, hash } = useLocation();
  const section = sectionOf(pathname);
  const firstRender = useRef(true);
  useScrollOnNavigate(section, hash);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <motion.div
            key={section}
            initial={firstRender.current ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
