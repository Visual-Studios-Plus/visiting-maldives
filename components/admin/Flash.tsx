"use client";
import { useEffect } from "react";
import { toast } from "sonner";

/** Shows a one-off toast (e.g. "Guide deleted.") after a redirect. Renders nothing itself. */
export default function Flash({ message, tone = "ok" }: { message: string; tone?: "ok" | "error" }) {
  useEffect(() => {
    // the id stops a duplicate when React runs effects twice in development
    if (tone === "error") toast.error(message, { id: message });
    else toast.success(message, { id: message });
  }, [message, tone]);
  return null;
}
