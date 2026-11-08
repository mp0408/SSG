import TeamsView from '../../features/teams/TeamsView';

export const metadata = {
  title: 'Teams',
  description: 'Franchises are rebuilt at every auction. Pick a season to see its crests, captains and full squads.',
};

export default function TeamsPage() {
  return <TeamsView />;
}
