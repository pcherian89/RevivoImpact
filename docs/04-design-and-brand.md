# Revivo Impact — design and brand

**The test (founder priority):** someone who has seen the Revivo website and Revivo Pathway opens Revivo Impact.
Within one second they know it is Revivo. Within ten seconds they know what to do next. Where anything (including the
founder's brief) pulls against this, this document wins, and the change is listed in `01` §11.

**References (read only; copy files into this repository with a source note, never edit the originals):**

- Website: `/home/user/Revivo_Webpage` (current `main`, commit `382da4b`; the Pathway design brief was written against
  `935f7f3`) and its `CLAUDE.md`.
- Pathway: `/home/user/revivopathway/docs/03-design-brief.md` (tokens, motifs, photography, motion), `tools/tone/`
  (`solve.py`, `measure.py`), and the built prototype `/home/user/Revivo_Webpage/public/pathway-demo.html`.

## 1. Principles

- **Cinematic at the edges, quiet in the middle.** Cinematic zones (photo, signal, one heartbeat): the start screen,
  Homes, the Opportunity page header, success moments. Working zones (no photos, no ambient motion, dense and
  high-contrast): review, selection, ledgers, forms, registers, audit. There the signal appears only as state (a
  Funding Line node, a "live" ring, a loading light).
- **Lime stays rare:** the signal, the current state and the one primary action, about 5–10% of a screen's pixels.
  Lime never means "good", never fills money, never fills large areas.
- **The interface always says who decides.** Every decision shows who prepared it, who approved it and why. Visual drama
  never sits on a judgement about a person.
- **Calm by default.** One focal point per screen; plain British English; generous type; the fictional-data banner on
  every page.

## 2. Copied 1:1 (no redesign allowed)

| Element | Source | Rule |
|---|---|---|
| Colour tokens, both themes | Built Pathway prototype `pathway-demo.html` (which extends the website's `src/app/globals.css` `@theme`) | Same hex values (§2.1). No new hues, no warmer canvas, no "Impact colour". |
| Lime usage | Website `CLAUDE.md` §4; Pathway brief §1 | Signal, current state, one primary action. |
| Typography | `globals.css` utilities `text-hero`, `text-title`, `text-subtitle`, `text-lead`, `text-small`, `label`; Pathway's `text-table` and `text-stat` | Barlow Condensed 700 (headlines, labels, buttons) and Manrope 400/500 (everything else). Same sizes. `text-hero` only on the start screen. Body 16px, never below 13px. `tabular-nums` on every number. |
| Layout utilities | `container-site`, `section-y`, `measure` (34rem) | Working screens: 1440px max width, 8px grid. |
| Buttons | `src/components/ui/ButtonLink.tsx` → `buttonClasses()` | `min-h-11`, `px-6`, Barlow 700, `rounded-full`. Primary lime with canvas text, hovers to ink; secondary `line-strong` border, hovers to lime. One primary per view. Destructive: coral outline plus a confirm dialog. Focus ring 2px solid lime, `outline-offset: 3px` (olive in Daylight). |
| Status chips | Pathway brief §2 | Icon plus word on a 28px pill, 1px border in the status colour at 40%; never colour alone. |
| Inputs and errors | Pathway brief §2; website `src/components/enquiry/EnquiryForm.tsx` | Boxed inputs: surface-2 fill, 1px control border, 6px radius, 48px tall, label above. Error summary (amber left rule, linked list) plus inline errors (amber icon plus text). |
| Tables | Pathway brief §2 | Sticky header in `.label` subtle; 48px rows (40px compact); line dividers, no zebra striping; numbers right-aligned; row actions always visible. Wide tables scroll inside their container with the first column sticky. |
| Radii | Pathway brief §2 | Buttons and chips full; inputs and images 6px; panels 10px; bottom sheets 14px top. |
| Signal geometry | Website `src/lib/signal.ts`: `SIGNAL` (one 18px radius), `pulseSegment`, `PULSE_HALF`, `dataMarks`, `orthogonal`, `DIM_LIME` `#4A5B0B`, `MID_LIME` `#86A606`, `easeOut` | Straight runs, one 18px corner radius, 1.75px stroke, round caps. Never wobble. |
| Node grammar | Pathway rail (website `src/components/explorer/SignalNode.tsx`) | Passed = MID_LIME filled 10px; current = lime 14px with three signal-core rings (36/68/100% of a 20px radius; inner lime at 22% opacity, outer ink at 7%); future = control outline. The light stops at the current node. |
| Heartbeat | Website `src/components/signal/SignalGlyph.tsx`; Pathway brief §3 | Draws in 600ms, light runs in 480ms, one ring (450ms). Only on success moments (§5.4). At most one per action, announced in `role="status"`. No confetti, no sound. |
| Loading | Pathway brief §3 | 1.5px DIM_LIME track with the running light (1.2s period) plus text ("Loading applications…") and `aria-busy`. Skeleton rows only for tables. |
| Logo lockup | Website `src/components/brand/RevivoLogo.tsx`; Pathway brief §3 | "revivo │ IMPACT": the lockup, a 1px line divider, "IMPACT" in `.label` muted, at least 24px tall. "Powered by Revivo Impact" in the footer. |
| Prototype shell | `public/pathway-demo.html` | Top bar "REVIVO IMPACT · PROTOTYPE"; banner "Demonstration on fictional data. Every person, organisation, amount and record is invented, and no real money moves."; "Choose how to explore"; Guided journey with "Show me" / "I'll do it" and "Load the story up to step N"; Explore by role; demonstration date; Daylight toggle; role pill ("Viewing as … · Change"); Reset. |
| Start-screen layout | Pathway start screen | Same composition. Left: lockup, eyebrow "Sports Funding & Sponsorship Platform" (`.label`), small pulse, `text-hero` tagline, supporting line as lead, `im-01` shown whole. Right: "Choose how to explore" with **Guided journey** (recommended, lime outline) and **Explore the platform**. |
| Panels | Website `src/components/explorer/DomainPanel.tsx` | ≈46vw right panel; bottom sheet on phones; focus trap, Escape, focus return. Every record detail and P1–P3. |
| Themes | Pathway brief §2 | **Dark is the default everywhere.** Daylight is one tap away and remembered per viewer. Print always uses Daylight. Cinematic screens stay dark. In Daylight the primary button keeps its lime fill with near-black text and a 1px `#4D6600` border. |
| Photo grade and frames | Website `globals.css` `.photo`, `.hero-photo-frame`, `.hero-band`, `.area-backdrop-img`; Pathway brief §5; `tools/tone/solve.py` | Same grade and target (§9). Photos shown whole in their own frame, fading at the edges; never cropped with `object-cover`. None on working screens. |
| Motion | Pathway brief §6 | Same timings (§11). |
| Performance | Website `CLAUDE.md` §5 | Signal SVGs and masked photos on `.gpu-layer`; no backdrop blur on sticky headers. |
| Accessibility and responsive | Website `CLAUDE.md` §7–8; Pathway brief §6 | WCAG 2.2 AA; 375 / 768 / 1024 / 1440; targets ≥ 44px (§11). |

### 2.1 Tokens

**Source of truth: the built Pathway prototype** (`pathway-demo.html`, `[data-rp-theme=dark]` and
`[data-rp-theme=daylight]` blocks), because that is what viewers have actually seen. Its values match the website's
`@theme` for the shared tokens, but differ from the Pathway design brief for amber, steel and coral, and it adds
`ok`, `info`/`data` and `places`. Copy the build's values exactly (the `--rp-` prefix becomes `--ri-`), and keep the
same uses as in Pathway.

| Token | Dark (default) | Daylight | Use |
|---|---|---|---|
| canvas | `#0A0A0B` | `#F7F7F4` | page |
| raised | `#111113` | `#FFFFFF` | header, banded rows |
| surface | `#18181B` | `#EFEFEA` | panels, sheets |
| surface-2 | `#1F1F23` | `#E7E7E1` | inputs, hovered rows |
| ink | `#F5F5F2` | `#0A0A0B` | text |
| muted | `#C4C4BF` | `#3F3F46` | supporting copy |
| subtle | `#8C8C88` | `#5C5C57` | labels |
| line / line-strong | `#232326` / `#3F3F46` | `#DADAD4` / `#B9B9B2` | dividers only |
| control | `#6E6E73` | `#8A8A90` | input, checkbox and radio borders |
| signal (lime) | `#CCFF00` | `#4D6600` (olive stroke, text and focus ring; the primary button keeps its lime fill) | signal, current, primary action |
| track (DIM_LIME) / passed (MID_LIME) | `#4A5B0B` / `#86A606` | `#C9D69B` / `#6B8A00` | Funding Line track / passed nodes |
| amber | `#F59E0B` | `#A84B08` | needs a person: errors, a missing receipt, an unresolved exception |
| steel | `#A8A8A2` | `#5C5C57` | informational and in-progress states; "Simulated AI" chip; reported-not-verified hatch |
| coral | `#EF4444` | `#B91C1C` | destructive staff actions only, never on a person's result |
| ok | `#A3E635` | `#457010` | as Pathway uses it (never as "good person"; never to fill money) |
| info / data | `#4FAFA3` | `#1D7369` | as Pathway uses it |
| photo grade | `saturate(.86) contrast(1.05) brightness(.92)` | `saturate(.9) contrast(1.02) brightness(1)` | `.photo` |

Brief values that the build replaced (do **not** use): amber `#F2B04B`, steel `#A9BCC8`, coral `#FF7A66`, Daylight
subtle `#5C5C63`, amber text `#8A5A00`, coral `#A33A2A`, steel text `#3E5A6B`. In P1, confirm the table against the
Pathway build once more and record any change here.

## 3. The four differences (and only four)

Each difference tells the viewer *which* Revivo system this is.

1. **The motif: the Funding Line** (§5) replaces Pathway's stage rail. Pathway follows one child forward; Impact
   follows one award or grant from the person who gives it to the person who uses it.
2. **Money vocabulary and the funding bar** (§6). Funders need a commitment, a payment and spending to look different;
   no Pathway pattern does that.
3. **Two tones of one voice** (§8). The athlete side is more photographic and second person; the funder side is
   ledger-like. Same components; only density and the amount of photography change.
4. **New image subjects, same style** (§9–10). Funding moments (a family reading an offer, a panel reviewing
   applications, an equipment handover, travel) in the same photographic style and grade as the website and Pathway.

**Not different:** no new colour, typeface, icon set, illustration style, gradient or card style. No "Impact green".
No warmer canvas. No brighter photographs.

## 4. Ease-of-use rules

The ten rules in `03` §1 apply to every screen (one question per screen; at most five navigation items; "what needs
you" first; next step always visible; one primary per view; progressive disclosure; forgiving forms; plain words for
seekers; device priorities; guided mode first). Proof of ease (P5): three first-time viewers each complete "find and
apply" and "approve an award" unaided.

## 5. The Funding Line

### 5.1 Anatomy

- One straight signal track joining two endpoints: the **funder** on the left (or top, on phones) and the **recipient**
  on the right (or bottom). Endpoint labels use the organisation name and the recipient's name (a minor's reference
  until the guardian accepts).
- Six nodes for the award's life:
  - Athlete award: **Need → Award → Released → Spent → Progress → Review**.
  - Programme: **Commitment → Delivered → Spent → Evidence → Outcomes → Review**.
  - Accessible names use the founder's full wording ("Funding need", "Approved award", "Funds released", "Expenses",
    "Sporting progress", "Funding review"; "Funding commitment", "Activities delivered", "Expenditure", "Evidence",
    "Outcomes", "Review").
