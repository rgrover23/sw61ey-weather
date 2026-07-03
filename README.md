# 🎡 London Events Dashboard — West London focus

**⚡ Open instantly in browser (no install):** [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/rgrover23/sw61ey-weather/tree/main)

**🌐 Live site (GitHub Pages):** <https://rgrover23.github.io/sw61ey-weather/>

An extremely interactive dashboard of **London events for the remainder of 2026** (today → 31 December), with a **heavy West London focus** and a deliberate hunt for **niche / hidden-gem events**. Built with React + Vite + Tailwind CSS.

## Features

- 🗓️ **Two views** — a month-grid **Calendar** (category dots per day, tap a day for its line-up) and a chronological **Agenda** grouped by month.
- 🧭 **West London focus** — one tap filters to Fulham, Hammersmith, Chelsea, Kensington, Notting Hill, Ealing, Chiswick, Richmond, Kew, Twickenham and more.
- ✦ **Hidden gems** — a dedicated flag surfaces quirky, small and unusual events, not just the obvious big ones.
- 🔎 **Powerful filters** — full-text search, category chips, area select, quick date ranges (this weekend / next 7 / next 31 days), plus Free / Saved toggles.
- ⭐ **Save & remind** — star any event; saved events persist in your browser.
- 🔔 **Reminders three ways:**
  - **Browser alerts** while the tab is open, at your chosen lead time (0–14 days).
  - **Email digests** — one tap opens a pre-filled email of your saved events (send to yourself or a friend). An optional serverless webhook (`VITE_EMAIL_WEBHOOK`) upgrades this to real scheduled email.
  - **Calendar export (.ics)** — add any event (or all saved events) to Apple / Google / Outlook Calendar, which then deliver native email + phone reminders.
- 🌤️ **Weather-aware** — outdoor events within the 16-day forecast window show a live weather hint (via the free Open-Meteo API), a nod to this project's weather-dashboard roots.
- 📊 **Headline stats** — events left in 2026, West London count, hidden gems, this weekend, free — each a one-tap filter.
- 🌙 **Dark mode**, fully responsive, no API key required.

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev/) | Component-based UI |
| [Vite](https://vite.dev/) | Fast dev server & build tool |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling |
| [Open-Meteo](https://open-meteo.com/) | Free weather API (no key) for event forecasts |

## Project Structure

```
src/
├── components/
│   ├── StatsBar.jsx       # Headline metric tiles (each a quick filter)
│   ├── Spotlight.jsx      # "Coming up next" horizontal strip
│   ├── FilterBar.jsx      # Search, categories, area, toggles, date ranges
│   ├── CalendarView.jsx   # Month grid with per-day category dots
│   ├── AgendaView.jsx     # Chronological list grouped by month
│   ├── EventCard.jsx      # Reusable event card with save action
│   ├── EventModal.jsx     # Detail view + all calendar/reminder/email actions
│   ├── RemindersPanel.jsx # Saved events + notification settings
│   ├── WeatherChip.jsx    # Per-event forecast hint
│   └── WeatherIcon.jsx    # WMO code → emoji icon
├── data/
│   ├── events.js          # Curated London events (Jul–Dec 2026)
│   └── taxonomy.js        # Categories (colour/emoji) + West London areas
├── hooks/
│   ├── useEventFilters.js # Filter state → derived event list
│   ├── useReminders.js    # Saved events + settings + browser notifications
│   └── useForecast.js     # 16-day West London forecast fetch
├── services/
│   ├── weatherApi.js      # Open-Meteo client + WMO code labels
│   └── forecast.js        # Daily forecast keyed by date
├── utils/
│   ├── dates.js           # Date parsing, month grid, relative labels
│   ├── ics.js             # .ics + Google Calendar generation
│   └── email.js           # mailto digests + optional webhook hook
├── App.jsx                # Root layout & orchestration
├── main.jsx               # React entry point
└── index.css              # Global styles (Tailwind)
```

## About the event data

Events are curated in `src/data/events.js`. Each event records its category, West London flag, "hidden gem" flag, venue, price, official URL and tags. Dates marked **`~ approx`** are the *typical annual slot* for a recurring event (e.g. Notting Hill Carnival on the August bank holiday) rather than a confirmed 2026 date — always confirm on the official listing before travelling. Adding or editing events is just a matter of appending objects to that array.

### Optional: real scheduled emails

The email digest works out-of-the-box via `mailto:`. To send *scheduled* reminder emails without opening a mail client, point the app at a serverless endpoint (Cloudflare Worker + Resend/SendGrid, EmailJS, etc.):

```bash
# .env
VITE_EMAIL_WEBHOOK=https://your-worker.example.com/send-digest
```

The dashboard POSTs `{ to, leadDays, events[] }` to that endpoint; wiring the actual send is left to your provider.

## Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/) v18+

```bash
npm install     # install dependencies
npm run dev     # start dev server → http://localhost:5173
npm run build   # production build to dist/
npm run preview # preview the production build
npm run lint    # lint
```

## Accessing the Dashboard

### Option 1 — StackBlitz (instant, no install)

**<https://stackblitz.com/github/rgrover23/sw61ey-weather/tree/main>**

### Option 2 — GitHub Pages (permanent public URL)

A GitHub Actions workflow builds and deploys to Pages on every push to `main`. One-time setup: **[Settings → Pages](https://github.com/rgrover23/sw61ey-weather/settings/pages)** → Source → **GitHub Actions**. Live at **<https://rgrover23.github.io/sw61ey-weather/>**.

### Option 3 — Run locally

See [Getting Started](#getting-started).

## Extending

- **Add events** — append to `src/data/events.js`.
- **New category** — add it to `CATEGORIES` in `src/data/taxonomy.js` (colour + emoji) and use it on events.
- **Live event feeds** — replace the static array with a fetch from Eventbrite / Skiddle / a council API in a new service, keeping the same event shape.
- **Real email delivery** — set `VITE_EMAIL_WEBHOOK` (see above).
