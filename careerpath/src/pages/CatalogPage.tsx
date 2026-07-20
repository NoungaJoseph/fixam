import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import DashboardNav from '../components/dashboard/DashboardNav';
import Footer from '../components/Footer';
import {
  Zap, Droplets, Hammer, Sparkles, Scissors, Paintbrush,
  Wrench, Leaf, Shirt, Utensils, GraduationCap, Construction,
  Clock, ChevronDown
} from 'lucide-react';

type CareerPath = {
  id: string;
  categoryKey: string;
  titleKey: string;
  icon: any;
  difficulty: 'beginner' | 'intermediate';
  hours: number;
  image: string;
  completed: boolean;
  isNew?: boolean;
};

export default function CatalogPage() {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Filters State
  const [quickFilter, setQuickFilter] = useState<'all' | 'new' | 'under60' | 'recommended' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Mock Career Paths Data
  const allPaths: CareerPath[] = [
    { id: '1', categoryKey: 'electrical', titleKey: 'dashboard.recommended.card1.title', icon: Zap, difficulty: 'intermediate', hours: 6, image: '/images/electrical.jpg', completed: false, isNew: true },
    { id: '2', categoryKey: 'plumbing', titleKey: 'dashboard.recommended.card2.title', icon: Droplets, difficulty: 'intermediate', hours: 5, image: '/images/plumbing.jpg', completed: false, isNew: true },
    { id: '3', categoryKey: 'carpentry', titleKey: 'trades.carpentry', icon: Hammer, difficulty: 'intermediate', hours: 7, image: '/images/carpentry.jpg', completed: false },
    { id: '4', categoryKey: 'cleaning', titleKey: 'trades.cleaning', icon: Sparkles, difficulty: 'beginner', hours: 3, image: '/images/cleaning.jpg', completed: true },
    { id: '5', categoryKey: 'beauty', titleKey: 'trades.beauty', icon: Scissors, difficulty: 'beginner', hours: 4, image: '/images/beauty.jpg', completed: false },
    { id: '6', categoryKey: 'painting', titleKey: 'trades.painting', icon: Paintbrush, difficulty: 'beginner', hours: 4, image: '/images/painting.jpg', completed: true },
    { id: '7', categoryKey: 'appliance', titleKey: 'trades.appliance', icon: Wrench, difficulty: 'intermediate', hours: 6, image: '/images/appliance.jpg', completed: false },
    { id: '8', categoryKey: 'gardening', titleKey: 'trades.gardening', icon: Leaf, difficulty: 'beginner', hours: 3, image: '/images/gardening.jpg', completed: false },
    { id: '9', categoryKey: 'tailoring', titleKey: 'trades.tailoring', icon: Shirt, difficulty: 'intermediate', hours: 8, image: '/images/tailoring.jpg', completed: false },
    { id: '10', categoryKey: 'catering', titleKey: 'trades.catering', icon: Utensils, difficulty: 'intermediate', hours: 5, image: '/images/catering.jpg', completed: false },
    { id: '11', categoryKey: 'tutoring', titleKey: 'trades.tutoring', icon: GraduationCap, difficulty: 'beginner', hours: 3, image: '/images/tutoring.jpg', completed: false },
    { id: '12', categoryKey: 'handyman', titleKey: 'trades.handyman', icon: Construction, difficulty: 'beginner', hours: 4, image: '/images/handyman.jpg', completed: false },
  ];

  // Filtering Logic
  const filteredPaths = allPaths.filter((path) => {
    // 1. Quick Filters
    if (quickFilter === 'new' && !path.isNew) return false;
    if (quickFilter === 'under60') {
      // Under 60 minutes translates to under 4 hours for our trade simulation duration scale
      if (path.hours > 4) return false;
    }
    if (quickFilter === 'recommended' && path.difficulty !== 'intermediate') return false;
    if (quickFilter === 'completed' && !path.completed) return false;

    // 2. Dropdown Category Filter
    if (selectedCategory !== 'all' && path.categoryKey !== selectedCategory) return false;

    // 3. Dropdown Level Filter
    if (selectedLevel !== 'all' && path.difficulty !== selectedLevel) return false;

    // 4. Dropdown Duration Filter
    if (selectedDuration !== 'all') {
      if (selectedDuration === 'short' && path.hours > 4) return false;
      if (selectedDuration === 'long' && path.hours <= 4) return false;
    }

    return true;
  });

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [quickFilter, selectedCategory, selectedLevel, selectedDuration]);

  // Pagination bounds
  const itemsPerPage = 8;
  const totalItems = filteredPaths.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedPaths = filteredPaths.slice(startIndex, endIndex);

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-800">
      <DashboardNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-850 tracking-tight">
            {t('catalog.title')}
          </h1>
          <p className="mt-2 text-base text-gray-500 max-w-3xl leading-relaxed">
            {t('catalog.subtitle')}
          </p>
        </div>

        {/* Filters Bar */}
        <div className="space-y-4 mb-8">
          <div>
            <span className="block text-xs font-bold text-gray-400 tracking-wider mb-2">
              {t('catalog.quickFilters')}
            </span>
            <div className="flex flex-wrap gap-2">
              {(['all', 'new', 'under60', 'recommended', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setQuickFilter(filter)}
                  className={`text-xs font-semibold py-2 px-4 rounded-full border transition-all duration-200 ${
                    quickFilter === filter
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {t(`catalog.filters.${filter}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Second Row: Dropdown Selects */}
          <div className="flex flex-wrap gap-3">
            {/* Category dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-200 hover:border-gray-300 rounded-full py-2 pl-4 pr-10 text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="all">{t('catalog.dropdowns.category')}: {t('catalog.dropdowns.all')}</option>
                {['electrical', 'plumbing', 'carpentry', 'cleaning', 'beauty', 'painting', 'appliance', 'gardening', 'tailoring', 'catering', 'tutoring', 'handyman'].map((key) => (
                  <option key={key} value={key}>{t(`trades.${key}`)}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Level dropdown */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none bg-white border border-gray-200 hover:border-gray-300 rounded-full py-2 pl-4 pr-10 text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="all">{t('catalog.dropdowns.skillLevel')}: {t('catalog.dropdowns.all')}</option>
                <option value="beginner">{t('carousel.difficulty.beginner')}</option>
                <option value="intermediate">{t('carousel.difficulty.intermediate')}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Duration dropdown */}
            <div className="relative">
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="appearance-none bg-white border border-gray-200 hover:border-gray-300 rounded-full py-2 pl-4 pr-10 text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="all">{t('catalog.dropdowns.duration')}: {t('catalog.dropdowns.all')}</option>
                <option value="short">≤ 4 hours</option>
                <option value="long">&gt; 4 hours</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Count Line */}
        <div className="mb-6 text-sm text-gray-500 font-medium">
          {t('catalog.displaying', {
            start: totalItems > 0 ? startIndex + 1 : 0,
            end: endIndex,
            total: totalItems
          })}
        </div>

        {/* Cards Grid */}
        {totalItems > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedPaths.map((path) => {
              const Icon = path.icon;
              return (
                <Link
                  key={path.id}
                  to={`/career-paths/${path.categoryKey}`}
                  className="bg-white border border-gray-250 rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:border-primary hover:shadow-sm cursor-pointer"
                >
                  {/* Card Image */}
                  <div className="relative w-full h-36 bg-gray-100 flex-shrink-0">
                    <img
                      src={path.image}
                      alt={t(path.titleKey)}
                      className="w-full h-full object-cover"
                    />
                    {path.completed && (
                      <span className="absolute top-3 right-3 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        {t('catalog.completedBadge')}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Logo icon */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          {t(`trades.${path.categoryKey}`)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-gray-800 leading-snug mb-3">
                        {t(path.titleKey)}
                      </h3>
                    </div>

                    {/* Metadata line */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-2 border-t border-gray-100 pt-3">
                      <span className="flex items-center gap-0.5 text-gray-500">
                        {path.difficulty === 'beginner' ? (
                          <>
                            <span className="text-primary">●</span>
                            <span className="text-gray-250">●</span>
                            <span className="text-gray-250">●</span>
                          </>
                        ) : (
                          <>
                            <span className="text-primary">●</span>
                            <span className="text-primary">●</span>
                            <span className="text-gray-250">●</span>
                          </>
                        )}
                        <span className="ml-1 text-[11px]">
                          {path.difficulty === 'beginner' ? t('carousel.difficulty.beginner') : t('carousel.difficulty.intermediate')}
                        </span>
                      </span>

                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {path.hours}h
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium">No career paths found matching your filter criteria.</p>
            <button
              onClick={() => {
                setQuickFilter('all');
                setSelectedCategory('all');
                setSelectedLevel('all');
                setSelectedDuration('all');
              }}
              className="mt-4 text-xs font-semibold text-primary underline underline-offset-2"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination block */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-12 mb-16">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40 disabled:pointer-events-none hover:border-gray-300"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40 disabled:pointer-events-none hover:border-gray-300"
            >
              ›
            </button>
          </div>
        )}

        {/* Informational FAQ blocks */}
        <div className="space-y-6 pt-8 border-t border-gray-200">
          {/* FAQ Block 1 */}
          <div className="bg-teal-50/20 border border-teal-100 rounded-xl p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              {t('catalog.faq.q1')}
            </h2>
            <p className="text-sm sm:text-base text-gray-650 leading-relaxed mb-5">
              {t('catalog.faq.a1')}
            </p>
            <ul className="space-y-2.5 text-sm sm:text-base text-gray-655 pl-5 list-disc">
              {((t('catalog.faq.a1Bullets', { returnObjects: true }) as any) || []).map((bullet: string, idx: number) => (
                <li key={idx} className="leading-relaxed">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Block 2 */}
          <div className="bg-orange-50/20 border border-orange-100 rounded-xl p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              {t('catalog.faq.q2')}
            </h2>
            <p className="text-sm sm:text-base text-gray-650 leading-relaxed mb-5">
              {t('catalog.faq.a2')}
            </p>
            <ul className="space-y-2.5 text-sm sm:text-base text-gray-655 pl-5 list-disc">
              {((t('catalog.faq.a2Bullets', { returnObjects: true }) as any) || []).map((bullet: string, idx: number) => (
                <li key={idx} className="leading-relaxed">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
