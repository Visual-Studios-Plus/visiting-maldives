"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Image from "next/image";
import { guides, navItems, photo } from "@/lib/data";
import { useSaved } from "@/lib/saved";
import { Mark } from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { list } = useSaved();
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useGSAP(() => {
    gsap.from(bar.current, { y: -80, opacity: 0, duration: 1, delay: 0.2 });
    tl.current = gsap
      .timeline({ paused: true })
      .set(menu.current, { display: "flex" })
      .fromTo(menu.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power4.inOut" })
      .from("[data-menu-item]", { y: 30, opacity: 0, stagger: 0.05, duration: 0.5 }, "-=0.2");
  });

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
      document.body.style.overflow = "hidden";
    } else {
      tl.current.timeScale(1.6).reverse();
      document.body.style.overflow = "";
    }
  }, [open]);

  const hasHero = /^\/($|things-to-do|atolls|stay|eat-drink|whats-on|plan-your-trip|guides\/)/.test(pathname);
  const onPhoto = hasHero && !solid && !open;
  const linkCls = `relative px-3 py-2 text-[15px] font-medium transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100`;

  return (
    <>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
          open ? "bg-red text-white" : onPhoto ? "bg-transparent text-white" : "bg-white text-ink shadow-[0_1px_0_#E8E2E3]"
        }`}
      >
        <nav className="container-vm grid h-[68px] grid-cols-[1fr_auto_1fr] items-center" aria-label="Main">
          {/* left */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="-ml-2 grid size-11 place-items-center lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span className={`absolute left-0 h-0.5 w-6 bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-0.5 w-6 bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
            <ul className="hidden items-center lg:flex">
              {navItems.slice(0, 4).map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={`${linkCls} ${pathname.startsWith(n.href) ? "after:scale-x-100" : ""}`}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* centre */}
          <Link href="/" aria-label="Visiting Maldives home" className="justify-self-center">
            <Mark className="size-9" tone={onPhoto || open ? "white" : "red"} />
          </Link>
          {/* right */}
          <div className="flex items-center justify-end gap-2">
            <Link
              href="/saved"
              className={`hidden items-center gap-2 rounded-control border px-4 py-2.5 text-[15px] font-medium leading-5 transition-colors sm:inline-flex ${
                onPhoto ? "border-white/60 hover:bg-white hover:text-ink" : "border-line hover:border-ink"
              }`}
            >
              Saved guides
              {list.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-red text-[11px] text-white">{list.length}</span>}
            </Link>
            <Link
              href="/plan-your-trip"
              className="hidden rounded-control bg-red px-4 py-2.5 text-[15px] font-semibold leading-5 text-white transition-colors hover:bg-red-deep sm:inline-flex"
            >
              Plan your trip
            </Link>
            <button type="button" aria-label="Search" onClick={() => setOpen(true)} className="-mr-2 grid size-11 place-items-center sm:hidden">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen red menu (guide p.35) */}
      <div ref={menu} className="fixed inset-0 z-40 hidden flex-col overflow-y-auto bg-red pt-[68px] text-white" role="dialog" aria-label="Menu">
        <div className="container-vm flex flex-1 flex-col gap-7 py-6">
          <form
            data-menu-item
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q")?.toString() ?? "";
              router.push(`/things-to-do?q=${encodeURIComponent(q)}`);
            }}
            className="flex items-center gap-3 rounded-control bg-white/15 px-4"
          >
            <svg viewBox="0 0 24 24" className="size-5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input name="q" placeholder="Search guides, islands, atolls" className="h-12 flex-1 bg-transparent text-white outline-none placeholder:text-white/70" />
          </form>
          <ul className="divide-y divide-white/20 border-b border-white/20">
            {[
              { href: "/things-to-do", label: "Things to do" },
              { href: "/atolls", label: "Islands & atolls" },
              { href: "/stay", label: "Where to stay" },
              { href: "/eat-drink", label: "Eat & drink" },
              { href: "/whats-on", label: "What's on" },
            ].map((n) => (
              <li key={n.href} data-menu-item>
                <Link href={n.href} className="flex items-center justify-between py-4 text-[26px] leading-8 font-semibold tracking-tight">
                  {n.label}
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
          <div data-menu-item>
            <p className="eyebrow text-white/70">Popular right now</p>
            <ul className="mt-3 space-y-3">
              {guides.slice(0, 3).map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="flex items-center gap-3 font-medium">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-[8px]">
                      <Image src={photo(g.image, 120)} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link data-menu-item href="/plan-your-trip" className="rounded-control bg-white py-3.5 text-center font-semibold text-ink">
            Plan your trip
          </Link>
          <p data-menu-item className="mt-auto text-center text-[13px] text-white/80">
            English · <span className="font-thaana">ދިވެހި</span>
          </p>
        </div>
      </div>
    </>
  );
}
