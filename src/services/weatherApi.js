/**
 * Weather API service using Open-Meteo (free, no API key required).
 *
 * Coordinates for SW6 1EY, London, UK:
 *   Latitude:  51.4812
 *   Longitude: -0.1837
 */

const LATITUDE = 51.4812
const LONGITUDE = -0.1837
const LOCATION_NAME = 'SW6 1EY, London, UK'

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

/**
 * WMO Weather Interpretation Codes → human-readable labels.
 * https://open-meteo.com/en/docs#weathervariables
 */
export const WMO_CODES = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing Rime Fog',
  51: 'Light Drizzle',
  53: 'Moderate Drizzle',
  55: 'Dense Drizzle',
  61: 'Slight Rain',
  63: 'Moderate Rain',
  65: 'Heavy Rain',
  71: 'Slight Snow',
  73: 'Moderate Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Slight Showers',
  81: 'Moderate Showers',
  82: 'Violent Showers',
  85: 'Slight Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with Slight Hail',
  99: 'Thunderstorm with Heavy Hail',
}

/**
 * Fetch current weather and daily forecast from Open-Meteo.
 * @returns {Promise<{current: object, daily: object[], location: string}>}
 */
export async function fetchWeather() {
  const params = new URLSearchParams({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'precipitation',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'wind_speed_10m_max',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
    ].join(','),
    timezone: 'Europe/London',
    forecast_days: 7,
  })

  const response = await fetch(`${BASE_URL}?${params}`)

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  const current = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
    description: WMO_CODES[data.current.weather_code] ?? 'Unknown',
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: data.current.wind_direction_10m,
    precipitation: data.current.precipitation,
    isDay: data.current.is_day === 1,
    units: {
      temperature: data.current_units?.temperature_2m ?? '°C',
      windSpeed: data.current_units?.wind_speed_10m ?? 'km/h',
    },
  }

  const daily = data.daily.time.map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    description: WMO_CODES[data.daily.weather_code[i]] ?? 'Unknown',
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
    precipitationSum: data.daily.precipitation_sum[i],
    windSpeedMax: Math.round(data.daily.wind_speed_10m_max[i]),
  }))

  // Build 24-hour hourly forecast from current hour
  const now = new Date()
  const currentHour = now.getHours()
  const todayStr = now.toISOString().slice(0, 10)
  const startIndex = data.hourly.time.findIndex((t) => t.startsWith(todayStr) && parseInt(t.slice(11, 13)) >= currentHour)
  const hourlySlice = startIndex >= 0
    ? data.hourly.time.slice(startIndex, startIndex + 24)
    : data.hourly.time.slice(0, 24)
  const hourlyOffset = startIndex >= 0 ? startIndex : 0

  const hourly = hourlySlice.map((time, i) => ({
    time,
    temperature: Math.round(data.hourly.temperature_2m[hourlyOffset + i]),
    weatherCode: data.hourly.weather_code[hourlyOffset + i],
    description: WMO_CODES[data.hourly.weather_code[hourlyOffset + i]] ?? 'Unknown',
    precipitationProbability: data.hourly.precipitation_probability[hourlyOffset + i],
  }))

  return { current, daily, hourly, location: LOCATION_NAME }
}
