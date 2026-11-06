import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import GuideCarousel from "@/components/GuideCarousel";
import Stats from "@/components/Stats";
import Reveal from "@/components/Reveal";
import Seasons from "@/components/Seasons";
import { Mark } from "@/components/Logo";
import { guides, P, photo } from "@/lib/data";

// Homepage follows brand guide p.33 top to bottom:
// hero → most-read guides carousel → About the Maldives bento → key numbers → footer.
export default function Home() {
  return (
    <>
      <PageHero
        full
        image={P.aerial}
        eyebrow="Malé, Maldives · Best season Dec–Apr"
        title="Every island"
        accent="tells a story."
        intro="The independent guide to local islands, reefs and atolls, with checked facts and honest advice."
      >
        <div data-hero-fade className="mt-8 flex w-[72%] max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <Link href="/things-to-do" className="rounded-control bg-red px-6 py-3.5 text-center font-semibold text-white transition-colors hover:bg-red-deep">
            Start exploring
          </Link>
          <Link href="/atolls" className="rounded-control border border-white/70 px-6 py-3.5 text-center font-semibold transition-colors hover:bg-white hover:text-ink">
            Browse atolls
          </Link>
        </div>
        <div data-hero-fade className="mt-12 hidden flex-wrap items-center justify-center gap-2 sm:flex">
          <span className="eyebrow mr-1 text-white/70">Popular now</span>
          {[
            ["Manta season · Baa", "/guides/manta-season-hanifaru-bay"],
            ["Malé in a day", "/guides/male-on-foot"],
            ["Local islands", "/guides/local-islands-by-ferry"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="inline-flex min-h-11 items-center rounded-control bg-ink/55 px-3.5 text-[14px] font-medium transition-colors hover:bg-white hover:text-ink">
              {label}
            </Link>
          ))}
        </div>
      </PageHero>

      <GuideCarousel />

      {/* About the Maldives: dark story card, photo card, best-time card */}
      <Reveal as="section" className="container-vm pb-12 lg:pb-24">
        <div data-reveal className="text-center">
          <span className="eyebrow inline-block rounded-control bg-shell px-2.5 py-1 text-red">About the Maldives</span>
          <h2 className="mx-auto mt-4 max-w-3xl text-[36px] leading-[1.03] font-semibold tracking-[-0.03em] sm:text-[48px] lg:text-[60px]">
            The Maldives is <span className="accent">more than a resort.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-snug text-driftwood">
            From reef channels to the streets of Malé, our guides bring you closer to its islands, culture and people.
          </p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <div data-reveal className="flex min-h-[460px] flex-col justify-between rounded-card bg-ink p-8 text-white">
            <Mark className="size-10" tone="white" />
            <div>
              <p className="text-[26px] leading-8 font-semibold tracking-tight">
                Stay on a local island, travel by public ferry and meet the people who live there.{" "}
                <span className="accent text-white/70">Our local islands guide shows you how.</span>
              </p>
              <Link href="/guides/local-islands-by-ferry" className="mt-8 inline-flex rounded-control bg-white px-5 py-3 font-semibold text-ink transition-colors hover:bg-red hover:text-white">
                Read the guide
              </Link>
            </div>
          </div>
          <Link data-reveal href={`/guides/${guides[0].slug}`} className="group relative min-h-[460px] overflow-hidden rounded-card">
            <Image src={photo(P.diver, 1000)} alt="Snorkelling with mantas, Baa Atoll" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <p className="absolute bottom-6 left-6 text-[17px] font-semibold text-white">Snorkelling with mantas, Baa Atoll</p>
          </Link>
          <div data-reveal className="flex min-h-[460px] flex-col justify-between rounded-card bg-shell p-8">
            <div>
              <p className="text-[64px] leading-none font-semibold tracking-[-0.04em] text-red">Dec–Apr</p>
              <p className="mt-3 text-[22px] font-semibold">Best time to visit</p>
              <p className="mt-2 leading-snug text-driftwood">Dry northeast monsoon. May–Nov is wetter, but best for mantas and surf.</p>
            </div>
            <Seasons />
          </div>
        </div>
      </Reveal>

      <Stats />
    </>
  );
}
