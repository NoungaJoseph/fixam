import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CatalogPage from './pages/CatalogPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import DetailPage from './pages/DetailPage';
import CertificatesPage from './pages/CertificatesPage';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased font-sans">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/career-paths/:categoryKey" element={<DetailPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
      </Routes>
    </div>
  );
}

export default App;
