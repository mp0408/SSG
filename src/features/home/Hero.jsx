import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CURRENT_SEASON, LATEST_PLAYED } from '../../data/seasons';
import { SITE } from '../../data/site';
import { PLAYERS } from '../../lib/directory';
import { EASE_OUT, rise, stagger } from '../../lib/motion';
import HeroCanvas from '../../components/webgl/HeroCanvas';
import Button from '../../components/ui/Button';
import StatusPill from '../../components/ui/StatusPill';
import Ticker from './Ticker';

/**
 * The ball in the WebGL scene is positioned on `.ball-slot`, so it reads as
 * the "0" of the season number at every screen size.
 */
export default function Hero() {
  const ballRef = useRef(null);
  const [gl, setGl] = useState('pending');
  const season = CURRENT_SEASON.number;

  return (
    <section data-gl={gl} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <HeroCanvas anchorRef={ballRef} onStatus={setGl} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />

      <div className="shell relative z-10 grid flex-1 content-center gap-y-6 pb-12 pt-24 sm:pt-28 lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:pt-24">
        <div className="lg:order-2 lg:col-span-6 lg:flex lg:justify-end">
          <h1 aria-label={`${SITE.name} — Season ${season}, coming soon`} className="inline-flex flex-col">
            <motion.span
              aria-hidden
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT }}
              className="t-serif relative z-10 -mb-[0.12em] pl-[0.06em] text-[clamp(3.25rem,14vw,7rem)] leading-none text-ink"
            >
              Season
            </motion.span>
            <span aria-hidden className="t-display flex items-center text-[clamp(13rem,64vw,26rem)] leading-[0.8]">
              <span ref={ballRef} className="ball-slot mr-[0.03em]" />
              <motion.span
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.1, delay: 0.25, ease: EASE_OUT }}
                className="text-gradient-brand"
              >
                {season}
              </motion.span>
            </span>
          </h1>
        </div>

        <motion.div variants={stagger(0.08, 0.35)} initial="hidden" animate="show" className="lg:order-1 lg:col-span-6">
          <motion.div variants={rise}>
            <StatusPill>Season {season} · Coming soon</StatusPill>
          </motion.div>
          <motion.p variants={rise} lang="gu" className="mt-6 font-gujarati text-[15px] font-semibold text-ink-2">
            {SITE.organiserGujarati}
          </motion.p>
          <motion.p variants={rise} className="t-display mt-3 max-w-xl text-[clamp(2.75rem,10vw,5.25rem)] text-ink">
            Where business meets the <span className="t-serif text-brand-ink">boundary.</span>
          </motion.p>
          <motion.p variants={rise} className="mt-5 max-w-md text-pretty text-base leading-relaxed text-ink-2 sm:text-lg">
            Squads, fixtures and the auction date land soon. Until then, meet the {PLAYERS.length} players — and the businesses
            behind them — who made Season {LATEST_PLAYED.number}.
          </motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3">
            <Button to="/players" icon="arrowRight">
              Meet the players
            </Button>
            <Button to="/gallery" variant="secondary">
              Relive Season {LATEST_PLAYED.number}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <Ticker />
    </section>
  );
}
