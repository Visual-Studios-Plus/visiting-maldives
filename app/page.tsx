import SkyHero from "@/components/SkyHero";
import ExploreStack from "@/components/ExploreStack";
import CountersPinned from "@/components/CountersPinned";
import GuideCarousel from "@/components/GuideCarousel";

// Homepage: sky hero → most-read guides → ways to see the Maldives → key numbers → footer.
export default function Home() {
  return (
    <>
      <SkyHero />

      <GuideCarousel />

      <ExploreStack />

      <CountersPinned />
    </>
  );
}
