import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import DashboardNav from '../components/dashboard/DashboardNav';
import Footer from '../components/Footer';
import {
  Zap, Droplets, Hammer, Sparkles, Scissors, Paintbrush,
  Clock, Download, Share2, CheckCircle
} from 'lucide-react';

type CertificateItem = {
  id: string;
  categoryKey: string;
  titleKey: string;
  icon: any;
  date: string;
  image: string;
};

type AvailableItem = {
  id: string;
  categoryKey: string;
  titleKey: string;
  icon: any;
  hours: number;
};

export default function CertificatesPage() {
  const { t } = useTranslation();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Alert/Notification State for actions
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const triggerAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => {
      setAlertMsg(null);
    }, 3000);
  };

  // Mock Earned Certificates Data
  const earned: CertificateItem[] = [
    { id: '1', categoryKey: 'cleaning', titleKey: 'trades.cleaning', icon: Sparkles, date: 'Jul 18, 2026', image: '/images/cleaning.jpg' },
    { id: '2', categoryKey: 'painting', titleKey: 'trades.painting', icon: Paintbrush, date: 'Jul 20, 2026', image: '/images/painting.jpg' }
  ];

  // Mock Available Certificates Data
  const available: AvailableItem[] = [
    { id: '3', categoryKey: 'electrical', titleKey: 'dashboard.recommended.card1.title', icon: Zap, hours: 6 },
    { id: '4', categoryKey: 'plumbing', titleKey: 'dashboard.recommended.card2.title', icon: Droplets, hours: 5 },
    { id: '5', categoryKey: 'carpentry', titleKey: 'trades.carpentry', icon: Hammer, hours: 7 },
    { id: '6', categoryKey: 'beauty', titleKey: 'trades.beauty', icon: Scissors, hours: 4 }
  ];

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-800">
      <DashboardNav />

      {/* Alert Banner */}
      {alertMsg && (
        <div className="fixed bottom-5 right-5 bg-gray-900 text-white text-xs font-semibold py-3 px-5 rounded-lg shadow-lg z-50 flex items-center gap-2 border border-gray-700 animate-slide-in">
          <CheckCircle className="w-4 h-4 text-primary" />
          <span>{alertMsg}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-850 tracking-tight">
            {t('certificates.title')}
          </h1>
          <p className="mt-2 text-base text-gray-500 max-w-3xl leading-relaxed">
            {t('certificates.subtitle')}
          </p>
        </div>

        {/* SECTION 1: Earned Certificates */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🏆</span>
            {t('certificates.earnedTitle')}
          </h2>

          {earned.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {earned.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-250 rounded-lg overflow-hidden flex flex-col"
                  >
                    {/* Miniature Certificate Border Box */}
                    <div className="p-6 bg-slate-50 border-b border-gray-200 flex-1 flex flex-col items-center text-center relative overflow-hidden">
                      {/* Ribbon background design element */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full flex items-center justify-center text-primary">
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Header */}
                      <span className="text-[9px] font-bold tracking-widest text-primary uppercase mb-2">
                        {t('certificates.verifyBadge')}
                      </span>

                      {/* Main Title */}
                      <h3 className="text-sm font-bold text-gray-850 uppercase tracking-wide border-b border-gray-200 pb-1 mb-4 w-max px-6">
                        Certificate of Completion
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-4">
                        This is to certify that <strong className="text-gray-800 font-bold">{user?.firstName || 'Nounga'}</strong> has successfully completed all tasks and diagnostic requirements for the
                        <strong className="text-gray-800 font-bold block mt-1">{t(item.titleKey)}</strong> Career Path.
                      </p>

                      {/* Footer signatures */}
                      <div className="flex justify-between w-full max-w-xs text-[9px] text-gray-400 mt-2 border-t border-gray-150 pt-2">
                        <span>Fixam Academy</span>
                        <span>{t('certificates.dateCompleted', { date: item.date })}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
                      <button
                        onClick={() => triggerAlert("Downloading PDF Certificate...")}
                        className="flex-1 border border-gray-250 hover:border-primary text-gray-700 hover:text-primary text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors bg-white"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t('certificates.download')}</span>
                      </button>
                      <button
                        onClick={() => triggerAlert("Certificate successfully added to your Fixam Profile!")}
                        className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{t('certificates.share')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500 font-medium">{t('certificates.noCertificates')}</p>
            </div>
          )}
        </div>

        {/* SECTION 2: Available Certificates */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>📚</span>
            {t('certificates.availableTitle')}
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            {t('certificates.availableSub')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {available.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-250 rounded-lg p-5 flex flex-col justify-between hover:border-primary transition-all duration-200"
                >
                  <div>
                    {/* Category tag row */}
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {t(`trades.${item.categoryKey}`)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-800 leading-snug mb-3">
                      {t(item.titleKey)}
                    </h3>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.hours}h
                    </span>
                    <Link
                      to={`/career-paths/${item.categoryKey}`}
                      className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-0.5"
                    >
                      <span>{t('certificates.startPath')}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
