import { Loader2 } from "lucide-react";
import BrandMark from "@/components/admin/BrandMark";

/** Shown while a dashboard page loads its content, instead of a half-built page. */
export default function DashboardLoading() {
  return (
    <div role="status" aria-live="polite" className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <div className="relative grid size-16 place-items-center">
          <Loader2 className="absolute size-16 animate-spin stroke-[1.25] text-primary/40 motion-reduce:animate-none" aria-hidden />
          <BrandMark />
        </div>
        <p className="text-sm">Loading the dashboard…</p>
      </div>
    </div>
  );
}
