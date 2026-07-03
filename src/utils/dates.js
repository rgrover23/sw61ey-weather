/**
 * Date utilities for the London Events Dashboard.
 * All dates are handled in the Europe/London context. Event dates are stored
 * as plain "YYYY-MM-DD" strings to avoid timezone drift.
 */

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** Parse a "YYYY-MM-DD" string into a local Date at midnight (no TZ surprises). */
export function parseDate(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Format a Date (or ISO string) as "Sat 15 Aug". */
export function formatShort(date) {
  const d = typeof date === 'string' ? parseDate(date) : date
  if (!d) return ''
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** Format a Date (or ISO string) as "Saturday 15 August 2026". */
export function formatLong(date) {
  const d = typeof date === 'string' ? parseDate(date) : date
  if (!d) return ''
  return d.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

/** Convert a Date to a "YYYY-MM-DD" key. */
export function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Midnight-normalised "today". */
export function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

/**
 * Does an event (with dateStart / optional dateEnd) span the given day?
 */
export function eventCoversDay(event, day) {
  const start = parseDate(event.dateStart)
  if (!start) return false
  const end = event.dateEnd ? parseDate(event.dateEnd) : start
  const t = day.getTime()
  return t >= start.getTime() && t <= end.getTime()
}

/**
 * Build a 6-row month grid (Mon-first) for a given year/month (0-indexed month).
 * Returns an array of 42 Date objects covering leading/trailing days.
 */
export function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1)
  // JS getDay(): 0=Sun..6=Sat. We want Monday-first offset.
  const offset = (first.getDay() + 6) % 7
  const gridStart = addDays(first, -offset)
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
}

/** Human "in 3 days" / "today" / "tomorrow" relative label. */
export function relativeLabel(iso) {
  const target = parseDate(iso)
  if (!target) return ''
  const today = startOfToday()
  const diff = Math.round((target - today) / 86400000)
  if (diff < 0) return `${Math.abs(diff)} day${Math.abs(diff) === 1 ? '' : 's'} ago`
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff < 7) return `In ${diff} days`
  if (diff < 14) return 'Next week'
  const weeks = Math.round(diff / 7)
  if (diff < 60) return `In ${weeks} weeks`
  const months = Math.round(diff / 30)
  return `In ${months} month${months === 1 ? '' : 's'}`
}

/** Is the given ISO date within the coming weekend (Fri–Sun)? */
export function isThisWeekend(iso) {
  const d = parseDate(iso)
  if (!d) return false
  const today = startOfToday()
  const dow = (today.getDay() + 6) % 7 // 0=Mon
  const fri = addDays(today, (4 - dow + 7) % 7 === 0 && dow > 4 ? 4 - dow + 7 : 4 - dow)
  const sun = addDays(fri, 2)
  return d >= fri && d <= sun
}

/** Is the given ISO date within the next `days` days (inclusive of today)? */
export function isWithinDays(iso, days) {
  const d = parseDate(iso)
  if (!d) return false
  const today = startOfToday()
  const limit = addDays(today, days)
  return d >= today && d <= limit
}
