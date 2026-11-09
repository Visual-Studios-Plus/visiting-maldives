import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { logout } from "../actions";
import { requireUser } from "@/lib/session";
import AdminNav from "@/components/admin/AdminNav";
import BrandMark from "@/components/admin/BrandMark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/** Sidebar contents that depend on who is signed in (read at request time, so behind Suspense). */
async function UserNav({ horizontal = false }: { horizontal?: boolean }) {
  const user = await requireUser();
  if (horizontal) return <AdminNav role={user.role} horizontal />;
  return (
    <div className="flex h-full flex-col">
      <AdminNav role={user.role} />
      <div className="mt-auto grid gap-1 border-t pt-4">
        <div className="mb-2 px-3">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="flex items-center gap-2 truncate text-xs text-muted-foreground">
            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="px-1.5 py-0 text-[10px]">
              {user.role === "ADMIN" ? "Admin" : "Writer"}
            </Badge>
            <span className="truncate">{user.email}</span>
          </p>
        </div>
        <Button asChild variant="ghost" className="justify-start text-muted-foreground">
          <Link href="/" target="_blank">
            <ExternalLink aria-hidden /> View site
          </Link>
        </Button>
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <LogOut aria-hidden /> Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 z-30 border-b bg-background lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex h-14 items-center justify-between gap-3 px-4 lg:h-full lg:flex-col lg:items-stretch lg:gap-0 lg:py-5">
          <Link href="/admin" className="flex items-center gap-2 px-1 font-semibold">
            <BrandMark />
            <span>Dashboard</span>
          </Link>
          <form action={logout} className="lg:hidden">
            <Button variant="ghost" size="sm">
              <LogOut aria-hidden /> Sign out
            </Button>
          </form>
          <div className="hidden min-h-0 flex-1 lg:mt-6 lg:block">
            <Suspense fallback={<Skeleton className="h-80" />}>
              <UserNav />
            </Suspense>
          </div>
        </div>
        {/* phones: sections as a scrolling row */}
        <div className="no-scrollbar overflow-x-auto border-t px-2 py-2 lg:hidden">
          <Suspense fallback={<Skeleton className="h-9" />}>
            <UserNav horizontal />
          </Suspense>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
