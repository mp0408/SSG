'use client';

import Link from 'next/link';
import { NAV_LINKS, SITE } from '../../data/site';
import { CURRENT_SEASON } from '../../data/seasons';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { usePresence } from '../../hooks/usePresence';
import { cn } from '../../lib/cn';
import { pad2 } from '../../lib/format';
import StatusPill from '../ui/StatusPill';
import Icon from '../ui/Icon';
import ThemeToggle from './ThemeToggle';

const isActive = (pathname, href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));

export default function MobileMenu({ open, onClose, pathname }) {
  const { mounted, visible } = usePresence(open, 280);
  useLockBodyScroll(open);
  if (!mounted) return null;

  return (
    <div id="mobile-menu" data-visible={visible} className="menu-panel fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-bg lg:hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_100%_0%,rgb(var(--brand)/0.24),transparent_70%)]" />
      <nav className="shell relative flex flex-1 flex-col justify-center pb-6 pt-[calc(var(--header)+1rem)]" aria-label="Mobile">
        <ul>
          {NAV_LINKS.map((link, i) => {
            const active = isActive(pathname, link.to);
            return (
              <li key={link.to} style={{ '--i': i }}>
                <Link
                  href={link.to}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={cn('flex items-baseline gap-4 border-b border-line/60 py-3', active ? 'text-ink' : 'text-ink-2')}
                >
                  <span className={cn('t-label w-6', active ? 'text-glow' : 'text-ink-3')}>{pad2(i + 1)}</span>
                  <span className="t-display text-[clamp(2.25rem,11vw,2.75rem)] leading-none">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="shell safe-bottom relative flex items-center justify-between gap-4 pb-6">
        <div className="min-w-0">
          <StatusPill>Season {CURRENT_SEASON.number} · Coming soon</StatusPill>
          <p className="mt-3 text-xs text-ink-3">
            {SITE.organiser} · {SITE.city}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={SITE.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`SSGPL on Instagram, @${SITE.social.instagram.handle}`}
            className="flex size-11 items-center justify-center rounded-lg bg-[linear-gradient(45deg,#f9a825,#e1306c_45%,#833ab4)] text-white"
          >
            <Icon name="instagram" className="size-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
