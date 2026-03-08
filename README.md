# SW6 1EY Weather Dashboard

**🌐 Live site: <https://rgrover23.github.io/sw61ey-weather/>**

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

### Prerequisites

- [Node.js](https://nodejs.org/) **v18 or later** (includes `npm`)

### Run locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

3. **Open the dashboard** — navigate to **<http://localhost:5173>** in your browser.

   The page hot-reloads automatically when you save a file.

## Accessing the Dashboard

| Mode | How | URL |
|------|-----|-----|
| **Live (GitHub Pages)** | No setup needed | **<https://rgrover23.github.io/sw61ey-weather/>** |
| Development | `npm run dev` | <http://localhost:5173> |
| Production preview | `npm run build && npm run preview` | <http://localhost:4173> |

> **No API key is needed.** Weather data is fetched directly from the free [Open-Meteo API](https://open-meteo.com/) when the page loads.

## Build for Production

```bash
npm run build      # outputs optimised files to dist/
npm run preview    # serves the dist/ folder locally to verify the build
```

Deploy the contents of the `dist/` folder to any static hosting service (GitHub Pages, Vercel, Netlify, etc.).

## Extending

The codebase is structured for easy extension:

- **Location search** — replace the hardcoded coordinates in `src/services/weatherApi.js`
- **Weather maps** — add a `WeatherMap.jsx` component
- **Alerts** — add alert fields to the API call and a new `Alerts.jsx` component
- **Historical data** — use Open-Meteo's historical API endpoint
- **User preferences** — store settings in `localStorage` and expose via React context

