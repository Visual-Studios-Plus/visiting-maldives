import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ArrowRight, Eye } from "lucide-react";
import { COLLECTIONS } from "@/lib/content/schema";
import { getCollection, getGuides, isCustomised, storageMode } from "@/lib/content/store";
import { getAnalytics } from "@/lib/analytics";
import { securityWarnings } from "@/lib/auth";
import { requireUser } from "@/lib/session";
import Flash from "@/components/admin/Flash";
import StorageNotice from "@/components/admin/StorageNotice";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Overview" };

const nf = new Intl.NumberFormat("en-GB");

async function ViewsSummary() {
  await connection(); // "last 30 days" depends on today, so render at request time
  const [a, guides] = await Promise.all([getAnalytics(), getGuides()]);
  const g = a.byType.guide;
  const top = [...g.items].sort((x, y) => y.views.d30 - x.views.d30)[0];
  const topTitle = top ? (guides.find((g) => g.slug === top.slug)?.short ?? top.slug) : null;
  return (
    <Link href="/admin/analytics" className="group block">
      <Card className="transition-shadow group-hover:shadow-md">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <Eye className="size-4" aria-hidden /> Guide views, last 30 days
          </CardDescription>
          <CardTitle className="text-3xl tabular-nums">{nf.format(g.totals.views.d30)}</CardTitle>
          <CardDescription>{nf.format(g.totals.saves.d30)} saves in the same period</CardDescription>
        </CardHeader>
        <CardFooter className="justify-between text-sm text-muted-foreground">
          <span>{topTitle ? `Most read: ${topTitle}` : "No views recorded yet"}</span>
          <span className="flex items-center gap-1 font-medium text-primary">
            Analytics <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

async function Collections() {
  const rows = await Promise.all(COLLECTIONS.map(async (c) => ({ c, count: (await getCollection(c.key)).length, edited: await isCustomised(c.key) })));
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map(({ c, count, edited }) => (
        <li key={c.key}>
          <Link href={`/admin/${c.key}`} className="group block h-full">
            <Card className="h-full gap-4 transition-shadow group-hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg">{c.label}</CardTitle>
                  <span className="font-mono text-sm text-muted-foreground tabular-nums">{count}</span>
                </div>
                <CardDescription>{c.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-between">
                <Badge variant={edited ? "default" : "secondary"}>{edited ? "Edited" : "Built-in content"}</Badge>
                <span className="flex items-center gap-1 text-sm font-medium text-primary">
                  Manage <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Greeting and setup notices; security warnings are for admins only. */
async function Header({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  const [user, sp] = await Promise.all([requireUser(), searchParams]);
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Hello, {user.name.split(" ")[0]}</h1>
      <p className="mt-1 text-muted-foreground">Everything editable on the site. Changes go live as soon as you save.</p>
      {sp.denied && <Flash tone="error" message="That page is for admins only." />}
      <StorageNotice mode={storageMode()} warnings={user.role === "ADMIN" ? securityWarnings() : []} />
    </>
  );
}

export default function Overview(props: PageProps<"/admin">) {
  return (
    <div className="mx-auto max-w-5xl">
      <Suspense fallback={<Skeleton className="h-16 rounded-xl" />}>
        <Header searchParams={props.searchParams} />
      </Suspense>
      <div className="mt-8">
        <Suspense fallback={<Skeleton className="h-36 rounded-xl" />}>
          <ViewsSummary />
        </Suspense>
      </div>
      <h2 className="mt-10 mb-4 text-lg font-semibold">Content</h2>
      <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
        <Collections />
      </Suspense>
    </div>
  );
}
