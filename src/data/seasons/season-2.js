/**
 * Season 2 — 2026.
 * Player references use ids from src/data/players.json (a person keeps the
 * same id across seasons). Images live under /public/images.
 */
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export default {
  number: 2,
  year: 2026,
  status: 'completed',
  headline: 'Sunrise to floodlights',
  summary:
    'A live player auction in Ahmedabad, 84 players, 28 partners and one marathon match day — nine games from 7 AM to a 9 PM final.',
  stats: [
    { label: 'Teams', value: 6 },
    { label: 'Players', value: 84 },
    { label: 'Matches', value: 9 },
    { label: 'Partners', value: 28 },
  ],
  milestones: [
    { date: '2026-03-04', label: 'Player auction', place: 'Ahmedabad' },
    { date: '2026-04-26', label: 'Match day', place: 'Ahmedabad' },
  ],
  champion: { team: 'mg-super-strikers' },

  teams: [
    { slug: 'uma-super11', name: 'UMA Super11', color: '#14b8c4', crest: '/images/teams/uma-super11.webp', captainId: 14, playerIds: range(1, 14) },
    { slug: 'radhe-rising-xi', name: 'Radhe Rising XI', color: '#e5383b', crest: '/images/teams/radhe-rising-xi.webp', captainId: 28, playerIds: range(15, 28) },
    { slug: 'lion-legends', name: 'Lion Legends', color: '#f77f00', crest: '/images/teams/lion-legends.webp', captainId: 42, playerIds: range(29, 42) },
    { slug: 'mg-super-strikers', name: 'MG Super Strikers', color: '#d6336c', crest: '/images/teams/mg-super-strikers.webp', captainId: 56, playerIds: range(43, 56) },
    { slug: 'cp-warriors', name: 'CP Warriors', color: '#c9a227', crest: '/images/teams/cp-warriors.webp', captainId: 70, playerIds: range(57, 70) },
    { slug: 'rishiv-kings', name: 'Rishiv Kings', color: '#4c6ef5', crest: '/images/teams/rishiv-kings.webp', captainId: 84, playerIds: range(71, 84) },
  ],

  /**
   * tier: title | co | team | partner
   * people: name as printed on the announcement; playerId links to the network.
   */
  sponsors: [
    { slug: 'title-mahadev-plywood', tier: 'title', role: 'Title Sponsor', brand: 'Mahadev Plywood & Hardware', people: [{ name: 'Aryan Patel', playerId: 22 }, { name: 'Raj Patel' }, { name: 'Harsh Patel', playerId: 53 }] },
    { slug: 'co-euro-premium-solar', tier: 'co', role: 'Co-Sponsor', brand: 'Euro Premium Solar', note: 'Authorised channel partner, Tata Power', people: [{ name: 'Alpesh Patel', playerId: 12 }] },

    { slug: 'team-uma-super11', tier: 'team', role: 'Team Sponsor', team: 'uma-super11', people: [{ name: 'Kamlesh Patel', playerId: 14 }] },
    { slug: 'team-radhe-rising-xi', tier: 'team', role: 'Team Sponsor', team: 'radhe-rising-xi', people: [{ name: 'Akash Sathvara', playerId: 28 }] },
    { slug: 'team-lion-legends', tier: 'team', role: 'Team Sponsor', team: 'lion-legends', people: [{ name: 'Mayur Fadadu', playerId: 42 }] },
    { slug: 'team-mg-super-strikers', tier: 'team', role: 'Team Sponsor', team: 'mg-super-strikers', people: [{ name: 'Parth Trivedi', playerId: 56 }] },
    { slug: 'team-cp-warriors', tier: 'team', role: 'Team Sponsor', team: 'cp-warriors', people: [{ name: 'Chandresh Pansuriya', playerId: 70 }] },
    { slug: 'team-rishiv-kings', tier: 'team', role: 'Team Sponsor', team: 'rishiv-kings', people: [{ name: 'Jayendra Parvadiya', playerId: 84 }] },

    { slug: 'auction-maitree-group', tier: 'partner', role: 'Auction Sponsor', brand: 'Maitree Group', people: [{ name: 'Kishan Kothiya', playerId: 64 }, { name: 'Krunal Kothiya', playerId: 63 }, { name: 'Naman Vekariya', playerId: 61 }] },
    { slug: 'tshirt-maitree-group', tier: 'partner', role: 'T-Shirt Sponsor', brand: 'Maitree Group', people: [{ name: 'Kishan Kothiya', playerId: 64 }, { name: 'Krunal Kothiya', playerId: 63 }, { name: 'Naman Vekariya', playerId: 61 }] },
    { slug: 'tshirt-hp-social-media', tier: 'partner', role: 'T-Shirt Sponsor', brand: 'HP Social Media Agency', people: [{ name: 'Hardik Patel', playerId: 62 }] },
    { slug: 'track-pant-bhagwati-interior', tier: 'partner', role: 'Track Pant Sponsor', brand: 'Bhagwati Interior', people: [{ name: 'Dipesh Gajera', playerId: 52 }] },
    { slug: 'ball-and-cap', tier: 'partner', role: 'Ball & Cap Sponsor', people: [{ name: 'Pritesh Dobariya', playerId: 9 }] },
    { slug: 'sixer-mahi-creation', tier: 'partner', role: 'Sixer Sponsor', brand: 'Mahi Creation', people: [{ name: 'Vishal Gorasiya' }, { name: 'Amit Dhameliya', playerId: 15 }] },
    { slug: 'four', tier: 'partner', role: 'Four Sponsor', people: [{ name: 'Sandip Vataliya', playerId: 29 }, { name: 'Hitesh Jayani', playerId: 45 }] },
    { slug: 'wicket', tier: 'partner', role: 'Wicket Sponsor', people: [{ name: 'Priyank Patel' }, { name: 'Jayesh Patel', playerId: 20 }] },
    { slug: 'no-ball-free-hit', tier: 'partner', role: 'No Ball / Free Hit Sponsor', people: [{ name: 'Ronak Darji', playerId: 32 }] },
    { slug: 'strategic-timeout', tier: 'partner', role: 'Strategic Timeout Sponsor', people: [{ name: 'Rajesh Sachani', playerId: 51 }] },
    { slug: 'umpire', tier: 'partner', role: 'Umpire Sponsor', people: [{ name: 'Lalbhai Vora', playerId: 60 }, { name: 'Hiren Sudani', playerId: 58 }] },
    { slug: 'ground', tier: 'partner', role: 'Ground Sponsor', people: [{ name: 'Jayesh Sathvara', playerId: 5 }] },
    { slug: 'photography-divyesh-sojitra', tier: 'partner', role: 'Photography Partner', brand: 'Divyesh Sojitra Photography', people: [{ name: 'Babubhai Sojitra' }, { name: 'Divyesh Sojitra', playerId: 71 }] },
    { slug: 'designing-blacksalt-creative', tier: 'partner', role: 'Design Partner', brand: 'blacksalt creative', people: [{ name: 'Chandrakantbhai Kavaiya' }, { name: 'Maulik Kavaiya', playerId: 6 }] },
    { slug: 'youtube-live', tier: 'partner', role: 'YouTube Live Sponsor', people: [{ name: 'Naresh Panchal', playerId: 65 }] },
    { slug: 'led-jay-ramadhani', tier: 'partner', role: 'LED Sponsor', brand: 'Jay Ramadhani Tools & Hardware', people: [{ name: 'Hardik Sudani', playerId: 18 }] },
    { slug: 'dj', tier: 'partner', role: 'DJ Sponsor', people: [{ name: 'Palkesh Patel', playerId: 36 }] },
    { slug: 'nutrition-maruti-health-center', tier: 'partner', role: 'Nutrition Sponsor', brand: 'Maruti Health Center', people: [{ name: 'Ajaybhai Kothiya' }, { name: 'Parulben Kothiya' }] },
    { slug: 'energy-drink', tier: 'partner', role: 'Energy Drink Sponsor', people: [{ name: 'Vipulbhai Korat' }] },
    { slug: 'ice-cream', tier: 'partner', role: 'Ice Cream Sponsor', people: [{ name: 'Ketan Aghara', playerId: 16 }, { name: 'Rajesh Thummar', playerId: 66 }, { name: 'Nikunj Sorathiya', playerId: 67 }] },
  ],

  committee: [
    { role: 'Chairman', tier: 'lead', people: [{ name: 'Bhavin Patel', playerId: 8, photo: '/images/committee/bhavin-patel.webp' }] },
    { role: 'Secretary', tier: 'lead', people: [{ name: 'Jayesh Patel', playerId: 20, photo: '/images/committee/jayesh-patel.webp' }] },
    { role: 'Treasurer', tier: 'lead', people: [{ name: 'Lalji Vora', playerId: 60, photo: '/images/committee/lalji-vora.webp' }] },
    {
      role: 'Sports Committee',
      tier: 'group',
      people: [
        { name: 'Amit Dhameliya', playerId: 15, photo: '/images/committee/amit-dhameliya.webp' },
        { name: 'Akash Sathvara', playerId: 28, photo: '/images/committee/akash-sathvara.webp' },
      ],
    },
    {
      role: 'Discipline Committee',
      tier: 'group',
      people: [{ name: 'Priyank Patel' }, { name: 'Hiren Sudani', playerId: 58 }, { name: 'Vandit Prajapati', playerId: 76 }, { name: 'Kamlesh Patel', playerId: 14 }],
    },
  ],

  gallery: [
    {
      kind: 'matches',
      title: 'Season 2 Match Day',
      description: 'Every boundary, wicket and roar from the sunrise-to-floodlights match day.',
      cover: '/images/gallery/season-2-matches',
      url: 'https://site.fotoowl.ai/divyeshsojitra/gallery/277223?share_key=9552',
      date: '2026-04-26',
    },
    {
      kind: 'auction',
      title: 'Auction Night 2026',
      description: 'Paddles up, budgets on the line — the night six franchises built their squads.',
      url: 'https://site.fotoowl.ai/divyeshsojitra/gallery/247783?pass_key=8123',
      date: '2026-03-04',
      place: 'Ahmedabad',
    },
  ],
};
