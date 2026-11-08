import { CURRENT_SEASON, LATEST_PLAYED } from '../../data/seasons';
import { cn } from '../../lib/cn';
import { pad2 } from '../../lib/format';
import Icon from '../../components/ui/Icon';
import { Stagger } from '../../components/ui/Reveal';
import SectionHeading from '../../components/ui/SectionHeading';

const STATE = {
  done: { label: 'Done', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  next: { label: 'Up next', className: 'bg-ball/10 text-ball' },
  later: { label: 'Coming', className: 'bg-surface-2 text-ink-3' },
};

/** Season 3 build-up: replaces last season's (now archived) fixture list. */
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
              Season {CURRENT_SEASON.number} is <span className="t-accent">loading.</span>
            </>
          }
          description={`Season ${LATEST_PLAYED.number} is in the books. Here’s how the next season comes together. Dates drop as each stage locks in.`}
        />
      </div>

      {/* Phones: horizontal rail that bleeds to the screen edge. Larger screens: grid. */}
      <div className="shell max-sm:!px-0">
        <Stagger
          as="ol"
          gap={0.06}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 max-sm:scroll-px-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
        >
          {steps.map((step, index) => {
            const state = STATE[step.state] ?? STATE.later;
            const next = step.state === 'next';
            return (
              <li key={step.title} className={cn('card flex w-[min(78vw,20rem)] shrink-0 snap-start flex-col overflow-hidden p-5 sm:w-auto sm:p-7', next && 'border-glow/50')}>
                {next && <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_70%_at_100%_0%,rgb(var(--brand)/0.2),transparent_70%)]" />}
                <div className="relative flex items-start justify-between gap-3">
                  <span className="t-display text-outline text-[4rem] leading-[0.8] sm:text-[5rem]">{pad2(index + 1)}</span>
                  <span className={cn('t-label rounded px-2 py-1 tracking-[0.08em]', state.className)}>{state.label}</span>
                </div>
                <h3 className="relative mt-6 text-xl font-semibold text-ink sm:mt-8">{step.title}</h3>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-ink-2">{step.detail}</p>
                <p className="relative mt-5 flex items-center gap-2 border-t border-line/70 pt-4 text-sm font-medium text-ink sm:mt-6">
                  <Icon name="calendar" className="size-4 text-ink-3" />
                  {step.when}
                </p>
                {next && <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-brand via-glow to-transparent" />}
              </li>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
