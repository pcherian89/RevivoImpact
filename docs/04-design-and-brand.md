# Revivo Impact — design and brand

**The test (founder priority):** someone who has seen the Revivo website and Revivo Pathway opens Revivo Impact.
Within one second they know it is Revivo. Within ten seconds they know what to do next. Where anything (including the
founder's brief) pulls against this, this document wins, and the change is listed in `01` §11.

**References (read only; copy files into this repository with a source note, never edit the originals):**

- Website: repository `pcherian89/Revivo_Webpage` (checked in P1 at commit `7575089`, cloned read-only to
  `/home/user/pcherian89/revivo_webpage`) and its `CLAUDE.md`.
- Pathway: repository `pcherian89/RevivoPathway` (commit `fb40e56`, cloned read-only to `/home/user/revivopathway`):
  `docs/03-design-brief.md` (tokens, motifs, photography, motion) and `tools/tone/`; the built prototype is the
  website's `public/pathway-demo.html` (React 19.3.1, Tailwind CSS 4.3.4).

**P1 note (25 Nov 2026).** The founder asked for immediate family resemblance *and* its own product character:
"reuse the design language rather than blindly duplicating every design decision", and use a different layout where it
makes Impact more intuitive. The founder also asked to avoid grey-heavy interfaces, excessively dark imagery, generic
SaaS dashboards, unnecessary cards, unexplained charts, fake holographic interfaces, excessive gradients and decoration
without purpose. These are folded into §1, §3, §7 and §9 below.

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
- **Not grey-heavy.** Contrast comes from ink on canvas and clear hierarchy, not from layers of grey panels. Panels are
  used for records and sheets only; lists are rows with dividers; no card grids or KPI tiles. Every chart has a
  one-line explanation above it and a "Show as table" toggle.
- **Warm on the athlete side, credible on the funder side** (§8): the athlete experience is mobile-first and
  encouraging; the funder experience is professional and transparent; discovery is engaging without looking like an
  e-commerce catalogue (no product-card grids, prices as hero, "buy" language or star ratings).

### 1.1 Simplicity, plain language and the eight screen questions (founder, 25 Nov 2026; permanent)

Every existing and new screen is checked against:

1. Can a first-time user immediately understand what this page is for?
2. Can they understand the information without a lengthy explanation?
3. Is the primary action obvious?
4. Do they know what to do next?
5. Is every piece of information relevant?
6. Can anything be removed without reducing meaningful functionality?
7. Is the page visually appealing and easy to scan?
8. Does the page work equally well on a phone?

If a screen needs a presenter, tooltip or long explanation to understand its basic purpose, redesign it. The guided
demonstration shows the story; the product must be intuitive without it.

**Everyday words.** Every heading, button, label, status, chart, notification, error, form question and instruction is
written for someone who knows sport but not grant management, finance or software. Keep a sporting or financial term
only where it is genuinely needed, and explain it in passing. No invented or branded terms where a common word works.
Athletes and families get the warmest, simplest wording ("My Funding"); funders get fuller financial detail, still in
plain words. Examples: "Record a payment" (not "initiate a disbursement"); "Athletes and programmes we support" (not
"beneficiary portfolio"); "Check spending" (not "expenditure reconciliation"); "Upload proof"; "Type of funding";
"Payments still due"; "Confirm money received"; "Activities behind schedule"; "Do I qualify?"; "How the money is being
used"; "Applications and decisions"; "Check the evidence".

**Charts and figures.** Every chart answers a question written as its heading ("How much funding is still
available?", "Where has the money been spent?", "Which expenses need checking?", "Which payments are still due?",
"Are funded programmes on track?"). Real numbers with units, readable labels, meaningful comparisons; no unexplained
percentages, complex legends, many colours or ambiguous status marks. Important figures open their records
("See source"), subject to permissions.

**Visual quality.** Black, white and electric lime; premium type; cinematic photography where it helps (never where
it gets in the way of a task); clear hierarchy; clean layouts; whitespace; subtle motion; Dark and Daylight; phone,
tablet and desktop. Avoid grey-heavy screens, card grids, unnecessary badges, too much lime, repeated information,
oversized decoration on working screens, generic admin dashboards, long explanatory text and clutter.

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
| Start-screen layout | Pathway start screen (checked in the build, 25 Nov 2026) | Same composition. Left: lockup, eyebrow "Sports Funding & Sponsorship Platform" (`.label`), small pulse, `text-hero` tagline, supporting line as lead, `im-01` shown whole. Right: "Choose how to explore" with **Guided journey** (recommended, lime outline) and **Explore the platform**. |
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
subtle `#5C5C63`, amber text `#8A5A00`, coral `#A33A2A`, steel text `#3E5A6B`. **Confirmed in P1 (25 Nov 2026)** against
the `[data-rp-theme]` blocks of the Pathway build: every value above matches; no change. Pathway also defines
`--rp-signal-ink` (= signal) and `--rp-places` (= signal in Dark, passed in Daylight); Impact copies both as
`--ri-signal-ink` and `--ri-places` but does not need `places`.

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

**Where Impact's layout departs from Pathway (P1, for usability).** Same components and tokens, different
arrangement where the task differs: (a) a **main navigation of up to five items** (bottom bar on phones), because
Impact has repeat users on both sides, whereas Pathway's workspaces were reached mainly through the guide;
(b) **Discover** is a two-direction list with tabs, a brief box and a sponsor directory, which Pathway did not have;
(c) the **Public profile** (funder or athlete) is a document-like page with one primary action. Everything else (start
screen, prototype bar, banner, guide panel, role pill, panels, chips, tables, buttons, consent rows) is Pathway's.

## 4. Ease-of-use rules

The ten rules in `03` §1 apply to every screen (one question per screen; at most five navigation items; "what needs
you" first; next step always visible; one primary per view; progressive disclosure; forgiving forms; plain words for
seekers; device priorities; guided mode first). Proof of ease: in P5 (founder's brief), independent AI reviewers
acted as first-time users for every role; human sessions are optional, with a ready plan in `15` §9.

## 5. The Funding Line

### 5.1 Anatomy

- One straight signal track joining two endpoints: the **funder** on the left (or top, on phones) and the **recipient**
  on the right (or bottom). Endpoint labels use the organisation name and the recipient's name (a minor's reference
  until the guardian accepts).
- Nodes for the agreement's life (`02` §11):
  - Athlete support (scholarship award, development grant, competition funding, direct support): **Need → Support →
    Released → Spent → Progress → Review**. Receipt shows on Released ("received 6 May"); verification on Spent.
  - Programme: **Commitment → Delivered → Spent → Evidence → Outcomes → Review**.
  - Sponsorship agreement (five nodes): **Agreement → Funding → Deliverables → Evidence → Review**.
  - Accessible names use the full wording ("Funding need", "Approved support", "Funds released and received",
    "Expenditure and verification", "Sporting progress", "Funding review"; "Funding commitment", "Activities
    delivered", "Expenditure", "Evidence", "Outcomes", "Review"; "Sponsorship agreement", "Payments", "Agreed
    deliverables", "Evidence", "Review").
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

**Plain money vocabulary (founder direction, 25 Nov 2026).** The five money states never blur, and each has one
everyday name used on every screen:

| State (internal) | Funder sees | Athlete or organisation sees | Meaning in one line |
|---|---|---|---|
| Committed | **Committed** | **Agreed** | Accepted by both sides; not yet paid |
| Released | **Paid** | **Paid to you** | The funder recorded a payment (simulated) |
| Received | **Received** | **Received** | The recipient confirmed the money arrived |
| Reported | **Spent (reported)** | **Spent** | The recipient recorded what it was spent on |
| Verified | **Checked** | **Checked by the funder** | A person at the funder checked the proof |

Other money words: "Still to pay" (committed, not yet paid), "Not yet spent" (paid, not reported), "Waiting to be
checked", "Set aside for offers" (held), "Still available", "Total fund" (announced), "Carried in" (paid before the
agreement joined Revivo Impact; never counts as checked). Actions: "Record a payment", "Confirm money received", "Add an
expense", "Check spending", "Send an update".

**Agreement funding bar** (total length = Committed), left to right:

| Segment | Look | Label |
|---|---|---|
| Spent · verified | Solid ink, a small tick at its end | "Spent · verified $1,720" |
| Spent · awaiting verification | Steel diagonal hatch | "Awaiting $210" |
| Released, not yet reported | Ink outline filled with surface-2 | "Unspent $320" |
| Outstanding (committed, not released) | Control outline only, empty | "Still to come $2,250" |

Brackets above the bar mark **Released** (the first three segments, with "received" and its date when confirmed) and
**Committed** (the whole bar).

**Fund bar** (length = Announced): Committed (solid ink) · Held for offers (dashed outline) · Available to award (no
fill, subtle text). **Need bar** (length = Requested): Received (ink with a tick) · Pledged, not yet received (ink
outline) · pending offers (dashed) · Remaining (empty, with the amount in words). **Deliverables** (shown to people as "agreed tasks", 26 Nov 2026) (commercial) are a separate
strip of up to three items with a status chip each, never a money bar. **In-kind** never appears in a cash
bar: a separate line reads "60 kits · declared value $9,000 (not cash)". **Carried-in** amounts carry their own label
and never count as verified.

## 7. Screen-type guidance

| Screen | Direction |
|---|---|
| Start (1) | Pathway's start screen 1:1 (§2), with the two doors. |
| Homes (3) | Calm. At most three "needs you" items first (on phones before any image), then the relevant funding bar and Funding Line. Funder Overview: three plain answers ("Who applied", "Who is funded", "How it's being used") under an `im-06` hero band. Athlete Home: `im-03` hero band (on phones below "Needs you"). |
| Discover (5) | Warm, but a list, not cards; an `im-05` hero band on the seeker's first tab only (funder side: no image). Seeker tabs: Funding opportunities · Sponsors & funders. Funder tabs: Athletes · Funding requests · Teams & initiatives · Shortlist. Rows: name and type with verification chip, title, funding-type chip, amount, deadline or date needed, one plain "why this appears" line with an icon, mini need bar where relevant. At most five filter pills; the funder's brief box sits above the tabs and turns into editable chips. Minors only as anonymised rows with a neutral glyph (never a photo or silhouette of a child). |
| Public profile (8) | Document-like, one column on phones, two from 1024px (facts left; "What they support" or "What they need" right). The funder variant leads with sports, regions, types and "Accepts funding requests"; the athlete variant with sport, level and verified facts. One primary action. A small `im-` portrait-free band for organisations (sport environment, no people) where an image helps. |
| Opportunity (6) | Document-like. Header band (the Fund's image, faded). Key facts in a four-column strip. Then "Who can apply" as a checklist evaluated against the profile, "What you'll need", "How decisions are made" (with `im-07`), "What you'll report". One primary. |
| Apply (11) | Quiet stepper; autosave; missing items in amber with an icon; "Help me organise this" labelled "Simulated AI"; guardian authorisation step for a minor. |
| Review and selection (13, 14) | Working screens, no photos. Two columns: evidence with field-level verification on the left; fixed decision vocabulary and a required reason on the right. Self-approval disabled with its reason. AI summary labelled "Simulated AI · check against sources". |
| Funding (16) | Ledger: table of agreements, each row with a mini Funding Line and its next step, with right-aligned tabular figures; totals reconcile on screen; every figure "See source". |
| Funding record and Programme (17, 19) | The signature: Funding Line, funding bar and dated evidence beneath. Programme: v1 session strips (20 ticks per site: delivered filled; verified filled with a dot; missed a gap with a reason glyph and a word; a timeline, not an ECG). Funders see aggregates only. |
| Reports (21) | Print-first, prints in Daylight. A one-page statement: committed, released, spent and evidenced, and what is outstanding; "Prepared by … · accepted by …"; the full honesty line; optional `im-17` cover band. |
| Consent & safety (22) | Pathway's consent component 1:1: equal outlined Yes/No, neither pre-selected; the chosen one fills (Yes = lime, No = ink); "Change or withdraw" always visible. |

**Never:** generic SaaS dashboards, grey-heavy layered panels, unexplained charts, e-commerce product grids,
purple or blue AI gradients, robots, brains, holograms, glassmorphism, blobs, particles, textures or grids;
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
| Copy | Second person: "4 of 6 met · 1 for the panel to check · 1 to add" | Neutral statements with sources and dates |
| Heartbeat | Submitted, accepted, received | Report accepted, plan approved |
| Device | Phone first | Laptop first, works at 1024px |
| Theme | Dark default; Daylight one tap away | Dark default; Daylight one tap away; print in Daylight |

## 9. Imagery rules and grading

- **Founder's P1 instruction: avoid excessively dark imagery, keep the family style.** Read together, the rule is: keep
  the family grade, but **every image must read clearly at a glance**: the subject is lit, faces and hands keep detail,
  the setting is recognisable, and darkness is only at the frame's edges. Reject any image where the subject sits in
  shadow (rejection checklist, `10`). If the founder still finds the set too dark after the first images, the
  fallback is to raise the p75 target from 76 to about 84 for Impact's athlete-side images only (an open point,
  `09` §7).
- **Do not lift the grade globally.** The founder's brief asks for warm natural light and to avoid overly dark imagery. Brighter
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

## 10. Image asset plan

Moved to **`10-image-asset-plan.md`** (P1, 25 Nov 2026): the complete plan for the revised screen architecture, with
filename, screen and placement, aspect ratio, subject, composition, lighting, sporting environment, purpose and a
detailed ChatGPT prompt for every image, plus the master block, the rejection checklist and the toning pipeline. It
replaces the initial 14-image list that was here.

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
- [ ] Images generated from `10`, safeguarding-checked, readable at a glance, toned to p75 ≈ 76 and saturation ≈ 42%,
  shown whole, none on working screens (placeholders until supplied).
- [ ] Not grey-heavy: no card grids, KPI tiles or layered grey panels; every chart explained in one line.
- [ ] 375 / 768 / 1024 / 1440 with no overflow; keyboard path through every journey; axe clean in Dark and Daylight.
- [ ] Banner on every page; a side-by-side review with the Pathway prototype finds no family drift; three outside
  viewers never ask "is this real?".
