const BASE = 'https://api.weatherapi.com/v1';
const KEY = import.meta.env.VITE_WEATHER_API_KEY;

function ensureKey() {
  if (!KEY)
    throw new Error(
      'VITE_WEATHER_API_KEY отсутствует. Добавь его в .env и перезапусти dev-сервер.'
    );
}

async function request(path) {
  ensureKey();
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WeatherAPI ${res.status}: ${text}`);
  }
  return res.json();
}

export function getCurrentByCoords(lat, lon) {
  return request(`/current.json?key=${KEY}&q=${lat},${lon}&aqi=no`);
}

export function getForecastByCoords(lat, lon, days = 3) {
  return request(
    `/forecast.json?key=${KEY}&q=${lat},${lon}&days=${days}&aqi=no&alerts=no`
  );
}
