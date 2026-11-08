'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '../../data/site';
import { CURRENT_SEASON } from '../../data/seasons';
import { useScrolled } from '../../hooks/useScrolled';
import { cn } from '../../lib/cn';
import Logo from '../brand/Logo';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';

const isActive = (pathname, href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));

export default function Navbar() {
  const scrolled = useScrolled(16);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300',
          scrolled && !open ? 'glass border-line/60 bg-bg/95 lg:bg-bg/80' : 'border-transparent',
        )}
      >
        <div className="shell flex h-[var(--header)] items-center justify-between gap-4">
          <Link href="/" onClick={close} className="relative z-50 flex items-center gap-3" aria-label="SSG Premier League, home">
            <Logo className="h-10 w-auto lg:h-12" />
            <span className="hidden h-7 w-px bg-line xl:block" aria-hidden />
            <span className="t-label hidden text-ink-3 xl:block">Season {CURRENT_SEASON.number}</span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.to);
                return (
                  <li key={link.to}>
                    <Link
                      href={link.to}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        't-label relative block px-3.5 py-2.5 transition-colors duration-200',
                        active ? 'text-ink' : 'text-ink-2 hover:text-ink',
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden
                        className={cn(
                          'absolute inset-x-3.5 bottom-1 h-px origin-left bg-glow transition-transform duration-300 ease-out',
                          active ? 'scale-x-100' : 'scale-x-0',
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-50 flex items-center gap-2">
            <ThemeToggle className={cn(open && 'hidden')} />
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex size-11 items-center justify-center rounded-lg border border-line bg-surface text-ink lg:hidden"
            >
              <span className="relative block h-3 w-[18px]">
                <span
                  className={cn(
                    'absolute left-0 block h-[1.5px] w-full rounded-full bg-current transition-transform duration-300',
                    open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 block h-[1.5px] w-full origin-left rounded-full bg-current transition-transform duration-300',
                    open ? 'top-1/2 -translate-y-1/2 translate-x-[3px] -rotate-45 scale-x-100 [transform-origin:50%_50%]' : 'bottom-0 scale-x-[0.6]',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={close} pathname={pathname} />
    </>
  );
}
