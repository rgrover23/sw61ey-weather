import { useState, useEffect, useCallback, useRef } from 'react'
import { parseDate, startOfToday, addDays } from '../utils/dates'

const STORAGE_KEY = 'lde:reminders:v1'
const SETTINGS_KEY = 'lde:settings:v1'

const DEFAULT_SETTINGS = {
  email: '',
  leadDays: 2, // remind this many days before the event
  browserNotifications: false,
  weekendDigest: true,
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

/**
 * Manages saved events, notification settings, and in-tab browser reminders.
 *
 * Saved events persist in localStorage. When browser notifications are enabled,
 * any saved event whose reminder window (leadDays before start) has arrived
 * fires a Notification while the dashboard is open. Durable email/push delivery
 * is handled by exporting events to a real calendar (.ics) — see utils/ics.js.
 */
export function useReminders() {
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })
  const [settings, setSettings] = useState(() => load(SETTINGS_KEY, DEFAULT_SETTINGS))
  const firedRef = useRef(new Set())

  // Persist.
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)) } catch { /* ignore */ }
  }, [saved])
  useEffect(() => {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)) } catch { /* ignore */ }
  }, [settings])

  const isSaved = useCallback((id) => Boolean(saved[id]), [saved])

  const toggleSaved = useCallback((event) => {
    setSaved((prev) => {
      const next = { ...prev }
      if (next[event.id]) {
        delete next[event.id]
      } else {
        next[event.id] = {
          id: event.id,
          title: event.title,
          dateStart: event.dateStart,
          savedAt: Date.now(),
        }
      }
      return next
    })
  }, [])

  const savedIds = Object.keys(saved)
  const savedCount = savedIds.length

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const requestBrowserPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported'
    if (Notification.permission === 'granted') {
      updateSettings({ browserNotifications: true })
      return 'granted'
    }
    const result = await Notification.requestPermission()
    updateSettings({ browserNotifications: result === 'granted' })
    return result
  }, [updateSettings])

  /**
   * Fire browser notifications for any saved event whose reminder window has
   * opened. Runs on mount and every 60s while the tab is open.
   */
  useEffect(() => {
    if (!settings.browserNotifications) return undefined
    if (!('Notification' in window) || Notification.permission !== 'granted') return undefined

    const check = () => {
      const today = startOfToday()
      savedIds.forEach((id) => {
        const rec = saved[id]
        const start = parseDate(rec.dateStart)
        if (!start) return
        const remindFrom = addDays(start, -Math.max(0, settings.leadDays))
        if (today >= remindFrom && today <= start && !firedRef.current.has(id)) {
          firedRef.current.add(id)
          try {
            const note = new Notification('🎟️ Upcoming London event', {
              body: `${rec.title} — coming up on ${rec.dateStart}`,
              tag: id,
            })
            void note
          } catch { /* ignore */ }
        }
      })
    }

    check()
    const interval = setInterval(check, 60 * 1000)
    return () => clearInterval(interval)
  }, [settings.browserNotifications, settings.leadDays, saved, savedIds])

  const clearSaved = useCallback(() => setSaved({}), [])

  return {
    saved,
    savedIds,
    savedCount,
    isSaved,
    toggleSaved,
    clearSaved,
    settings,
    updateSettings,
    requestBrowserPermission,
  }
}
