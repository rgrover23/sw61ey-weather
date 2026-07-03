import { useState, useEffect } from 'react'
import { fetchForecastMap } from '../services/forecast'

/**
 * Fetches the 16-day West London forecast once on mount so events in that
 * window can show a weather hint. Fails silently — weather is a nice-to-have.
 */
export function useForecast() {
  const [map, setMap] = useState({})

  useEffect(() => {
    let cancelled = false
    fetchForecastMap(16)
      .then((m) => { if (!cancelled) setMap(m) })
      .catch(() => { /* weather is optional; ignore errors */ })
    return () => { cancelled = true }
  }, [])

  return map
}
