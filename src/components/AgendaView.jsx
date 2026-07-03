import { useMemo } from 'react'
import PropTypes from 'prop-types'
import EventCard from './EventCard'
import { MONTH_NAMES } from '../utils/dates'

/**
 * Chronological agenda: events grouped by month, then rendered as cards.
 */
export default function AgendaView({ events, isSaved, onToggleSave, onOpen, weatherMap }) {
  const groups = useMemo(() => {
    const map = new Map()
    events.forEach((e) => {
      const [y, m] = e.dateStart.split('-')
      const key = `${y}-${m}`
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(e)
    })
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [events])

  if (events.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-10 text-center">
        <p className="text-4xl mb-2">🔎</p>
        <p className="font-semibold text-gray-700 dark:text-gray-200">No events match your filters</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try clearing a filter or widening the date range.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {groups.map(([key, groupEvents]) => {
        const [y, m] = key.split('-')
        return (
          <section key={key}>
            <h3 className="sticky top-0 z-10 -mx-1 px-3 py-1.5 mb-2 text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-900/40 backdrop-blur rounded-lg inline-block">
              {MONTH_NAMES[Number(m) - 1]} {y} · {groupEvents.length} event{groupEvents.length === 1 ? '' : 's'}
            </h3>
            <div className="space-y-2.5">
              {groupEvents.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  saved={isSaved(e.id)}
                  onToggleSave={onToggleSave}
                  onOpen={onOpen}
                  weather={weatherMap?.[e.dateStart]}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

AgendaView.propTypes = {
  events: PropTypes.array.isRequired,
  isSaved: PropTypes.func.isRequired,
  onToggleSave: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  weatherMap: PropTypes.object,
}
