import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const { t, i18n } = useTranslation();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const isFr = i18n.language === 'fr';

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dob, setDob] = useState('');
  const [status, setStatus] = useState('');

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep(2);
    }
  };

  const handleFinishSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && password && dob && status) {
      signup(firstName, lastName, email);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-800">
      {/* Top Header */}
      <header className="border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-1.5">
          <span className="text-xl font-bold tracking-tight text-primary">Fixam</span>
          <span className="text-base font-medium text-gray-800">Pathways</span>
        </a>
        <div className="flex items-center gap-4">
          <button
            onClick={() => i18n.changeLanguage(isFr ? 'en' : 'fr')}
            className="text-xs font-medium text-gray-500 hover:text-gray-800"
          >
            {isFr ? 'EN' : 'FR'}
          </button>
          {step === 2 && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`w-2 h-2 rounded-full ${s === 2 ? 'bg-primary' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 lg:py-20 w-full grid lg:grid-cols-12 gap-12 items-center">
        {step === 1 ? (
          /* STEP 1 */
          <>
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-8">
              {/* Highlight Graphic shape */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary-soft opacity-30 transform -skew-y-3 rounded-3xl scale-110" />
                <h1 className="relative text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-850 tracking-tight leading-tight">
                  {t('auth.signup.leftTitle')}
                </h1>
              </div>

              <ul className="space-y-4">
                {[1, 2, 3].map((num) => (
                  <li key={num} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-base text-gray-650 font-normal">
                      {t(`auth.signup.bullet${num}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Card Form Column */}
            <div className="lg:col-span-6">
              <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-lg mx-auto shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center lg:text-left">
                  {t('auth.signup.rightTitle')}
                </h2>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
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
                  <span>{t('auth.signup.googleBtn')}</span>
                </button>

                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <span className="relative bg-white px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    {t('auth.signup.or')}
                  </span>
                </div>

                <form onSubmit={handleNextStep} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      {t('auth.signup.emailLabel')}
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

                  <div className="border-t border-gray-150 pt-5 flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">
                      {t('auth.signup.alreadyAccount')}{' '}
                      <a href="/login" className="font-semibold text-primary underline underline-offset-2">
                        {t('auth.signup.signIn')}
                      </a>
                    </span>
                    <button
                      type="submit"
                      disabled={!email}
                      className="bg-primary hover:bg-primary-hover disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 text-white border border-transparent font-semibold py-2.5 px-6 rounded-lg text-sm transition-all duration-200"
                    >
                      {t('auth.signup.createBtn')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          /* STEP 2 */
          <>
            {/* Left Column SVG Illustration */}
            <div className="lg:col-span-6 flex justify-center">
              <svg width="280" height="280" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background light shapes */}
                <circle cx="80" cy="110" r="60" fill="#14B8A6" fillOpacity="0.05" />
                {/* Board outline */}
                <rect x="50" y="30" width="110" height="140" rx="12" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round" />
                <path d="M50 45h110M50 145h110" stroke="#14B8A6" strokeWidth="1.5" strokeOpacity="0.3" />
                {/* Lines */}
                <line x1="70" y1="70" x2="110" y2="70" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round" />
                <line x1="70" y1="90" x2="130" y2="90" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round" />
                <line x1="70" y1="110" x2="120" y2="110" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round" />
                {/* Checked Circle */}
                <circle cx="140" cy="130" r="22" fill="#84CC16" fillOpacity="0.1" />
                <circle cx="140" cy="130" r="20" stroke="#84CC16" strokeWidth="3" />
                <path d="M132 130l5 5 10-10" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {/* Person Silhouette */}
                <circle cx="35" cy="90" r="10" stroke="#F97316" strokeWidth="2.5" />
                <path d="M15 125c0-10 8-18 18-18h4c10 0 18 8 18 18v10" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Right Column Form */}
            <div className="lg:col-span-6">
              <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-lg mx-auto shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {t('auth.signup.step2Title')}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  {t('auth.signup.step2Sub', { email })}
                </p>

                <form onSubmit={handleFinishSignup} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {t('auth.signup.firstName')}
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {t('auth.signup.lastName')}
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      {t('auth.signup.password')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                      {t('auth.signup.passwordHint')}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      {t('auth.signup.dob')}
                    </label>
                    <input
                      type="date"
                      id="dob"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">
                      {t('auth.signup.dobHint')}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      {t('auth.signup.status')}
                    </label>
                    <select
                      id="status"
                      required
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-white transition-all"
                    >
                      <option value="">{t('auth.signup.statusPlaceholder')}</option>
                      {['student', 'apprentice', 'professional', 'seeking', 'other'].map((opt) => (
                        <option key={opt} value={opt}>
                          {t(`auth.signup.statusOptions.${opt}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg text-sm transition-all duration-200 mt-2"
                  >
                    {t('auth.signup.finishBtn')}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
