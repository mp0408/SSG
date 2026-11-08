import { motion } from 'framer-motion';
import { rise } from '../../lib/motion';
import { pad2 } from '../../lib/format';
import { Stagger } from '../../components/ui/Reveal';
import Button from '../../components/ui/Button';
import StatusPill from '../../components/ui/StatusPill';

/** Placeholder franchises for a season whose auction hasn't happened yet. */
export default function UpcomingTeams({ season, slots = 6, onShowPrevious, previousLabel }) {
  const nextStep = season.roadmap?.find((step) => step.state === 'next');
  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <StatusPill>Squads are built at the auction</StatusPill>
          <p className="mt-4 text-pretty text-ink-2">
            Season {season.number} franchises, crests and captains appear here the moment they’re revealed.
            {nextStep && ` Up next: ${nextStep.title.toLowerCase()} — ${nextStep.when.toLowerCase()}.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {onShowPrevious && (
            <Button variant="secondary" size="sm" onClick={onShowPrevious} icon="arrowRight">
              {previousLabel}
            </Button>
          )}
          <Button to="/players" size="sm" variant="secondary">
            Meet the player pool
          </Button>
        </div>
      </div>

      <Stagger as="ul" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {Array.from({ length: slots }, (_, i) => (
          <motion.li key={i} variants={rise} className="card relative flex aspect-[4/3.4] flex-col justify-between overflow-hidden border-dashed p-4 sm:p-6">
            <div aria-hidden className="skeleton absolute inset-0 bg-transparent" />
            <span className="t-label relative text-ink-3">Franchise {pad2(i + 1)}</span>
            <span className="t-display text-outline relative self-center text-[clamp(4rem,16vw,8rem)] leading-none">?</span>
            <span className="relative text-xs text-ink-3 sm:text-sm">Revealed after the auction</span>
          </motion.li>
        ))}
      </Stagger>
    </div>
  );
}
