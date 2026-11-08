import { formatDate } from '../../lib/format';
import Icon from '../../components/ui/Icon';
import Img from '../../components/ui/Img';

function AuctionCover({ album }) {
  return (
    <div className="relative flex size-full min-h-[200px] flex-col justify-end overflow-hidden bg-[radial-gradient(60%_60%_at_100%_0%,rgb(var(--brand)/0.5),transparent_70%),linear-gradient(140deg,#0d1f52_0%,#060c1f_70%)] p-5 sm:p-8">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:20px_20px]" />
      <Icon
        name="gavel"
        strokeWidth={1.2}
        className="absolute right-5 top-5 size-16 origin-bottom-left text-white/25 transition-transform duration-300 ease-out group-hover:-rotate-[22deg] sm:right-6 sm:top-6 sm:size-24"
      />
      <p className="t-label relative text-white/60">Satva Shiv Gold</p>
      <p className="t-display relative mt-2 text-[clamp(2.75rem,9vw,4.5rem)] text-white">
        Auction
        <br />
        Night
      </p>
      <p className="relative mt-3 text-sm text-white/70">{[formatDate(album.date), album.place].filter(Boolean).join(' · ')}</p>
    </div>
  );
}

/** Album link card: the image zooms on hover and the panel picks up a floodlit edge. */
export default function AlbumCard({ album }) {
  return (
    <li>
      <a
        href={album.url}
        target="_blank"
        rel="noopener noreferrer"
        className="card card-interactive group grid overflow-hidden md:grid-cols-12"
      >
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line md:col-span-5 md:aspect-auto md:min-h-[320px] md:border-b-0 md:border-r">
          {album.cover ? (
            <Img src={`${album.cover}-sm.webp`} srcSet={`${album.cover}-sm.webp 800w, ${album.cover}.webp 1600w`} sizes="(min-width: 768px) 40vw, 100vw" className="absolute inset-0 size-full object-cover group-hover:scale-105" />
          ) : (
            <AuctionCover album={album} />
          )}
        </div>

        <div className="relative flex flex-col p-5 sm:p-10 md:col-span-7">
          <span className="t-label inline-flex w-fit items-center gap-2 rounded-md border border-line bg-surface-2/70 px-2.5 py-1.5 text-ink-2">
            <span className="size-1.5 rotate-45 bg-glow" />
            Season {album.season} · {album.year}
          </span>
          <h3 className="t-display mt-5 text-[clamp(2.25rem,7vw,4rem)] text-ink sm:mt-6">{album.title}</h3>
          <p className="mt-3 max-w-lg text-pretty leading-relaxed text-ink-2 sm:mt-4 sm:text-lg">{album.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 md:mt-auto md:pt-10">
            <span className="inline-flex h-11 items-center gap-2.5 rounded-lg bg-brand px-5 text-sm font-semibold text-white">
              Open album
              <Icon name="arrowUpRight" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
            <span className="text-xs text-ink-3">Opens fotoowl gallery</span>
          </div>
        </div>
      </a>
    </li>
  );
}

export function LockedAlbum({ season, kind }) {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-dashed border-line bg-surface/50 p-5 sm:gap-5 sm:p-8">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-ink-3 sm:size-14">
        <Icon name="lock" className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="t-label text-ink-3">Season {season.number} · Coming soon</p>
        <p className="mt-1.5 text-ink-2">The {kind === 'auction' ? 'auction night' : 'match day'} album unlocks right here once the cameras are out.</p>
      </div>
    </li>
  );
}
