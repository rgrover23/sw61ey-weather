/**
 * Lightweight daily forecast fetch for the events dashboard.
 *
 * Reuses the free Open-Meteo API (no key) centred on West London so that
 * outdoor events within the forecast window can show a weather hint.
 */

import { WMO_CODES } from './weatherApi'

// Centred on West London (roughly Hammersmith) so forecasts suit the focus area.
const LATITUDE = 51.492
const LONGITUDE = -0.223
const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

/**
 * Fetch up to 16 days of daily forecast, returned as a map keyed by
 * "YYYY-MM-DD" so events can be annotated by date.
 * @returns {Promise<Record<string, {code:number, description:string, tempMax:number, tempMin:number, precipProb:number}>>}
 */
export async function fetchForecastMap(days = 16) {
  const params = new URLSearchParams({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
    ].join(','),
    timezone: 'Europe/London',
    forecast_days: Math.min(16, Math.max(1, days)),
  })

  const res = await fetch(`${BASE_URL}?${params}`)
  if (!res.ok) throw new Error(`Forecast API error: ${res.status}`)
  const data = await res.json()

  const map = {}
  data.daily.time.forEach((date, i) => {
    map[date] = {
      code: data.daily.weather_code[i],
      description: WMO_CODES[data.daily.weather_code[i]] ?? 'Unknown',
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      precipProb: data.daily.precipitation_probability_max?.[i] ?? null,
    }
  })
  return map
}
