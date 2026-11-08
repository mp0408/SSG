/** Shared motion language: one easing curve, small distances, staggered entrances. */
export const EASE_OUT = [0.22, 1, 0.36, 1];

export const VIEWPORT_ONCE = { once: true, amount: 0.2, margin: '0px 0px -8% 0px' };

export const stagger = (gap = 0.07, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren } },
});

export const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};
