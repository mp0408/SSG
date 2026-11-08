import { cn } from '../../lib/cn';

/** Top-of-page header for inner pages: HUD grid behind, oversized ghost word on larger screens. */
export default function PageHeader({ label, title, description, ghost, children, className }) {
  return (
    <header className={cn('relative overflow-hidden pb-8 pt-24 sm:pb-14 sm:pt-36', className)}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_70%_0%,rgb(var(--brand)/0.2),transparent_70%)]" />
      <div aria-hidden className="hud-grid pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      {ghost && (
        <span aria-hidden className="t-display text-outline pointer-events-none absolute -right-4 top-20 hidden select-none text-[clamp(7rem,24vw,22rem)] leading-none opacity-50 md:block">
          {ghost}
        </span>
      )}
      <div className="shell relative">
        <p className="t-label rise mb-4 flex items-center gap-3 text-glow sm:mb-5">
          <span className="h-px w-8 bg-glow/50" aria-hidden />
          {label}
        </p>
        <h1 className="t-display rise max-w-4xl text-balance text-[clamp(2.6rem,11.5vw,7.5rem)] text-ink" style={{ '--d': '50ms' }}>
          {title}
        </h1>
        {description && (
          <p className="rise mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-2 sm:mt-6 sm:text-lg" style={{ '--d': '110ms' }}>
            {description}
          </p>
        )}
        {children && (
          <div className="rise mt-6 sm:mt-8" style={{ '--d': '170ms' }}>
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
