import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import City from './pages/City.jsx';
import Settings from './pages/Settings.jsx';
import RootLayout from './layout/RootLayout.jsx';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='city/:id' element={<City />} />
        <Route path='settings' element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;
