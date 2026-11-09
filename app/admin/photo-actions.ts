"use server";

import { requireUser } from "@/lib/session";
import { storePhoto } from "@/lib/storage";
import { getCollectionDef } from "@/lib/content/schema";

export type UploadResult = { url?: string; error?: string };

/** Any signed-in staff member (admin or writer) may upload a photo. Checked again here. */
export async function uploadPhoto(collection: string, formData: FormData): Promise<UploadResult> {
  await requireUser();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file was received." };
  const folder = getCollectionDef(collection) ? collection : "misc";
  try {
    return { url: await storePhoto(file, folder) };
  } catch (err) {
    console.error("[upload]", err);
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
}
