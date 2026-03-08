# SW6 1EY Weather Dashboard

A modern, responsive weather dashboard for **SW6 1EY, London, UK** built with React + Vite + Tailwind CSS.

## Features

- 🌡️ **Current conditions** — temperature, feels like, humidity, wind speed & direction
- 📅 **7-day daily forecast** with min/max temperatures
- ⏱️ **24-hour hourly forecast** with precipitation probability
- 🔄 **Auto-refresh** every 10 minutes (manual refresh button too)
- ⚠️ **Error handling** with retry support
- 📱 **Responsive design** — works on mobile, tablet & desktop
- ⚡ **No API key required** — uses the free [Open-Meteo API](https://open-meteo.com/)

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev/) | Component-based UI |
| [Vite](https://vite.dev/) | Fast dev server & build tool |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling |
| [Open-Meteo](https://open-meteo.com/) | Free weather API (no key needed) |

## Project Structure

```
src/
├── components/
│   ├── CurrentWeather.jsx   # Current conditions card
│   ├── Forecast.jsx         # Daily & hourly forecast tabs
│   └── WeatherIcon.jsx      # WMO code → emoji icon
├── services/
│   └── weatherApi.js        # Open-Meteo API client
├── hooks/
│   └── useWeather.js        # Data fetching hook with auto-refresh
├── App.jsx                  # Root component, layout & error handling
├── main.jsx                 # React entry point
└── index.css                # Global styles (Tailwind)
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Extending

The codebase is structured for easy extension:

- **Location search** — replace the hardcoded coordinates in `src/services/weatherApi.js`
- **Weather maps** — add a `WeatherMap.jsx` component
- **Alerts** — add alert fields to the API call and a new `Alerts.jsx` component
- **Historical data** — use Open-Meteo's historical API endpoint
- **User preferences** — store settings in `localStorage` and expose via React context

