import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS, SITE } from '../../data/site';
import { CURRENT_SEASON } from '../../data/seasons';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { cn } from '../../lib/cn';
import { EASE_OUT } from '../../lib/motion';
import { pad2 } from '../../lib/format';
import StatusPill from '../ui/StatusPill';
import Icon from '../ui/Icon';
import ThemeToggle from './ThemeToggle';

export default function MobileMenu({ open, onClose }) {
  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col bg-bg/95 backdrop-blur-xl lg:hidden"
          initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.25rem)' }}
          animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.25rem)' }}
          exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.25rem)' }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_100%_0%,rgb(var(--brand)/0.18),transparent_70%)]" />
          <nav className="shell relative flex flex-1 flex-col justify-center pt-20" aria-label="Mobile">
            <ul className="space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: EASE_OUT }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-baseline gap-4 border-b border-line/60 py-3.5 transition-colors',
                        isActive ? 'text-ink' : 'text-ink-3 hover:text-ink',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={cn('t-numeric w-6 text-sm', isActive ? 'text-ball' : 'text-ink-3')}>{pad2(i + 1)}</span>
                        <span className="t-display text-[2.75rem] leading-none">{link.label}</span>
                      </>
                    )}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.45 } }}
            exit={{ opacity: 0 }}
            className="shell safe-bottom relative flex items-center justify-between gap-4 pb-6"
          >
            <div>
              <StatusPill>Season {CURRENT_SEASON.number} · Coming soon</StatusPill>
              <p className="mt-3 text-xs text-ink-3">{SITE.organiser} · {SITE.city}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={SITE.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`SSGPL on Instagram, @${SITE.social.instagram.handle}`}
                className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(45deg,#f9a825,#e1306c_45%,#833ab4)] text-white"
              >
                <Icon name="instagram" className="size-5" />
              </a>
              <ThemeToggle />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
