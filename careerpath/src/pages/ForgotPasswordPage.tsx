import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isFr = i18n.language === 'fr';

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-800">
      <header className="border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xl font-bold tracking-tight text-primary">Fixam</span>
          <span className="text-base font-medium text-gray-800">Pathways</span>
        </a>

        <div className="flex items-center gap-6 text-sm font-semibold text-gray-650">
          <a href="/login" className="hover:text-primary transition-colors">
            Back to Login
          </a>
          <button
            onClick={() => i18n.changeLanguage(isFr ? 'en' : 'fr')}
            className="text-xs font-medium text-gray-500 hover:text-gray-800 ml-2"
          >
            {isFr ? 'EN' : 'FR'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
          
          {submitted ? (
            <div className="bg-teal-50 text-primary p-4 rounded-lg mt-6">
              <p className="text-sm font-medium">If an account exists for {email}, you will receive a password reset email shortly.</p>
              <p className="text-xs mt-2 opacity-80">Redirecting to login...</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
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
                <button
                  type="submit"
                  disabled={!email}
                  className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 text-white font-semibold py-3 px-6 rounded-lg text-sm transition-all duration-200"
                >
                  Send Reset Link
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
