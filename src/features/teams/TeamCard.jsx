import { getPlayer, playerPhoto } from '../../lib/directory';
import Avatar from '../../components/ui/Avatar';
import Icon from '../../components/ui/Icon';

export default function TeamCard({ team, season, onOpen }) {
  const captain = getPlayer(team.captainId);
  return (
    <li>
      <button type="button" onClick={() => onOpen(team)} className="card card-interactive group block w-full overflow-hidden text-left" aria-label={`${team.name}: view squad`}>
        <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-1" style={{ background: team.color }} />
        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden sm:aspect-[4/3]" style={{ background: `radial-gradient(65% 65% at 50% 48%, ${team.color}3d, transparent 72%)` }}>
          <div aria-hidden className="bg-dots absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_70%_at_50%_50%,#000,transparent)]" />
          <img src={team.crest} alt="" loading="lazy" className="relative h-[66%] w-auto max-w-[72%] object-contain transition-transform duration-500 ease-out group-hover:-rotate-2 group-hover:scale-[1.06]" />
          <div className="absolute inset-x-3 top-3.5 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
            {season.champion?.team === team.slug ? (
              <span className="flex items-center gap-1.5 rounded bg-amber-400/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                <Icon name="trophy" className="size-3.5 shrink-0" /> Champions
              </span>
            ) : (
              <span className="t-label text-ink-3">Season {season.number}</span>
            )}
            <span className="t-label shrink-0 text-ink-3">{team.playerIds.length} players</span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-line/70 p-4 sm:p-5">
          <div className="min-w-0">
            <h3 className="t-display text-[1.875rem] text-ink sm:text-[2rem]">{team.name}</h3>
            {captain && (
              <p className="mt-2.5 flex items-center gap-2 text-sm text-ink-2">
                <Avatar src={playerPhoto(captain, 'xs')} name={captain.name} className="size-6 text-[10px]" />
                <span className="truncate">{captain.name}</span>
                <span className="shrink-0 text-ink-3">· Captain</span>
              </p>
            )}
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-line text-ink-2 transition-colors duration-200 group-hover:border-transparent group-hover:bg-ink group-hover:text-bg">
            <Icon name="arrowUpRight" className="size-4" />
          </span>
        </div>
      </button>
    </li>
  );
}
