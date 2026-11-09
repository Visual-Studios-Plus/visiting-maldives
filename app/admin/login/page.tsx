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
    <main className="grid min-h-screen place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2.5 font-semibold">
          <BrandMark className="size-7" />
          Visiting Maldives
        </Link>
        <Suspense fallback={<Skeleton className="mt-8 h-64 rounded-xl" />}>
          <Form searchParams={props.searchParams} />
        </Suspense>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Back to the site
          </Link>
        </p>
      </div>
    </main>
  );
}
