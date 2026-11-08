import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { cn } from '../../lib/cn';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Icon from './Icon';

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
const WIDTHS = { md: 'sm:max-w-lg', lg: 'sm:max-w-3xl', xl: 'sm:max-w-5xl' };

/**
 * Bottom sheet on phones (drag the handle down to dismiss), centred dialog on
 * larger screens. Traps focus, closes on Escape/backdrop, restores focus.
 */
export default function Sheet({ open, onClose, labelledBy, size = 'md', children, className }) {
  const desktop = useMediaQuery('(min-width: 640px)');
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const dragControls = useDragControls();
  useLockBodyScroll(open);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const frame = requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  const motionProps = desktop
    ? {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.98 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }
    : {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: { type: 'spring', damping: 36, stiffness: 360, mass: 0.9 },
        drag: 'y',
        dragListener: false,
        dragControls,
        dragConstraints: { top: 0, bottom: 0 },
        dragElastic: { top: 0, bottom: 0.7 },
        onDragEnd: (_, info) => {
          if (info.offset.y > 110 || info.velocity.y > 550) onCloseRef.current?.();
        },
      };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-[#01040c]/75 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onCloseRef.current?.()}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            className={cn(
              'relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-line bg-surface shadow-2xl outline-none sm:max-h-[88dvh] sm:rounded-[28px]',
              WIDTHS[size],
              className,
            )}
            {...motionProps}
          >
            {!desktop && (
              <div
                onPointerDown={(event) => dragControls.start(event)}
                className="absolute inset-x-0 top-0 z-20 flex h-7 cursor-grab touch-none justify-center pt-2.5"
                aria-hidden
              >
                <span className="h-1.5 w-11 rounded-full bg-white/50 shadow-sm" />
              </div>
            )}
            <button
              type="button"
              onClick={() => onCloseRef.current?.()}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 flex size-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55"
            >
              <Icon name="close" className="size-5" />
            </button>
            <div className="overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
