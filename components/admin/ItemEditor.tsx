"use client";
import Image from "next/image";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImageOff, Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { photo } from "@/lib/data";
import type { CollectionDef, Field, GroupField, ScalarField } from "@/lib/content/schema";
import { saveItem, type SaveState } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Item = Record<string, unknown>;
type Row = Record<string, unknown>;

/** Turns a title into a page address: "Manta season at Baa!" → "manta-season-at-baa" */
const slugify = (s: string) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

// mirrors the server rule, so the preview only tries real photos
const previewable = (v: string) => /^[A-Za-z0-9][A-Za-z0-9_-]{5,80}$/.test(v) || (/^\/(?!\/)[A-Za-z0-9._\-/]+\.(?:jpe?g|png|webp|avif|gif|svg)$/i.test(v) && !v.includes(".."));

/* ---------- single fields ---------- */

function Hint({ id, text, error }: { id: string; text?: string; error?: string }) {
  return (
    <>
      {error && (
        <p id={`${id}-err`} className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
      {text && (
        <p id={`${id}-help`} className="text-sm text-muted-foreground">
          {text}
        </p>
      )}
    </>
  );
}

function TagsInput({ id, value, onChange, placeholder, describedBy, invalid }: { id: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; describedBy?: string; invalid?: boolean }) {
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const parts = raw.split(",").map((t) => t.trim()).filter(Boolean);
    if (parts.length) onChange([...value, ...parts.filter((p) => !value.includes(p))]);
    setDraft("");
  };
  return (
    <div className={cn("flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border bg-background px-2 py-1.5 shadow-xs focus-within:ring-[3px] focus-within:ring-ring/30", invalid && "border-destructive")}>
      {value.map((t, i) => (
        <Badge key={t} variant="secondary" className="gap-1 pr-1">
          {t}
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove ${t}`} className="rounded-sm p-0.5 hover:bg-background">
            <X className="size-3" aria-hidden />
          </button>
        </Badge>
      ))}
      <input
        id={id}
        value={draft}
        aria-describedby={describedBy}
        placeholder={value.length ? "Add another…" : placeholder}
        onChange={(e) => (e.target.value.includes(",") ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={() => draft && add(draft)}
        className="h-7 min-w-28 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

function ScalarInput({ f, value, onChange, error, path }: { f: ScalarField; value: unknown; onChange: (v: unknown) => void; error?: string; path: string }) {
  const id = useId() + path;
  const required = "required" in f && f.required;
  const describedBy = [error && `${id}-err`, f.help && `${id}-help`].filter(Boolean).join(" ") || undefined;
  const aria = { "aria-invalid": Boolean(error) || undefined, "aria-describedby": describedBy, "data-field": path };

  if (f.type === "checkbox") {
    return (
      <div className="flex items-start gap-3">
        <Checkbox id={id} {...aria} checked={Boolean(value)} onCheckedChange={(c) => onChange(c === true)} className="mt-0.5" />
        <div className="grid gap-1.5">
          <Label htmlFor={id}>{f.label}</Label>
          <Hint id={id} text={f.help} error={error} />
        </div>
      </div>
    );
  }

  let control;
  if (f.type === "textarea") {
    control = <Textarea id={id} {...aria} rows={4} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} className="min-h-28 leading-relaxed" />;
  } else if (f.type === "number") {
    control = <Input id={id} {...aria} type="number" inputMode="decimal" value={value === undefined || value === null ? "" : String(value)} min={f.min} max={f.max} step={f.step ?? 1} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} className="max-w-40 tabular-nums" />;
  } else if (f.type === "select") {
    control = (
      <Select value={String(value ?? "")} onValueChange={onChange}>
        <SelectTrigger id={id} {...aria} className="w-full max-w-72">
          <SelectValue placeholder="Choose…" />
        </SelectTrigger>
        <SelectContent>
          {f.options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  } else if (f.type === "tags") {
    control = <TagsInput id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} placeholder={f.placeholder} describedBy={describedBy} invalid={Boolean(error)} />;
  } else if (f.type === "image") {
    const v = String(value ?? "").trim();
    control = (
      <div className="flex items-start gap-3">
        <span className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-md border bg-muted text-muted-foreground">
          {v && previewable(v) ? <Image src={photo(v, 240)} alt="" fill sizes="80px" className="object-cover" /> : <ImageOff className="size-5" aria-hidden />}
        </span>
        <Input id={id} {...aria} value={v} onChange={(e) => onChange(e.target.value)} placeholder="1544551763-46a013bb70d5 or /photos/name.jpg" className="font-mono text-xs" />
      </div>
    );
  } else {
    control = <Input id={id} {...aria} type={f.type === "link" ? "url" : "text"} inputMode={f.type === "link" ? "url" : undefined} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} />;
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {f.label}
        {required && <span className="text-destructive" aria-hidden>*</span>}
      </Label>
      {control}
      <Hint id={id} text={f.help} error={error} />
    </div>
  );
}

/* ---------- repeatable groups (sections, facts, reviews) ---------- */

function GroupInput({ f, value, onChange, errors }: { f: GroupField; value: unknown; onChange: (v: Row[]) => void; errors: Record<string, string> }) {
  const rows = Array.isArray(value) ? (value as Row[]) : [];
  const set = (i: number, name: string, v: unknown) => onChange(rows.map((r, j) => (j === i ? { ...r, [name]: v } : r)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...rows];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  const blank = () => Object.fromEntries(f.fields.map((sf) => [sf.name, sf.type === "number" ? (sf.min ?? "") : ""]));

  return (
    <fieldset className="grid gap-3">
      <div>
        <legend className="text-sm font-medium">{f.label}</legend>
        {f.help && <p className="mt-1 text-sm text-muted-foreground">{f.help}</p>}
      </div>
      {rows.map((row, i) => (
        <Card key={i} className="gap-3 bg-muted/40 py-4 shadow-none">
          <div className="flex items-center justify-between gap-2 px-4">
            <span className="font-mono text-xs text-muted-foreground uppercase">
              {f.itemLabel} {i + 1}
            </span>
            <div className="flex items-center gap-0.5">
              <Button type="button" variant="ghost" size="icon" className="size-8" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${f.itemLabel} ${i + 1} up`}>
                <ArrowUp aria-hidden />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-8" disabled={i === rows.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${f.itemLabel} ${i + 1} down`}>
                <ArrowDown aria-hidden />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
                <Trash2 aria-hidden /> Remove
              </Button>
            </div>
          </div>
          <CardContent className="grid gap-4 px-4 sm:grid-cols-2">
            {f.fields.map((sf) => (
              <div key={sf.name} className={sf.type === "textarea" ? "sm:col-span-2" : ""}>
                <ScalarInput f={sf} value={row[sf.name]} onChange={(v) => set(i, sf.name, v)} error={errors[`${f.name}.${i}.${sf.name}`]} path={`${f.name}.${i}.${sf.name}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" className="justify-self-start border-dashed" onClick={() => onChange([...rows, blank()])}>
        <Plus aria-hidden /> Add {f.itemLabel}
      </Button>
    </fieldset>
  );
}

/* ---------- the editor ---------- */

export default function ItemEditor({ def, index, initial, justCreated }: { def: CollectionDef; index: number; initial: Item; justCreated?: boolean }) {
  const [item, setItem] = useState<Item>(initial);
  const [dirty, setDirty] = useState(false);
  const [slugTouched, setSlugTouched] = useState(index >= 0);
  const [state, action, pending] = useActionState<SaveState, FormData>(saveItem.bind(null, def.key, index), {});
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state.errors ?? {};

  // creating redirects here with ?saved=1
  useEffect(() => {
    if (justCreated) toast.success(`${def.singular[0].toUpperCase() + def.singular.slice(1)} created. The live site is updated.`, { id: "created" });
  }, [justCreated, def.singular]);

  // a new successful save means the form matches what's stored (adjusted during render, not in an effect)
  const [seen, setSeen] = useState(state);
  if (seen !== state) {
    setSeen(state);
    if (state.ok) setDirty(false);
  }

  // report each save, and bring the first problem into view
  useEffect(() => {
    if (state.ok) {
      toast.success(state.message ?? "Saved.");
    } else if (state.message) {
      toast.error(state.message);
    }
    const first = state.errors && Object.keys(state.errors)[0];
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${CSS.escape(first)}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
    }
  }, [state]);

  // warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (name: string, v: unknown) => {
    setDirty(true);
    setItem((cur) => {
      const next = { ...cur, [name]: v };
      // new entries: the page address follows the title until it's edited by hand
      if (def.slugField && !slugTouched && name === def.titleField) next[def.slugField] = slugify(String(v));
      return next;
    });
    if (name === def.slugField) setSlugTouched(true);
  };

  return (
    <form ref={formRef} action={action} className="mt-6" noValidate>
      <input type="hidden" name="json" value={JSON.stringify(item)} />
      <Card>
        <CardContent className="grid gap-6">
          {def.fields.map((f: Field) =>
            f.type === "group" ? (
              <GroupInput key={f.name} f={f} value={item[f.name]} onChange={(v) => update(f.name, v)} errors={errors} />
            ) : (
              <ScalarInput key={f.name} f={f} value={item[f.name]} onChange={(v) => update(f.name, v)} error={errors[f.name]} path={f.name} />
            ),
          )}
        </CardContent>
      </Card>

      {/* Save bar: stays in view while editing long entries */}
      <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className={cn("text-sm", Object.keys(errors).length ? "text-destructive" : "text-muted-foreground")}>
            {pending ? "Saving…" : Object.keys(errors).length ? `${Object.keys(errors).length} field${Object.keys(errors).length > 1 ? "s" : ""} need attention` : dirty ? "Unsaved changes" : index < 0 ? "Fill in the fields, then create." : "All changes saved."}
          </p>
          <Button type="submit" size="lg" disabled={pending}>
            {pending && <Loader2 className="animate-spin" aria-hidden />}
            {pending ? "Saving…" : index < 0 ? `Create ${def.singular}` : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
