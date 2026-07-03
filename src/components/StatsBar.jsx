import PropTypes from 'prop-types'

/**
 * Headline metrics row. Numbers are derived from the currently-in-scope
 * (upcoming) event set so they always reflect "the rest of the year".
 */
export default function StatsBar({ stats, onQuick }) {
  const items = [
    { key: 'total', label: 'Events left in 2026', value: stats.total, icon: '🎟️', onClick: null },
    { key: 'west', label: 'West London', value: stats.west, icon: '🧭', onClick: () => onQuick({ westOnly: true }) },
    { key: 'niche', label: 'Hidden gems', value: stats.niche, icon: '✦', onClick: () => onQuick({ nicheOnly: true }) },
    { key: 'weekend', label: 'This weekend', value: stats.weekend, icon: '📆', onClick: () => onQuick({ when: 'weekend' }) },
    { key: 'free', label: 'Free', value: stats.free, icon: '💷', onClick: () => onQuick({ freeOnly: true }) },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
      {items.map((it) => {
        const Tag = it.onClick ? 'button' : 'div'
        return (
          <Tag
            key={it.key}
            onClick={it.onClick || undefined}
            className={`text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 ${
              it.onClick ? 'hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer' : ''
            }`}
          >
            <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <span className="text-lg" aria-hidden>{it.icon}</span>{it.value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{it.label}</div>
          </Tag>
        )
      })}
    </div>
  )
}

StatsBar.propTypes = {
  stats: PropTypes.object.isRequired,
  onQuick: PropTypes.func.isRequired,
}
