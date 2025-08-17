import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CITIES } from '../data/cities';
import { getCurrentByCoords, getForecastByCoords } from '../api/weatherApi';

const DAYS_KEY = 'weather:days';
const UNITS_KEY = 'weather:units';

function readDaysFromStorage() {
  const n = Number(localStorage.getItem(DAYS_KEY));
  return Number.isFinite(n) && n >= 1 && n <= 7 ? n : 3; // fallback
}

function readUnitsFromStorage() {
  const v = localStorage.getItem(UNITS_KEY);
  return v === 'f' ? 'f' : 'c'; // default: celsius
}

function City() {
  const { id } = useParams();
  const city = CITIES.find((c) => c.id === id);

  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [daysCount, setDaysCount] = useState(readDaysFromStorage);
  const [units, setUnits] = useState(readUnitsFromStorage);

  useEffect(() => {
    if (!city) return;
    let cancelled = false;

    (async () => {
      try {
        const [cur, fc] = await Promise.all([
          getCurrentByCoords(city.lat, city.lon),
          getForecastByCoords(city.lat, city.lon, daysCount),
        ]);
        if (!cancelled) {
          setCurrent(cur);
          setForecast(fc);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load weather');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [city, daysCount]);

  // re-sync days when returning/changed in another tab
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        setDaysCount(readDaysFromStorage());
      }
    };
    const onStorage = (e) => {
      if (e.key === DAYS_KEY) setDaysCount(readDaysFromStorage());
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('storage', onStorage);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // re-sync units when returning/changed
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        setUnits(readUnitsFromStorage());
      }
    };
    const onStorage = (e) => {
      if (e.key === UNITS_KEY) setUnits(readUnitsFromStorage());
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('storage', onStorage);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  if (!city) {
    return (
      <div className='p-4'>
        <p className='text-red-500'>City not found.</p>
        <Link to='/' className='underline'>
          Back
        </Link>
      </div>
    );
  }

  if (loading) return <div className='p-4'>Loading…</div>;
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>;

  const loc = current?.location;
  const cur = current?.current;
  const days = forecast?.forecast?.forecastday ?? [];

  // formatters based on selected units
  const fmtTemp = (c, f) =>
    units === 'c' ? `${Math.round(c)}°C` : `${Math.round(f)}°F`;
  const fmtWind = (kph, mph) => (units === 'c' ? `${kph} km/h` : `${mph} mph`);

  return (
    <div className='p-4 space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>
          {city.name}, {city.countryCode}
        </h2>
        <Link to='/' className='text-sm underline opacity-80 hover:opacity-100'>
          ← Back to list
        </Link>
      </div>

      {/* Current weather */}
      <section className='rounded-lg border bg-white dark:bg-gray-950 p-4 shadow-sm'>
        <div className='flex items-center gap-4'>
          {cur?.condition?.icon && (
            <img
              alt={cur?.condition?.text}
              src={cur?.condition?.icon}
              className='h-16 w-16'
            />
          )}
          <div>
            <div className='text-4xl font-bold'>
              {fmtTemp(cur?.temp_c, cur?.temp_f)}
            </div>
            <div className='opacity-80'>{cur?.condition?.text}</div>
            <div className='text-sm opacity-70'>
              Feels like {fmtTemp(cur?.feelslike_c, cur?.feelslike_f)} •
              Humidity {cur?.humidity}% • Wind{' '}
              {fmtWind(cur?.wind_kph, cur?.wind_mph)}
            </div>
            <div className='text-xs opacity-60 mt-1'>
              Local time: {loc?.localtime}
            </div>
          </div>
        </div>
      </section>

      {/* Forecast */}
      <section className='space-y-3'>
        <h3 className='text-lg font-semibold'>
          Forecast for {daysCount} days ({units === 'c' ? '°C' : '°F'})
        </h3>
        <ul className='grid gap-3 sm:grid-cols-2 md:grid-cols-3'>
          {days.map((d) => (
            <li
              key={d.date}
              className='rounded-lg border bg-white dark:bg-gray-950 p-4 shadow-sm'
            >
              <div className='flex items-center gap-3'>
                <img
                  alt={d.day?.condition?.text}
                  src={d.day?.condition?.icon}
                  className='h-10 w-10'
                />
                <div>
                  <div className='font-medium'>{d.date}</div>
                  <div className='text-sm opacity-80'>
                    {d.day?.condition?.text}
                  </div>
                </div>
              </div>
              <div className='mt-2 text-sm opacity-80'>
                Max: {fmtTemp(d.day?.maxtemp_c, d.day?.maxtemp_f)} • Min:{' '}
                {fmtTemp(d.day?.mintemp_c, d.day?.mintemp_f)}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default City;
