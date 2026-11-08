'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoryLabel, playerPhoto } from '../../lib/directory';
import { downloadVCard, instagramHandle, shareLink, telHref, whatsappHref } from '../../lib/contact';
import { formatPhone, initials } from '../../lib/format';
import { cn } from '../../lib/cn';
import Icon from '../../components/ui/Icon';
import Img from '../../components/ui/Img';

function Action({ href, onClick, icon, label, sub, primary, external, className }) {
  const classes = cn(
    'flex min-h-[3.5rem] items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-[background-color,border-color,transform] duration-300 active:scale-[0.98]',
    primary ? 'border-transparent bg-brand text-white hover:bg-brand/90' : 'border-line bg-surface-2/60 text-ink hover:border-ink-3/50',
    className,
  );
  const content = (
    <>
      <Icon name={icon} className="size-5 shrink-0" />
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight">{label}</span>
        {sub && <span className={cn('mt-0.5 block truncate text-xs', primary ? 'text-white/75' : 'text-ink-3')}>{sub}</span>}
      </span>
    </>
  );
  if (href) {
    return (
      <a href={href} className={classes} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}

/** Profile shown in the player sheet — built for one-tap business contact. */
export default function PlayerProfile({ player, titleId }) {
  const [shared, setShared] = useState(null);
  const latest = player.journey[0];
  const handle = instagramHandle(player.instagram);
  const profileUrl = `${window.location.origin}/players/${player.slug}`;

  useEffect(() => {
    if (!shared) return undefined;
    const timer = setTimeout(() => setShared(null), 2200);
    return () => clearTimeout(timer);
  }, [shared]);

  const saveContact = () =>
    downloadVCard({
      name: player.name,
      mobile: player.mobile,
      occupation: player.occupation,
      organisation: player.brands[0],
      url: profileUrl,
      note: ['SSG Premier League', latest && `Season ${latest.season}${latest.team ? ` · ${latest.team.name}` : ''}`].filter(Boolean).join(' — '),
    });

  const share = async () => {
    const result = await shareLink({
      title: `${player.name} · SSG Premier League`,
      text: `${player.name}${player.occupation ? ` — ${player.occupation}` : ''}, on the SSG Premier League players network.`,
      url: profileUrl,
    });
    if (result !== 'dismissed') setShared(result);
  };

  return (
    <article>
      <div className="relative">
        <div className="relative aspect-[5/4] overflow-hidden bg-surface-2 sm:aspect-[16/11]">
          {player.photo ? (
            <Img src={playerPhoto(player, 'lg')} loading="eager" className="size-full object-cover object-[50%_22%]" />
          ) : (
            <span className="t-display flex size-full items-center justify-center text-8xl text-ink-3">{initials(player.name)}</span>
          )}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface via-surface/25 to-transparent" />
          {latest?.team && (
            <div aria-hidden className="absolute inset-0 opacity-40 mix-blend-soft-light" style={{ background: `linear-gradient(160deg, transparent 40%, ${latest.team.color})` }} />
          )}
        </div>

        <div className="relative -mt-20 px-5 sm:px-7">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {player.category && <span className="chip bg-surface">{categoryLabel(player.category)}</span>}
            {player.isCaptain && (
              <span className="chip border-amber-400/30 bg-amber-400/10 text-amber-500 dark:text-amber-300">
                <Icon name="crown" className="size-3.5" /> Captain
              </span>
            )}
            {player.isChampion && (
              <span className="chip border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-300">
                <Icon name="trophy" className="size-3.5" /> Champion
              </span>
            )}
            {player.isSponsor && (
              <span className="chip border-sky-400/30 bg-sky-400/10 text-sky-600 dark:text-sky-300">
                <Icon name="handshake" className="size-3.5" /> Sponsor
              </span>
            )}
          </div>
          <h2 id={titleId} className="t-display text-[clamp(2.25rem,11vw,3.75rem)] text-ink">
            {player.name}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-ink-2">
            <Icon name="briefcase" className="size-4 text-ink-3" />
            {player.occupation || 'Profession not listed yet'}
          </p>
        </div>
      </div>

      <div className="space-y-8 px-5 pb-8 pt-6 sm:px-7 sm:pb-9">
        {player.mobile ? (
          <section aria-label="Connect">
            <div className="grid grid-cols-2 gap-2">
              <Action href={telHref(player.mobile)} icon="phone" label="Call" sub={formatPhone(player.mobile)} primary className="col-span-2" />
              <Action href={whatsappHref(player.mobile, player.name)} icon="whatsapp" label="WhatsApp" sub="Send a message" external />
              <Action onClick={saveContact} icon="contact" label="Save contact" sub="Add to phone" />
              {handle && (
                <Action href={player.instagram} icon="instagram" label="Instagram" sub={`@${handle}`} external />
              )}
              <Action
                onClick={share}
                icon={shared ? 'check' : 'share'}
                label={shared === 'copied' ? 'Link copied' : shared === 'shared' ? 'Shared' : 'Share profile'}
                sub="Send this card"
                className={cn(!handle && 'col-span-2')}
              />
            </div>
          </section>
        ) : (
          <p className="rounded-2xl border border-dashed border-line px-4 py-4 text-sm text-ink-2">
            Contact details aren’t listed for {player.name} yet.
          </p>
        )}

        {player.brands.length > 0 && (
          <section>
            <h3 className="t-label mb-3 text-ink-3">Business &amp; brands</h3>
            <ul className="flex flex-wrap gap-2">
              {player.brands.map((brand) => (
                <li key={brand} className="rounded-xl border border-line bg-surface-2/60 px-3.5 py-2 text-sm font-medium text-ink">
                  {brand}
                </li>
              ))}
            </ul>
          </section>
        )}

        {player.journey.length > 0 && (
          <section>
            <h3 className="t-label mb-3 text-ink-3">SSGPL journey</h3>
            <ol className="space-y-2">
              {player.journey.map((entry) => (
                <li key={entry.season} className="rounded-2xl border border-line bg-surface-2/40 p-4">
                  <div className="flex items-center gap-3">
                    {entry.team?.crest && (
                      <img src={entry.team.crest} alt="" className="size-11 shrink-0 object-contain" loading="lazy" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="t-label text-ink-3">
                        Season {entry.season}
                        {entry.year ? ` · ${entry.year}` : ''}
                      </p>
                      {entry.team && (
                        <Link href={`/teams?season=${entry.season}`} className="mt-0.5 block font-semibold text-ink hover:underline">
                          {entry.team.name}
                          {entry.isCaptain && <span className="font-normal text-ink-2"> · Captain</span>}
                        </Link>
                      )}
                      {entry.isChampion && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                          <Icon name="trophy" className="size-3.5" /> Season {entry.season} champions
                        </p>
                      )}
                    </div>
                  </div>
                  {(entry.sponsorships.length > 0 || entry.committee.length > 0) && (
                    <ul className="mt-3 flex flex-wrap gap-1.5 border-t border-line/70 pt-3">
                      {entry.committee.map((role) => (
                        <li key={role} className="chip">
                          {role}
                        </li>
                      ))}
                      {entry.sponsorships.map((s) => (
                        <li key={s.slug} className="chip">
                          {s.role}
                          {s.brand && <span className="text-ink-3">· {s.brand}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </article>
  );
}
