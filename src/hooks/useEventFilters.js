import { useState, useMemo, useCallback } from 'react'
import { parseDate, startOfToday, isThisWeekend, isWithinDays } from '../utils/dates'

const DEFAULT_FILTERS = {
  search: '',
  categories: [], // empty = all
  area: 'all',
  westOnly: false,
  nicheOnly: false,
  freeOnly: false,
  savedOnly: false,
  when: 'rest-of-year', // rest-of-year | weekend | week | month
}

/**
 * Derives the filtered event list from the master list + filter state.
 * `savedIds` is passed in so the "saved only" filter can be applied.
 */
export function useEventFilters(events, savedIds = []) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const setFilter = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  const toggleCategory = useCallback((cat) => {
    setFilters((prev) => {
      const has = prev.categories.includes(cat)
      return {
        ...prev,
        categories: has
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      }
    })
  }, [])

  const reset = useCallback(() => setFilters(DEFAULT_FILTERS), [])

  const savedSet = useMemo(() => new Set(savedIds), [savedIds])

  const filtered = useMemo(() => {
    const today = startOfToday()
    const q = filters.search.trim().toLowerCase()

    return events.filter((e) => {
      // Only show events from today onward (rest of the year).
      const end = e.dateEnd ? parseDate(e.dateEnd) : parseDate(e.dateStart)
      if (end && end < today) return false

      if (filters.westOnly && !e.west) return false
      if (filters.nicheOnly && !e.niche) return false
      if (filters.freeOnly && !/free/i.test(e.price || '')) return false
      if (filters.savedOnly && !savedSet.has(e.id)) return false
      if (filters.area !== 'all' && e.area !== filters.area) return false
      if (filters.categories.length && !filters.categories.includes(e.category)) return false

      if (filters.when === 'weekend' && !isThisWeekend(e.dateStart)) return false
      if (filters.when === 'week' && !isWithinDays(e.dateStart, 7)) return false
      if (filters.when === 'month' && !isWithinDays(e.dateStart, 31)) return false

      if (q) {
        const haystack = [
          e.title, e.description, e.venue, e.area, e.category,
          ...(e.tags || []),
        ].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [events, filters, savedSet])

  const activeCount = useMemo(() => {
    let n = 0
    if (filters.search.trim()) n++
    if (filters.categories.length) n += filters.categories.length
    if (filters.area !== 'all') n++
    if (filters.westOnly) n++
    if (filters.nicheOnly) n++
    if (filters.freeOnly) n++
    if (filters.savedOnly) n++
    if (filters.when !== 'rest-of-year') n++
    return n
  }, [filters])

  return { filters, setFilter, toggleCategory, reset, filtered, activeCount }
}
