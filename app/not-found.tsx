import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-vm grid min-h-[calc(70svh/var(--z))] place-items-center pt-32 pb-24 text-center">
      <div>
        <p className="font-mono text-[12px] text-red">404</p>
        <h1 className="mt-4 text-[44px] leading-none font-semibold tracking-[-0.03em]">
          This island <span className="accent">isn&apos;t on the map.</span>
        </h1>
        <Link href="/" className="mt-8 inline-flex rounded-control bg-red px-5 py-3 font-semibold text-white">
          Back to the guide
        </Link>
      </div>
    </section>
  );
}
