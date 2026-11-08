'use client';

import { memo } from 'react';
import { playerPhoto, playerSrcSet } from '../../lib/directory';
import { initials } from '../../lib/format';
import Icon from '../../components/ui/Icon';
import Img from '../../components/ui/Img';

const SIZES = '(min-width: 1280px) 220px, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 47vw';

/** Portrait card. Pure CSS motion and `content-visibility`, so a grid of ~100 stays smooth on mid-range phones. */
function PlayerCard({ player, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(player)}
      className="group block w-full text-left [contain-intrinsic-size:auto_260px] [content-visibility:auto]"
      aria-label={`${player.name}${player.occupation ? `, ${player.occupation}` : ''}. View profile`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-2 ring-1 ring-line/60 transition-[box-shadow,transform] duration-300 ease-out group-hover:ring-glow/60 group-active:scale-[0.98]">
        {player.photo ? (
          <Img src={playerPhoto(player, 'sm')} srcSet={playerSrcSet(player)} sizes={SIZES} width={400} height={500} className="size-full object-cover group-hover:scale-[1.045]" />
        ) : (
          <span className="t-display flex size-full items-center justify-center text-5xl text-ink-3">{initials(player.name)}</span>
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#03060f]/90 via-[#03060f]/10 to-transparent" />

        {(player.isCaptain || player.isSponsor) && (
          <div className="absolute left-2 top-2 flex gap-1.5">
            {player.isCaptain && (
              <span className="flex size-7 items-center justify-center rounded-md bg-black/65 text-amber-300" title="Captain">
                <Icon name="crown" className="size-3.5" />
              </span>
            )}
            {player.isSponsor && (
              <span className="flex size-7 items-center justify-center rounded-md bg-black/65 text-sky-300" title="Sponsor">
                <Icon name="handshake" className="size-3.5" />
              </span>
            )}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <p className="truncate text-[15px] font-semibold leading-tight text-white sm:text-base">{player.name}</p>
          <p className="mt-1 truncate text-xs text-white/70 sm:text-[13px]">{player.occupation || 'SSGPL player'}</p>
        </div>
      </div>
    </button>
  );
}

export default memo(PlayerCard);
