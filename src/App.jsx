import CurrentWeather from './components/CurrentWeather'
import Forecast from './components/Forecast'
import { useWeather } from './hooks/useWeather'

export default function App() {
  const { data, loading, error, lastUpdated, refresh } = useWeather()

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">🌦️ Weather Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">SW6 1EY · London, UK</p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            aria-label="Refresh weather"
            className="p-2 rounded-full bg-white dark:bg-gray-700 shadow hover:shadow-md transition-all disabled:opacity-50"
            title="Refresh"
          >
            <svg
              className={`w-5 h-5 text-blue-600 dark:text-blue-400 ${loading ? 'animate-spin' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582M20 20v-5h-.581M5.635 19A9 9 0 104.582 9H4"
              />
            </svg>
          </button>
        </header>

        {/* Loading skeleton */}
        {loading && !data && (
          <div className="space-y-4 animate-pulse">
            <div className="h-56 bg-blue-300 rounded-2xl opacity-50" />
            <div className="h-64 bg-white rounded-2xl opacity-50" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-700 dark:text-red-300">Failed to load weather</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
                <button
                  onClick={refresh}
                  className="mt-3 text-sm text-red-700 dark:text-red-300 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Weather content */}
        {data && (
          <>
            <CurrentWeather
              current={data.current}
              location={data.location}
              lastUpdated={lastUpdated}
            />
            <Forecast daily={data.daily} hourly={data.hourly} />
          </>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 dark:text-gray-600 py-2">
          Weather data from{' '}
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            Open-Meteo
          </a>
          . Auto-refreshes every 10 minutes.
        </footer>
      </div>
    </div>
  )
}
