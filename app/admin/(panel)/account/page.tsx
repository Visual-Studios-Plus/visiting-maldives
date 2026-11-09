import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "My account" };

async function Account() {
  const me = await requireUser();
  return (
    <div className="mt-6 grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{me.name}</CardTitle>
            <Badge variant={me.role === "ADMIN" ? "default" : "secondary"}>{me.role === "ADMIN" ? "Admin" : "Writer"}</Badge>
          </div>
          <CardDescription>
            {me.email}. {me.role === "ADMIN" ? "You can manage content and accounts." : "You can create and edit content. Ask an admin to delete or reorder entries, or to change accounts."}
          </CardDescription>
        </CardHeader>
      </Card>
      {db ? (
        <ChangePasswordForm />
      ) : (
        <Alert>
          <AlertDescription>This is the setup account from ADMIN_EMAIL. Connect a database to create real accounts with their own passwords.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">My account</h1>
      <Suspense fallback={<Skeleton className="mt-6 h-80 rounded-xl" />}>
        <Account />
      </Suspense>
    </div>
  );
}
