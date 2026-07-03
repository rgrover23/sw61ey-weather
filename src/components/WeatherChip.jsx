import PropTypes from 'prop-types'
import WeatherIcon from './WeatherIcon'

/**
 * Small weather hint shown on events happening within the 16-day forecast
 * window. Ties the events dashboard to its weather-dashboard roots.
 */
export default function WeatherChip({ weather }) {
  const wet = weather.precipProb != null && weather.precipProb >= 50
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        wet
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
          : 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
      }`}
      title={`Forecast: ${weather.description}, ${weather.tempMin}–${weather.tempMax}°C${
        weather.precipProb != null ? `, ${weather.precipProb}% rain` : ''
      }`}
    >
      <WeatherIcon code={weather.code} size="text-sm" />
      {weather.tempMax}°
      {weather.precipProb != null && weather.precipProb >= 40 && ` · ${weather.precipProb}%☔`}
    </span>
  )
}

WeatherChip.propTypes = {
  weather: PropTypes.shape({
    code: PropTypes.number,
    description: PropTypes.string,
    tempMax: PropTypes.number,
    tempMin: PropTypes.number,
    precipProb: PropTypes.number,
  }).isRequired,
}
