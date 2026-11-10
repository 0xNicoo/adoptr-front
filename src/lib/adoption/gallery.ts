export const SWIPE_MIN_PX = 40;

export function wrapIndex(current: number, delta: number, total: number): number {
  if (total <= 0) return 0;
  return (((current + delta) % total) + total) % total;
}

export function swipeDelta(distancePx: number): -1 | 0 | 1 {
  if (Math.abs(distancePx) < SWIPE_MIN_PX) return 0;
  return distancePx < 0 ? 1 : -1;
}
