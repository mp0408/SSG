'use client';

import { useState } from 'react';
import { seasonsWith } from '../../data/seasons';
import { useSeasonParam } from '../../hooks/useSeasonParam';
import { useLastDefined } from '../../hooks/useLastDefined';
import PageHeader from '../../components/ui/PageHeader';
import SeasonSwitcher from '../../components/ui/SeasonSwitcher';
import Sheet from '../../components/ui/Sheet';
import { Stagger } from '../../components/ui/Reveal';
import TeamCard from './TeamCard';
import SquadView from './SquadView';
import UpcomingTeams from './UpcomingTeams';

const SEASON_OPTIONS = seasonsWith('teams');
const LATEST_WITH_TEAMS = SEASON_OPTIONS.find((s) => s.teams.length) ?? SEASON_OPTIONS[0];

export default function TeamsView() {
  const [season, setSeason] = useSeasonParam(SEASON_OPTIONS, LATEST_WITH_TEAMS);
  const [team, setTeam] = useState(null);
  const shownTeam = useLastDefined(team);

  return (
    <>
      <PageHeader
        label="Teams"
        ghost="Squads"
        title={
          <>
            Every season, <span className="t-accent">new colours.</span>
          </>
        }
        description="Franchises are rebuilt at every auction. Pick a season to see its crests, captains and full squads."
      >
        <SeasonSwitcher
          value={season.number}
          onChange={setSeason}
          options={SEASON_OPTIONS.map((s) => ({ value: s.number, label: `Season ${s.number}`, badge: s.status === 'upcoming' ? 'Soon' : null }))}
        />
      </PageHeader>

      <section className="shell pb-20 sm:pb-32">
        <div key={season.number} className="animate-fade-up">
          {season.teams.length ? (
            <Stagger as="ul" gap={0.06} className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
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
        </div>
      </section>

      <Sheet open={Boolean(team)} onClose={() => setTeam(null)} labelledBy="squad-title">
        {shownTeam && <SquadView team={shownTeam} season={season} titleId="squad-title" />}
      </Sheet>
    </>
  );
}
