import { cn } from '../../lib/cn';
import Reveal from './Reveal';

/**
 * Editorial section header: indexed label, condensed headline, optional
 * description and an action slot that sits right-aligned on desktop.
 */
export default function SectionHeading({ index, label, title, description, action, align = 'left', className }) {
  const centered = align === 'center';
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-6 sm:mb-14',
        centered ? 'items-center text-center' : 'lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <Reveal className={cn('max-w-3xl', centered && 'mx-auto')}>
        {(index || label) && (
          <p className={cn('t-label mb-5 flex items-center gap-3 text-brand-ink', centered && 'justify-center')}>
            {index && <span className="t-numeric text-sm tracking-normal text-ink-3">{index}</span>}
            {index && <span className="h-px w-8 bg-line" aria-hidden />}
            {label}
          </p>
        )}
        <h2 className="t-display text-balance text-[clamp(2.6rem,9vw,5.25rem)] text-ink">{title}</h2>
        {description && (
          <p className={cn('mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-2 sm:text-lg', centered && 'mx-auto')}>
            {description}
          </p>
        )}
      </Reveal>
      {action && <Reveal delay={0.1} className="shrink-0">{action}</Reveal>}
    </div>
  );
}
