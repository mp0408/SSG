import { Link } from 'react-router-dom';
import { NAV_LINKS, SITE } from '../../data/site';
import { CURRENT_SEASON } from '../../data/seasons';
import Logo from '../brand/Logo';
import FooterPitch from './FooterPitch';
import Icon from '../ui/Icon';
import StatusPill from '../ui/StatusPill';
import Reveal from '../ui/Reveal';

export default function Footer() {
  const nextStep = CURRENT_SEASON.roadmap?.find((step) => step.state === 'next');

  return (
    <footer className="relative overflow-hidden border-t border-line/70 bg-bg-2">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(60%_80%_at_50%_100%,rgb(var(--brand)/0.14),transparent_70%)]" />

      <div className="shell relative pt-16 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <Logo className="h-16 w-auto sm:h-20" />
            <p className="t-serif mt-8 max-w-sm text-3xl leading-tight text-ink sm:text-4xl">{SITE.tagline}</p>
            <p lang="gu" className="mt-6 font-gujarati text-sm font-semibold text-ink-2">
              {SITE.organiserGujarati}
            </p>
            <p className="mt-1 text-sm text-ink-3">
              {SITE.organiser} · {SITE.city}
            </p>
            <a
              href={SITE.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-3 rounded-full border border-line bg-surface/70 py-1.5 pl-1.5 pr-5 transition-colors hover:border-[#e1306c]/50"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(45deg,#f9a825,#e1306c_45%,#833ab4)] text-white transition-transform duration-500 group-hover:rotate-[360deg]">
                <Icon name="instagram" className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold text-ink">@{SITE.social.instagram.handle}</span>
                <span className="block text-xs text-ink-3">Follow SSGPL on Instagram</span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.05} className="lg:col-span-3">
            <p className="t-label mb-5 text-ink-3">Explore</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="group inline-flex items-center gap-2 text-ink-2 transition-colors hover:text-ink">
                    <span className="h-px w-0 bg-brand-ink transition-all duration-300 group-hover:w-3" aria-hidden />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4">
            <div className="card p-6 sm:p-7">
              <StatusPill>Season {CURRENT_SEASON.number} · Coming soon</StatusPill>
              {nextStep && (
                <p className="mt-5 text-ink-2">
                  Up next: <span className="font-medium text-ink">{nextStep.title}</span>
                  <span className="text-ink-3"> — {nextStep.when.toLowerCase()}.</span>
                </p>
              )}
              <div className="mt-6 flex flex-col gap-2">
                <Link to="/players" className="flex items-center justify-between rounded-2xl border border-line bg-surface-2/60 px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-brand/50">
                  Find a player or business <Icon name="arrowRight" className="size-4 text-ink-3" />
                </Link>
                <Link to={`/sponsors?season=${CURRENT_SEASON.number}`} className="flex items-center justify-between rounded-2xl border border-line bg-surface-2/60 px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-brand/50">
                  Partner with Season {CURRENT_SEASON.number} <Icon name="arrowRight" className="size-4 text-ink-3" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Stadium stage: wordmark as ground signage, live delivery in front */}
      <div aria-hidden className="relative mt-12 h-[260px] select-none overflow-hidden sm:mt-16 md:aspect-[1200/420] md:h-auto">
        <p className="t-display text-outline absolute inset-x-0 top-2 whitespace-nowrap text-center text-[clamp(5.5rem,21vw,17rem)] leading-[0.8] opacity-70 [mask-image:linear-gradient(180deg,#000_35%,transparent_90%)]">
          SSGPL
        </p>
        <FooterPitch className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg-2 to-transparent" />
      </div>

      <div className="relative border-t border-line/70">
        <div className="shell safe-bottom flex flex-col gap-4 py-6 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <p>
              Built by{' '}
              <Link to={`/players/${SITE.credit.playerSlug}`} className="font-medium text-ink-2 underline-offset-4 hover:text-ink hover:underline">
                {SITE.credit.name}
              </Link>
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex size-9 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:text-ink"
              aria-label="Back to top"
            >
              <Icon name="arrowUp" className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
