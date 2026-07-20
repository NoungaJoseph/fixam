import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CatalogPage from './pages/CatalogPage';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased font-sans">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
      </Routes>
    </div>
  );
}

export default App;
