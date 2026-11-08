'use client';

import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/cn';
import Icon from '../ui/Icon';

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cn('flex size-11 items-center justify-center rounded-lg border border-line bg-surface text-ink-2 transition-colors hover:text-ink lg:size-10', className)}
    >
      <Icon name={theme === 'dark' ? 'moon' : 'sun'} className="size-[18px]" />
    </button>
  );
}
