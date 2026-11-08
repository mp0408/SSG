import { cn } from '../../lib/cn';

/**
 * CSS-only infinite marquee: a transform animation on the compositor, paused off screen.
 * Content is rendered twice; the copy is hidden from assistive tech.
 */
export default function Marquee({ children, duration = 40, reverse = false, className, trackClassName }) {
  const track = cn('marquee-track flex shrink-0 items-center', reverse ? 'animate-marquee-reverse' : 'animate-marquee', trackClassName);
  return (
    <div data-offscreen-pause="" className={cn('marquee', className)} style={{ '--marquee-duration': `${duration}s` }}>
      <div className={track}>{children}</div>
      <div className={track} aria-hidden>
        {children}
      </div>
    </div>
  );
}
