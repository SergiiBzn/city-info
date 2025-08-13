import { Link, Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <div className='min-h-screen bg-gray-50 text-gray-900'>
      <nav className='border-b bg-white'>
        <div className='mx-auto max-w-5xl p-4 flex items-center justify-between'>
          <Link to='/' className='text-xl font-semibold'>
            City Info
          </Link>
          <div className='flex gap-4 text-sm'>
            <Link to='/' className='hover:underline'>
              Home
            </Link>
            <Link to='/settings' className='hover:underline'>
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
