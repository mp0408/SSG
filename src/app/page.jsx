import Hero from '../features/home/Hero';
import StatsSection from '../features/home/StatsSection';
import ChampionsSection from '../features/home/ChampionsSection';
import RoadmapSection from '../features/home/RoadmapSection';
import NetworkSection from '../features/home/NetworkSection';
import FranchisesSection from '../features/home/FranchisesSection';
import CommitteeSection from '../features/home/CommitteeSection';
import MomentsSection from '../features/home/MomentsSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <ChampionsSection />
      <RoadmapSection />
      <NetworkSection />
      <FranchisesSection />
      <CommitteeSection />
      <MomentsSection />
    </>
  );
}
