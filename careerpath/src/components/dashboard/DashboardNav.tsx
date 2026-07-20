import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function DashboardNav() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const isFr = i18n.language === 'fr';
  const pathname = location.pathname;

  const tabs = [
    { key: 'dashboard', to: '/dashboard', active: pathname === '/dashboard' },
    { key: 'careerPaths', to: '/catalog', active: pathname === '/catalog' },
    { key: 'opportunities', to: '/opportunities', active: pathname === '/opportunities' },
    { key: 'myCertificates', to: '/certificates', active: pathname === '/certificates' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xl font-bold tracking-tight text-primary">Fixam</span>
            <span className="text-base font-medium text-gray-800">Pathways</span>
          </Link>

          {/* Center: Tabs */}
          <div className="hidden md:flex items-center gap-8">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                to={tab.to}
                className={`text-sm py-4 border-b-2 transition-colors duration-200 ${
                  tab.active
                    ? 'font-bold text-gray-800 border-primary'
                    : 'font-normal text-gray-500 border-transparent hover:text-gray-800'
                }`}
              >
                {t(`dashboard.nav.${tab.key}`)}
              </Link>
            ))}
          </div>

          {/* Right: Lang + Avatar */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => i18n.changeLanguage(isFr ? 'en' : 'fr')}
              className="text-xs font-medium text-gray-500 hover:text-gray-800 px-2 py-1"
            >
              {isFr ? 'EN' : 'FR'}
            </button>

            <div className="flex items-center gap-1.5 cursor-pointer" onClick={logout}>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {user?.initials}
                </div>
                {user?.hasNotification && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white" />
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
