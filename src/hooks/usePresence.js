'use client';

import { useEffect, useState } from 'react';

/**
 * Lets an overlay animate in and out with CSS.
 * `mounted`: render it at all. `visible`: apply the open state, a frame after mounting so the transition runs.
 */
export function usePresence(open, exitMs = 320) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(frame);
    }
    const timer = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(timer);
  }, [open, exitMs]);

  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      if (!open) setVisible(false);
      else if (mounted) second = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [open, mounted]);

  return { mounted, visible };
}
