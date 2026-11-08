import { CURRENT_SEASON, LATEST_PLAYED } from '../../data/seasons';
import { SITE } from '../../data/site';
import { PLAYERS } from '../../lib/directory';
import HeroBall from '../../components/webgl/HeroCanvas';
import Button from '../../components/ui/Button';
import StatusPill from '../../components/ui/StatusPill';
import Ticker from './Ticker';

/** The WebGL ball stands in for the "0" of the season number at every screen size. */
export default function Hero() {
  const season = CURRENT_SEASON.number;

  return (
    <section data-offscreen-pause="" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-sky" />
        <div className="hero-beam -left-[12vmax]" />
        <div className="hero-beam -right-[12vmax] [animation-delay:-6s] [animation-direction:alternate-reverse]" />
        <div className="grid-floor">
          <i />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(180deg,transparent,rgb(var(--bg))_34%,transparent_66%,rgb(var(--bg)))]" />
      </div>

      <div className="shell relative grid flex-1 content-center gap-y-5 pb-8 pt-[calc(var(--header)+1rem)] sm:gap-y-8 lg:grid-cols-12 lg:items-center lg:gap-x-10">
        <div className="lg:order-2 lg:col-span-6 lg:flex lg:justify-end">
          <h1 aria-label={`${SITE.name}, Season ${season}, coming soon`} className="inline-flex flex-col">
            <span aria-hidden className="t-display rise relative z-10 pl-[0.04em] text-[clamp(2.25rem,10vw,5.5rem)] leading-none text-ink" style={{ '--d': '60ms' }}>
              Season
            </span>
            <span aria-hidden className="t-display flex items-center text-[clamp(9.5rem,min(46vw,50svh),26rem)] leading-[0.82]">
              <HeroBall />
              <span className="text-gradient-brand rise" style={{ '--d': '160ms' }}>
                {season}
              </span>
            </span>
          </h1>
        </div>

        <div className="lg:order-1 lg:col-span-6">
          <div className="rise" style={{ '--d': '220ms' }}>
            <StatusPill>Season {season} · Coming soon</StatusPill>
          </div>
          <p lang="gu" className="rise mt-4 font-gujarati text-[15px] font-semibold text-ink-2 sm:mt-6" style={{ '--d': '280ms' }}>
            {SITE.organiserGujarati}
          </p>
          <p className="t-display rise mt-2.5 max-w-xl text-[clamp(2.5rem,10vw,5.25rem)] text-ink sm:mt-3" style={{ '--d': '330ms' }}>
            Where business meets the <span className="t-accent">boundary.</span>
          </p>
          <p className="rise mt-4 max-w-md text-pretty text-base leading-relaxed text-ink-2 sm:mt-5 sm:text-lg" style={{ '--d': '390ms' }}>
            Squads, fixtures and the auction date land soon. Until then, meet the {PLAYERS.length} players, and the businesses behind them, who made Season {LATEST_PLAYED.number}.
          </p>
          <div className="rise mt-6 flex flex-wrap gap-3 sm:mt-8" style={{ '--d': '450ms' }}>
            <Button to="/players" icon="arrowRight" className="whitespace-nowrap max-sm:flex-auto max-sm:px-3">
              Meet the players
            </Button>
            <Button to="/gallery" variant="secondary" className="whitespace-nowrap max-sm:flex-auto max-sm:px-3">
              Relive Season {LATEST_PLAYED.number}
            </Button>
          </div>
        </div>
      </div>

      <Ticker />
    </section>
  );
}
