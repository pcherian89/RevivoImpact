# Revivo Impact — image asset plan (P4, 25 Nov 2026)

For the founder, who will generate the final images in ChatGPT. **This version supersedes the P1 plan and its P3
update.** Style and grading rules: `04` §9. Until an image arrives, the prototype shows a dark placeholder of the same
shape with the filename and "Illustrative"; every image slot is wired to its final filename, so dropping the files in
needs no other change.

## 0. Photographs placed so far (25 Nov 2026)

The founder supplied fourteen of his own photographs (made in ChatGPT) and asked that Revivo Impact use them and match
the website and Pathway in light and grade. **Founder direction on the look: these photos win over this plan where
they differ** — everyone in black kit with thin lime trim (not only coaches), and warm sunset light (the judo hall at
sunset rather than morning daylight). Later images should follow the same look; prompts below are not yet rewritten.

| Slot | Founder's photo | Changes made | Tone (`src/content/images.ts`) |
|---|---|---|---|
| im-01-landing (Start, laptop and tablet) | Golden-hour team huddle: a coach talking with a team on a stadium track | 8 px trimmed at each edge (rounded corners from the export); a shoe logo removed | saturate(0.79) brightness(0.77) |
| im-02-landing-phone (Start, phones) | Sunset stadium running team (upright; shown in its own shape, not cut to 9:16) | 8 px trimmed at each edge (rounded corners) | saturate(0.7) brightness(0.87) |
| im-03-athlete-home (athlete and coach Home) | Sunset judo hall: three women judoka, pairs practising behind | none | saturate(0.89) brightness(0.87) |
| im-05-discover-opportunities (seeker Discover header; Emerging Athletes Scholarship header) | Sunset sports complex: badminton, table tennis, boxing, cycling; wall banners with the Revivo pulse | 8 px trimmed at each edge (rounded corners) | saturate(0.79) brightness(0.75) |
| im-06-funder-visit (funder Overview band; public profiles of foundations, companies and federations) | Sunset strategy training field: funders, staff and coaches on a balcony watching a football session | none | saturate(0.7) brightness(0.75) |
| im-08-community-programme (organisation Home; Community Sports Programme Grant header) | Sunset youth football session: coaches in the foreground, children at mid-distance, parents along the fence | none | (grade only) |
| im-09-para-athlete (Para Athlete Equipment Grant header) | Sunset wheelchair racing sprint: adult racers and two coaches with a stopwatch | 10 px trimmed at each edge (rounded corners); four shoe logos removed | (grade only) |
| im-11-competition-travel (Athlete Travel Bursary header) | Sunrise swim team departure: swimmers and coaches loading kit bags into a coach | 4 px trimmed at each edge (rounded corner); two shoe marks removed | (grade only) |
| im-13-equipment-handover (Oriel Kit Scheme header) | Golden hour team gear unpacking: coaches and staff unpacking balls, cones and kit by a clubhouse | 10 px trimmed at each edge (rounded corners) | (grade only) |
| im-21-womens-basketball (new slot: Women's Sporting Development Fund header, in place of im-10) | Golden hour basketball training: a women's session with two coaches | 10 px trimmed at each edge; seven shoe and sock logos removed | (grade only) |
| im-14-sponsorship-sprinter (Corvane Sportswear profile, the sports-brand variant) | Pre-race team spirit at sunset: adult sprinters and their coach at an evening meet | 10 px trimmed at each edge (rounded corners) | (grade only) |
| im-15-facilities (Facilities Small Grants header) | Community field renovation at sunset: volunteers painting seats, carrying a goal and laying turf | 10 px trimmed at each edge; one small shoe mark removed | (grade only) |
| im-20-swimming-coaching (new slot: Competition Travel Grant header, swimming) | Sunset poolside coaching huddle: adult swimmers and their coach (close faces, so never used for young athletes such as Tiago) | 8 px trimmed at each edge (rounded corners) | (grade only) |

**Founder direction, 25 Nov 2026 (after seeing the first screenshots):** the solved tones made the photos too dim and
too grey, and phones showed no header photos. Revivo Impact now shows the founder's photos with the shared grade only
(no per-photo tone; the solved values are kept in `src/content/images.ts` for reference), hero bands use the
website's lighter `.hero-photo-frame` fade, and every header photo also shows on phones (above the title on
opportunity and Discover pages, just after the greeting on Home screens). This supersedes the p75/saturation target in
`04` §9 for Impact.

