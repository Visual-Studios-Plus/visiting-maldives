import { BadgeCheck, Globe, Mail, Phone } from "lucide-react";
import type { Stay } from "@/lib/data";

const list = (s?: string) => (s ?? "").split(",").map((x) => x.trim()).filter(Boolean);
const siteLabel = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

/**
 * How to reach a place to stay directly: phone (tap to call), email and website, and whether it is
 * in the Ministry of Tourism register. Draws nothing when there's no contact detail at all.
 */
export default function StayContact({ stay }: { stay: Pick<Stay, "name" | "phone" | "email" | "website" | "licensed"> }) {
  const phones = list(stay.phone);
  const emails = list(stay.email);
  const site = stay.website?.trim();
  if (!phones.length && !emails.length && !site) return null;

  const row = "group flex min-h-14 items-center gap-4 px-5 py-3 transition-colors hover:bg-shell";
  const icon = "grid size-10 shrink-0 place-items-center rounded-full bg-shell text-ink transition-colors group-hover:bg-white";
  return (
    <section id="contact" className="mt-14" aria-labelledby="contact-title">
      <h2 id="contact-title" data-reveal className="text-[28px] font-semibold tracking-tight">
        Contact {stay.name}
      </h2>
      <p data-reveal className="mt-2 max-w-2xl text-driftwood">
        Ask about rooms, rates and transfers directly.
      </p>
      <ul data-reveal className="mt-6 divide-y divide-line overflow-hidden rounded-card border border-line">
        {phones.map((p) => (
          <li key={p}>
            <a href={`tel:${p.replace(/[^\d+]/g, "")}`} className={row}>
              <span className={icon}><Phone aria-hidden className="size-[18px]" strokeWidth={1.75} /></span>
              <span>
                <span className="block text-[13px] text-driftwood">Call</span>
                <span className="font-mono text-[15px] font-medium">{p}</span>
              </span>
            </a>
          </li>
        ))}
        {emails.map((e) => (
          <li key={e}>
            <a href={`mailto:${e}`} className={row}>
              <span className={icon}><Mail aria-hidden className="size-[18px]" strokeWidth={1.75} /></span>
              <span className="min-w-0">
                <span className="block text-[13px] text-driftwood">Email</span>
                <span className="block truncate text-[15px] font-medium">{e}</span>
              </span>
            </a>
          </li>
        ))}
        {site ? (
          <li>
            <a href={site} target="_blank" rel="noopener noreferrer nofollow" className={row}>
              <span className={icon}><Globe aria-hidden className="size-[18px]" strokeWidth={1.75} /></span>
              <span className="min-w-0">
                <span className="block text-[13px] text-driftwood">Website</span>
                <span className="block truncate text-[15px] font-medium">{siteLabel(site)} ↗</span>
              </span>
            </a>
          </li>
        ) : null}
      </ul>
      {stay.licensed ? (
        <p data-reveal className="mt-4 flex items-center gap-2 text-[14px] text-driftwood">
          <BadgeCheck aria-hidden className="size-4 text-lagoon" strokeWidth={2} />
          Licensed by the Ministry of Tourism
        </p>
      ) : null}
    </section>
  );
}
