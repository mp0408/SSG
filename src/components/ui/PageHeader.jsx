import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { EASE_OUT } from '../../lib/motion';

/** Top-of-page header for inner pages. The oversized ghost word adds depth without imagery. */
export default function PageHeader({ label, title, description, ghost, children, className }) {
  return (
    <header className={cn('relative overflow-hidden pb-10 pt-32 sm:pb-14 sm:pt-40', className)}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_70%_0%,rgb(var(--brand)/0.16),transparent_70%)]" />
      {ghost && (
        <span
          aria-hidden
          className="t-display text-outline pointer-events-none absolute -right-4 top-20 hidden select-none text-[clamp(7rem,24vw,22rem)] leading-none opacity-50 md:block"
        >
          {ghost}
        </span>
      )}
      <div className="shell relative">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="t-label mb-5 flex items-center gap-3 text-brand-ink"
        >
          <span className="h-px w-8 bg-brand-ink/50" aria-hidden />
          {label}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: EASE_OUT }}
          className="t-display max-w-4xl text-balance text-[clamp(3rem,12vw,7.5rem)] text-ink"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: EASE_OUT }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-2 sm:text-lg"
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </header>
  );
}
