"use client";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Catches what (panel)/error.tsx can't: errors in the dashboard's layout (the sidebar's sign-in
 * check) and on the login page. Without it the live site showed a blank white page.
 */
export default function AdminError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main role="alert" className="grid min-h-dvh place-items-center px-4">
      <div className="max-w-md text-center">
        <p className="text-lg font-semibold">The dashboard couldn&rsquo;t load</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The database took too long to answer. It may still be waking up. Try again in a few seconds.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Button onClick={() => retry()}>
            <RefreshCw aria-hidden /> Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/login">Sign in again</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
