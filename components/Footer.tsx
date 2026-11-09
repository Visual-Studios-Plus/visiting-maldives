import Link from "next/link";
import { Logo } from "./Logo";

const cols = [
  { title: "Explore", links: [["Things to do", "/things-to-do"], ["Islands & atolls", "/atolls"], ["Where to stay", "/stay"], ["Eat & drink", "/eat-drink"], ["What's on", "/whats-on"]] },
  { title: "Plan", links: [["Arrival & visas", "/plan-your-trip#arrival"], ["Transfers", "/plan-your-trip#transfers"], ["Money & SIM", "/plan-your-trip#money"], ["Weather", "/plan-your-trip#weather"]] },
  { title: "About", links: [["Saved guides", "/saved"], ["Photo credits", "/credits"]] },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-vm grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:py-24">
        <div>
          <Logo light />
          <p className="mt-6 max-w-xs text-[28px] leading-8 font-semibold tracking-tight">
            The Maldives, <span className="accent">island by island.</span>
          </p>
          <Link href="/plan-your-trip" className="mt-8 inline-flex rounded-control bg-white px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-red hover:text-white">
            Plan your trip
          </Link>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="eyebrow text-white/50">{c.title}</p>
            <ul className="mt-4 space-y-3">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-white/85 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-vm flex flex-col gap-2 py-6 font-mono text-[12px] text-white/50 sm:flex-row sm:justify-between">
          <p>© 2026 Visiting Maldives · Independent guide. Partner content is always labelled.</p>
        </div>
      </div>
    </footer>
  );
}
