import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import { getGuides } from "@/lib/content/store";

// Chrome for the public site. The dashboard (app/admin) sits outside this group, without it.
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const featured = (await getGuides()).slice(0, 3);
  return (
    <>
      <Loader />
      <SmoothScroll />
      <PageTransition />
      <Navbar featured={featured} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
