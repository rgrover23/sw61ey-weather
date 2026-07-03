/**
 * Email helpers.
 *
 * Without a backend we deliver "email notifications" two honest ways:
 *  1. mailto: links that open the user's mail client pre-filled with a digest
 *     of their saved / upcoming events — send-to-self or share with a friend.
 *  2. An optional webhook/serverless hook (see sendDigestViaWebhook) that a
 *     forward-looking deployment can point at to send real scheduled emails.
 */

import { formatShort, relativeLabel } from './dates'

/** Build a plain-text digest body from a list of events. */
export function buildDigestText(events, { heading } = {}) {
  const lines = []
  if (heading) lines.push(heading, '')
  events.forEach((e) => {
    lines.push(`• ${e.title}`)
    lines.push(`  ${formatShort(e.dateStart)}${e.timeNote ? ` · ${e.timeNote}` : ''} (${relativeLabel(e.dateStart)})`)
    lines.push(`  ${e.venue}, ${e.area} · ${e.price || 'See listing'}`)
    if (e.url) lines.push(`  ${e.url}`)
    lines.push('')
  })
  lines.push('— Sent from the London Events Dashboard')
  return lines.join('\n')
}

/** Open the user's mail client with a pre-filled digest email. */
export function emailDigest(events, { to = '', subject } = {}) {
  const body = buildDigestText(events, {
    heading: `Your London events digest — ${events.length} event${events.length === 1 ? '' : 's'} coming up:`,
  })
  const params = new URLSearchParams({
    subject: subject || `🎟️ London Events — ${events.length} coming up`,
    body,
  })
  window.location.href = `mailto:${encodeURIComponent(to)}?${params.toString()}`
}

/** Open a mail client to email a single event to oneself / a friend. */
export function emailEvent(event, { to = '' } = {}) {
  const body = buildDigestText([event])
  const params = new URLSearchParams({
    subject: `🎟️ ${event.title} — ${formatShort(event.dateStart)}`,
    body,
  })
  window.location.href = `mailto:${encodeURIComponent(to)}?${params.toString()}`
}

/**
 * Forward-thinking hook: POST a digest to a serverless endpoint that actually
 * sends a scheduled email (e.g. a Cloudflare Worker + Resend/SendGrid, or
 * EmailJS). Configure the endpoint via VITE_EMAIL_WEBHOOK at build time.
 * No-ops gracefully if not configured so the UI never breaks.
 */
export async function sendDigestViaWebhook(events, { to, leadDays } = {}) {
  const endpoint = import.meta.env?.VITE_EMAIL_WEBHOOK
  if (!endpoint || !to) return { ok: false, reason: 'not-configured' }
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        leadDays,
        events: events.map((e) => ({
          id: e.id, title: e.title, dateStart: e.dateStart,
          venue: e.venue, area: e.area, url: e.url, price: e.price,
        })),
      }),
    })
    return { ok: res.ok, status: res.status }
  } catch (err) {
    return { ok: false, reason: err.message }
  }
}

export function isWebhookConfigured() {
  return Boolean(import.meta.env?.VITE_EMAIL_WEBHOOK)
}
