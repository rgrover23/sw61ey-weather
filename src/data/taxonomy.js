/**
 * Shared taxonomy: categories (with colour + emoji) and West London areas.
 * Colours are chosen to read on both light and dark backgrounds.
 */

export const CATEGORIES = {
  'Music': { emoji: '🎵', dot: 'bg-rose-500', chip: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300', ring: 'ring-rose-400' },
  'Theatre & Comedy': { emoji: '🎭', dot: 'bg-purple-500', chip: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', ring: 'ring-purple-400' },
  'Art & Exhibitions': { emoji: '🎨', dot: 'bg-amber-500', chip: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', ring: 'ring-amber-400' },
  'Food & Drink': { emoji: '🍽️', dot: 'bg-orange-500', chip: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', ring: 'ring-orange-400' },
  'Markets': { emoji: '🛍️', dot: 'bg-lime-500', chip: 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300', ring: 'ring-lime-400' },
  'Festivals & Seasonal': { emoji: '🎪', dot: 'bg-pink-500', chip: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300', ring: 'ring-pink-400' },
  'Sport': { emoji: '🏟️', dot: 'bg-emerald-500', chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', ring: 'ring-emerald-400' },
  'Family & Kids': { emoji: '🧒', dot: 'bg-cyan-500', chip: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300', ring: 'ring-cyan-400' },
  'Film': { emoji: '🎬', dot: 'bg-indigo-500', chip: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', ring: 'ring-indigo-400' },
  'Nature & Outdoors': { emoji: '🌳', dot: 'bg-green-600', chip: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', ring: 'ring-green-400' },
  'Nightlife': { emoji: '🌃', dot: 'bg-fuchsia-500', chip: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300', ring: 'ring-fuchsia-400' },
  'Talks & Literature': { emoji: '📚', dot: 'bg-sky-500', chip: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300', ring: 'ring-sky-400' },
  'Community': { emoji: '🤝', dot: 'bg-teal-500', chip: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300', ring: 'ring-teal-400' },
  'Christmas': { emoji: '🎄', dot: 'bg-red-500', chip: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', ring: 'ring-red-400' },
}

export const CATEGORY_LIST = Object.keys(CATEGORIES)

export function categoryMeta(name) {
  return CATEGORIES[name] || { emoji: '📍', dot: 'bg-gray-400', chip: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', ring: 'ring-gray-400' }
}

/**
 * West London neighbourhoods this dashboard focuses on. Used to power the
 * "West London only" toggle and the area filter grouping.
 */
export const WEST_LONDON_AREAS = [
  'Fulham', 'Hammersmith', 'Chelsea', 'Kensington', 'Notting Hill',
  'Shepherd\'s Bush', 'Ealing', 'Chiswick', 'Acton', 'Richmond', 'Kew',
  'Twickenham', 'Brentford', 'Wandsworth', 'Putney', 'Barnes', 'Earls Court',
  'White City', 'Ladbroke Grove', 'Holland Park', 'Maida Vale', 'Wembley',
]

/** Categories that are typically outdoors — used for the weather overlay. */
export const OUTDOOR_CATEGORIES = new Set([
  'Nature & Outdoors', 'Markets', 'Festivals & Seasonal', 'Sport', 'Community',
])
