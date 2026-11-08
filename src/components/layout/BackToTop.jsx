'use client';

import Icon from '../ui/Icon';

export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-line text-ink-2 transition-colors hover:text-ink"
      aria-label="Back to top"
    >
      <Icon name="arrowUp" className="size-4" />
    </button>
  );
}
