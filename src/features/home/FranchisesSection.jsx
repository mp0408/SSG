import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LATEST_PLAYED } from '../../data/seasons';
import { getPlayer } from '../../lib/directory';
import { rise } from '../../lib/motion';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { Stagger } from '../../components/ui/Reveal';
import SectionHeading from '../../components/ui/SectionHeading';

/** Last season's franchises — teams change every season, so this always recaps the latest played one. */
export default function FranchisesSection() {
  const season = LATEST_PLAYED;
  if (!season?.teams.length) return null;

  return (
    <section className="section border-y border-line/60 bg-bg-2">
      <div className="shell">
        <SectionHeading
          index="04"
          label={`Season ${season.number} franchises`}
          title={
            <>
              {season.teams.length} crests. <span className="t-serif text-brand-ink">One trophy.</span>
            </>
          }
          description="Squads are rebuilt at every auction. Here’s who lined up last season — Season 3 franchises appear once the paddles go down."
          action={
            <Button to={`/teams?season=${season.number}`} variant="secondary" icon="arrowRight">
              Squads &amp; captains
            </Button>
          }
        />
      </div>

      <div className="shell max-sm:px-0">
        <Stagger
          as="ul"
          gap={0.05}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 max-sm:scroll-px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6"
        >
          {season.teams.map((team) => {
            const captain = getPlayer(team.captainId);
            return (
              <motion.li key={team.slug} variants={rise} className="w-[58%] shrink-0 snap-start sm:w-auto">
                <Link to={`/teams?season=${season.number}`} className="card card-interactive group relative flex h-full flex-col items-center px-4 pb-5 pt-6 text-center">
                  <span
                    className="relative flex aspect-square w-full items-center justify-center rounded-2xl"
                    style={{ background: `radial-gradient(60% 60% at 50% 50%, ${team.color}38, transparent 72%)` }}
                  >
                    <img
                      src={team.crest}
                      alt=""
                      loading="lazy"
                      className="h-[80%] w-auto object-contain transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-110"
                    />
                  </span>
                  {season.champion?.team === team.slug && (
                    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                      <Icon name="trophy" className="size-3" /> Champions
                    </span>
                  )}
                  <span className="mt-4 font-semibold text-ink">{team.name}</span>
                  {captain && <span className="mt-1 text-xs text-ink-3">Capt. {captain.name}</span>}
                  <span aria-hidden className="mt-4 h-1 w-10 rounded-full" style={{ background: team.color }} />
                </Link>
              </motion.li>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
