import PropTypes from 'prop-types'
import { CATEGORY_LIST, categoryMeta } from '../data/taxonomy'

const WHEN_OPTIONS = [
  { key: 'rest-of-year', label: 'Rest of year' },
  { key: 'weekend', label: 'This weekend' },
  { key: 'week', label: 'Next 7 days' },
  { key: 'month', label: 'Next 31 days' },
]

/**
 * The filter control surface: search, quick date ranges, category chips,
 * area select and toggle switches.
 */
export default function FilterBar({ filters, setFilter, toggleCategory, reset, areas, activeCount, resultCount }) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 space-y-3">
      {/* Search + reset */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            placeholder="Search events, venues, tags… (e.g. carnival, jazz, Kew)"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        {activeCount > 0 && (
          <button
            onClick={reset}
            className="px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 whitespace-nowrap"
          >
            Clear ({activeCount})
          </button>
        )}
      </div>

      {/* Quick when */}
      <div className="flex flex-wrap gap-2">
        {WHEN_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter({ when: opt.key })}
            className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
              filters.when === opt.key
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-2">
        <Toggle active={filters.westOnly} onClick={() => setFilter({ westOnly: !filters.westOnly })} activeClass="bg-indigo-600 text-white">
          🧭 West London only
        </Toggle>
        <Toggle active={filters.nicheOnly} onClick={() => setFilter({ nicheOnly: !filters.nicheOnly })} activeClass="bg-yellow-500 text-white">
          ✦ Hidden gems
        </Toggle>
        <Toggle active={filters.freeOnly} onClick={() => setFilter({ freeOnly: !filters.freeOnly })} activeClass="bg-emerald-600 text-white">
          🎟️ Free
        </Toggle>
        <Toggle active={filters.savedOnly} onClick={() => setFilter({ savedOnly: !filters.savedOnly })} activeClass="bg-rose-600 text-white">
          ⭐ Saved
        </Toggle>

        <select
          value={filters.area}
          onChange={(e) => setFilter({ area: e.target.value })}
          className="text-sm font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-none focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
        >
          <option value="all">All areas</option>
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_LIST.map((cat) => {
          const meta = categoryMeta(cat)
          const active = filters.categories.includes(cat)
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${
                active
                  ? `${meta.chip} border-transparent ring-2 ${meta.ring}`
                  : 'bg-transparent border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
              }`}
            >
              {meta.emoji} {cat}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">
        Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{resultCount}</span> event{resultCount === 1 ? '' : 's'}
      </p>
    </div>
  )
}

function Toggle({ active, onClick, activeClass, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
        active ? `${activeClass} shadow` : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      {children}
    </button>
  )
}

Toggle.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  activeClass: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

FilterBar.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  toggleCategory: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  areas: PropTypes.array.isRequired,
  activeCount: PropTypes.number.isRequired,
  resultCount: PropTypes.number.isRequired,
}
