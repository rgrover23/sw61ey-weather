import PropTypes from 'prop-types'
import { categoryMeta } from '../data/taxonomy'
import { formatShort, relativeLabel } from '../utils/dates'

/**
 * Horizontally-scrolling "coming up next" strip that surfaces the soonest
 * events — a fast, glanceable way in before diving into calendar/agenda.
 */
export default function Spotlight({ events, onOpen, title = '⏭️ Coming up next' }) {
  if (events.length === 0) return null
  return (
    <section>
      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 px-1">{title}</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
        {events.map((e) => {
          const meta = categoryMeta(e.category)
          return (
            <button
              key={e.id}
              onClick={() => onOpen(e)}
              className="snap-start shrink-0 w-56 text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className={`${meta.dot} h-1.5 w-full`} aria-hidden />
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.chip}`}>{meta.emoji} {e.category}</span>
                  {e.west && <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">WEST</span>}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 min-h-[2.5rem]">{e.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">📍 {e.area}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{formatShort(e.dateStart)}</span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{relativeLabel(e.dateStart)}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

Spotlight.propTypes = {
  events: PropTypes.array.isRequired,
  onOpen: PropTypes.func.isRequired,
  title: PropTypes.string,
}
