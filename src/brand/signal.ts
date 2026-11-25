// Copied from pcherian89/Revivo_Webpage @ 7575089, src/lib/signal.ts (SIGNAL, pulseSegment, PULSE_HALF; unchanged).
export type Point = { x: number; y: number };

/** Shared look: the hero, the seam and the explorer all use these. */
export const SIGNAL = {
  color: "#CCFF00",
  width: 1.75,
  glowWidth: 6,
  glowOpacity: 0.12,
  quiet: "#3F3F46",
  dotRadius: 3.5,
  haloRadius: 9,
  /** One corner radius for every turn in the system */
  radius: 18,
} as const;

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Catmull-Rom spline through points as cubic Béziers (used only for the pulse). */
function smoothThrough(points: readonly Point[], tension = 0.42): string {
  let d = "";
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const t = tension / 3;
    d += ` C ${r1(p1.x + (p2.x - p0.x) * t)} ${r1(p1.y + (p2.y - p0.y) * t)} ${r1(p2.x - (p3.x - p1.x) * t)} ${r1(
      p2.y - (p3.y - p1.y) * t,
    )} ${r1(p2.x)} ${r1(p2.y)}`;
  }
  return d;
}

/**
 * Path continuation for the one recognizable pulse, centred on `cx` and
 * starting/ending on the baseline `y`: a small lift, a strong asymmetric swing
 * and a quick recovery. Assumes the current point is (cx - 34·s, y).
 */
export function pulseSegment(cx: number, y: number, s = 1): string {
  const pts: Point[] = [
    { x: cx - 34 * s, y },
    { x: cx - 13 * s, y: y - 9 * s },
    { x: cx + 1 * s, y: y + 21 * s },
    { x: cx + 15 * s, y: y - 13 * s },
    { x: cx + 27 * s, y: y + 3 * s },
    { x: cx + 38 * s, y },
  ];
  return smoothThrough(pts);
}

/** Half-width of the pulse (baseline before → after). */
export const PULSE_HALF = { before: 34, after: 38 } as const;
  // (end of copy)
