import { cn } from '../../lib/cn';
import Icon from './Icon';

export default function EmptyState({ icon = 'spark', title, description, children, className }) {
  return (
    <div className={cn('card overflow-hidden px-5 py-12 text-center sm:py-20', className)}>
      <div aria-hidden className="bg-dots absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_40%,#000,transparent)]" />
      <div className="relative mx-auto max-w-md">
        <span className="mx-auto mb-6 flex size-14 items-center justify-center rounded-xl border border-line bg-surface-2 text-glow">
          <Icon name={icon} className="size-6" />
        </span>
        <h3 className="t-display text-3xl text-ink sm:text-4xl">{title}</h3>
        {description && <p className="mt-3 text-pretty text-ink-2">{description}</p>}
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
