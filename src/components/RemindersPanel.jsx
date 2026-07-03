import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { formatShort, relativeLabel } from '../utils/dates'
import { downloadIcs } from '../utils/ics'
import { emailDigest, isWebhookConfigured, sendDigestViaWebhook } from '../utils/email'

/**
 * Slide-over panel: notification settings + the user's saved events, with
 * one-click email digest and calendar export (which carries reminders).
 */
export default function RemindersPanel({
  open, onClose, savedEvents, settings, updateSettings,
  requestBrowserPermission, onOpenEvent, onToggleSave, clearSaved,
}) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const upcoming = [...savedEvents].sort((a, b) => a.dateStart.localeCompare(b.dateStart))

  const handleEmailDigest = async () => {
    if (upcoming.length === 0) return
    if (isWebhookConfigured() && settings.email) {
      const res = await sendDigestViaWebhook(upcoming, { to: settings.email, leadDays: settings.leadDays })
      if (res.ok) {
        window.alert(`Digest scheduled to ${settings.email}.`)
        return
      }
    }
    emailDigest(upcoming, { to: settings.email })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[26rem] bg-gray-50 dark:bg-gray-900 shadow-2xl transform transition-transform overflow-y-auto ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Reminders and notifications"
      >
        <div className="sticky top-0 bg-indigo-600 text-white px-5 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">⭐ My reminders</h2>
          <button onClick={onClose} aria-label="Close" className="text-2xl leading-none">×</button>
        </div>

        <div className="p-5 space-y-6">
          {/* Notification settings */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4 border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white">🔔 Notification settings</h3>

            <label className="block">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Email for digests</span>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => updateSettings({ email: e.target.value })}
                placeholder="you@example.com"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Remind me this many days ahead</span>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range" min="0" max="14"
                  value={settings.leadDays}
                  onChange={(e) => updateSettings({ leadDays: Number(e.target.value) })}
                  className="flex-1 accent-indigo-600"
                />
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 w-16 text-right">
                  {settings.leadDays} day{settings.leadDays === 1 ? '' : 's'}
                </span>
              </div>
            </label>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Browser reminders</span>
              <button
                onClick={requestBrowserPermission}
                className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
                  settings.browserNotifications
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {settings.browserNotifications ? '✓ On' : 'Enable'}
              </button>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              Reminders are delivered three ways: <strong>browser alerts</strong> while this tab is open,
              a one-tap <strong>email digest</strong>, and — most reliably — by
              <strong> exporting to your calendar</strong> (Apple / Google / Outlook then send their own
              email &amp; phone alerts at your chosen lead time).
              {isWebhookConfigured() && ' A scheduled-email backend is connected.'}
            </p>
          </section>

          {/* Digest actions */}
          <section className="grid grid-cols-1 gap-2">
            <button
              onClick={handleEmailDigest}
              disabled={upcoming.length === 0}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
            >
              ✉️ Email me my {upcoming.length} saved event{upcoming.length === 1 ? '' : 's'}
            </button>
            <button
              onClick={() => downloadIcs(upcoming, { leadDays: settings.leadDays, name: 'My London Events', filename: 'my-london-events.ics' })}
              disabled={upcoming.length === 0}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
            >
              📅 Export all to calendar (.ics)
            </button>
          </section>

          {/* Saved list */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 dark:text-white">Saved events</h3>
              {upcoming.length > 0 && (
                <button onClick={clearSaved} className="text-xs text-gray-400 hover:text-red-500">Clear all</button>
              )}
            </div>

            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-dashed border-gray-200 dark:border-gray-700">
                Tap the ⭐ on any event to save it here and get reminders.
              </p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((e) => (
                  <li key={e.id} className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
                    <button onClick={() => onOpenEvent(e)} className="text-left min-w-0">
                      <p className="font-medium text-gray-800 dark:text-white truncate">{e.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatShort(e.dateStart)} · {relativeLabel(e.dateStart)}
                      </p>
                    </button>
                    <button
                      onClick={() => onToggleSave(e)}
                      aria-label="Remove"
                      className="shrink-0 text-yellow-500 hover:text-red-500 p-1"
                    >
                      ★
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </aside>
    </>
  )
}

RemindersPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  savedEvents: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  updateSettings: PropTypes.func.isRequired,
  requestBrowserPermission: PropTypes.func.isRequired,
  onOpenEvent: PropTypes.func.isRequired,
  onToggleSave: PropTypes.func.isRequired,
  clearSaved: PropTypes.func.isRequired,
}
