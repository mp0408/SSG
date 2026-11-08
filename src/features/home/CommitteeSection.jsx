import Link from 'next/link';
import { SEASONS } from '../../data/seasons';
import { getPlayer, playerPhoto } from '../../lib/directory';
import { initials } from '../../lib/format';
import { cn } from '../../lib/cn';
import Icon from '../../components/ui/Icon';
import { Stagger } from '../../components/ui/Reveal';
import SectionHeading from '../../components/ui/SectionHeading';

// The committee of the most recent season that has announced one.
const SEASON = SEASONS.find((s) => s.committee?.length);

/** Flattens role groups into one card per person. */
const membersOf = (groups) =>
  groups.flatMap((group) =>
    group.people.map((person) => {
      const player = person.playerId ? getPlayer(person.playerId) : null;
      return {
        key: `${group.role}-${person.name}`,
        role: group.role.replace(/ Committee$/, ''),
        group: group.role,
        name: player?.name ?? person.name,
        photo: person.photo ?? playerPhoto(player, 'lg'),
        to: player ? `/players/${player.slug}` : null,
      };
    }),
  );

function MemberCard({ member, large, className, wide }) {
  const Wrapper = member.to ? Link : 'div';
  return (
    <li className={className}>
      <Wrapper
        {...(member.to ? { href: member.to } : {})}
        className={cn('group relative block overflow-hidden rounded-2xl bg-surface-2', wide ? 'aspect-[4/3] sm:aspect-[4/5]' : 'aspect-[4/5]')}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-[50%_20%] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full justify-center bg-[linear-gradient(150deg,rgb(var(--brand)/0.9),#071233_85%)] pt-[22%]">
            <span className="t-display text-outline text-[clamp(3.5rem,14vw,6rem)] leading-none [-webkit-text-stroke-color:rgb(255_255_255/0.55)]">{initials(member.name)}</span>
          </div>
        )}

        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#02050d]/95 via-[#02050d]/15 to-transparent" />

        <div className={cn('absolute inset-x-0 bottom-0', large ? 'p-4 sm:p-7' : 'p-3 sm:p-5 lg:p-3.5')}>
          <p className="t-label flex items-center gap-2 text-white/75">
            <span className="size-1.5 shrink-0 rotate-45 bg-glow" />
            {member.role}
          </p>
          <p className={cn('t-display mt-1.5 text-white', large ? 'text-[clamp(1.75rem,6vw,2.75rem)]' : 'text-[clamp(1.35rem,4.5vw,1.9rem)] lg:text-[1.45rem]')}>{member.name}</p>
        </div>

        {member.to && (
          <span className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-lg bg-white text-[#0a1226] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Icon name="arrowUpRight" className="size-4" />
          </span>
        )}
      </Wrapper>
    </li>
  );
}

export default function CommitteeSection() {
  if (!SEASON) return null;
  const leaders = membersOf(SEASON.committee.filter((g) => g.tier === 'lead'));
  const members = membersOf(SEASON.committee.filter((g) => g.tier !== 'lead'));
  const groups = [...new Set(members.map((m) => m.group))];

  return (
    <section id="committee" className="section">
      <div className="shell">
        <SectionHeading
          index="05"
          label={`Organising committee · Season ${SEASON.number}`}
          title={
            <>
              The people behind <span className="t-accent">the pitch.</span>
            </>
          }
          description="Volunteers from the community who run the auction, the rules, the money and match day. Tap anyone to view their profile."
        />

        {/* Phones: chairman across the top, the other two side by side */}
        <Stagger as="ul" gap={0.08} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {leaders.map((member, index) => (
            <MemberCard key={member.key} member={member} large wide={index === 0} className={cn(index === 0 && 'max-sm:col-span-2')} />
          ))}
        </Stagger>

        {members.length > 0 && (
          <>
            <div className="mb-5 mt-12 flex flex-wrap items-baseline justify-between gap-2 border-b border-line/70 pb-4 sm:mb-6 sm:mt-20">
              <h3 className="t-display text-3xl text-ink sm:text-4xl">Committee members</h3>
              <p className="text-sm text-ink-3">{groups.join(' · ')}</p>
            </div>
            <Stagger as="ul" gap={0.05} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
              {members.map((member) => (
                <MemberCard key={member.key} member={member} />
              ))}
            </Stagger>
          </>
        )}
      </div>
    </section>
  );
}
