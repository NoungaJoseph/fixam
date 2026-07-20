import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isFr = i18n.language === 'fr';

  const navLinks = [
    { key: 'careerPaths', href: '#career-paths' },
    { key: 'howItWorks', href: '#how-it-works' },
    { key: 'forProviders', href: '/for-providers' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xl font-bold tracking-tight text-primary">
              Fixam
            </span>
            <span className="text-base font-medium text-gray-800">
              Pathways
            </span>
          </Link>

          {/* Center-right: Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isAnchor = link.href.startsWith('#');
              return isAnchor ? (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-sm font-normal text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  {t(`nav.${link.key}`)}
                </a>
              ) : (
                <Link
                  key={link.key}
                  to={link.href}
                  className="text-sm font-normal text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  {t(`nav.${link.key}`)}
                </Link>
              );
            })}
          </div>

          {/* Far right: Lang toggle + buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => i18n.changeLanguage(isFr ? 'en' : 'fr')}
              className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors px-2 py-1"
            >
              {isFr ? 'EN' : 'FR'}
            </button>

            <Link
              to="/signup"
              className="text-sm font-medium bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-full transition-colors duration-200"
            >
              {t('nav.signUp')}
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 border border-gray-300 hover:border-primary hover:text-primary px-5 py-2 rounded-full transition-colors duration-200"
            >
              {t('nav.signIn')}
            </Link>
          </div>

          {/* Mobile: hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => i18n.changeLanguage(isFr ? 'en' : 'fr')}
              className="text-xs font-medium text-gray-500 px-2 py-1"
            >
              {isFr ? 'EN' : 'FR'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-gray-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white py-4 px-4 space-y-2">
          {navLinks.map((link) => {
            const isAnchor = link.href.startsWith('#');
            return isAnchor ? (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-normal text-gray-700 hover:text-primary transition-colors"
              >
                {t(`nav.${link.key}`)}
              </a>
            ) : (
              <Link
                key={link.key}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-normal text-gray-700 hover:text-primary transition-colors"
              >
                {t(`nav.${link.key}`)}
              </Link>
            );
          })}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            <Link
              to="/signup"
              className="w-full text-center text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full"
            >
              {t('nav.signUp')}
            </Link>
            <Link
              to="/login"
              className="w-full text-center text-sm font-medium text-gray-700 border border-gray-300 px-5 py-2.5 rounded-full"
            >
              {t('nav.signIn')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