**Header layout (founder approved, 25 Nov 2026):** every page header with a photo follows Pathway's pattern
(`HeroBand`): the photo behind the right half, clipped to the header and fading left and down (Pathway `.header-photo`
/ `.fade-header`); on the left the title, one or two plain sentences saying what the page is for, and the page's main
actions; a thin line closes the header. Phones show the photo above the title, except Home screens, where it comes
after "Needs you" so the most important task stays at the top. Goal (founder): every page clear at first sight, nobody
guessing.

Pipeline: masters in `assets/photography/source/`, WebP (quality 78) in `src/assets/photos/`, tone solved with
`tools/tone/solve.py` (copied from Pathway) to p75 ≈ 76/255 and saturation ≈ 42%, the same targets as the website and
Pathway. Frames fade at every edge (Pathway `.fade-band`); hero bands fade left, top and bottom. Still to come: im-04, im-12, im-16 and im-19 (and im-10, no longer shown until a logo-free football photo arrives)
still show "Photograph to come". The founder's women's football photo (for im-10) is on hold: it carries many Nike marks (bibs, shorts, socks,
shoes), too many to remove cleanly; a version without logos was requested. The judo photo would also suit im-12 (High Performance Camp Support) if the founder
wants it reused there.

## 1. What changed since the P1 plan

- **16 images instead of 19.** Each image was reviewed for whether it helps a person understand the screen. Removed:
  - **im-07-review-panel** (an "How decisions are made" illustration): the text answers the question; a photo there
    only adds length.
  - **im-17-report-desk** (printed report cover): a report is a working document; the cover now carries the funder,
    the period and the key figures instead.
  - **im-18-empty-state**: empty states now say what to do next, in words, with one button.
- **No photographs on task screens** (funding record, Send an update, Programme, Today's sessions, Reports, review,
  selection, ledgers): founder direction, `04` §1.
