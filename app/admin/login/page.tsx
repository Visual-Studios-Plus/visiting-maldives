import { Suspense } from "react";
import Link from "next/link";
import { authConfigured } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";
import BrandMark from "@/components/admin/BrandMark";

export const metadata = { title: "Sign in" };

async function Form({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const next = (await searchParams).next;
  return <LoginForm next={typeof next === "string" ? next : "/admin"} configured={authConfigured()} />;
}

export default function LoginPage(props: PageProps<"/admin/login">) {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-16">
      {/* soft brand glow behind the frosted card (Maldives red, lagoon teal) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_18%_12%,rgb(210_16_52/0.14),transparent_70%),radial-gradient(50%_45%_at_88%_88%,rgb(11_143_140/0.16),transparent_70%)]"
      />
      <div className="admin-enter relative w-full max-w-[400px]">
        <Link href="/" className="inline-flex items-center gap-2.5 rounded-md text-[15px] font-semibold tracking-[-0.01em]">
          <BrandMark className="size-7" />
          Visiting Maldives
        </Link>
        <Suspense fallback={<Skeleton className="mt-8 h-72 rounded-2xl" />}>
          <Form searchParams={props.searchParams} />
        </Suspense>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="rounded-sm underline-offset-4 hover:text-foreground hover:underline">
            ← Back to the site
          </Link>
        </p>
      </div>
    </main>
  );
}
