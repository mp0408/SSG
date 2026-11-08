import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { seasonsWith } from '../data/seasons';
import { useSeasonParam } from '../hooks/useSeasonParam';
import { useLastDefined } from '../hooks/useLastDefined';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { EASE_OUT } from '../lib/motion';
import PageHeader from '../components/ui/PageHeader';
import SeasonSwitcher from '../components/ui/SeasonSwitcher';
import Sheet from '../components/ui/Sheet';
import { Stagger } from '../components/ui/Reveal';
import TeamCard from '../features/teams/TeamCard';
import SquadView from '../features/teams/SquadView';
import UpcomingTeams from '../features/teams/UpcomingTeams';

const SEASON_OPTIONS = seasonsWith('teams');
const LATEST_WITH_TEAMS = SEASON_OPTIONS.find((s) => s.teams.length) ?? SEASON_OPTIONS[0];

export default function Teams() {
  const [season, setSeason] = useSeasonParam(SEASON_OPTIONS, LATEST_WITH_TEAMS);
  const [team, setTeam] = useState(null);
  const shownTeam = useLastDefined(team);
  useDocumentTitle(`Teams · Season ${season.number}`);

  return (
    <>
      <PageHeader
        label="Teams"
        ghost="Squads"
        title={
          <>
            Every season, <span className="t-serif text-brand-ink">new colours.</span>
          </>
        }
        description="Franchises are rebuilt at every auction. Pick a season to see its crests, captains and full squads."
      >
        <SeasonSwitcher
          id="teams"
          value={season.number}
          onChange={setSeason}
          options={SEASON_OPTIONS.map((s) => ({ value: s.number, label: `Season ${s.number}`, badge: s.status === 'upcoming' ? 'Soon' : null }))}
        />
      </PageHeader>

      <section className="shell pb-24 sm:pb-32">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={season.number}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            {season.teams.length ? (
              <Stagger as="ul" gap={0.06} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {season.teams.map((t) => (
                  <TeamCard key={t.slug} team={t} season={season} onOpen={setTeam} />
                ))}
              </Stagger>
            ) : (
              <UpcomingTeams
                season={season}
                onShowPrevious={season !== LATEST_WITH_TEAMS ? () => setSeason(LATEST_WITH_TEAMS.number) : undefined}
                previousLabel={`See Season ${LATEST_WITH_TEAMS.number} teams`}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <Sheet open={Boolean(team)} onClose={() => setTeam(null)} labelledBy="squad-title">
        {shownTeam && <SquadView team={shownTeam} season={season} titleId="squad-title" />}
      </Sheet>
    </>
  );
}
