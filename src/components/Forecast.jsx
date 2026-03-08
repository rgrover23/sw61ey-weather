import { useState } from 'react'
import PropTypes from 'prop-types'
import WeatherIcon from './WeatherIcon'

const TABS = ['7-Day Forecast', 'Hourly']

/**
 * Shows the daily and hourly weather forecasts in tabbed panels.
 * Props:
 *   daily  {Array}  7-day daily forecast objects
 *   hourly {Array}  24-hour hourly forecast objects
 */
export default function Forecast({ daily, hourly }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === i
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4">
        {activeTab === 0 ? (
          <DailyForecast daily={daily} />
        ) : (
          <HourlyForecast hourly={hourly} />
        )}
      </div>
    </div>
  )
}

function DailyForecast({ daily }) {
  return (
    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
      {daily.map((day, i) => {
        const label = i === 0
          ? 'Today'
          : i === 1
            ? 'Tomorrow'
            : formatDayLabel(day.date)
        return (
          <li key={day.date} className="flex items-center justify-between py-2.5 gap-2">
            <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            <WeatherIcon code={day.weatherCode} size="text-2xl" className="w-8 text-center" />
            <span className="flex-1 text-xs text-gray-500 dark:text-gray-400 truncate">{day.description}</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-800 dark:text-gray-100">{day.tempMax}°</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500 dark:text-gray-400">{day.tempMin}°</span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function HourlyForecast({ hourly }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <div className="flex gap-3 pb-2 min-w-max px-1">
        {hourly.map((h) => (
          <div
            key={h.time}
            className="flex flex-col items-center gap-1 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2 min-w-[60px]"
          >
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatHourLabel(h.time)}</span>
            <WeatherIcon code={h.weatherCode} size="text-xl" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{h.temperature}°</span>
            {h.precipitationProbability > 0 && (
              <span className="text-xs text-blue-500">💧{h.precipitationProbability}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDayLabel(dateStr) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatHourLabel(timeStr) {
  const date = new Date(timeStr)
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

const dailyShape = PropTypes.shape({
  date: PropTypes.string.isRequired,
  weatherCode: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  tempMax: PropTypes.number.isRequired,
  tempMin: PropTypes.number.isRequired,
  precipitationSum: PropTypes.number,
  windSpeedMax: PropTypes.number,
})

const hourlyShape = PropTypes.shape({
  time: PropTypes.string.isRequired,
  temperature: PropTypes.number.isRequired,
  weatherCode: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  precipitationProbability: PropTypes.number,
})

Forecast.propTypes = {
  daily: PropTypes.arrayOf(dailyShape).isRequired,
  hourly: PropTypes.arrayOf(hourlyShape).isRequired,
}

DailyForecast.propTypes = {
  daily: PropTypes.arrayOf(dailyShape).isRequired,
}

HourlyForecast.propTypes = {
  hourly: PropTypes.arrayOf(hourlyShape).isRequired,
}
