import { motion } from 'framer-motion';
import { PLAYERS } from '../../lib/directory';
import { rise } from '../../lib/motion';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Reveal, { Stagger } from '../../components/ui/Reveal';
import StatusPill from '../../components/ui/StatusPill';

const BENEFITS = [
  { icon: 'bat', title: 'Kit & jersey', text: 'T-shirt, track pant, ball and cap branding — worn by every player, all season.' },
  { icon: 'spark', title: 'Own a moment', text: 'Every six, four, wicket or strategic timeout carries your name.' },
  { icon: 'camera', title: 'Match-day presence', text: 'Ground, LED, DJ and live-stream partnerships seen by everyone there.' },
  { icon: 'users', title: 'The network', text: `${PLAYERS.length} business owners and professionals — in one dressing room.` },
];

/** Shown for a season whose partners haven't been announced. */
export default function PartnerPitch({ season, onShowPrevious, previousLabel }) {
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
      <Reveal className="card relative overflow-hidden p-7 sm:p-10 lg:col-span-7">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand/20 blur-3xl" />
        <StatusPill>Partnerships opening</StatusPill>
        <h2 className="t-display relative mt-8 text-[clamp(2.75rem,9vw,5rem)] text-ink">
          Put your brand on <span className="t-serif text-brand-ink">Season {season.number}.</span>
        </h2>
        <p className="relative mt-5 max-w-lg text-pretty text-ink-2 sm:text-lg">
          Title, co-sponsor, team and match-moment packages are being planned now. Speak to the organising committee to reserve yours before the auction.
        </p>
        <div className="relative mt-8 flex flex-wrap gap-3">
          <Button to="/#committee" icon="arrowRight">
            Talk to the committee
          </Button>
          {onShowPrevious && (
            <Button variant="secondary" onClick={onShowPrevious}>
              {previousLabel}
            </Button>
          )}
        </div>
      </Reveal>

      <Stagger as="ul" className="grid gap-3 lg:col-span-5">
        {BENEFITS.map((benefit) => (
          <motion.li key={benefit.title} variants={rise} className="card flex gap-4 p-5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-brand-ink">
              <Icon name={benefit.icon} className="size-5" />
            </span>
            <div>
              <h3 className="font-semibold text-ink">{benefit.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{benefit.text}</p>
            </div>
          </motion.li>
        ))}
      </Stagger>
    </div>
  );
}
