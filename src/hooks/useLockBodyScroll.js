import { useEffect } from 'react';

let locks = 0;

/** Locks page scroll while `active`; ref-counted so stacked overlays don't fight. */
export function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return undefined;
    const { body, documentElement } = document;
    if (locks++ === 0) {
      const gap = window.innerWidth - documentElement.clientWidth;
      body.style.overflow = 'hidden';
      if (gap > 0) body.style.paddingRight = `${gap}px`;
    }
    return () => {
      if (--locks === 0) {
        body.style.overflow = '';
        body.style.paddingRight = '';
      }
    };
  }, [active]);
}
