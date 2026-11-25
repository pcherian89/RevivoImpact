/**
 * Photographs that have arrived (docs/10 image plan). Keyed by the plan's filename, so a slot shows the real photo as
 * soon as its file is listed here and a quiet placeholder until then. Masters: assets/photography/source/ (PNG);
 * served: src/assets/photos/ (WebP, quality 78, inlined into the offline file by the build).
 *
 * `tone` evens each photo out to the Revivo website and Pathway set after the shared grade (--photo-grade), solved
 * with tools/tone/solve.py (copied from Revivo Pathway): 75th-percentile luminance ~76/255, mean saturation ~42%.
 * `w` and `h` are the file's own size: every frame takes the photo's own shape, so nothing is ever cropped.
 * Founder direction (25 Nov 2026): the solved tones made his photos too dim and too grey ("I can't see the images
 * clearly"), so Impact shows them with the shared grade only. The solved values stay beside each entry for reference.
 * All photographs are generated and illustrative, never real participants.
 */
import im01 from "../assets/photos/im-01-landing.webp";
import im02 from "../assets/photos/im-02-landing-phone.webp";
import im03 from "../assets/photos/im-03-athlete-home.webp";
import im05 from "../assets/photos/im-05-discover-opportunities.webp";
import im06 from "../assets/photos/im-06-funder-visit.webp";
import im08 from "../assets/photos/im-08-community-programme.webp";
import im09 from "../assets/photos/im-09-para-athlete.webp";
import im11 from "../assets/photos/im-11-competition-travel.webp";
import im13 from "../assets/photos/im-13-equipment-handover.webp";
import im21 from "../assets/photos/im-21-womens-basketball.webp";
import im14 from "../assets/photos/im-14-sponsorship-sprinter.webp";
import im15 from "../assets/photos/im-15-facilities.webp";
import im20 from "../assets/photos/im-20-swimming-coaching.webp";

export type Photo = { src: string; w: number; h: number; tone: string; note: string };

export const PHOTOS: Record<string, Photo> = {
  // Founder's photo "golden-hour team huddle" (25 Nov 2026). Trimmed 8px at each edge (rounded corners from the
  // export) and a shoe logo removed; otherwise as supplied.
  "im-01-landing.png": { src: im01, w: 1656, h: 925, tone: "" /* solved: saturate(0.79) brightness(0.77) */, note: "Coach talking with a team on a stadium track at sunset" },
  // Founder's photo "sunset stadium running team" (25 Nov 2026). Trimmed 8px at each edge (rounded corners).
  "im-02-landing-phone.png": { src: im02, w: 965, h: 1586, tone: "" /* solved: saturate(0.7) brightness(0.87) */, note: "A team running together on a stadium track at sunset" },
  // Founder's photo "sunset judo hall" (25 Nov 2026), as supplied.
  "im-03-athlete-home.png": { src: im03, w: 1672, h: 941, tone: "" /* solved: saturate(0.89) brightness(0.87) */, note: "Judoka training in a sunlit hall" },
  // Founder's photo "sunset sports complex" (25 Nov 2026): badminton, table tennis, boxing and cycling in one place.
  // Trimmed 8px at each edge (rounded corners). Its wall banners carry the Revivo pulse (the founder's own mark).
  "im-05-discover-opportunities.png": { src: im05, w: 1654, h: 926, tone: "" /* solved: saturate(0.79) brightness(0.75) */, note: "Many sports in one sunlit community sports centre" },
  // Founder's photo "sunset strategy training field" (25 Nov 2026): funders, staff and coaches on a balcony watching a
  // football session; the players are distant and not identifiable. As supplied. Brightness at the solver's floor
  // (0.75), so it sits slightly brighter than the set (p75 ~87): the sun and sky are in frame.
  "im-06-funder-visit.png": { src: im06, w: 1670, h: 942, tone: "" /* solved: saturate(0.7) brightness(0.75) */, note: "Funders and coaches watch a football session from a balcony at sunset" },
  // Founder's photo "sunset youth soccer training session" (25 Nov 2026): coaches in the foreground; children at
  // mid-distance with parents watching along the fence (safeguarding: open setting, several adults, no close-ups). As supplied.
  "im-08-community-programme.png": { src: im08, w: 1672, h: 941, tone: "" /* solved: saturate(0.7) brightness(0.89) */, note: "Coaches talk while children play a passing game at sunset" },
  // Founder's photo "sunset wheelchair racing team sprint" (25 Nov 2026): adult para athletes and their coaches.
  // Trimmed 10px at each edge (rounded corners); four shoe logos removed.
  "im-09-para-athlete.png": { src: im09, w: 1650, h: 922, tone: "" /* solved: saturate(0.7) brightness(0.75) */, note: "Wheelchair racers sprint while their coaches time them" },
  // Founder's photo "sunrise swim team departure" (25 Nov 2026): swimmers and coaches loading kit bags into a coach
  // outside a pool building. Trimmed 4px at each edge (rounded corner); two shoe marks removed.
  "im-11-competition-travel.png": { src: im11, w: 1664, h: 933, tone: "" /* solved: saturate(0.98) brightness(1.09) */, note: "A swim team loads kit bags into a coach at sunrise" },
  // Founder's photo "sunset poolside coaching huddle" (25 Nov 2026): adult swimmers only, so it suits the swimming
  // competition grant; never used on screens about young athletes. Trimmed 8px at each edge (rounded corners).
  // Not in the P1 plan: added so both travel grants have their own photo.
  "im-20-swimming-coaching.png": { src: im20, w: 1654, h: 925, tone: "" /* solved: saturate(0.7) brightness(0.84) */, note: "A coach talking with adult swimmers by the pool at sunset" },
  // Founder's photo "golden hour team gear unpacking" (25 Nov 2026): coaches and staff unpacking new balls, cones and
  // kit from boxes beside a clubhouse. Trimmed 10px at each edge (rounded corners).
  "im-13-equipment-handover.png": { src: im13, w: 1652, h: 921, tone: "", note: "Coaches unpack new balls, cones and kit for a club" },
  // Founder's photo "golden hour basketball training" (25 Nov 2026): a women's basketball session with two coaches.
  // Not in the P1 plan: the founder wanted more sports, so it heads the Women's Sporting Development Fund instead of
  // im-10 (football). Trimmed 10px at each edge (rounded corners); seven shoe and sock logos removed.
  "im-21-womens-basketball.png": { src: im21, w: 1650, h: 922, tone: "", note: "Women's basketball training at sunset" },
  // Founder's photo "pre-race team spirit at sunset" (25 Nov 2026): adult sprinters and their coach at an evening meet,
  // a crowd in the stand. Trimmed 10px at each edge (rounded corners).
  "im-14-sponsorship-sprinter.png": { src: im14, w: 1650, h: 921, tone: "", note: "Sprinters and their coach before a race at an evening meet" },
  // Founder's photo "community field renovation at sunset" (25 Nov 2026): volunteers painting seats, carrying a goal and
  // laying turf beside a clubhouse. Trimmed 10px at each edge (rounded corners); one small shoe mark removed.
  "im-15-facilities.png": { src: im15, w: 1651, h: 921, tone: "", note: "Volunteers renovate a community sports ground at sunset" },
};
