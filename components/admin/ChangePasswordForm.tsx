"use client";
import { useActionState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { changeOwnPassword, type UserFormState } from "@/app/admin/users-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState<UserFormState, FormData>(changeOwnPassword, {});
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.ok) {
      toast.success(state.message ?? "Password changed.");
      form.current?.reset();
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>At least 12 characters. A passphrase from a password manager is best. Changing it signs out your other devices.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={form} action={action} className="grid max-w-sm gap-4">
          <div className="grid gap-2">
            <Label htmlFor="current">Current password</Label>
            <Input id="current" name="current" type="password" autoComplete="current-password" required maxLength={200} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="next">New password</Label>
            <Input id="next" name="next" type="password" autoComplete="new-password" required minLength={12} maxLength={200} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Repeat new password</Label>
            <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={12} maxLength={200} />
          </div>
          {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
          <Button type="submit" disabled={pending} className="justify-self-start">
            {pending && <Loader2 className="animate-spin" aria-hidden />} Change password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
