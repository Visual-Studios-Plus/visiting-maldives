import SkyHero from "@/components/SkyHero";
import ExploreStack from "@/components/ExploreStack";
import CountersPinned from "@/components/CountersPinned";
import GuideCarousel from "@/components/GuideCarousel";
import { guideSummary } from "@/lib/data";
import { getGuides } from "@/server/content/store";

// Homepage: sky hero → most-read guides → ways to see the Maldives → key numbers → footer.
export default async function Home() {
  const guides = await getGuides();
  return (
    <>
      <SkyHero />

      <GuideCarousel guides={guides.map(guideSummary)} />

      <ExploreStack />

      <CountersPinned />
    </>
  );
}
