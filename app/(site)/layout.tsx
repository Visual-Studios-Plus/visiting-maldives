import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGuides } from "@/server/content/store";

// Chrome for the public site. The dashboard (app/admin) sits outside this group, without it.
// Only the few fields the menu shows cross to the client: full guide bodies stay on the server.
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const featured = (await getGuides()).slice(0, 3).map((g) => ({ slug: g.slug, short: g.short, image: g.image }));
  return (
    <>
      <Navbar featured={featured} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
