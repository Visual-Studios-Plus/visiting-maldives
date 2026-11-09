import { Suspense } from "react";
import { Database } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { CreateUserForm, UserEditor, type UserRow } from "@/components/admin/UserForms";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Users" };

async function Team() {
  const me = await requireAdmin(); // writers never get here (proxy.ts redirects; this re-checks)
  if (!db) {
    return (
      <Alert variant="destructive" className="mt-6">
        <Database aria-hidden />
        <AlertTitle>Accounts need a database</AlertTitle>
        <AlertDescription>Connect Neon in Vercel (your project → Storage) and redeploy. Until then, only the ADMIN_EMAIL account can sign in.</AlertDescription>
      </Alert>
    );
  }
  const users = await db.user.findMany({ orderBy: [{ active: "desc" }, { role: "asc" }, { name: "asc" }] });
  const rows: UserRow[] = users.map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role, active: u.active, lastLoginAt: u.lastLoginAt?.toISOString() ?? null, isMe: u.id === me.id }));
  return (
    <div className="mt-6 grid gap-6">
      <CreateUserForm />
      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Team <span className="font-normal text-muted-foreground">({rows.length})</span>
        </h2>
        <div className="grid gap-3">
          {rows.map((u) => (
            <UserEditor key={u.id} user={u} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function UsersPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
      <p className="mt-1 text-muted-foreground">Who can sign in to the dashboard, and what they can do.</p>
      <Suspense fallback={<Skeleton className="mt-6 h-96 rounded-xl" />}>
        <Team />
      </Suspense>
    </div>
  );
}
