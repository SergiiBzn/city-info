# City Weather

A fast, minimal weather app built with **React + Vite** and **Tailwind CSS v4**.  
It shows current weather and a multi-day forecast for a set of preset cities.  
User preferences (theme, temperature units, forecast days) are persisted in `localStorage`.

## ✨ Features

- **Cities list** with clean, accessible cards (light/dark ready)
- **City page**: current conditions + forecast for N days
- **Settings page**:
  - Theme: Light / Dark / System
  - Temperature units: °C / °F
  - Forecast days: 1–7
- **No-flash dark mode**: theme applied **before** React mount (script in `index.html`)
- **Tailwind v4** dark mode via `@custom-variant` and class on `<html>`
- **React Router** for pages and navigation
- **Responsive** layout

## 🧰 Tech Stack

- React 18, React Router
- Vite
- Tailwind CSS v4
- Weather API (returns both `*_c` and `*_f`)

