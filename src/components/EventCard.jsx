import PropTypes from 'prop-types'
import { categoryMeta } from '../data/taxonomy'
import { formatShort, relativeLabel } from '../utils/dates'
import WeatherChip from './WeatherChip'

/**
 * Compact, interactive event card used in the agenda list and day panels.
 */
export default function EventCard({ event, saved, onToggleSave, onOpen, weather }) {
  const meta = categoryMeta(event.category)

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${meta.dot}`} aria-hidden />
      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${meta.chip}`}>
                <span aria-hidden>{meta.emoji}</span> {event.category}
              </span>
              {event.west && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                  West London
                </span>
              )}
              {event.niche && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300" title="Niche / hidden-gem event">
                  ✦ Hidden gem
                </span>
              )}
            </div>
            <button
              onClick={() => onOpen(event)}
              className="text-left font-semibold text-gray-900 dark:text-white leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {event.title}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              📍 {event.venue}, {event.area}
            </p>
          </div>

          <button
            onClick={() => onToggleSave(event)}
            aria-label={saved ? 'Remove reminder' : 'Save & remind me'}
            title={saved ? 'Saved — remove reminder' : 'Save & remind me'}
            className={`shrink-0 p-2 rounded-full transition-colors ${
              saved
                ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30'
                : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
            }`}
          >
            <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.5a.56.56 0 011.04 0l2.12 4.3 4.75.69c.46.07.64.63.31.95l-3.44 3.35.81 4.73c.08.46-.4.81-.81.59L12 16.8l-4.25 2.24c-.41.22-.89-.13-.81-.59l.81-4.73-3.44-3.35a.56.56 0 01.31-.95l4.75-.69 2.12-4.3z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm">
          <span className="inline-flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200">
            🗓️ {formatShort(event.dateStart)}
            {event.dateEnd && event.dateEnd !== event.dateStart && ` – ${formatShort(event.dateEnd)}`}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {relativeLabel(event.dateStart)}
          </span>
          {event.timeNote && (
            <span className="text-gray-500 dark:text-gray-400">🕒 {event.timeNote}</span>
          )}
          <span className="text-gray-700 dark:text-gray-200 font-medium">
            {/free/i.test(event.price || '') ? '🎟️ Free' : `💷 ${event.price || 'See listing'}`}
          </span>
          {weather && <WeatherChip weather={weather} />}
          {event.approxDate && (
            <span className="text-xs text-gray-400 dark:text-gray-500" title="Date is the typical annual slot — confirm on the official listing">
              ~ approx date
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  saved: PropTypes.bool,
  onToggleSave: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  weather: PropTypes.object,
}
