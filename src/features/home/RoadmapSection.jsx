import { motion } from 'framer-motion';
import { CURRENT_SEASON, LATEST_PLAYED } from '../../data/seasons';
import { cn } from '../../lib/cn';
import { pad2 } from '../../lib/format';
import { rise } from '../../lib/motion';
import Icon from '../../components/ui/Icon';
import { Stagger } from '../../components/ui/Reveal';
import SectionHeading from '../../components/ui/SectionHeading';

const STATE = {
  done: { label: 'Done', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  next: { label: 'Up next', className: 'bg-ball/10 text-ball' },
  later: { label: 'Coming', className: 'bg-surface-2 text-ink-3' },
};

/** Season 3 build-up — replaces last season's (now archived) fixture list. */
export default function RoadmapSection() {
  const steps = CURRENT_SEASON.roadmap ?? [];
  if (!steps.length) return null;

  return (
    <section id="season-3" className="section">
      <div className="shell">
        <SectionHeading
          index="02"
          label={`Season ${CURRENT_SEASON.number}`}
          title={
            <>
              Season {CURRENT_SEASON.number} is <span className="t-serif text-brand-ink">loading.</span>
            </>
          }
          description={`Season ${LATEST_PLAYED.number} is in the books. Here’s how the next season comes together — dates drop as each stage locks in.`}
        />
      </div>

      {/* Phones: horizontal rail that bleeds to the screen edge. Larger screens: grid. */}
      <div className="shell max-sm:px-0">
        <Stagger
          as="ol"
          gap={0.06}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 max-sm:scroll-px-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
        >
          {steps.map((step, index) => {
            const state = STATE[step.state] ?? STATE.later;
            const next = step.state === 'next';
            return (
              <motion.li
                key={step.title}
                variants={rise}
                className={cn(
                  'card relative flex w-[78%] shrink-0 snap-start flex-col overflow-hidden p-6 sm:w-auto sm:p-7',
                  next && 'border-brand/50',
                )}
              >
                {next && <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_70%_at_100%_0%,rgb(var(--brand)/0.16),transparent_70%)]" />}
                <div className="relative flex items-start justify-between gap-3">
                  <span className="t-display text-outline text-[4.5rem] leading-[0.8] sm:text-[5rem]">{pad2(index + 1)}</span>
                  <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider', state.className)}>{state.label}</span>
                </div>
                <h3 className="relative mt-8 text-xl font-semibold text-ink">{step.title}</h3>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-ink-2">{step.detail}</p>
                <p className="relative mt-6 flex items-center gap-2 border-t border-line/70 pt-4 text-sm font-medium text-ink">
                  <Icon name="calendar" className="size-4 text-ink-3" />
                  {step.when}
                </p>
                {next && <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-brand via-glow to-transparent" />}
              </motion.li>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
