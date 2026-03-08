import PropTypes from 'prop-types'
import WeatherIcon from './WeatherIcon'

/**
 * Displays the current weather conditions.
 */
export default function CurrentWeather({ current, location, lastUpdated }) {
  const windDirLabel = degreesToCompass(current.windDirection)

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-2xl p-6 shadow-xl">
      {/* Location & time */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-wide">{location}</h2>
          {lastUpdated && (
            <p className="text-blue-200 text-sm mt-0.5">
              Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
        <WeatherIcon code={current.weatherCode} isDay={current.isDay} size="text-5xl" />
      </div>

      {/* Temperature */}
      <div className="flex items-end gap-2 mb-1">
        <span className="text-7xl font-thin leading-none">
          {current.temperature}
        </span>
        <span className="text-4xl font-light mb-1">{current.units.temperature}</span>
      </div>
      <p className="text-blue-200 text-lg mb-6">{current.description}</p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 border-t border-blue-500 pt-4">
        <StatItem
          label="Feels like"
          value={`${current.feelsLike}${current.units.temperature}`}
          icon="🌡️"
        />
        <StatItem
          label="Humidity"
          value={`${current.humidity}%`}
          icon="💧"
        />
        <StatItem
          label="Wind"
          value={`${current.windSpeed} ${current.units.windSpeed} ${windDirLabel}`}
          icon="💨"
        />
      </div>
    </div>
  )
}

function StatItem({ label, value, icon }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-white font-medium text-sm">{value}</span>
      <span className="text-blue-200 text-xs mt-0.5">{label}</span>
    </div>
  )
}

function degreesToCompass(degrees) {
  if (degrees == null) return ''
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(degrees / 45) % 8]
}

CurrentWeather.propTypes = {
  current: PropTypes.shape({
    temperature: PropTypes.number.isRequired,
    feelsLike: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    weatherCode: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    windSpeed: PropTypes.number.isRequired,
    windDirection: PropTypes.number,
    isDay: PropTypes.bool.isRequired,
    units: PropTypes.shape({
      temperature: PropTypes.string.isRequired,
      windSpeed: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.string.isRequired,
  lastUpdated: PropTypes.instanceOf(Date),
}

StatItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
}