- Horizontal from 768px; vertical on phones.
- Track DIM_LIME up to the current node, line-strong beyond it. Node grammar as §2.
- A light (120px dash) runs from the funder endpoint and **stops at the current node**. It runs once on arrival and on
  any change (under 5s, so no pause control is needed).
- Branches use `orthogonal()` with one shared bus: the programme's "12 not delivered → Recovery plan approved"; a
  queried expense.
- Under each node: a stat and one honest qualifier, set as text columns (not cards). Each stat is a button named
  "See source: …" with a dotted underline and a small arrow; it opens the Source records panel.
- Beneath the line: "Records show activity and spending, not proof of impact."
- Markup: an `<ol>` with `aria-current="step"`; the SVG is `aria-hidden`.

### 5.2 Mini Funding Line

In list rows (Applications, Funding, Portfolio), a six-dot line without the light shows where each record stands,
followed by the one-sentence next step.

### 5.3 Start screen

The two doors, "I'm looking for funding" and "I fund sport", are joined by a short Funding Line (two endpoints, no
nodes). Its light runs once when the screen opens; static under reduced motion.

### 5.4 Heartbeat moments (only these)

Application submitted; award or offer accepted; release confirmed received; recovery plan approved; report accepted;
consent recorded.

## 6. The funding bar and money states

