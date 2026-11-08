import Link from 'next/link';
import { NAV_LINKS, SITE } from '../../data/site';
import { CURRENT_SEASON } from '../../data/seasons';
import Logo from '../brand/Logo';
import Icon from '../ui/Icon';
import StatusPill from '../ui/StatusPill';
import Reveal from '../ui/Reveal';
import BackToTop from './BackToTop';

const QUICK_LINK = 'flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-2/60 px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-glow/50';

export default function Footer() {
  const nextStep = CURRENT_SEASON.roadmap?.find((step) => step.state === 'next');

  return (
    <footer className="relative overflow-hidden border-t border-line/70 bg-bg-2">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(60%_80%_at_50%_100%,rgb(var(--brand)/0.16),transparent_70%)]" />

      <div className="shell relative pt-14 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <Logo className="h-14 w-auto sm:h-20" />
            <p className="t-display mt-6 max-w-sm text-balance text-3xl text-ink sm:mt-8 sm:text-4xl">{SITE.tagline}</p>
            <p lang="gu" className="mt-5 font-gujarati text-sm font-semibold text-ink-2">
              {SITE.organiserGujarati}
            </p>
            <p className="mt-1 text-sm text-ink-3">
              {SITE.organiser} · {SITE.city}
            </p>
            <a
              href={SITE.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex max-w-full items-center gap-3 rounded-lg border border-line bg-surface/70 py-1.5 pl-1.5 pr-4 transition-colors hover:border-[#e1306c]/50"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[linear-gradient(45deg,#f9a825,#e1306c_45%,#833ab4)] text-white">
                <Icon name="instagram" className="size-5" />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-semibold text-ink">@{SITE.social.instagram.handle}</span>
                <span className="block text-xs text-ink-3">Follow SSGPL on Instagram</span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.05} className="lg:col-span-3">
            <p className="t-label mb-4 text-ink-3">Explore</p>
            <ul className="grid grid-cols-2 gap-x-6 lg:grid-cols-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link href={link.to} className="block py-2 text-ink-2 transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4">
            <div className="card p-5 sm:p-7">
              <StatusPill>Season {CURRENT_SEASON.number} · Coming soon</StatusPill>
              {nextStep && (
                <p className="mt-5 text-ink-2">
                  Up next: <span className="font-medium text-ink">{nextStep.title}</span>
                  <span className="text-ink-3">, {nextStep.when.toLowerCase()}.</span>
                </p>
              )}
              <div className="mt-5 flex flex-col gap-2">
                <Link href="/players" className={QUICK_LINK}>
                  Find a player or business <Icon name="arrowRight" className="size-4 shrink-0 text-ink-3" />
                </Link>
                <Link href={`/sponsors?season=${CURRENT_SEASON.number}`} className={QUICK_LINK}>
                  Partner with Season {CURRENT_SEASON.number} <Icon name="arrowRight" className="size-4 shrink-0 text-ink-3" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Wordmark as ground signage, floor grid below, the odd six sailing over */}
      <div aria-hidden data-offscreen-pause className="relative mt-10 h-[150px] select-none overflow-hidden sm:mt-16 sm:h-[230px] lg:h-[300px]">
        <p className="t-display text-outline absolute inset-x-0 top-1 whitespace-nowrap text-center text-[clamp(5.5rem,27vw,21rem)] leading-[0.8]">SSGPL</p>
        <div className="grid-floor !h-[62%]">
          <i />
        </div>
        <span className="six-x">
          <span className="six-y">
            <span className="six-ball" />
          </span>
        </span>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg-2 to-transparent" />
      </div>

      <div className="relative border-t border-line/70">
        <div className="shell safe-bottom flex items-center justify-between gap-4 py-4 text-sm text-ink-3">
          <div className="min-w-0 sm:flex sm:gap-6">
            <p>
              © {new Date().getFullYear()} {SITE.name}
            </p>
            <p>
              Built by{' '}
              <Link href={`/players/${SITE.credit.playerSlug}`} className="font-medium text-ink-2 underline-offset-4 hover:text-ink hover:underline">
                {SITE.credit.name}
              </Link>
            </p>
          </div>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
