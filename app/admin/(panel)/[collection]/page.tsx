import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Plus, RotateCcw } from "lucide-react";
import { photo } from "@/lib/data";
import { fillPath, getCollectionDef, type CollectionDef } from "@/lib/content/schema";
import { getCollection, isCustomised, storageMode } from "@/lib/content/store";
import { moveItem, restoreBuiltIn } from "../../actions";
import { requireUser } from "@/lib/session";
import StorageNotice from "@/components/admin/StorageNotice";
import ConfirmButton from "@/components/admin/ConfirmButton";
import Flash from "@/components/admin/Flash";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Item = Record<string, unknown>;

async function List({ def }: { def: CollectionDef }) {
  const [items, edited, user] = await Promise.all([getCollection(def.key) as Promise<Item[]>, isCustomised(def.key), requireUser()]);
  const isAdmin = user.role === "ADMIN"; // writers can't reorder or restore (the actions refuse too)

  if (items.length === 0) {
    return (
      <Card className="mt-6 items-center p-10 text-center">
        <p className="font-semibold">No {def.label.toLowerCase()} yet</p>
        <Button asChild>
          <Link href={`/admin/${def.key}/new`}>
            <Plus aria-hidden /> Add the first {def.singular}
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-6 gap-0 overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12 text-right">#</TableHead>
              <TableHead>{def.fields.find((f) => f.name === def.titleField)?.label ?? "Title"}</TableHead>
              {isAdmin && <TableHead className="hidden w-28 text-center md:table-cell">Order</TableHead>}
              <TableHead className="w-0 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, i) => {
              const title = String(item[def.titleField] ?? "Untitled");
              const sub = def.subtitleField ? String(item[def.subtitleField] ?? "") : "";
              const img = def.imageField ? String(item[def.imageField] ?? "") : "";
              return (
                <TableRow key={`${title}-${i}`}>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground tabular-nums">{i + 1}</TableCell>
                  <TableCell className="max-w-0">
                    <Link href={`/admin/${def.key}/${i}`} className="flex items-center gap-3 rounded-md outline-offset-2">
                      {def.imageField && (
                        <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
                          {img && <Image src={photo(img, 120)} alt="" fill sizes="44px" className="object-cover" />}
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{title}</span>
                        {sub && <span className="block truncate text-xs text-muted-foreground">{sub}</span>}
                      </span>
                    </Link>
                  </TableCell>
                  {isAdmin && <TableCell className="hidden md:table-cell">
                    <div className="flex justify-center gap-1">
                      <form action={moveItem.bind(null, def.key, i, -1)}>
                        <Button variant="ghost" size="icon" className="size-8" disabled={i === 0} aria-label={`Move ${title} up`}>
                          <ArrowUp aria-hidden />
                        </Button>
                      </form>
                      <form action={moveItem.bind(null, def.key, i, 1)}>
                        <Button variant="ghost" size="icon" className="size-8" disabled={i === items.length - 1} aria-label={`Move ${title} down`}>
                          <ArrowDown aria-hidden />
                        </Button>
                      </form>
                    </div>
                  </TableCell>}
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {def.itemPath && (
                        <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
                          <Link href={fillPath(def.itemPath, item)} target="_blank" aria-label={`View ${title} on the site`}>
                            <ExternalLink aria-hidden />
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/${def.key}/${i}`}>Edit</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Badge variant={edited ? "default" : "secondary"}>{edited ? "Edited" : "Built-in content"}</Badge>
          {edited ? "Saved in the dashboard." : "Your first save stores a copy you can edit."}
        </p>
        {edited && isAdmin && (
          <ConfirmButton
            action={restoreBuiltIn.bind(null, def.key)}
            title={`Restore the original ${def.label.toLowerCase()}?`}
            description="This removes every change made in the dashboard to this list and shows the site's built-in content again. It can't be undone."
            confirmLabel="Restore original"
            variant="ghost"
            size="sm"
          >
            <RotateCcw aria-hidden /> Restore original content
          </ConfirmButton>
        )}
      </div>
    </>
  );
}

async function Page({ params, searchParams }: { params: PageProps<"/admin/[collection]">["params"]; searchParams: PageProps<"/admin/[collection]">["searchParams"] }) {
  const { collection } = await params;
  const def = getCollectionDef(collection);
  if (!def) notFound();
  const sp = await searchParams;
  const name = def.singular[0].toUpperCase() + def.singular.slice(1);
  const flash = sp.deleted ? `${name} deleted.` : sp.restored ? "Original content restored." : null;

  return (
    <div className="mx-auto max-w-5xl">
      <Button asChild variant="link" className="h-auto px-0 text-muted-foreground">
        <Link href="/admin">← Overview</Link>
      </Button>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{def.label}</h1>
          <p className="mt-1 max-w-xl text-muted-foreground">{def.description}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={def.listPath} target="_blank">
              <ExternalLink aria-hidden /> View page
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/${def.key}/new`}>
              <Plus aria-hidden /> Add {def.singular}
            </Link>
          </Button>
        </div>
      </div>
      {flash && <Flash message={flash} />}
      <StorageNotice mode={storageMode()} />
      <p className="mt-6 text-sm text-muted-foreground">The order here is the order on the site. Admins can change it.</p>
      <Suspense fallback={<Skeleton className="mt-6 h-80 rounded-xl" />}>
        <List def={def} />
      </Suspense>
    </div>
  );
}

export default function CollectionPage(props: PageProps<"/admin/[collection]">) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-5xl rounded-xl" />}>
      <Page params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}
