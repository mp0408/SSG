'use client';

import { useEffect, useRef } from 'react';

/** Counts from 0 to `value` once visible. Writes the text directly, so React never re-renders per frame. */
export default function CountUp({ value, duration = 1.3, pad = 0, suffix = '', className }) {
  const ref = useRef(null);
  const format = (n) => `${String(n).padStart(pad, '0')}${suffix}`;

  useEffect(() => {
    const node = ref.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const text = (n) => `${String(n).padStart(pad, '0')}${suffix}`;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / (duration * 1000));
        node.textContent = text(Math.round(value * (1 - Math.pow(1 - t, 4))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration, pad, suffix]);

  return (
    <span className={className} aria-label={`${value}${suffix}`}>
      <span ref={ref} aria-hidden>
        {format(value)}
      </span>
    </span>
  );
}
