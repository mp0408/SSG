/**
 * Scroll entrances, driven by CSS and one shared observer (see MotionObserver.jsx).
 * These are plain elements, so they work inside Server Components and cost no JS per item.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className, style, children, ...rest }) {
  return (
    <Tag data-reveal="" className={className} style={delay ? { ...style, '--d': `${Math.round(delay * 1000)}ms` } : style} {...rest}>
      {children}
    </Tag>
  );
}

/** Container whose direct children enter one after another. */
export function Stagger({ as: Tag = 'div', gap, className, style, children, ...rest }) {
  return (
    <Tag data-stagger="" className={className} style={gap ? { ...style, '--gap': `${Math.round(gap * 1000)}ms` } : style} {...rest}>
      {children}
    </Tag>
  );
}
