import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const isFr = i18n.language === 'fr';

  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-800">
      {/* Top Header */}
      <header className="border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xl font-bold tracking-tight text-primary">Fixam</span>
          <span className="text-base font-medium text-gray-800">Pathways</span>
        </a>

        {/* Links matching image 3 ( educators, enterprise, students ) */}
        <div className="flex items-center gap-6 text-sm font-semibold text-gray-650">
          <a href="#" className="hidden sm:inline hover:text-primary transition-colors">
            For Educators
          </a>
          <a href="#" className="hidden sm:inline hover:text-primary transition-colors">
            For Enterprise
          </a>
          <a href="#" className="border-b-2 border-primary pb-1 text-primary">
            For Students
          </a>

          <button
            onClick={() => i18n.changeLanguage(isFr ? 'en' : 'fr')}
            className="text-xs font-medium text-gray-500 hover:text-gray-800 ml-2"
          >
            {isFr ? 'EN' : 'FR'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 lg:py-20 w-full grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Illustration */}
        <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
          <div className="relative">
            {/* Soft background shape */}
            <div className="absolute inset-0 bg-primary-soft opacity-30 transform -skew-x-6 rounded-3xl scale-110" />
            <svg width="280" height="280" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
              <rect x="30" y="80" width="140" height="90" rx="8" stroke="#14B8A6" strokeWidth="2.5" fill="white" />
              <line x1="30" y1="95" x2="170" y2="95" stroke="#14B8A6" strokeWidth="1.5" />
              {/* Laptop screen representation */}
              <rect x="70" y="110" width="60" height="40" rx="3" stroke="#F97316" strokeWidth="2" fill="white" />
              <path d="M60 160h80" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
              {/* Person sitting */}
              <circle cx="100" cy="50" r="14" stroke="#14B8A6" strokeWidth="2.5" />
              <path d="M76 90c0-12 10-22 24-22s24 10 24 22v15H76V90z" fill="#14B8A6" fillOpacity="0.1" stroke="#14B8A6" strokeWidth="2" />
              <path d="M110 82c5 2 12 7 15 12" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
              <circle cx="25" cy="50" r="4" fill="#14B8A6" />
              <circle cx="175" cy="140" r="5" fill="#F97316" />
            </svg>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-lg mx-auto shadow-sm">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>{t('auth.signin.googleBtn')}</span>
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <span className="relative bg-white px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                {t('auth.signin.or')}
              </span>
            </div>

            <h2 className="text-sm font-bold text-gray-450 uppercase tracking-wider text-center mb-6">
              {t('auth.signin.title')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {t('auth.signin.emailLabel')}
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all bg-gray-50/30"
                />
              </div>

              {/* SSO / Sign-in link options */}
              <div className="flex justify-between text-xs font-semibold text-primary">
                <a href="#" className="hover:underline">
                  {t('auth.signin.sso')}
                </a>
                <a href="#" className="hover:underline">
                  {t('auth.signin.link')}
                </a>
              </div>

              <button
                type="submit"
                disabled={!email}
                className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 text-white border border-transparent font-semibold py-3 px-6 rounded-lg text-sm transition-all duration-200"
              >
                {t('auth.signin.signInBtn')}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-150 pt-5">
              {t('auth.signin.noAccount')}{' '}
              <a href="/signup" className="font-semibold text-primary underline underline-offset-2">
                {t('auth.signin.signUp')}
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
