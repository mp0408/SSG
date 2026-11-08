import { cn } from '../../lib/cn';

/** Pill with a pulsing cricket-ball-red dot — the site's "live/upcoming" signal. */
export default function StatusPill({ children, className, tone = 'ball' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 py-1.5 pl-3 pr-4 text-xs font-medium text-ink-2 backdrop-blur-md',
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className={cn('absolute inline-flex size-full animate-ping rounded-full opacity-70', tone === 'ball' ? 'bg-ball' : 'bg-brand')} />
        <span className={cn('relative inline-flex size-2 rounded-full', tone === 'ball' ? 'bg-ball' : 'bg-brand')} />
      </span>
      {children}
    </span>
  );
}
