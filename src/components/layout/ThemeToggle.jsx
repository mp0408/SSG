import { AnimatePresence, motion } from 'framer-motion';
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
      className={cn(
        'relative flex size-10 items-center justify-center overflow-hidden rounded-full border border-line bg-surface/70 text-ink-2 transition-colors hover:text-ink',
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -40, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          <Icon name={theme === 'dark' ? 'moon' : 'sun'} className="size-[18px]" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
