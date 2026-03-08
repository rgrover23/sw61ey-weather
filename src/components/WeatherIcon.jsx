import PropTypes from 'prop-types'

/**
 * WeatherIcon component — renders an SVG or emoji icon based on the WMO code.
 * Props:
 *   code     {number} WMO weather interpretation code
 *   isDay    {boolean} whether it is currently daytime
 *   size     {string} Tailwind text-size class, e.g. "text-6xl"
 *   className {string} extra classes
 */
export default function WeatherIcon({ code, isDay = true, size = 'text-4xl', className = '' }) {
  const icon = resolveIcon(code, isDay)
  return (
    <span
      className={`${size} ${className} select-none`}
      role="img"
      aria-label={icon.label}
      title={icon.label}
    >
      {icon.emoji}
    </span>
  )
}

WeatherIcon.propTypes = {
  code: PropTypes.number.isRequired,
  isDay: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string,
}

function resolveIcon(code, isDay) {
  if (code === 0) return isDay ? { emoji: '☀️', label: 'Clear sky' } : { emoji: '🌙', label: 'Clear night' }
  if (code === 1) return isDay ? { emoji: '🌤️', label: 'Mainly clear' } : { emoji: '🌙', label: 'Mainly clear night' }
  if (code === 2) return { emoji: '⛅', label: 'Partly cloudy' }
  if (code === 3) return { emoji: '☁️', label: 'Overcast' }
  if (code === 45 || code === 48) return { emoji: '🌫️', label: 'Fog' }
  if (code >= 51 && code <= 55) return { emoji: '🌦️', label: 'Drizzle' }
  if (code >= 61 && code <= 65) return { emoji: '🌧️', label: 'Rain' }
  if (code >= 71 && code <= 77) return { emoji: '❄️', label: 'Snow' }
  if (code >= 80 && code <= 82) return { emoji: '🌦️', label: 'Showers' }
  if (code >= 85 && code <= 86) return { emoji: '🌨️', label: 'Snow showers' }
  if (code >= 95) return { emoji: '⛈️', label: 'Thunderstorm' }
  return { emoji: '🌡️', label: 'Unknown' }
}
