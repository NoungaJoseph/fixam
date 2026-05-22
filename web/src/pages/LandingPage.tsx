import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Users,
  CheckCircle,
  MapPin,
  Star,
  Briefcase,
  Shield,
  Wrench,
  Droplet,
  Scissors,
  Package,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import PremiumNavbar from '../components/PremiumNavbar';

const CATEGORIES = [
  { icon: Wrench, label: 'Plumbing', count: '2,450+' },
  { icon: Zap, label: 'Electrical', count: '1,890+' },
  { icon: Droplet, label: 'Cleaning', count: '3,200+' },
  { icon: Scissors, label: 'Hair Salon', count: '1,560+' },
  { icon: Package, label: 'Delivery', count: '980+' },
  { icon: Briefcase, label: 'Carpenter', count: '1,340+' },
];

const STATS = [
  { value: '10K+', label: 'Verified Professionals', icon: Users },
  { value: '50K+', label: 'Tasks Completed', icon: CheckCircle },
  { value: '12', label: 'Cities Covered', icon: MapPin },
  { value: '4.8★', label: 'Average Rating', icon: Star },
];

const PROFESSIONALS = [
  {
    id: 1,
    name: 'Jeff Thomson',
    role: 'Plumbing Specialist',
    image: '/professionals/jeff.jpg',
    rating: 4.9,
    reviews: 324,
    distance: '0.8 km away',
    verified: true,
  },
  {
    id: 2,
    name: 'Samuel Bright',
    role: 'Electrician',
    image: '/professionals/samuel.jpg',
    rating: 4.7,
    reviews: 256,
    distance: '1.2 km away',
    verified: true,
  },
  {
    id: 3,
    name: 'Mary Clean',
    role: 'Cleaning Expert',
    image: '/professionals/mary.jpg',
    rating: 4.8,
    reviews: 502,
    distance: '0.5 km away',
    verified: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PremiumNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32 lg:py-40">
        {/* Background gradient and decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-teal-200 dark:bg-teal-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Left Content */}
            <motion.div variants={itemVariants}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-block px-4 py-2 bg-teal-50 dark:bg-teal-900/20 rounded-full mb-6"
              >
                <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">✨ Trusted Home Services Platform</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                Find Trusted{' '}
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Professionals
                </span>
                {' '}Near You
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Book verified electricians, plumbers, cleaners, delivery riders, and more in minutes. Get quality work done fast, safe, and hassle-free.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Get Started <ArrowRight size={20} className="ml-2" />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/providers"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Browse Professionals
                  </Link>
                </motion.div>
              </div>

              {/* Trust badges */}
              <motion.div className="flex items-center gap-6 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 border-2 border-white dark:border-slate-950"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Trusted by 50K+ users</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Join our growing community</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              variants={itemVariants}
              className="relative hidden md:block"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-blue-600/20 rounded-3xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-slate-700 rounded-xl shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-blue-400" />
                        <div className="flex-1">
                          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-24 mb-2" />
                          <div className="h-3 bg-slate-100 dark:bg-slate-500 rounded w-16" />
                        </div>
                        <CheckCircle size={20} className="text-teal-600 dark:text-teal-400" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 md:py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-center"
                >
                  <Icon className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Popular Services</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Find help for almost anything at home or office</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -8, boxShadow: '0 20px 48px -8px rgba(13,148,136,0.15)' }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500/10 to-blue-500/10 dark:from-teal-400/20 dark:to-blue-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={28} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{cat.label}</h3>
                  <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">{cat.count} professionals</p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/categories"
              className="inline-flex items-center text-teal-600 dark:text-teal-400 font-semibold hover:gap-2 transition-all"
            >
              View All Categories <ChevronRight size={20} className="ml-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">How Fixam Works</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Simple steps to get your work done</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { step: 1, title: 'Post a Task', desc: 'Tell us what you need' },
              { step: 2, title: 'Get Proposals', desc: 'Browse verified professionals' },
              { step: 3, title: 'Hire & Pay', desc: 'Choose your favorite pro' },
              { step: 4, title: 'Get It Done', desc: 'Relax while work is done' },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="relative">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all h-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold rounded-full mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
                {i < 3 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2"
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="text-teal-400 dark:text-teal-600" size={24} />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Top Professionals */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Top Rated Professionals</h2>
              <p className="text-slate-600 dark:text-slate-400">Meet our highest-rated service providers</p>
            </div>
            <Link to="/providers" className="hidden sm:flex items-center text-teal-600 dark:text-teal-400 font-semibold hover:gap-2 transition-all">
              View All <ChevronRight size={20} />
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {PROFESSIONALS.map((pro, i) => (
              <motion.div
                key={pro.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-teal-400/20 to-blue-400/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-400 to-blue-400" />
                  </div>
                  {pro.verified && (
                    <div className="absolute top-4 right-4 bg-teal-600 text-white rounded-full p-2">
                      <Shield size={16} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{pro.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{pro.role}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500" fill="currentColor" />
                      <span className="font-semibold text-slate-900 dark:text-white">{pro.rating}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">({pro.reviews})</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">📍 {pro.distance}</p>
                  <button className="w-full py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all">
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 bg-gradient-to-r from-teal-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Get Things Done?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl text-white/90 mb-10"
          >
            Join thousands of happy customers and verified professionals on Fixam
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-lg hover:bg-slate-100 transition-all"
            >
              Create Account
            </Link>
            <Link
              to="/register?role=provider"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
            >
              Become a Professional
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                FIXAM
              </h3>
              <p className="text-slate-400 text-sm">Empowering local professionals and making work effortless.</p>
            </div>

            {[
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Services', links: ['Browse Tasks', 'Categories', 'For Providers', 'Mobile App'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Safety', 'Refund Policy'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'Security'] },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400 text-sm">© 2026 Fixam. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-teal-600 flex items-center justify-center transition-colors"
                >
                  <span className="text-xs font-bold">f</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
