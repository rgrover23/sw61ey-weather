import { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  buildMonthGrid, MONTH_NAMES, WEEKDAY_NAMES, toKey, isSameDay,
  startOfToday, eventCoversDay,
} from '../utils/dates'
import { categoryMeta } from '../data/taxonomy'

/**
 * Month-grid calendar. Each day cell shows up to a few category dots and a
 * count; clicking a day selects it (the parent renders that day's agenda).
 */
export default function CalendarView({
  events, month, year, onNavigate, selectedDay, onSelectDay, minMonth, maxMonth,
}) {
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month])
  const today = startOfToday()

  // Bucket events by day-key for quick lookup across the visible grid.
  const byDay = useMemo(() => {
    const map = {}
    grid.forEach((day) => {
      const key = toKey(day)
      map[key] = events.filter((e) => eventCoversDay(e, day))
    })
    return map
  }, [grid, events])

  const canPrev = year > minMonth.year || (year === minMonth.year && month > minMonth.month)
  const canNext = year < maxMonth.year || (year === maxMonth.year && month < maxMonth.month)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => onNavigate(-1)}
          disabled={!canPrev}
          aria-label="Previous month"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
        >
          ‹
        </button>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={() => onNavigate(1)}
          disabled={!canNext}
          aria-label="Next month"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
        >
          ›
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_NAMES.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {grid.map((day) => {
          const key = toKey(day)
          const dayEvents = byDay[key] || []
          const inMonth = day.getMonth() === month
          const isToday = isSameDay(day, today)
          const isSelected = selectedDay && isSameDay(day, selectedDay)
          const isPast = day < today
          const cats = [...new Set(dayEvents.map((e) => e.category))].slice(0, 4)

          return (
            <button
              key={key}
              onClick={() => onSelectDay(day)}
              disabled={dayEvents.length === 0}
              className={`relative aspect-square rounded-lg p-1 flex flex-col items-center justify-start text-sm transition-all border ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-transparent'
              } ${
                inMonth ? 'text-gray-700 dark:text-gray-200' : 'text-gray-300 dark:text-gray-600'
              } ${
                dayEvents.length ? 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer' : 'cursor-default'
              } ${isPast && inMonth ? 'opacity-50' : ''}`}
            >
              <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                isToday ? 'bg-indigo-600 text-white' : ''
              }`}>
                {day.getDate()}
              </span>
              {cats.length > 0 && (
                <span className="flex flex-wrap gap-0.5 justify-center mt-0.5">
                  {cats.map((c) => (
                    <span key={c} className={`w-1.5 h-1.5 rounded-full ${categoryMeta(c).dot}`} />
                  ))}
                </span>
              )}
              {dayEvents.length > 0 && (
                <span className="absolute bottom-0.5 right-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                  {dayEvents.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
        Tap a highlighted day to see what&apos;s on. Dots show event categories.
      </p>
    </div>
  )
}

CalendarView.propTypes = {
  events: PropTypes.array.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  onNavigate: PropTypes.func.isRequired,
  selectedDay: PropTypes.instanceOf(Date),
  onSelectDay: PropTypes.func.isRequired,
  minMonth: PropTypes.object.isRequired,
  maxMonth: PropTypes.object.isRequired,
}
