import { cn } from '../../lib/cn';

/**
 * Segmented control for switching seasons (or any small option set).
 * options: [{ value, label, count?, badge? }]
 */
export default function SeasonSwitcher({ options, value, onChange, label = 'Select season', className }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('no-scrollbar inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1', className)}
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
              'flex h-11 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors duration-200 sm:px-4',
              active ? 'bg-brand text-white' : 'text-ink-2 hover:text-ink',
            )}
          >
            <span>{option.label}</span>
            {option.count != null && <span className={cn('t-numeric text-xs tracking-normal', active ? 'text-white/70' : 'text-ink-3')}>{option.count}</span>}
            {option.badge && (
              <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider', active ? 'bg-white/20 text-white' : 'bg-ball/15 text-ball')}>
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
