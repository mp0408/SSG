import { useId } from 'react';
import { cn } from '../../lib/cn';
import { BATTER_PATH, LEAGUE_PATH, LOGO_VIEWBOX, MARK_VIEWBOX, SSG_PATH } from './logoPaths';

/**
 * The SSG Premier League mark as a vector — razor sharp at any size.
 * Colours come from CSS variables: blue gradient everywhere, white keyline on dark.
 *   variant="full" → batter + SSG + PREMIER LEAGUE
 *   variant="mark" → batter only (icons, tight spaces)
 */
export default function Logo({ variant = 'full', className, title = 'SSG Premier League' }) {
  const gradientId = `logo-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  return (
    <svg
      viewBox={variant === 'mark' ? MARK_VIEWBOX : LOGO_VIEWBOX}
      className={cn('block overflow-visible', className)}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--logo-top))" />
          <stop offset="1" stopColor="rgb(var(--logo-bottom))" />
        </linearGradient>
      </defs>
      <g className="logo-ink" fill={`url(#${gradientId})`} fillRule="evenodd">
        <path d={BATTER_PATH} />
        {variant === 'full' && (
          <>
            <path d={SSG_PATH} />
            <path d={LEAGUE_PATH} />
          </>
        )}
      </g>
    </svg>
  );
}
