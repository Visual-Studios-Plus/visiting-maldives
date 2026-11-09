import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { photo } from "@/lib/data";
import { getAnalytics, type ItemStats, type TypeReport } from "@/lib/analytics";
import { getAtolls, getGuides, getStays } from "@/lib/content/store";
import ViewsChart from "@/components/admin/ViewsChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = { title: "Analytics" };

const nf = new Intl.NumberFormat("en-GB");
const pct = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 1000) / 10}%` : "–");

type Entry = { slug: string; title: string; subtitle: string; image: string; href: string; editIndex: number };

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="gap-1">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardHeader>
    </Card>
  );
}

/** One tab: headline numbers, a 30-day chart and a per-item table. */
function Section({ report, entries, collection, withSaves, noun }: { report: TypeReport; entries: Entry[]; collection: string; withSaves: boolean; noun: string }) {
  const stats = new Map(report.items.map((i) => [i.slug, i]));
  const empty = (slug: string): ItemStats => ({ slug, views: { d7: 0, d30: 0, total: 0 }, saves: { d7: 0, d30: 0, total: 0 }, unsaves: { d7: 0, d30: 0, total: 0 } });
  // every current entry, including ones with no activity yet, most-viewed first
  const rows = entries.map((e) => ({ e, s: stats.get(e.slug) ?? empty(e.slug) })).sort((x, y) => y.s.views.d30 - x.s.views.d30 || y.s.views.total - x.s.views.total);
  const max30 = Math.max(1, ...rows.map((r) => r.s.views.d30));
  const t = report.totals;

  return (
    <div className="grid gap-4">
      <div className={`grid gap-4 ${withSaves ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-3"}`}>
        <Kpi label="Views, last 7 days" value={nf.format(t.views.d7)} />
        <Kpi label="Views, last 30 days" value={nf.format(t.views.d30)} hint={`${nf.format(t.views.total)} all time`} />
        {withSaves ? (
          <>
            <Kpi label="Saves, last 30 days" value={nf.format(t.saves.d30)} hint={`${nf.format(t.unsaves.d30)} removed from saved`} />
            <Kpi label="Save rate, last 30 days" value={pct(t.saves.d30, t.views.d30)} hint="Saves per view" />
          </>
        ) : (
          <Kpi label="Views, all time" value={nf.format(t.views.total)} />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{withSaves ? "Views and saves per day" : "Views per day"}</CardTitle>
          <CardDescription>All {noun}, last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ViewsChart data={report.daily} showSaves={withSaves} />
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden pb-0">
        <CardHeader className="pb-4">
          <CardTitle>By {noun.replace(/s$/, "")}</CardTitle>
          <CardDescription>Most viewed in the last 30 days first.{withSaves ? " A high save rate means readers want to come back to it." : ""}</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead className="hidden w-40 lg:table-cell">
                <span className="sr-only">Share of views</span>
              </TableHead>
              <TableHead className="w-20 text-right">Views 30d</TableHead>
              <TableHead className="hidden w-20 text-right md:table-cell">All time</TableHead>
              {withSaves && <TableHead className="w-20 text-right">Saves 30d</TableHead>}
              {withSaves && <TableHead className="hidden w-24 text-right sm:table-cell">Save rate</TableHead>}
              <TableHead className="w-0">
                <span className="sr-only">Open</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ e, s }) => (
              <TableRow key={e.slug}>
                <TableCell className="max-w-0">
                  <Link href={`/admin/${collection}/${e.editIndex}`} className="flex items-center gap-3">
                    <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-muted">{e.image && <Image src={photo(e.image, 100)} alt="" fill sizes="36px" className="object-cover" />}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{e.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{e.subtitle}</span>
                    </span>
                    {s.views.total === 0 && (
                      <Badge variant="secondary" className="ml-auto hidden xl:inline-flex">
                        No views yet
                      </Badge>
                    )}
                  </Link>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(s.views.d30 / max30) * 100}%` }} />
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">{nf.format(s.views.d30)}</TableCell>
                <TableCell className="hidden text-right tabular-nums md:table-cell">{nf.format(s.views.total)}</TableCell>
                {withSaves && <TableCell className="text-right tabular-nums">{nf.format(s.saves.d30)}</TableCell>}
                {withSaves && <TableCell className="hidden text-right tabular-nums sm:table-cell">{pct(s.saves.d30, s.views.d30)}</TableCell>}
                <TableCell>
                  <Button asChild variant="ghost" size="icon" className="size-8">
                    <Link href={e.href} target="_blank" aria-label={`Open ${e.title} on the site`}>
                      <ExternalLink aria-hidden />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

async function Report() {
  await connection(); // always fresh: counts change with every visit
  const [a, guides, stays, atolls] = await Promise.all([getAnalytics(), getGuides(), getStays(), getAtolls()]);

  const guideEntries: Entry[] = guides.map((g, i) => ({ slug: g.slug, title: g.short, subtitle: g.category, image: g.image, href: `/guides/${g.slug}`, editIndex: i }));
  const stayEntries: Entry[] = stays.map((s, i) => ({ slug: s.slug, title: s.name, subtitle: `${s.type} · ${s.atoll}`, image: s.image, href: `/stay/${s.slug}`, editIndex: i }));
  const atollEntries: Entry[] = atolls.map((x, i) => ({ slug: x.slug, title: x.name, subtitle: x.region, image: x.image, href: `/atolls/${x.slug}`, editIndex: i }));

  return (
    <>
      {!a.available && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Metrics can&apos;t be recorded yet</AlertTitle>
          <AlertDescription>Connect a database (Vercel → Storage → Neon) so views and saves are counted on the live site.</AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="guides" className="mt-6">
        <TabsList>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="stays">Places to stay</TabsTrigger>
          <TabsTrigger value="atolls">Atolls</TabsTrigger>
        </TabsList>
        <TabsContent value="guides" className="mt-4">
          <Section report={a.byType.guide} entries={guideEntries} collection="guides" withSaves noun="guides" />
        </TabsContent>
        <TabsContent value="stays" className="mt-4">
          <Section report={a.byType.stay} entries={stayEntries} collection="stays" withSaves={false} noun="places to stay" />
        </TabsContent>
        <TabsContent value="atolls" className="mt-4">
          <Section report={a.byType.atoll} entries={atollEntries} collection="atolls" withSaves={false} noun="atolls" />
        </TabsContent>
      </Tabs>
      <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
        Privacy-friendly: one view per page per browser session, counted per day; saves come from the bookmark on each guide. No cookies, IP addresses or personal data are stored, and bots are ignored.
      </p>
    </>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
      <p className="mt-1 text-muted-foreground">How people use guides, places to stay and atoll pages.</p>
      <Suspense
        fallback={
          <div className="mt-6 grid gap-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        }
      >
        <Report />
      </Suspense>
    </div>
  );
}
