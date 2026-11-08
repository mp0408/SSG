import { PLAYERS } from '../../lib/directory';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Reveal, { Stagger } from '../../components/ui/Reveal';
import StatusPill from '../../components/ui/StatusPill';

const BENEFITS = [
  { icon: 'bat', title: 'Kit & jersey', text: 'T-shirt, track pant, ball and cap branding, worn by every player, all season.' },
  { icon: 'spark', title: 'Own a moment', text: 'Every six, four, wicket or strategic timeout carries your name.' },
  { icon: 'camera', title: 'Match-day presence', text: 'Ground, LED, DJ and live-stream partnerships seen by everyone there.' },
  { icon: 'users', title: 'The network', text: `${PLAYERS.length} business owners and professionals in one dressing room.` },
];

/** Shown for a season whose partners haven't been announced. */
export default function PartnerPitch({ season, onShowPrevious, previousLabel }) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-5">
      <Reveal className="card hud-ticks overflow-hidden p-5 sm:p-10 lg:col-span-7">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_100%_0%,rgb(var(--brand)/0.3),transparent_72%)]" />
        <StatusPill className="relative">Partnerships opening</StatusPill>
        <h2 className="t-display relative mt-6 text-[clamp(2.5rem,9vw,5rem)] text-ink sm:mt-8">
          Put your brand on <span className="t-accent">Season {season.number}.</span>
        </h2>
        <p className="relative mt-4 max-w-lg text-pretty text-ink-2 sm:mt-5 sm:text-lg">
          Title, co-sponsor, team and match-moment packages are being planned now. Speak to the organising committee to reserve yours before the auction.
        </p>
        <div className="relative mt-6 flex flex-wrap gap-3 sm:mt-8">
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
          <li key={benefit.title} className="card flex gap-4 p-4 sm:p-5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-glow">
              <Icon name={benefit.icon} className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-ink">{benefit.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{benefit.text}</p>
            </div>
          </li>
        ))}
      </Stagger>
    </div>
  );
}
