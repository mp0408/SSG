import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_LINKS } from '../../data/site';
import { CURRENT_SEASON } from '../../data/seasons';
import { useScrolled } from '../../hooks/useScrolled';
import { cn } from '../../lib/cn';
import Logo from '../brand/Logo';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const scrolled = useScrolled(16);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
          scrolled && !open ? 'border-b border-line/60 bg-bg/75 backdrop-blur-xl backdrop-saturate-150' : 'border-b border-transparent',
        )}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
          <Link to="/" className="relative z-50 flex items-center gap-3" aria-label="SSG Premier League — home">
            <Logo className="h-11 w-auto sm:h-12 lg:h-14" />
            <span className="hidden h-7 w-px bg-line xl:block" aria-hidden />
            <span className="t-label hidden text-ink-3 xl:block">Season {CURRENT_SEASON.number}</span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-line/70 bg-surface/60 p-1 backdrop-blur-md">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'relative block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300',
                        isActive ? 'text-ink' : 'text-ink-2 hover:text-ink',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 rounded-full border border-line bg-surface-2"
                            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                          />
                        )}
                        <span className="relative">{link.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
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
              className="flex size-10 items-center justify-center rounded-full border border-line bg-surface/70 text-ink lg:hidden"
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
                    'absolute left-0 block h-[1.5px] rounded-full bg-current transition-all duration-300',
                    open ? 'top-1/2 w-full -translate-y-1/2 -rotate-45' : 'bottom-0 w-3/5',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
