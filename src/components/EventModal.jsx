import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { categoryMeta } from '../data/taxonomy'
import { formatLong, relativeLabel } from '../utils/dates'
import { downloadIcs, googleCalendarUrl } from '../utils/ics'
import { emailEvent } from '../utils/email'
import WeatherChip from './WeatherChip'

/**
 * Full-screen (mobile) / centred (desktop) event detail modal with the full
 * set of "add to calendar / remind me / email" actions.
 */
export default function EventModal({ event, saved, onToggleSave, onClose, weather, leadDays, email }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!event) return null
  const meta = categoryMeta(event.category)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-gray-800 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Coloured header */}
        <div className={`${meta.dot} px-5 py-4 sm:rounded-t-2xl rounded-t-2xl flex items-start justify-between`}>
          <div className="flex items-center gap-2 text-white">
            <span className="text-2xl" aria-hidden>{meta.emoji}</span>
            <span className="font-semibold">{event.category}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white/90 hover:text-white text-2xl leading-none p-1"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {event.west && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-600 text-white">West London</span>}
            {event.niche && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">✦ Hidden gem</span>}
            {event.recurring && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">Annual</span>}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{event.title}</h2>

          <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
            <p className="flex items-center gap-2">
              <span aria-hidden>🗓️</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {formatLong(event.dateStart)}
                {event.dateEnd && event.dateEnd !== event.dateStart && ` – ${formatLong(event.dateEnd)}`}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{relativeLabel(event.dateStart)}</span>
            </p>
            {event.approxDate && (
              <p className="text-xs text-amber-600 dark:text-amber-400 pl-6">
                ⚠︎ Typical annual date — confirm exact date on the official listing.
              </p>
            )}
            {event.timeNote && <p className="flex items-center gap-2"><span aria-hidden>🕒</span> {event.timeNote}</p>}
            <p className="flex items-center gap-2"><span aria-hidden>📍</span> {event.venue}, {event.area}, London</p>
            <p className="flex items-center gap-2">
              <span aria-hidden>💷</span>
              <span className="font-medium">{event.price || 'See listing'}</span>
            </p>
            {weather && (
              <p className="flex items-center gap-2"><span aria-hidden>🌤️</span> Forecast: <WeatherChip weather={weather} /></p>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{event.description}</p>

          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {event.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">#{t}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => onToggleSave(event)}
              className={`col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-colors ${
                saved
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {saved ? '⭐ Saved — you\'ll be reminded' : '⭐ Save & remind me'}
            </button>

            <button
              onClick={() => downloadIcs(event, { leadDays })}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Download .ics — adds it to Apple/Google/Outlook Calendar with a reminder"
            >
              📅 Add to calendar
            </button>

            <a
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              🗓️ Google Cal
            </a>

            <button
              onClick={() => emailEvent(event, { to: email })}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Email this event to yourself or a friend"
            >
              ✉️ Email
            </button>

            {event.url ? (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-medium bg-emerald-600 text-white hover:bg-emerald-700"
              >
                🔗 Official site
              </a>
            ) : (
              <span className="flex items-center justify-center py-2.5 rounded-xl text-sm text-gray-400 bg-gray-50 dark:bg-gray-900">No link</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

EventModal.propTypes = {
  event: PropTypes.object,
  saved: PropTypes.bool,
  onToggleSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  weather: PropTypes.object,
  leadDays: PropTypes.number,
  email: PropTypes.string,
}
