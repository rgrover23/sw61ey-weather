import { useState, useMemo, useEffect, useCallback } from 'react'
import { EVENTS } from './data/events'
import { WEST_LONDON_AREAS } from './data/taxonomy'
import { useReminders } from './hooks/useReminders'
import { useEventFilters } from './hooks/useEventFilters'
import { useForecast } from './hooks/useForecast'
import {
  startOfToday, parseDate, isThisWeekend, eventCoversDay, formatLong,
} from './utils/dates'

import StatsBar from './components/StatsBar'
import Spotlight from './components/Spotlight'
import FilterBar from './components/FilterBar'
import CalendarView from './components/CalendarView'
import AgendaView from './components/AgendaView'
import EventCard from './components/EventCard'
import EventModal from './components/EventModal'
import RemindersPanel from './components/RemindersPanel'

const MIN_MONTH = { year: 2026, month: 6 } // July 2026
const MAX_MONTH = { year: 2026, month: 11 } // December 2026

function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('lde:theme')
    if (saved) return saved === 'dark'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('lde:theme', dark ? 'dark' : 'light')
  }, [dark])
  return [dark, () => setDark((d) => !d)]
}

export default function App() {
  const reminders = useReminders()
  const { filters, setFilter, toggleCategory, reset, filtered, activeCount } =
    useEventFilters(EVENTS, reminders.savedIds)
  const weatherMap = useForecast()
  const [dark, toggleTheme] = useTheme()

  const [view, setView] = useState('agenda') // 'agenda' | 'calendar'
  const [openEvent, setOpenEvent] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const now = useMemo(() => startOfToday(), [])
  const [nav, setNav] = useState(() => (
    now.getFullYear() === MIN_MONTH.year && now.getMonth() > MIN_MONTH.month
      ? { year: now.getFullYear(), month: Math.min(now.getMonth(), MAX_MONTH.month) }
      : MIN_MONTH
  ))
  const [selectedDay, setSelectedDay] = useState(null)

  // Base "upcoming" list (today → year end) for headline stats.
  const upcoming = useMemo(
    () => EVENTS.filter((e) => {
      const end = e.dateEnd ? parseDate(e.dateEnd) : parseDate(e.dateStart)
      return end && end >= now
    }),
    [now],
  )

  const stats = useMemo(() => ({
    total: upcoming.length,
    west: upcoming.filter((e) => e.west).length,
    niche: upcoming.filter((e) => e.niche).length,
    weekend: upcoming.filter((e) => isThisWeekend(e.dateStart)).length,
    free: upcoming.filter((e) => /free/i.test(e.price || '')).length,
  }), [upcoming])

  const soonest = useMemo(
    () => [...filtered].sort((a, b) => a.dateStart.localeCompare(b.dateStart)).slice(0, 10),
    [filtered],
  )

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return []
    return filtered
      .filter((e) => eventCoversDay(e, selectedDay))
      .sort((a, b) => a.dateStart.localeCompare(b.dateStart))
  }, [filtered, selectedDay])

  const handleNavigate = useCallback((dir) => {
    setNav((prev) => {
      let m = prev.month + dir
      let y = prev.year
      if (m < 0) { m = 11; y -= 1 }
      if (m > 11) { m = 0; y += 1 }
      return { year: y, month: m }
    })
    setSelectedDay(null)
  }, [])

  const applyQuick = useCallback((patch) => {
    setFilter(patch)
    setView('agenda')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [setFilter])

  const savedEvents = useMemo(
    () => reminders.savedIds
      .map((id) => EVENTS.find((e) => e.id === id))
      .filter(Boolean),
    [reminders.savedIds],
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Header */}
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              🎡 London Events
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              West London focus · {formatLong(now).replace(/^\w+ /, '')} → 31 Dec 2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setPanelOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-full bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition-colors"
            >
              ⭐ Reminders
              {reminders.savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {reminders.savedCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <StatsBar stats={stats} onQuick={applyQuick} />

        <Spotlight events={soonest} onOpen={setOpenEvent} />

        <FilterBar
          filters={filters}
          setFilter={setFilter}
          toggleCategory={toggleCategory}
          reset={reset}
          areas={WEST_LONDON_AREAS}
          activeCount={activeCount}
          resultCount={filtered.length}
        />

        {/* View toggle */}
        <div className="flex items-center justify-center gap-1 bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-100 dark:border-gray-700 w-fit mx-auto">
          {[
            { key: 'agenda', label: '📋 Agenda' },
            { key: 'calendar', label: '🗓️ Calendar' },
          ].map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                view === v.key ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {view === 'calendar' ? (
          <div className="space-y-4">
            <CalendarView
              events={filtered}
              month={nav.month}
              year={nav.year}
              onNavigate={handleNavigate}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              minMonth={MIN_MONTH}
              maxMonth={MAX_MONTH}
            />
            {selectedDay && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800 dark:text-white">{formatLong(selectedDay)}</h3>
                  <button onClick={() => setSelectedDay(null)} className="text-sm text-gray-400 hover:text-gray-600">Close</button>
                </div>
                {selectedDayEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No events match your filters on this day.</p>
                ) : (
                  <div className="space-y-2.5">
                    {selectedDayEvents.map((e) => (
                      <EventCard
                        key={e.id}
                        event={e}
                        saved={reminders.isSaved(e.id)}
                        onToggleSave={reminders.toggleSaved}
                        onOpen={setOpenEvent}
                        weather={weatherMap[e.dateStart]}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <AgendaView
            events={filtered}
            isSaved={reminders.isSaved}
            onToggleSave={reminders.toggleSaved}
            onOpen={setOpenEvent}
            weatherMap={weatherMap}
          />
        )}

        <footer className="text-center text-xs text-gray-400 dark:text-gray-600 py-4 space-y-1">
          <p>
            Curated London events · heavy West London focus · {upcoming.length} events to the end of 2026.
          </p>
          <p>
            Dates marked <span className="italic">~ approx</span> are typical annual slots — always confirm on the official listing.
            Weather via <a href="https://open-meteo.com" className="underline" target="_blank" rel="noopener noreferrer">Open-Meteo</a>.
          </p>
        </footer>
      </div>

      <EventModal
        event={openEvent}
        saved={openEvent ? reminders.isSaved(openEvent.id) : false}
        onToggleSave={reminders.toggleSaved}
        onClose={() => setOpenEvent(null)}
        weather={openEvent ? weatherMap[openEvent.dateStart] : null}
        leadDays={reminders.settings.leadDays}
        email={reminders.settings.email}
      />

      <RemindersPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        savedEvents={savedEvents}
        settings={reminders.settings}
        updateSettings={reminders.updateSettings}
        requestBrowserPermission={reminders.requestBrowserPermission}
        onOpenEvent={(e) => { setOpenEvent(e); setPanelOpen(false) }}
        onToggleSave={reminders.toggleSaved}
        clearSaved={reminders.clearSaved}
      />
    </div>
  )
}
