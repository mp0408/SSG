/**
 * Season 3 — upcoming.
 * As things get announced: set dates on the roadmap, flip step `state`
 * ('done' | 'next' | 'later'), then fill teams / sponsors / committee.
 */
export default {
  number: 3,
  year: null,
  status: 'upcoming',
  headline: 'The next innings',
  summary: 'New auction, new squads, new partners. The dates drop soon — and the next chapter could have your name in it.',
  stats: [],
  milestones: [],
  champion: null, // after the final: { team: '<team-slug>' }
  roadmap: [
    { title: 'Player registrations', detail: 'Returning legends and new faces sign up for the pool.', when: 'Opening soon', state: 'next' },
    { title: 'Player auction', detail: 'Franchise owners build their squads live, paddle by paddle.', when: 'Date TBA', state: 'later' },
    { title: 'Teams revealed', detail: 'New crests, new captains, fresh rivalries.', when: 'After the auction', state: 'later' },
    { title: 'Fixtures released', detail: 'The full match-day schedule, time slot by time slot.', when: 'After the auction', state: 'later' },
    { title: 'Match day', detail: 'Sunrise to floodlights — every team, one ground.', when: 'Date TBA', state: 'later' },
    { title: 'Grand final', detail: 'Two teams. One trophy. One night to remember.', when: 'Date TBA', state: 'later' },
  ],
  teams: [],
  sponsors: [],
  committee: [],
  gallery: [],
};
