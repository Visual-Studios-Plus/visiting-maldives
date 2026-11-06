import type { Metadata } from "next";

export const metadata: Metadata = { title: "Photo credits" };

// Wikimedia Commons photos of real Maldivian places. Attribution required by each licence.
const credits = [
  ["Malé from the air", "Ibrahim Asad", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Male_City_Aerial,_The_Capital_city_of_Maldives_-_panoramio.jpg"],
  ["Malé from the sea", "DD from Malé, Maldives", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Male,_Maldives_(6031845750).jpg"],
  ["Hukuru Miskiy, Malé", "Zairon", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Male%27_Hukuru_Miskiy_4.jpg"],
  ["Sultan Park, Malé", "Zairon", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Male%27_Sultan_Park_12.jpg"],
  ["Felidhoo, Vaavu Atoll", "Z thomas", "CC0", "https://commons.wikimedia.org/wiki/File:Felidhoo_2023-11-07_2.jpg"],
  ["Baa Atoll islands", "Frédéric Ducarme", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Baa_atoll_islands.JPG"],
  ["Addu Atoll", "Mark Hodson Photos", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Travel,_Addu_Atoll,_Maldives_-_Flickr_-_Mark_Hodson_Photos.jpg"],
  ["Dhoni sailboat", "Nevit Dilmen", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Dhoni_Sailboat_in_the_Maldives_6968.jpg"],
  ["Dhoni in Huvahenhoo", "Bapak Alex", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Dhoni_in_Huvahenhoo.jpg"],
];

export default function Credits() {
  return (
    <section className="container-vm min-h-[calc(70svh/var(--z))] pt-32 pb-24">
      <h1 className="text-[44px] leading-none font-semibold tracking-[-0.03em] sm:text-[64px]">Photo credits</h1>
      <p className="mt-5 max-w-2xl leading-snug text-driftwood">Photos of Maldivian places from Wikimedia Commons, used under the licences below. Other photos are from Unsplash under the Unsplash licence.</p>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {credits.map(([what, who, lic, url]) => (
          <li key={url} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
            <a href={url} className="font-semibold hover:text-red">
              {what}
            </a>
            <span className="font-mono text-[12px] text-driftwood">
              {who} · {lic}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
