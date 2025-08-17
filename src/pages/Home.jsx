import { Link } from 'react-router-dom';
import { CITIES } from '../data/cities';

export default function Home() {
  return (
    <div className='space-y-6'>
      <header className='space-y-1'>
        <h2 className='text-2xl font-semibold'>Popular Cities</h2>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          Choose a city to view the current weather and forecast.
        </p>
      </header>

      <ul className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 items-stretch'>
        {CITIES.map((c) => (
          <li key={c.id} className='h-full'>
            <Link
              to={`/city/${c.id}`}
              className='card block h-full min-h-40 focus:outline-none
                         focus:ring-2 focus:ring-offset-2
                         focus:ring-gray-800 dark:focus:ring-gray-300
                         focus:ring-offset-white dark:focus:ring-offset-gray-900'
            >
              <div className='flex h-full flex-col justify-between gap-3'>
                <div>
                  <h3 className='card-title'>
                    {c.name}
                    <span className='ml-2 text-sm font-normal text-gray-500 dark:text-gray-400'>
                      {c.countryCode}
                    </span>
                  </h3>
                  <p className='card-subtitle mt-1'>
                    latitude {c.lat}, longitude {c.lon}
                  </p>
                  <p className='card-meta mt-1'>{c.timezone}</p>
                </div>
                <div className='flex items-center justify-end'>
                  <span
                    className='inline-flex h-8 min-w-8 items-center justify-center
                               rounded-md border px-2 text-xs
                               text-gray-600 dark:text-gray-300
                               border-gray-200 dark:border-gray-800'
                  >
                    Details
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
