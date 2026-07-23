import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, UserCircle, Settings, Share2, LogOut } from 'lucide-react';

export default function DashboardNav() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const isFr = i18n.language === 'fr';
  const pathname = location.pathname;

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getProfileTier = (strength: number = 0) => {
    if (strength >= 80) return t('profileMenu.strengthMeter.tiers.excellent');
    if (strength >= 50) return t('profileMenu.strengthMeter.tiers.good');
    return t('profileMenu.strengthMeter.tiers.basic');
  };

  const getFilledBars = (strength: number = 0) => {
    if (strength >= 80) return 5;
    if (strength >= 60) return 4;
    if (strength >= 40) return 3;
    if (strength >= 20) return 2;
    return 1;
  };

  const filledBars = getFilledBars(user?.profileStrength);

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

            <div 
              className="relative" 
              ref={profileMenuRef}
              onMouseEnter={() => setIsProfileMenuOpen(true)}
              onMouseLeave={() => setIsProfileMenuOpen(false)}
            >
              <div 
                className="flex items-center gap-1.5 cursor-pointer" 
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    {user?.initials}
                  </div>
                  {user?.hasNotification && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white" />
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isProfileMenuOpen ? 'rotate-90' : ''}`} />
              </div>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 pt-2 z-50">
                  <div className="w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {/* Strength Meter Section */}
                    <div className="p-5 bg-gray-50 border-b border-gray-100">
                      <div className="flex gap-1.5 mb-3">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <div 
                            key={bar} 
                            className={`h-2 flex-1 rounded-full ${bar <= filledBars ? 'bg-primary' : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                      <p className="font-bold text-gray-900 text-sm mb-1">
                        {t('profileMenu.strengthMeter.title', { tier: getProfileTier(user?.profileStrength) })}
                      </p>
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                        {t('profileMenu.strengthMeter.description')}
                      </p>
                      <Link to="/opportunities" className="text-sm font-bold text-primary hover:text-primary-hover" onClick={() => setIsProfileMenuOpen(false)}>
                        {t('profileMenu.strengthMeter.explore')}
                      </Link>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <Link to="/profile" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                        <UserCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{t('profileMenu.menu.editProfile')}</span>
                      </Link>
                      <Link to="/settings" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                        <Settings className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{t('profileMenu.menu.accountSettings')}</span>
                      </Link>
                      <Link to="/referrals" onClick={() => setIsProfileMenuOpen(false)} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{t('profileMenu.menu.referFriend')}</span>
                      </Link>
                      <div className="my-1 border-t border-gray-100"></div>
                      <button 
                        onClick={() => { setIsProfileMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-colors group"
                      >
                        <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                        <span className="text-sm font-medium text-red-600 group-hover:text-red-700">{t('profileMenu.menu.signOut')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation (Horizontal Scrollable Sub-nav) */}
      <div className="flex md:hidden bg-slate-50 border-t border-gray-150 overflow-x-auto scrollbar-none">
        <div className="flex px-4 gap-6 w-full justify-between sm:justify-start">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              to={tab.to}
              className={`text-xs py-3.5 border-b-2 whitespace-nowrap transition-colors duration-200 ${
                tab.active
                  ? 'font-bold text-gray-800 border-primary'
                  : 'font-normal text-gray-500 border-transparent hover:text-gray-800'
              }`}
            >
              {t(`dashboard.nav.${tab.key}`)}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
