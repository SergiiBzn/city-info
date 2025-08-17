import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// LocalStorage keys
const THEME_KEY = 'app:theme'; // 'light' | 'dark' | 'system'
const UNITS_KEY = 'weather:units'; // 'c' | 'f'
const DAYS_KEY = 'weather:days'; // 1..7

function applyTheme(theme) {
  const root = document.documentElement; // <html>
  const isSystemDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effective =
    theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme;

  if (effective === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

function readInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  return 'system';
}

function readInitialUnits() {
  const saved = localStorage.getItem(UNITS_KEY);
  return saved === 'f' ? 'f' : 'c';
}

function readInitialDays() {
  const saved = Number(localStorage.getItem(DAYS_KEY));
  return Number.isFinite(saved) && saved >= 1 && saved <= 7 ? saved : 3;
}

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(readInitialTheme);
  const [units, setUnits] = useState(readInitialUnits);
  const [days, setDays] = useState(readInitialDays);

  // Apply theme and save all settings
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(UNITS_KEY, units);
  }, [units]);

  useEffect(() => {
    localStorage.setItem(DAYS_KEY, String(days));
  }, [days]);

  // For displaying the "effective" theme when using system setting
  const effectiveTheme = useMemo(() => {
    if (theme !== 'system') return theme;
    const isSystemDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isSystemDark ? 'dark' : 'light';
  }, [theme]);

  // Add alongside other effects
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      document.documentElement.classList.toggle('dark', mq.matches);
    };
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, [theme]);

  return (
    <div className='p-4 space-y-8'>
      <header className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Settings</h2>
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='text-sm underline opacity-80 hover:opacity-100'
          aria-label='Go back'
        >
          ← Back
        </button>
      </header>
      <p className='text-sm opacity-80 mt-1'>
        Adjust theme and weather settings. Changes are saved automatically.
      </p>

      {/* Theme */}
      <section className='rounded-lg border bg-white dark:bg-gray-950 p-4 shadow-sm'>
        <h3 className='text-lg font-semibold mb-3'>Theme</h3>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6'>
          <label className='inline-flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name='theme'
              value='light'
              checked={theme === 'light'}
              onChange={() => setTheme('light')}
              className='accent-current'
            />
            <span>Light</span>
          </label>
          <label className='inline-flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name='theme'
              value='dark'
              checked={theme === 'dark'}
              onChange={() => setTheme('dark')}
              className='accent-current'
            />
            <span>Dark</span>
          </label>
          <label className='inline-flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name='theme'
              value='system'
              checked={theme === 'system'}
              onChange={() => setTheme('system')}
              className='accent-current'
            />
            <span>System</span>
          </label>
        </div>
        <p className='mt-3 text-xs opacity-70'>
          Effective now:{' '}
          <span className='font-medium'>{effectiveTheme}</span>
        </p>
      </section>

      {/* Temperature units */}
      <section className='rounded-lg border bg-white dark:bg-gray-950 p-4 shadow-sm'>
        <h3 className='text-lg font-semibold mb-3'>Temperature Units</h3>
        <div className='flex gap-6'>
          <label className='inline-flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name='units'
              value='c'
              checked={units === 'c'}
              onChange={() => setUnits('c')}
              className='accent-current'
            />
            <span>°C (Celsius)</span>
          </label>
          <label className='inline-flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name='units'
              value='f'
              checked={units === 'f'}
              onChange={() => setUnits('f')}
              className='accent-current'
            />
            <span>°F (Fahrenheit)</span>
          </label>
        </div>
        <p className='mt-3 text-xs opacity-70'>
          LocalStorage key: <code>{UNITS_KEY}</code>
        </p>
      </section>

      {/* Forecast days */}
      <section className='rounded-lg border bg-white dark:bg-gray-950 p-4 shadow-sm'>
        <h3 className='text-lg font-semibold mb-3'>Forecast Days</h3>
        <div className='flex items-center gap-3'>
          <input
            type='range'
            min={1}
            max={7}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className='w-56'
          />
          <span className='text-sm opacity-80'>{days} days</span>
        </div>
        <p className='mt-3 text-xs opacity-70'>
          LocalStorage key: <code>{DAYS_KEY}</code>
        </p>
      </section>

    </div>
  );
}
