import { LATEST_PLAYED, SEASONS } from '../../data/seasons';
import { PLAYERS, PROFESSION_COUNT } from '../../lib/directory';
import CountUp from '../../components/ui/CountUp';
import { Stagger } from '../../components/ui/Reveal';

const STATS = [
  { value: SEASONS.filter((s) => s.status === 'completed').length, label: 'Seasons played', pad: 2 },
  { value: PLAYERS.length, label: 'Players in the network' },
  { value: PROFESSION_COUNT, label: 'Professions on the team sheet' },
  { value: LATEST_PLAYED.sponsors.length, label: `Partners in Season ${LATEST_PLAYED.number}` },
];

export default function StatsSection() {
  return (
    <section className="shell py-14 sm:py-24" aria-label="SSGPL in numbers">
      <Stagger as="dl" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="card hud-ticks flex flex-col-reverse justify-between gap-5 p-5 sm:p-8">
            <dt className="max-w-[12rem] text-sm leading-snug text-ink-2">{stat.label}</dt>
            <dd className="t-numeric text-[clamp(3.25rem,13vw,6rem)] leading-none text-ink">
              <CountUp value={stat.value} pad={stat.pad} />
            </dd>
          </div>
        ))}
      </Stagger>
    </section>
  );
}
