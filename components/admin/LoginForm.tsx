"use client";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import BrandMark from "@/components/admin/BrandMark";
import { login, type LoginState } from "@/app/admin/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm({ next, configured }: { next: string; configured: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [show, setShow] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const checkCaps = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState?.("CapsLock") ?? false);

  return (
    <Card className="admin-material gap-5 rounded-2xl border-white/70 py-7 shadow-[0_24px_60px_-28px_rgb(20_18_26/0.35)]">
      <CardHeader className="gap-1.5">
        <span className="mb-2 flex items-center justify-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]">
          <BrandMark className="size-9" />
          Visiting Maldives
        </span>
        <CardTitle className="text-[26px] leading-tight font-semibold tracking-[-0.025em]">Staff sign in</CardTitle>
        <CardDescription className="text-[15px] leading-snug">Admin panel</CardDescription>
      </CardHeader>
      <CardContent>
        {!configured ? (
          <Alert>
            <AlertTitle>Sign-in isn&apos;t set up yet</AlertTitle>
            <AlertDescription>
              Add <code className="font-mono">SESSION_SECRET</code> (a random value of 32+ characters) and, for the first admin, <code className="font-mono">ADMIN_EMAIL</code> and <code className="font-mono">ADMIN_PASSWORD</code> to your environment variables (Vercel → Settings → Environment Variables, or <code className="font-mono">.env.local</code> locally), then redeploy or restart.
            </AlertDescription>
          </Alert>
        ) : (
          <form action={action} className="grid gap-4">
            <input type="hidden" name="next" value={next} />
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="username" required autoFocus maxLength={200} defaultValue={state.email} className="h-11" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  maxLength={200}
                  aria-invalid={Boolean(state.error)}
                  aria-describedby={[state.error && "login-error", capsLock && "caps-lock"].filter(Boolean).join(" ") || undefined}
                  onKeyDown={checkCaps}
                  onKeyUp={checkCaps}
                  onBlur={() => setCapsLock(false)}
                  className="h-11 pr-11"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute top-1/2 right-1 -translate-y-1/2">
                  {show ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              {capsLock && (
                <p id="caps-lock" role="status" className="text-[13px] text-muted-foreground">
                  Caps Lock is on.
                </p>
              )}
            </div>
            {state.error && (
              <Alert variant="destructive" id="login-error">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" size="lg" disabled={pending} className="mt-1 h-11 text-[15px]">
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
