import Link from 'next/link';
import { getPlayer, playerPhoto } from '../../lib/directory';
import Avatar from '../../components/ui/Avatar';
import Icon from '../../components/ui/Icon';

export default function SquadView({ team, season, titleId }) {
  const squad = team.playerIds
    .map(getPlayer)
    .filter(Boolean)
    .sort((a, b) => (b.id === team.captainId) - (a.id === team.captainId) || a.name.localeCompare(b.name));
  const sponsor = season.sponsors.find((s) => s.team === team.slug);

  return (
    <div>
      <header className="relative overflow-hidden px-5 pb-6 pt-12 sm:px-7">
        <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${team.color}33, transparent 85%)` }} />
        <div className="relative flex items-center gap-5">
          <img src={team.crest} alt="" className="size-20 shrink-0 object-contain sm:size-24" />
          <div className="min-w-0">
            <p className="t-label text-ink-3">
              Season {season.number} · {season.year}
            </p>
            <h2 id={titleId} className="t-display mt-2 text-[clamp(2rem,9vw,2.5rem)] text-ink">
              {team.name}
            </h2>
          </div>
        </div>
        <dl className="relative mt-6 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl border border-line bg-surface/70 px-4 py-3">
            <dt className="text-ink-3">Squad</dt>
            <dd className="mt-0.5 font-semibold text-ink">{squad.length} players</dd>
          </div>
          {sponsor && (
            <div className="rounded-2xl border border-line bg-surface/70 px-4 py-3">
              <dt className="text-ink-3">Team sponsor</dt>
              <dd className="mt-0.5 truncate font-semibold text-ink">{sponsor.people.map((p) => p.name).join(', ')}</dd>
            </div>
          )}
        </dl>
      </header>

      <ul className="divide-y divide-line/70 border-t border-line/70 pb-4">
        {squad.map((player) => {
          const captain = player.id === team.captainId;
          return (
            <li key={player.id}>
              <Link href={`/players/${player.slug}`} className="group flex items-center gap-4 px-5 py-3 transition-colors hover:bg-surface-2/60 sm:px-7">
                <Avatar src={playerPhoto(player, 'xs')} name={player.name} className="size-12 text-sm" rounded="rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">
                    {player.name}
                    {captain && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 align-middle text-[11px] font-semibold text-amber-600 dark:text-amber-300">
                        <Icon name="crown" className="size-3" /> C
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-ink-3">{player.occupation || 'SSGPL player'}</p>
                </div>
                <Icon name="arrowRight" className="size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
