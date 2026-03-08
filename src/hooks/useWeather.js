import { useState, useEffect, useCallback } from 'react'
import { fetchWeather } from '../services/weatherApi'

const REFRESH_INTERVAL_MS = 10 * 60 * 1000 // 10 minutes

/**
 * Custom hook that fetches and manages weather data.
 * Automatically refreshes every 10 minutes.
 */
export function useWeather() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchWeather()
      setData(result)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message ?? 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [load])

  return { data, loading, error, lastUpdated, refresh: load }
}
