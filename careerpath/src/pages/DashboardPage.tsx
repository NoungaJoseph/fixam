import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNav from '../components/dashboard/DashboardNav';
import Greeting from '../components/dashboard/Greeting';
import RecommendedCards from '../components/dashboard/RecommendedCards';
import ActivePaths from '../components/dashboard/ActivePaths';
import Achievements from '../components/dashboard/Achievements';
import Opportunities from '../components/dashboard/Opportunities';
import SavedPrograms from '../components/dashboard/SavedPrograms';
import Footer from '../components/Footer';

export default function DashboardPage() {
  const { isLoggedIn, dashboardData, dashboardLoading, refreshDashboard } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    refreshDashboard(true); // Silent background refresh
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Verifying your session...</p>
      </div>
    </div>
  );

  if (dashboardLoading && !dashboardData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <>
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Greeting />
        <RecommendedCards recommended={dashboardData?.recommended || []} />

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-5 gap-8 pb-8">
          {/* Left column (wider) */}
          <div className="lg:col-span-3">
            <ActivePaths activePaths={dashboardData?.activePaths || []} />
            
            {/* Saved Programs (Moved under Active Paths) */}
            <div className="mt-8">
              <SavedPrograms savedPrograms={dashboardData?.savedPrograms || []} />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2">
            <Achievements achievements={dashboardData?.achievements || []} />
            <Opportunities />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
