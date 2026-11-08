'use client';

import { useEffect } from 'react';

const SELECTOR = '[data-reveal],[data-stagger],[data-offscreen-pause]';

/**
 * The site's only scroll logic: one pair of IntersectionObservers for every
 * section. Adds `.in` to reveal content once, and `.is-offscreen` to pause looping
 * animations. New content (route changes, season switches) is picked up automatically.
 * Nothing here runs per frame, so scrolling stays on the compositor.
 */
export default function MotionObserver() {
  useEffect(() => {
    const seen = new WeakSet();
    let frame = 0;

    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          reveal.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px' },
    );

    const pause = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.target.classList.toggle('is-offscreen', !entry.isIntersecting));
      },
      { rootMargin: '120px 0px' },
    );

    const scan = () => {
      frame = 0;
      document.querySelectorAll(SELECTOR).forEach((node) => {
        if (seen.has(node)) return;
        seen.add(node);
        if (node.hasAttribute('data-offscreen-pause')) pause.observe(node);
        else reveal.observe(node);
      });
    };

    const mutations = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(scan);
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    scan();

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      reveal.disconnect();
      pause.disconnect();
    };
  }, []);

  return null;
}
