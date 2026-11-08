import Link from 'next/link';
import { cn } from '../../lib/cn';
import Icon from './Icon';

const VARIANTS = {
  primary: 'btn btn-solid hover:brightness-110',
  secondary: 'btn btn-line',
  ghost: 'text-ink-2 hover:text-ink',
  light: 'btn bg-white text-[#0a1226] hover:bg-white/90',
};

const SIZES = {
  md: 'min-h-12 px-5 py-2 text-[0.9375rem] gap-2.5',
  sm: 'min-h-11 px-4 py-1.5 text-sm gap-2',
};

/** One button for internal links (`to`), external links (`href`) and actions. */
export default function Button({ to, href, variant = 'primary', size = 'md', icon, iconLeft, className, children, ...rest }) {
  const classes = cn(
    'group/btn inline-flex select-none items-center justify-center text-center font-semibold tracking-[-0.01em]',
    'transition-[filter,transform] duration-200 ease-out active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );
  const content = (
    <>
      {iconLeft && <Icon name={iconLeft} className="size-[1.1em] shrink-0" />}
      <span>{children}</span>
      {icon && <Icon name={icon} className="size-[1.1em] shrink-0 transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5" />}
    </>
  );

  if (to) {
    return (
      <Link href={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
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
