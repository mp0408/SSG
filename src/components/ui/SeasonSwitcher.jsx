import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

/**
 * Segmented control for switching seasons (or any small option set).
 * options: [{ value, label, count?, badge? }]
 */
export default function SeasonSwitcher({ options, value, onChange, id, label = 'Select season', className }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('no-scrollbar inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface/80 p-1', className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-300',
              active ? 'text-white' : 'text-ink-2 hover:text-ink',
            )}
          >
            {active && (
              <motion.span
                layoutId={`switcher-${id}`}
                className="absolute inset-0 rounded-full bg-brand shadow-[0_8px_24px_-10px_rgb(var(--brand)/0.9)]"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{option.label}</span>
            {option.count != null && (
              <span className={cn('t-numeric relative text-xs tracking-normal', active ? 'text-white/70' : 'text-ink-3')}>{option.count}</span>
            )}
            {option.badge && (
              <span
                className={cn(
                  'relative rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  active ? 'bg-white/20 text-white' : 'bg-ball/15 text-ball',
                )}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
