"use client";
import { useActionState, useEffect, useState } from "react";
import { Check, Copy, KeyRound, Loader2, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { createUser, deleteUser, resetUserPassword, updateUser, type UserFormState } from "@/app/admin/users-actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type UserRow = { id: string; email: string; name: string; role: "ADMIN" | "WRITER"; active: boolean; lastLoginAt: string | null; isMe: boolean };

const ROLE_HELP = { ADMIN: "Everything, including accounts, deleting and reordering.", WRITER: "Create and edit content, see analytics." };

function useReport(state: UserFormState) {
  useEffect(() => {
    if (state.error) toast.error(state.error);
    else if (state.ok && state.message && !state.tempPassword) toast.success(state.message);
  }, [state]);
}

/** Shown once after creating an account or resetting a password. */
function TempPassword({ email, password, message }: { email?: string; password: string; message?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Alert className="border-primary/40">
      <KeyRound aria-hidden />
      <AlertTitle>{message}</AlertTitle>
      <AlertDescription className="grid gap-2">
        <p>
          Send these to them privately (not by public chat). This password is shown only once; they should change it under My account after signing in.
        </p>
        <div className="flex flex-wrap items-center gap-2 rounded-md bg-muted p-2 font-mono text-sm text-foreground">
          <span>{email}</span>
          <span aria-hidden>·</span>
          <span>{password}</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="ml-auto"
            onClick={async () => {
              await navigator.clipboard.writeText(password);
              setCopied(true);
            }}
          >
            {copied ? <Check aria-hidden /> : <Copy aria-hidden />} {copied ? "Copied" : "Copy password"}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

function RoleSelect({ name, defaultValue, id, disabled }: { name: string; defaultValue: "ADMIN" | "WRITER"; id: string; disabled?: boolean }) {
  return (
    <Select name={name} defaultValue={defaultValue} disabled={disabled}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="WRITER">Writer</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function CreateUserForm() {
  const [state, action, pending] = useActionState<UserFormState, FormData>(createUser, {});
  useReport(state);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="size-5" aria-hidden /> Add a team member
        </CardTitle>
        <CardDescription>They get a temporary password to change after their first sign-in.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={action} className="grid gap-4 sm:grid-cols-[1fr_1fr_160px_auto] sm:items-end">
          <div className="grid gap-2">
            <Label htmlFor="new-name">Name</Label>
            <Input id="new-name" name="name" required maxLength={100} autoComplete="off" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-email">Email</Label>
            <Input id="new-email" name="email" type="email" required maxLength={200} autoComplete="off" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-role">Role</Label>
            <RoleSelect id="new-role" name="role" defaultValue="WRITER" />
          </div>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="animate-spin" aria-hidden />} Add
          </Button>
        </form>
        <p className="text-sm text-muted-foreground">
          <strong className="font-medium text-foreground">Writer:</strong> {ROLE_HELP.WRITER} <strong className="ml-2 font-medium text-foreground">Admin:</strong> {ROLE_HELP.ADMIN}
        </p>
        {state.tempPassword && <TempPassword email={state.email} password={state.tempPassword} message={state.message} />}
      </CardContent>
    </Card>
  );
}

export function UserEditor({ user }: { user: UserRow }) {
  const [state, action, pending] = useActionState<UserFormState, FormData>(updateUser.bind(null, user.id), {});
  const [reset, resetAction, resetting] = useActionState<UserFormState>(resetUserPassword.bind(null, user.id), {});
  useReport(state);
  useReport(reset);
  const last = user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "Never";

  return (
    <Card className={user.active ? "" : "opacity-70"}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">{user.name}</CardTitle>
          <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role === "ADMIN" ? "Admin" : "Writer"}</Badge>
          {!user.active && <Badge variant="outline">Deactivated</Badge>}
          {user.isMe && <Badge variant="outline">You</Badge>}
        </div>
        <CardDescription>
          {user.email} · Last signed in: {last}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={action} className="grid gap-4 sm:grid-cols-[1fr_160px_auto_auto] sm:items-end">
          <div className="grid gap-2">
            <Label htmlFor={`name-${user.id}`}>Name</Label>
            <Input id={`name-${user.id}`} name="name" defaultValue={user.name} maxLength={100} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`role-${user.id}`}>Role</Label>
            <RoleSelect id={`role-${user.id}`} name="role" defaultValue={user.role} disabled={user.isMe} />
            {user.isMe && <input type="hidden" name="role" value={user.role} />}
          </div>
          <div className="flex h-9 items-center gap-2">
            <Checkbox id={`active-${user.id}`} name="active" defaultChecked={user.active} disabled={user.isMe} />
            <Label htmlFor={`active-${user.id}`}>Active</Label>
            {user.isMe && <input type="hidden" name="active" value="true" />}
          </div>
          <Button type="submit" variant="outline" disabled={pending}>
            {pending && <Loader2 className="animate-spin" aria-hidden />} Save
          </Button>
        </form>
        {!user.isMe && (
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <form action={resetAction}>
              <Button type="submit" variant="ghost" size="sm" disabled={resetting}>
                <KeyRound aria-hidden /> Reset password
              </Button>
            </form>
            <ConfirmButton
              action={deleteUser.bind(null, user.id)}
              title={`Delete ${user.name}'s account?`}
              description="They lose access straight away. Content they wrote stays on the site. This can't be undone. To pause access instead, untick Active."
              confirmLabel="Delete account"
              variant="ghost"
              size="sm"
            >
              <Trash2 aria-hidden /> Delete account
            </ConfirmButton>
          </div>
        )}
        {reset.tempPassword && <TempPassword email={reset.email} password={reset.tempPassword} message={reset.message} />}
      </CardContent>
    </Card>
  );
}