Money states never rely on colour alone. Each segment has a label and a tabular figure; outstanding and unspent amounts
are also written in words. Lime never fills money.

**Award bar** (total length = Committed), left to right:

| Segment | Look | Label |
|---|---|---|
| Spent · verified | Solid ink, a small tick at its end | "Spent · verified $1,720" |
| Spent · awaiting verification | Steel diagonal hatch | "Awaiting $210" |
| Released, not yet reported | Ink outline filled with surface-2 | "Unspent $320" |
| Outstanding (committed, not released) | Control outline only, empty | "Still to come $2,250" |

Brackets above the bar mark **Released** (the first three segments) and **Committed** (the whole bar).

**Fund bar** (length = Announced): Committed (solid ink) · Reserved (dashed control outline) · Available to award (no
fill, subtle text). **Need bar** (length = Requested): Received (ink with a tick) · Pledged, not yet received (ink
outline) · pending offers (dashed) · Remaining (empty, with the amount in words). **In-kind** never appears in a cash
bar: a separate line reads "60 kits · declared value $9,000 (not cash)". **Carried-in** amounts carry their own label
and never count as verified.

## 7. Screen-type guidance

| Screen | Direction |
|---|---|
| Start (1) | Pathway's start screen 1:1 (§2), with the two doors. |
| Homes (3) | Calm. At most three "needs you" items, then the relevant funding bar and Funding Line. Funder Overview: three plain answers ("Who applied", "Who is funded", "How it's being used") under an `im-11` header band. Athlete Home: `im-03` (`im-14` on phones). |
| Discover (5) | Warm, but a list, not cards. Rows: funder, title, amount and awards, deadline, plain eligibility line with an icon. Filters are pills; "Why this is suggested" opens a panel. Funder version lists verified Needs; minors only as de-identified cards. |
| Opportunity (6) | Document-like. Header band (the Fund's image, faded). Key facts in a four-column strip. Then "Who can apply" as a checklist evaluated against the profile, "What you'll need", "How decisions are made" (with `im-05`), "What you'll report". One primary. |
| Apply (10) | Quiet stepper; autosave; missing items in amber with an icon; "Help me organise this" labelled "Simulated AI"; guardian authorisation step for a minor. |
| Review and selection (12, 13) | Working screens, no photos. Two columns: evidence with field-level verification on the left; fixed decision vocabulary and a required reason on the right. Self-approval disabled with its reason. AI summary labelled "Simulated AI · check against sources". |
| Portfolio and Funding (15) | Ledger: table of awards with right-aligned tabular figures; totals reconcile on screen; every figure "See source". |
| Award and Programme (16, 18) | The signature: Funding Line, funding bar and dated evidence beneath. Programme: v1 session strips (20 ticks per site: delivered filled; verified filled with a dot; missed a gap with a reason glyph and a word; a timeline, not an ECG). Funders see aggregates only. |
| Reports (20) | Print-first, prints in Daylight. A one-page statement: committed, released, spent and evidenced, and what is outstanding; "Prepared by … · accepted by …"; the full honesty line; optional `im-13` cover band. |
| Consent (21) | Pathway's consent component 1:1: equal outlined Yes/No, neither pre-selected; the chosen one fills (Yes = lime, No = ink); "Change or withdraw" always visible. |

**Never:** purple or blue AI gradients, robots, brains, holograms, glassmorphism, blobs, particles, textures or grids;
grey-on-grey panels, card grids or KPI-tile mosaics; gauges, dials, "match scores" as percentages, star ratings,
leaderboards or rankings of athletes; red/green pass-fail or any colour judging a person; cheques, cash or coin icons;
glowing data overlays; ECG or hospital-monitor visuals; wobbly lines; background or autoplay video; confetti;
pre-ticked consent or a smaller "No"; generic SaaS sidebars with many items; lime as a large fill; fake client logos or
"Trusted by".

## 8. Two tones of one voice

| | Athlete and guardian side | Funder side |
|---|---|---|
| Feel | Warmer, open, encouraging | Ledger-like, calm, credible |
| Photography | More (Homes, Opportunity headers, offer moments) | Headers only |
| Copy | Second person: "You meet 5 of 6 criteria" | Neutral statements with sources and dates |
| Heartbeat | Submitted, accepted, received | Report accepted, plan approved |
| Device | Phone first | Laptop first, works at 1024px |
| Theme | Dark default; Daylight one tap away | Dark default; Daylight one tap away; print in Daylight |

## 9. Imagery rules and grading

- **Do not lift the grade.** The founder's brief asks for warm natural light and to avoid overly dark imagery. Brighter
  images would sit beside the website and Pathway as a visibly different series and break the family. Warmth comes
  instead from **golden-hour light** (as Pathway's newest photos already use, rather than the website's magenta dusk
  skies), **people and moments** (families, support, travel) and warm-coloured athlete kit.
- **One concession:** faces keep their detail. Shadows fall to near-black at the edges, never across a face.
- **Grade:** copy `.photo` with `--photo-grade: saturate(0.86) contrast(1.05) brightness(0.92)` plus a per-image
  `--tone`, solved as the website and Pathway do (`tools/tone/solve.py`): iterate saturate and brightness until the
  **75th-percentile luminance ≈ 76/255** and the **mean saturation ≈ 42%**; clamp saturate 0.7–1.2 and brightness
  0.8–1.2; never add more than 5% colour; magenta skies get `sepia(0.06–0.08)`; images with the sun or a glowing screen
  in frame are capped on the 90th percentile. Record values in `src/content/images.ts`.
- **Frames:** every photo shown whole in its own 16:9 or 9:16 frame, fading into canvas at its edges (copy
  `.hero-photo-frame`, `.hero-band`, `.area-backdrop-img`). Never crop.
- **Placement:** only cinematic zones and headers; never on tables, forms, review, selection or ledger areas. Every
  image is labelled illustrative and is never presented as a real participant.
- **Safeguarding:** anyone under 18 is seen from behind, in profile or small in the frame, never in close-up, always
  with several people or a parent present in an open setting. Mixed genders, ages, skin tones and body types; disabled
  athletes where natural; grassroots settings anywhere in the world; no landmarks.

## 10. Image asset plan (initial; to confirm in P1)

Fourteen images. The founder generates them in ChatGPT from the prompts below. Until they arrive, use dark placeholders
showing the filename and "Illustrative", as Pathway did.

**Master block (paste once into ChatGPT):**

> You are making a consistent series of photographs for Revivo Impact, a trustworthy platform that connects athletes
> and sports programmes with funding and helps funders see how support is used. Style: authentic documentary sports
> photography in the same series style as the Revivo website and Revivo Pathway: golden hour, one warm low light
> source (or warm evening light through windows indoors), deep shadows falling to near-black (#0A0A0B) at the edges of
> the frame but never across faces, muted warm natural colour, fine grain, quietly hopeful and real. Settings anywhere
> in the world, no landmarks. People: mixed genders, ages, skin tones and body types; include disabled athletes where
> natural. Coaches wear plain dark sportswear with one thin lime-green trim line; funders and staff wear plain
> smart-casual clothes; athletes wear plain unbranded sportswear in muted warm colours (navy, terracotta, ochre, white,
> grey). Anyone under 18 is seen from behind, in profile or small in the frame, never in close-up, and always with
> several people or a parent present in an open setting. Every person is entirely inside the frame (no cut-off heads,
> hands or feet). No text, letters, numbers, bibs, logos, flags or signage; papers and screens face away or are
> unreadable. No money, cheques, cash, coins, handshake poses, trophies or medals. No holograms, overlays, data
> graphics, glowing lines, neon, lens flares, blue or purple light. Size 1672×941 (16:9) unless I say otherwise.
> Reply "Ready".

**Then one prompt per message:**

| File | Screen and placement · ratio | Subject, composition, light, setting (prompt) |
|---|---|---|
| `im-01-landing.png` | Start (1), left column, shown whole · 16:9 | A community athletics track at golden hour. A young woman sprinter (about 20) and her coach walk side by side onto the track from the right, seen in three-quarter view, kit bag over her shoulder. Other athletes warm up small in the background. The left 40% is open, softly lit track and sky for text. Warm, optimistic. |
| `im-02-landing-phone.png` | Start (1), phones · 9:16, 941×1672 | The same track and light, upright. The sprinter and coach walk away from camera in the lower third. The upper 45% is calm warm sky and stand roofline, for the headline. |
| `im-03-athlete-home.png` | Athlete Home (3) header; Emerging Athletes Scholarship header (6) · 16:9 | A young adult male athlete sitting on concrete stadium steps lacing his running spikes in early-morning sun, seen in profile from the right half of the frame. A water bottle and a folded towel beside him. The left half is empty sunlit steps. Quiet determination. |
| `im-04-guardian-offer.png` | Offer & agreement (14), seeker side, header band · 16:9 | A parent and a teenage athlete sit side by side at a kitchen table by a sunny window, seen from behind and slightly to the side, looking together at a printed letter (text unreadable) and a laptop turned away from camera. A sports bag and running shoes on the floor by the chair. Warm afternoon light, a lived-in family kitchen. |
| `im-05-funder-panel.png` | Opportunity (6), "How decisions are made" band; funder Opportunities list header · 16:9 | Four adults of different ages and backgrounds around a long wooden table in a bright meeting room with tall windows overlooking a green sports field. They review paper application folders (unreadable) and one laptop faces away. Engaged, careful discussion; one person gestures to a folder. Soft daylight. |
| `im-06-community-coach.png` | Programme (18) header band; Community Sports Programme Grant header (6) · 16:9 | A concrete community court beside a school in late-afternoon sun. A coach in dark kit with a thin lime trim holds a closed paper register while a mixed group of children play a passing game at mid-distance, small in the frame, seen from the side and behind. Trees cast long warm shadows. |
| `im-07-equipment-handover.png` | Equipment Support Programme header (6) · 16:9 | Outside a small clubhouse at golden hour, a programme coordinator in smart-casual clothes passes a plain unbranded mesh bag of new footballs to a coach. Plain cardboard boxes of cones and bibs (blank) stand on a bench. Teenage players wait at mid-distance, seen from behind. Practical and modest, not a ceremony. |
| `im-08-competition-travel.png` | Competition Travel Grant header (6) · 16:9 | Dawn at a quiet roadside. A small team of young adult athletes and two coaches load kit bags into the luggage hold of a plain white coach bus with no markings. Soft warm sunrise, long shadows, a sense of a journey beginning. All figures fully in frame. |
| `im-09-para-athlete.png` | Publish a need (9) intro band; Discover "Funding needed" tab header · 16:9 | A wheelchair racer training on a red athletics track at golden hour, mid-push, seen in profile at mid-distance, with a coach holding a stopwatch at the trackside. Warm low sun, a few other athletes small in the background. Strong and dignified, not pitying. |
| `im-10-womens-football.png` | Women's Sporting Development Fund header (6) · 16:9 | A women's football team training on a community grass pitch at golden hour: small-sided drill between cones, players of mixed ages and backgrounds at mid-distance, one coach watching. The sun is behind the trees, giving warm rim light. Energetic, joyful, unposed. |
| `im-11-funder-visit.png` | Funder Overview (3) header band · 16:9 | Two adults in smart-casual clothes and a programme coordinator stand on a touchline at golden hour, seen from behind, watching a distant children's session with coaches on a community pitch. Wide, calm, lots of open warm sky. |
| `im-12-empty-state.png` | Empty states · 16:9 | No people. A pair of running spikes, a folded towel and a water bottle on a wooden bench beside an empty sunlit track in late afternoon. Shallow depth of field, warm, inviting. |
| `im-13-report-desk.png` | Reports (20) print cover band · 16:9 | A programme coordinator at a desk in a clubhouse office in late-afternoon daylight, reviewing printed pages (unreadable) beside a closed laptop. Through the window, a sports field with a distant session. Calm, orderly, credible. |
| `im-14-athlete-phone.png` | Athlete Home (3), phones · 9:16, 941×1672 | Upright version of im-03: the athlete sits low in the frame on sunlit stadium steps lacing spikes, seen in profile. The upper half is warm empty steps and sky. |

**Rejection checklist.** Reject and regenerate any image with lettering, logos, bibs or numbers; a cropped figure; a
minor's face in close-up; money, a handshake or ceremony staging; a fake interface or light streaks; faces lost in
shadow; or a brighter, flatter look that stands apart from the Pathway set.

**Pipeline.** Tone each image with the same solver and target as Pathway; record the values in
`src/content/images.ts`; compress to WebP for the single-file build.

## 11. Motion, accessibility and responsive

**Motion** (website and Pathway timings): panels 420ms `cubic-bezier(0.25,1,0.5,1)`; backdrop 300ms; hover and state
200ms; text reveal 600ms fade with a 10px rise; signal draw 1.4s; light speed 560px/s on desktop and 300px/s on
phones, 120px dash, 1.3s rest; comet 4.2s (start screen only, if used). Working screens: transitions ≤ 200ms and no
loops. Animate only transform and opacity. `prefers-reduced-motion` or the account-menu "Reduce motion" switch: lines
drawn static, no light travel, heartbeat replaced by a static glyph plus text, every interaction still works. Loops
pause off-screen.

**Accessibility (WCAG 2.2 AA):** landmarks and a skip link; text contrast ≥ 4.5:1 and control borders ≥ 3:1 in both
themes; targets ≥ 44px; focus never hidden under sticky headers (2.4.11); keyboard for everything (tabs with arrow
keys; panels with focus trap, Escape and focus return); errors as a summary plus inline messages; no colour-only
meaning; redundant entry avoided (3.3.7: the profile prefills applications); simulated codes accept paste and autofill
(3.3.8); every signal visual is `aria-hidden` with a text equivalent; every chart has a text summary and a "Show as
table" toggle; every figure button is named "See source: …".

**Responsive:**

| Who | Device | Test widths |
|---|---|---|
| Athletes, guardians | Phone first (360–430) | 375 |
| Coaches, site coordinators | Phone and tablet | 375, 768, 1024 |
| Funders, reviewers, finance, programme directors | Laptop first; must work at 1024 | 1024, 1440 |

No horizontal page scroll at any width.

## 12. Design definition of done

- [ ] Tokens, type utilities, buttons, chips, inputs, tables, panels, `.photo` grade and signal CSS copied with source
  notes; Daylight and print work; Dark is the default.
- [ ] Only the four differences in §3; no new colours, fonts, icons, gradients or card styles.
- [ ] Every status uses an icon plus a word; one primary per view; lime under ~10% of any screen.
- [ ] Funding Line: horizontal and vertical, six nodes, current-node rings, the light stops at the current node,
  `<ol>` with `aria-current`, static under reduced motion; every figure opens its sources.
- [ ] Funding bar: segments labelled with words and figures; in-kind and carried-in kept apart.
- [ ] Heartbeat only on the moments in §5.4; announced; static under reduced motion.
- [ ] Consent screens: equal Yes/No, nothing pre-selected, withdrawal always visible.
- [ ] Images generated, safeguarding-checked, toned to p75 ≈ 76 and saturation ≈ 42%, shown whole, none on working
  screens (placeholders until supplied).
- [ ] 375 / 768 / 1024 / 1440 with no overflow; keyboard path through every journey; axe clean in Dark and Daylight.
- [ ] Banner on every page; a side-by-side review with the Pathway prototype finds no family drift; three outside
  viewers never ask "is this real?".
