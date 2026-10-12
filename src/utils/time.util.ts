// Milliseconds in each unit, so the comparisons below read like the table they implement.
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

// Facebook-style short age of a timestamp: "now", "5m", "3h", "2d", "1w".
// `now` is a parameter so tests can pass a fixed time (the app just omits it).
export const formatShortRelativeTime = (
  iso: string,
  now: Date = new Date()
): string => {
  // Clamped at 0: if the server's clock is slightly ahead of this computer's,
  // a brand-new message would otherwise come out negative.
  const elapsed = Math.max(0, now.getTime() - new Date(iso).getTime());

  if (elapsed < MINUTE) return 'now';
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h`;
  if (elapsed < WEEK) return `${Math.floor(elapsed / DAY)}d`;
  return `${Math.floor(elapsed / WEEK)}w`;
};
