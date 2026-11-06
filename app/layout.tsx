import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_Thaana, Schibsted_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const schibsted = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });
const thaana = Noto_Sans_Thaana({ variable: "--font-thaana", subsets: ["thaana"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: { default: "Visiting Maldives · The Maldives, island by island", template: "%s · Visiting Maldives" },
  description: "The independent guide to local islands, reefs and atolls, with checked facts and honest advice.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${schibsted.variable} ${plexMono.variable} ${thaana.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
