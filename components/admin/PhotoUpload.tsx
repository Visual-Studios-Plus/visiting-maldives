"use client";
import { createContext, useContext, useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { photo } from "@/lib/data";
import { uploadPhoto } from "@/app/admin/photo-actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Which collection the editor is on, so uploads land in a matching folder. */
export const UploadContext = createContext<string>("misc");

const MAX_EDGE = 2400; // px, longest side after resizing
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

/**
 * Resizes and re-encodes a photo in the browser (WebP, longest side ≤ 2400px) so uploads are
 * small, fast and below the server's limit. Falls back to the original file if the browser can't.
 */
async function prepare(file: File): Promise<File> {
  if (!ACCEPT.split(",").includes(file.type)) throw new Error("Choose a JPEG, PNG, WebP or AVIF photo.");
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.82));
    if (blob && blob.size < file.size) return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    // keep the original if decoding/encoding isn't supported
  }
  return file;
}

/** Prepares and uploads one photo; returns its public URL or throws a readable message. */
export async function uploadOne(file: File, collection: string): Promise<string> {
  const ready = await prepare(file);
  if (ready.size > 4 * 1024 * 1024) throw new Error(`“${file.name}” is still over 4 MB after resizing. Try a smaller photo.`);
  const fd = new FormData();
  fd.append("file", ready);
  const res = await uploadPhoto(collection, fd);
  if (!res.url) throw new Error(res.error ?? "Upload failed.");
  return res.url;
}

/** Preview source: uploaded URLs and site files as-is, Unsplash IDs via the helper. */
const previewSrc = (v: string) => (/^(https:\/\/|\/)/.test(v) || /^[A-Za-z0-9][A-Za-z0-9_-]{5,80}$/.test(v) ? photo(v, 480) : "");

/** A photo field: drop or choose a file to upload, with preview; or type an ID/path by hand. */
export function PhotoInput({ id, value, onChange, invalid, describedBy, dataField }: { id: string; value: string; onChange: (v: string) => void; invalid?: boolean; describedBy?: string; dataField: string }) {
  const collection = useContext(UploadContext);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [manual, setManual] = useState(false);
  const src = value ? previewSrc(value) : "";

  const handle = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadOne(file, collection));
      toast.success("Photo uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="grid gap-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          handle(e.dataTransfer.files);
        }}
        className={cn(
          "relative flex items-center gap-4 rounded-lg border border-dashed bg-muted/30 p-3 transition-colors",
          over && "border-primary bg-primary/5",
          invalid && "border-destructive",
        )}
      >
        <span className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-md border bg-background text-muted-foreground">
          {/* eslint-disable-next-line @next/next/no-img-element -- dashboard preview of any host the editor typed */}
          {src ? <img src={src} alt="" className="absolute inset-0 size-full object-cover" /> : <ImagePlus className="size-6" aria-hidden />}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-background/70">
              <Loader2 className="size-5 animate-spin" aria-hidden />
            </span>
          )}
        </span>
        <div className="grid min-w-0 gap-1.5">
          <p className="text-sm">
            <span className="font-medium">{over ? "Drop to upload" : "Drag a photo here"}</span>
            <span className="text-muted-foreground"> or</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => fileRef.current?.click()} aria-describedby={describedBy}>
              <UploadCloud aria-hidden /> {busy ? "Uploading…" : value ? "Replace photo" : "Choose photo"}
            </Button>
            {value && !busy && (
              <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}>
                <Trash2 aria-hidden /> Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">JPEG, PNG, WebP or AVIF. Resized automatically.</p>
        </div>
        <input ref={fileRef} id={`${id}-file`} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} onChange={(e) => handle(e.target.files)} />
      </div>
      {manual ? (
        <Input id={id} data-field={dataField} aria-invalid={invalid || undefined} aria-describedby={describedBy} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Unsplash ID, /photos/name.jpg, or an uploaded photo URL" className="font-mono text-xs" />
      ) : (
        <button type="button" id={id} data-field={dataField} onClick={() => setManual(true)} className="justify-self-start text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
          Or enter an Unsplash photo ID or file path instead
        </button>
      )}
    </div>
  );
}

/** Drop several photos at once to add them to a gallery. */
export function GalleryDropzone({ onAdd }: { onAdd: (urls: string[]) => void }) {
  const collection = useContext(UploadContext);
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const handle = async (list: FileList | null) => {
    const files = [...(list ?? [])].slice(0, 20);
    if (!files.length) return;
    setProgress({ done: 0, total: files.length });
    const urls: string[] = [];
    for (const f of files) {
      try {
        urls.push(await uploadOne(f, collection));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Couldn't upload ${f.name}.`);
      }
      setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
    }
    if (urls.length) {
      onAdd(urls);
      toast.success(`${urls.length} photo${urls.length > 1 ? "s" : ""} added. Add a short description for each.`);
    }
    setProgress(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer.files);
      }}
      className={cn("grid place-items-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 py-6 text-center transition-colors", over && "border-primary bg-primary/5")}
    >
      <UploadCloud className="size-6 text-muted-foreground" aria-hidden />
      {progress ? (
        <p className="text-sm font-medium" role="status">
          Uploading {Math.min(progress.done + 1, progress.total)} of {progress.total}…
        </p>
      ) : (
        <>
          <p className="text-sm">
            <span className="font-medium">Drop photos here</span> <span className="text-muted-foreground">to add them to the gallery (up to 20 at once)</span>
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
            Choose photos
          </Button>
        </>
      )}
      <input ref={fileRef} id={id} type="file" accept={ACCEPT} multiple className="sr-only" tabIndex={-1} onChange={(e) => handle(e.target.files)} />
    </div>
  );
}
