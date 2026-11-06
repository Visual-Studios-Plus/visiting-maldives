# Visiting Maldives · Design

How the site looks and moves, and where each decision lives in the code. Source of truth for
brand decisions is the brand guide (*Visiting Maldives · Brand Identity & Website Redesign*,
v1.0, Nov 2026). This file records how that guide was built, plus what was added since.

---

## 1. Brand in one line

**The Maldives, island by island.** An independent guide: calm, precise, premium but not
exclusive, with every fact checked and dated.

Voice: British English · Malé always with its accent · figures for numbers (35 min, MVR 60) ·
never "paradise", "pristine", "hidden gem", "bucket list".

---

## 2. Tokens (`app/globals.css`, `@theme`)

### Colour
| Token | Hex | Use |
|---|---|---|
| `red` | `#D21034` | Maldives flag red. Logo, primary buttons, highlights. About 10% of a page. |
| `red-deep` | `#A80C29` | Hover and pressed states of red. |
| `ink` | `#14121A` | Text, dark cards, footer. |
| `shell` | `#F6F3F3` | Info cards, panels, chips. |
| `line` | `#E8E2E3` | Borders and dividers. |
| `driftwood` | `#615C66` | Secondary text. |
| `lagoon` | `#0B8F8C` | Maps and charts only. |
| `flag-green` | `#007E3A` | Success, the "checked" dot. |

Page balance (guide p.22): white 60% · ink 16% · shell 14% · red 10%.

### Type
- **Schibsted Grotesk** for everything. Headings are SemiBold (600) all the way through,
  with no lighter second half. Card titles are also 600.
- **IBM Plex Mono** for data only: dates, transfer times, codes, "Checked 3 Nov 2026".
- **Noto Sans Thaana** for Dhivehi.
- Scale: hero 44 / 64 / 84px · section title 36 / 48 / 60px · card title 22px ·
  body 17px · eyebrow 11px caps +14% tracking.
- Intro paragraphs use `leading-snug`; long reading text keeps the looser body leading.

### Shape and space
- Corners: **6px** on controls (buttons, chips), **12px** on cards and photos. Nothing else.
- Spacing on an 8px base. Sections 96px desktop, 48px mobile.
- Container: max 1280px, side margins 16 / 32 / 56px (`container-vm`).
- Large screens: the whole page zooms evenly (`--z`: ×1.25 from 1800px, ×1.5 from 2300px).
  Viewport heights are divided by `--z` so full-height sections still fit.

---

## 3. Components

| Pattern | File | Notes |
|---|---|---|
| Navbar | `components/Navbar.tsx` | Transparent over photos, solid white after 40px. Logo is the white/red ring mark only. Phone menu is full-screen red. |
| Section title | `components/SectionHead.tsx` | Always centred: eyebrow pill, title, actions below. |
| Guide card | `components/GuideCard.tsx` | Guide p.24: full photo, title + read-time pill, summary, season and atoll chips, full-width white "Read guide". Used on every screen size. |
| Atoll card | `components/AtollFilter.tsx` | Same family as the guide card, with a transfer pill and "Explore atoll". |
| Info card | `Essentials.tsx`, What's on, Stay | Shell background, no border, numbered, figures in ink (not red). |
| Filters | `GuideFilter.tsx`, `AtollFilter.tsx`, `MobileGuides.tsx` | Chips pin under the navbar while their list is on screen. |

Rules: three card styles only (photo card, shell info card, dark story card). Partner content
is always labelled. Every fact carries a "Checked" date.

---

## 4. Photography

- Real places in the Maldives, never stock from elsewhere. Prefer local islands, harbours and
  reefs over resorts (guide p.25).
- Local photos live in `public/photos/` and are credited on `/credits`. Unsplash photos are
  referenced by id in `lib/data.ts` (`P`).
- Homepage hero: `P.birdsEye`, a sandbank from straight above (Unsplash `1564966866111`).

---

## 5. Motion

Library: **GSAP** (ScrollTrigger, SplitText) with **Lenis** smooth scrolling
(`components/SmoothScroll.tsx`, driven by GSAP's ticker so ScrollTrigger stays in sync).

### Principles
1. **Calm, not showy.** Ease-outs (`power3`, `expo`), nothing bounces except a pressed button.
2. **One camera.** Scroll-scrubbed scenes move layers at different speeds; nothing jumps.
3. **Cheap per frame.** Animate `transform` and `opacity` only. Never animate a live SVG or CSS
   filter. Bake heavy visuals once (see clouds), blend whole layers, not each element.
4. **Respect reduced motion.** Every component checks `reduced()` and shows the final state.

### Site-wide
| Effect | Where |
|---|---|
| Loader: white ring mark on red, spins like a progress arc, settles into the logo, lifts away | `Loader.tsx` |
| Section reveals: fade + rise in batches | `Reveal.tsx` (`[data-reveal]`) |
| Heading reveals: lines rise from a mask | `splitReveal()` in `lib/gsap.ts`, called inside a component's `useGSAP` |
| Pressed states: sink 1px, scale 0.97, darker fill, inset shadow | `globals.css` |
| Arrows step forward on hover | `[data-arrow]` in `globals.css` |

### Homepage
1. **Sky hero** (`SkyHero.tsx`, ~118% of the viewport tall)
   - Bird's-eye sandbank photo, original centred title, intro, buttons, "Popular now".
   - **12 SVG clouds** at three depths. Each is an SVG (puffs + `feTurbulence` +
     `feDisplacementMap` + blur), **baked once to a bitmap** at 640×380 and shared by shape.
     The cloud layer uses one `mix-blend-mode: screen`.
   - Idle: clouds drift (sine yoyo), nearer ones further. Mouse: shift by depth.
   - Scroll: clouds part and grow by depth, island zooms a touch, title fades early.
   - Hand-off: a white gradient rising from the bottom plus a bank of solid white clouds,
     so the hero melts into the white page below.
2. **Most-read guides** carousel: title, cards and controls rise in once the section is well in view.
3. **Ways to see the Maldives** (`ExploreStack.tsx`): pinned. A card grows to full screen,
   then each way slides up with its title rolling in; red progress bar.
4. **Key numbers** (`CountersPinned.tsx`): pinned; background sharpens from a blur while the
   numbers count up together.

### Implementation rules
- Use `useGSAP` with a `scope`; it reverts before React removes nodes.
- **Pinned sections sit inside a React-owned wrapper `<div>`.** GSAP's pin-spacer then lives
  inside it, so page changes never hit `insertBefore` errors.
- Never change the DOM of React-rendered text from outside a component (that caused the
  hydration and navigation crashes); split text only inside the owning component's `useGSAP`.
- Wait for the loader: hero intros read `document.getElementById("vm-loader")` and delay.

---

## 6. Accessibility

WCAG 2.2 AA · one `h1` per page · alt text on content photos, empty alt on decorative ones ·
visible focus ring (red, 2px) · 44px minimum tap targets · white text on photos always sits on a
dark gradient · reduced motion respected everywhere.

---

## 7. Before launch

- Replace remaining Unsplash stock with the client's own licensed photos.
- Confirm the "verify" figures (islands, inhabited islands, population) with official sources.
- Add real social links and the pocket-guide download (currently removed).
- Check the Dhivehi atoll labels with a native speaker.
