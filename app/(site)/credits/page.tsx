import type { Metadata } from "next";

export const metadata: Metadata = { title: "Photo credits" };

// Wikimedia Commons photos of real Maldivian places. Attribution required by each licence.
const credits = [
  ["Guraidhoo and the atoll from the air", "Luka Peternel", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Guriadhoo-2019-aerial-view-Luka-Peternel.jpg"],
  ["Sandbank from a drone", "dronepicr", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Malediven_Sandbank_(28800504836).jpg"],
  ["Malé from the air", "Ibrahim Asad", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Male_City_Aerial,_The_Capital_city_of_Maldives_-_panoramio.jpg"],
  ["Malé from the sea", "DD from Malé, Maldives", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Male,_Maldives_(6031845750).jpg"],
  ["Hukuru Miskiy, Malé", "Zairon", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Male%27_Hukuru_Miskiy_4.jpg"],
  ["Sultan Park, Malé", "Zairon", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Male%27_Sultan_Park_12.jpg"],
  ["Felidhoo, Vaavu Atoll", "Z thomas", "CC0", "https://commons.wikimedia.org/wiki/File:Felidhoo_2023-11-07_2.jpg"],
  ["Baa Atoll islands", "Frédéric Ducarme", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Baa_atoll_islands.JPG"],
  ["Addu Atoll", "Mark Hodson Photos", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Travel,_Addu_Atoll,_Maldives_-_Flickr_-_Mark_Hodson_Photos.jpg"],
  ["Dhoni sailboat", "Nevit Dilmen", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Dhoni_Sailboat_in_the_Maldives_6968.jpg"],
  ["Dhoni in Huvahenhoo", "Bapak Alex", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Dhoni_in_Huvahenhoo.jpg"],
  // Haa Alif Atoll island pages
  ["Dhidhdhoo from the air", "Knowledge mv", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Ha._Dhidhdhoo_Aerial_view.jpg"],
  ["Water sports in Dhidhdhoo", "Knowledge mv", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Ha._Dhidhdhoo_Watersports.jpg"],
  ["Dhidhdhoo at night", "Knowledge mv", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Ha._Dhidhdhoo_Nightview.jpg"],
  ["Filladhoo school", "adam haleem", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Filladhoo_school_-_panoramio.jpg"],
  ["Hoarafushi from the air", "Ahmedidn", "CC0", "https://commons.wikimedia.org/wiki/File:Aerial_view_of_Hoarafushi,_Haa_Alif_Atoll,_Maldives.jpg"],
  ["Hoarafushi at night", "Ahmedidn", "CC0", "https://commons.wikimedia.org/wiki/File:Hoarafushi_-Nov_2023.jpg"],
  ["Ihavandhoo's south-west beach", "Wiki-Ihavandhoo", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Ihavandhoo-SouthWest(02-09.2011).jpg"],
  ["Ihavandhoo from the air", "Ihavana7", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Island_of_maldives_ihavandhoo_view_July_2021.jpg"],
  ["Kelaa lagoon", "M.hammadh", "CC0", "https://commons.wikimedia.org/wiki/File:Water_sports_activities_in_Kelaa_Lagoon.jpg"],
  ["A house in Kelaa", "@.IMAD.COM", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Kelaa,_Maldives_-_panoramio.jpg"],
  ["Maarandhoo island office", "Coimalaa at English Wikipedia", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Maarandhoo_office1.jpg"],
  ["Muraidhoo", "Andreas Faessler", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Muraidhoo.jpg"],
  ["Thakandhoo from the air", "Zuvaan Masveriyaa", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Thakandhoo-Aerial~2.jpg"],
  ["Ihavandhippolhu Atoll (Landsat 7)", "NASA", "Public domain", "https://commons.wikimedia.org/wiki/File:Ihavandhippolhu_Atoll_(Landsat).JPG"],
  ["Utheemu harbour", "Andreas Faessler", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Utheemu01.jpg"],
  ["Utheemu beach", "Andreas Faessler", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Utheemu02.jpg"],
  ["Utheemu Ganduvaru", "Andreas Faessler", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Utheemu03.jpg"],
  ["Utheemu mosque", "Andreas Faessler", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Utheemu04.jpg"],
  ["The white sands of Vashafaru", "Ramyx", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:The_White_Sands_of_Vashafaru.jpg"],
  ["Vashafaru", "Kirill Flerov", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Vashafaru,_Maldives_-_panoramio.jpg"],
  ["Beach, Haa Alif Atoll", "Kirill Flerov", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Haa_Alifu_Atoll,_Maldives_-_panoramio.jpg"],
  ["Sandbank, Haa Alif Atoll", "Kirill Flerov", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Haa_Alifu_Atoll,_Maldives_-_panoramio_(1).jpg"],
  ["Shore, Haa Alif Atoll", "Kirill Flerov", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Haa_Alifu_Atoll,_Maldives_-_panoramio_(2).jpg"],
  ["Jetty, Haa Alif Atoll", "Kirill Flerov", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Haa_Alifu_Atoll,_Maldives_-_panoramio_(3).jpg"],
  // Administrative atoll pages
  ["Hanimaadhoo beach", "Andreas Faessler", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Hanimaadhoo_-_beach_01.jpg"],
  ["Milandhoo beach", "M.SaameeMilandhoo", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:MILANDHOO_BEACH_-_panoramio.jpg"],
  ["Bileiyfahi, Shaviyani Atoll", "Ahmed Shareef", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:20170203-_MG_3313.jpg"],
  ["Kudafari from the air", "Bloo man", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Kudafari.jpg"],
  ["Sea foam at Kudafari", "Ameen Fahmy", "CC0", "https://commons.wikimedia.org/wiki/File:Ocean_foam_on_a_sand_beach_(Unsplash).jpg"],
  ["Lhaviyani Atoll from the air", "dronepicr", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Malediven_Atoll_Lhaviyani_(28831935475).jpg"],
  ["Komandoo, Lhaviyani Atoll", "eNil from Portsmouth, UK", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Komandoo_(Lhaviyani_Atoll).jpg"],
  ["Jetty, Madhiriguraidhoo", "Romain Pontida", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Mandatory_jetty_shot,_Madhiriguraidhoo,_Lhaviyani_Atoll,_Maldives_(11742406995).jpg"],
  ["Ari Atoll channels", "Bruno de Giusti", "CC BY-SA 2.5 it", "https://commons.wikimedia.org/wiki/File:Ari_Atoll_passes.jpg"],
  ["Bathalaa, Alif Alif Atoll", "Syd Sujuaan", "CC0", "https://commons.wikimedia.org/wiki/File:Atoll._(Unsplash).jpg"],
  ["Sun Island, Alif Dhaal Atoll", "Syd Sujuaan", "CC0", "https://commons.wikimedia.org/wiki/File:Sun_Island_Resort,_Alif_Dhaal_Atoll,_Maldives_(Unsplash).jpg"],
  ["Alif Dhaal Atoll", "lienyuan lee", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Alifu_Dhaalu_Atoll,_Maldives_-_panoramio.jpg"],
  ["Alif Dhaal Atoll (2)", "lienyuan lee", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Alifu_Dhaalu_Atoll,_Maldives_-_panoramio_(1).jpg"],
  ["Meemu Atoll from the air", "Paul Munhoven", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Meemu-maldives-munhoven.JPG"],
  ["Meemu Atoll reef", "David Stanley", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Meemu_Atoll_Reef_(32157145524).jpg"],
  ["An island in Dhaalu Atoll", "Ishan @seefromthesky", "CC0", "https://commons.wikimedia.org/wiki/File:An_island_in_the_beautiful_atoll_of_Dhaalu_(Unsplash).jpg"],
  ["Dhaalu Atoll home", "Ishan @seefromthesky", "CC0", "https://commons.wikimedia.org/wiki/File:My_Home._(Unsplash).jpg"],
  ["Meedhoo farms, Dhaalu", "Izmaan.n", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Dhaalu_Meedhoo_farms.jpg"],
  ["Guraidhoo, Thaa Atoll", "Depperter", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Thaa_Guraidhoo.jpg"],
  ["North-east Laamu Atoll", "A robustus at English Wikipedia", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:North_east_hadhunmathi_maldives.JPG"],
  ["Olhuveli, Laamu Atoll", "jfdebon", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Olhuveli_Island._Hithadhoo-Laamu_Atoll._Maldives_-_panoramio.jpg"],
  ["Gaafu Alif Atoll (1)", "otterboris", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:ALILA_VILLAS_HADAHAA_,_MALDIVES_1_-_panoramio.jpg"],
  ["Gaafu Alif Atoll (2)", "otterboris", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:ALILA_VILLAS_HADAHAA_,_MALDIVES_2_-_panoramio.jpg"],
  ["Thinadhoo from the air", "Xumm1du at English Wikipedia", "Public domain", "https://commons.wikimedia.org/wiki/File:GdhThinadhoo.jpg"],
  ["Island in Gaafu Dhaalu Atoll", "otterboris", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:UNHABITED_ISLAND_ON_THE_WAY_KAADEHDHOO_AIRPORT_5_-_panoramio.jpg"],
  ["Fuvahmulah harbour at sunset", "Ibrahim Asad", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:The_Sunset_Point_in_Fuvahmulah_Harbour_-_panoramio.jpg"],
  ["Fuvahmulah harbour surf area", "Asaymirus", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Fuvahmulah_Shark_Harbour_Surf_Area_and_the_Royal_Restaurant_in_Fuvahmulah_Maldives.jpg"],
  ["Thoondu beach, Fuvahmulah", "Grampsandstuff", "CC0", "https://commons.wikimedia.org/wiki/File:Fuvahmulah_Thoondu.jpg"],
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
