import { Link, Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <div className='min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100'>
      <nav className='border-b bg-white dark:bg-gray-950'>
        <div className='mx-auto max-w-5xl p-4 flex items-center justify-between'>
          <Link to='/' className='text-xl font-semibold'>
            <h1 className='text-3xl'>City Info</h1>
          </Link>
          <div className='flex gap-4 text-sm'>
            <Link to='/' className='text-lg hover:underline'>
              Home
            </Link>
            <Link to='/settings' className='text-lg hover:underline'>
              Settings
            </Link>
          </div>
        </div>
      </nav>
      <main className='mx-auto max-w-5xl p-4'>
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
