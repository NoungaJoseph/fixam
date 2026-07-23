import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { careerpathApi } from '../services/api';
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

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await careerpathApi.getUserDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;
  if (loading) return <div className="p-8 text-center text-gray-500">Loading your dashboard...</div>;

  return (
    <>
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Greeting />
        <RecommendedCards recommended={dashboardData?.recommended || []} />

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-5 gap-8 pb-16">
          {/* Left column (wider) */}
          <div className="lg:col-span-3">
            <ActivePaths activePaths={dashboardData?.activePaths || []} />
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
