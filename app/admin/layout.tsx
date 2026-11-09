import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

// The dashboard: none of the public site's chrome (loader, navbar, page curtain, footer), and the
// shadcn/ui theme, which only applies inside `.admin-ui` (see app/globals.css).
export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard · Visiting Maldives" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="admin-ui min-h-screen bg-muted/50 text-foreground">
      {children}
      <Toaster theme="light" position="bottom-right" richColors closeButton />
    </div>
  );
}
