import { Database, HardDrive, ShieldAlert } from "lucide-react";
import type { StorageMode } from "@/lib/content/store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/** Where saves go (and a loud warning when they can't be saved), plus any security setup problems. */
export default function StorageNotice({ mode, warnings = [] }: { mode: StorageMode; warnings?: string[] }) {
  return (
    <div className="mt-6 grid gap-3 empty:hidden">
      {mode === "read-only" && (
        <Alert variant="destructive">
          <Database aria-hidden />
          <AlertTitle>No database connected: changes can&apos;t be saved</AlertTitle>
          <AlertDescription>
            In Vercel, open your project → Storage → Create database → Neon. It adds <code className="font-mono">DATABASE_URL</code> for you; then redeploy.
          </AlertDescription>
        </Alert>
      )}
      {mode === "local-file" && (
        <Alert>
          <HardDrive aria-hidden />
          <AlertTitle>Local mode: saving to a file on this computer</AlertTitle>
          <AlertDescription>
            Edits go to <code className="font-mono">.data/content.json</code> and only show here. Add <code className="font-mono">DATABASE_URL</code> to <code className="font-mono">.env.local</code> to use the real database.
          </AlertDescription>
        </Alert>
      )}
      {warnings.length > 0 && (
        <Alert>
          <ShieldAlert aria-hidden />
          <AlertTitle>Security settings to fix</AlertTitle>
          <AlertDescription>
            <ul className="list-disc space-y-1 pl-4">
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
