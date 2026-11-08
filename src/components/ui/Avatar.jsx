'use client';

import { useState } from 'react';
import { cn } from '../../lib/cn';
import { initials } from '../../lib/format';

/** Round/rounded portrait with a graceful initials fallback. */
export default function Avatar({ src, name, className, rounded = 'rounded-full', loading = 'lazy' }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={cn('relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-surface-2 text-ink-2', rounded, className)}>
      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading={loading}
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <span className="t-numeric text-[0.8em] tracking-normal" aria-hidden>
          {initials(name)}
        </span>
      )}
    </span>
  );
}
