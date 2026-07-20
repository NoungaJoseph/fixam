import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNav from '../components/dashboard/DashboardNav';
import Greeting from '../components/dashboard/Greeting';
import RecommendedCards from '../components/dashboard/RecommendedCards';
import ActivePaths from '../components/dashboard/ActivePaths';
import Achievements from '../components/dashboard/Achievements';
import Opportunities from '../components/dashboard/Opportunities';
import Footer from '../components/Footer';

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return (
    <>
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Greeting />
        <RecommendedCards />

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-5 gap-8 pb-16">
          {/* Left column (wider) */}
          <div className="lg:col-span-3">
            <ActivePaths />
          </div>

          {/* Right column */}
          <div className="lg:col-span-2">
            <Achievements />
            <Opportunities />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
