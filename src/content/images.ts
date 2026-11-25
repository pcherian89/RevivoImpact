/**
 * Photographs that have arrived (docs/10 image plan). Keyed by the plan's filename, so a slot shows the real photo as
 * soon as its file is listed here and a quiet placeholder until then. Masters: assets/photography/source/ (PNG);
 * served: src/assets/photos/ (WebP, quality 78, inlined into the offline file by the build).
 *
 * `tone` evens each photo out to the Revivo website and Pathway set after the shared grade (--photo-grade), solved
 * with tools/tone/solve.py (copied from Revivo Pathway): 75th-percentile luminance ~76/255, mean saturation ~42%.
 * `w` and `h` are the file's own size: every frame takes the photo's own shape, so nothing is ever cropped.
 * All photographs are generated and illustrative, never real participants.
 */
import im01 from "../assets/photos/im-01-landing.webp";
import im02 from "../assets/photos/im-02-landing-phone.webp";
import im03 from "../assets/photos/im-03-athlete-home.webp";
import im05 from "../assets/photos/im-05-discover-opportunities.webp";
import im06 from "../assets/photos/im-06-funder-visit.webp";
import im11 from "../assets/photos/im-11-competition-travel.webp";

export type Photo = { src: string; w: number; h: number; tone: string; note: string };

export const PHOTOS: Record<string, Photo> = {
  // Founder's photo "golden-hour team huddle" (25 Nov 2026). Trimmed 8px at each edge (rounded corners from the
  // export) and a shoe logo removed; otherwise as supplied.
  "im-01-landing.png": { src: im01, w: 1656, h: 925, tone: "saturate(0.79) brightness(0.77)", note: "Coach talking with a team on a stadium track at sunset" },
  // Founder's photo "sunset stadium running team" (25 Nov 2026). Trimmed 8px at each edge (rounded corners).
  "im-02-landing-phone.png": { src: im02, w: 965, h: 1586, tone: "saturate(0.7) brightness(0.87)", note: "A team running together on a stadium track at sunset" },
  // Founder's photo "sunset judo hall" (25 Nov 2026), as supplied.
  "im-03-athlete-home.png": { src: im03, w: 1672, h: 941, tone: "saturate(0.89) brightness(0.87)", note: "Judoka training in a sunlit hall" },
  // Founder's photo "sunset sports complex" (25 Nov 2026): badminton, table tennis, boxing and cycling in one place.
  // Trimmed 8px at each edge (rounded corners). Its wall banners carry the Revivo pulse (the founder's own mark).
  "im-05-discover-opportunities.png": { src: im05, w: 1654, h: 926, tone: "saturate(0.79) brightness(0.75)", note: "Many sports in one sunlit community sports centre" },
  // Founder's photo "sunset strategy training field" (25 Nov 2026): funders, staff and coaches on a balcony watching a
  // football session; the players are distant and not identifiable. As supplied. Brightness at the solver's floor
  // (0.75), so it sits slightly brighter than the set (p75 ~87): the sun and sky are in frame.
  "im-06-funder-visit.png": { src: im06, w: 1670, h: 942, tone: "saturate(0.7) brightness(0.75)", note: "Funders and coaches watch a football session from a balcony at sunset" },
  // Founder's photo "sunset poolside coaching huddle" (25 Nov 2026): adult swimmers only, so it suits the swimming
  // travel grant; never used on screens about young athletes. Trimmed 8px at each edge (rounded corners).
  "im-11-competition-travel.png": { src: im11, w: 1654, h: 925, tone: "saturate(0.7) brightness(0.84)", note: "A coach talking with adult swimmers by the pool at sunset" },
};
