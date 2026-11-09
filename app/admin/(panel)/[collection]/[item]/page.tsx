import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { fillPath, getCollectionDef } from "@/lib/content/schema";
import { getCollection, storageMode } from "@/lib/content/store";
import { emptyItem } from "@/lib/content/validate";
import { deleteItem } from "../../../actions";
import { canDelete } from "@/lib/permissions";
import { requireUser } from "@/lib/session";
import ItemEditor from "@/components/admin/ItemEditor";
import ConfirmButton from "@/components/admin/ConfirmButton";
import StorageNotice from "@/components/admin/StorageNotice";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Item = Record<string, unknown>;

async function Editor({ params, searchParams }: { params: PageProps<"/admin/[collection]/[item]">["params"]; searchParams: PageProps<"/admin/[collection]/[item]">["searchParams"] }) {
  const { collection, item: itemParam } = await params;
  const def = getCollectionDef(collection);
  if (!def) notFound();

  const isNew = itemParam === "new";
  const index = isNew ? -1 : Number(itemParam);
  const items = (await getCollection(def.key)) as unknown as Item[];
  if (!isNew && (!Number.isInteger(index) || index < 0 || index >= items.length)) notFound();
  const item = isNew ? emptyItem(def) : items[index];
  const title = isNew ? `New ${def.singular}` : String(item[def.titleField] ?? "Untitled");
  const justCreated = Boolean((await searchParams).saved);
  const user = await requireUser();
  // admins: anything; writers: only guides they created (the action checks again)
  const mayDelete = !isNew && canDelete(user, def.key, item);
  const isOwnGuide = user.role !== "ADMIN" && mayDelete;

  return (
    <div className="mx-auto max-w-3xl">
      <Button asChild variant="link" className="h-auto px-0 text-muted-foreground">
        <Link href={`/admin/${def.key}`}>← {def.label}</Link>
      </Button>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h1 className="min-w-0 text-3xl font-semibold tracking-tight text-balance">{title}</h1>
        {!isNew && def.itemPath && (
          <Button asChild variant="outline">
            <Link href={fillPath(def.itemPath, item)} target="_blank">
              <ExternalLink aria-hidden /> View on site
            </Link>
          </Button>
        )}
      </div>
      <StorageNotice mode={storageMode()} />

      <ItemEditor def={def} index={index} initial={item} justCreated={justCreated} />

      {mayDelete && (
        <Card className="mt-12 border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base">Delete this {def.singular}</CardTitle>
            <CardDescription>
              {isOwnGuide && "You created this guide, so you can delete it. "}It disappears from the site straight away{def.itemPath ? ", and links to its page stop working" : ""}. This can&apos;t be undone.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <ConfirmButton
              action={deleteItem.bind(null, def.key, index)}
              title={`Delete “${title}”?`}
              description={`It's removed from the site straight away. This can't be undone.`}
              confirmLabel={`Delete ${def.singular}`}
              variant="outline"
            >
              <Trash2 aria-hidden /> Delete {def.singular}
            </ConfirmButton>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default function ItemPage(props: PageProps<"/admin/[collection]/[item]">) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto h-[70vh] max-w-3xl rounded-xl" />}>
      <Editor params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}
