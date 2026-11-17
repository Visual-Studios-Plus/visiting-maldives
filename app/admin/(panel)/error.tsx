"use client";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * When a dashboard page can't load (usually the database is slow or waking up), say so and offer
 * a retry, instead of the page crashing and reloading over and over.
 */
export default function DashboardError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div role="alert" className="grid min-h-[60vh] place-items-center">
      <div className="max-w-md text-center">
        <p className="text-lg font-semibold text-foreground">This page couldn&rsquo;t load</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The database took too long to answer. It may still be waking up. Try again in a few seconds.
        </p>
        <Button className="mt-5" onClick={() => retry()}>
          <RefreshCw aria-hidden /> Try again
        </Button>
      </div>
    </div>
  );
}
