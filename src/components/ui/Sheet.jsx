'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { usePresence } from '../../hooks/usePresence';
import Icon from './Icon';

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
const WIDTHS = { md: 'sm:max-w-lg', lg: 'sm:max-w-3xl', xl: 'sm:max-w-5xl' };

/**
 * Bottom sheet on phones (drag the handle down to dismiss), centred dialog on
 * larger screens. Traps focus, closes on Escape/backdrop, restores focus.
 * Dragging writes the transform directly, so it never re-renders React.
 */
export default function Sheet({ open, onClose, labelledBy, size = 'md', children, className }) {
  const { mounted, visible } = usePresence(open, 340);
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const dragRef = useRef(null);
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

  const onDragStart = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { y: event.clientY, at: performance.now(), offset: 0 };
    panelRef.current.style.transition = 'none';
  };

  const onDragMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    drag.offset = Math.max(0, event.clientY - drag.y);
    panelRef.current.style.transform = `translate3d(0, ${drag.offset}px, 0)`;
  };

  const onDragEnd = () => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    const panel = panelRef.current;
    panel.style.transition = '';
    panel.style.transform = '';
    const speed = drag.offset / Math.max(1, performance.now() - drag.at);
    if (drag.offset > 110 || speed > 0.6) onCloseRef.current?.();
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <div data-visible={visible} className="sheet-backdrop absolute inset-0 bg-[#01040c]/80" onClick={() => onCloseRef.current?.()} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        data-visible={visible}
        className={cn(
          'sheet-panel relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-b-0 border-line bg-surface shadow-2xl outline-none sm:max-h-[88dvh] sm:rounded-2xl sm:border-b',
          WIDTHS[size],
          className,
        )}
      >
        <div
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          className="absolute inset-x-0 top-0 z-20 flex h-8 cursor-grab touch-none justify-center pt-2.5 sm:hidden"
          aria-hidden
        >
          <span className="h-1.5 w-11 rounded-full bg-white/60 shadow-sm" />
        </div>
        <button
          type="button"
          onClick={() => onCloseRef.current?.()}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 flex size-11 items-center justify-center rounded-lg bg-black/60 text-white transition hover:bg-black/80"
        >
          <Icon name="close" className="size-5" />
        </button>
        <div className="overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