- **Placements changed:** im-04 (guardian Home only), im-08 (organisation Home and the programme grant header; not the
  Programme screen), im-11, im-12, im-13 (opportunity headers only), im-14 (moved to Corvane's public profile), im-19
  (public profile only). Each entry below says what changed.
- **Unchanged:** the master block, the style, the grading, the casting rules and every prompt that remains.

## 2. Sizes for every image

- **Landscape (15 images):** 16:9, final file **1672 × 941 px**. Generate at 1536 × 1024 (ChatGPT landscape), then
  trim once to 16:9, keeping every person whole inside a margin of about 8%.
- **Portrait (1 image, im-02):** 9:16, final file **941 × 1672 px**. Generate at 1024 × 1536, trim once to 9:16.
- Save as PNG with the exact filename below. The build converts them to WebP (about 1672 px wide, quality 78) and
  keeps the whole set under about 3 MB, so the prototype stays one offline file.

## 3. Master block (paste once into ChatGPT, then one prompt per message)

> You are making a consistent series of photographs for Revivo Impact, a trustworthy platform that connects athletes,
> clubs and sports programmes with funders and sponsors, and helps funders see how their support is used. Style:
> authentic documentary sports photography in the same series as the Revivo website and Revivo Pathway: golden hour or
> warm evening light, one warm low light source (or warm window light indoors), muted warm natural colour, fine grain,
> quietly hopeful and real. **The main subject is always clearly lit and easy to read at a glance: faces, hands and
> the sporting action keep their detail.** Shadows deepen to near-black (#0A0A0B) only towards the edges of the frame,
> never across faces. Settings anywhere in the world, no landmarks. People: mixed genders, ages, skin tones and body
> types; include disabled athletes where natural. Coaches wear plain dark sportswear with one subtle, thin lime-green
> trim line (not neon, not glowing); funders and staff wear plain smart-casual clothes; athletes wear plain unbranded sportswear in muted warm
> colours (navy, terracotta, ochre, white, grey). Anyone under 18 is seen from behind, in profile or small in the
> frame, never in close-up, and always with several people or a parent present in an open setting. Every person is
> entirely inside the frame (no cut-off heads, hands or feet). No text, letters, numbers, bibs, logos, flags or
> signage; papers and screens face away or are unreadable. No money, cheques, cash, coins, handshake poses, trophies or
> medals. No holograms, overlays, data graphics, glowing lines, neon, lens flares, blue or purple light. Make every
> image a wide landscape (or a tall portrait when I say so) and keep every person well inside the frame with generous
> margins on all sides, because each image will be trimmed once to 16:9 (or 9:16). Reply "Ready".

## 4. The 16 images

### im-01-landing.png

| | |
|---|---|
| **Screen and placement** | Start screen (1), laptop and tablet: left column beside the headline |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | The first impression: sport and support meeting; warm, credible, recognisably Revivo. |
| **Subject** | A young Black woman sprinter (about 20), her coach (a South Asian woman in her forties) and a supporter (a white woman in her fifties) walking onto a track. |
| **Composition** | Three-quarter view, the group in the right third; other athletes small in the background; the left 40% open track and sky for the headline. |
| **Lighting** | Golden hour; low warm sun behind the stand; faces clearly lit. |
| **Sporting environment** | A grassroots athletics track with a small stand. |
| **Changed since the P1 plan** | Unchanged. |

**Prompt:** "A community athletics track at golden hour. In the right third of the frame, a young Black woman sprinter of about 20 in a plain terracotta training top walks onto the track beside her coach, a South Asian woman in her forties in dark kit with a subtle thin lime trim, and a white woman in her fifties in smart-casual clothes who is supporting her; all three are talking, seen in three-quarter view, fully in frame and clearly lit by the low sun. A few other athletes warm up small in the background near a modest stand. The left 40% of the frame is calm, softly lit track and warm sky, left empty for text. Warm, optimistic, real."

### im-02-landing-phone.png

| | |
|---|---|
| **Screen and placement** | Start screen (1), phones: behind the headline |
| **Aspect ratio and size** | 9:16 · final 941×1672 px (generate 1024×1536 portrait, trim once to 9:16) |
| **Purpose** | The same first impression on a phone, with room for the headline. |
| **Subject** | The same three people walking side by side away from camera. |
| **Composition** | Upright; people in the lower third; the upper 45% calm sky and a stand roofline. |
| **Lighting** | Golden hour, low warm sun from the side. |
| **Sporting environment** | The same community track. |
| **Changed since the P1 plan** | Unchanged. |

**Prompt:** "Upright portrait. The same community athletics track at golden hour. In the lower third, the young Black woman sprinter, her South Asian coach in dark kit with a subtle thin lime trim, and the woman supporter in her fifties walk side by side away from camera along the track, fully in frame, lit by low warm sun from the side. The upper 45% is calm, warm evening sky above a modest stand roofline, empty for a headline."

### im-03-athlete-home.png

| | |
|---|---|
| **Screen and placement** | Athlete Home (3): band beside the greeting (on phones below "Needs you") |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | The athlete's own space: focused and encouraging; matches Amira's sport without claiming to be her. |
| **Subject** | A young woman judoka (about 20, North African or Middle Eastern features) tying her belt. |
| **Composition** | Three-quarter view in the right half; two pairs practising small behind; left half open mat and wall. |
| **Lighting** | Clear morning daylight from tall windows. |
| **Sporting environment** | A bright community dojo. |
| **Changed since the P1 plan** | Unchanged. |

**Prompt:** "A bright community dojo in clear morning daylight from tall windows. In the right half of the frame, a young woman judoka of about 20 with North African or Middle Eastern features, in a plain white judogi, ties her belt at the edge of the mats, seen in three-quarter view, her face and hands clearly lit and calm. Two pairs of adult judoka of mixed backgrounds practise small in the background. The left half is open, bright mat and pale wall. Focused, encouraging, fresh."

### im-04-guardian-offer.png

| | |
|---|---|
| **Screen and placement** | Guardian Home (3): band beside the greeting |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | A family deciding together; makes "only you, as guardian, can accept" feel human. |
| **Subject** | A Latina mother in her forties and her teenage son (a swimmer) reading a letter together. |
| **Composition** | Seen from behind and slightly to the side; the teenager's face never visible; swim bag on the floor. |
| **Lighting** | Warm afternoon window light across the table and their hands. |
| **Sporting environment** | A lived-in family kitchen. |
| **Changed since the P1 plan** | Placement narrowed: guardian Home only (the offer is a working screen, so no photo there). |

**Prompt:** "A Latina mother in her forties and her teenage son, a swimmer, sit side by side at a kitchen table by a sunny window, seen from behind and slightly to the side so the teenager's face is not visible, looking together at a printed letter with unreadable text and a laptop turned away from camera. A swim bag and a towel on the floor by the chair. Warm afternoon light falls across the table and their hands; a lived-in family kitchen. Calm, hopeful, private."

### im-05-discover-opportunities.png

| | |
|---|---|
| **Screen and placement** | Seeker Discover (5) header; Emerging Athletes Scholarship header (6) |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | "Funding for every sport": many sports in one welcoming view. |
| **Subject** | A badminton player stretching, a cyclist wheeling a bike, table tennis and a boxing bag beyond. |
| **Composition** | One real place seen from slightly above; people small to medium; not a collage. |
| **Lighting** | Bright late-morning daylight through an open side. |
| **Sporting environment** | An open-sided community multi-sport centre. |
| **Changed since the P1 plan** | Unchanged. |

**Prompt:** "A wide view of an open-sided community multi-sport centre in bright late-morning daylight, seen from a slightly raised position. Foreground right: a young East Asian woman badminton player stretching with her racket, clearly lit. Mid-ground: a young Black man in cycling kit wheeling a plain bicycle; further back, two players at a table-tennis table and a heavy boxing bag hanging near a wall. Clear daylight pours in through the open side. Several people of different ages and backgrounds, all small to medium in the frame and fully in frame. One real place, not a collage. Lively but calm."

### im-06-funder-visit.png

| | |
|---|---|
| **Screen and placement** | Funder Overview (3) band; funder public profile (8) for foundations, companies and federations |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | The funder side: people who support sport, seeing it in person. |
| **Subject** | Two adults in smart-casual clothes and a programme coordinator watching a session. |
| **Composition** | From behind and slightly to the side on a touchline; lots of open sky; the session distant. |
| **Lighting** | Golden hour; long shadows; the people clearly lit by the low sun. |
| **Sporting environment** | A community pitch. |
| **Changed since the P1 plan** | Unchanged. |

**Prompt:** "Two adults in plain smart-casual clothes (a South Asian man in his fifties and a Black woman in her thirties) and a programme coordinator in dark kit with a subtle thin lime trim stand on the touchline of a community pitch at golden hour, seen from behind and slightly to the side, clearly lit by the low sun, watching a distant training session with coaches and a mixed group of players. Wide, calm, lots of open warm sky; long shadows across the grass."

### im-08-community-programme.png

| | |
|---|---|
| **Screen and placement** | Organisation Home (3) band; Community Sports Programme Grant header (6) |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | Grassroots programme delivery, with children small in frame. |
| **Subject** | A coach holding a closed register; children playing a passing game; a second adult supervising. |
| **Composition** | Coach in the foreground right; children at mid-distance, from the side and behind. |
| **Lighting** | Late-afternoon sun; long warm shadows from trees. |
| **Sporting environment** | A concrete community court beside a school. |
| **Changed since the P1 plan** | Moved off the Programme screen in P3 (working screen). |

**Prompt:** "A concrete community court beside a school in late-afternoon sun. A white male coach in his thirties in dark kit with a subtle thin lime trim holds a closed paper register in the foreground right, clearly lit, while a mixed group of children play a passing game at mid-distance, small in the frame and seen from the side and behind, with a second adult supervising. Trees cast long warm shadows across the court."

### im-09-para-athlete.png

| | |
|---|---|
| **Screen and placement** | Para Athlete Equipment Grant header (6); adult funding requests (7) and Publish a request (10) intro band |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | An adult athlete with a specific, credible need; para sport with dignity. |
| **Subject** | A woman wheelchair racer in her twenties mid-push, with her coach timing her. |
| **Composition** | Profile at mid-distance; coach at the trackside; a few athletes small behind. |
| **Lighting** | Golden hour; clearly lit by the low sun. |
| **Sporting environment** | A red athletics track. |
| **Changed since the P1 plan** | Unchanged. |

**Prompt:** "A white woman wheelchair racer in her twenties trains on a red athletics track at golden hour, mid-push in a racing wheelchair, seen in profile at mid-distance and clearly lit by the low sun, with her coach holding a stopwatch at the trackside. A few other athletes small in the background. Strong, focused and dignified, not pitying."

### im-10-womens-football.png

| | |
|---|---|
| **Screen and placement** | Women's Sporting Development Fund header (6); Lakeside Women's FC request (7) |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | Women's team sport, energetic and unposed. |
| **Subject** | An adult women's football team in a small-sided drill; one woman coach watching. |
| **Composition** | Players at mid-distance between cones; mixed ages, skin tones and body types. |
| **Lighting** | A bright clear morning; faces readable. |
| **Sporting environment** | A community grass pitch. |
| **Changed since the P1 plan** | Unchanged. |

**Prompt:** "A women's football team training on a community grass pitch on a bright clear morning: a small-sided drill between cones, adult players of mixed ages, skin tones and body types (Black, white, South Asian and East Asian women) at mid-distance, one woman coach watching. Clear daylight; players' faces are readable. Energetic, joyful, unposed; plain unbranded kit in ochre and navy."

### im-11-competition-travel.png

| | |
|---|---|
| **Screen and placement** | Competition Travel Grant and Athlete Travel Bursary headers (6) |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | Funding that gets athletes to competitions. |
| **Subject** | Young adult swimmers and two coaches loading kit bags into an unmarked minibus. |
| **Composition** | Small team fully in frame; sense of a journey beginning. |
| **Lighting** | Dawn; soft warm sunrise from the side. |
| **Sporting environment** | Outside a swimming centre (no signage). |
| **Changed since the P1 plan** | Placement narrowed: opportunity headers only (agreement records are working screens). |

**Prompt:** "Dawn outside a swimming centre. A small team of young adult swimmers and two coaches load kit bags into the luggage hold of a plain white minibus with no markings. Soft warm sunrise lights their faces from the side; long shadows; a sense of a journey beginning. All figures fully in frame; no signage on the building."

### im-12-judo-camp.png

| | |
|---|---|
| **Screen and placement** | High Performance Camp Support header (6) |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | Training camps: discipline and progress. |
| **Subject** | Pairs of adult judoka practising throws; a coach watching from the side. |
| **Composition** | Pairs at mid-distance; coach clearly lit at the side. |
| **Lighting** | Bright daytime light through tall windows. |
| **Sporting environment** | A judo training camp dojo. |
| **Changed since the P1 plan** | Placement narrowed: header only. |

**Prompt:** "A judo training camp in a dojo with tall windows in bright daytime light. Pairs of adult judoka in plain white judogi practise throws on the mats at mid-distance; a coach in a dark tracksuit with a thin lime trim watches from the side, clearly lit by window light. Men and women of African, Asian and European backgrounds. Focused, disciplined, warm."

### im-13-equipment-handover.png

| | |
|---|---|
| **Screen and placement** | Oriel Kit Scheme (equipment support) header (6) |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | Practical equipment support for clubs: modest, not a ceremony. |
| **Subject** | A programme coordinator handing a bag of footballs to a club coach; boxes of cones on a bench. |
| **Composition** | Both adults clearly lit; teenage players at mid-distance from behind; no handshake. |
| **Lighting** | Golden hour. |
| **Sporting environment** | Outside a small clubhouse. |
| **Changed since the P1 plan** | Placement narrowed: header only. |

**Prompt:** "Outside a small clubhouse at golden hour, a South Asian woman programme coordinator in smart-casual clothes passes a plain unbranded mesh bag of new footballs to a Black male club coach; plain cardboard boxes of cones and folded plain training tops stand on a bench. Teenage players wait at mid-distance, seen from behind. Both adults clearly lit. Practical and modest, not a ceremony, no handshake."

### im-14-sponsorship-sprinter.png

| | |
|---|---|
| **Screen and placement** | Corvane Sportswear public profile band (8): the sports-brand variant |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | Commercial sponsorship of an adult athlete: professional and distinct from charity. |
| **Subject** | An adult Latino male sprinter of about 22 adjusting unbranded spikes before a race. |
| **Composition** | Three-quarter view; other sprinters small behind; a blurred modest crowd. |
| **Lighting** | Last golden light with warm stadium lights. |
| **Sporting environment** | An evening athletics meet. |
| **Changed since the P1 plan** | Moved: from the sponsorship record (a working screen) to the brand's public profile, where it tells sponsors and athletes what commercial sponsorship looks like. |

**Prompt:** "An adult Latino male sprinter of about 22 at an evening athletics meet, standing on the track before a race, adjusting plain unbranded spikes, seen in three-quarter view and clearly lit by warm stadium lights and the last golden light. Other sprinters small in the background; a modest crowd blurred in the stand. Plain kit in white and terracotta with no logos, lane markings in view or numbers anywhere. Confident, professional."

### im-15-facilities.png

| | |
|---|---|
| **Screen and placement** | Facilities Small Grants header (6) |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | Community facilities, built by the community. |
| **Subject** | Volunteers repainting a fence and carrying new corner flags. |
| **Composition** | Seen from a little distance; all clearly lit; timber under a tarpaulin. |
| **Lighting** | A clear bright morning. |
| **Sporting environment** | A small community clubhouse beside a grass pitch. |
| **Changed since the P1 plan** | Unchanged. |

**Prompt:** "A small community sports clubhouse beside a grass pitch on a clear bright morning, mid-renovation: two adult volunteers (an older Black man and a young white woman) repaint a wooden fence, a middle-aged East Asian man carries new corner flags, a stack of timber under a tarpaulin. Seen from a little distance, all clearly lit. Practical, hopeful, community-built."

### im-16-coach-education.png

| | |
|---|---|
| **Screen and placement** | Coach Education Bursary header (6) |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | Developing coaches. |
| **Subject** | A Black woman coach educator explaining technique beside a heavy bag to five adult coaches. |
| **Composition** | Faces and hands lit by a large window; notebooks in hand. |
| **Lighting** | Bright daytime light from large windows. |
| **Sporting environment** | An indoor boxing gym. |
| **Changed since the P1 plan** | Unchanged. |

**Prompt:** "Indoor boxing gym in bright daytime light from large windows. A Black woman coach educator stands beside a heavy bag explaining technique to five adult coaches of different backgrounds holding notebooks; two of them wear dark kit with a thin lime trim. Faces and hands clearly lit by a large window. Learning, respect, practical."

### im-19-individual-sponsor.png

| | |
|---|---|
| **Screen and placement** | Individual sponsor's public profile band (8); the individual sponsor's own Overview band (3) |
| **Aspect ratio and size** | 16:9 · final 1672×941 px (generate 1536×1024 landscape, trim once to 16:9) |
| **Purpose** | A verified individual who supports sport personally: generous, grounded, adult to adult. |
| **Subject** | A man in his sixties (a former rower) talking with two young adult rowers holding oars. |
| **Composition** | All three on a pontoon beside a boat rack, fully in frame. |
| **Lighting** | Golden hour over calm water; mist on the lake. |
| **Sporting environment** | A rowing club pontoon and boathouse. |
| **Changed since the P1 plan** | Placement narrowed: public profile only (removed from Discover rows to keep discovery a clean list). |

**Prompt:** "A rowing club pontoon on a calm lake at golden hour. A white man in his sixties in a plain fleece (a former rower) talks with two young adult rowers, a Black woman and a South Asian man, who hold oars beside a rack of boats; all three are smiling naturally and clearly lit by the low sun. Mist on the water; a boathouse at the side. Warm, respectful, grounded."

## 5. Placement map

| Screen | Image |
|---|---|
| 1 Start | im-01 (laptop, tablet), im-02 (phone) |
| 3 Home | athlete and coach im-03 · guardian im-04 · funder Overview im-06 (individual sponsor im-19) · organisation im-08 · programme coach: none |
| 5 Discover | seekers: im-05 in the header only · funders: none (a clean list) |
| 6 Opportunity header (by fund) | Emerging Athletes Scholarship im-05 · Community Sports Programme Grant im-08 · Para Athlete Equipment Grant im-09 · Women's Sporting Development Fund im-10 · Competition Travel Grant and Athlete Travel Bursary im-11 · High Performance Camp Support im-12 · Oriel Kit Scheme im-13 · Facilities Small Grants im-15 · Coach Education Bursary im-16 |
| 7 Funding request · 10 Publish | adult and club requests: im-09 or the sport's image · **young athletes: never an image** |
| 8 Public profile | foundations, companies, federations im-06 · Corvane (sports brand) im-14 · individual sponsor im-19 · athletes: no photograph of the athlete |
| Task screens (funding record, updates, programme, sessions, reports, review, selection, Funding, audit) | none |

## 6. Rejection checklist

Reject and regenerate any image with: lettering, logos, bibs, lane markings or numbers; a cropped figure; a minor's face in close-up
or a minor alone with an adult; money, a handshake or ceremony staging; a fake interface or light streaks; **the main
subject in shadow or faces lost in darkness**; a brighter, flatter look that stands apart from the Pathway set;
stereotyped or tokenistic casting; landmarks or recognisable places.

## 7. Pipeline

Tone each image with the same solver and target as Pathway (`tools/tone/solve.py`, copied with a source note when the
images arrive): p75 luminance about 76/255, mean saturation about 42%, clamps as `04` §9; record the values in
`src/content/images.ts`; compress to WebP for the single-file build; total under about 3 MB. Every image is labelled
"Illustrative" in its context and is never presented as a real participant.
