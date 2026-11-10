"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BedDouble, BookOpen, CalendarDays, Info, LayoutGrid, Map, Soup, UserCog, Users, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { COLLECTIONS, type CollectionKey } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

const ICONS: Record<CollectionKey, LucideIcon> = {
  guides: BookOpen,
  atolls: Map,
  stays: BedDouble,
  dishes: Soup,
  eats: UtensilsCrossed,
  events: CalendarDays,
  essentials: Info,
};

type NavLink = { href: string; label: string; icon: LucideIcon; group?: string };

export default function AdminNav({ role, horizontal = false }: { role: "ADMIN" | "WRITER"; horizontal?: boolean }) {
  const pathname = usePathname();
  const links: NavLink[] = [
    { href: "/admin", label: "Overview", icon: LayoutGrid },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ...COLLECTIONS.map((c, i) => ({ href: `/admin/${c.key}`, label: c.label, icon: ICONS[c.key], group: i === 0 ? "Content" : undefined })),
    ...(role === "ADMIN" ? [{ href: "/admin/users", label: "Users", icon: Users, group: "Team" }] : []),
    { href: "/admin/account", label: "My account", icon: UserCog, group: role === "ADMIN" ? undefined : "Team" },
  ];
  return (
    <nav aria-label="Dashboard" className={horizontal ? "flex gap-1" : "flex flex-col gap-0.5"}>
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname === l.href || pathname.startsWith(l.href + "/");
        const Icon = l.icon;
        return (
          <div key={l.href} className={cn(!horizontal && l.group && "mt-4 border-t pt-4")}>
            {!horizontal && l.group && <p className="mb-1 px-3 text-xs font-medium text-muted-foreground">{l.group}</p>}
            <Link
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {l.label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
