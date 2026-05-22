import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COLORS, GRADIENTS } from '../theme/colors';
import { SPACING, BORDER_RADIUS_PRESETS } from '../theme/spacing';

type ThemeMode = 'light' | 'dark';

interface NavLink {
  label: string;
  href: string;
  submenu?: NavLink[];
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Find Professionals', href: '/providers' },
  { label: 'Categories', href: '/categories' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About', href: '#about' },
];

export default function PremiumNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const isActive = (href: string) => location.pathname === href;

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? `bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-md`
          : `bg-white dark:bg-slate-950`
      }`}
      initial={false}
      animate={{ boxShadow: isScrolled ? `0 1px 3px rgba(0,0,0,0.1)` : 'none' }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0 group"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
          >
            FIXAM
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link, i) => (
            <motion.div
              key={link.href}
              custom={i}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              className="relative group"
            >
              <Link
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-teal-600 dark:text-teal-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {link.label}
                {link.submenu && <ChevronDown size={14} className="inline ml-1" />}
              </Link>

              {/* Underline animation */}
              {isActive(link.href) && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-600 to-blue-600"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>

          {/* Auth Buttons / User Menu */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/home" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all">
                  Dashboard
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-400"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: mobileMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800"
      >
        <div className="px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {!user && (
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-center rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-center rounded-lg font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
}
