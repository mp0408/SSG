import { motion } from 'framer-motion';
import { EASE_OUT, VIEWPORT_ONCE, stagger } from '../../lib/motion';

/** Fades + lifts content into view once. Keep distances small — motion should feel expensive, not busy. */
export default function Reveal({ as = 'div', delay = 0, y = 18, className, children, ...rest }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.75, delay, ease: EASE_OUT }}
      {...rest}
    >
      {children}
    </Component>
  );
}

/** Container that staggers children using the `rise` variant (see lib/motion). */
export function Stagger({ as = 'div', gap, delay, className, children, ...rest }) {
  const Component = motion[as];
  return (
    <Component className={className} variants={stagger(gap, delay)} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE} {...rest}>
      {children}
    </Component>
  );
}
