import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import Icon from './Icon';

const VARIANTS = {
  primary:
    'bg-brand text-white shadow-[0_10px_30px_-12px_rgb(var(--brand)/0.8),inset_0_1px_0_rgb(255_255_255/0.18)] hover:bg-brand/90',
  secondary: 'border border-line bg-surface/70 text-ink hover:border-ink-3/60 hover:bg-surface-2',
  ghost: 'text-ink-2 hover:text-ink',
  light: 'bg-white text-[#0a1226] hover:bg-white/90',
};

const SIZES = {
  md: 'h-12 px-5 text-[0.9375rem] gap-2.5',
  sm: 'h-10 px-4 text-sm gap-2',
};

/**
 * One button for internal links (`to`), external links (`href`) and actions.
 * Arrow icons nudge on hover — the only motion, kept subtle.
 */
export default function Button({ to, href, variant = 'primary', size = 'md', icon, iconLeft, className, children, ...rest }) {
  const classes = cn(
    'group/btn inline-flex select-none items-center justify-center rounded-full font-medium tracking-[-0.01em]',
    'transition-[background-color,border-color,color,transform] duration-300 ease-out active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );
  const content = (
    <>
      {iconLeft && <Icon name={iconLeft} className="size-[1.1em] shrink-0" />}
      <span>{children}</span>
      {icon && (
        <Icon
          name={icon}
          className="size-[1.1em] shrink-0 transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5"
        />
      )}
    </>
  );

  if (to) return <Link to={to} className={classes} {...rest}>{content}</Link>;
  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
