import { motion } from 'framer-motion';
import { LATEST_PLAYED, SEASONS } from '../../data/seasons';
import { PLAYERS, PROFESSION_COUNT } from '../../lib/directory';
import { rise } from '../../lib/motion';
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
    <section className="shell py-16 sm:py-24" aria-label="SSGPL in numbers">
      <Stagger as="dl" className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
        {STATS.map((stat) => (
          <motion.div key={stat.label} variants={rise} className="flex flex-col-reverse justify-between gap-6 bg-bg p-5 sm:p-8">
            <dt className="max-w-[12rem] text-sm leading-snug text-ink-2">{stat.label}</dt>
            <dd className="t-numeric text-[clamp(3.5rem,13vw,6rem)] leading-none text-ink">
              <CountUp value={stat.value} pad={stat.pad} />
            </dd>
          </motion.div>
        ))}
      </Stagger>
    </section>
  );
}
