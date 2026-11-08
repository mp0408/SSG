import { cn } from '../../lib/cn';

/** Status tag with a pulsing cricket-ball-red dot: the site's "live/upcoming" signal. */
export default function StatusPill({ children, className, tone = 'ball' }) {
  return (
    <span className={cn('t-label inline-flex max-w-full items-center gap-2.5 rounded-md border border-line bg-surface py-1.5 pl-2.5 pr-3 text-ink-2', className)}>
      <span className="relative flex size-2 shrink-0">
        <span className={cn('absolute inline-flex size-full animate-ping rounded-full opacity-70', tone === 'ball' ? 'bg-ball' : 'bg-brand')} />
        <span className={cn('relative inline-flex size-2 rounded-full', tone === 'ball' ? 'bg-ball' : 'bg-brand')} />
      </span>
      {children}
    </span>
  );
}
