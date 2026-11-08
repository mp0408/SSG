import { cn } from '../../lib/cn';
import Reveal from './Reveal';

/** Section header: indexed HUD label, condensed headline, optional description and action slot. */
export default function SectionHeading({ index, label, title, description, action, align = 'left', className }) {
  const centered = align === 'center';
  return (
    <div className={cn('mb-8 flex flex-col gap-5 sm:mb-14', centered ? 'items-center text-center' : 'lg:flex-row lg:items-end lg:justify-between', className)}>
      <Reveal className={cn('max-w-3xl', centered && 'mx-auto')}>
        {(index || label) && (
          <p className={cn('t-label mb-4 flex items-center gap-2.5 text-glow sm:mb-5', centered && 'justify-center')}>
            {index && <span>{index}</span>}
            {index && <span className="text-ink-3">{'//'}</span>}
            {label}
          </p>
        )}
        <h2 className="t-display text-balance text-[clamp(2.4rem,9vw,5.25rem)] text-ink">{title}</h2>
        {description && <p className={cn('mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-2 sm:mt-5 sm:text-lg', centered && 'mx-auto')}>{description}</p>}
      </Reveal>
      {action && (
        <Reveal delay={0.1} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}
