/**
 * iCalendar (.ics) generation.
 *
 * This is how "reminders" reach the user's email/phone without a backend:
 * an .ics file imported into Google Calendar / Apple Calendar / Outlook lets
 * those apps deliver native email + push reminders at the lead time chosen.
 */

import { parseDate, addDays } from './dates'

function pad(n) {
  return String(n).padStart(2, '0')
}

/** Format a Date as an all-day VALUE=DATE stamp: YYYYMMDD. */
function icsDate(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
}

/** A stable UTC timestamp for DTSTAMP (uses event date noon to avoid TZ edge cases). */
function icsStamp(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T120000Z`
}

function escapeText(str = '') {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Build a single VEVENT block for an event.
 * @param {object} event
 * @param {number} leadDays - reminder lead time in days before the event.
 */
function buildVEvent(event, leadDays = 1) {
  const start = parseDate(event.dateStart)
  // For all-day events DTEND is exclusive, so add one day.
  const endSource = event.dateEnd ? parseDate(event.dateEnd) : start
  const dtEnd = addDays(endSource, 1)
  const location = [event.venue, event.area, 'London'].filter(Boolean).join(', ')
  const url = event.url || ''
  const desc = [event.description, url && `More: ${url}`, `Price: ${event.price || 'See listing'}`]
    .filter(Boolean).join('\\n')

  const lines = [
    'BEGIN:VEVENT',
    `UID:${event.id}@london-events-dashboard`,
    `DTSTAMP:${icsStamp(start)}`,
    `DTSTART;VALUE=DATE:${icsDate(start)}`,
    `DTEND;VALUE=DATE:${icsDate(dtEnd)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(desc)}`,
    `LOCATION:${escapeText(location)}`,
    `CATEGORIES:${escapeText(event.category)}`,
  ]
  if (url) lines.push(`URL:${url}`)
  // Alarm: fire `leadDays` before the event start, at 09:00 the day-of minus lead.
  lines.push(
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(`Reminder: ${event.title}`)}`,
    `TRIGGER:-P${Math.max(0, leadDays)}D`,
    'END:VALARM',
    'END:VEVENT',
  )
  return lines.join('\r\n')
}

/** Wrap one or more VEVENTs into a full VCALENDAR string. */
export function buildCalendar(events, { leadDays = 1, name = 'London Events' } = {}) {
  const body = events.map((e) => buildVEvent(e, leadDays)).join('\r\n')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//London Events Dashboard//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(name)}`,
    `X-WR-TIMEZONE:Europe/London`,
    body,
    'END:VCALENDAR',
  ].join('\r\n')
}

/** Trigger a browser download of an .ics file. */
export function downloadIcs(events, opts = {}) {
  const list = Array.isArray(events) ? events : [events]
  const ics = buildCalendar(list, opts)
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = opts.filename || (list.length === 1
    ? `${list[0].id}.ics`
    : 'london-events.ics')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Build a Google Calendar "add event" URL (opens a pre-filled event the user
 * can save — Google then handles email/push reminders).
 */
export function googleCalendarUrl(event) {
  const start = parseDate(event.dateStart)
  const endSource = event.dateEnd ? parseDate(event.dateEnd) : start
  const end = addDays(endSource, 1)
  const dates = `${icsDate(start)}/${icsDate(end)}`
  const details = [event.description, event.url && `\nMore: ${event.url}`, `\nPrice: ${event.price || ''}`]
    .filter(Boolean).join('')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates,
    details,
    location: [event.venue, event.area, 'London'].filter(Boolean).join(', '),
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
