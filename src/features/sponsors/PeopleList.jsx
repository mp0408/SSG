import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { getPlayer } from '../../lib/directory';
import { cn } from '../../lib/cn';

/** Sponsor names; people who are also players link to their network profile. */
export default function PeopleList({ people, className, size = 'text-sm' }) {
  return (
    <p className={cn('leading-relaxed text-ink-2', size, className)}>
      {people.map((person, index) => {
        const player = person.playerId ? getPlayer(person.playerId) : null;
        return (
          <Fragment key={person.name}>
            {index > 0 && <span className="text-ink-3"> · </span>}
            {player ? (
              <Link
                to={`/players/${player.slug}`}
                className="text-ink underline decoration-line decoration-1 underline-offset-4 transition-colors hover:decoration-brand-ink"
                onClick={(event) => event.stopPropagation()}
              >
                {player.name}
              </Link>
            ) : (
              <span>{person.name}</span>
            )}
          </Fragment>
        );
      })}
    </p>
  );
}
